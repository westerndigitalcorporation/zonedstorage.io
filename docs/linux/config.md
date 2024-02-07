---
id: config
title: Kernel Configuration
sidebar_label: Kernel Configuration
---

import Image from '/src/components/Image';

# Kernel Configuration

Several kernel compilation configuration options control zoned block device
support features.

## Block Layer

### Zoned Block Devices Core Support

To allow supported zoned block devices to be exposed as block device files,
enable the block-layer configuration option `CONFIG_BLK_DEV_ZONED`. This option
is part of the *Enable the block layer* top menu of `make menuconfig`.

<Image src="linux-config-zbd.png"
titel="Block layer zoned block device support option with make menuconfig"/>

Setting this configuration option gives users access to the ZBD interface. If
this configuration option is not set, users do not have access to the ZBD
interface and support for zoned block devices is disabled in all kernel
subsystems that include support for these devices (this includes I/O schedulers,
device mappers, and file systems).

## Write Ordering Control

Write ordering control is achieved through the *deadline* (legacy single queue
block I/O path) and *mq-deadline* (multi-queue block I/O path) block I/O
scheduler (see [Write Ordering Control](/docs/linux/sched)). *deadline* and
*mq-deadline* zoned block device support is automatically enabled if the
`CONFIG_BLK_DEV_ZONED` configuration option is set.

It is mandatory to enable this scheduler for zoned block devices. The
configuration option `CONFIG_MQ_IOSCHED_DEADLINE` enables the *mq-deadline*
scheduler. The configuration option `CONFIG_IOSCHED_DEADLINE` enables the
*deadline* scheduler. Both options can be selected from the *IO Schedulers* top
menu.

<Image src="linux-config-sched.png"
title="I/O scheduler configuration with make menuconfig"/>

As of kernel version 5.0, support for the legacy block-layer single-queue I/O
path has been removed. Only the *mq-deadline* scheduler remains. As of kernel
version 5.2, `CONFIG_MQ_IOSCHED_DEADLINE` is automatically selected when the
`CONFIG_BLK_DEV_ZONED` configuration option is set.

## Device Drivers Configuration

### *null_blk* Logical Device

The `CONFIG_BLK_DEV_ZONED` configuration option automatically enables support
for zoned block device emulation that uses the *null_blk* device driver.

### ZBC and ZAC Hard-Disks Support

SCSI subsystem support for ZBC and ZAC SMR disks is automatically enabled with
the `CONFIG_BLK_DEV_ZONED` configuration option.

### NVMe Zoned Namespace Solid State Disks Support

The NVM Express Zoned Namespace Command Set depends on `CONFIG_BLK_DEV_ZONED`
and `CONFIG_NVME_CORE`. It is automatically built if both of these configuration
options are enabled.

This driver requires the device to support the Zone Append command to
successfully bind to a zoned namespace. It does not support Zone Excursions.
See [Zoned Namespace (ZNS) SSDs](/docs/introduction/zns) for more details about
these features.

## Device Mapper

Zoned block device support for the device mapper subsystem is automatically
enabled when the `CONFIG_BLK_DEV_ZONED` option is set. This enables support for
*dm-linear* and *dm-flakey* targets. Note that the *dm-zoned* device mapper
target must be enabled to be usable.

Enable the *dm-zoned* target by selecting the `CONFIG_DM_ZONED` option from the
menu *Device Drivers --> Multiple devices driver support (RAID and LVM) -->
Device mapper support --> Drive-managed zoned block device target support*.

<Image src="linux-config-dm.png"
title="dm-zoned device mapper target configuration with make menuconfig"/>

## File Systems

### *f2fs*

Support for zoned block devices in the [*f2fs* file system](/docs/filesystems/f2fs)
is automatically enabled with the `CONFIG_BLK_DEV_ZONED` configuration option.

### *zonefs*

Enable compilation of the *zonefs* file system by selecting the
`CONFIG_ZONEFS_FS` option from the menu *File systems -> zonefs filesystem
support*. This option is available only if the `CONFIG_BLK_DEV_ZONED` option is
set to enable zoned block device support.

<Image src="linux-config-zonefs.png"
title="zonefs filesystem configuration with make menuconfig"/>

## Kernel Compilation

The kernel compilation process is the same regardless of whether the kernel has
been configured to enable zoned block device support. When the kernel has been
configured to enable zoned block device support, the following commands will
build the kernel.

```bash
$ make all
```

The kernel build infrastructure also allows you to build *.rpm* or *i.deb*
packages. To build RPM packages, use the following command.

```bash
$ make rpm-pkg
```

## Kernel Installation

The procedure for installing a zoned-block-device-enabled kernel is the same as
the procedure for installing a regular kernel. Use the following command to
install the kernel locally.

```bash
$ sudo make modules_install install
```

Follow this command by configuring the system bootloader (if your distribution
requires it). Some distributions might not require you to configure the system
bootloader.

Then restart the host system to execute the newly-compiled and newly-installed
kernel, on which you have enabled support for zoned block devices.

At this point in the installation process, we highly recommend reinstalling the
kernel headers. By reinstalling the kernel headers, the file
*/usr/include/linux/blkzoned.h* will be installed, which will allow applications
to be compiled against the [zoned block device API](/docs/linux/zbd-api)
supported by the kernel.

Run the following command to install the kernel user header files. 

```bash
$ sudo make headers_install
```

See the kernel's `make help` output for more information on this directive.

After the the kernel user header files have been installed, we recommend that
you recompile from source any package that will be used to manage and access
zoned block devices. In particular, recompiling and re-installing
[Linux system utilities](/docs/tools/util-linux) is highly recommended because
many packages rely on *util-linux* zoned block device features (e.g. file
systems that use *libblkid*).

The installation of the kernel and the installation of the user header files can
be simplified by using the RPM packages that are generated with the `make
rpm-pkg` command. If you install all of the packages generated by that command,
you will install the kernel core itself, the associated driver modules, and the
user API herder files. The RPM package `kernel-headers-<version>.<arch>.rpm`
must be installed in order for the kernel user API header files to be updated.
