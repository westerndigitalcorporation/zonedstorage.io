---
id: scsi-debug
title: SMR Hard Disk Emulation with scsi_debug
sidebar_label: scsi_debug
---

# SMR Hard Disk Emulation with *scsi_debug*

The *scsi_debug* kernel module can be used to create emulated ZBC SCSI disks
that use memory backing to store data, which is written to sectors.
Because this method uses memory as a backing store, the creation of large disks
requires a host with a large amount of DRAM.

:::note
This method stores sector data using volatile memory. This means that the data
written to the emulated device will not survive the device's destruction and the
data written to this emulated device will not survive a host reboot.
:::

## Creating an Emulated ZBC Disk

*scsi_debug* ZBC disks can be created using *modprobe* with arguments.  The
following is an example that creates a host managed ZBC disk with 16GiB
capacity, 64MiB zones, and 32 conventional zones.

```plaintext
# modprobe scsi_debug \
	max_luns=1 \
	sector_size=4096 \
	dev_size_mb=16384 \
	zbc=managed \
	zone_size_mb=64 \
	zone_nr_conv=32
```

After the disk has been created, it can be examined by using the *lsscsi*
command.

```plaintext
# lsscsi -g
...
[11:0:0:0]   zbc     Linux    scsi_debug       0190  /dev/sdj   /dev/sg9
...
```

The vendor field of the disk is set to "scsi_debug". The kernel messages
also show the process whereby this disk came online.

```plaintext
# dmesg
...
scsi_debug:sdebug_driver_probe: scsi_debug: trim poll_queues to 0. poll_q/nr_hw = (0/1)
scsi host11: scsi_debug: version 0190 [20200710]
                 dev_size_mb=16384, opts=0x0, submit_queues=1, statistics=0
scsi 11:0:0:0: Direct-Access-ZBC Linux    scsi_debug       0190 PQ: 0 ANSI: 7
sd 11:0:0:0: Power-on or device reset occurred
sd 11:0:0:0: Attached scsi generic sg9 type 20
sd 11:0:0:0: [sdj] Host-managed zoned block device
sd 11:0:0:0: [sdj] 4194304 4096-byte logical blocks: (17.2 GB/16.0 GiB)
sd 11:0:0:0: [sdj] Write Protect is off
sd 11:0:0:0: [sdj] Mode Sense: 5b 00 10 08
sd 11:0:0:0: [sdj] Write cache: enabled, read cache: enabled, supports DPO and FUA
sd 11:0:0:0: [sdj] Optimal transfer size 4194304 bytes
sd 11:0:0:0: [sdj] 256 zones of 16384 logical blocks
sd 11:0:0:0: [sdj] Attached SCSI disk
```

## Verifying The Emulated Disk

The zone configuration of the emulated disk can be inspected by using
[*libzbc*](/docs/tools/libzbc), [*sg3utils*](/docs/tools/sg3utils) and 
[*util-linux*](/docs/tools/util-linux) tools.

### Using zbc_report_zones

Use [*zbc_report_zones*](/docs/tools/libzbc#zone-information) to verify the
zone configuration of the newly-created emulated ZBC disk:

```plaintext
# zbc_report_zones /dev/sg9
Device /dev/sg9:
    Vendor ID: Linux scsi_debug 0190
    SCSI ZBC device interface, Host-managed zone model
    33554432 512-bytes sectors
    4194304 logical blocks of 4096 B
    4194304 physical blocks of 4096 B
    17.180 GB capacity
    Read commands are unrestricted
    4096 KiB max R/W size
    Maximum number of open sequential write required zones: 8
    256 zones from 0, reporting option 0x00
256 / 256 zones:
Zone 00000: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 0, 131072 sectors
Zone 00001: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 131072, 131072 sectors
Zone 00002: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 262144, 131072 sectors
...
Zone 00031: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 4063232, 131072 sectors
Zone 00032: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 4194304, 131072 sectors, wp 4194304
Zone 00033: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 4325376, 131072 sectors, wp 4325376
...
Zone 00254: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 33292288, 131072 sectors, wp 33292288
Zone 00255: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 33423360, 131072 sectors, wp 33423360
```

### Using blkzone

Use [*blkzone*](/docs/tools/util-linux#zone-report) to verify the zone
configuration of the newly-created emulated ZBC disk. This displays the same
information that is returned by "zbc_report_zones", but it is displayed in a
different format:

```plaintext
# blkzone report /dev/sdj
  start: 0x000000000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000020000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000040000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
...
  start: 0x0003e0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000400000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000420000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x001fc0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x001fe0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```
