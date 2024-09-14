---
id: libzbc
title: libzbc User Library
sidebar_label: libzbc User Library
---

import Image from '/src/components/Image';

# libzbc User Library

*libzbc* is a user library that provides functions for manipulating ZBC and ZAC
disks. The command implementation of *libzbc* is compliant with the latest
published versions of the ZBC and ZAC standards as defined by INCITS technical
committees T10 (for ZBC) and T13 (for ZAC).

In addition to supporting ZBC and ZAC disks, *libzbc* may implement an emulation
mode that allows the library to imitate the behavior of a host managed zoned
disk, using a regular file or a standard block device as the backing store.

The *libzbc* project is hosted on <a href="https://github.com/westerndigitalcorporation/libzbc"
target="_blank">GitHub</a>.
The project's <a href="https://github.com/westerndigitalcorporation/libzbc/blob/master/README.md" target="_blank">
*README* file</a> provides information on how to compile and install the
*libzbc* library and its tools.

:::note
The *libzbc* project was formerly hosted on GitHub as part of
the <a href="https://github.com/hgst" target="_blank">HGST organization</a>.
*libzbc* repository has since then moved to
the <a href="https://github.com/westerndigitalcorporation/"
target="_blank">Western Digital Corporation organization on GitHub</a>.
:::

*libzbc* provides a test suite that makes it possible to test disks and HBAs
for conformity to the ZBC and ZAC standards.  In order to make the test suite
available, *libzbc* must be configured using the *--with-test* option prior to
building and installing the library. The usage of this test suite is described
in more detail [here](/docs/tests/zbc-tests).

## Overview

*libzbc* provides a unified application programming interface (API) that is
independent of the zone model and the interface of the disk being used.
Internally, four different types of device drivers are used to handle commands
that are dependent on the device interface:

* **ZAC ATA Driver** This driver is used to handle the direct delivery of ATA
  commands to ZAC disks through the SCSI generic driver (direct device
  access interface).
* **ZBC SCSI Driver** This driver primarily handles SCSI commands directed at
  ZBC SCSI disks, but can also be used to control ZAC ATA disks if a functional
  SCSI to ATA (SAT) command translation layer exists in the command path.
  SAT may be provided either by the kernel *libata* subsystem for ATA disks
  connected to SATA adapters or by an SAS host bus adapter (HBA) for SATA disks
  connected to such an adapter.
* **Zoned Block Device Driver** This driver uses the kernel ZBD interface to
  control both ZBC and ZAC disks. This driver is only available if kernel
  zoned block device support is present and enabled. This driver is no longer
  available in *libzbc* v6 and on.
* **File Emulation Driver** This driver emulates a host managed ZBC disk using
  a regular file or regular block device as backend storage. This driver is
  intended for development only. A more advanced ZBC disk emulation solution
  is provided by the [*tcmu-runner*](/docs/tools/tcmu-runner) project. This
  driver is no longer available in *libzbc* v6 an on.

The figure below shows this structure.

<Image src="tools-libzbc.png"
title="libzbc v5.0.0 - v6.0.0 internal backend drivers organization"/>

## *libzbc* versions

The latest release of *libzbc*, version 6.0.0, has introduced some functionality
changes that are not backwards compatible. In particular,
**Zoned Block Device Driver** and **File Emulation Driver** are no longer
available. The reason for the block driver removal is to avoid the overlap in
functionality with [*libzbd*](libzbd.md). The file emulation driver has been
taken out because the modern QEMU and [*tcmu-runner*](tcmu-runner.md) provide
much more extensive and flexible means for ZBD emulation, making *libzbc*-based
emulation obsolete.

The figure below illustrates the new *libzbc* v6.0.0 structure.

<Image src="tools-libzbc6.png"
title="libzbc v5.0.0 - v6.0.0 internal backend drivers organization"/>

## State model

*libzbc* provides functions for discovering the zone configuration of a zoned
device and for accessing the device. Accesses to the device may result in
changes to the condition of the device zone, the attributes of the device zone,
and the state of device zone (such as the write pointer's location in
sequential zones). These changes are not tracked internally by *libzbc*. That
is, *libzbc* is stateless.

The functions that are provided to obtain the device zone information make a
"snapshot" of the zone condition and state only when executed. It is the
responsibility of applications to implement tracking of the device zone changes
(such as the increasing write pointer position of a sequential zone after the
completion of write requests to the zone).

