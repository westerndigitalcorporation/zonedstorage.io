---
id: fs
title: File Systems
sidebar_label: File Systems
---

# File Systems

The [*dm-zoned*](./dm.md#dm-zoned) device-mapper target makes it possible to
use any file system with host-managed zoned block devices. It does this by
hiding the device's sequential write constraints. This solution is simple and
makes it possible to use file systems, but its potentially high overhead
during the block-based zone-reclamation process means that is not the
maximally efficient solution. 

File systems whose implementations directly support zoned block devices have
more efficient zone-reclamation processing. This is because file systems that
directly support zoned block devices have metadata and file abstractions that
provide more information about the usage and validity of storage blocks than
do file systems that take the *dm-zoned*-block-based approach.

Some file systems are designed in such a way that they work well with the
sequential write constraint of host-managed zoned block devices. This is the
case for log-structured file systems such as *f2fs* and copy-on-write (CoW)
file systems such as *Btrfs*.

## zonefs

*zonefs* is a very simple file system that exposes each of the zones of a zoned
block device as a file. *zonefs* has been included with the upstream Linux
kernel since version 5.6.0.

### Overview

*zonefs* does not hide from the user the sequential write constraints of zoned
block devices. In this, it is unlike a regular POSIX-compliant file system
with native zoned-block device support (e.g. [*f2fs*](fs.md#f2fs)). Files
that represent sequential write zones on the device must be written
sequentially, starting from the end of the file (these are "append only"
writes).

*zonefs* is therefore more similar to a raw-block-device-access interface than
it is to a full-featured POSIX file system. The goal of *zonefs* is to
simplify the implementation of zoned block device support in applications, and
it aims to do this by replacing raw block device file accesses with the richer
regular-file API (which avoids relying on the possibly more obscure and
developer-unfriendly direct block device file ioctls). One example of this
approach is the implementation of LSM (log-structured merge) tree structures
(such as used in RocksDB and LevelDB) on zoned block devices: SSTables are
stored in a zone file in a way that is similar to the way a regular file
system works rather than as a range of sectors of the entire disk. The
introduction of the higher-level construct "one file is one zone" can reduce
the number of changes needed in the application, and also introduces support
for different application programming languages.

The files that represent zones are grouped by zone type, and those zone types
themselves are represented by sub-directories. This file structure is built
entirely using zone information that is provided by the device and therefore
does not require any complex on-disk metadata structure.

### On-Disk Metadata

*zonefs* on-disk metadata is composed only of an immutable super block which
persistently stores a magic number and optional feature flags and values. On
mount, *zonefs* uses the block layer API function `blkdev_report_zones()` to
obtain the device zone configuration and populates the mount point with a
static file tree that is based solely on this information. File sizes come
from the device zone type and the write-pointer position, both of which are
managed by the device itself. *zonefs* operates only based on information
from the device. *zonefs* does not have any metadata of its own.

The super block is always written on disk at sector 0. The first zone of the
device that stores the super block is never exposed as a zone file by
*zonefs*. If the zone that contains the super block is a sequential zone, the
`mkzonefs` format tool always "finishes" the zone (that is, it transitions the
zone to a full state to make it read-only, preventing any data write).

### Zone Type Sub-Directories

Files that represent zones of the same type are grouped together under the same
sub-directory, which is automatically created on mount.

For conventional zones, the sub-directory "cnv" is used. This directory is
created only if the device has usable conventional zones. If the device has
only a single conventional zone at sector 0, the zone will not be exposed as a
file (because it will be used to store the *zonefs* super block). For such
devices, the "cnv" sub-directory will not be created.

For sequential write zones, the sub-directory "seq" is used.

These two directories are the only directories that exist in *zonefs*. Users
cannot create other directories and can neither rename nor delete the "cnv"
and "seq" sub-directories.

The size of the directories indicates the number of files that exist under
the directory. This size is indicated by the `st_size` field of `struct
stat`, which is obtained with the `stat()` or `fstat()` system calls.

### Zone files

Zone files are named using the number of the zone they represent within the
set of zones of a particular type. Both the "cnv" and "seq" directories
contain files named "0", "1", "2", ... The file numbers also represent
increasing zone start sector on the device.

No read- and write-operations to zone files are allowed beyond the file
maximum size (that is, beyond the zone size). Any access that exceeds the zone
size fails with the `-EFBIG` error.

Creating, deleting, renaming and modifying any attribute of files is not
allowed.

The number of blocks of a file as reported by `stat()` and `fstat()` indicates
the size of the file zone (in other words, the maximum file size).

#### Conventional Zone Files

The size of conventional zone files is fixed to the size of the zone that they
represent. Conventional zone files cannot be truncated.

These files can be randomly read and written using any type of I/O operation:
buffered I/Os, direct I/Os, memory mapped I/Os (mmap), etc. There are no I/O
constraints for these files beyond the file size limit mentioned above.

#### Sequential zone files

The size of sequential zone files that are grouped in the "seq" sub-directory
represents the file's zone-write-pointer position relative to the zone start
sector.

Sequential zone files can be written only sequentially, starting from the file
end (that is, write operations can be only "append writes"). `zonefs` makes no
attempt to accept random writes and will fail any write request that has a
start offset that does not correspond to the end of the file, or to the end of
the last write issued and still in-flight (for asynchronous I/O operations).

Because dirty page writeback by the page cache does not guarantee a sequential
write pattern, *zonefs* prevents buffered writes and writeable shared mappings
on sequential files. Only direct I/O writes are accepted for these files.
*zonefs* relies on the sequential delivery of write I/O requests to the device
implemented by the block layer elevator (See
[Write Command Ordering](./sched.md)).

There are no restrictions on the type of I/O used for read operations in
sequential zone files. Buffered I/Os, direct I/Os and shared read mappings are
all accepted.

Truncating sequential zone files is allowed only down to 0, in which case, the
zone is reset to rewind the file zone write pointer position to the start of
the zone, or up to the zone size, in which case the file's zone is transitioned
to the FULL state (finish zone operation).

### Format options

Several optional features of *zonefs* can be enabled at format time.

* Conventional zone aggregation: ranges of contiguous conventional zones can
  be aggregated into a single larger file instead of the default "one file per
  zone".
* File ownership: By default, the owner UID and GID of zone files is 0 (root)
  but can be changed to any valid UID/GID.
* File access permissions: the default access permissions (640) can be changed.

### IO error handling

Zoned block devices can fail I/O requests for reasons similar to the reasons
that regular block devices fail I/O requests, e.g. if there are bad sectors.
But the standards that govern the behavior of zoned block devices also define
additional conditions (in addition to these known I/O failure patterns) that
can result in I/O errors.

* A zone may transition to the read-only condition:
  Although the data that is already written in the zone is still readable, the 
  zone can no longer be written. No user action on the zone (zone management 
  command or read/write access) can change the zone condition back to a
  normal read/write state. While the reasons for the device to transition a 
  zone to read-only state are not defined by the standards, a typical cause 
  for such transition would be a defective write head on an HDD (all zones 
  under this head are changed to read-only).

* A zone may transition to the offline condition:
  An offline zone can be neither read nor written. No user action can 
  transition an offline zone back to an operational "good state". Similar to 
  zone read-only transitions, the reasons that a drive transitions a zone 
  to the offline condition are undefined. A typical cause is (for example) a 
  defective read-write head on an HDD that causes all zones on the platter 
  under the broken head to be inaccessible.

* Unaligned write errors:
  These errors result from the device receiving a write request that has a
  start sector that does not correspond to the write-pointer position of the
  target zone. Although *zonefs* enforces sequential file write for 
  sequential zones, unaligned write errors can still happen in the case of a 
  partial failure of a very large direct I/O operation that is split into
  multiple BIOs/requests or asynchronous I/O operations. If one of the write
  requests within the set of sequential write requests that is issued to the 
  device fails, all write requests that are queued after it will become 
  unaligned and fail.

* Delayed write errors:
  As with regular block devices, if the device-side write cache is enabled,
  write errors can occur in ranges of previously-completed writes when the
  device write cache is flushed, e.g. on `fsync()`.  As in cases of immediate 
  unaligned write errors, delayed write errors can propagate through a stream 
  of cached sequential data for a zone, which can cause all data after the 
  sector that caused the error to be dropped. 

All I/O errors detected by *zonefs* are reported to the user with an error code
returned for the system call that triggered or detected the error. The recovery
actions taken by *zonefs* in response to I/O errors depend on the I/O type
(read vs write) and on the reason for the error (bad sector, unaligned writes or
zone condition change).

* For read I/O errors, *zonefs* takes recovery action action only if the file 
  zone is still in good condition and there is no inconsistency between the 
  file inode size and its zone write pointer position. If a problem is 
  detected, I/O error recovery is executed (see below table).

* For write I/O errors, *zonefs* I/O error recovery is always executed.

* A zone condition change to "read-only" or "offline" also always triggers 
  *zonefs* I/O error recovery.

*zonefs* minimal I/O error recovery can change a file's size and its file 
access permissions.

* File size changes:
  Immediate or delayed write errors in a sequential zone file can cause the 
  file inode size to be inconsistent with the amount of data successfully 
  written in the file zone. For example, the partial failure of a multi-BIO 
  large write operation will cause the zone write pointer to advance partially,
  even though the entire write operation is reported as failed to the user. 
  In such cases, the file inode size must be advanced to reflect the zone write
  pointer change and eventually allow the user to restart writing at the end of
  the file.
  A file size may also be reduced to reflect a delayed write error detected on
  fsync(): in this case, the amount of data effectively written in the zone may
  be less than originally indicated by the file inode size. After any such I/O
  error, *zonefs* always fixes the file inode size to reflect the amount of 
  data persistently stored in the file zone.

* Access permission changes:
  A zone condition change to read-only is indicated with a change in the file
  access permissions, rendering the file read-only. This disables changes to 
  the file attributes and data modification. For offline zones, all permissions
  (read and write) of the file are disabled.

Further action taken by *zonefs* I/O error recovery can be controlled by the
user with the "errors=xxx" mount option. The table below summarizes the result
of *zonefs* I/O error processing, depending on the mount option and on the zone
conditions.

<center>

| "errors=xxx" mount option | Device zone condition | File size | File read | File write | Device read | Device write |
| :----------: | :-------: | :---: | :------: | :-----: | :----: | :----: |
| remount-ro   | good      | fixed |  <Yes/>  |  <No/>  | <Yes/> | <Yes/> |
| remount-ro   | read-only | as is |  <Yes/>  |  <No/>  | <Yes/> | <No/>  |
| remount-ro   | offline   |   0   |  <No/>   |  <No/>  | <No/>  | <No/>  |
| zone-ro      | good      | fixed |  <Yes/>  |  <No/>  | <Yes/> | <Yes/> |
| zone-ro      | read-only | as is |  <Yes/>  |  <No/>  | <Yes/> | <No/>  |
| zone-ro      | offline   |   0   |  <No/>   |  <No/>  | <No/>  | <No/>  |
| zone-offline | good      |   0   |  <No/>   |  <No/>  | <Yes/> | <Yes/> |
| zone-offline | read-only |   0   |  <No/>   |  <No/>  | <Yes/> | <No/>  |
| zone-offline | offline   |   0   |  <No/>   |  <No/>  | <No/>  | <No/>  |
| repair       | good      | fixed |  <Yes/>  |  <Yes/> | <Yes/> | <Yes/> |
| repair       | read-only | as is |  <Yes/>  |  <No/>  | <Yes/> | <No/>  |
| repair       | offline   |   0   |  <No/>   |  <No/>  | <No/>  | <No/>  |

</center>

Further notes:

* The "errors=remount-ro" mount option is the default behavior of zonefs I/O
  error processing if no errors mount option is specified.
* With the "errors=remount-ro" mount option, the change of file access
  permissions to "read-only" applies to all files. The file system is remounted
  read-only.
* Access permission and file-size changes caused by the device transitioning 
  zones to the offline condition are permanent. Remounting or reformatting the 
  device with mkfs.zonefs (mkzonefs) will not change offline zone files back
  to a good state.
* All file access permission changes to read-only that are due to the device 
  transitioning zones to the read-only condition are permanent. Remounting or 
  reformatting the device will not re-enable file write access.
* File access permission changes implied by the "remount-ro", "zone-ro" and
  "zone-offline" mount options are temporary for zones in a good condition.
  Unmounting and remounting the file system restores the previous default
  (format time values) access rights to the files affected.
* The repair mount option triggers only the minimal set of I/O error recovery
  actions (that is, file size fixes for zones in a good condition). Zones
  that are indicated as "read-only" or "offline" by the device still imply 
  changes to the zone file access permissions as noted in the table above.

### Mount options

*zonefs* defines the "errors=*behavior*" mount option to allow the user to 
specify zonefs behavior in response to I/O errors, inode size inconsistencies 
or zone condition changes. The defined behaviors are as follows.

* remount-ro (default)
* zone-ro
* zone-offline
* repair

The run-time I/O error actions defined for each behavior are detailed in 
[*IO error handling*](fs.md#io-error-handling). Mount-time I/O errors cause 
the mount operation to fail.

Read-only zones are handled differently at mount time than they are at 
run time. If a read-only zone is found at mount time, the zone is always 
treated in the same manner as offline zones (that is, all accesses are 
disabled and the zone file size set to 0). This is necessary, because the write 
pointer of read-only zones is defined as invalid by the ZBC and ZAC standards 
(which makes it impossible to discover the amount of data that has been 
written to the zone). In the case of a read-only zone that is discovered at 
run-time, as indicated in [*IO error handling*](fs.md#io-error-handling),
the size of the zone file is left unchanged from its last updated value.

### Zonefs User Space Tools

The `mkzonefs` tool is used to format zoned block devices for use with *zonefs*.
This tool is available on <a href="https://github.com/westerndigitalcorporation/zonefs-tools"
target="_blank">GitHub</a>.

*zonefs-tools* also includes a test suite that can be run against any zoned
block device, including
[*nullblk* block device created with zoned mode](../getting-started/nullblk.md).

### Examples

The following list of commands formats a 15TB host-managed SMR HDD with 256 MB
zones (with the conventional zones aggregation feature enabled):

```plaintext
# mkzonefs -o aggr_cnv /dev/sdX
# mount -t zonefs /dev/sdX /mnt
# ls -l /mnt/
total 0
dr-xr-xr-x 2 root root     1 Nov 25 13:23 cnv
dr-xr-xr-x 2 root root 55356 Nov 25 13:23 seq
```

The size of the zone files' sub-directories indicates the number of files
that exist for each type of zone. In this example, there is only one
conventional zone file (all conventional zones are aggregated under a single
file):

```plaintext
# ls -l /mnt/cnv
total 137101312
-rw-r----- 1 root root 140391743488 Nov 25 13:23 0
```

This aggregated conventional zone file can be used as a regular file:

```plaintext
# mkfs.ext4 /mnt/cnv/0
# mount -o loop /mnt/cnv/0 /data
```

The "seq" sub-directory, which groups files for sequential write zones, has
55356 zones in this example:

```plaintext
# ls -lv /mnt/seq
total 14511243264
-rw-r----- 1 root root 0 Nov 25 13:23 0
-rw-r----- 1 root root 0 Nov 25 13:23 1
-rw-r----- 1 root root 0 Nov 25 13:23 2
...
-rw-r----- 1 root root 0 Nov 25 13:23 55354
-rw-r----- 1 root root 0 Nov 25 13:23 55355
```

For sequential write zone files, the file size changes as data is appended at
the end of the file. This is similar to the behavior of any regular file
system:

```plaintext
# dd if=/dev/zero of=/mnt/seq/0 bs=4096 count=1 conv=notrunc oflag=direct
1+0 records in
1+0 records out
4096 bytes (4.1 kB, 4.0 KiB) copied, 0.00044121 s, 9.3 MB/s

# ls -l /mnt/seq/0
-rw-r----- 1 root root 4096 Nov 25 13:23 /mnt/seq/0
```

The written file can be truncated to the zone size, which prevents any further
write operations:

```plaintext
# truncate -s 268435456 /mnt/seq/0
# ls -l /mnt/seq/0
-rw-r----- 1 root root 268435456 Nov 25 13:49 /mnt/seq/0
```

Truncation to 0 size allows freeing the file zone storage space and restarts
append-writes to the file:

```plaintext
# truncate -s 0 /mnt/seq/0
# ls -l /mnt/seq/0
-rw-r----- 1 root root 0 Nov 25 13:49 /mnt/seq/0
```

Since files are statically mapped to zones on the disk, the number of blocks of
a file as reported by stat() and fstat() indicates the size of the file zone:

```plaintext
# stat /mnt/seq/0
File: /mnt/seq/0
Size: 0         	Blocks: 524288     IO Block: 4096   regular empty file
Device: 870h/2160d	Inode: 50431       Links: 1
Access: (0640/-rw-r-----)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2019-11-25 13:23:57.048971997 +0900
Modify: 2019-11-25 13:52:25.553805765 +0900
Change: 2019-11-25 13:52:25.553805765 +0900
Birth: -
```

The number of blocks of the file ("Blocks") in units of 512B blocks gives the
maximum file size of 524288 * 512 B = 256 MB, which corresponds to the device
zone size in this example. Note that the "IO block" field always indicates the
minimum I/O size for writes and that it corresponds to the device's physical
sector size.

## f2fs

The *Flash-Friendly File System* (*f2fs*) was designed on the basis of a
log-structured file system approach, but was modified to avoid the classical
problems of the traditional log-structured approach (e.g. the snowball effect
of "wandering trees" and the high "cleaning overhead").

*f2fs* supports various parameters not only for configuring on-disk layout but
also for selecting allocation and cleaning algorithms.

### Zoned Block Device Support

Zoned block device support was added to *f2fs* with kernel 4.10. Because *f2fs*
uses a metadata-block on-disk format with fixed-block location, only zoned
block devices that include conventional zones are supported. Zoned devices
composed entirely of sequential zones cannot be used with *f2fs* as a
standalone device and they require a multi-device setup in order to place
metadata blocks on randomly writable storage. *f2fs* supports multi-device
setup where multiple block device address spaces are linearly concatenated to
form a logically larger block device. The [*dm-linear*](./dm.md#dm-linear)
device mapper target can also be used to create a logical device that is
composed of both conventional zones and sequential zones suitable for *f2fs*.

*f2fs* zoned block device support was achieved using the following principles.

1. **Section Alignment** In *f2fs*, a section is a group of fixed-size
   segments (2 MB). The number of segments in a section is determined to match
   the zoned device zone size. For example: with a 256 MB zone size, a section
   contains 128 segments of 2MB.
2. **Forced LFS mode** By default, *f2fs* tries to optimize block allocation
   (in order to avoid excessive append write) by allowing some random writes
   within segments. The LFS mode forces sequential writes to segments and 
   forces the sequential use of segments within sections, which results in 
   full compliance with the zoned block device's write constraint.
3. **Zone reset as discard operation** In the past, block *discard* (or *trim*) 
   indicated to a device that a block or range of blocks are no longer in use. 
   This has been replaced with the execution of a "zone write pointer reset" 
   command when all blocks of all segments of a section are free. This allows 
   the section to be reused.

Compared to a solution that uses the *dm-zoned* device mapper target, 
the performance of *f2fs* on zoned devices does not suffer from "zone reclaim 
overhead", because writes are always sequential and do not require on-disk 
temporary buffering. *f2fs* garbage collection (segment cleanup) generates 
overhead only for workloads that frequently delete files or modify files' data.

### Zone Capacity Support

NVMe ZNS SSDs can have a per [zone capacity that is smaller than the zone
size](../introduction/zns#zone-capacity-and-zone-size). To support ZNS devices,
*f2fs* ensures that block allocation and accounting considers only the blocks
in a zone that are within the zone's capacity. This support for NVMe ZNS zone
capacity has been available since it was introduced in Linux kernel version
5.10.

*f2fs* volumes need some storage space that is randomly writable in order 
to store and update in-place metadata blocks for the volume. Since NVMe zoned
namespaces do not have conventional zones, a *f2fs* volume cannot be
self-contained within a single NVMe zoned namespace. To format an *f2fs* volume
using a NVMe zoned namespace, a multi-device volume format must be used in order
to provide an additional regular block device to store the volume metadata 
blocks. This additional regular block device can be either a regular namespace 
on the same NVMe device or a regular namespace on another NVMe device.

### Limitations

*f2fs* uses 32-bit block numbers with a block size of 4 KB. This results in a
maximum volume size of 16 TB. Any device or combination of devices (for a
multi-device volume) with a total capacity that is larger than 16 TB cannot 
be used with *f2fs*.

To overcome this limit, the [*dm-linear*](./dm.md#dm-linear) device mapper 
target can be used to partition a zoned block device into serviceable, 
smaller logical devices. This configuration must ensure that each logical 
device that is created is assigned a sufficient amount of conventional zones 
to store *f2fs* fixed location metadata blocks.

### Usage Example with a Host Managed SMR HDD

To format a zoned block device with *mkfs.f2fs*, the option `-m` must be
specified:

```plaintext
# mkfs.f2fs -m /dev/sdb

	f2fs-tools: mkfs.f2fs Ver: 1.12.0 (2018-11-12)

Info: Disable heap-based policy
Info: Debug level = 0
Info: Trim is enabled
Info: [/dev/sdb] Disk Model: HGST HSH721415AL
Info: Host-managed zoned block device:
      55880 zones, 524 randomly writeable zones
      65536 blocks per zone
Info: Segments per section = 128
Info: Sections per zone = 1
Info: sector size = 4096
Info: total sectors = 3662151680 (14305280 MB)
Info: zone aligned segment0 blkaddr: 65536
Info: format version with
  "Linux version 5.0.16-300.fc30.x86_64 (mockbuild@bkernel03.phx2.fedoraproject.org) (gcc version 9.1.1 20190503 (Red Hat 9.1.1-1) (GCC)) #1 SMP Tue May 14 19:33:09 UTC 2019"
Info: [/dev/sdb] Discarding device
Info: Discarded 14305280 MB
Info: Overprovision ratio = 0.600%
Info: Overprovision segments = 86254 (GC reserved = 43690)
Info: format successful
```

The formatted zoned block device can now be directly mounted. No further 
setup is necessary:

```plaintext
# mount /dev/sdb /mnt
```

### Usage Example with a NVMe ZNS SSD

Unlike SMR hard-disks, the kernel by default does not select the *mq-deadline*
block-IO scheduler for block devices that represent NVMe zoned namespaces. To
ensure that the regular write operations used by *f2fs* are delivered to the
device in sequential order, the IO scheduler for the NVMe zoned namespace block
device must be set to *mq-deadline*. This is done with the following command:

```plaintext
# echo mq-deadline > /sys/block/nvme1n1/queue/scheduler
```

In the above command, `/dev/nvme1n1` is the block device file of the zoned 
namespace that will be used for the *f2fs* volume. Using this namespace, a 
multi-device *f2fs* volume that uses an additional regular block device 
(`/dev/nvme0n1` in the following example) can be formatted using the *-c* 
option of *mkfs.f2fs*, as shown in the following example:

```plaintext
# mkfs.f2fs -f -m -c /dev/nvme1n1 /dev/nvme0n1

        F2FS-tools: mkfs.f2fs Ver: 1.14.0 (2021-06-23)

Info: Disable heap-based policy
Info: Debug level = 0
Info: Trim is enabled
Info: Host-managed zoned block device:
      2048 zones, 0 randomly writeable zones
      524288 blocks per zone
Info: Segments per section = 1024
Info: Sections per zone = 1
Info: sector size = 4096
Info: total sectors = 1107296256 (4325376 MB)
Info: zone aligned segment0 blkaddr: 524288
Info: format version with
  "Linux version 5.13.0-rc6+ (user1@brahmaputra) (gcc (Ubuntu 10.3.0-1ubuntu1) 10.3.0, GNU ld (GNU Binutils for Ubuntu) 2.36.1) #2 SMP Fri Jun 18 16:45:29 IST 2021"
Info: [/dev/nvme0n1] Discarding device
Info: This device doesn't support BLKSECDISCARD
Info: This device doesn't support BLKDISCARD
Info: [/dev/nvme1n1] Discarding device
Info: Discarded 4194304 MB
Info: Overprovision ratio = 3.090%
Info: Overprovision segments = 74918 (GC reserved = 40216)
Info: format successful
```

To mount the volume formatted with the above command, the regular block device
must be specified:

```plaintext
# mount -t f2fs /dev/nvme0n1 /mnt/f2fs/
```


## Btrfs

*Btrfs* is a file system based on the copy-on-write (CoW) principle. This
principle has the result that no block update can be written in-place. 
*Btrfs* currently supports zoned block devices, but that support is 
experimental.

### Zoned Block Device Support

Zoned block device support was added to *btrfs* with kernel 5.12. Because
super-blocks are the only on-disk data structure with a fixed location in
*btrfs*, zoned block device support introduces the concept of log-structured
super-blocks to eliminate in-place updates (overwrites) of fixed super block
locations. Zoned mode reserves two consecutive zones to hold each of the
super-blocks (primary and backup super-blocks) in *btrfs*. When a new
super-block is written, it is appended to its respective super-block zone.
After the first super-block zone is filled, the next super block is written to
the second super-block zone and the first is reset. At mount time, *btrfs*
can find the latest version of the super-block by looking at the position of
the zone write pointer of the super-block zones. The most recent and valid
super-block is always the last  block stored before the write pointer
position.

### Block Allocation Changes

*Btrfs* block management relies on grouping blocks into *block groups*. 
Each *block group* is composed of one or more *device extents*. The device 
extents of a block group may belong to different devices (e.g. in the case 
of a RAID volume). ZBD support changes the size of a device extent from its
default size to the size of the device zones. This ensures that all device 
extents are always aligned to a zone.

Allocation of blocks within a block group is changed so that the allocation is
always sequential from the beginning of the block group. To do this, an
allocation pointer is added to block groups and used as the allocation hint.
These changes ensure that blocks freed below the allocation pointer are
ignored, which results in sequential block allocation within each group 
regardless of the block group usage.

### I/O Management

Although the introduction of the allocation pointer ensures that blocks are
allocated sequentially within groups (and therefore sequentially within zones),
I/O operations that write out newly allocated blocks can be issued out of
order, and this can cause errors when writing to sequential zones. This problem
is solved by introducing a "write I/O request staging list" to each block group.
This list is used to delay the execution of unaligned write requests within a
given block group.

The zones of a block group are reset to allow rewriting only when the block
group is free (that is, when all the blocks within the block group are
unused).

When dealing with *btrfs* volumes that are composed of multiple disks,
restrictions are added to ensure that all the disks have the same zone model
(and in the case of zoned block devices, the same zone size). This matches the
existing *btrfs* constraint that dictates that all device extents in a block
group must have the same size.

All writes to data block groups use [Zone Append
writing](../introduction/zns#zone-append), which makes it possible to maintain
a high queue depth without violating the device zone's sequential write
constraints. Every write to dedicated meta-data block groups is serialized
with a file-system-global zoned metadata I/O lock.

### Zone Capacity Support

NVMe ZNS SSDs can have a per [zone capacity that is smaller than the zone
size](../introduction/zns#zone-capacity-and-zone-size).  To support ZNS
devices, *btrfs* ensures that block allocation and accounting considers only
the blocks in a zone that are within the zone capacity. This support for NVMe
ZNS zone capacity has been available since Linux kernel version 5.16. Also,
since kernel 5.16, *btrfs* keeps track of the number of active zones on
a device and issues "Zone Finish" commands as needed.

### Limitations

Not all features currently available in *btrfs* are supported in the current
zoned mode of the file-system.

These unavailable features include:
- RAID Support
- NOCOW Support
- Support for fallocate(2)
- Mixed data and meta-data block groups

### System Requirements

In order to use *btrfs* on zoned block devices, the following minimum system
requirements must be met:
- Linux kernel 5.12 (for SMR) or 5.16 (for NVMe ZNS)
- *btrfs-progs* 5.12 (for SMR) or 5.15 (for NVMe ZNS)
- *util-linux* 2.38

The source code for *btrfs-progs* <a href="https://github.com/kdave/btrfs-progs"
target="_blank">is hosted on GitHub</a>. More information on *util-linux* can be
found [here](../tools/util-linux).

If a kernel supports *btrfs* on a zoned block device, it will automatically
select the *mq_deadline* block IO scheduler by default. This ensures [write
ordering correctness](sched.md) for any SMR hard-disk that is used in a zoned
*btrfs* volume.

As in the case of [*f2fs* use with an NVMe ZNS
SSD](fs#usage-example-with-a-nvme-zns-ssd), the *mq-deadline* scheduler must be
set manually to ensure that the regular write operations used by *btrfs* are
delivered to the device in sequential order. For a NVMe zoned namespace device
*/dev/nvmeXnY*, this is done with the following command:

```plaintext
# echo mq-deadline > /sys/block/nvmeXnY/queue/scheduler
```

Alternatively, the following udev rule can be used to automatically set the
*mq-deadline* scheduler for all zoned block devices that have been formatted
with btrfs.

```plain text
SUBSYSTEM!="block", GOTO="btrfs_end"
ACTION!="add|change", GOTO="btrfs_end"
ENV{ID_FS_TYPE}!="btrfs", GOTO="btrfs_end"

ATTR{queue/zoned}=="host-managed", ATTR{queue/scheduler}="mq-deadline"

LABEL="btrfs_end"
```

### Usage example with a Host Managed SMR HDD

To format a zoned block device with *mkfs.btrfs*, the `-m single` and `-d
single` options must be specified, because no block group profile other 
than "single" is currently supported.

```plaintext
# mkfs.btrfs -m single -d single /dev/sda
btrfs-progs v5.15.1
See http://btrfs.wiki.kernel.org for more information.

Zoned: /dev/sda: host-managed device detected, setting zoned feature
Resetting device zones /dev/sda (74508 zones) ...
NOTE: several default settings have changed in version 5.15, please make sure
      this does not affect your deployments:
      - DUP for metadata (-m dup)
      - enabled no-holes (-O no-holes)
      - enabled free-space-tree (-R free-space-tree)

Label:              (null)
UUID:               7ffa00fe-c6a3-4c6c-890f-858e17118c66
Node size:          16384
Sector size:        4096
Filesystem size:    18.19TiB
Block group profiles:
  Data:             single          256.00MiB
  Metadata:         single          256.00MiB
  System:           single          256.00MiB
SSD detected:       no
Zoned device:       yes
  Zone size:        256.00MiB
Incompat features:  extref, skinny-metadata, no-holes, zoned
Runtime features:   free-space-tree
Checksum:           crc32c
Number of devices:  1
Devices:
   ID        SIZE  PATH
    1    18.19TiB  /dev/sda
```

The formatted block device can now be directly mounted. No other setup is
necessary.

```plaintext
# mount /dev/sda /mnt
```

## XFS

*XFS* currently does not support zoned block devices. The
[*dm-zoned*](./dm.md#dm-zoned) device mapper target must be used to enable
zoned device use with *XFS*.

An early <a href="http://xfs.org/images/f/f6/Xfs-smr-structure-0.2.pdf"
target="_blank"> design document</a> discussed the development work necessary
to support host aware and host managed disks with *XFS*. Parts of this design
have already been implemented and included into the kernel stable releases
(e.g. the "per inode reverse block mapping b-trees" feature). However, more
work is necessary to fully support zoned block devices.

## ext4

Attempts at improving *ext4* performance with host aware zoned block devices by
making changes to the file system journal management are described in in <a
href="https://lwn.net/Articles/720226/" target="_blank">this article</a>. These
changes are small and succeed in maintaining good performance. However, support
for host managed zoned block devices is not provided, because some of the
fundamental aspects of *ext4* design cannot easily be changed to match host
managed device constraints.

The field of host optimizations for host aware zoned block devices remains in
the research phase and is not included in *ext4* stable kernel releases. It
should also be noted that *ext4* does not support host managed disks. As with
*XFS*, however, the *ext4* file system can be used together with the
[*dm-zoned*](./dm.md#dm-zoned) device mapper target.

export function Yes() {
  return (
    <span
      style={{
        color: '#00ff00'
      }}>
      yes
    </span>
  );
}

export function No() {
  return (
    <span
      style={{
        color: '#ff0000'
      }}>
      no
    </span>
  );
}
