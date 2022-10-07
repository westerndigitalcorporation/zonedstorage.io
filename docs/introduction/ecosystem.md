---
id: ecosystem
title: Linux Ecosystem
sidebar_label: Linux Ecosystem
---

# Linux Ecosystem 

Zoned storage devices are not a plug-and-play replacement of traditional
storage devices.  This is due to the sequential write constraint imposed on
zones: special software and drivers are required to ensure that applications
comply with zoned-storage device constraints during operation.

Support for zoned storage devices was added to the Linux&reg; kernel with the
release of version 4.10.0. This addition enabled support for zoned storage at
different levels (the disk driver level, the file system level, and the device
mapper driver level), and offered a range of options for supporting
applications. This support is based on the Zoned Block Device (ZBD)
abstraction.

A zoned block device is a generic representation of a zoned storage device, and
is independent of the device access protocol and interface. This abstraction is
the basis of Linux kernel support for zoned storage.

The interface associated with the ZBD device abstraction is an extension of the
traditional Linux block device interface. The ZBD interface (with the help of
device drivers) provides a generic zone-management interface to kernel
subsystems (e.g. File systems) and to user applications that is compatible
across all zoned device types and all access protocols.

A simplified view of the kernel structure, including the ZBD interface, is
shown in the figure below.

<Image src="intro-linux-zbd.png"
title="Linux kernel Zoned Storage Device Support Overview"/>

The implementation of the Linux-ZBD interface provides functions for
discovering the zone configuration of a given zoned device as well as functions
for managing zones (for example, "zone reset"). Linux-kernel ZBD support also
modifies the kernel block I/O stack to ensure that all device access
constraints are met. These device access constraints include "zone spanning
commands" and "sequential write ordering". 