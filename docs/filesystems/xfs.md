---
id: xfs
title: XFS
sidebar_label: XFS
---

# XFS File System

*XFS* is a widely used scalable enterprise file system that traces it's root
back to the IRIX operating system in the 1990s and is supported by all
major Linux distributions. *XFS* was originally designed for in-place overwrites
on conventional storage devices, but has experimental support for zoned block
devices.

:::note System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
:::

## Usage

First, check that your system meets the
[requirements](/docs/filesystems/xfs#system-requirements).

Formatting a zoned block device with *XFS* requires a separate randomly
writeable block device for metadata, unless the device has conventional zones
at the start of its address space.

### Zoned Block Device with Conventional Zones

Formatting a zoned block device that has at least about 1% of its capacity
reported as conventional zones at the beginning of its address space does not
require a separate device for *XFS* metadata. This is the case for most SMR
hard-disks. For such device, *XFS* automatically and transparently splits the
device into different logical address spaces representing the main and realtime
devices. The main device is composed of the device conventional zones and
used to store *XFS* metadata. The realtime device is composed of the zoned
device sequential write required zones and used by default to store file data.

The following example formats an SMR hard-disk for use with *XFS* using the
command `mkfs.xfs`.

```plaintext
# mkfs.xfs -f /dev/sda
meta-data=/dev/sda               isize=512    agcount=4, agsize=18317312 blks
         =                       sectsz=4096  attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=73269248, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=0
log      =internal log           bsize=4096   blocks=35776, version=2
         =                       sectsz=4096  sunit=1 blks, lazy-count=1
realtime =internal               extsz=4096   blocks=7251034112, rtextents=7251034112
         =                       rgcount=110642 rgsize=65536 extents
         =                       zoned=1      start=73269248 reserved=0
Resetting zones...Done.
```

The formatted disk can now be mounted. No other setup is necessary.

```plaintext
# mount /dev/sda /mnt
```

The kernel messages will signal that *XFS* zoned device support is still
labelled as *experimental*.

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem d2d4bc64-7bcb-4b25-bb05-22352a4ab4b4
XFS (sda): Ending clean mount
XFS (sda): 110642 zones of 65536 blocks size (128 max open)
```

### Other Zoned Block Devices

To format zoned block devices lacking conventional zones for use with *XFS*
(e.g. an NVMe Zoned Namespace SSD), a separate conventional block device must
be prepared to use as *XFS* main device (for storing metadata). Typically, the
main device capacity should be at least 1% of the total capacity of the zoned
block device. If the zoned block device used is an NVMe ZNS SSD, this separate
conventional block device can be a separate conventional namespace on the same
SSD.  Zoned block devices that have conventional zones can also be used only
for the realtime device. This is useful to combine an SSD for metadata with an
HDD for file data.

In this example, the (zoned) NVMe ZNS SSD /dev/nvme0n2 is used as the realtime
device and the conventional SSD /dev/nvme2n1 is used as the main device.

```plaintext
# mkfs.xfs -r rtdev=/dev/nvme0n2 /dev/nvme2n1
meta-data=/dev/nvme2n1           isize=512    agcount=16, agsize=61047165 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=976754640, imaxpct=5
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=0
log      =internal log           bsize=4096   blocks=476930, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =/dev/nvme0n2           extsz=4096   blocks=999180288, rtextents=999180288
         =                       rgcount=3624 rgsize=275712 extents
         =                       zoned=1      start=0 reserved=0
Discarding blocks...Done.
Resetting zones...Done.
```

Mounting the file system requires specifying both the main and realtime devices
with the mount command.

```plaintext
# mount -o rtdev=/dev/nvme0n2 /dev/nvme2n1 /mnt
```

The kernel messages will signal that *XFS* zoned device support is still
labelled as *experimental*.

```plaintext
XFS (nvme2n1): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (nvme2n1): Mounting V5 Filesystem eb1fe112-bb66-4fec-9e6d-24cc2dfeb48e
XFS (nvme2n1): Ending clean mount
XFS (nvme2n1): 3624 zones of 275712 blocks size (14 max open)
```

### Tuning

By default, *XFS* uses the maximum number of open zones of the device minus one
as the limit for the maximum number of zones that can be simultaneously used to
write file data. For a mounted file system, this limit can be checked using the
*max_open_zones* configfs attribute.

```plaintext
# cat /sys/block/sda/queue/max_open_zones
128
# mkfs.xfs /dev/sda
# mount /dev/sda /mnt
# cat /sys/fs/xfs/sda/zoned/max_open_zones
127
```

Depending on the application workload and the zoned device used, reducing this
limit can improve write performance, albeit at the risk of increasing file
fragmentation, which can negatively impact read performance. Reducing the limit
on the maximum number of open realtime groups is done using the *max_open_zones*
mount option.

```plaintext
# mount -o max_open_zones=32 /dev/sdb /mnt
# cat /sys/fs/xfs/sdb/zoned/max_open_zones
31
```

The garbage collection threshold threshold can be configured in *sysfs* for
each file system using the *zonegc_low_space* attribute.

The default attribute value is 0, indicating that *XFS* tries to ensures that
there is at least one free zone available for each open zone, as long as there
is free space available.

```plaintext
# mount /dev/sdb /mnt
# cat /sys/fs/xfs/sdb/zoned/zonegc_low_space
0
```

To more aggressively garbage-collect reclaimable zones, *zonegc_low_space* can
be increased. A value X indicates that *XFS* will attempt reclaiming zones to
have X percent of the unused storage space available for writing.

```plaintext
# echo 5 > /sys/fs/xfs/sdb/zoned/zonegc_low_space
# cat /sys/fs/xfs/sdb/zoned/zonegc_low_space
5
```

### Placing Data on the Main Device

In *XFS*, the *realtime* attribute for files controls if they are placed on the
realtime device, and the *rtinherit* bit controls if files created inside a
directory and subdirectories of it are placed on the realtime device.

When using *XFS* on a zoned block devices, all file data is placed by default
on the realtime (zoned) device. That is, the *rtinherit* attribute on the file
system root directory is set by default. The *rtinherit* attribute can be
cleared for any directory and new files created in that hierarchy will be placed
on the main device. Similarly the *realtime* attribute can be cleared on a file
that does not have data allocated yet, and data allocated after that point will
be allocated on the main device.

```plaintext
# mkdir /mnt/dir
# xfs_io -c 'lsattr' /mnt/dir
-------t--------X /mnt/dir
```

A user can clear the *rtinherit* attribute for a file or a directory to store
a file data on the main device.

```plaintext
# xfs_io -c 'chattr -t' /mnt/dir
# xfs_io -c 'lsattr' /mnt/dir
----------------X /mnt/dir
```

:::note
Typically space on the main device is very limited and intended for metadata.
So this option should be used with care to avoid filling up the main device
capacity as that would result in "no space available" (ENOSPC) errors even if
free space is available on the realtime device.
:::

## Implementation

*XFS* zoned storage support is based on the *XFS* realtime device feature.
An *XFS* realtime device is a separate storage device managed by a separate
space allocator to store selective file data. *XFS* uses the realtime device to
manage zoned storage by replacing the realtime space allocator with a zoned
space allocator. With zoned devices, by default file data is stored on
the realtime device, while metadata is stored on the main device, which must
be randomly writeable.

*XFS* metadata is space efficient thanks to the use of variable-length extents,
and thus *XFS* needs less than 1% conventional space for metadata. *XFS* uses
the no-overwrite support originally added to support reference-counted block
sharing (reflink) to support overwriting file data.

*XFS* splits the storage address space into *allocation groups* for the main
device and *realtime groups* for the realtime device (the zoned block device).
*XFS* manages free space and the physical-to-logical reverse mapping locally in
each group to improve scalability.  With zoned block devices, each realtime
group always maps to exactly one hardware zone on the device.

*XFS* tracks available free space using the persistent zone condition and zone
write pointer provided by the zoned device, and thus does not need any
persistent allocator metadata for the zoned realtime device.

*XFS* always writes file data on zoned block devices using Zone Append
operations as that avoids serializing writes to a single zone.  For devices that
do not support Zone Append natively (e.g. SMR hard-disks), *XFS* relies on the
Linux block layer emulation (see [Zone Write
Plugging](/docs/linux/sched#zone-write-plugging)).

*XFS* can write to as many open groups (zones) as the hardware offers.

One open zone is always reserved for garbage collection, while all other open
zones are available for user file I/Os. To ensure that the number of open zones
stays under the hardware open zone limit, a new zone is only opened when all
writes to the previously open zone have completed.

*XFS* zone allocator by default tries to avoid fragmenting files. If the files
being written to are still open, *XFS* attempts to separate the data for each
file into different zones. When starting to write to a file, a free zone is
chosen as the file data write location. If no free zone is available, or if the
number of open zones has reached the limit, the least recently used open zone is
used to write the file data. If the file has already been closed by the time of
writeback (buffered I/O case), file data are co-located to pack multiple files
tightly to improve read performance.

To reduce garbage collection overhead, the zone allocator aims to fill zones
with data of similar lifetime. The allocator assumes that all data in a file
have similar lifetime. The per-file *F_SET_RW_HINT* file control system call
(*fcntl*) interface allows applications to indicate if data is short, medium,
long, or extremely long lived to the kernel. *XFS* uses these lifetime hints to
guide zone selection: file data from different files marked as having the same
lifetime are co-located in zones marked with the same lifetime.

*XFS* always immediately resets zones that do not contain valid blocks, but
otherwise does not perform background garbage collection. Instead, the garbage
collection thread (*GCD*) is woken up when the number of free zones drops below
the configurable threshold. Writers that get ahead of *GCD* are put to sleep
until *GCD* recovers enough free zones.

*GCD* implements a greedy garbage collection policy and selects the reclaimable
zone with the least number of valid blocks. *GCD* does not hold locks over I/O,
and thus garbage collection does not directly interfere with applications
accessing files that *GCD* operates on.

*GCD* uses a dedicated open zone, so that garbage-collected data is not mixed
with file data being written. Using a dedicated open zone for garbage collection
reduces write amplification as garbage collected data can be assumed to be
longer-lived than incoming user data. Adequate free space is set aside for *GCD*
so that it is never blocked by user writes and can provide a free zone to user
writers as long as the file system reports free blocks.

## Limitations

Because zoned devices do not allow in-place updates, persistent preallocations
can fundamentally not be supported with a zoned block device.

Additionally, disk quotas and reference-counted block sharing (reflink) are
currently not supported (that is expected to change in the near future).

## System Requirements

*XFS* native zoned block device support was introduced with kernel version 6.15.
The kernel must be compiled with *XFS* support (the kernel configuration
parameter CONFIG_XFS_FS must be enabled). *XFS* realtime device feature is also
required (the kernel configuration parameter CONFIG_XFS_RT must be enabled).

Installing version 6.15 or higher of the *xfsprogs* package providing *XFS*
user space tools (e.g. `mkfs.xfs`) is also required.

```plaintext
# mkfs.xfs -V
mkfs.xfs version 6.15.0
```

If your Linux distribution does not provides an adequate version of *xfsprogs*,
this project source code can be downloaded from <a
href="https://git.kernel.org/pub/scm/fs/xfs/xfsprogs-dev.git" target="_blank">
kernel.org</a>. See the <a
href="https://git.kernel.org/pub/scm/fs/xfs/xfsprogs-dev.git/tree/doc/INSTALL"
target="_blank">INSTALL</a> file for instructions on how to compile and install
this package.