## Library Functions

All *libzbc* functions since version 5.0.0 use a 512-byte sector unit for (1)
reporting zone information and (2) as the sector addressing unit for device
accesses, regardless of the actual device logical block size. This unification
in the unit used by all functions can simplify application development by
hiding potential differences in logical block sizes between devices. However,
application programmers must be careful always to implement accesses (read or
write) to the device that are aligned to the device's logical block size.
Furthermore, on host managed zoned devices, write operations to sequential
zones must be aligned to the device's physical block size.

The main functions provided by *libzbc* are as follows:

<center>

| Function | Description |
| :------- | :---------- |
| zbc_open() | Open a zoned device |
| zbc_close() | Close a zoned device |
| zbc_get_device_info() | Get device information |
| zbc_report_nr_zones() | Get the number of zones |
| zbc_report_zones() | Get zone information |
| zbc_list_zones() | Get zone information |
| zbc_zone_operation() | Execute a zone operation |
| zbc_open_zone() | Explicitly open a zone |
| zbc_close_zone() | Close an open zone |
| zbc_finish_zone() | Finish a zone |
| zbc_reset_zone() | Reset a zone write pointer |
| zbc_pread() | Read data from a zone |
| zbc_pwrite() | Write data to a zone |
| zbc_flush() | Flush data to disk |

</center>

Since the release 6.0.0, additional *libzbc* API functions are available.
Most of them have been added to support certain new features defined in
ZAC-2/ZBC-2 standard specification.

The two new ZAC-2/ZBC-2 features that *libzbc* 6.0.0 supports are

* Zone Domains/Zone Realms protocol that is commonly used to control DH-SMR
  (aka XMR) zoned devices
* the ability to specify zone counts for zone operations

The new API functions that are only available from release 6.0.0 and onward
are listed below.

<center>

| Function | Description |
| -------- | ----------- |
| zbc_zone_group_op() | Execute a zone operation on a group of zones |
| zbc_open_zones() | Open a group of zones |
| zbc_close_zones() | Close a group of zones |
| zbc_finish_zones() | Finish a group of zones |
| zbc_reset_zones() | Reset a group of zones |
| zbc_report_domains() | Get zone domain information |
| zbc_report_realms() | Get zone realm information |
| zbc_report_nr_realms() | Get the number of realms |
| zbc_zone_activate() | Activate zones at a new zone domain |
| zbc_zone_query() | Query about possible results of zone activation |
| zbc_get_nr_actv_records() | Get the number of activation records |
| zbc_zone_activation_ctl() | Read or change persistent device settings |

</center>

More detailed information about the  usage and behavior of these functions can
be found in the comments of <a
href="https://github.com/westerndigitalcorporation/libzbc/blob/master/include/libzbc/zbc.h"
target="_blank">*libzbc* header file</a>. This header file is installed by
default as `/usr/include/libzbc/zbc.h`.

*libzbc* does not implement any mutual exclusion mechanism for multi-thread or
multi-process applications. This means that it is the responsibility of
applications to synchronize the execution of conflicting operations that target
the same zone. A typical example of such a case is "concurrent write operations
to the same zone by multiple threads", which can result in write errors if the
application does not have write ordering control.

The following functions are also provided by *libzbc* to facilitate application
development and tests:

<center>

| Function | Description |
| :------- | :---------- |
| zbc_set_log_level() | Set log level of the library functions |
| zbc_device_is_zoned() | Test if a device is a zoned block device |
| zbc_print_device_info() | Print to a file (stream) a device information |
| zbc_device_type_str() | Get a string description of a device type |
| zbc_device_model_str() | Get a string description of a device model |
| zbc_zone_type_str() | Get a string description of a zone type |
| zbc_zone_condition_str() | Get a string description of a zone condition |
| zbc_errno() | Return sense key and sense code of the last command executed |
| zbc_sk_str() | Get a string description of a sense key |
| zbc_asc_ascq_str() | Get a string description of a sense code |

</center>

*libzbc* 6.0.0 adds one new function to the test and development portion
of the API:

<center>

| Function | Description |
| :------- | :---------- |
| zbc_version() | Return the library version |

</center>

All functions behave in the same manner regardless of the type of disk that is
used. The only exception to this is the `zbc_errno()` function's inability to
report detailed error information when the zoned block device driver is used.
The reason for this is that the kernel I/O stack does not have the ability to
propagate up to the application the detailed information that is provided in
SCSI/ATI sense data for failed commands.

