---
id: zoned-storage
title: Zoned Storage Overview
sidebar_label: Zoned Storage Devices
---

import Image from '/src/components/Image';

# Zoned Storage Devices

Zoned storage devices are a class of storage devices that have an address space
that is divided into zones that have write constraints that are different from
regular storage devices.

## Principle

Zones in zoned storage devices must be written sequentially. This is called the
**sequential write constraint**. Each zone in the device address space has a
write pointer that keeps track of the position of the next write. Data in a
zone cannot be directly overwritten: before being overwritten, the zone must
first be erased using a special command (zone reset). The figure below
illustrates this principle.

<Image src="intro-zoned-storage.png"
title="Zoned Storage Devices Principle"/>

Zoned storage devices can be implemented using various recording and media
technologies. The most common form of zoned storage today uses the SCSI Zoned
Block Commands (ZBC) and Zoned ATA Commands (ZAC) interfaces on [Shingled
Magnetic Recording (SMR)](./smr) HDDs. ZBC and ZAC enable a zoned block storage
model; SMR technology enables continued areal density growth that makes it
possible to meet expanding data needs, and SMR technology requires the zoned
block access model.

Solid State Drive (SSD) storage devices can also implement a zoned interface in
order to reduce write amplification, to reduce the device's DRAM needs, and to
improve the quality of service at scale. The [NVMe Zoned NameSpace
(ZNS)](./zns) is a technical proposal of the NVMe standard committee that adds
a zoned storage interface to the NVMe interface standard.

## Linux Ecosystem Support

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

## Developing for Zoned Storage

There are several ways to design a system application for zoned storage.  The
way that is right for you depends upon your system's structure and your ability
to modify the application layer and your ability to choose a particular Linux
kernel version.

1. **Direct device management with passthrough commands**

   Users that own software applications and do not depend on the operating
   system and file system to control the device can directly use the device
   interface protocol to issue zone management commands by using a
   passthrough interface. In these cases, the applications must be
   rewritten with the new command sets and they must ensure that all data
   streams are sequential. The [*libzbc* library](../tools/libzbc) provides
   functions to help with this approach.

2. **Direct device management with block device file access**

   Managing zoned storage directly from the application layer is a valid
   approach but can be difficult to implement. This is true particularly in
   use cases where several device features must be combined (for example, when
   I/O priorities are used). Application level support can be simplified by
   relying on the kernel zoned block device support which allows accessing and
   managing zoned devices using regular POSIX system calls. While this does not
   remove the zoned device access constraints from the application scope,
   implementation of sequential write streams and zone management can be
   simplified. The [*libzbd* library](../tools/libzbd) provides functions to
   help with this approach. Using the [*zonefs*](../linux/fs#zonefs) file system
   can also simplify application implementation.

3. **Device mapper and POSIX file systems**

   If a user lacks software control at the application level but retains
   control over the choice of the version of the Linux kernel, more advanced
   kernel support features such as zoned block device compliant file systems
   (e.g. [*btrfs*](../linux/fs#btrfs)) can be used to hide zoned storage access
   constraints from the application. Users may also rely on a device mapper
   driver that exposes zoned storage devices as regular block devices (for
   instance, the [*dm-zoned* device mapper](../linux/dm#dm-zoned)). If this
   solution is used, existing file systems can be used without any modification.

More information on the features provided by the Linux kernel for different
versions can be found [here](../linux/overview).

To get started with zoned storage, see the [Getting Started](../getting-started)
section, which details the first steps necessary to set up and verify a system
that uses SMR disks.

The [Linux Distributions](../distributions/linux) section provides information
regarding the availability of the ZBD interface on various Linux distributions.

Open source tools and libraries that support zoned storage are documented in the
[Tools and Libraries](../tools) section.

