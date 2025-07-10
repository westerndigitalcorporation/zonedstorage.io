---
id: dm-zoned
title: dm-zoned
sidebar_label: dm-zoned
---

import Image from '/src/components/Image';

# dm-zoned

The *dm-zoned* device mapper target provides random write access to zoned
block devices. It hides the sequential write constraint of host-managed zoned
block devices from the device user (the "device user", in this context, is a
file system or an application accessing a raw block device). This allows the use
of applications and file systems that do not have native zoned block device
support.

File systems or applications that can natively support host-managed zoned
block devices, e.g. the [*XFS*](/docs/filesystems/xfs) or
[*BTRFS*](/docs/filesystems/btrfs) file systems, do not need to use the
*dm-zoned* device mapper target.

:::warning
The use of the *dm-zoned* target is not recommended due to its unpredictable
performance characteristics. Users should instead consider solutions based on
file systems including native zoned block device support as a replacement
(e.g. the [*XFS*](/docs/filesystems/xfs) or [*BTRFS*](/docs/filesystems/btrfs)
file systems).
:::

## Design Overview

*dm-zoned* implements an on-disk write buffering scheme to handle random
write accesses to sequential write required zones of a zoned block device.
Conventional zones of the backend device are used for buffering random
accesses, as well as for storing internal metadata.

The figure below illustrates the *dm-zoned* zone-usage principle.

<Image src="linux-dm-zoned.png"
title="Zone mapping overview of the dm-zoned device mapper target"/>

Optionally, since Linux kernel version 5.8.0, an additional regular block
device can be used to provide randomly writable storage, replacing the
conventional zones of the backend zoned block device for write buffering. With
this new version of *dm-zoned*, multiple zoned block devices can also be used
to increase performance.

All zones of the device(s) used to back a *dm-zoned* target are separated into
2 types:

1. **Metadata zones** These are randomly-writable zones that are used to store 
   metadata.  Randomly writable zones may be conventional zones or sequential
   write preferred zones (host-aware devices only). Metadata zones are not
   reported as usable capacity to the user. If an additional regular block 
   device is used for write buffering, metadata zones are stored on this 
   cache device.

2. **Data zones** All remaining zones of the device. The majority of these zones
   are sequential zones, which are used exclusively for storing user data. 
   The conventional zones (or part of the sequential-write-preferred zones
   on a host-aware device) may be used also for buffering user random writes.
   User data may thus be stored either in conventional zone or in a sequential
   zone.

As shown in the above figure, the target device is divided into chunks that
have the same size as the zones of the backing zoned devices. A logical chunk
can be mapped to zones of the backing device in different ways.

1. **Conventional or cache zone mapping** This is the case for chunk *A* in the
   figure, which is mapped to the conventional zone *C<sub>A</sub>*. This is the
   default mapping that is initialized when the first write command is issued 
   to an empty (unwritten) chunk. As long as a chunk is mapped to a 
   conventional zone, any incoming write request can be directly executed 
   using the mapped conventional zone.
2. **Sequential zone mapping** A chunk can be mapped initially to a
   sequential zone, as shown for the chunk *C* (mapped to the sequential zone
   *S<sub>C</sub>* in the figure). With such a mapping, an already-written 
   block of the chunk cannot be modified directly. To handle this case, the 
   next mapping type is used.
3. **Dual conventional-sequential zone mapping** Temporarily add a conventional
   zone to the chunk mapping when you need to update data in an already-written
   block of a chunk that has been mapped to a sequential zone. Any write 
   that targets a written block will be processed using the conventional 
   zone instead of the sequential zone.

*dm-zoned* metadata include a set of bitmaps to track the validity state of
blocks in the zones of the backing device. Any write-operation execution is
always followed by an update to the bitmaps, to mark the written blocks as
valid. In the case of the dual conventional-sequential chunk mapping, the
bitmap for the blocks of the sequential zone is updated to clear the bits
that represent the blocks that have been updated with a write in the
conventional zone. By doing this, incoming reads always have access to the
latest version of the block data simply by inspecting the block validity
bitmaps.

