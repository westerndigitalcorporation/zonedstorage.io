# File Systems and Zoned Block Devices

The [*dm-zoned*](dm.md#dm-zoned) device mapper target allows using any file
system with host managed zoned block devices by hiding the device sequential
write constraints. This is a simple solution to enable a file system use but not
necessarily the most efficient due to the potentially high overhead of a block
based zone reclaim process.

Supporting zoned block devices directly in a file system implementation can
lead to a more efficient zone reclaim processing as the file system metadata
and file abstraction provide more information on the usage and validity status
of storage blocks compared to the raw block device based approach.

Furthermore, a file system design may lend itself well to the sequential write
constraint of host managed zoned block devices. This is the case for
log-structured file systems such as *f2fs* and copy-on-write (CoW) file systems
such as *Btrfs*.

## zonefs

zonefs is a very simple file system exposing each zone of a zoned block device
as a file. *zonefs* is included with the upstream Linux kernel since version
5.6.0.

### Overview

Unlike a regular POSIX-compliant file system with native zoned block device
support (e.g. [*f2fs*](fs.md#f2fs)), *zonefs* does not hide the sequential write
constraint of zoned block devices to the user. Files representing sequential
write zones of the device must be written sequentially starting from the end of
the file (append only writes).

As such, *zonefs* is in essence closer to a raw block device access interface
than to a full-featured POSIX file system. The goal of *zonefs* is to simplify
the implementation of zoned block device support in applications by replacing
raw block device file accesses with the richer regular file API, avoiding
relying on direct block device file ioctls which may be more obscure to
developers. One example of this approach is the implementation of LSM
(log-structured merge) tree structures (such as used in RocksDB and LevelDB) on
zoned block devices by allowing SSTables to be stored in a zone file similarly
to a regular file system rather than as a range of sectors of the entire disk.
The introduction of the higher level construct "one file is one zone" can help
reducing the amount of changes needed in the application as well as introducing
support for different application programming languages.

The files representing zones are grouped by zone type, which are themselves
represented by sub-directories. This file structure is built entirely using
zone information provided by the device and so does not require any complex
on-disk metadata structure.

### On-Disk Metadata

*zonefs* on-disk metadata is composed only of an immutable super block which
persistently stores a magic number and optional feature flags and values. On
mount, *zonefs* uses the block layer API function `blkdev_report_zones()` to
obtain the device zone configuration and populates the mount point with a
static file tree solely based on this information. File sizes come from the
device zone type and write pointer position managed by the device itself.

The super block is always written on disk at sector 0. The first zone of the
device storing the super block is never exposed as a zone file by *zonefs*. If
the zone containing the super block is a sequential zone, the `mkzonefs` format
tool always "finishes" the zone, that is, it transitions the zone to a full
state to make it read-only, preventing any data write.

### Zone Type Sub-Directories

Files representing zones of the same type are grouped together under the same
sub-directory automatically created on mount.

For conventional zones, the sub-directory "cnv" is used. This directory is
however created if and only if the device has usable conventional zones. If
the device only has a single conventional zone at sector 0, the zone will not
be exposed as a file as it will be used to store the *zonefs* super block. For
such devices, the "cnv" sub-directory will not be created.

For sequential write zones, the sub-directory "seq" is used.

These two directories are the only directories that exist in *zonefs*. Users
cannot create other directories and cannot rename nor delete the "cnv" and
"seq" sub-directories.

The size of the directories indicated by the `st_size` field of `struct stat`,
obtained with the `stat()` or `fstat()` system calls, indicates the number of
files existing under the directory.

### Zone files

Zone files are named using the number of the zone they represent within the set
of zones of a particular type. That is, both the "cnv" and "seq" directories
contain files named "0", "1", "2", ... The file numbers also represent
increasing zone start sector on the device.

All read and write operations to zone files are not allowed beyond the file
maximum size, that is, beyond the zone size. Any access exceeding the zone
size is failed with the `-EFBIG` error.

Creating, deleting, renaming or modifying any attribute of files is not allowed.

The number of blocks of a file as reported by `stat()` and `fstat()` indicates
the size of the file zone, or in other words, the maximum file size.

#### Conventional Zone Files

The size of conventional zone files is fixed to the size of the zone they
represent. Conventional zone files cannot be truncated.

These files can be randomly read and written using any type of I/O operation:
buffered I/Os, direct I/Os, memory mapped I/Os (mmap), etc. There are no I/O
constraint for these files beyond the file size limit mentioned above.

#### Sequential zone files

The size of sequential zone files grouped in the "seq" sub-directory represents
the file's zone write pointer position relative to the zone start sector.

Sequential zone files can only be written sequentially, starting from the file
end, that is, write operations can only be append writes. Zonefs makes no
attempt at accepting random writes and will fail any write request that has a
start offset not corresponding to the end of the file, or to the end of the last
write issued and still in-flight (for asynchronous I/O operations).

Since dirty page writeback by the page cache does not guarantee a sequential
write pattern, *zonefs* prevents buffered writes and writeable shared mappings
on sequential files. Only direct I/O writes are accepted for these files.
*zonefs* relies on the sequential delivery of write I/O requests to the device
implemented by the block layer elevator (See [Write Command Ordering](sched.md)).

There are no restrictions on the type of I/O used for read operations in
sequential zone files. Buffered I/Os, direct I/Os and shared read mappings are
all accepted.

Truncating sequential zone files is allowed only down to 0, in which case, the
zone is reset to rewind the file zone write pointer position to the start of
the zone, or up to the zone size, in which case the file's zone is transitioned
to the FULL state (finish zone operation).

### Format options

Several optional features of zonefs can be enabled at format time.

* Conventional zone aggregation: ranges of contiguous conventional zones can be
  aggregated into a single larger file instead of the default one file per zone.
* File ownership: The owner UID and GID of zone files is by default 0 (root)
  but can be changed to any valid UID/GID.
* File access permissions: the default 640 access permissions can be changed.

### IO error handling

Zoned block devices may fail I/O requests for reasons similar to regular block
devices, e.g. due to bad sectors. However, in addition to such known I/O
failure pattern, the standards governing zoned block devices behavior define
additional conditions that can result in I/O errors.

* A zone may transition to the read-only condition:
  While the data already written in the zone is still readable, the zone can
  no longer be written. No user action on the zone (zone management command or
  read/write access) can change the zone condition back to a normal read/write
  state. While the reasons for the device to transition a zone to read-only
  state are not defined by the standards, a typical cause for such transition
  would be a defective write head on an HDD (all zones under this head are
  changed to read-only).

* A zone may transition to the offline condition:
  An offline zone cannot be read nor written. No user action can transition an
  offline zone back to an operational good state. Similarly to zone read-only
  transitions, the reasons for a drive to transition a zone to the offline
  condition are undefined. A typical cause would be a defective read-write head
  on an HDD causing all zones on the platter under the broken head to be
  inaccessible.

* Unaligned write errors:
  These errors result from the host issuing write requests with a start sector
  that does not correspond to a zone write pointer position when the write
  request is executed by the device. Even though *zonefs* enforces sequential
  file write for sequential zones, unaligned write errors may still happen in
  the case of a partial failure of a very large direct I/O operation split into
  multiple BIOs/requests or asynchronous I/O operations.  If one of the write
  request within the set of sequential write requests issued to the device
  fails, all write requests queued after it will become unaligned and fail.

* Delayed write errors:
  Similarly to regular block devices, if the device side write cache is enabled,
  write errors may occur in ranges of previously completed writes when the
  device write cache is flushed, e.g. on `fsync()`.  Similarly to the previous
  immediate unaligned write error case, delayed write errors can propagate
  through a stream of cached sequential data for a zone causing all data to be
  dropped after the sector that caused the error.

All I/O errors detected by *zonefs* are notified to the user with an error code
return for the system call that triggered or detected the error. The recovery
actions taken by *zonefs* in response to I/O errors depend on the I/O type
(read vs write) and on the reason for the error (bad sector, unaligned writes or
zone condition change).

* For read I/O errors, *zonefs* does not execute any particular recovery action,
  but only if the file zone is still in a good condition and there is no
  inconsistency between the file inode size and its zone write pointer position.
  If a problem is detected, I/O error recovery is executed (see below table).

* For write I/O errors, *zonefs* I/O error recovery is always executed.

* A zone condition change to read-only or offline also always triggers *zonefs*
  I/O error recovery.

*zonefs* minimal I/O error recovery may change a file size and file access
permissions.

* File size changes:
  Immediate or delayed write errors in a sequential zone file may cause the file
  inode size to be inconsistent with the amount of data successfully written in
  the file zone. For instance, the partial failure of a multi-BIO large write
  operation will cause the zone write pointer to advance partially, even though
  the entire write operation will be reported as failed to the user. In such
  case, the file inode size must be advanced to reflect the zone write pointer
  change and eventually allow the user to restart writing at the end of the
  file.
  A file size may also be reduced to reflect a delayed write error detected on
  fsync(): in this case, the amount of data effectively written in the zone may
  be less than originally indicated by the file inode size. After such I/O
  error, *zonefs* always fixes the file inode size to reflect the amount of data
  persistently stored in the file zone.

* Access permission changes:
  A zone condition change to read-only is indicated with a change in the file
  access permissions to render the file read-only. This disables changes to the
  file attributes and data modification. For offline zones, all permissions
  (read and write) to the file are disabled.

Further action taken by *zonefs* I/O error recovery can be controlled by the
user with the "errors=xxx" mount option. The table below summarizes the result
of *zonefs* I/O error processing depending on the mount option and on the zone
conditions.

<center>

| "errors=xxx"</br>mount option | device zone</br>condition | file</br>size | file</br>read | file</br>write | device</br>read | device</br>write |
|:-------------------------:|:---------------------:|:---------:|:---------:|:----------:|:-----------:|:------------:|
| remount-ro   | good      | fixed |  <span style="color:green">yes</span>  |  <span style="color:red">no</span>    | <span style="color:green">yes</span> | <span style="color:green">yes</span> |
| remount-ro   | read-only | as is |  <span style="color:green">yes</span>  |  <span style="color:red">no</span>    | <span style="color:green">yes</span> | <span style="color:red">no</span>    |
| remount-ro   | offline   |   0   |  <span style="color:red">no</span>     |  <span style="color:red">no</span>    | <span style="color:red">no</span>    | <span style="color:red">no</span>    |
| zone-ro      | good      | fixed |  <span style="color:green">yes</span>  |  <span style="color:red">no</span>    | <span style="color:green">yes</span> | <span style="color:green">yes</span> |
| zone-ro      | read-only | as is |  <span style="color:green">yes</span>  |  <span style="color:red">no</span>    | <span style="color:green">yes</span> | <span style="color:red">no</span>    |
| zone-ro      | offline   |   0   |  <span style="color:red">no</span>     |  <span style="color:red">no</span>    | <span style="color:red">no</span>    | <span style="color:red">no</span>    |
| zone-offline | good      |   0   |  <span style="color:red">no</span>     |  <span style="color:red">no</span>    | <span style="color:green">yes</span> | <span style="color:green">yes</span> |
| zone-offline | read-only |   0   |  <span style="color:red">no</span>     |  <span style="color:red">no</span>    | <span style="color:green">yes</span> | <span style="color:red">no</span>    |
| zone-offline | offline   |   0   |  <span style="color:red">no</span>     |  <span style="color:red">no</span>    | <span style="color:red">no</span>    | <span style="color:red">no</span>    |
| repair       | good      | fixed |  <span style="color:green">yes</span>  |  <span style="color:green">yes</span> | <span style="color:green">yes</span> | <span style="color:green">yes</span> |
| repair       | read-only | as is |  <span style="color:green">yes</span>  |  <span style="color:red">no</span>    | <span style="color:green">yes</span> | <span style="color:red">no</span>    |
| repair       | offline   |   0   |  <span style="color:red">no</span>     |  <span style="color:red">no</span>    | <span style="color:red">no</span>    | <span style="color:red">no</span>    |

</center>

Further notes:

* The "errors=remount-ro" mount option is the default behavior of zonefs I/O
  error processing if no errors mount option is specified.
* With the "errors=remount-ro" mount option, the change of the file access
  permissions to read-only applies to all files. The file system is remounted
  read-only.
* Access permission and file size changes due to the device transitioning zones
  to the offline condition are permanent. Remounting or reformatting the device
  with mkfs.zonefs (mkzonefs) will not change back offline zone files to a good
  state.
* File access permission changes to read-only due to the device transitioning
  zones to the read-only condition are permanent. Remounting or reformatting
  the device will not re-enable file write access.
* File access permission changes implied by the remount-ro, zone-ro and
  zone-offline mount options are temporary for zones in a good condition.
  Unmounting and remounting the file system will restore the previous default
  (format time values) access rights to the files affected.
* The repair mount option triggers only the minimal set of I/O error recovery
  actions, that is, file size fixes for zones in a good condition. Zones
  indicated as being read-only or offline by the device still imply changes to
  the zone file access permissions as noted in the table above.

### Mount options

zonefs define the "errors=<behavior>" mount option to allow the user to specify
zonefs behavior in response to I/O errors, inode size inconsistencies or zone
condition changes. The defined behaviors are as follow:

* remount-ro (default)
* zone-ro
* zone-offline
* repair

The run-time I/O error actions defined for each behavior are detailed in the
previous section. Mount time I/O errors will cause the mount operation to fail.
The handling of read-only zones also differs between mount-time and run-time.
If a read-only zone is found at mount time, the zone is always treated in the
same manner as offline zones, that is, all accesses are disabled and the zone
file size set to 0. This is necessary as the write pointer of read-only zones
is defined as invalib by the ZBC and ZAC standards, making it impossible to
discover the amount of data that has been written to the zone. In the case of a
read-only zone discovered at run-time, as indicated in the previous section.
the size of the zone file is left unchanged from its last updated value.

### Zonefs User Space Tools

The `mkzonefs` tool is used to format zoned block devices for use with *zonefs*.
This tool is available on
<a href="https://github.com/damien-lemoal/zonefs-tools" target="_blank">GitHub</a>.

*zonefs-tools* also includes a test suite which can be run against any zoned
block device, including
[*nullblk* block device created with zoned mode](/getting-started/nullblk.md).

### Examples

The following formats a 15TB host-managed SMR HDD with 256 MB zones
with the conventional zones aggregation feature enabled::

```plaintext
# mkzonefs -o aggr_cnv /dev/sdX
# mount -t zonefs /dev/sdX /mnt
# ls -l /mnt/
total 0
dr-xr-xr-x 2 root root     1 Nov 25 13:23 cnv
dr-xr-xr-x 2 root root 55356 Nov 25 13:23 seq
```

The size of the zone files sub-directories indicate the number of files
existing for each type of zones. In this example, there is only one
conventional zone file (all conventional zones are aggregated under a single
file).

```plaintext
# ls -l /mnt/cnv
total 137101312
-rw-r----- 1 root root 140391743488 Nov 25 13:23 0
```

This aggregated conventional zone file can be used as a regular file::

```plaintext
# mkfs.ext4 /mnt/cnv/0
# mount -o loop /mnt/cnv/0 /data
```

The "seq" sub-directory grouping files for sequential write zones has in this
example 55356 zones::

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
the end of the file, similarly to any regular file system::

```plaintext
# dd if=/dev/zero of=/mnt/seq/0 bs=4096 count=1 conv=notrunc oflag=direct
1+0 records in
1+0 records out
4096 bytes (4.1 kB, 4.0 KiB) copied, 0.00044121 s, 9.3 MB/s

# ls -l /mnt/seq/0
-rw-r----- 1 root root 4096 Nov 25 13:23 /mnt/seq/0
```

The written file can be truncated to the zone size, preventing any further
write operation::

```plaintext
# truncate -s 268435456 /mnt/seq/0
# ls -l /mnt/seq/0
-rw-r----- 1 root root 268435456 Nov 25 13:49 /mnt/seq/0
```

Truncation to 0 size allows freeing the file zone storage space and restart
append-writes to the file::

```plaintext
# truncate -s 0 /mnt/seq/0
# ls -l /mnt/seq/0
-rw-r----- 1 root root 0 Nov 25 13:49 /mnt/seq/0
```

Since files are statically mapped to zones on the disk, the number of blocks of
a file as reported by stat() and fstat() indicates the size of the file zone::

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
maximum file size of 524288 * 512 B = 256 MB, corresponding to the device zone
size in this example. Of note is that the "IO block" field always indicates the
minimum I/O size for writes and corresponds to the device physical sector size.

## f2fs

The *Flash-Friendly File System* (*f2fs*) was designed on a basis of a
log-structured file system approach but modified to avoid the classical problems
of the traditional log-structured approach (e.g. The snowball effect of
wandering trees and the high cleaning overhead).

*f2fs* supports various parameters not only for configuring on-disk layout but
also for selecting allocation and cleaning algorithms.

### Zoned Block Device Support

Zoned block device support was added to *f2fs* with kernel 4.10. Since *f2fs*
uses a metadata block on-disk format with fixed block location, only zoned block
devices which include conventional zones can be supported. Zoned devices composed
entirely of sequential zones cannot be used with *f2fs* as a standalone device
and require a multi-device setup to place metadata blocks on a randomly
writable storage. *f2fs* supports multi-device setup where multiple block device
address spaces are linearly concatenated to form a logically larger block
device. The [*dm-linear*](dm.md#dm-linear) device mapper target can also be used
to create a logical device composed of conventional zones and sequential zones
suitable for *f2fs*.

*f2fs* zoned block device support was achieved using the following principles.

1. **Section Alignment** In *f2fs*, a section is a group of fixed size
   segments (2 MB). The number of segments in a section is determined to match
   the zoned device zone size. For instance, with a 256 MB zone size, a section
   contains 128 segments of 2MB.
2. **Forced LFS mode** By default, *f2fs* tries to optimize block allocation to
   avoid excessive append write by allowing some random writes within segments.
   The LFS mode forces sequential writes to segments and the sequential use of
   segments within sections, resulting in full compliance with zoned block
   devices write constraint.
3. **Zone reset as discard operation** Block *discard* (or *trim*) used to
   indicate to a device that a block or range of blocks are no longer in use is
   replaced with execution of a zone write pointer reset command when all blocks
   of all segments of a section are free, allowing the section to be reused.

### Limitations

*f2fs* uses 32 bits block number with a block size of 4 KB. This results in a
maximum volume size of 16 TB. Any device with a total capacity larger than 16 TB
cannot be used with *f2fs*.

To overcome this limit, the [*dm-linear*](dm.md#dm-linear) device mapper target
can be used to partition a zoned block device into serviceable smaller logical
devices.  This configuration must ensure that each logical device created is
assigned a sufficient amount of conventional zones to store *f2fs* fixed
location metadata blocks.

### Usage Example with Host Managed SMR HDD

To format a zoned block device with *mkfs.f2fs*, the option `-m` must be specified.

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

The formatted zoned block device can now be directly mounted without any other
setup necessary.

```plaintext
# mount /dev/sdb /mnt
```

### Support for ZNS SSDs.
ZNS SSDs have zones which can have a writeable area which is less than zone size,
this writeable area per zone is called zone capacity. To support ZNS devices,
*f2fs* needs to ensure that writes do not go beyond zone capacity and account
for the useable blocks per zone, otherwise the zoned block device support added
in *f2fs* is adequate to handle ZNS SSDs. Support to manage ZNS SSD zone capacity
in f2fs is available from Linux kernel version 5.10.

*f2fs* filesystem needs random writable storage device to place it's metadata
blocks. Since ZNS drives are sequentially write only, f2fs filesytem cannot be
created on a standalone ZNS drive. It needs a multi-device setup to create
a *f2fs* filesystem on a ZNS SSD, where the first device should be
randomly writeable block device.

### Usage Example with ZNS SSDs.

The ZNS SSD device IO scheduler needs to be set to mq-deadline.
```plaintext
echo mq-deadline > /sys/block/nvme1n1/queue/scheduler
```
For a multi-device setup, format a ZNS device /dev/nvme1n1 with a randomly writeable
conventional storage device /dev/nvme0n1 with *mkfs.f2fs* with -c(multi-device)
and -m(zone mode) options.

```plaintext
mkfs.f2fs -f -m -c /dev/nvme1n1 /dev/nvme0n1

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
Mount the formatted conventional device on to a mount point.

```plaintext
mount -t f2fs /dev/nvme0n1 /mnt/f2fs/
```

Compared to the *dm-zoned* device mapper target solution, performance of *f2fs*
does not suffer from zone reclaim overhead as writes are always sequential and
do not require on-disk temporary buffering. *f2fs* garbage collection (segment
cleanup) will generate performance overhead only for workloads frequently
deleting file or modifying files data.


## Btrfs

*Btrfs* is a file system based on the copy-on-write (CoW) principle resulting in
any block update to never be written in-place. Work is ongoing to add native ZBD
support by changing the block allocation algorithm and block IO issuing code.

### Block Allocation Changes

*Btrfs* block management relies on grouping of blocks into *block groups*, with
each group composed of one or more *device extent*. The device extents of a
block group may belong to different devices (e.g. In the case of a RAID volume).
ZBD support changes the default device extent size to the size of the device
zones so that all device extents are always aligned to a zone.

Allocation of blocks within a block group is changed so that the allocation is
always sequential from the beginning of the block group. To do so, an allocation
pointer is added to block groups and used as the allocation hint. The changes
also ensure that block freed below the allocation pointer are ignored, resulting
in sequential block allocation within each group regardless of the block group
usage.

### I/O Management

While the introduction of the allocation pointer ensures that blocks are
allocated sequentially within groups, so sequentially within zones, I/Os to
write out newly allocated blocks may be issued out of order causing errors when
writing to sequential zones. This problem is solved by introducing a write I/O
request staging list to each block group. This list is used to delay the
execution of unaligned write requests within a block group.

The zones of a block group are reset to allow rewriting only when the block
group is being freed, that is, when all the blocks within the block group are
unused.

For *Btrfs* volumes composed of multiple disks, restrictions are added to ensure
that all disks have the same zone model and in the case of zoned block devices,
the same zone size. This matches the existing *Btrfs* constraint that all device
extents in a block group must have the same size.

### Upstream Contribution

*Btrfs* zoned block device support is still in development and will be available
in stable releases after the usual upstream review process completes.


## XFS

*XFS* currently does not support zoned block devices. The [*dm-zoned*](dm.md#dm-zoned)
device mapper target must be used to enable zoned device use with *XFS*.

An early <a href="http://xfs.org/images/f/f6/Xfs-smr-structure-0.2.pdf" target="_blank">
design document</a> discussed the development work necessary to support host
aware and host managed disks with *XFS*. Parts of this design have already been
implemented and included into the kernel stable releases (e.g. Per inode
reverse block mapping b-trees feature). However, more work is necessary to
fully support zoned block devices.

## ext4

<a href="https://lwn.net/Articles/720226/" target="_blank">This article</a>
describes attempts at improving *ext4* performance with host aware zoned block
devices using changes to the file system journal management. The changes are
small and succeed in maintaining good performance. However, support for host
managed zoned block devices is not provided as some fundamental *ext4* design
aspects cannot be easily changed to match host managed device constraints.

These optimizations for host aware zoned block devices is a research work and is
not included in *ext4* stable kernel releases. *ext4* also does not support host
managed disks. Similarly to *XFS*, the *ext4* file system can however be used
together with the [*dm-zoned*](dm.md#dm-zoned) device mapper target.

