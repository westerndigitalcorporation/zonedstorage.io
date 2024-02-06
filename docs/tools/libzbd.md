---
id: libzbd
sidebar_label: libzbd User Library
title: libzbd User Library
---

import Image from '/src/components/Image';
import Video from '/src/components/Video';

# libzbd User Library

*libzbd* is a user library that provides functions for manipulating zoned block
devices.

Unlike the [*libzbc*](/docs/tools/libzbc) library, *libzbd* does not implement
direct command access to zoned block devices. *libzbd* instead uses the
kernel-provided zoned block device interface that is based on the *ioctl()*
system call. A direct consequence of this is that *libzbd* allows access only
to zoned block devices that are supported by the running kernel. This includes
both physical devices (such as hard-disks that support the ZBC and ZAC
standards) and all logical block devices that are implemented by various device
drivers (such as [*null_blk*](/docs/getting-started/zbd-emulation) and [device
mapper](/docs/linux/dm) drivers).

The *libzbd* project is hosted on <a href="https://github.com/westerndigitalcorporation/libzbd"
target="_blank">GitHub</a>.
The project <a href="https://github.com/westerndigitalcorporation/libzbd/blob/master/README.md"
target="_blank">*README* file</a> provides information on how to compile and 
install the *libzbd* library and its tools.

## Overview

*libzbd* provides functions for discovering and managing the state of the zones
in zoned block devices. Read and write accesses to the devices can be made
using standard I/O system calls.

When *libzbd* functions (and write operations) are performed on the zones of a
zoned block device, the execution of those functions and operations can result
in changes to the condition of the device zones and changes to the attributes
of the device zones. An example of this is the location of the write pointer in
sequential zones. These changes are not tracked internally by *libzbd*.

In other words, *libzbd* is stateless.

It is the responsibility of applications to track changes to the condition of
zones. Such changes include the increased write pointer position within a
sequential zone after a write request to the zone has completed. 

## Library Functions

All *libzbd* functions use byte units to measure zone-related information. This
zone-related information includes the zone's start position on the device, the 
zone's size, and the zone write pointer location. Zoned block devices are
identified using regular file descriptor numbers, which can be used "as is"
with standard I/O system calls.

However, application programmers must be careful always to implement read
accesses so that they are aligned to the device logical block size.
Furthermore, on host managed zoned block devices, write operations to
sequential zones must be aligned to the device's physical block size.

The main functions provided by *libzbd* are as follows:

<center>

| Function | Description |
| :------- | :---------- |
| zbd_open() | Open a zoned block device |
| zbd_close() | Close an open zoned block device |
| zbd_get_info() | Get a device information |
| zbd_report_nr_zones() | Get the number of zones of a device|
| zbd_report_zones() | Get a device zone information |
| zbd_list_zones() | Get a device zone information |
| zbd_zones_operation() | Execute an operation on a range of zones |
| zbd_open_zones() | Explicitly open a range of zone |
| zbd_close_zones() | Close a range of zones |
| zbd_reset_zones() | Reset the write pointer of a range of zones |
| zbd_finish_zones() | Finish a range of zone |

</center>

More detailed information about these functions' usage and behavior can be
found in the comments of <a
href="https://github.com/westerndigitalcorporation/libzbd/blob/master/include/libzbd/zbd.h"
target="_blank">*libzbd* header file</a>. This header file is installed by
default as `/usr/include/libzbd/zbd.h`.

*libzbd* does not implement any mutual exclusion mechanism for multi-thread or
multi-process applications. This means that it is the responsibility of
applications to synchronize the execution of conflicting operations that target
the same zone. A typical example of such a case is when multiple threads
execute concurrent write operations to the same zone, which can result in write
errors when the application does not have write ordering control.

The following functions are provided by *libzbd* to facilitate application
development and tests:

<center>

| Function | Description |
| :------- | :---------- |
| zbd_device_is_zoned() | Test if a device is a zoned block device |
| zbd_device_model_str() | Get a string description of a device model |
| zbd_zone_type_str() | Get a string description of a zone type |
| zbd_zone_cond_str() | Get a string description of a zone condition |
| zbd_set_log_level() | Set the library verbosity level |

</center>

All functions behave in the same manner regardless of the type of disk
being used.

## Utilities

*libzbd* provides several command-line applications for manipulating zoned
block devices by calling the library functions. The list of applications
provided by *libzbd* is shown in the table below:

<center>

