---
id: smr-disk
title: Getting Started with SMR Hard Disks
sidebar_label: Getting Started with SMR Hard Disks
---

# Getting Started with SMR Hard Disks

Hard disk drives that use [Shingled Magnetic Recording](../introduction/smr)
technology can have different interface implementations. This results in
different usage models:

* **Drive Managed Interface:** SMR disks that implement this interface are seen
  by the host kernel and by applications as identical to regular disks. Most
  Linux&reg; kernels recognize these disks. SMR disks that implement this
  interface make no LBA-space zoning information available to the host. Drive
  Managed disks are therefore not considered to be zoned block devices.

* **Zoned Block Interface:** SMR hard-disk drives that implement the ZBC and 
  ZAC feature sets also provide commands to the host that allow the host to 
  identify and control the device's zones. This interface has two different 
  variations, or model implementations (See 
  [SMR Interface Implementations](../introduction/smr#smr-interface-implementations)). 
  Those two model implementations are:

	* **Host Aware:** This zone model offers the convenience and flexibility
	  of Drive Managed disks (for example, it provides random write
	  capabilities) and also supports the full set of zone commands defined
	  in the ZBC and the ZAC standards. Host Aware disks can support both
	  the regular block device abstraction ("regular disk") and the zoned
	  block device abstraction.

	* **Host Managed:** This zone model defines a device type that is
	  different from the "regular disk" device type. Host Managed disks can
	  be used only as zoned block devices. This is necessary in order to
	  satisfy the strong sequential write constraints defined by this zone
	  model.

In the following sections, Host Aware disk models are considered to have
characteristics similar to Host Managed drives. Sequential writes are therefore
assumed to be a constraint for the correct operation of drives that implement
the Host Aware disk model.

## Serial ATA ZAC Disks and SATA Host Controllers

Serial ATA (SATA) host adapters, including those that use the Advance Host
Controller Interface (AHCI) standard, are able to scan and initialize
connections with Host Aware disks. Most AHCI host adapters are known to work
with Host Managed disk drives (this is because the adapter usually does not
react to the device signature of the connected disk).

### Verifying The Disk

On systems that have [zoned block device support enabled](./linux), SATA host
aware disks and host managed disks can be connected directly to SATA ports on
the host controller.

After booting the system, use the *lsscsi* utility to list all SCSI devices
attached to the system and verify the presence of the newly-connected disk:

```plaintext
# lsscsi -g
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0
[5:0:0:0]    zbc     ATA      HGST HSH721415AL T220  /dev/sdb   /dev/sg1
```

In this example, the disk '/dev/sda' is the system boot disk and the disk
'/dev/sdb' is recognized as a ZBC disk.

The second column of `lsscsi` output indicates the device type. The value
*zbc* is always used for Host Managed ZBC and ZAC disks. This corresponds
to the ZBC-defined device type *0x14* for SAS disks and corresponds to the
ZAC-defined device signature *0xabcd* for SATA disks. Because Host Aware
disks have the same device type or device signature as regular disks,
lsscsi lists host aware disks as *disk*.

:::note
The *lsscsi* utility does not list SATA ZAC disks with the type *zac*. The type
*zbc* is always used, because the kernel internally implements a SCSI-to-ATA
translation layer (SAT), which allows SATA devices to be represented as SCSI
devices.
:::

### Checking The Disk Information

Verify the zone model of the disk by checking the *zoned* sysfs attribute:

```plaintext
# cat /sys/block/sdb/queue/zoned
host-managed
```

The possible values of the *zoned* attribute are shown in the table below.

<center>

| Value | Description |
| :---- | :---------- |
| none | Regular disk or drive managed ZBC/ZAC disk |
| host-aware | Host aware ZBC/ZAC disk |
| host-managed | Host managed ZBC/ZAC disk |

</center>

Kernel messages also contain useful information about the disk:

```plaintext
# dmesg
ahci 0000:00:11.5: version 3.0
ahci 0000:00:11.5: AHCI 0001.0301 32 slots 2 ports 6 Gbps 0x3 impl SATA mode
ahci 0000:00:11.5: flags: 64bit ncq sntf led clo only pio slum part ems deso sadm sds apst
...
scsi host5: ahci
ata5: SATA max UDMA/133 abar m524288@0x9d100000 port 0x9d100200 irq 55
ata5: SATA link up 6.0 Gbps (SStatus 133 SControl 300)
ata5.00: ATA-9: HGST HSH721414ALN6M0, L4GMT220, max UDMA/133
ata5.00: 27344764928 sectors, multi 0: LBA48 NCQ (depth 32), AA
ata5.00: configured for UDMA/133
...
sd 5:0:0:0: Attached scsi generic sg1 type 20
sd 5:0:0:0: [sdb] Host-managed zoned block device
sd 5:0:0:0: [sdb] 3662151680 4096-byte logical blocks: (15.0 TB/13.6 TiB)
sd 5:0:0:0: [sdb] 55880 zones of 65536 logical blocks
sd 5:0:0:0: [sdb] Write Protect is off
sd 5:0:0:0: [sdb] Mode Sense: 00 3a 00 00
sd 5:0:0:0: [sdb] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
sd 5:0:0:0: [sdb] Attached SCSI disk
...
```

The zone model of the disk is confirmed to be "host managed". The total number
of zones on the disk is also displayed. In this example, the disk capacity is
15 TB and the disk has 55880 zones.

The zone size of the disk can be inspected by using sysfs to examine the
attribute *chunk_sectors*:

```plaintext
# cat /sys/block/sdb/queue/chunk_sectors 
524288
```

The value is displayed as a number of 512B sectors regardless of the actual
logical and physical block size of the disk. In this example, the disk zone size
is *524288 x 512 = 256 MiB*.

As of Linux kernel version 4.20.0, the sysfs attribute *nr_zones*
reports the total number of zones on the disk:

```plaintext
# cat /sys/block/sdb/queue/nr_zones
55880
```

### Discovering The Disk Zone Configuration

To obtain detailed information on the disk zone configuration, for instance the
number of conventional zones available, the
[*blkzone*](../tools/util-linux#blkzone) utility can be used.

```plaintext
# blkzone report /dev/sdb
  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  ...
  start: 0x010480000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010500000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010600000, len 0x080000, wptr 0x000008 reset:0 non-seq:0, zcond: 4(cl) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010680000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010700000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  ...
  start: 0x6d2280000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x6d2300000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x6d2380000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

This output shows that that the 512B sector range (from 0 up to 0x010600000) is
divided into 524 conventional zones. The sector space starting at 0x010600000
and ending at the last sector of the disk is divided into 55356 sequential
write required zones.

The [*zbc_report_zones*](../tools/libzbc#zone-information) of
[*libzbc*](../tools/libzbc) provides more detailed information in a more
readable format.

```plaintext
# zbc_report_zones /dev/sdb
Device /dev/sdb:
    Vendor ID: ATA HGST HSH721415AL T220
    Zoned block device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    55880 zones from 0, reporting option 0x00
55880 / 55880 zones:
Zone 00000: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 0, 524288 sectors
Zone 00001: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 524288, 524288 sectors
Zone 00002: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 1048576, 524288 sectors
...
Zone 00521: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 273154048, 524288 sectors
Zone 00522: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 273678336, 524288 sectors
Zone 00523: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 274202624, 524288 sectors
Zone 00524: type 0x2 (Sequential-write-required), cond 0x4 (Closed), reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 274726920
Zone 00525: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 275251200, 524288 sectors, wp 275251200
Zone 00526: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 275775488, 524288 sectors, wp 275775488
...
Zone 55877: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29295640576, 524288 sectors, wp 29295640576
Zone 55878: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29296164864, 524288 sectors, wp 29296164864
Zone 55879: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29296689152, 524288 sectors, wp 29296689152
```

## Using a SAS Host Bus Adapter

AHCI adapters can only accomodate Serial ATA disks and generally only provide a
limited number of ports. SAS Host Bus Adapters (HBA) are widely used in
enterprise applications to overcome AHCI limitations. The SAS transport layer
used by SAS HBAs can equally accomodate both Serial ATA and SCSI disks.

### HBA Compatibility

While most AHCI adapters for Serial ATA disks generally do not cause any
problem with host managed ZAC disks identification, SAS HBAs on the other
hand may suffer from a lack of support depending on the HBA model being used.

The compatibility of a SAS HBA with host managed disks mainly depends on
the following factors.

1. The HBA must have the ability to recognize the host managed device type
   *0x14* of host managed SAS disks (ZBC/SCSI).

2. The HBA must have the ability to recognize the host managed device signature 
   *0xabcd* of SATA host managed ZAC disks and translate this signature into
   the ZBC defined SCSI device type *0x14*.

3. Generalizing the previous point, the HBA must implement a SCSI-to-ATA
   translation (SAT) layer supporting the conversion of host issued ZBC zone
   commands into ZAC zone commands that can be executed by a SATA ZAC disk
   connected to the HBA.

Any HBA failing the first requirement will not expose a ZBC host managed disk to
the host. Similarly, an HBA failing to comply with the second and third
requirement will fail to expose to the host a host managed ZAC disk as a ZBC
host managed disk.

In the case of a host aware disk model, the device type and device signature
handling will not cause any problem (recall that host aware disks use the
regular disk device type and signatur *0x00*). Host aware disks will thus always
be useable as regular disks with any HBA. The execution of ZBC zone commands
with a SAS host aware disk may also work most of the time. However, similarly
to host managed disk, the absence of a ZBC/ZAC compatible SAT layer will prevent
the use of a Serial ATA host aware disk as a ZBC host aware disk. The ZBC zone
commands sent to the SATA disk will not be translated and result in command
failures.

The compatibility of an HBA model with the ZBC and ZAC standards should be
checked with the HBA vendor. Under some conditions, an HBA compatibility can
also be checked using the [*libzbc* conformance test suite](../tests/zbc-tests).

### Verifying The Disk

If you are using a compatible HBA and you have connected the drive and rebooted
the system, verifying the disk identification and checking the disk parameters
and zone configuration can be done in the exact same manner as with Serial ATA
disks as discussed above.

:::note
Remember that most SAS HBAs have plug-and-play features that make it unnecessary
to reboot the system after connecting or disconnecting a disk to it.
:::

In these examples, `/dev/sdc` is an SAS disk connected to an SAS HBA and
*/dev/sdd* is a SATA disk connected to the same HBA.

```plaintext
# lsscsi -g
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0
[5:0:0:0]    zbc     ATA      HGST HSH721415AL T220  /dev/sdb   /dev/sg1
[10:0:2:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdc   /dev/sg2
[10:0:3:0]   zbc     ATA      HGST HSH721415AL T220  /dev/sdd   /dev/sg3
```   

Inspecting the kernel messages shows no differences between the initialization
of the SAS drive and the SATA disk.

```plaintext
# dmesg
...
scsi 10:0:2:0: Direct-Access-ZBC HGST     HSH721414AL52M0  a220 PQ: 0 ANSI: 7
scsi 10:0:2:0: SSP: handle(0x001b), sas_addr(0x5000cca0000025c5), phy(1), device_name(0x5000cca0000025c7)
scsi 10:0:2:0: enclosure logical id (0x500062b200f35d40), slot(2)
scsi 10:0:2:0: enclosure level(0x0000), connector name(     )
sd 10:0:2:0: Attached scsi generic sg2 type 20
sd 10:0:2:0: [sdc] Host-managed zoned block device
sd 10:0:2:0: [sdc] 27344764928 512-byte logical blocks: (14.0 TB/12.7 TiB)
sd 10:0:2:0: [sdc] 4096-byte physical blocks
sd 10:0:2:0: [sdc] 52156 zones of 524288 logical blocks
sd 10:0:2:0: [sdc] Write Protect is off
sd 10:0:2:0: [sdc] Mode Sense: f7 00 10 08
sd 10:0:2:0: [sdc] Write cache: enabled, read cache: enabled, supports DPO and FUA
sd 10:0:2:0: [sdc] Attached SCSI disk
...
scsi 10:0:3:0: Direct-Access-ZBC ATA      HGST HSH721415AL T220 PQ: 0 ANSI: 6
scsi 10:0:3:0: SATA: handle(0x001c), sas_addr(0x300062b200f35d43), phy(3), device_name(0x5000cca25bc2e26f)
scsi 10:0:3:0: enclosure logical id (0x500062b200f35d40), slot(1)
scsi 10:0:3:0: enclosure level(0x0000), connector name(     )
scsi 10:0:3:0: atapi(n), ncq(y), asyn_notify(n), smart(y), fua(y), sw_preserve(y)
sd 10:0:3:0: Attached scsi generic sg3 type 20
sd 10:0:3:0: [sdd] Host-managed zoned block device
sd 10:0:3:0: [sdd] 3662151680 4096-byte logical blocks: (15.0 TB/13.6 TiB)
sd 10:0:3:0: [sdd] 55880 zones of 65536 logical blocks
sd 10:0:3:0: [sdd] Write Protect is off
sd 10:0:3:0: [sdd] Mode Sense: 9b 00 10 08
sd 10:0:3:0: [sdd] Write cache: enabled, read cache: enabled, supports DPO and FUA
sd 10:0:3:0: [sdd] Attached SCSI disk
...
```

Both disks are identified by the kernel as *Direct-Access-ZBC* devices.  This
indicates that the HBA is correctly translating the ZAC host managed device
signature into a ZBC host managed device type.

