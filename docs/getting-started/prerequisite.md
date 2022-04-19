---
id: prerequisites
title: System Prerequisites
sidebar_label: System Prerequisites
---

# System Prerequisites

The zoned block device (ZBD) interface that supports ZBC and ZAC disks was
added to Linux&reg; in kernel version 4.10. All Linux kernel versions since
4.10 include the ZBD interface.

:::note
Linux kernels prior to version 4.10 do not implement the ZBD interface.  If you
use a kernel older than kernel 4.10, you can access and manage ZBC and ZAC
disks, but only in a limited way. This is discussed in more detail in the [Linux
Support](../linux/overview.md) document.
:::

To verify that the zoned device has been discovered and correctly initalized,
several user utilities must be installed on the test system. These utilities
are discussed in more detail in the section called [User
Utilities](./prerequisites#user-utilities).

## Linux Kernel

We recommend only systems with Linux kernels that are version 4.10 or
higher for use with ZBC and ZAC hard disks. If you intend to follow
the examples in this Quick Start Guide, we recommend that you use a
Linux distribution that includes ZBD support. More information on
recommended Linux distributions can be found
[here](../distributions/linux.md).

ZNS SSDs require zone capacity support, which was introduced in
Linux kernel version 5.9. More information on ZNS SSDs can be found
[here](../introduction/zns.md).

Advanced users might want to compile and install a specific Linux
kernel version instead of using the default kernel. If this is the
case, you must enable ZBD support in that kernel.  An explanation of
how to enable ZBD support in the kernel configuration is provided
[here](../linux/config.md).  We recommend that you always use the
highest available stable kernel version or a long term stable kernel
version higher than 4.10.  Information on available kernel versions
can be found <a href="https://www.kernel.org/" target="_blank">here</a>.

## Kernel Version and ZBD Support

Two conditions must be met to ensure that a system's Linux kernel supports the
ZBD interface.

1. The kernel version must be 4.10.0 or higher,

2. The kernel compilation configuration option *CONFIG_BLK_DEV_ZONED* must be
   enabled.

### Kernel Version

The command `uname` makes it possible to check the version of the
kernel running on a system. For example, on a *Fedora 29*
distribution, this command and its output is as follows.

    # uname -r
    5.0.13-200.fc29.x86_64

### Zoned Block Device Support

Zoned block device support might not be enabled by default in the
running kernel. The kernel configuration option that is used to enable
zoned block device support is `CONFIG_BLK_DEV_ZONED`.

There are several methods that can be used to determine whether the
`CONFIG_BLK_DEV_ZONED` option has been enabled in the kernel.  Not all
of these methods work for every Linux distribution.  In some
distributions, the configuration file for the running kernel can be
found in the `/boot` directory or in the directory containing the
kernel modules.

The following commands test whether your installed kernel supports
zoned block devices.

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
always empty.
:::

If your kernel exports its configuration through the *proc* file
system, use one of the following sets of commands to retreive the
status of `CONFIG_BLK_DEV_ZONED`:

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

### Write Ordering Control

By default, the Linux kernel does not guarantee the order in which
commands are delivered to a block device. This means that an
application that writes sequentially to a disk might have its write
commands delivered to the disk in a different order than the order
sent by the application. This might cause write errors if the
application is writing to a zoned device over sequential zones.

To avoid this problem, a "zone write lock mechanism" that serializes
writes to sequential zones is implemented by all kernels that support
zoned block devices. For kernel versions between 4.10 and 4.15
(inclusive) no special configuration is necessary and the kernel
guarantees the delivery of write commands to the device in the same
order as the order of write requests issued by the application.

However, in kernel version 4.16, the implementation of zone write
locking was moved to the *deadline* and *mq-deadline*
block I/O scheduler. Therefore, in kernels of version 4.16 and
higher, you must use this scheduler with zoned block devices in order
to make the kernel guarantee the order of write commands.

:::note
The *mq-deadline* block I/O scheduler is enabled only if the SCSI multi-queue
(*scsi-mq*) infrastructure is enabled. This feature use can be controlled by
using the kernel boot argument *scsi_mod.use_blk_mq*. The default has been
*scsi-mq* since kernel version 5.0 and the legacy single-queue SCSI command path
is no longer supported.
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

## User Utilities

Various user level tools must also be installed in order to verify the
correct operation of zoned block devices and to troubleshoot problems.

### lsblk

The `lsblk` command in Linux lists block devices, which includes zoned block
devices. This utility is usually included in the *util-linux* package, which is
installed by default on most Linux distributions.

*lsblk* usage examples are provided in the [lsblk section of the tools
documentation page](../tools/util-linux#lsblk).

### blkzone

The `blkzone` utility lists (reports) the zones of a zoned block device and
makes it possible to reset the write pointer position of a range of zones in
the device. This utility is usually included in the *util-linux* package, which
is installed by default on most Linux distributions.

*blkzone* usage examples are provided in the [blkzone section of the tools
documentation page](../tools/util-linux#blkzone).

### lsscsi

The <a href="http://sg.danny.cz/scsi/lsscsi.html" target="_blank">*lsscsi*</a>
command lists information about the SCSI devices connected to a Linux system.
*lsscsi* is generally available as a package in most Linux distributions.
Refer to your distribution documentation to find the name of the package
that provides the *lsscsi* utility.

The [linux utilities](../tools/sg3utils.md#lsscsi) page provides more
information on `lssci` as well as usage examples.

### sg3_utils

The <a href="http://sg.danny.cz/sg/sg3_utils.html"
target="_blank">*sg3_utils*</a> package is a collection of command
line tools that send SCSI commands to a SCSI device.

In Linux, all disks are exposed as SCSI disks. This includes ATA
drives.  `sg3_utils` can be used to manage SAS ZBC disks as well as
SATA ZAC disks. When dealing with SATA disks connected to SATA ports
(for example, an AHCI adapter), the kernel ATA subsystem (libata)
translates SCSI commands into ATA commands.

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

### libzbc

*libzbc* is a user-space library that provides functions that are 
used to manipulate ZBC and ZAC disks.  The *libzbc* project is hosted
on <a href="https://github.com/westerndigitalcorporation/libzbc"
target="_blank"> GitHub</a>. Documentation is provided in the
project <a href="https://github.com/westerndigitalcorporation/libzbc/blob/master/README.md"
target="_blank"> README</a> file. The API documentation can be generated using
*doxygen*.

*libzbc* provides a set of command-line utilities that are
functionally similar to both the `blkzone` utility and *the sg3_utils*
command-line tools.

For more information on how to compile and install *libzbc*, as well as usage
examples of the command line utilities provided by *libzbc*, see [libzbc User
Library](../tools/libzbc.md) in the [Tools and Libraries](../tools/index.md)
documentation.

