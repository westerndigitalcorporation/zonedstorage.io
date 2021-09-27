# libzbc User Library

*libzbc* is a user library providing functions for manipulating ZBC and ZAC 
disks. *libzbc* command  implementation is compliant with the latest published
versions of the ZBC and ZAC standards defined by INCITS technical committees
T10 and T13 (respectively).

In addition to supporting ZBC and ZAC disks, *libzbc* also implements an
emulation mode allowing the library to imitate the behavior of a host managed
zoned disk using a regular file or a standard block device as the backing store.

The *libzbc* project is hosted on <a href="https://github.com/westerndigitalcorporation/libzbc"
target="_blank">GitHub</a>. The project
<a href="https://github.com/westerndigitalcorporation/libzbc/blob/master/README.md" target="_blank">
*README* file</a> provides information on how to compile and install *libzbc*
library and its tools.

!!! Note
	The *libzbc* project was formerly hosted on GitHub as part of the
	<a href="https://github.com/hgst" target="_blank">HGST organization</a>.
	*libzbc* repository has since then moved to the
	<a href="https://github.com/westerndigitalcorporation/"
	target="_blank">Western Digital Corporation organization on GitHub</a>.

*libzbc* also provides a test suite allowing to test the conformance of disks
and HBAs to the ZBC and ZAC standards. In order to make the test suite available,
*libzbc* needs to be configured using *--with-test* option prior to building and
installing the library. The usage of this test suite is described in more
details [here](../tests/zbc-tests.md).

## Overview

*libzbc* provides a unified application programming interface (API) that is
independent of the zone model and interface of the disk being used. Internally,
four different types of device drivers are used to handle device interface
dependent commands.

* **ZAC ATA Driver** This driver is used to handle direct delivery of ATA
  commands to ZAC disks through the SCSI generic driver (direct device
  access interface).
* **ZBC SCSI Driver** This driver primarily handles SCSI commands directed at
  ZBC SCSI disks, but can also be used to control ZAC ATA disks if a functional
  SCSI to ATA (SAT) command translation layer is functional in the command path.
  SAT may be provided either by the kernel *libata* subsystem for ATA disks
  connected to SATA adapters or by a SAS host bus adapter (HBA) for SATA disks
  connected to such adapter.
* **Zoned Block Device Driver** This driver uses the kernel ZBD interface to
  control both ZBC and ZAC disks. This driver is only available if the kernel
  zoned block device support is present and enabled.
* **File Emulation Driver** This driver implements emulation of a host managed
  ZBC disk using a regular file or regular block device as backend storage. This
  driver is intended for development only. A more advanced ZBC disk emulation
  solution is provided by the [*tcmu-runner*](tcmu-runner.md) project.

The figure below shows this structure.

<center>
<a><img alt="libzbc" src="../../assets/img/projects-libzbc.png"
title="libzbc internal backend drivers organization" width="800"
style="max-width:100%;"></a>
<br><em>libzbc internal backend drivers organization</em></br>
</center>

*libzbc* provides functions for discovering the zone configuration of a zoned
device and for accessing the device. Accesses to the device may result in
changes to the condition, attributes or state of device zones (such as write pointer
location in sequential zones). These changes are not internally tracked by *libzbc*.
That is, *libzbc* is stateless.

The functions provided to obtain the device zone information only make a
"snapshot" of the zone condition and state when executed. It is the
responsibility of applications to implement tracking of the device zone changes
such as the increasing write pointer position of a sequential zone after the
completion of write requests to the zone.

## Library Functions

All *libzbc* functions, since version  5.0.0, use a 512 bytes sector unit for
reporting zone information and as the sector addressing unit for device
accesses regardless of the actual device logical block size. This unification
in the unit used by all functions can simplify application development by hiding
potential differences in logical block sizes between devices. However,
application programmers must be careful to always implement accesses (read or
write) to the device aligned to the device logical block size.  Furthermore, on
host managed zoned devices, write operations to sequential zones must be aligned
to the device physical block size.

The main functions provided by *libzbc* are as follows.

<center>

