---
id: dm
title: Device Mapper
sidebar_label: Device Mapper
---

import Image from '/src/components/Image';

# Device Mapper

Zoned block device support was added to the device mapper subsystem in kernel
version 4.13. Two existing targets gained support: the *dm-linear* target and
the *dm-flakey* target. ZBD support also added a new target driver, *dm-zoned*.

## dm-linear

The *dm-linear* target maps a linear range of blocks of the device-mapper device
onto a linear range on a backend device. *dm-linear* is the basic building
block of logical volume managers like <a href="http://www.sourceware.org/lvm2/"
target="_blank">*LVM*</a>.

### Zoned Block Device Restrictions

When used with zoned block devices, the *dm-linear* device that is created will
also be a zoned block device with the same zone size as the underlying device.
Several conditions are enforced by the device-mapper core-management code
during the creation of a *dm-linear* target device.

* All backend devices used to map different ranges of the target device must
  have the same zone model.
* If the backend devices are zoned block devices, all devices must have the same
  zone size.
* The mapped ranges must be zone aligned, that is, partial zone mapping is not
  possible.

### Example: Creating a Small Host Managed Disk

This example illustrates how to create a small host-managed disk that uses zone
ranges from a large high capacity host-managed disk. The zone information of
the backend device used is shown below.

```plaintext
# cat /sys/block/sdb/queue/zoned
host-managed
# cat /sys/block/sdb/queue/chunk_sectors
524288
# blkzone report /dev/sdb
  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  ...
  start: 0x010580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010600000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010680000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010700000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  ...
  start: 0x6d2300000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x6d2380000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

To create a *dm-linear* device named "small-sdb" that joins the first 5
conventional zones of the backend device with the first 10 sequential zones,
use the following command.

```plaintext
# echo "0 2621440 linear /dev/sdb 0
2621440 5242880 linear /dev/sdb 274726912" | dmsetup create small-sdb
```

The resulting device zone model is host-managed and has 15 zones, as shown
below.

```plaintext
# cat /sys/block/dm-0/queue/zoned
host-managed
# cat /sys/block/dm-0/queue/chunk_sectors
524288
# blkzone report /dev/dm-0
  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000200000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000280000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000480000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000500000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000600000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000680000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000700000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

The following shows a script that facilitates the creation of *dm-linear*
devices using zone ranges from a single zoned block device. Such small zoned
block devices can be used to test application limits (e.g. Disk full
conditions).

```bash
#!/bin/bash

if [ $# -ne 3 ]; then
	echo "Usage: $0 <disk> <num conv zones> <num seq zones>"
	exit 1
fi

disk="$1"
nrconv=$2
nrseq=$3
dname="$(basename ${disk})"

# Linear table entries: "start length linear device offset"
# start: starting block in virtual device
# length: length of this segment
# device: block device, referenced by the device name or by major:minor
# offset: starting offset of the mapping on the device

convlen=$(( nrconv * 524288 ))
seqlen=$(( nrseq * 524288 ))

if [ ${convlen} -eq 0 ] && [ ${seqlen} -eq 0 ]; then
	echo "0 zones..."
	exit 1
fi

seqofst=$(blkzone report "$1" | grep "SEQ_WRITE_REQUIRED" |
	  head -n1 | cut -f1 -d',' | cut -f2 -d':' | xargs printf "%d\n")

if [ ${convlen} -gt ${seqofst} ]; then
	nrconv=$(( seqofst / 524288 ))
	echo "Too many conventional zones requested: truncating to $nrconv"
	convlen=${seqofst}
fi

if [ ${convlen} -eq 0 ]; then
	echo "0 ${seqlen} linear ${disk} ${seqofst}" | dmsetup create small-${dname}
elif [ ${seqlen} -eq 0 ]; then
	echo "0 ${convlen} linear ${disk} 0" | dmsetup create small-${dname}
else
	echo "0 ${convlen} linear ${disk} 0
	${convlen} ${seqlen} linear ${disk} ${seqofst}" | dmsetup create small-${dname}
fi
```

### Example: Conventional Zones as a Regular Disk

*dm-linear* can also be used to aggregate a zoned block device's conventional
zones together into a target device that will be usable as a regular disk
(conventional zones can be randomly written). Reusing the previous example
backend disk, 524 conventional zones of 524288 sectors (512 B unit) are
available. The following command creates a *dm-linear* device joining all
conventional zones together.

```plaintext
# echo "0 274726912 linear /dev/sdb 0" | dmsetup create small-sdb
```

The target device is again a host-managed disk but contains only conventional
zones.

