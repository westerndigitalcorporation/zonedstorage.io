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
order to reduce write amplification, to reduce the device's DRAM needs,  and to
improve the quality of service at scale. The [NVMe Zoned NameSpace
(ZNS)](./zns) is a technical proposal of the NVMe standard committee that adds
a zoned storage interface to the NVMe interface standard.

## Linux Ecosystem Support

Zoned storage devices are not plug-and-play replacement of traditional storage
devices due to the sequential write constraints of zones. Special software and
drivers are required to ensure compliance of the application operation to the
device constraints.

Support for zoned storage device was added to the Linux&reg; kernel with the
release of version 4.10.0 and enables support for zoned storage at different
levels (disk driver, file system, device mapper drivers), offering a wide range
of options for supporting applications. This support is based on the
Zoned Block Device (ZBD) abstraction.

A zoned block device is a generic representation of a zoned storage device
independent of the device access protocol and interface. This abstraction is
the basis of Linux kernel support for zoned storage.

The interface associated with the ZBD device abstraction is an extension to the
traditional Linux block device interface. The ZBD interface, combined with
device drivers, provide to kernel subsystems (e.g. File systems) and to user
applications a generic zone management interface compatible across all zoned
device types and access protocols.

A simplified view of the kernel structure including the ZBD interface is shown
in the figure below.

<Image src="intro-linux-zbd.png"
title="Linux kernel Zoned Storage Device Support Overview"/>

Linux ZBD interface implementation provides functions to discover the zone
configuration of a zoned device and functions to manage zones (e.g. Zone reset).
Furthermore, the Linux kernel ZBD support also modifies the kernel block I/O
stack to ensure that the device access constraints (zone spanning commands,
sequential write ordering, etc) are met.

## Developing for Zoned Storage

There are several ways to design a system application for zoned storage
depending on one's system structure and ability to modify the application layer
and Linux kernel being used.

1. Users that own software applications and do not depend on the operating
   system and file system to control the device can directly use the device
   interface protocol to issue zone management commands using a passthrough
   interface. In such case, the applications will need to be re-written with
   the new command sets as well as ensuring that all data streams are
   sequential. The [*libzbc* library](../tools/libzbc) provides functions
   facilitating the implementation of applications using such approach.

2. Managing zoned storage directly from the application layer is a valid
   approach but can be difficult to implement, particularly for use cases where
   several device features must be combined (e.g. Using I/O priorities).
   Application level support can be simplified by relying on the
   kernel ZBD support which allows accessing and managing zoned devices using
   regular POSIX system calls. While this does not remove the zoned device
   access constraints from the application scope, implementation of sequential
   write streams and zone management can be simplified.

3. If a user lacks the software control at the application level while retaining
   control over Linux kernel version choices, more advanced kernel support
   features such as ZBD compliant file systems can be used to hide zoned storage
   access constraints from the application. Users may also rely on
   a device mapper driver exposing zoned storage devices as regular block
   devices. With such solution, existing file systems can be used without any
   modification.

More information on the features provided by the Linux kernel for different
versions can be found [here](../linux/overview).

To get started with zoned storage, the
[Getting Started with SMR](../getting-started/prerequisites) section details
the first step necessary to setup and verify a system using SMR disks. The
[Linux Distributions](../distributions/linux) section provides information
regarding the availability of the ZBD interface on various Linux distributions.
Various open source tools and libraries supporting zoned storage are documented
in the [Tools and Libraries](../tools) section.