| Tool | Description |
| :--- | :---------- |
| zbd | Command line utility to report, open, close, reset and finish zones of a device |
| gzbd | Similar to the zbd tool but using a graphical user interface |
| gzbd-viewer | Graphical user interface showing the condition and state of zones of a zoned block device |

</center>

Each of these utilities outputs a help message when executed without any
argument:

```plaintext
# zbd
Usage: zbd <command> [options] <dev>
Command:
  report	: Get zone information
  reset		: Reset zone(s)
  open		: Explicitly open zone(s)
  close		: Close zone(s)
  finish	: Finish zone(s)
Common options:
  -v		   : Verbose mode (for debug)
  -i		   : Display device information
  -ofst <ofst (B)> : Start offset of the first zone of the
		     target range (default: 0)
  -len <len (B)>   : Size of the zone range to operate on
		     (default: device capacity)
  -u <unit (B)>	   : Size unit for the ofst and len options
		     and for displaying zone report results.
		     (default: 1)
Report command options:
  -csv		: Use csv output format
  -n		: Only output the number of zones in the report
  -ro <opt>	: Specify zone report filter.
		  * "em": empty zones
		  * "oi": implicitly open zones
		  * "oe": explicitly open zones
		  * "cl": closed zones
		  * "fu": full zones
		  * "ro": read-only zones
		  * "ol": offline zones
		  * "nw": conventional zones
		  * "ns": non-seq write resource zones
		  * "rw": reset-wp recommended zones
```

Manual pages are also provided for each tool:

```plaintext
# man zbd

ZBD(8)                     System Manager's Manual                       ZBD(8)

NAME
       zbd - manage zoned block devices

SYNOPSIS
       zbd command [options] device

DESCRIPTION
       zbd  is  used  to  manipulate  zones of a zoned block device. Zoned block
       devies are block devices that support the SCSI Zoned Block Commands
       (ZBC), ATA  Zoned-device  ATA  Commands (ZAC)  or  NVMe  Zoned NameSpace
       commands (ZNS).  The zones to operate on can be specified using the
       offset and length options.

       The device argument must be the pathname of the target zoned block
       device.

COMMANDS
   report
       The command zbd report is used to obtain and display the device zone
       information.

       By default, the command will report all zones from the start of the
       device up to the  last zone  of  the  device.  Options may be used to
       modify this behavior, changing the starting zone or the size of the
       report.
...
```

### *zbd* Tool Examples 

