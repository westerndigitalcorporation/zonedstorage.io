---
id: linux
title: Setting-up a Zoned Storage Compatible Linux System
sidebar_label: Setting-up a Zoned Storage Compatible Linux System
---

# Setting-up a Zoned Storage Compatible Linux System

The zoned block device (ZBD) interface that supports [SCSI ZBC and ATA ZAC
disks](../introduction/smr.md) was added to the Linux&reg; kernel in version
4.10. [NVMe zoned namespace (ZNS)](../introduction/zns.md) devices are
supported from kernel version 5.9 (inclusive). All Linux kernel versions higher
than 5.9 can support all zoned storage devices.

:::note
Linux kernels prior to version 4.10 do not implement the zoned block device
interface. If you use a kernel older than kernel 4.10, you can access and
manage SCSI ZBC and ATA ZAC disks, but only in a limited way. This is discussed
in more detail in the [Linux Support](../linux/overview.md) document.
:::

To verify that a zoned block device has been discovered and correctly
initalized, several user utilities must be installed on the test system. These
utilities are discussed in more detail in the section called [User
Utilities](./linux#user-utilities).

## Linux Distribution

We recommend only systems with Linux kernels that are version 4.10 or
higher for use with SCSI ZBC and ATA ZAC hard disks, and version 5.9 or higher
for NVMe ZNS devices.

The easiest way to set up a zoned-storage-compatible Linux system is to use one
of the recommended Linux distributions. It is possible to configure, compile,
and install your own kernel, but this is not recommended for people without
prior experience of kernel configuration. If this is your first time setting up
a zoned-storage-compatible Linux system, use one of the recommended Linux
distributions.

More advanced users might prefer to modify their preferred system by compiling
a zoned-storage-compatible kernel and installing it from source, and then
installing all necessary user packages.

## Recommended Linux Distributions

The following Linux distributions provide zoned-storage support out of the box
(without any modification). A regular installation of any of these
distributions will provide a system that is ready to use with SMR hard disks
and ZNS SSDs.

* [Fedora 36 or above](../distributions/linux.md#fedora-linux)

* [Latest openSUSE Tumbleweed](../distributions/linux.md#opensuse)

These distributions are "rolling release" Linux distributions. They provide the
most recent stable Linux kernel, they have zoned block device support enabled,
and they have all the system user packages (e.g. [Linux system
utilities](../tools/util-linux)) necessary to support zoned storage.

Installation instructions are available on the website of each distribution.
The installation of these distributions is beyond the scope of the Zoned
Storage documentation.

## Modifying a Linux Distribution Installation

Default system kernels (and the default sets of user packages) in Linux
distributions that are not on the "Recommended Distributions" list have
different levels of support for zoned storage.  More information about the
support level of various Linux distributions can be found
[here](../distributions/linux.md).

Advanced users may want to modify their Linux distribution of choice to enable
or improve their system's zoned storage support.

Two conditions must be met to ensure that a system's Linux kernel supports the
zoned block device interface.

1. The kernel version must be 4.10.0 or higher,

2. The kernel configuration option *CONFIG_BLK_DEV_ZONED* must be enabled.

### Checking the Kernel Version

The command `uname` makes it possible to check the version of the kernel running
on a system. For example, on a *Fedora 36* distribution, this command and its
output is as follows.

```plaintext
# uname -r
5.18.11-200.fc36.x86_64
```

If the system kernel version is older than version 4.10, the kernel must
be upgraded to a more recent version to gain zoned block device support.

### Checking Zoned Block Device Support

Zoned block device support might not be enabled by default in the running
kernel. The kernel configuration option that is used to enable zoned block
device support is `CONFIG_BLK_DEV_ZONED`.

Several methods can be used to determine whether the option
`CONFIG_BLK_DEV_ZONED` has been enabled in the kernel. Not all of these
methods work for every Linux distribution. In some distributions, the
configuration file for the running kernel can be found in the `/boot` directory
or in the directory containing the kernel modules.

The following commands test whether your installed kernel supports zoned block
devices.

```plaintext
# cat /boot/config-`uname -r` | grep CONFIG_BLK_DEV_ZONED
CONFIG_BLK_DEV_ZONED=y
```

or

```plaintext
# cat /lib/modules/`uname -r`/config | grep CONFIG_BLK_DEV_ZONED
CONFIG_BLK_DEV_ZONED=y
```

If the output of one of these commands is `CONFIG_BLK_DEV_ZONED=y`,
then zoned block devices are supported by the kernel. If the output is
`CONFIG_BLK_DEV_ZONED=n`, then block device support is disabled and
the kernel must be recompiled in order to enable block device support.

:::note
For kernels older than kernel version 4.10, the output of these commands is
always empty. Kernels older than kernel version 4.10 do not support zoned block devices.
:::

If your kernel exports its configuration through the *proc* file system, use one
of the following sets of commands to retreive the status of
`CONFIG_BLK_DEV_ZONED`:

```plaintext
# modprobe configs
# cat /proc/config.gz | gunzip | grep CONFIG_BLK_DEV_ZONED
CONFIG_BLK_DEV_ZONED=y
```

or

```plaintext
# modprobe configs
# zcat /proc/config.gz | grep CONFIG_BLK_DEV_ZONED
CONFIG_BLK_DEV_ZONED=y
```

### Kernel Upgrade

If either the system kernel version is too old or if the kernel does not have
zoned block device support, a new Linux kernel must be configured, compiled and
installed to support zoned block devices.

Learn how to enable zoned block device support in the kernel configuration
[here](../linux/config.md). We recommend that you always use the
highest-available stable kernel version or a recent long-term-stable kernel
version higher than 4.10. Information on available long term and stable kernel
versions can be found <a href="https://www.kernel.org/"
target="_blank">here</a>.

## Checking a System's Configuration

A Linux system that has been properly configured for zoned block device support
requires the following: a kernel that supports zoned block devices, proper zoned
device configuration, and (in some cases) system utliities that provide zoned
block device information.

### Write Ordering Control

By default, the Linux kernel does not guarantee the order in which commands are
delivered to a block device. This means that an application that writes
sequentially to a disk might have its write commands delivered to the disk in a
different order than the order sent by the application. This might cause write
errors if the application is writing to sequential write required zones of a
zoned device.

To avoid this problem, a "zone write lock mechanism" that serializes writes to
sequential zones is implemented by all kernels that support zoned block devices.
For kernel versions between 4.10 and 4.15 (inclusive) no special configuration
is necessary and the kernel guarantees the delivery of write commands to the
device in the same order as the order of write requests issued by the
application.

In kernel version 4.16, the implementation of zone write locking was moved to
the *deadline* and *mq-deadline* block I/O scheduler. Therefore, in kernels of
version 4.16 and higher, you must use this scheduler with zoned block devices
in order to make the kernel guarantee the order of write commands.

:::note
The *mq-deadline* block I/O scheduler is enabled only if the SCSI multi-queue
(*scsi-mq*) infrastructure is enabled. This feature use can be controlled by
using the kernel boot argument *scsi_mod.use_blk_mq*. *scsi-mq* is always
enabled by default since kernel version 5.0 and the legacy single-queue SCSI
command path (*deadline* scheduler) is no longer supported.
:::

To see which block I/O scheduler a zoned disk uses, run the following command:

```plaintext
# cat /sys/block/sdb/queue/scheduler
[none] mq-deadline kyber bfq
```

If the disk block I/O scheduler that has been selected is not
*mq-deadline* as in the example above, use the following command to
change the scheduler:

```plaintext
# echo mq-deadline > /sys/block/sdb/queue/scheduler

# cat sys/block/sdb/queue/scheduler
[mq-deadline] kyber bfq none
```          

### System Utilities

Various system utilities should also be installed in order to verify the correct
operation of zoned block devices and to troubleshoot problems.

If one one of the [recommended Linux
distribution](linux#recommended-linux-distribution) is being used, these
utilities are installed by default.


#### *lsblk* and *blkzone*

The *lsblk* command in Linux lists block devices, which includes zoned block
devices. Some usage examples are provided in the [lsblk section of the tools
documentation page](../tools/util-linux#lsblk).

The *blkzone* utility lists (reports) the zones of a zoned block device and
makes it possible to reset the write pointer position of a range of zones in
the device. *blkzone* also allows executing other zone management functions such
as opening, closing and finishing a zone.

*blkzone* usage examples are provided in the [blkzone section of the tools
documentation page](../tools/util-linux#blkzone).

Both *lsblk* and *blkzone* are part of the *util-linux* package, which is
installed by default on most Linux distributions. However, the zone block device
support for these utilities (and so the existence of the *blkzone* utility
itself) depend on wether the Linux distribution used supports zoned block
devices. If the kernel was manually upgraded to enable zoned block device
support, the *util-linux* package must also be compiled and installed manually
to match the zoned block device support of the new kernel.

Information on the *util-linux* package can be found [here](../tools/util-linux).

#### lsscsi

The <a href="http://sg.danny.cz/scsi/lsscsi.html" target="_blank">*lsscsi*</a>
command lists information about the SCSI devices connected to a Linux system.
*lsscsi* is generally available as a package in most Linux distributions.
Refer to your distribution documentation to find the name of the package that
provides the *lsscsi* utility.

The [SCSI Generic Utilities](../tools/sg3utils.md#lsscsi) document provides more
information and usage examples of *lssci*.

#### sg3_utils

The <a href="http://sg.danny.cz/sg/sg3_utils.html"
target="_blank">*sg3_utils*</a> package is a collection of command line tools
that send SCSI commands to a SCSI device.

In Linux, all disks are exposed as SCSI disks. This includes ATA drives.
*sg3_utils* can be used to manage SAS ZBC disks as well as SATA ZAC disks. When
dealing with SATA disks connected to SATA ports (for example, an AHCI adapter),
the kernel ATA subsystem (libata) translates SCSI commands into ATA commands.

*sg3_utils* includes three command line tools specific to ZBC disks:

<center>

| Utility Name     | SCSI Command Invoked   | Description                       |
| :--------------- | :--------------------- | :-------------------------------- |
| **sg_rep_zones** | REPORT ZONES           | Get the ZBC disk's zone information |
| **sg_reset_wp**  | RESET WRITE POINTER    | Reset one zone or all zones of the ZBC disk |
| **sg_zone**      | CLOSE ZONE, FINISH ZONE, OPEN ZONE | Sends one of these commands to the given ZBC disk |

</center>

[This section](../tools/sg3utils.md#sg3_utils) shows some examples of these
utilities execution.
