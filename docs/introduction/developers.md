---
id: develop
title: Developers
sidebar_label: Developers
---

# Developers

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