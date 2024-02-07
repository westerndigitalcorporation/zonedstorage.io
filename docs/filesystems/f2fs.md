---
id: f2fs
title: f2fs
sidebar_label: f2fs
---

# f2fs File System

The *Flash-Friendly File System* (*f2fs*) was designed on the basis of a
log-structured file system approach, but was modified to avoid the classical
problems of the traditional log-structured approach (e.g. the snowball effect
of "wandering trees" and the high "cleaning overhead").

*f2fs* supports various parameters not only for configuring on-disk layout but
also for selecting allocation and cleaning algorithms.

:::note System Requirements
- Linux kernel: 5.12+ (for SMR) or 5.16+ (for ZNS).
- f2fs-tools: 1.12+ (for SMR) or 1.14+ (for ZNS). 
- I/O scheduler: [mq-deadline to be configured for the block device](/docs/linux/sched#block-io-scheduler-configuration).
:::

# Usage Examples

To format a zoned block device, *that has conventional zones*, with *mkfs.f2fs*, the option `-m` must be
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

If the zoned block device, *does not have conventional zones*, then a regular
block device can be used for f2fs' metadata.
It is formatted by using the *-c* option of *mkfs.f2fs* as shown in the following example:

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

In the above command, `/dev/nvme1n1` is the block device file of the zoned 
namespace that will be used for the *f2fs* volume, and `/dev/nvme0n1`is the namespace
used for the *f2fs* metadata.

To mount the volume formatted with the above command, the regular block device
must be specified:

```plaintext
# mount -t f2fs /dev/nvme0n1 /mnt/f2fs/
```


# Implementation Overview

## Zoned Block Device Support

Zoned block device support was added to *f2fs* with kernel 4.10. Because *f2fs*
uses a metadata-block on-disk format with fixed-block location, only zoned
block devices that include conventional zones are supported. Zoned devices
composed entirely of sequential zones cannot be used with *f2fs* as a
standalone device and they require a multi-device setup in order to place
metadata blocks on randomly writable storage. *f2fs* supports multi-device
setup where multiple block device address spaces are linearly concatenated to
form a logically larger block device. The [*dm-linear*](/docs/linux/dm#dm-linear)
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

## Zone Capacity Support

ZNS SSDs can have a per [zone capacity that is smaller than the zone
size](/docs/introduction/zns#zone-capacity-and-zone-size). To support ZNS
devices, *f2fs* ensures that block allocation and accounting considers only the
blocks in a zone that are within the zone's capacity. This support for NVMe ZNS
zone capacity has been available since it was introduced in Linux kernel version
5.10.

*f2fs* volumes need some storage space that is randomly writable in order 
to store and update in-place metadata blocks for the volume. Since NVMe zoned
namespaces do not have conventional zones, a *f2fs* volume cannot be
self-contained within a single NVMe zoned namespace. To format an *f2fs* volume
using a NVMe zoned namespace, a multi-device volume format must be used in order
to provide an additional regular block device to store the volume metadata 
blocks. This additional regular block device can be either a regular namespace 
on the same NVMe device or a regular namespace on another NVMe device.

## Limitations

*f2fs* uses 32-bit block numbers with a block size of 4 KB. This results in a
maximum volume size of 16 TB. Any device or combination of devices (for a
multi-device volume) with a total capacity that is larger than 16 TB cannot 
be used with *f2fs*.

To overcome this limit, the [*dm-linear*](/docs/linux/dm#dm-linear) device
mapper target can be used to partition a zoned block device into serviceable,
smaller logical devices. This configuration must ensure that each logical device
that is created is assigned a sufficient amount of conventional zones to store
*f2fs* fixed location metadata blocks.

