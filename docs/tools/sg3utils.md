---
id: sg3utils
title: SCSI Generic Utilities
sidebar_label: SCSI Generic Utilities
---

# SCSI Generic Utilities

Various open source projects provide support for directly manipulating SCSI
devices. The *lsscsi* command line tool and the *sg3_utils* library and
utilities collection are among the most widely used and they are available as
pre-compiled packages with most Linux&reg; distributions.

*lsscsi* has the capability to indicate if a device is a ZBC host managed zoned
block device, and the *sg3_utils* collection gained ZBC support with version
1.42.

## lsscsi

The <a href="http://sg.danny.cz/scsi/lsscsi.html" target="_blank">*lsscsi*</a>
command lists information about the SCSI devices connected to a Linux system.
*lsscsi* is generally available as a package with most Linux distributions. For
instance, on [Fedora&reg;](../distributions/linux.md#fedora-linux) Linux,
*lssci* can be installed using the following command.

```plaintext
# dnf install lsscsi
```

The name of the package may differ between distributions. Please refer to the
distribution documentation to find out the correct package name.

### Identifying Host Managed Disks

Executing *lsscsi* will list the disks that are managed using the kernel SCSI
subsystem. This always includes SATA disks directly connected to a SATA port on
the system mainboard or to a SATA PCIe adapter.

```plaintext
# lsscsi
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda
[4:0:0:0]    zbc     ATA      HGST HSH721414AL T220  /dev/sdb
[10:0:1:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdc
[10:0:3:0]   zbc     ATA      HGST HSH721415AL T220  /dev/sdd
```

The second column of the default output indicates the device type. For
host managed disks, the type name is `zbc`. For regular disks, it is `disk`.
Older versions of lsscsi may directly list the numerical value of the device
type. In the case of host managed disks, the value displayed is `0x14`.

Adding the option `-g` will output the SCSI Generic node file path associated
with a device. This is useful when using [libzbc](libzbc.md) or any of the
*sg3_utils* command line tools.

```plaintext
# lsscsi -g
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0
[4:0:0:0]    zbc     ATA      HGST HSH721414AL T220  /dev/sdb   /dev/sg1
[10:0:1:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdc   /dev/sg2
[10:0:3:0]   zbc     ATA      HGST HSH721415AL T220  /dev/sdd   /dev/sg3

```

### Disks Interface and Transport

The third column of the output is the disk vendor ID. For ATA disks, this is
always `ATA` even for ATA disks connected to a SAS host-bus-adapter (HBA). The
*transport* used to communicate with the disk can be more precisely discovered
using the `-t` option.

```plaintext
# lsscsi -t
[2:0:0:0]    disk    sata:55cd2e4000111f9b           /dev/sda
[4:0:0:0]    zbc     sata:5000cca25bc03731           /dev/sdb
[10:0:1:0]   zbc     sas:0x5000cca0000025c5          /dev/sdc
[10:0:3:0]   zbc     sas:0x300062b200f35d43          /dev/sdd
```

## sg3_utils

The <a href="http://sg.danny.cz/sg/sg3_utils.html" target="_blank">*sg3_utils*</a>
project provides a library and a collection of command line tools that directly
send SCSI commands to a SCSI device using the kernel SCSI generic driver.

The SCSI generic driver (*sg* driver) is generally enabled by default on most
distributions. The following command allows checking if the *sg* driver module
is already loaded.

```plaintext
# cat /proc/modules | grep sg
```

If this command output is empty, the *sg* driver should be loaded.

```plaintext
# modprobe sg
```

These commands will work only if the *sg* driver was compiled as a loadable
kernel module. In case of error, to verify if the *sg* driver was instead
compiled as part of the kernel, the following command can be used.

```plaintext
# modprobe sg
modinfo: ERROR: Module sg not found.

# cat /lib/modules/`uname -r`/modules.builtin | grep sg
kernel/drivers/scsi/sg.ko
```

Since all disks in Linux are exposed as SCSI devices, including all ATA
drives, these utilities can be used to manage both SCSI ZBC disks and SATA ZAC
disks. For SATA disks connected to SATA ports (e.g. an AHCI adapter), the
kernel SCSI subsystem translates SCSI commands to ATA commands.

*sg3_utils* includes three command line tools that are specific to ZBC disks.

<center>

| Utility Name | Main SCSI Command Invoked | Description |
| :----------: | :------------------------ | :---------- |
| **sg_rep_zones** | REPORT ZONES | Get a ZBC disk zone information |
| **sg_reset_wp** | RESET WRITE POINTER | Reset one or all zones of a ZBC disk |
| **sg_zone** | CLOSE ZONE, FINISH ZONE, OPEN ZONE | Sends one of these commands to the given ZBC device |

</center>

:::caution
The help output of the commands below uses the term LBA. In this
context, the term LBA refers to a 512 bytes sector size regardless of
the logical and physical block size of the disk.
:::

### sg_rep_zone

Executing the command with the `--help` option gives a simple usage explanation.

```plaintext
# sg_rep_zones --help
Usage: sg_rep_zones  [--help] [--hex] [--maxlen=LEN] [--partial]
                     [--raw] [--readonly] [--report=OPT] [--start=LBA]
                     [--verbose] [--version] DEVICE
  where:
    --help|-h          print out usage message
    --hex|-H           output response in hexadecimal; used twice
                       shows decoded values in hex
    --maxlen=LEN|-m LEN    max response length (allocation length in cdb)
                           (def: 0 -> 8192 bytes)
    --partial|-p       sets PARTIAL bit in cdb
    --raw|-r           output response in binary
    --readonly|-R      open DEVICE read-only (def: read-write)
    --report=OPT|-o OP    reporting options (def: 0: all zones)
    --start=LBA|-s LBA    report zones from the LBA (def: 0)
                          need not be a zone starting LBA
    --verbose|-v       increase verbosity
    --version|-V       print version string and exit

Performs a SCSI REPORT ZONES command.
```

Below is an example of the `sg_rep_zone` utility output.

```plaintext
# sg_rep_zone /dev/sdd
Report zones response:
  Same=1: zone type and length same in each descriptor

  Maximum LBA: 0xda47ffff
 Zone descriptor: 0
   Zone type: Conventional
   Zone condition: Not write pointer
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x0
   Write pointer LBA: 0xffffffffffff
 Zone descriptor: 1
   Zone type: Conventional
   Zone condition: Not write pointer
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x10000
   Write pointer LBA: 0xffffffffffff
 Zone descriptor: 2
   Zone type: Conventional
   Zone condition: Not write pointer
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x20000
   Write pointer LBA: 0xffffffffffff
 ...
```

:::note
The block device file path or the device SCSI Generic node file path can
both be used to specify a disk.
:::

It is possible to start a zone report at a specific zone by using the
`--start` option. For instance, to obtain the zone information starting at the
first sequential zone of the disk (LBA 34340864), the following command
can be used.

```plaintext
# sg_rep_zones --start=34340864 /dev/sdd
Report zones response:
  Same=1: zone type and length same in each descriptor

  Maximum LBA: 0xda47ffff
 Zone descriptor: 0
   Zone type: Sequential write required
   Zone condition: Empty
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x20c0000
   Write pointer LBA: 0x20c0000
 Zone descriptor: 1
   Zone type: Sequential write required
   Zone condition: Empty
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x20d0000
   Write pointer LBA: 0x20d0000
 ...
```

### sg_reset_wp

The command usage is as follows.

```plaintext
# sg_reset_wp --help
Usage: sg_reset_wp  [--all] [--help] [--verbose] [--version]
                    [--zone=ID] DEVICE
  where:
    --all|-a           sets the ALL flag in the cdb
    --help|-h          print out usage message
    --verbose|-v       increase verbosity
    --version|-V       print version string and exit

    --zone=ID|-z ID    ID is the starting LBA of the zone whose
                       write pointer is to be reset
Performs a SCSI RESET WRITE POINTER command. ID is decimal by default,
for hex use a leading '0x' or a trailing 'h'. Either the --zone=ID
or --all option needs to be given.
```

Resetting all sequential write zones of the disk can be done using the `--all`
option.

```plaintext
# sg_reset_wp --all /dev/sdd
```

A single sequential zone write pointer can be reset using the `--zone` option.

```plaintext
# sg_reset_wp --zone=34340864 /dev/sdd
```

Specifying the zone ID (zone start LBA) of a conventional zone results in
an error.

```plaintext
# sg_reset_wp --zone=0 /dev/sdd
Reset write pointer command: Illegal request
```

Reseting the write pointer of an empty sequential write zone has no effect
and does not result in an error.

### sg_zone

The command usage is as follows.

```plaintext
# sg_zone --help
Usage: sg_zone  [--all] [--close] [--finish] [--help] [--open]
                [--verbose] [--version] [--zone=ID] DEVICE
  where:
    --all|-a           sets the ALL flag in the cdb
    --close|-c         issue CLOSE ZONE command
    --finish|-f        issue FINISH ZONE command
    --help|-h          print out usage message
    --open|-o          issue OPEN ZONE command
    --verbose|-v       increase verbosity
    --version|-V       print version string and exit
    --zone=ID|-z ID    ID is the starting LBA of the zone

*sg_zone* can perform OPEN ZONE, CLOSE ZONE or FINISH ZONE SCSI commands. ID is
decimal by default. To enter a hexadecimal value, use a leading '0x' or
a trailing 'h'. Either --close, --finish, or --open option needs to be given.
There is no --reset option as it would duplicate the functionality provided
by *sg_reset_wp* utility.
```

The following example command sequence illustrates *sg_zone* and *sg_reset_wp*
effects on condition of a zone as reported with *sg_rep_zone*. At first, the
beginning sequential zone on the disk is explicitly open from empty condition.
Then, the zone is transitioned to full condition using the zone finish command
and, finally, reset again to return to empty condition.

```plaintext
# sg_rep_zones --start=34340864 /dev/sdd
Report zones response:
  Same=1: zone type and length same in each descriptor

  Maximum LBA: 0xda47ffff
 Zone descriptor: 0
   Zone type: Sequential write required
   Zone condition: {==Empty==}
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x20c0000
   Write pointer LBA: 0x20c0000
 ...
# sg_zone --open --zone=34340864 /dev/sdd
# sg_rep_zones --start=34340864 /dev/sdd
Report zones response:
  Same=1: zone type and length same in each descriptor

  Maximum LBA: 0xda47ffff
 Zone descriptor: 0
   Zone type: Sequential write required
   Zone condition: {==Explicitly opened==}
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x20c0000
   Write pointer LBA: 0x20c0000
 ...
# sg_zone --finish --zone=34340864 /dev/sdd
# sg_rep_zones --start=34340864 /dev/sdd
Report zones response:
  Same=1: zone type and length same in each descriptor

  Maximum LBA: 0xda47ffff
 Zone descriptor: 0
   Zone type: Sequential write required
   Zone condition: {==Full==}
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x20c0000
   Write pointer LBA: 0xffffffffffff
 ...
# sg_reset_wp --zone=34340864 /dev/sdd
# sg_rep_zones --start=34340864 /dev/sdd
Report zones response:
  Same=1: zone type and length same in each descriptor

  Maximum LBA: 0xda47ffff
 Zone descriptor: 0
   Zone type: Sequential write required
   Zone condition: {==Empty==}
   Non_seq: 0
   Reset: 0
   Zone Length: 0x10000
   Zone start LBA: 0x20c0000
   Write pointer LBA: 0x20c0000
 ...
```