The following examples use a null zoned block device with 4 conventional zones
and 12 sequential zones of 32 MB that have been created using the
[*nullblk-zoned.sh*](/docs/getting-started/zbd-emulation#zoned-block-device-emulation-with-null_blk)
script:

```plaintext
# nullblk-zoned.sh 4096 32 4 12
### Created /dev/nullb0
```

The following command can be used to list the zone information for all the
zones of a device. This includes the device information such as logical block size
and capacity.

```plaintext
# zbd report -i /dev/nullb0
Device /dev/nullb0:
    Vendor ID: Unknown
    Zone model: host-managed
    Capacity: 0.537 GB (1048576 512-bytes sectors)
    Logical blocks: 131072 blocks of 4096 B
    Physical blocks: 131072 blocks of 4096 B
    Zones: 16 zones of 32.0 MB
    Maximum number of open zones: no limit
    Maximum number of active zones: no limit
Zone 00000: cnv, ofst 00000000000000, len 00000033554432, cap 00000033554432
Zone 00001: cnv, ofst 00000033554432, len 00000033554432, cap 00000033554432
Zone 00002: cnv, ofst 00000067108864, len 00000033554432, cap 00000033554432
Zone 00003: cnv, ofst 00000100663296, len 00000033554432, cap 00000033554432
Zone 00004: swr, ofst 00000134217728, len 00000033554432, cap 00000033554432, wp 00000134217728, em, non_seq 0, reset 0
Zone 00005: swr, ofst 00000167772160, len 00000033554432, cap 00000033554432, wp 00000167772160, em, non_seq 0, reset 0
Zone 00006: swr, ofst 00000201326592, len 00000033554432, cap 00000033554432, wp 00000201326592, em, non_seq 0, reset 0
Zone 00007: swr, ofst 00000234881024, len 00000033554432, cap 00000033554432, wp 00000234881024, em, non_seq 0, reset 0
Zone 00008: swr, ofst 00000268435456, len 00000033554432, cap 00000033554432, wp 00000268435456, em, non_seq 0, reset 0
Zone 00009: swr, ofst 00000301989888, len 00000033554432, cap 00000033554432, wp 00000301989888, em, non_seq 0, reset 0
Zone 00010: swr, ofst 00000335544320, len 00000033554432, cap 00000033554432, wp 00000335544320, em, non_seq 0, reset 0
Zone 00011: swr, ofst 00000369098752, len 00000033554432, cap 00000033554432, wp 00000369098752, em, non_seq 0, reset 0
Zone 00012: swr, ofst 00000402653184, len 00000033554432, cap 00000033554432, wp 00000402653184, em, non_seq 0, reset 0
Zone 00013: swr, ofst 00000436207616, len 00000033554432, cap 00000033554432, wp 00000436207616, em, non_seq 0, reset 0
Zone 00014: swr, ofst 00000469762048, len 00000033554432, cap 00000033554432, wp 00000469762048, em, non_seq 0, reset 0
Zone 00015: swr, ofst 00000503316480, len 00000033554432, cap 00000033554432, wp 00000503316480, em, non_seq 0, reset 0
```

The same zone information can also be obtained in csv format so that it can
more easily be parsed by scripting languages (including shell scripts).

```plaintext
# zbd report -csv /dev/nullb0
zone num, type, ofst, len, cap, wp, cond, non_seq, reset
00000, 1, 00000000000000, 00000033554432, 00000033554432, 00000033554432, 0x0, 0, 0
00001, 1, 00000033554432, 00000033554432, 00000033554432, 00000067108864, 0x0, 0, 0
00002, 1, 00000067108864, 00000033554432, 00000033554432, 00000100663296, 0x0, 0, 0
00003, 1, 00000100663296, 00000033554432, 00000033554432, 00000134217728, 0x0, 0, 0
00004, 2, 00000134217728, 00000033554432, 00000033554432, 00000134217728, 0x1, 0, 0
00005, 2, 00000167772160, 00000033554432, 00000033554432, 00000167772160, 0x1, 0, 0
00006, 2, 00000201326592, 00000033554432, 00000033554432, 00000201326592, 0x1, 0, 0
00007, 2, 00000234881024, 00000033554432, 00000033554432, 00000234881024, 0x1, 0, 0
00008, 2, 00000268435456, 00000033554432, 00000033554432, 00000268435456, 0x1, 0, 0
00009, 2, 00000301989888, 00000033554432, 00000033554432, 00000301989888, 0x1, 0, 0
00010, 2, 00000335544320, 00000033554432, 00000033554432, 00000335544320, 0x1, 0, 0
00011, 2, 00000369098752, 00000033554432, 00000033554432, 00000369098752, 0x1, 0, 0
00012, 2, 00000402653184, 00000033554432, 00000033554432, 00000402653184, 0x1, 0, 0
00013, 2, 00000436207616, 00000033554432, 00000033554432, 00000436207616, 0x1, 0, 0
00014, 2, 00000469762048, 00000033554432, 00000033554432, 00000469762048, 0x1, 0, 0
00015, 2, 00000503316480, 00000033554432, 00000033554432, 00000503316480, 0x1, 0, 0
```

### Zone Operations

The *zbd* tool makes it possible to execute zone management operations over a
range of zones. The following example explicitly opens the first 2 sequential
zones of the *null_blk* device:

```plaintext
# zbd open -ofst 134217728 -len 67108864 /dev/nullb0 
# zbd report /dev/nullb0
Zone 00000: cnv, ofst 00000000000000, len 00000033554432, cap 00000033554432
Zone 00001: cnv, ofst 00000033554432, len 00000033554432, cap 00000033554432
Zone 00002: cnv, ofst 00000067108864, len 00000033554432, cap 00000033554432
Zone 00003: cnv, ofst 00000100663296, len 00000033554432, cap 00000033554432
Zone 00004: swr, ofst 00000134217728, len 00000033554432, cap 00000033554432, wp 00000134217728, oe, non_seq 0, reset 0
Zone 00005: swr, ofst 00000167772160, len 00000033554432, cap 00000033554432, wp 00000167772160, oe, non_seq 0, reset 0
Zone 00006: swr, ofst 00000201326592, len 00000033554432, cap 00000033554432, wp 00000201326592, em, non_seq 0, reset 0
Zone 00007: swr, ofst 00000234881024, len 00000033554432, cap 00000033554432, wp 00000234881024, em, non_seq 0, reset 0
Zone 00008: swr, ofst 00000268435456, len 00000033554432, cap 00000033554432, wp 00000268435456, em, non_seq 0, reset 0
Zone 00009: swr, ofst 00000301989888, len 00000033554432, cap 00000033554432, wp 00000301989888, em, non_seq 0, reset 0
Zone 00010: swr, ofst 00000335544320, len 00000033554432, cap 00000033554432, wp 00000335544320, em, non_seq 0, reset 0
Zone 00011: swr, ofst 00000369098752, len 00000033554432, cap 00000033554432, wp 00000369098752, em, non_seq 0, reset 0
Zone 00012: swr, ofst 00000402653184, len 00000033554432, cap 00000033554432, wp 00000402653184, em, non_seq 0, reset 0
Zone 00013: swr, ofst 00000436207616, len 00000033554432, cap 00000033554432, wp 00000436207616, em, non_seq 0, reset 0
Zone 00014: swr, ofst 00000469762048, len 00000033554432, cap 00000033554432, wp 00000469762048, em, non_seq 0, reset 0
Zone 00015: swr, ofst 00000503316480, len 00000033554432, cap 00000033554432, wp 00000503316480, em, non_seq 0, reset 0
```

Writing 32MB to the first zone by using `dd` transitions the zone to the "full" state:

```plaintext
# dd if=/dev/zero of=/dev/nullb0 oflag=direct bs=1M count=32 seek=128
32+0 records in
32+0 records out
33554432 bytes (34 MB, 32 MiB) copied, 0.00945045 s, 3.6 GB/s
# zbd report /dev/nullb0
Zone 00000: cnv, ofst 00000000000000, len 00000033554432, cap 00000033554432
Zone 00001: cnv, ofst 00000033554432, len 00000033554432, cap 00000033554432
Zone 00002: cnv, ofst 00000067108864, len 00000033554432, cap 00000033554432
Zone 00003: cnv, ofst 00000100663296, len 00000033554432, cap 00000033554432
Zone 00004: swr, ofst 00000134217728, len 00000033554432, cap 00000033554432, wp 00000167772160, fu, non_seq 0, reset 0
Zone 00005: swr, ofst 00000167772160, len 00000033554432, cap 00000033554432, wp 00000167772160, oe, non_seq 0, reset 0
Zone 00006: swr, ofst 00000201326592, len 00000033554432, cap 00000033554432, wp 00000201326592, em, non_seq 0, reset 0
Zone 00007: swr, ofst 00000234881024, len 00000033554432, cap 00000033554432, wp 00000234881024, em, non_seq 0, reset 0
Zone 00008: swr, ofst 00000268435456, len 00000033554432, cap 00000033554432, wp 00000268435456, em, non_seq 0, reset 0
Zone 00009: swr, ofst 00000301989888, len 00000033554432, cap 00000033554432, wp 00000301989888, em, non_seq 0, reset 0
Zone 00010: swr, ofst 00000335544320, len 00000033554432, cap 00000033554432, wp 00000335544320, em, non_seq 0, reset 0
Zone 00011: swr, ofst 00000369098752, len 00000033554432, cap 00000033554432, wp 00000369098752, em, non_seq 0, reset 0
Zone 00012: swr, ofst 00000402653184, len 00000033554432, cap 00000033554432, wp 00000402653184, em, non_seq 0, reset 0
Zone 00013: swr, ofst 00000436207616, len 00000033554432, cap 00000033554432, wp 00000436207616, em, non_seq 0, reset 0
Zone 00014: swr, ofst 00000469762048, len 00000033554432, cap 00000033554432, wp 00000469762048, em, non_seq 0, reset 0
Zone 00015: swr, ofst 00000503316480, len 00000033554432, cap 00000033554432, wp 00000503316480, em, non_seq 0, reset 0
```

Other possible zone operations are *close*, *reset*, and *finish*.

### Graphical Interface

*gzbd* provides a graphical user interface that shows the zone configuration
and the state of a zoned block device. *gzbd* also displays the write status
(the write pointer position) of zones graphically by using color coding: red
for written sectors and green for unwritten sectors. Operations on zones can be
executed directly from the interface (examples of such operations include
"reset zone write pointer", "open zone", and "close zone").

<Image src="tools-libzbd-gzbd.png" title="gzbd screenshot"/>

The *gzbd-viewer* graphical interface is a tool that is simpler than *gzbd*.
It displays only the current zone condition and the state of a zoned block
device. The zone state is refreshed by default twice per second. This period
can be adjusted by using a command line option.

<Image src="tools-libzbd-gzbd-viewer.png" title="gzbd-viewer screenshot"/>

*gzbd* provides simple visual cues to show a given application's performance
and usage of the zones of a zoned block device. The following example
illustrates this:

<Video src="tools-libzbd-gzbd-viewer-example.mp4"
title="Application execution observed with gzbd-viewer"/>
