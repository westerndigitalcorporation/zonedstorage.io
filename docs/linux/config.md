# Enabling Zoned Block Device Support

## Kernel Configuration

Several kernel compilation configuration options control zoned block device
support features.

### Block Layer

#### Zoned Block Devices Core Support

To allow exposing supported zoned block devices as block device files, the block
layer configuration option `CONFIG_BLK_DEV_ZONED` must be enabled. This option
is part of the *Enable the block layer* top menu of `make menuconfig`.

<center>
![config-zbd](../assets/img/linux-config-zbd.png "Block layer zoned block device support option with `make menuconfig`")
<br>*Block layer zoned block device support option with `make menuconfig`*</br>
</center>

Without this configuration option set, users will not have access to the ZBD
interface and support for zoned block devices will be disabled in all kernel
subsystems (I/O schedulers, device mapper and file systems) that include support
for these devices.

### Write Ordering Control

Write ordering control is achieved through the *deadline* (legacy single queue
block I/O path) and *mq-deadline* (multi-queue block I/O path) block I/O
scheduler (see [Write Ordering Control](sched.md)). *deadline* and *mq-deadline*
zoned block device support is automatically enabled if the
`CONFIG_BLK_DEV_ZONED` configuration option is set.

Enabling this scheduler is mandatory for zoned block devices. This is
controlled with the `CONFIG_MQ_IOSCHED_DEADLINE` option for *mq-deadline* and
with the `CONFIG_IOSCHED_DEADLINE` option for *deadline*. Either option can be
selected from the *IO Schedulers* top menu.

<center>
![config-sched](../assets/img/linux-config-sched.png "I/O scheduler configuration with `make menuconfig`")
<br>*I/O scheduler configuration with `make menuconfig`*</br>
</center>

With the introduction of kernel version 5.0 and the removal of the block layer
legacy single queue I/O path, only the *mq-deadline* scheduler remains. Since
kernel version 5.2, the selection of the `CONFIG_MQ_IOSCHED_DEADLINE` option is
automatic when the `CONFIG_BLK_DEV_ZONED` configuration option is set. 

### Device Drivers Configuration

#### *null_blk* Logical Device

Support for the [zoned block device emulation](/getting-started/nullblk) with
the *null_blk* device driver zoned mode is automatically enabled with the
`CONFIG_BLK_DEV_ZONED` configuration option.

#### ZBC and ZAC Hard-Disks Support

The SCSI subsystem support for ZBC and ZAC SMR disks is automatically enabled
with the `CONFIG_BLK_DEV_ZONED` configuration option.

#### NVMe Zoned Namespace Solid State Disks Support

NVM Express Zoned Namespace Command Set depends on `CONFIG_BLK_DEV_ZONED` and
`CONFIG_NVME_CORE` and is automatically built if both configuration options are
enabled.

The driver requires the device to support the Zone Append command to
successfully bind to a zoned namespace, and does not support Zone Excursions.
See [Zoned Namespace (ZNS) SSDs](/introduction/zns) for more details about
these features.

### Device Mapper

Zoned block device support for the device mapper subsystem is automatically
enabled when the `CONFIG_BLK_DEV_ZONED` option is set. This will enables support
for the *dm-linear* and *dm-flakey* targets. However, the *dm-zoned*
device mapper target must be enabled to be usable.

Enabling the *dm-zoned* target can be done by selecting the `CONFIG_DM_ZONED`
option from the menu *Device Drivers --> Multiple devices driver support (RAID
and LVM) --> Device mapper support --> Drive-managed zoned block device target
support*.

<center>
![config-dm](../assets/img/linux-config-dm.png "*dm-zoned* device mapper target configuration with `make menuconfig`")
<br>*dm-zoned device mapper target configuration with `make menuconfig`*</br>
</center>

### File Systems

#### *f2fs*

Support for zoned block devices in the [*f2fs* file system](/linux/fs#f2fs)
is automatically enabled with the `CONFIG_BLK_DEV_ZONED` configuration option.

#### *zonefs*

Enabling compilation of the *zonefs* file system is done by selecting the
`CONFIG_ZONEFS_FS` option from the menu *File systems -> zonefs filesystem
support*. This option is available only and only if the `CONFIG_BLK_DEV_ZONED`
option is set to enable zoned block device support.

<center>
![config-zonefs](../assets/img/linux-config-zonefs.png "*zonefs* filesystem configuration with `make menuconfig`")
<br>*zonefs filesystem configuration with `make menuconfig`*</br>
</center>

## Kernel Compilation

After completing the kernel configuration to enable zoned block device support,
the kernel compilation process does not differ from building a kernel without
zoned block device support. That is, the following commands will build the
kernel.

```bash
$ make all
```

The kernel build infrastructure also enables build *.rpm* or *i.deb* packages.
To build RPM packages, the following command is used.

```bash
$ make rpm-pkg
```

## Kernel Installation

Similarly to the compilation process, installing a zoned block device enabled
kernel follows the same procedure as a regular kernel. That is, for a local
installation, the following command can be used.

```bash
$ sudo make modules_install install
```

This must be followed eventually by the system boot loader configuration as
required (or not) by the distribution used.

The host system can then be restarted to execute the kernel enabling zoned block
device support.

One additional step is however highly recommended: reinstalling the kernel
headers. Doing so, the file */usr/include/linux/blkzoned.h* will be installed,
thus allowing applications to be compiled against the
[zoned block device API](/linux/zbd-api) supported by the kernel.

Installing the kernel user header files is done using the following command.

```bash
$ sudo make headers_install
```

See the kernel `make help` output for more information on this directive.

With the kernel user header files installed, it is recommended to recompile
from source any package that will be used to manage and access zoned
block devices. In particular, recompiling and re-instlalling
[Linux system utilities](/projects/util-linux) is highly recommended as many
other packages rely on *util-linux* zoned block device features (e.g. file
systems formatting tools through *libblkid*).

The kernel installation and user header files installation can be simplified by
using the RPM packages generated with the `make rpm-pkg` command. Installing
all the packages generated will install the kernel core itself, the associated
driver modules and the user API herder files. The RPM package 
`kernel-headers-<version>.<arch>.rpm` must be installed for the kernel user API
header files to be updated.
