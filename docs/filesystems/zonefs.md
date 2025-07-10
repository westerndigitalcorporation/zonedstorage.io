---
id: zonefs
title: ZoneFS
sidebar_label: zonefs
---

# zonefs File System

*zonefs* is a very simple file system that exposes each of the zones of a zoned
block device as a file. 

:::info System Requirements
- Linux kernel version 5.6 or later with CONFIG_ZONEFS_FS enabled.
- *zonefs-tools* package. This tool is available on <a
  href="https://github.com/westerndigitalcorporation/zonefs-tools"
target="_blank">GitHub</a>.
- The [mq-deadline](/docs/linux/sched#block-io-scheduler-configuration) block
  I/O scheduler for kernel versions prior to 6.10.
:::

## Usage

First, check that your system meets the
[requirements](/docs/filesystems/zonefs#system-requirements).

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

## Architectural Overview

*zonefs* does not hide from the user the sequential write constraints of zoned
block devices. In this, it is unlike a regular POSIX-compliant file system
with native zoned-block device support (e.g. [*f2fs*](/docs/filesystems/f2fs)).
Files that represent sequential write zones on the device must be written
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

### Zone Files

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

#### Sequential Zone Files

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
[Write Command Ordering](/docs/linux/sched)).

There are no restrictions on the type of I/O used for read operations in
sequential zone files. Buffered I/Os, direct I/Os and shared read mappings are
all accepted.

Truncating sequential zone files is allowed only down to 0, in which case, the
zone is reset to rewind the file zone write pointer position to the start of
the zone, or up to the zone size, in which case the file's zone is transitioned
to the FULL state (finish zone operation).

### Format Options

Several optional features of *zonefs* can be enabled at format time.

* Conventional zone aggregation: ranges of contiguous conventional zones can
  be aggregated into a single larger file instead of the default "one file per
  zone".
* File ownership: By default, the owner UID and GID of zone files is 0 (root)
  but can be changed to any valid UID/GID.
* File access permissions: the default access permissions (640) can be changed.

### IO Error Handling

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

### Mount Options

*zonefs* defines the "errors=*behavior*" mount option to allow the user to 
specify zonefs behavior in response to I/O errors, inode size inconsistencies 
or zone condition changes. The defined behaviors are as follows.

* remount-ro (default)
* zone-ro
* zone-offline
* repair

The run-time I/O error actions defined for each behavior are detailed in 
[*IO error handling*](/docs/filesystems/zonefs#io-error-handling). Mount-time
I/O errors cause the mount operation to fail.

Read-only zones are handled differently at mount time than they are at 
run time. If a read-only zone is found at mount time, the zone is always 
treated in the same manner as offline zones (that is, all accesses are 
disabled and the zone file size set to 0). This is necessary, because the write 
pointer of read-only zones is defined as invalid by the ZBC and ZAC standards 
(which makes it impossible to discover the amount of data that has been 
written to the zone). In the case of a read-only zone that is discovered at 
run-time, as indicated in [*IO error
handling*](/docs/filesystems/zonefs#io-error-handling), the size of the zone
file is left unchanged from its last updated value.

## System Requirements

*zonefs* was introduced with kernel version 5.6. The kernel must be compiled
with *zonefs* support (the kernel configuration parameter CONFIG_ZONEFS_FS must
be enabled).

The `mkzonefs` tool is used to format zoned block devices for use with *zonefs*.
This tool is available on <a href="https://github.com/westerndigitalcorporation/zonefs-tools"
target="_blank">GitHub</a>.

*zonefs-tools* also includes a test suite that can be run against any zoned
block device, including
[*nullblk* block device created with zoned
mode](/docs/getting-started/zbd-emulation).

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
