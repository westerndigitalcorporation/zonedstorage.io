# System Prerequisites

The zoned block device (ZBD) interface that supports ZBC and ZAC disks was
added to Linux&reg; in kernel version 4.10. All Linux kernel versions since
4.10 include the ZBD interface.

!!! Note

    Linux kernels prior to version 4.10 do not implement the ZBD interface.  If
    you use a kernel older than kernel 4.10, you can access and manage ZBC and
    ZAC disks, but only in a limited way. This is discussed in more detail in
    the [Linux Support](../linux/overview.md) document.

To verify that the zoned device has been discovered and correctly initalized,
several user utilities must be installed on the test system. These utilities are discussed in more detail in the section called [User Utilities](#prerequisites_user_utilities).

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
can be found <a href="https://www.kernel.org/"
target="_blank">here</a>.

## Kernel Version and ZBD Support

Two conditions must be met to ensure that a system Linux kernel supports the
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

!!! Note
    For kernels older than kernel version 4.10, the output of these
    commands is always empty.

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

By default, Linux kernel does not provide any guarantee on the order in which
commands are delivered to a block device. That is, an application writing
sequentially to a disk may see write commands being delivered to the disk in a
different order. This can cause write errors when writing to a zoned device
sequential zones.

To avoid this problem, a zone write lock mechanism serializing writes to
sequential zones is implemented by all kernels supporting zoned block devices.
For kernel versions between 4.10 and 4.15 included, no special configuration is
necessary and the kernel will provide guarantees that write commands are
delivered to the device in the same order as the application write requests
issuing order.

However, starting with kernel version 4.16, zone write locking implementation
was moved to the *deadline* and *mq-deadline* block I/O scheduler. Using this
scheduler with zoned block devices is mandatory to ensure write command order
guarantees.

!!!note
	The *mq-deadline* block I/O scheduler is enabled only if the SCSI
	multi-queue (*scsi-mq*) infrastructure is enabled. This feature use can
	be controlled using the kernel boot argument *scsi_mod.use_blk_mq".
	*scsi-mq* is the default since kernel version 5.0 and the legacy single
	queue SCSI command path is no longer supported.

To verify the block I/O scheduler of a zoned disk, the following command can be
used.

```plaintext
# cat /sys/block/sdb/queue/scheduler
[none] mq-deadline kyber bfq
```

If the disk block I/O scheduler selected is not *mq-deadline* as in the example
above, the scheduler can be changed with the following command.

```plaintext
# echo deadline > /sys/block/sdb/queue/scheduler

# cat sys/block/sdb/queue/scheduler
[mq-deadline] kyber bfq none
```          

<a name="prerequisites_user_utilities">
## User Utilities
</a>

Various user level tools should also be installed in order to verify the
correct operation of zoned block devices and to troubleshoot problems.

### lsblk

The lsblk command in Linux lists block devices, including zoned block devices.
This utility is generally packaged as part of the *util-linux* package which is
installed by default on most Linux distributions.

*lsblk* usage examples are provided [here](../linux/utilities/#lsblk).

### blkzone

Similarly to the `lsblk` utility, the `blkzone` utility is another program
generally packaged as part of the *util-linux* package. This utility allows
listing (reporting) the zones of a zoned block device and to reset the write
pointer position of a range of zones of the device.

*blkzone* usage examples are provided [here](../projects/util-linux.md#blkzone).

### lsscsi

The <a href="http://sg.danny.cz/scsi/lsscsi.html" target="_blank">*lsscsi*</a>
command lists information about the SCSI devices connected to a Linux system.
*lsscsi* is generally available as a package with most Linux distributions.
Refer to your distribution documentation to find out the name of the package
providing the *lsscsi* utility.

The [linux utilities](../projects/sg3utils.md#lsscsi) page provides more information
and usage examples.

### sg3_utils

The <a href="http://sg.danny.cz/sg/sg3_utils.html" target="_blank">*sg3_utils*</a>
package is a collection of command line tools that send SCSI commands to a SCSI
device.

Since in Linux all disks are exposed as SCSI disks, including all ATA drives,
these utilities can be used to manage both SAS ZBC disks and SATA ZAC disks.
For SATA disks connected to SATA ports (e.g. An AHCI adapter), the kernel SCSI
subsystem translates SCSI commands to ATA commands.

*sg3_utils* includes three command line tools specific to ZBC disks.

<center>

| Utility Name     | SCSI Command Invoked   | Description                     |
| :--------------- | :--------------------- | :------------------------------ |
| **sg_rep_zones** | REPORT ZONES           | Get a ZBC disk zone information |
| **sg_reset_wp**  | RESET WRITE POINTER    | Reset one or all zones of ZBC disk |
| **sg_zone**      | CLOSE ZONE, FINISH ZONE, OPEN ZONE | Sends one of these commands to the given ZBC disk |

</center>

[This section](../projects/sg3utils.md#sg3_utils) shows some examples of these
utilities execution

### libzbc

*libzbc* is a user space library providing functions for manipulating ZBC and
ZAC disks.  The *libzbc* project is hosted on
<a href="https://github.com/westerndigitalcorporation/libzbc" target="_blank">
GitHub</a>. Documentation is provided in the project
<a href="https://github.com/westerndigitalcorporation/libzbc/blob/master/README.md"
target="_blank"> README</a> file. The API documentation can also be
automatically generated using *doxygen*.

*libzbc* also provides a set of command line utilities with similar
functionalities as the `blkzone` utility and *the sg3_utils* command line tools.

More information on how to compile and install *libzbc* as well as usage
examples of the command line utilities provided can be found
[here](../projects/libzbc.md).