## Tools

*libzbc* provides several command line applications for manipulating zoned
disks by calling the library functions. The list of applications provided is
shown in the table below:

<center>

| Tool | Description |
| :--- | :---------- |
| gzbc | gzbc provides a graphical user interface showing zone information of a zoned device |
| zbc_info | Get information on a disk |
| zbc_report_zones | List the zones of a device |
| zbc_reset_zone | Reset the write pointer of sequential zones |
| zbc_open_zone | Explicitly open a sequential write zone |
| zbc_close_zone | Close an open sequential write zone |
| zbc_finish_zone | Transition a sequential write zone to the full condition |
| zbc_read_zone | Read a zone sectors |
| zbc_write_zone | Write a zone sectors |

</center>

*libzbc* release 6.0.0 introduces a few additional tools to facilitate
Zone Domains/Zone Realms support. These tools are:

<center>

| Tool | Description |
| :--- | :---------- |
| zbc_report_domains | Report zone domains |
| zbc_report_realms | Report zone realms |
| zbc_zone_activate | Activate or query zones at a new zone domain |
| zbc_dev_control | Read or change persistent device settings |

</center>

The following tools are provided to create and modify the regular file or
regular block device used as backend storage with *libzbc* emulation mode.
These tools are no longer available as of v6.0.0.

<center>

