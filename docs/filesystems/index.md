---
id: index
title: Overview
sidebar_label: Overview
slug: /filesystems
---

Linux includes several general purpose file systems with native zoned block
device support.

## Supported File Systems

The list of Linux file systems with native zoned block device support is as
follows.

* [XFS](/docs/filesystems/xfs)
* [BTRFS](/docs/filesystems/btrfs)
* [F2FS](/docs/filesystems/f2fs)

These general purpose file systems are recommended for applications that cannot
be easily modified to use a zoned block device directly.

In addition to these file systems, the Linux kernel also provides the
[zonefs file system](/docs/filesystems/zonefs) as an alternative interface for
using zoned block device files directly. Unlike the general purpose file systems
listed above, *zonefs* exposes the sequential write constraint of the device
zones to the user and thus mandates using a zone compliant application.

## Other File Systems

File systems lacking native support for zoned block devices can be used
together with the [*dm-zoned*](/docs/device-mapper/dm-zoned) device mapper.