## On-Disk Format

*dm-zoned* exposes a logical device with a sector size of 4096 bytes,
regardless of the physical-sector size of the zoned block device that is 
used as a backend . This reduces the amount of metadata needed to manage valid
blocks (blocks written). The on-disk metadata format is as follows:

1. **Super Block**: The first block of the first randomly-writable zone that is
found contains the super block, which describes the amount and position (on
the disk) of metadata blocks. 

2. **Mapping-table blocks**: After the super block, there is a set of blocks 
that describes the mapping of (1) the logical chunks of the target logical 
device to (2) data zones. The mapping is indexed by logical chunk number, and 
each mapping entry indicates the data zone that stores the chunk data. 
It can also indicate the zone number of a random zone that is used to 
buffer random modifications to the chunk data.

3. **Bitmap-storage blocks**: After the mapping-table blocks, there is a set of 
blocks used to store bitmaps that indicate the validity of blocks in 
the data zones. A valid block is any block that was written and not discarded. 
In a buffered data zone, a block can be valid only (1) in the data zone or (2)
in the buffer zone.

The device-mapper subsystem uses two sets of metadata zones, to protect
internal metadata against corruption in cases of sudden power loss or system
crashes. One set (the primary set) is used as the main metadata set. The other
set (the secondary set) is used as a log. Modified metadata are first written
to the secondary set. The log that is created by writing to the secondary set 
is validated by writing an updated super block in the secondary set. After 
this log operation completes, the primary metadata set is updtaed.  This 
ensures that one of the sets is always correct.

Flush operations are used as a commit point: when a flush operation is
received, metadata activity is temporarily stopped, all dirty metadata 
is logged and updated, and then normal operation resumes. Flush operations 
temporarily delay write requests and discard requests. Read requests can be 
processed while metadata logging is executed.

## Read-Write Processing

In logical chunks that are mapped to random data zones, all write operations
are processed by writing directly to the data zones. If the mapping zone is
mapped to a sequential zone, the write operation is processed directly only if
the write offset within the logical chunk is equal to the write pointer offset
within the sequential data zone (i.e. the write operation is aligned on the
zone write pointer). Otherwise, write operations are processed indirectly,
using a buffer zone: a randomly writable free data zone is allocated and
assigned to the chunk that is being accessed in addition to the already-mapped
sequential data zone. Writing blocks to the buffer zone will invalidate the
same blocks in the sequential data zone.

Read operations are processed according to the block validity information
provided by the bitmaps: valid blocks are read either from the data zone or,
if the data zone is buffered, from the buffer zone that is assigned to the data zone.

## Random Zone Reclaim

After some time, the limited number of available random zones may be exhausted,
making unaligned writes to unbuffered zones impossible. To avoid this
situation, a reclaim process regularly scans used random zones and tries to
"reclaim" them by (sequentially) copying the valid blocks of the buffer zone to
a free sequential zone. Once the copy completes, the chunk mapping is updated
to point to the sequential zone and the buffer zone is freed for reuse.

## Userspace Tool

The *dmzadm* command-line utility is used to format backend zoned devices for
use with the *dm-zoned* device mapper target. This utility verifies the
device zone model and prepares and writes on-disk *dm-zoned* metadata
according to the device's capacity and zone size.

The source code for the *dmzadm* utility is available as part of
the <a href="https://github.com/westerndigitalcorporation/dm-zoned-tools"
target="_blank">*dm-zoned-tools* project hosted on GitHub</a>.
The project <a href="https://github.com/westerndigitalcorporation/dm-zoned-tools/blob/master/README.md"
target="_blank">*README* file</a> provides instructions on how to compile and
install the utility.