| Tool | Description |
| :--- | :---------- |
| zbc_set_zones | Initialize (format) a regular file or regular disk to be used with *libzbc* emulation mode |
| zbc_set_write_ptr | Change the write pointer position of the sequential zones of an emulated disk (intended for testing purposes only as this is not a valid operation for physical ZBC devices |

</center>

All tools output a help message when executed without any argument:

```plaintext
# zbc_report_zones
Usage: zbc_report_zones [options] <dev>
Options:
  -v		  : Verbose mode
  -lba		  : Use LBA size unit (default is 512B sectors)
  -start <offset> : Start offset of report. if "-lba" is used
                    <offset> is interpreted as an LBA. Otherwise,
                    it is interpreted as a 512B sector number.
                    Default is 0
  -n		  : Get only the number of zones
  -nz <num>	  : Get at most <num> zones
  -ro <opt>	  : Specify reporting option: "all", "empty",
                    "imp_open", "exp_open", "closed", "full",
                    "rdonly", "offline", "rwp", "non_seq" or "not_wp".
                    Default is "all"
```

### Getting Disk Information

*zbc_info* displays information about a disk, including regular block devices:

```plaintext
# zbc_info /dev/sg3
Device /dev/sg3:
    Vendor ID: ATA HGST HSH721415AL T220
    Zoned block device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
# zbc_info /dev/sg0
/dev/sg0 is not a zoned block device
```

### Zone Information

*zbc_report_zones* illustrates the use of the *libzbc* zone reporting functions
`zbc_report_zones()`, `zbc_report_nr_zones()` and `zbc_list_zones()`.

```plaintext
# zbc_report_zones /dev/sg3
Device /dev/sg3:
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
Zone 00522: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 273678336, 524288 sectors
Zone 00523: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 274202624, 524288 sectors
Zone 00524: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0,
sector 274726912, 524288 sectors, wp 274726912
Zone 00525: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0,
sector 275251200, 524288 sectors, wp 275251200
...
Zone 55878: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29296164864, 524288 sectors, wp 29296164864
Zone 55879: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29296689152, 524288 sectors, wp 29296689152
```

The output of *zbc_report_zones* can be limited by using the option `-ro`
(reporting options) to filter which zones are reported, or by using the option
`-n` to limit the output to the number of zones specified as an argument of
this option.

```plaintext
# zbc_report_zones -ro not_wp -n /dev/sg3
Device /dev/sg3:
    Vendor ID: ATA HGST HSH721415AL T220
    Zoned block device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    524 zones from 0, reporting option 0x3f
```

### Writing and Resetting Zones

*zbc_write_zone* sequentially writes data to a zone. If the zone is a
sequential zone, the write pointer position advances until the zone is full. By
default, *zbc_write_zone* writes the entire zone. For example, using the disk
used in the previous example, the first sequential write zone (zone number 524)
can be written with 512 kb writes with the following command, until it is full:

```plaintext
# zbc_write_zone /dev/sg3 524 524288
Device /dev/sg3:
    Vendor ID: ATA HGST HSH721415AL T220
    SCSI ZBC device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
Target zone: Zone 524 / 55880, type 0x2 (Sequential-write-required), cond 0x1 (Empty), rwp 0, non_seq 0, sector 274726912, 524288 sectors, wp 274726912
Filling target zone 524, 524288 B I/Os
Wrote 268435456 B (512 I/Os) in 1.082 sec
  IOPS 472
  BW 247.952 MB/s

# zbc_report_zones -start 274726912 -nz 1 /dev/sg3
Device /dev/sg3:
    Vendor ID: ATA HGST HSH721415AL T220
    SCSI ZBC device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    55356 zones from 274726912, reporting option 0x00
1 / 55356 zone:
Zone 00000: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 2251799813685240
```

The written zone can then be reset by using the command *zbc_reset_zone*:

```plaintext
# zbc_reset_zone /dev/sg3 524
Device /dev/sg3:
    Vendor ID: ATA HGST HSH721415AL T220
    SCSI ZBC device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
reset zone 524/55880, sector 274726912...

# zbc_report_zones -start 274726912 -nz 1 /dev/sg7
Device /dev/sg7:
    Vendor ID: ATA HGST HSH721415AL T220
    SCSI ZBC device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    55356 zones from 274726912, reporting option 0x00
1 / 55356 zone:
Zone 00000: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 274726912
```

All the sequential write zones of a device can be reset using the option
`-all`:

```plaintext
# zbc_reset_zone -all /dev/sg7
Device /dev/sg7:
    Vendor ID: ATA HGST HSH721415AL T220
    SCSI ZBC device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
Operating on all zones...
```

### Graphical Interface

*gzbc* provides a graphical user interface that shows the zone configuration
and state of a zoned  device. *gzbc* displays the write status (write pointer
position) of zones by using color coding (red for written sectors and green for
unwritten sectors). Some operations on zones can be executed directly from the
interface ("reset zone write pointer", "open zone", "close zone", etc).

<Image src="tools-libzbc-gzbc.png" title="gzbc screeshot"/>

## Emulation Mode

:::note
Emulation mode is only available in *libzbc* prior to v6.0.0.0.
:::

*libzbc* emulation mode requires a regular file or a regular block device as
backend storage. The size of the file or the capacity of the block device is
used as the emulated device's capacity.

For example, the following commands will create a 10GB file name `zbc-disk`
that can be used as an emulated disk:

```plaintext
# touch zbc-disk
# truncate -s 10G zbc-disk
# ls -l zbc-disk
-rw-r--r-- 1 root root 10737418240 May 22 16:48 zbc-disk
```
This file can now be initialized for use with *libzbc* emulation mode:

```plaintext
# zbc_set_zones zbc-disk set_ps 10 256
Device zbc-disk:
    Vendor ID: FAKE HGST HM libzbc
    Emulated zoned block device interface, Host-managed zone model
    20971520 512-bytes sectors
    20971520 logical blocks of 512 B
    2621440 physical blocks of 4096 B
    10.737 GB capacity
    Read commands are restricted
    Maximum number of open sequential write required zones: 32

Setting zones:
    Zone size: 256 MiB (524288 sectors)
    Conventional zones: 1024 MiB (2097152 sectors), 10.00 % of total capacity), 4 zones
    Sequential zones: 36 zones
```
The file can now be used with *libzbc* library functions and tools as though it
is a physical zoned block device:

```plaintext
# zbc_report_zones zbc-disk
Device zbc-disk:
    Vendor ID: FAKE HGST HM libzbc
    Emulated zoned block device interface, Host-managed zone model
    20971520 512-bytes sectors
    20971520 logical blocks of 512 B
    2621440 physical blocks of 4096 B
    10.737 GB capacity
    Read commands are restricted
    Maximum number of open sequential write required zones: 32
    40 zones from 0, reporting option 0x00
40 / 40 zones:
Zone 00000: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 0, 524288 sectors
Zone 00001: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 524288, 524288 sectors
Zone 00002: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 1048576, 524288 sectors
Zone 00003: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 1572864, 524288 sectors
Zone 00004: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 2097152, 524288 sectors, wp 2097152
Zone 00005: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 2621440, 524288 sectors, wp 2621440
...
Zone 00038: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 19922944, 524288 sectors, wp 19922944
Zone 00039: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 20447232, 524288 sectors, wp 20447232
```
