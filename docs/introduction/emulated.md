---
id: emulated
title: Emulated Zoned Storage Devices
sidebar_label: Emulated Zoned Storage Devices
---

# Zoned Block Device Emulation

Emulated zoned block devices make it possible to do application development and
kernel tests even if you do not have access to zoned storage hardware.

In a Linux environment, there are several ways available to create an emulated
zoned block device.

1. The [***zloop***](/docs/device-emulation/zloop) kernel block device driver:
   available since Linux 6.16, this driver uses one regular file per zone as
   backing storage. Large devices can be emulated without a matching amount of
   memory, and the zone state is preserved when the device is removed and added
   again, including across host reboots.

2. The [***null_blk***](/docs/device-emulation/null_blk) kernel block device
   driver: this is a simple method to emulate a zoned block device with
   different zone configurations mimicking both SMR and ZNS devices. While easy
   to use, *null_blk* uses system memory as backing storage, thus limiting the
   capacity of the devices being emulated.  The emulated devices are also not
   persistent across host reboots.

3. The [***scsi-debug***](/docs/device-emulation/scsi-debug) kernel block device
   driver: this driver is simple to use but only makes it possible to create
   emulated SCSI ZBC hard disks with limited capacity (system memory is used as
   backing storage).

4. The [***tcmu-runner***](/docs/tools/tcmu-runner) SCSI device emulation: this
   application uses a regular file as its storage backstore, and can thus
   emulate large capacity host-managed ZBC SCSI disks. Disks created with
   *tcmu-runner* are treated by the Linux kernel as though they were physical
   disks.

5. The [***QEMU***](/docs/tools/qemu) open source machine emulator and
   virtualizer: recent versions of QEMU support the emulation of NVMe devices
   with Zoned Namespace support.  These use regular files on the host as a
   backstores. Within a guest VM, an emulated ZNS device acts like a physical
   device.

The [getting started guide](/docs/getting-started/zbd-emulation) provides simple
usage examples of the *zloop* and *null_blk* drivers to quickly set up zoned
block devices on a compatible Linux system. Other emulation methods are either
more limited in functionality or more complex, but more accurate. The table
below provides a summary of each method.

<center>

| Method | Backing Storage | Advantages | Drawbacks |
| :----- | :-------------- | :--------- | :-------- |
| *zloop* | Regular files (sparse files, one per zone) | Very simple to use and allows large capacity devices | Cannot fully emulte a ZNS device (no active zone emulation) |
| *null_blk* | System memory | Simple to use, can emulate all zoned block device characteristics | Emulated capacity limited by the system memory, emulated devices are not persistent across host reboots |
| *scsi-debug* | System memory | Relatively simple to use, fully emulates a ZBC device | Emulated capacity limited by the system memory, emulated devices are not persistent across host reboots |
| *tcmu-runner* | Single regular file | Fully emulates a ZBC device | Requires user-space applications and more complex to setup |
| *QEMU* | host file (device image file) | Fully emulates a ZNS device | Requires running in a VM, the zone state of the emulated devices is not persistent across VM-hypervisor restarts |

</center>