```plaintext
# cat /sys/block/dm-0/queue/zoned
host-managed
# cat /sys/block/dm-0/queue/chunk_sectors
524288
# blkzone report /dev/dm-0
  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  ...
  start: 0x010500000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
```

Because this zoned block device is composed entirely of conventional zones, all
sectors are randomly writable and can therefore be used directly with any file
system.

```plaintext
# mkfs.ext4 /dev/dm-0
mke2fs 1.44.6 (5-Mar-2019)
Creating filesystem with 34340864 4k blocks and 8585216 inodes
Filesystem UUID: 3957429a-5dab-4b30-9797-f9736036a47b
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
	4096000, 7962624, 11239424, 20480000, 23887872

Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done

# mount /dev/dm-0 /mnt
# ls -l /mnt
total 16
drwx------ 2 root root 16384 May 21 17:03 lost+found
```

Applications that need frequent random updates to their metadata can use such
setups to facilitate the implementation of a complex metadata structure. The
remaining sequential zones of the disk can be used directly by the application
to store data.

## dm-flakey

The *dm-flakey* target is similar to the *dm-linear* target, except that it
periodically exhibits unreliable behavior. This target is useful for simulating
failing devices during testing. In the case of zoned block devices,
simulating write errors to sequential zones can help to debug application
write-pointer management.

*dm-flakey* works like this: at the time the table is loaded, the device does
not generate errors for some seconds (*up* time), but then exhibits unreliable
behavior for *down* seconds. This cycle then repeats.

### Error modes

Several error-simulation behaviors can be configured.

* **drop_writes** All write I/Os are silently ignored and dropped. Read I/Os
  are handled correctly.
* **error_writes** All write I/Os are failed with an error signaled. Read I/Os
  are handled correctly.
* **corrupt_bio_byte** During the *down* time, replace the Nth byte of the
  data of each read or write block I/O with a specified value.

The default error mode is to fail all I/O requests during the *down* time of the
simulation cycle.

### Zoned Block Device Restrictions

The same restrictions apply that applied for the *dm-linear* target.

### Examples

*dm-linear* detailed documentation and usage examples can be found in the kernel
source code documentation file <a href="https://github.com/torvalds/linux/blob/master/Documentation/device-mapper/dm-flakey.txt"
target="_blank">Documentation/device-mapper/dm-flakey.txt</a>.

## dm-zoned

The *dm-zoned* device mapper target provides random write access to zoned
block devices (ZBC and ZAC compliant devices). It hides the sequential write constraint of host-managed zoned block devices from the device user (the "device user", in this context, is a file system or an application accessing a raw block device). This allows the use of applications and file systems that do not have native zoned block device support.

File systems or applications that can natively support host-managed zoned
block devices (e.g. the f2fs file system since kernel 4.10) do not need to use
the *dm-zoned* device mapper target.

### Design Overview

*dm-zoned* implements an on-disk write buffering scheme to handle random
write accesses to sequential write required zones of a zoned block device.
Conventional zones of the backend device are used for buffering random
accesses, as well as for storing internal metadata.

The figure below illustrates the *dm-zoned* zone-usage principle.

<Image src="linux-dm-zoned.png"
title="Zone mapping overview of the dm-zoned device mapper target"/>

Optionally, since Linux kernel version 5.8.0, an additional regular block
device can be used to provide randomly writable storage, replacing  
the conventional zones of the backend zoned block device for write buffering.
With this new version of *dm-zoned*, multiple zoned block devices can also be
used to increase performance.

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

### On-Disk Format

*dm-zoned* exposes a logical device with a sector size of 4096 bytes,
irrespectively of the physical sector size of the backend zoned block device
being used. This allows reducing the amount of metadata needed to manage valid
blocks (blocks written). The on-disk metadata format is as follows:

1. The first block of the first randomly writable zone found contains the
super block which describes the amount and position on disk of metadata blocks. 

2. Following the super block, a set of blocks is used to describe the mapping
of the logical chunks of the target logical device to data zones. The mapping
is indexed by logical chunk number and each mapping entry indicates the data
zone storing the chunk data and optionally the zone number of a random zone
used to buffer random modification to the chunk data.

3. A set of blocks used to store bitmaps indicating the validity of blocks in
the data zones follows the mapping table blocks. A valid block is a block that
was writen and not discarded. For a buffered data zone, a block can be valid
only in the data zone or in the buffer zone.

