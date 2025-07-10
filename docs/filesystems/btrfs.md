---
id: btrfs
title: BTRFS
sidebar_label: BTRFS
---

# BTRFS File System

*BTRFS* is a file system based on the copy-on-write (CoW) principle. This
principle has the result that no block update can be written in-place. 

:::info System Requirements
- Linux kernel: 5.12+ (for SMR hard-disks) or 5.16+ (for NVMe ZNS SSDs).
- btrfs-progs: 5.12+ (for SMR hard-disks) or 5.15+ (for NVMe ZNS SSDs).
- util-linux: 2.38+. More information can be found [here](/docs/tools/util-linux).
- The [mq-deadline](/docs/linux/sched#block-io-scheduler-configuration) block   
  I/O scheduler for kernel versions prior to 6.10.
:::

## Usage

First, check that your system meets the
[requirements](/docs/filesystems/btrfs#system-requirements).

To format a zoned block device for use with *BTRFS*, use the command
`mkfs.btrfs`.

```plaintext
# mkfs.btrfs /dev/sda
btrfs-progs v6.15
See https://btrfs.readthedocs.io for more information.

zoned: /dev/sdb: host-managed device detected, setting zoned feature
Resetting device zones /dev/sdb (111760 zones) ...
NOTE: several default settings have changed in version 5.15, please make sure
      this does not affect your deployments:
      - DUP for metadata (-m dup)
      - enabled no-holes (-O no-holes)
      - enabled free-space-tree (-R free-space-tree)

Label:              (null)
UUID:               176b7407-d046-43da-9f7f-d3512a2059ed
Node size:          16384
Sector size:        4096	(CPU page size: 4096)
Filesystem size:    27.29TiB
Block group profiles:
  Data:             single          512.00MiB
  Metadata:         DUP             256.00MiB
  System:           DUP             256.00MiB
SSD detected:       no
Zoned device:       yes
  Zone size:        256.00MiB
Features:           extref, skinny-metadata, no-holes, free-space-tree, zoned
Checksum:           crc32c
Number of devices:  1
Devices:
   ID        SIZE   ZONES  PATH
    1    27.29TiB  111760  /dev/sdb
```

The formatted block device can now be mounted. No other setup is necessary.

```plaintext
# mount /dev/sda /mnt
```

The kernel messages will show the following information.

```plaintext
BTRFS: device fsid 176b7407-d046-43da-9f7f-d3512a2059ed devid 1 transid 8 /dev/sda (8:16) scanned by mount (3654)
BTRFS info (device sdb): first mount of filesystem 176b7407-d046-43da-9f7f-d3512a2059ed
BTRFS info (device sdb): using crc32c (crc32c-x86) checksum algorithm
BTRFS info (device sdb): using free-space-tree
BTRFS info (device sdb): host-managed zoned block device /dev/sdb, 111760 zones of 268435456 bytes
BTRFS info (device sdb): zoned mode enabled with zone size 268435456
BTRFS info (device sdb): checking UUID tree
```

## Implementation Overview

The implementation of *BTRFS* zoned block devices support required several
changes in different areas of *BTRFS* code.

- Super-block management
- Block allocation
- Device I/O management

### Super-block Management

Zoned block device support was added to *BTRFS* with kernel 5.12. Because
super-blocks are the only on-disk data structure with a fixed location in
*BTRFS*, zoned block device support introduces the concept of log-structured
super-blocks to eliminate in-place updates (overwrites) of fixed super block
locations. Zoned mode reserves two consecutive zones to hold each of the
super-blocks (primary and backup super-blocks) in *BTRFS*. When a new
super-block is written, it is appended to its respective super-block zone.
After the first super-block zone is filled, the next super block is written to
the second super-block zone and the first is reset. At mount time, *BTRFS*
can find the latest version of the super-block by looking at the position of
the zone write pointer of the super-block zones. The most recent and valid
super-block is always the last  block stored before the write pointer
position.

### Block Allocation

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

### Device I/O Management

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

When dealing with *BTRFS* volumes that are composed of multiple disks,
restrictions are added to ensure that all the disks have the same zone model
(and in the case of zoned block devices, the same zone size). This matches the
existing *BTRFS* constraint that dictates that all device extents in a block
group must have the same size.

All writes to data block groups use [Zone Append
writing](/docs/introduction/zns#zone-append), which makes it possible to maintain
a high queue depth without violating the device zone's sequential write
constraints. Every write to dedicated meta-data block groups is serialized
with a file-system-global zoned metadata I/O lock.

### Zone Capacity Support

SSDs with Zoned Namespace support can have a per [zone capacity that is smaller than the zone
size](/docs/introduction/zns#zone-capacity-and-zone-size). To support such
devices, *BTRFS* ensures that block allocation and accounting considers only
the blocks in a zone that are within the zone capacity. This support for zone
capacity has been available since Linux kernel version 5.16. Also, since kernel
5.16, *BTRFS* keeps track of the number of active zones on a device and issues
"Zone Finish" commands as needed.

### Limitations

Not all features currently available in *BTRFS* are supported when using a zoned
block device.

These unavailable features include:

- RAID 5 and 6 profiles support
- NOCOW support
- Support for fallocate(2)
- Mixed data and meta-data block groups

Support for RAID levels 0, 1 and 10 is still considered experimental and
requires a kernel compiled with the `CONFIG_BTRFS_EXPERIMENTAL=y` configuration
option as well as *btrfs-progs* configured with the
`./configure --enable-experimental` command.

## System Requirements

In order to use *BTRFS* on zoned block devices, the following minimum system
requirements must be met:
- Linux kernel 5.12 (for SMR hard-disks) or 5.16 (for NVMe ZNS SSDs)
- *btrfs-progs* 5.12 (for SMR hard-disks) or 5.15 (for NVMe ZNS SSDs)
- *util-linux* 2.38

The source code for *btrfs-progs* <a href="https://github.com/kdave/btrfs-progs"
target="_blank">is hosted on GitHub</a>. More information on *util-linux* can be
found [here](/docs/tools/util-linux).

Kernels prior to version 6.10 and supporting *BTRFS* on zoned block devices will
automatically select the *mq_deadline* block IO scheduler by default for any
SMR hard-disk that is used in a zoned *BTRFS* volume. This
ensures [write ordering correctness](/docs/linux/sched).

For NVMe ZNS SSD devices, the *mq-deadline* scheduler must be set manually to
ensure that the regular write operations used by *BTRFS* are delivered to the
device in sequential order. For a NVMe Zoned Namespace device */dev/nvmeXnY*,
this is done with the following command:

```plaintext
# echo mq-deadline > /sys/block/nvmeXnY/queue/scheduler
```

Alternatively, the following udev rule can be used to automatically set the
*mq-deadline* scheduler for all zoned block devices that have been formatted
with BTRFS.

```plain text
SUBSYSTEM!="block", GOTO="btrfs_end"
ACTION!="add|change", GOTO="btrfs_end"
ENV{ID_FS_TYPE}!="btrfs", GOTO="btrfs_end"

ATTR{queue/zoned}=="host-managed", ATTR{queue/scheduler}="mq-deadline"

LABEL="btrfs_end"
```

Using the *mq_deadline* block IO scheduler for zoned block devices is not
mandatory since kernel version 6.10. However, for performance reasons, the use
of the *mq_deadline* I/O scheduler is still recommended for SMR hard-disks. For
NVMe ZNS SSDs, using the *none* scheduler (no I/O scheduling) is recommended.
