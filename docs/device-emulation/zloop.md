---
id: zloop
title: zloop
sidebar_label: zloop
---

# Zoned Block Device Emulation with *zloop*

The [zoned loop block device
driver](https://docs.kernel.org/admin-guide/blockdev/zoned_loop.html) (*zloop*)
was added in Linux 6.16. It creates a host-managed zoned block device that uses
one regular file per zone as backing storage:

* A conventional zone is backed by a file whose size always equals the zone
  size.
* A sequential write required zone is backed by a file whose size is the amount
  of data written to the zone, that is, the file size is the zone write pointer
  position. Resetting a zone truncates the backing file to zero, and finishing
  the zone extends the size of the backing file to its maximum size (the zone
  size).

Because data is stored in files rather than in system memory, *zloop* can
emulate devices that have a capacity much larger than the size of the host
memory. Since the backing files of sequential zones only grow as data is
written, the device capacity can also be larger than the free space of the
backing file system. Writing more data than the file system can results in write
errors.

The *zloop* driver implements the complete zone state machine: zones can be
empty, implicitly open, explicitly open, closed or full. No user space tools are
needed to create or delete *zloop* devices.

## Prerequisites

The kernel must be built with zoned block device support
(`CONFIG_BLK_DEV_ZONED`) and the zoned loop driver
(`CONFIG_BLK_DEV_ZONED_LOOP`), either built in or as the *zloop* module. Once
the driver is loaded, devices are managed through the */dev/zloop-control*
character device.

```plaintext
# modprobe zloop
# ls -l /dev/zloop-control
crw-------. 1 root root 10, 123 Jan  6 19:18 /dev/zloop-control
```

Reading */dev/zloop-control* lists the commands and options supported by the
running kernel. Newer kernels accept more options than shown here.

```plaintext
# cat /dev/zloop-control
add id=%d,capacity_mb=%u,zone_size_mb=%u,zone_capacity_mb=%u,conv_zones=%u,base_dir=%s,nr_queues=%u,queue_depth=%u,buffered_io
remove id=%d
```

The options that control the zone configuration are shown in the table below.

<center>

| Option | Value | Description |
| :----- | :---- | :---------- |
| id | number | Device number, the X in */dev/zloopX* (default: first free number) |
| capacity_mb | capacity in MiB | Total device capacity; use a multiple of the zone size (default: 16384) |
| zone_size_mb | zone size in MiB | The size of each zone; must be a power of two (default: 256) |
| zone_capacity_mb | zone capacity in MiB | The capacity of sequential zones (default: zone size) |
| conv_zones | number | Number of conventional zones, starting at sector 0 (default: 8) |
| base_dir | path | Directory containing one subdirectory of zone files per device (default: */var/local/zloop*) |

</center>

## Creating a *zloop* Zoned Block Device

The directory that holds the zone files must exist before the device is added.
It is named after the device ID, inside the base directory. The following
example creates */dev/zloop0*, a 2 GiB device with 64 MiB zones and the default
8 conventional zones:

```plaintext
# modprobe zloop
# mkdir -p /var/local/zloop/0
# echo "add id=0,capacity_mb=2048,zone_size_mb=64" > /dev/zloop-control
```

The zone files are created in */var/local/zloop/0*. Conventional zone files
(*cnv-*) are allocated at the full zone size, while sequential zone files
(*seq-*) are empty until data is written:

```plaintext
# ls -l /var/local/zloop/0
total 0
-rw-------. 1 root root 67108864 Jan  6 22:23 cnv-000000
-rw-------. 1 root root 67108864 Jan  6 22:23 cnv-000001
...
-rw-------. 1 root root 67108864 Jan  6 22:23 cnv-000007
-rw-------. 1 root root        0 Jan  6 22:23 seq-000008
-rw-------. 1 root root        0 Jan  6 22:23 seq-000009
...
```

The new device can be used like any other zoned block device:

```plaintext
# lsblk -z /dev/zloop0
NAME   ZONED        ZONE-SZ ZONE-NR ZONE-AMAX ZONE-OMAX ZONE-APP ZONE-WGRAN
zloop0 host-managed     64M      32         0         0       1M         4K
# blkzone report /dev/zloop0
  start: 0x000000000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000020000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
...
  start: 0x0000e0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000120000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
```

## Removing and Deleting a *zloop* Zoned Block Device

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