| Function | Description |
| -------- | ----------- |
| zbc_open() | Open a zoned device |
| zbc_close() | Close a zoned device |
| zbc_get_device_info() | Get device information |
| zbc_report_nr_zones() | Get the number of zones |
| zbc_report_zones()<br>zbc_list_zones() | Get zone information |
| zbc_zone_operation() | Execute a zone operation |
| zbc_open_zone() | Explicitly open a zone |
| zbc_close_zone() | Close an open zone |
| zbc_finish_zone() | Finish a zone |
| zbc_reset_zone() | Reset a zone write pointer |
| zbc_pread() | Read data from a zone |
| zbc_pwrite() | Write data to a zone |
| zbc_flush() | Flush data to disk |

</center>

More detailed information about these functions usage and behavior can be found
in the comments of
<a href="https://github.com/westerndigitalcorporation/libzbc/blob/master/include/libzbc/zbc.h"
target="_blank">*libzbc* header file</a>. This header file is by default
installed as `/usr/include/libzbc/zbc.h`.

*libzbc* does not implement any mutual exclusion mechanism for multi-thread or
multi-process applications. This implies that it is the responsibility of
application to synchronize the execution of conflicting operations targeting
the same zone. A typical example of such case is concurrent write operations to
the same zone by multiple threads which may result in write errors without
write ordering control by the application.

The following functions are also provided by *libzbc* to facilitate application
development and tests.

<center>

| Function | Description |
| -------- | ----------- |
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

All functions will behave in the same manner regardless of the type of disk
being used. The only exception to this principle is the `zbc_errno()` function
inability to report detailed error information when the zoned block device
driver is used. The reason for this is that the kernel I/O stack does not have
the ability to propagate up to the application the detailed information provided
in command sense data with failed commands.

## Utilities

*libzbc* also provides several command line applications to manipulate zoned disks
by calling the library functions. The list of applications provided is shown in the
table below.

<center>

| Tool | Description |
| -------- | ----------- |
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

The following tools are also provided to create and modify the regular file or
regular block device used as backend storage with *libzbc* emulation mode.

<center>

| Tool | Description |
| -------- | ----------- |
| zbc_set_zones | Initialize (format) a regular file or regular disk to be used with *libzbc* emulation mode |
| zbc_set_write_ptr | Change the write pointer position of the sequential zones of an emulated disk (intended for testing purposes only as this is not a valid operation for physical ZBC devices |

</center>

All utilities output a help message when executed without any argument.

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

### Getting a Disk Information

*zbc_info* displays information about a disk, including regular block devices.

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

*zbc_report_zones* illustrates the use of *libzbc* zone reporting functions
zbc_report_zones(),  zbc_report_nr_zones() and zbc_list_zones().

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

The output of *zbc_report_zones* can also be limited using the option `-ro`
(reporting options) for filtering the zones reported, or the option `-n` to
limit the output to the number of zones that would be reported.

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

*zbc_write_zone* sequentially writes data to a zone. If the zone is a sequential
zone, the write pointer position advances until the zone is full. By default,
*zbc_write_zone* will write the entire zone. For instance, using the disk used
in the previous example, the first sequential write zone (zone number 524) can
be written with 512 KB writes until full with the following command.

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
Zone 00000: type 0x2 (Sequential-write-required), {==cond 0xe (Full)==}, reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 2251799813685240
```

The written zone can then be reset using *zbc_reset_zone*.

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
Zone 00000: type 0x2 (Sequential-write-required), {==cond 0x1 (Empty)==}, reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 274726912
```

All sequential write zones of a device can be reset using the option `-all`.

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

*gzbc* provides a graphical user interface showing the zone configuration and
state of a zoned  device. *gzbc* also  displays  the  write status (write
pointer position) of zones graphically using color coding (red for written
sectors and green for unwritten sectors). Some operations on zones can also be
executed directly from the interface (reset zone write pointer, open zone,
close zone, etc).

<center>
![gzbc](../assets/img/projects-libzbc-gzbc.png "*gzbc* screenshot")
<br>*gzbc screenshot*</br>                         
</center>

## Emulation Mode

*libzbc* emulation mode requires a regular file or a regular block device as
backend storage. The size of the file or the capacity of the block device used
will be used as the emulated device capacity.

For example, the following commands will create a 10GB file name `zbc-disk`
that can be used for an emulated disk.

```plaintext
# touch zbc-disk
# truncate -s 10G zbc-disk
# ls -l zbc-disk
-rw-r--r-- 1 root root 10737418240 May 22 16:48 zbc-disk
```

This file can now be initialized to be used with *libzbc* emulation mode.

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

The file can now be used with *libzbc* library functions and tools similarly to
any physical zoned block device.

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

