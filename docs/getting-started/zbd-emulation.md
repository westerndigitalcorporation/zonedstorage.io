---
id: zbd-emulation
title: Zoned Block Device Emulation
sidebar_label: Zoned Block Device Emulation
---

# Zoned Block Device Emulation

If you do not have access to zoned storage hardware (SMR hard disk or NVMe ZNS
SSD), [several ways](/docs/device-emulation) are available in Linux to create an
emulated zoned block device.

The *zloop* and *null_blk* kernel block device drivers are the easiest to use to
quickly getting started.

## Setting Up a *zloop* Emulated Zoned Block Device

For systems using a Linux kernel version 6.16 or higher, the [*zloop* block
driver](/docs/device-emulation/zloop) allows emulating zoned block devices using
regular files. The emulated devices can have a large capacity and are persistent
across host reboots.  The *zloop* driver implements the complete zone state
machine: zones can be empty, implicitly open, explicitly open, closed or full.

As shown in the example below, creating, using and deleting a *zloop* device is
simple and does not require any user space tool. In this example, a 128 GiB
device with 512 zones of 256 MiB zones and 64 conventional zones is created.

```plaintext
# modprobe zloop
# mkdir -p /var/local/zloop/0
# echo "add id=0,capacity_mb=131072,zone_size_mb=256,conv_zones=64" > /dev/zloop-control
```

The zone files are created in */var/local/zloop/0*. Conventional zone files
(*cnv-*) are allocated at the full zone size, while sequential zone files
(*seq-*) are empty until data is written:

```plaintext
# ls -l /var/local/zloop/0
total 0
-rw-------. 1 root root 268435456 Oct 31 20:42 cnv-000000
-rw-------. 1 root root 268435456 Oct 31 20:42 cnv-000001
...
-rw-------. 1 root root 268435456 Oct 31 20:42 cnv-000063
-rw-------. 1 root root         0 Oct 31 20:42 seq-000064
...
-rw-------. 1 root root         0 Oct 31 20:42 seq-000511
```

The new device can be used like any other zoned block device. For instance, it
can be formatted with the [XFS file system](/docs/filesystems/xfs).

```plaintext
# lsblk -z /dev/zloop0
NAME   ZONED        ZONE-SZ ZONE-NR ZONE-AMAX ZONE-OMAX ZONE-APP ZONE-WGRAN
zloop0 host-managed    256M     512         0       128       1M         4K

# blkzone report /dev/zloop0
  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
...
  start: 0x001f80000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x002000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x002080000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...

# mkfs.xfs /dev/zloop0
meta-data=/dev/zloop0            isize=512    agcount=4, agsize=1048576 blks
         =                       sectsz=4096  attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=4194304, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=1
log      =internal log           bsize=4096   blocks=25087, version=2
         =                       sectsz=4096  sunit=1 blks, lazy-count=1
realtime =internal               extsz=4096   blocks=29360128, rtextents=29360128
         =                       rgcount=448  rgsize=65536 extents
         =                       zoned=1      start=4194304 reserved=0
Resetting zones...Done.

# mount /dev/zloop0 /mnt
```

An unused *zloop* device is removed by writing a *remove* command with the
device ID:

```plaintext
# echo "remove id=0" > /dev/zloop-control
```

Removing the device does not delete its zone files. Running the same *add*
command again, for example after a reboot, restores the device with the data
already written when it was removed. The configuration must match the one used
when the device was first created; otherwise the *add* command fails. The state
of zones is preserved for empty and full zones. However, like a real device,
zones that were open when the device was removed are changed to the closed
state.

To delete the device permanently, remove it and then delete its zone files:

```plaintext
# echo "remove id=0" > /dev/zloop-control
# rm -r /var/local/zloop/0
```

Refer to the [*zloop* documentation](/docs/device-emulation/zloop) for more details.


## Setting Up a *null_blk* Emulated Zoned Block Device

When *zloop* is not available on the host system, the [Linux *null_blk*
driver](/docs/device-emulation/null_blk) is a powerful tool that can emulate
several types of block devices, since kernel version 4.19.

However, since *null_blk* uses system memory as backing store, the capacity of
the emulated device may be more limited.

The simplest way to create a *null_blk* emulated zoned block device is to
specify `zoned=1` as an argument following the *modprobe null_blk* command
on the command line. The following example creates a 4 GiB device with 128 zones
of 32 MiB and 32 conventional zones.

```plaintext
# modprobe null_blk nr_devices=1 gb=4 zoned=1 zone_size=32 zone_nr_conv=32 memory_backed=1
```

Like with *zloop*, the device created can then be used as any zoned block
device.

```plaintext
# lsblk -z /dev/nullb0
NAME   ZONED        ZONE-SZ ZONE-NR ZONE-AMAX ZONE-OMAX ZONE-APP ZONE-WGRAN
nullb0 host-managed     32M     128         0         0   127.5K       512B

 mkfs.xfs /dev/nullb0
meta-data=/dev/nullb0            isize=512    agcount=4, agsize=32768 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=131072, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=1
log      =internal log           bsize=4096   blocks=16384, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =internal               extsz=4096   blocks=917504, rtextents=917504
         =                       rgcount=112  rgsize=8192 extents
         =                       zoned=1      start=131072 reserved=0
Resetting zones...Done.

# mount /dev/nullb0 /mnt
```

To delete an unused *null_blk* device, simply remove the driver module.

```plaintext
# rmmod null_blk
```

The *null_blk* kernel module accepts many arguments that can adjust the zone
configuration of the emulated device, and also provides a felxible *configfs*
device management interface. More details is available with the
[*null_blk* documentation](/docs/device-emulation/null_blk).

## Other Zoned Block Device Emulation Methods

The Linux kernel [*scsi-debug* driver](/docs/device-emulation/scsi-debug)
implements SCSI ZBC commands processing which allows emulating host-managed ZBC
SMR hard disks.  The [*tcmu-runner* application](/docs/tools/tcmu-runner)
provides a similar functionality but allows for higher capacity of the emulated
devices.

As part of its NVMe device emulation, recent versions of the *QEMU* open source
machine emulator and virtualizer support [the emulation of NVMe devices with
Zoned Namespace support](/docs/tools/qemu#qemu-nvme-zns-device-emulation).