:::note
The *dm-zoned-tools* project was formerly hosted on GitHub as part of
the <a href="https://github.com/hgst" target="_blank">HGST organization</a>.
*dm-zoned-tools* repository has since then moved to
the <a href="https://github.com/westerndigitalcorporation/"
target="_blank">Western Digital Corporation organization on GitHub</a>.
:::

*dmzadm* detailed usage is as follows.

```plaintext
# dmzadm --help
dmzadm allows formatting, checking and repairing
a zoned block device for use with the dm-zoned
device mapper.
Usage: dmzadm <operation> <device(s)> [options]
Operations
  --help | -h   : General help message
  --format      : Format a block device metadata
  --check       : Check a block device metadata
  --repair      : Repair a block device metadata
  --start       : Start the device-mapper target
  --stop        : Stop the device-mapper target
Devices
  For a single device target, a zoned block device
  must be specified. For a multi-device target, a
  a list of block devices must be specified, with
  a regular block device as the first device specified,
  followed by one or more zoned block devices.
General options
  --verbose     : Verbose output
  --vverbose    : Very verbose output
Format operation options
  --force       : Force overwrite of existing content
  --label=<str> : Set the target label name to <str>
  --seq=<num>   : Number of sequential zones reserved
                  for reclaim. The minimum is 1 and the
                  default is 16
```

## Formatting a Target Device

Formatting a single device target is done using the following command:

```plaintext
# dmzadm --format /dev/<disk name>
```

where `/dev/<disk name>` identifies the backend zoned block device to use. An
example execution using a SMR hard-disk is shown below:

```plaintext
# dmzadm --format /dev/sdi
/dev/sdi: 29297213440 512-byte sectors (13970 GiB)
  Host-managed device
  55880 zones, offset 0
  55880 zones of 524288 512-byte sectors (256 MiB)
  65536 4KB data blocks per zone
Resetting sequential zones
Writing primary metadata set
  Writing mapping table
  Writing bitmap blocks
  Writing super block to sdi block 0
Writing secondary metadata set
  Writing mapping table
  Writing bitmap blocks
  Writing super block to sdi block 131072
Syncing disk
Done.
```
As of Linux kernel v5.8.0, *dm-zoned* can use regular block devices (such as
SSDs) together with zoned block devices. In this case, conventional zones are
emulated (so that the regular block device can hold *dm-zoned* metadata and
buffering data). When a regular block device is used, the zone-reclaim process
operates by copying data from emulated conventional zones on the regular block
device to zones of the zoned block device. This dual-drive configuration can
significantly increase the performance of the target device under
write-intensive workloads.

Use the following command to format a *dm-zoned* target device that uses an
additional regular block device (and, optionally, several zoned-block devices):

```plaintext
# dmzadm --format /dev/nvme2n1 /dev/sdi
/dev/nvme2n1: 976773168 512-byte sectors (465 GiB)
  Regular block device
  1864 zones, offset 0
/dev/sdi: 29297213440 512-byte sectors (13970 GiB)
  Host-managed device
  55880 zones, offset 122159104
  57743 zones of 524288 512-byte sectors (256 MiB)
  1 runt zone of 24624 512-byte sectors (12 MiB)
  65536 4KB data blocks per zone
Resetting sequential zones
Writing primary metadata set
  Writing mapping table
  Writing bitmap blocks
  Writing super block to nvme2n1 block 0
Writing secondary metadata set
  Writing mapping table
  Writing bitmap blocks
  Writing super block to nvme2n1 block 131072
Writing tertiary metadata
  Writing super block to sdi block 0
Syncing disk
Syncing disk
Done.
```

(In this example `/dev/nvme2n1` is a NVMe SSD and `/dev/sdi` is a host-managed SMR hard-disk.)

## Activating a Target Device

Start the *dm-zoned* target device (that is using a formatted zoned device or
set of devices) by running *dmzadm* with the `--start` command:

