# Getting Started with Emulated SMR Disks

Emulated ZBC disks make it possible to do application development and kernel
tests even if you do not have access to ZBC or ZAC disks. There are several
ways to do this.

* ***null_blk***: The *null_blk* kernel driver makes it possible to emulate
  zoned block devices.  This method is discussed in more detail in the
  [Zoned Block Device Emulation with null_blk](nullblk.md) chapter of the
  Getting Started Guide.

* ***tcmu-runner***: This scsi device emulation application makes it possible
  to use a regular file (as a storage backstore) to emulate both host-aware and
  host-managed ZBC SCSI disks. The disks created using *tcmu-runner* are
  function like physical disks.

* ***scsi_debug***: The *scsi_debug* kernel driver can be configured to emulate
  host-aware and host-managed ZBC disks that appear to the kernel and
  application exactly as a real disk would.

## *tcmu-runner*

Detailed information on how to install and operate *tcmu-runner* can be found
in the [tcmu-runner ZBC Disk Emulation](../projects/tcmu-runner.md) chapter of
the Applications and Libraries Guide.

### tcmu-runner ZBC File Handler

The *ZBC file handler* is *tcmu-runner* internal handler that emulates a ZBC
SCSI disk and uses file as a backstore. *tcmu-runner* infrastructure connects
the emulated disk to a virtual HBA that has been implemented as a kernel
driver. This structure provides a command path for the emulated disk that is
identical to the command path that would be available if the physical disk were
in its place. Applications and kernel components will not perceive any
difference.

The [tcmu-runner ZBC Disk Emulation](../projects/tcmu-runner.md) chapter of the
Applications and Libraries Guide describes in more detail the options available
for creating emulated disks. These include the disk zone model, the disk zone
size, the disk capacity, and the number of conventional zones of the disk.

The following example shows how to create a small (20 GB) host managed ZBC disk
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
started with an SMR disk](smr-disk.md) chapter.


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

## *scsi_debug*

The *scsi_debug* kernel module can be used to create emulated ZBC SCSI disks
with memory backing used to store data written to sectors. Since memory is used
as a backing store, creating large disks requires a host with a large amount of
DRAM. Furthermore, the data written to the emulated device does not survive the
device destruction or a host reboot.

### Creating an Emulated ZBC Disk

*scsi_debug* ZBC disks can be created using *modprobe* with arguments.
Below is an example to create a 16GiB capacity host managed ZBC disk with 64MiB
zones and 32 conventional zones.

```plaintext
# modprobe scsi_debug \
	max_luns=1 \
	sector_size=4096 \
	dev_size_mb=16384 \
	zbc=managed \
	zone_size_mb=64 \
	zone_nr_conv=32
```

The disk created can be seen using the *lsscsi* command.

```plaintext
# lsscsi -g
...
[11:0:0:0]   zbc     Linux    scsi_debug       0190  /dev/sdj   /dev/sg9
...
```

The vendor field of the disk created is set to "scsi_debug". The kernel messages
also show this disk coming online.

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

The zone configuration of the emulated disk can be inspected using
[*libzbc*](../projects/libzbc.md), [*sg3utils*](../projects/sg3utils.md) and 
[*util-linux*](../projects/util-linux.md) tools.

For instance, using [*zbc_report_zones*](../projects/libzbc.md#zone-information):

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

[*blkzone*](../projects/util-linux.md#zone-report), the same information is
obtained and displayed in a different format.

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

