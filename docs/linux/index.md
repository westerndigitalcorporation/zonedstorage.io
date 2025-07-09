---
id: index
title: Overview
sidebar_label: Overview
slug: /linux
---

# Linux Kernel Support

This collection of articles describes Linux&reg; kernel core features supporting
zoned storage devices.

* [Support Overview](/docs/linux/overview): See an overview of Linux kernel and
  Linux ecosystem support for zoned block devices.

* [Enabling Zoned Block Device Support](/docs/linux/config): Learn how to
  configure, compile and install a Linux kernel to enable zoned block device
  support.

* [User Interface](/docs/linux/zbd-api): Learn about the user application
  programming interface provided by the kernel for managing and accessing zoned
  block devices.

* [Write Command Ordering](/docs/linux/sched): Learn how the kernel handles
  sequential write operations to zones to ensure a correct execution on zoned
  block devices.

* [Partitions](/docs/linux/part): Learn more about the kernel support for
  partition tables on zoned block devices.

In addition to these core block device features, different kernel subsystems
support zoned block devices.

* The [Device Mapper](/docs/device-mapper) subsystem provides several target
  drivers supporting zoned block devices.

* Several Linux [file systems](/docs/filesystems) include native support for
  zoned block devices.