To protect internal metadata against corruption in case of sudden power loss or
system crash, two sets of metadata zones are used. One set, the primary set, is
used as the main metadata set, while the secondary set is used as a log.
Modified metadata are first written to the secondary set and the log so created
validated by writing an updated super block in the secondary set. Once this log
operation completes, updates in place of metadata blocks can be done in the
primary metadata set, ensuring that one of the set is always correct.
Flush operations are used as a commit point: upon reception of a flush
operation, metadata activity is temporarily stopped, all dirty metadata logged
and updated and normal operation resumed. This only temporarily delays write and
discard requests. Read requests can be processed while metadata logging is
executed.

### Read-Write Processing

For a logical chunk mapped to a random data zone, all write operations are
processed by directly writing to the data zone. If the mapping zone is to a
sequential zone, the write operation is processed directly only and only if
the write offset within the logical chunk is equal to the write pointer offset
within of the sequential data zone (i.e. the write operation is aligned on the
zone write pointer). Otherwise, write operations are processed indirectly using 
a buffer zone: a randomly writable free data zone is allocated and assigned
to the chunk being accessed in addition to the already mapped sequential data
zone. Writing block to the buffer zone will invalidate the same blocks in the
sequential data zone.

Read operations are processed according to the block validity information
provided by the bitmaps: valid blocks are read either from the data zone or,
if the data zone is buffered, from the buffer zone assigned to the data zone.

### Random Zone Reclaim

After some time, the limited number of random zones available may be exhausted
and unaligned writes to unbuffered zones become impossible. To avoid such
situation, a reclaim process regularly scans used random zones and try to
"reclaim" them by copying (sequentially) the valid blocks of the buffer zone
to a free sequential zone. Once the copy completes, the chunk mapping is
updated to point to the sequential zone and the buffer zone freed for reuse.

To protect internal metadata against corruption in case of sudden power loss or
system crash, 2 sets of metadata zones are used. One set, the primary set, is
used as the main metadata repository, while the secondary set is used as a log.
Modified metadata are first written to the secondary set and the log so created
validated by writing an updated super block in the secondary set. Once this log
operation completes, updates in place of metadata blocks can be done in the
primary metadata set, ensuring that one of the set is always correct.
Flush operations are used as a commit point: upon reception of a flush
operation, metadata activity is temporarily stopped, all dirty metadata logged
and updated and normal operation resumed. This only temporarily delays write
and discard requests. Read requests can be processed while metadata logging is
executed.

### Userspace Tool

The *dmzadm* command line utility is used to format backend zoned devices for
use with the *dm-zoned* device mapper target. This utility will verify the
device zone model and will prepare and write on-disk *dm-zoned* metadata
according to the device capacity, zone size, etc.

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
  followed by one or more zoned block devices
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

### Formatting a Target Device

Formatting a single device target is done using the command.

```plaintext
# dmzadm --format /dev/<disk name>
```

where `/dev/<disk name>` identifies the backend zoned block device to use. An
example execution using a SMR hard-disk is shown below.

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

Starting with Linux kernel v5.8.0, regular block devices such as SSDs can also
be used together with zoned block devices with *dm-zoned*. In this case,
conventional zones are emulated for the regular block device to hold *dm-zoned*
metadata and for buffering data. When a regular block device is used, the zone
reclaim process operates by copying data from emulated conventional zones on
the regular block device to zones of the zoned block device. This dual-drive
configuration can significantly increase performance of the target device
under write-intensive workloads.

To format a *dm-zoned* target device using an additional regular block device
and optionally several zoned block devices, the following commands can be used.

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

Where `/dev/nvme2n1` is in this example a NVMe SSD and `/dev/sdi` is a
host managed SMR hard-disk.

### Activating a Target Device

The *dm-zoned* target device using a formatted zoned device or set of devices
can be started by executing *dmzadm* with the `--start` command.

```plaintext
# dmzadm --start /dev/sdi
/dev/sdi: 29297213440 512-byte sectors (13970 GiB)
  Host-managed device
  55880 zones, offset 0
  55880 zones of 524288 512-byte sectors (256 MiB)
  65536 4KB data blocks per zone
sdi: starting dmz-sdi uuid 8c505b4b-d1e9-47a7-8e3a-8b1c00317eaf
```

The target start can be confirmed by looking at the kernel messages.

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

The target device created is a regular disk that can be used with any file
system.

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

For a multi-device target, the same list of devices as used for format must be
specified.

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

Similarly to the single device case, kernel messages notify the target device
activation.

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

### Stopping a Target Device

A *dm-zoned* target device can be disabled using the `--stop` operation.

```plaintext
# dmzadm --stop /dev/sdX
```

For a multi-device target, the same list of devices as used for format must be
specified.
