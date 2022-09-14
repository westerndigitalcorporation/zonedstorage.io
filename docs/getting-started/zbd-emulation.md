---
id: zbd-emulation
title: Getting started with Emulated Zoned Block Devices
sidebar_label: Getting started with Emulated Zoned Block Devices
---

# Zoned Block Device Emulation

Emulated zoned block devices make it possible to do application development and
kernel tests even if you do not have access to zoned storage hardware.

There are several ways available to create an emulated zoned block device.

1. The ***null_blk*** kernel block device driver: this is by far the easiest
   method to emulate a zoned block device with different zone configurations
   mimicking both SMR and ZNS devices.

2. The ***scsi-debug*** kernel block device driver: this driver is simple to
   use but only makes it possible to create emulated SCSI ZBC hard disks.

3. The ***tcmu-runner*** SCSI device emulation: this application uses a regular
   file as its storage backstore. It can emulate host-aware and host-managed
   ZBC SCSI disks. Disks created with *tcmu-runner* are treated by the Linux
   kernel as though they were physical disks.

4. The ***QEMU*** open source machine emulator and virtualizer: recent versions
   of QEMU support the emulation of NVMe Zoned Namespaces devices. These use
   regular files on the host as a backstores. Within a guest VM, an emulated
   ZNS device acts like a physical device.

## Zoned Block Device Emulation with *null_blk*

