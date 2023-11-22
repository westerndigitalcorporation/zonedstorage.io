---
id: util-linux
title: Linux System Utilities
sidebar_label: Linux System Utilities
---

# Linux System Utilities

*util-linux* is, as the documentation of the *util-linux* project itself says, 
a random collection of Linux&reg; utilities. The *util-linux* project is
hosted <a href="https://github.com/karelzak/util-linux" target="_blank">here on GitHub</a>
and <a href="https://github.com/util-linux/util-linux" target="_blank">here</a>.
This project is packaged in most distributions under the name *util-linux* and
is installed by default.

*util-linux* provides (among other utilities) the *lsblk* and *blkzone*
command-line tools, which are used to list zoned block devices and to obtain
zone configurations. The *blkzone* tool also allows the write pointer of
sequential zones to be reset.

These utilities are especially useful for shell scripting and for
troubleshooting zone management problems in user applications.

## lsblk

The lsblk command lists all the block devices of a system, regardless of the
block device type (this means that yes, it also includes zoned block devices).
The output of *lsblk* is as follows:

```plaintext
# lsblk
NAME     MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda        8:0    0 167.7G  0 disk
├─sda1     8:1    0     1G  0 part /boot
├─sda2     8:2    0 150.7G  0 part /
└─sda3     8:3    0    16G  0 part [SWAP]
sdb        8:16   0  12.8T  0 disk
sdc        8:32   0  12.8T  0 disk
sdd        8:48   0  13.7T  0 disk
```

By default, *lsblk* provides no indication of the zone model of the listed
block devices. To discover this information, use the option `-z`:

```plaintext
# lsblk -z
NAME     ZONED
sda      none
├─sda1   none
├─sda2   none
└─sda3   none
sdb      host-managed
sdc      host-managed
sdd      host-managed
```

The output of *lsblk* can be formatted by using the `-o` option. For example,
the following command will display block device names, size, and zone model.

```plaintext
# lsblk -o NAME,SIZE,ZONED
NAME       SIZE ZONED
sda      167.7G none
├─sda1       1G none
├─sda2   150.7G none
└─sda3      16G none
sdb       12.8T host-managed
sdc       12.8T host-managed
sdd       13.7T host-managed
```

## blkzone

The *blkzone* command line utility lists (reports) the zones of a zoned block
device and resets the write pointer of sequential zones. Unlike the
*sg_rep_zone* and *sg_reset_wp* utilities of the
[*sg3utils*](/docs/tools/sg3utils) project, *blkzone* relies on the kernel-
provided ZBD `ioctl()` interface to perform "zone report" and "zone reset"
operations. *blkzone* does not issue SCSI, ATA, or NVMe commands directly to
the device.

*blkzone* command usage is as shown below:

```plaintext
# blkzone --help

Usage:
 blkzone <command> [options] <device>

Run zone command on the given block device.

Commands:
 report       Report zone information about the given device
 capacity     Report zone capacity for the given device
 reset        Reset a range of zones.
 open         Open a range of zones.
 close        Close a range of zones.
 finish       Set a range of zones to Full.

Options:
 -o, --offset <sector>  start sector of zone to act (in 512-byte sectors)
 -l, --length <sectors> maximum sectors to act (in 512-byte sectors)
 -c, --count <number>   maximum number of zones
 -f, --force            enforce on block devices used by the system
 -v, --verbose          display more details

 -h, --help             display this help
 -V, --version          display version

Arguments:
 <sector> and <sectors> arguments may be followed by the suffixes for
   GiB, TiB, PiB, EiB, ZiB, and YiB (the "iB" is optional)

For more details see blkzone(8).
```

:::note
The "open", "close" and "finish" commands of *blkzone* are available in
*util-linux* version 2.37 and later. The `capacity` command is available on the
master branch.
:::

### Zone Report

Use the following command to list the zones of a device:

```plaintext
# blkzone report /dev/sdd
  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000480000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  ...
  start: 0x010500000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010580000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010600000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010680000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010700000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010780000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010800000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  ...
```

To restrict the report to a range of zones, use the options `--offset` and
`--count`. For example, to report only the first sequential zone
of a disk starting at sector 274726912, use the following command:

```plaintext
# blkzone report --offset 274726912 --count 1 /dev/sdd
start: 0x010600000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

### Device capacity

If a zone's capacity is smaller than its size, the size listed in *blockdev* and
*lsblk* does not indicate how much data can be stored on on the zoned block
device. The storage capacity of the device is the sum of the capacity of all
zones.

Use the following command to determine the storage capcity of a device in
sectors: 
```plaintext
# blkzone capacity /dev/nullb1
0x00c350000
```

### Zone Reset

Sequential write zones can be reset with *blkzone* by using the `reset`
operation. For example, to reset the first sequential zone of a disk starting
at sector 274726912, use the following command:

```plaintext
# blkzone reset --offset 274726912 --count 1 /dev/sdd
```

If the range of zones that is specified with the `reset` operation includes
conventional zones, the command will fail:

```plaintext
# blkzone reset /dev/sdd
blkzone: /dev/sdh: BLKRESETZONE ioctl failed: Remote I/O error
```

The user MUST exclude all conventional zones. In the example above, all
conventional zones are located on the disk between sector 0 and 274726912.  The
remainder of the disk is composed of sequential write zones. This means that
the following command will reset the write pointer in all zones:

```plaintext
# blkzone reset --offset 274726912 /dev/sdd
```
:::note
This command results in the kernel (1) looping over all of the disk's
sequential zones and (2) executing a "zone reset" command on each zone. This
can be time-consuming and takes much longer than does using the
[*sg_reset_wp*](/docs/tools/sg3utils#sg_reset_wp) command with the `--all`
option specified.
:::
