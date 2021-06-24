# Kernel Compilation Configuration

Several kernel compilation configuration options control zoned block device
support features.

## Zoned Block Devices Core Support

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

## Device Drivers Configuration

### *null_blk* Logical Device

Support for the [zoned block device emulation](/getting-started/nullblk) with
the *null_blk* device driver zoned mode is automatically enabled with the
`CONFIG_BLK_DEV_ZONED` configuration option.

### ZBC and ZAC Hard-Disks Support

The SCSI subsystem support for ZBC and ZAC SMR disks is automatically enabled
with the `CONFIG_BLK_DEV_ZONED` configuration option.

### NVMe Zoned Namespace Solid State Disks Support

NVM Express Zoned Namespace Command Set depends on `CONFIG_BLK_DEV_ZONED` and
`CONFIG_NVME_CORE` and is automatically built if both configuration options are
enabled.

The driver requires the device to support the Zone Append command to
successfully bind to a zoned namespace, and does not support Zone Excursions.
See [Zoned Namespace (ZNS) SSDs](/introduction/zns) for more details about
these features.

## Write Ordering Control

Write ordering control is achieved through the *deadline* (legacy single queue
block I/O path) and *mq-deadline* (multi-queue block I/O path) block I/O
scheduler (see [Write Ordering Control](sched.md)). *deadline* and *mq-deadline*
zoned block device support is automatically enabled if the
`CONFIG_BLK_DEV_ZONED` configuration option is set.

Enabling this scheduler is mandatory for zoned block devices. This is
controlled with the `CONFIG_MQ_IOSCHED_DEADLINE` option for *mq-deadline* and
with the `CONFIG_IOSCHED_DEADLINE` option for *deadline*. Either option be
selected from the *IO Schedulers* top menu.

<center>
![config-sched](../assets/img/linux-config-sched.png "I/O scheduler configuration with `make menuconfig`")
<br>*I/O scheduler configuration with `make menuconfig`*</br>
</center>

With the introduction of kernel version 5.0 and the removal of the block layer
legacy single queue I/O path, only the *mq-deadline* scheduler remains. Since
kernel version 5.2, the selection of the `CONFIG_MQ_IOSCHED_DEADLINE` option is
automatic when the `CONFIG_BLK_DEV_ZONED` configuration option is set. 

## Device Mapper

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

## zonefs File System

Enabling compilation of the zonefs file system is done by selecting the
`CONFIG_ZONEFS_FS` option from the menu *File systems -> zonefs filesystem
support*. This option is available only and only if the `CONFIG_BLK_DEV_ZONED`
option is set to enable zoned block device support.

<center>
![config-zonefs](../assets/img/linux-config-zonefs.png "*zonefs* filesystem configuration with `make menuconfig`")
<br>*zonefs filesystem configuration with `make menuconfig`*</br>
</center>
