---
id: index
title: Overview
sidebar_label: Overview
slug: /filesystems
---

## Supported File Systems

Multiple file systems support zoned block devices. This collection of file systems
have support for zoned block devices:

* [btrfs](/docs/filesystems/btrfs)
* [f2fs](/docs/filesystems/f2fs)
* [zonefs](/docs/filesystems/zonefs)

Other file systems, with does not natively support zoned block devices, can be used
together with a device mapper, such as [*dm-zoned*](/docs/linux/dm#dm-zoned).

## In-progress Work

### XFS

*XFS* currently does not support zoned block devices. An early <a href="http://xfs.org/images/f/f6/Xfs-smr-structure-0.2.pdf"
target="_blank"> design document</a> discussed the development work necessary
to support host aware and host managed disks with *XFS*. Parts of this design
have already been implemented and included into the kernel stable releases
(e.g. the "per inode reverse block mapping b-trees" feature). However, more
work is necessary to fully support zoned block devices and is in active development.

### ext4

Attempts at improving *ext4* performance with host aware zoned block devices by
making changes to the file system journal management are described in in <a
href="https://lwn.net/Articles/720226/" target="_blank">this article</a>. These
changes are small and succeed in maintaining good performance. However, support
for host managed zoned block devices is not provided, because some of the
fundamental aspects of *ext4* design cannot easily be changed to match host
managed device constraints.

The field of host optimizations for host aware zoned block devices remains in
the research phase and is not included in *ext4* stable kernel releases. It
should also be noted that *ext4* does not support host managed disks. 

