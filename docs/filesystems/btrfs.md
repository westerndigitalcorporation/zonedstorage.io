---
id: btrfs
title: btrfs
sidebar_label: btrfs
---

# btrfs File System

*Btrfs* is a file system based on the copy-on-write (CoW) principle. This
principle has the result that no block update can be written in-place. 
*Btrfs* currently has experimental support for zoned block devices.

:::note System Requirements
- Linux kernel: 5.12+ (for SMR) or 5.16+ (for ZNS).
- btrfs-progs: 5.12+ (for SMR) or 5.15+ (for ZNS). 
- util-linux: 2.38+. More information can be found [here](/docs/tools/util-linux).
- I/O scheduler: [mq-deadline to be configured for the block device](/docs/linux/sched#block-io-scheduler-configuration).
:::

## Usage

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

## Implementation

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
writing](/docs/introduction/zns#zone-append), which makes it possible to maintain
a high queue depth without violating the device zone's sequential write
constraints. Every write to dedicated meta-data block groups is serialized
with a file-system-global zoned metadata I/O lock.

### Zone Capacity Support

SSDs with Zoned Namespace support can have a per [zone capacity that is smaller than the zone
size](/docs/introduction/zns#zone-capacity-and-zone-size). To support such
devices, *btrfs* ensures that block allocation and accounting considers only
the blocks in a zone that are within the zone capacity. This support for zone capacity has been available since Linux kernel version 5.16. Also,
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
- Linux kernel 5.12 (for SMR) or 5.16 (for SSD /w ZNS support)
- *btrfs-progs* 5.12 (for SMR) or 5.15 (for SSD /w ZNS support)
- *util-linux* 2.38

The source code for *btrfs-progs* <a href="https://github.com/kdave/btrfs-progs"
target="_blank">is hosted on GitHub</a>. More information on *util-linux* can be
found [here](/docs/tools/util-linux).

If a kernel supports *btrfs* on a zoned block device, it will automatically
select the *mq_deadline* block IO scheduler by default. This ensures [write
ordering correctness](/docs/linux/sched) for any SMR hard-disk that is used in a
zoned *btrfs* volume.

As in the case of an SSD with ZNS support, the *mq-deadline*
scheduler must be set manually to ensure that the regular write operations used
by *btrfs* are delivered to the device in sequential order. For a NVMe zoned
namespace device */dev/nvmeXnY*, this is done with the following command:

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
