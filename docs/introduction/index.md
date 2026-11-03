---
id: index
title: Overview
sidebar_label: Overview
slug: /introduction
---

# Introduction to Zoned Storage

This section provides information about zoned storage principles and underlying
storage device technologies as well as an overview of emulated devices in
Linux.

* [Zoned Storage Devices](/docs/introduction/zoned-storage): Principle of
  operation of zoned storage devices.

* [Shingled Magnetic Recording Hard Disks](/docs/introduction/smr): Learn about
  Shingled Magnetic Recording (SMR) technology and its use in zoned hard-disks.

* [NVMe Zoned Namespaces Devices](/docs/introduction/zns): Learn about
  NVMe&trade; Zoned Namespace (ZNS) and its use in solid state drives (SSDs).

* [Emulated Zoned Storage Devices](/docs/device-emulation): Emulated zoned
  block devices make it possible to do application development and tests even if
  you do not have access to zoned storage hardware. Linux offers several ways
  available to create an emulated zoned block device. The [getting started
  guide](/docs/getting-started/zbd-emulation) provides simple usage examples of
  the *zloop* and *null_blk* drivers to quickly set up zoned block devices on a
  compatible Linux system.