```plaintext
# dmzadm --start /dev/sdi
/dev/sdi: 29297213440 512-byte sectors (13970 GiB)
  Host-managed device
  55880 zones, offset 0
  55880 zones of 524288 512-byte sectors (256 MiB)
  65536 4KB data blocks per zone
sdi: starting dmz-sdi uuid 8c505b4b-d1e9-47a7-8e3a-8b1c00317eaf
```

Confirm the target's activation by looking at the kernel messages:

```plaintext
# dmesg
...
device-mapper: zoned metadata: (dmz-sdi): DM-Zoned metadata version 2
device-mapper: zoned metadata: (sdi): Host-managed zoned block device
device-mapper: zoned metadata: (sdi):   29297213440 512-byte logical sectors (offset 0)
device-mapper: zoned metadata: (sdi):   55880 zones of 524288 512-byte logical sectors (offset 0)
device-mapper: zoned metadata: (dmz-sdi):   55880 zones of 524288 512-byte logical sectors
device-mapper: zoned: (dmz-sdi): Target device: 29286727680 512-byte logical sectors (3660840960 blocks)
```

The target device that was created is a regular disk that can be used with any
file system.

```plaintext
# cat /sys/block/dm-0/queue/zoned
none
# mkfs.ext4 /dev/dm-0
mke2fs 1.45.5 (07-Jan-2020)
Discarding device blocks: done                            
Creating filesystem with 3660840960 4k blocks and 457605120 inodes
Filesystem UUID: d49ed278-5bca-46c4-8ce2-cec263dd060c
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
	4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
	102400000, 214990848, 512000000, 550731776, 644972544, 1934917632, 
	2560000000

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done

# mount /dev/dm-0 /mnt
# ls -l /mnt
total 16
drwx------ 2 root root 16384 Aug 27 15:14 lost+found
```

For a multi-device target, you must specify the same list of devices that you
specified when you formatted them:

```plaintext
# dmzadm --start /dev/nvmen2p1 /dev/sdi
/dev/nvme2n1: 976773168 512-byte sectors (465 GiB)
  Regular block device
  1864 zones, offset 0
/dev/sdi: 29297213440 512-byte sectors (13970 GiB)
  Host-managed device
  55880 zones, offset 122159104
  57743 zones of 524288 512-byte sectors (256 MiB)
  1 runt zone of 24624 512-byte sectors (12 MiB)
  65536 4KB data blocks per zone
nvme2n1: starting dmz-nvme2n1 uuid ffbd1a3a-d79b-4d7f-bc13-e475a157bc39
```                                                          

Check the kernel messages to confirm the activation of the target device. This
is similar to confirming target-device activiation in the single-device case.

```plaintext
device-mapper: zoned metadata: (dmz-nvme2n1): DM-Zoned metadata version 2
device-mapper: zoned metadata: (nvme2n1): Regular block device
device-mapper: zoned metadata: (nvme2n1):   976773168 512-byte logical sectors (offset 0)
device-mapper: zoned metadata: (nvme2n1):   1864 zones of 524288 512-byte logical sectors (offset 0)
device-mapper: zoned metadata: (sdi): Host-managed zoned block device
device-mapper: zoned metadata: (sdi):   29297213440 512-byte logical sectors (offset 977272832)
device-mapper: zoned metadata: (sdi):   55880 zones of 524288 512-byte logical sectors (offset 1864)
device-mapper: zoned metadata: (dmz-nvme2n1):   57744 zones of 524288 512-byte logical sectors
device-mapper: zoned: (dmz-nvme2n1): Target device: 30264000512 512-byte logical sectors (3783000064 blocks)
```

## Stopping a Target Device

Use the `--stop` operation to disable a *dm-zoned* target device: 

```plaintext
# dmzadm --stop /dev/sdX
```

For a multi-device target, you must specify the same list of devices that you
specified when you formatted them.