The [Linux&reg; *null_blk*
driver](https://www.kernel.org/doc/Documentation/block/null_blk.txt) is a
powerful tool that can emulate several types of block devices. Since kernel
version 4.19, the *null_blk* driver has been able to emulate zoned block
devices. Because memory backup has been added to the *null_blk* device for
data-reading and data-writing operations, the *null_blk* driver can be used for
application development and tests.

### Creating a Zoned *null* Block Device &mdash; Simplest Case

The simplest way to create a *null_blk* emulated zoned block device is to
specify `zoned=1` as an argument following the *modprobe null_blk* command
on the command line, as in the following example:

```plaintext
# modprobe null_blk nr_devices=1 zoned=1
```

This creates a single, host-managed zoned block device that has a zone size of
256M and a total capacity of 250 GB (1000 zones). This simple command creates
no conventional zones.


```plaintext
# blkzone report /dev/nullb0
  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000080000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000100000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000180000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x01f300000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x01f380000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

### Listing *null_blk* Zoned Block Device Parameters

The *null_blk* kernel module accepts many arguments that can adjust the zone
configuration of the emulated device. These arguments can be listed by using
the *modinfo* command and can be modified by using the *configfs* command after
the *null_blk* module is loaded.

```
# modinfo null_blk
...
parm:           zoned:Make device as a host-managed zoned block device. Default: false (bool)
parm:           zone_size:Zone size in MB when block device is zoned. Must be power-of-two: Default: 256 (ulong)
parm:           zone_capacity:Zone capacity in MB when block device is zoned. Can be less than or equal to zone size. Default: Zone size (ulong)
parm:           zone_nr_conv:Number of conventional zones when block device is zoned. Default: 0 (uint)
parm:           zone_max_open:Maximum number of open zones when block device is zoned. Default: 0 (no limit) (uint)
parm:           zone_max_active:Maximum number of active zones when block device is zoned. Default: 0 (no limit) (uint)
```

The parameters that are related to zoned-device emulation are shown in the table
below.

<center>

| Argument | Value | Description |
| :------- | :---- | :---------- |
| zoned | 0 or 1 | Disable or enable zoned mode (default: disabled) |
| zone_size | zone size in MiB | The size of each zone (default: 256) |
| zone_capacity | zone capacity in MiB | The capacity of each zone (default: zone size) |
| zone_nr_conv | number | Number of conventional zones (default: 0) |
| zone_max_open | number | Maximum number of open zones (default: 0, meaning no limit) |
| zone_max_active | number | Maximum number of active zones (default: 0, meaning no limit) |

</center>

### Creating a *null_blk* Zoned Block Device &mdash; More Advanced Cases (configfs)

To create an emulated zoned block device with *null_blk*, as shown above, the
*modprobe* command can be used. Additional parameters can be passed to this
command to configure the emulated disk.

```plaintext
# modprobe null_blk nr_devices=1 \
	zoned=1 \
	zone_nr_conv=4 \
	zone_size=64 \
```

In this example, the arguments mean the following:

   1. ``nr_devices=1`` means that only one (1) device will be created.
   2. ``zoned=1`` means that all devices that are created will be zoned devices.
   3. ``zone_nr_conv=4`` sets the number of conventional zones to four (4).
   4. ``zone_size=64`` sets the size of each zone to sixty-four (64) megabytes.


The *configfs* interface of the *null_blk* driver provides a way to create
emulated zoned block devices. The *configfs* parameters of the *null_blk*
driver can be listed by running the following commands:

```plaintext
# modprobe null_blk nr_devices=0

# cat /sys/kernel/config/nullb/features
memory_backed,discard,bandwidth,cache,badblocks,zoned,zone_size,zone_capacity,zone_nr_conv,zone_max_open,zone_max_active
```

The *configfs* interface can be used to script the creation of emulated zoned
block devices with a range of possible zone configurations. An example is
provided below.

```bash
#!/bin/bash

if [ $# != 4 ]; then
        echo "Usage: $0 <sect size (B)> <zone size (MB)> <nr conv zones> <nr seq zones>"
        exit 1
fi

scriptdir=$(cd $(dirname "$0") && pwd)

modprobe null_blk nr_devices=0 || return $?

function create_zoned_nullb()
{
        local nid=0
        local bs=$1
        local zs=$2
        local nr_conv=$3
        local nr_seq=$4

        cap=$(( zs * (nr_conv + nr_seq) ))

        while [ 1 ]; do
                if [ ! -b "/dev/nullb$nid" ]; then
                        break
                fi
                nid=$(( nid + 1 ))
        done

        dev="/sys/kernel/config/nullb/nullb$nid"
        mkdir "$dev"

        echo $bs > "$dev"/blocksize
        echo 0 > "$dev"/completion_nsec
        echo 0 > "$dev"/irqmode
        echo 2 > "$dev"/queue_mode
        echo 1024 > "$dev"/hw_queue_depth
        echo 1 > "$dev"/memory_backed
        echo 1 > "$dev"/zoned

        echo $cap > "$dev"/size
        echo $zs > "$dev"/zone_size
        echo $nr_conv > "$dev"/zone_nr_conv

        echo 1 > "$dev"/power

        echo mq-deadline > /sys/block/nullb$nid/queue/scheduler

        echo "$nid"
}

nulldev=$(create_zoned_nullb $1 $2 $3 $4)
echo "Created /dev/nullb$nulldev"
```

This script (*nullblk-zoned.sh*) takes four arguments:

   1. the sector size in bytes of the emulated device
   2. the device zone size in MiB
   3. the number of conventional zones (which can be 0)
   4. the number of sequential write required zones.

Memory-backing for written sectors can be turned on with this script (the
relevant part is ```memory_backed=1``` or, as it appears in this example,
```echo 1 > "$dev"/memory_backed```). This enables runtime persistence of the
data written to the sectors of the emulated device. The writen data is lost when
the emulated device is destroyed.

For example, a small zoned device with 4 conventional zones and 8 sequential
write-required zones of 64 MiB can be created with the following command:

```plaintext
# nullblk-zoned.sh 4096 64 4 8
Created /dev/nullb0
# blkzone report /dev/nullb0 
  start: 0x000000000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000020000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000040000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000060000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x0000a0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x0000c0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x0000e0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000100000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x000820000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000840000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000860000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

### Deleting a *null_blk* Zoned Block Device

There are two ways to delete *null_blk* zoned block devices. One way is used to
delete *null_blk* zoned block devices that were created using *modprobe* and
the other way is used to delete *null_blk* zoned block devices that were
created using *configfs*.

#### Deleting ZBD that were created with modprobe

Emulated devices created by using *modprobe* (and not created using *configfs*)
can be deleted by removing the *null_blk* kernel module:

```plaintext
# rmmod null_blk
```
:::note
This command does not delete emulated devices that were created through the
*configfs* interface.
:::

#### Deleting ZBD that were created with configfs

The following script is the counterpart of the zoned block device creation
script shown above. It can be used to destroy *null_blk* devices created
through *configfs*.

```bash
#!/bin/bash

if [ $# != 1 ]; then
	echo "Usage: $0 <nullb ID>"
	exit 1
fi

nid=$1

if [ ! -b "/dev/nullb$nid" ]; then
	echo "/dev/nullb$nid: No such device"
	exit 1
fi

echo 0 > /sys/kernel/config/nullb/nullb$nid/power
rmdir /sys/kernel/config/nullb/nullb$nid

echo "Destroyed /dev/nullb$nid"
```

### Emulating SMR HDD

The *nullblk-zoned.sh* script makes it possible to create zoned block devices
that correspond to a possible configuration of an SMR hard disk, with no limit
on the maximum number of open zones. This script can be modified to add a limit
to the number of open zones on the emulated device (the *zone_max_open*
parameter controls this), to more faithfully emulate an SMR HDD's
characteristics.

The *zone_capacity* and *zone_max_active* parameters should not be used when the
emulated device is meant to mimic the characteristics of an SMR hard disk.

### Emulating NVMe ZNS SSD

The *zone_capacity* and *zone_max_active* parameters make it possible to
create an emulated zoned block device that mimics the characteristics of a
NVMe Zoned Namespace SSD. The *zone_capacity* parameter is used to specify
the number of sectors in each zone that can be read and written. The
*zone_max_active* argument is used to specify a limit on the number of
zones that can be in the closed state, the implicit-open state, or the
explicit-open state.

## SMR Hard Disk Emulation with *scsi_debug*

The *scsi_debug* kernel module can be used to create emulated ZBC SCSI disks
that use memory backing to store data, which is written to sectors.
Because this method uses memory as a backing store, the creation of large disks
requires a host with a large amount of DRAM.

:::note
This method stores sector data using volatile memory. This means that the data
written to the emulated device will not survive the device's destruction and the
data written to this emulated device will not survive a host reboot.
:::

### Creating an Emulated ZBC Disk

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

### Verifying The Emulated Disk

The zone configuration of the emulated disk can be inspected by using
[*libzbc*](../tools/libzbc), [*sg3utils*](../tools/sg3utils) and 
[*util-linux*](../tools/util-linux) tools.

#### Using zbc_report_zones

Use [*zbc_report_zones*](../tools/libzbc#zone-information) to verify the
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

#### Using blkzone

Use [*blkzone*](../tools/util-linux#zone-report) to verify the zone
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

## SMR Hard Disk Emulation with *tcmu-runner*

Detailed information on how to install and operate *tcmu-runner* can be found
in the [tcmu-runner ZBC Disk Emulation](../tools/tcmu-runner) chapter of
the [Tools and Libraries](../tools) Guide.

### tcmu-runner ZBC File Handler

The *ZBC file handler* is an internal device handler of *tcmu-runner* that
emulates a ZBC SCSI disk and uses a file as a backstore. The *tcmu-runner*
infrastructure connects the emulated disk to a virtual HBA that has been
implemented as a kernel driver. This structure provides a command path for the
emulated disk that is identical to the command path that would be available if a
physical disk were in its place. Applications and kernel components will not
perceive any difference.

The [tcmu-runner ZBC Disk Emulation](../tools/tcmu-runner) chapter of the
[Tools and Libraries](../tools) guide describes in more
detail the options available for creating emulated disks. These include the disk
zone model, the disk zone size, the disk capacity, and the number of
conventional zones of the disk.

The following example shows how to create a small (20 GB) host-managed ZBC disk
that has 10 conventional zones and a 256 MiB zone size. In this example, the
emulated disk capacity is stored in the file */var/local/zbc0.raw*.

```plaintext
# targetcli
targetcli shell version 2.1.fb49
Copyright 2011-2013 by Datera, Inc and others.
For help on commands, type 'help'.

/> cd /backstores/user:zbc
/backstores/user:zbc> create name=zbc0 size=20G cfgstring=model-HM/zsize-256/conv-10@/var/local/zbc0.raw
Created user-backed storage object zbc0 size 21474836480.
/backstores/user:zbc> cd /loopback
/loopback> create
Created target naa.500140529100d742.
/loopback> cd naa.500140529100d742/luns
/loopback/naa...9100d742/luns> create /backstores/user:zbc/zbc0 0
Created LUN 0.
/loopback/naa...9100d742/luns> cd /
/> ls
o- / ..................................................................... [...]
  o- backstores .......................................................... [...]
  | o- block .............................................. [Storage Objects: 0]
  | o- fileio ............................................. [Storage Objects: 0]
  | o- pscsi .............................................. [Storage Objects: 0]
  | o- ramdisk ............................................ [Storage Objects: 0]
  | o- user:fbo ........................................... [Storage Objects: 0]
  | o- user:poma .......................................... [Storage Objects: 0]
  | o- user:zbc ........................................... [Storage Objects: 1]
  |   o- zbc0  [model-HM/zsize-256/conv-10@/var/local/zbc0.raw (20.0GiB) activated]
  |     o- alua ............................................... [ALUA Groups: 1]
  |       o- default_tg_pt_gp ................... [ALUA state: Active/optimized]
  o- iscsi ........................................................ [Targets: 0]
  o- loopback ..................................................... [Targets: 1]
  | o- naa.500140529100d742 ............................. [naa.50014059e05d5424]
  |   o- luns ........................................................ [LUNs: 1]
  |     o- lun0 ................................. [user/zbc0 (default_tg_pt_gp)]
  o- vhost ........................................................ [Targets: 0]
/> exit
```

### Verifying The Emulated Disk

You can verify that the emulated disk has been identified and initialized by
the kernel in the same way that you verify the kernel identification and
initialization of Serial ATA disks and SAS disks, as discussed in the [Getting
started with an SMR disk](smr-disk) chapter.

Identify the emulated disk by looking at the disk vendor ID that is displayed
by the *lsscsi* utility:

```plaintext
# lsscsi -g
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0
[5:0:0:0]    zbc     ATA      HGST HSH721415AL T220  /dev/sdb   /dev/sg1
[11:0:1:0]   zbc     LIO-ORG  TCMU ZBC device  0002  /dev/sdc   /dev/sg2
```   

In this example, the emulated disk is listed with the device vendor name
"LIO-ORG" and the device model name is "TCMU ZBC device".

As with physical ZBC and ZAC disks, the kernel messages will show that the
drive has been identified and initialized:

```plaintext
# dmesg
...
scsi host11: TCM_Loopback
scsi 11:0:1:0: Direct-Access-ZBC LIO-ORG  TCMU ZBC device  0002 PQ: 0 ANSI: 5
sd 11:0:1:0: Attached scsi generic sg2 type 20
sd 11:0:1:0: [sdc] Host-managed zoned block device
sd 11:0:1:0: [sdc] 41943040 512-byte logical blocks: (21.5 GB/20.0 GiB)
sd 11:0:1:0: [sdc] 80 zones of 524288 logical blocks
sd 11:0:1:0: [sdc] Write Protect is off
sd 11:0:1:0: [sdc] Mode Sense: 0f 00 00 00
sd 11:0:1:0: [sdc] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
sd 11:0:1:0: [sdc] Optimal transfer size 65536 bytes
sd 11:0:1:0: [sdc] Attached SCSI disk

...
```

The kernel identifies the emulated disk in the same way that it would identify
a physical SAS host managed disk (that is, with the device type
"*Direct-Access-ZBC*").

The emulated disk can now be used in the same manner as any physical disk. For
instance, the *blkzone* or *zbc_report_zones* utilities can be used to inspect
the disk zone configuration:

```plaintext
# zbc_report_zones /dev/sdc
Device /dev/sdc:
    Vendor ID: LIO-ORG TCMU ZBC device 0002
    Zoned block device interface, Host-managed zone model
    41943040 512-bytes sectors
    41943040 logical blocks of 512 B
    41943040 physical blocks of 512 B
    21.475 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 35
    80 zones from 0, reporting option 0x00
80 / 80 zones:
Zone 00000: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 0, 524288 sectors
Zone 00001: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 524288, 524288 sectors
Zone 00002: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 1048576, 524288 sectors
Zone 00003: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 1572864, 524288 sectors
Zone 00004: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 2097152, 524288 sectors
Zone 00005: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 2621440, 524288 sectors
Zone 00006: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 3145728, 524288 sectors
Zone 00007: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 3670016, 524288 sectors
Zone 00008: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 4194304, 524288 sectors
Zone 00009: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 4718592, 524288 sectors
Zone 00010: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 5242880, 524288 sectors, wp 5242880
Zone 00011: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 5767168, 524288 sectors, wp 5767168
...
Zone 00078: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 40894464, 524288 sectors, wp 40894464
Zone 00079: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 41418752, 524288 sectors, wp 41418752
```

## NVMe Zoned Namespace Device Emulation with *QEMU*

*<a href="https://www.qemu.org/" target="_blank">QEMU</a>* has supported the
emulation of NVMe namespaces since version 1.6. But the emulation of zoned
namespaces has been supported only since version 6.0 of *QEMU*. If the host
Linux distribution does not provide *QEMU* version 6.0 or above, *QEMU* has
to be compiled from source. Detailed information on how to compile and install
*QEMU* from source can be found <a href="https://www.qemu.org/download/#source"
target="_blank">on the QEMU download page</a>.

### Creating an Emulated Zoned Namespace

To create an emulated zoned namespace, you must first have a backing-store file
that the namespace can use. The size of the file determines the capacity of the
namespace that will be seen from the guest OS running in the *QEMU* virtual
machine.

For example: to create a 32GiB zoned namespace, you must first create a 32 GiB
file on the host. This can be done by using the *truncate* command to
create a sparse file or by using the *dd* command to create a fully allocated
file.

#### Creating the Backstore

This guide provides instructions for two methods of creating the backstore file:

1. Using truncate
2. Using dd

##### Using truncate to create an Emulated Zone Namespace Backstore

Run the following command to use ``truncate`` to create a backstore file:

```plaintext
# truncate -s 32G /var/lib/qemu/images/zns.raw

# ls -l /var/lib/qemu/images/zns.raw
-rw-r--r-- 1 root root 34359738368 Jun 21 15:13 /var/lib/qemu/images/zns.raw
```

##### Using dd to create an Emulated Zone Namespace Backstore

Run the following command to use ``dd`` to create a backstore file:

```plaintext
# dd if=/dev/zero of=/var/lib/qemu/images/zns.raw bs=1M count=32768
32768+0 records in
32768+0 records out
34359738368 bytes (34 GB, 32 GiB) copied, 11.4072 s, 3.0 GB/s

# ls -l /var/lib/qemu/images/zns.raw
-rw-r--r-- 1 root root 34359738368 Jun 22 11:22 /var/lib/qemu/images/zns.raw
```

#### Creating a ZNS and using the Backstore File

Execute *QEMU* with command-line options and arguments to create a zoned
namespace that uses the backstore file as storage. In the following example,
the backstore file is used to emulate a zoned namespace that has zones of 64
MiB and a zone capacity of 62 MiB. The namespace block size is 4096 B.  The
namespace is set to allow at most 16 open zones and 32 active zones.

```plaintext
# /usr/local/bin/qemu-system-x86_64 \
...
-device nvme,id=nvme0,serial=deadbeef,zoned.zasl=5 \
-drive file=${znsimg},id=nvmezns0,format=raw,if=none \
-device nvme-ns,drive=nvmezns0,bus=nvme0,nsid=1,logical_block_size=4096,\
physical_block_size=4096,zoned=true,zoned.zone_size=64M,zoned.\
zone_capacity=62M,zoned.max_open=16,zoned.max_active=32,\
uuid=5e40ec5f-eeb6-4317-bc5e-c919796a5f79
...
```

### Verifying an Emulated Zoned Namespace

If your guest operating system is a Linux distribution and the Linux
distribution's kernel version is higher than 5.9.0, the emulated NVMe ZNS
device can be checked by using the *nvme* command (see [Linux Tools for
ZNS](../tools/zns).

```
# nvme list
Node             SN                   Model                                    Namespace Usage                      Format           FW Rev
---------------- -------------------- ---------------------------------------- --------- -------------------------- ---------------- --------
/dev/nvme0n1     deadbeef             QEMU NVMe Ctrl                           1          34.36  GB /  34.36  GB      4 KiB +  0 B   1.0
```

The *lsscsi* utility shows the emulated NVMe device:

```
# lsscsi -g
[2:0:0:0]    cd/dvd  QEMU     QEMU DVD-ROM     2.5+  /dev/sr0   /dev/sg0
[N:0:0:1]    disk    QEMU NVMe Ctrl__1                          /dev/nvme0n1  -
```

Using the *blkzone* utility, the namespace zone configuration can be inspected.

```
# blkzone report /dev/nvme0n1 | less
  start: 0x000000000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000020000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000040000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000060000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000080000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x003f80000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x003fa0000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x003fc0000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x003fe0000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

:::note
The total number of zones of the namespace directly depends on the size of the
backstore file used and on the zone size configured. In the above example, the
emulated namespace has 512 zones (32 GiB / 64 MiB).
:::

```
# cat /sys/block/nvme0n1/queue/nr_zones 
512
```

If the emulated namespace is configured with a zone capacity smaller than the
zone size, the total capacity defined by the backstore file will not be
usable. The effective usable capacity can be reported using *blkzone* with the
*capacity* command, as shown here:

```
# blkzone capacity /dev/nvme0n1
0x003e00000
```

In this case, the namespace's effective storage capacity is 0x003e00000
(65011712) 512-Byte sectors, which is equivalent to 512 zones of 62 MiB
capacity.

### Using an Emulated Zoned Namespace

The behavior of a *QEMU*-emulated NVMe ZNS device is fully compliant with the
NVMe ZNS specifications, with one exception: the state of namespace zones is
not persistent across restarts of the *QEMU* emulation. The state of zones is
preserved only as long as *QEMU* is running, even if the guest operating system
is rebooted. If *QEMU* is restarted and the same backstore file is used, then
the guest operating system will see the namespace with all zones in the empty
state.

### Emulated Zoned Namespace Options

The implementation of NVMe device emulation and ZNS namespace emulation in
*QEMU* provides several configuration options to control the characteristics of
the device. The full list of options and parameters is
documented <a href="https://qemu-project.gitlab.io/qemu/system/nvme.html"
target="_blank">here</a>.

The options and parameters related to Zoned Namespaces are as follows.

<center>

| Option | Default Value | Description |
| :----- | :------------ | :---------- |
| zoned.zasl=UINT32 | 0 | Zone Append Size Limit. If left at the default (0), the zone append size limit will be equal to the maximum data transfer size (MDTS). Otherwise, the zone append size limit is equal to 2 to the power of zasl multiplied by the minimum memory page size (4096 B), but cannot exceed the maximum data transfer size. |
| zoned.zone_size=*SIZE* | 128MiB | Define the zone size (ZSZE) |
| zoned.zone_capacity=*SIZE* | 0 | Define the zone capacity (ZCAP). If left at the default (0), the zone capacity will equal the zone size. |
| zoned.descr_ext_size=*UINT32* | 0 | Set the Zone Descriptor Extension Size (ZDES). Must be a multiple of 64 bytes. |
| zoned.cross_read=*BOOL* | off | Set to "on" to allow reads to cross zone boundaries. |
| zoned.max_active=*UINT32* | 0 | Set the maximum number of active resources (MAR). The default (0) allows all zones to be active. |
| zoned.max_open=*UINT32* | 0 | Set the maximum number of open resources (MOR).  The default (0) allows all zones to be open. If ``zoned.max_active`` is specified, this value must be less than or equal to that. |

</center>

### *QEMU* Execution Example

The following script uses *QEMU* to run a virtual machine with 8 CPU cores,
16 GiB of memory, and bridged networking. The bridge device *virbr0* is assumed
already to exist. The last device added to the virtual machine on the *QEMU*
command line is a 32 GiB NVMe ZNS device.

```bash
#!/bin/sh

#
# Some variables
#
bridge="virbr0"
vmimg="/var/lib/qemu/boot-disk.qcow2"
znsimg="/var/lib/qemu/zns.raw"

#
# Run QEMU
#
sudo /usr/local/bin/qemu-system-x86_64 \
-name guest=FedoraServer34 \
-machine pc-q35-5.2,accel=kvm \
-m 16384 \
-smp 8,sockets=8,cores=1,threads=1 \
-rtc base=utc,driftfix=slew \
-nographic \
-no-hpet \
-global ICH9-LPC.disable_s3=1 \
-global ICH9-LPC.disable_s4=1 \
-boot strict=on \
-audiodev none,id=noaudio \
-object rng-random,id=objrng0,filename=/dev/urandom \
-msg timestamp=on \
-device pcie-root-port,port=0x10,chassis=1,id=pci.1,bus=pcie.0,multifunction=on,addr=0x2 \
-netdev bridge,id=hostnet0,br=${bridge} \
-device virtio-net-pci,netdev=hostnet0,id=net0,mac=52:54:00:fa:2d:b9,bus=pci.1,addr=0x0 \
-device pcie-root-port,port=0x11,chassis=2,id=pci.2,bus=pcie.0,addr=0x2.0x1 \
-blockdev node-name="vmstorage",driver=qcow2,file.driver=file,file.filename="${vmimg}",file.node-name="vmstorage.qcow2",file.discard=unmap \
-device virtio-blk-pci,bus=pci.2,addr=0x0,drive="vmstorage",id=virtio-disk0,bootindex=1 \
-device pcie-root-port,port=0x12,chassis=3,id=pci.3,bus=pcie.0,addr=0x2.0x2 \
-device virtio-balloon-pci,id=balloon0,bus=pci.3,addr=0x0 \
-device pcie-root-port,port=0x13,chassis=4,id=pci.4,bus=pcie.0,addr=0x2.0x3 \
-device virtio-rng-pci,rng=objrng0,id=rng0,bus=pci.4,addr=0x0 \
-device pcie-root-port,port=0x14,chassis=5,id=pci.5,bus=pcie.0,addr=0x2.0x4 \
-device nvme,id=nvme0,serial=deadbeef,zoned.zasl=5,bus=pci.5 \
-drive file=${znsimg},id=nvmezns0,format=raw,if=none \
-device nvme-ns,drive=nvmezns0,bus=nvme0,nsid=1,logical_block_size=4096,physical_block_size=4096,zoned=true,zoned.zone_size=64M,zoned.zone_capacity=62M,zoned.max_open=16,zoned.max_active=32,uuid=5e40ec5f-eeb6-4317-bc5e-c919796a5f79
```
