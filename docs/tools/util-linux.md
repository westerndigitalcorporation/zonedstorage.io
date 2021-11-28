---
id: util-linux
title: Linux System Utilities
sidebar_label: Linux System Utilities
---

# Linux System Utilities

As defined by the project itself, *util-linux* is a random collection of
Linux&reg; utilities. This project is hosted
on <a href="https://github.com/karelzak/util-linux" target="_blank">GitHub</a>.
This project generally packaged in most distributions under the name
*util-linux* and installed by default.

Among many utilities, *util-linux* provides the *lsblk* and *blkzone* command
line tools to list zoned block devices and to obtain zone configuration. The
*blkzone* tool also allows resetting write pointer of sequential zones.

These utilities are especially useful for shell scripting and for
troubleshooting of zone management problems in user applications.

## lsblk

The lsblk command lists all block devices of a system, regardless of the block
device type, that is, also including zoned block devices. The output of *lsblk*
is as follows.

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

By default, there is no indication of the zone model of the listed block
devices. To discover this information, the option `-z` can be used.

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

The output of *lsblk* can also be formatted as needed using the `-o` option. For
instance, the following command will display block device names, size and zone
model.

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

The *blkzone* command line utility allows listing (reporting) the zones of a
zoned block device and resetting the write pointer of sequential zones. Unlike
the *sg_rep_zone* and *sg_reset_wp* utilities of the
[*sg3utils*](../tools/sg3utils.md) project, *blkzone* relies on the kernel
provided ZBD `ioctl()` interface to perform zone report and zone reset
operations. SCSI commands are not issued directly to the device by *blkzone*.

*blkzone* command usage is as shown below.

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
The open, close and finish commands of *blkzone* are available with *util-linux*
version 2.36 onward. The capacity command is available on the master branch.
:::

### Zone Report

For listing the zones of device, the following command can be used.

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

To restrict the range of zones reported, the options `--offset` and `--count`
can be used. For instance, to report only the first sequential zone of a disk
starting at sector 274726912, the following command can be used.

```plaintext
# blkzone report --offset 274726912 --count 1 /dev/sdd
start: 0x010600000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

### Device capacity

If zone capacity is smaller than zone size, the size listed in blockdev and
lsblk is not indicating how much data that can be stored on on the zoned block
device. The storage capacity of the device is the sum of the capacity of all
zones.

For determining the storage capcity of a device in sectors, the following command can be used:
```plaintext
# blkzone capacity /dev/nullb1
0x00c350000
```

### Zone Reset

Sequential write zones can be reset with *blkzone* using the `reset` operation.
For instance, to reset the first sequential zone of a disk starting at sector
274726912, the following command can be used.

```plaintext
# blkzone reset --offset 274726912 --count 1 /dev/sdd
```

If the range of zones specified with the `reset` operation includes conventional
zones, the command will fail.

```plaintext
# blkzone reset /dev/sdd
blkzone: /dev/sdh: BLKRESETZONE ioctl failed: Remote I/O error
```

The user must exclude all conventional zones. With the disk used for the above
example, all conventional zones are located between sector 0 and 274726912. The
remaining of the disk is composed of sequential write zones. Therefore, the
following command will reset write pointer in all zones.

```plaintext
# blkzone reset --offset 274726912 /dev/sdd
```

:::note
This command results in the kernel looping over all sequential zone of the disk
and executing a zone reset command on each zone. This can be time consuming and
takes a significantly longer time compared to using the
[*sg_reset_wp*](../tools/sg3utils.md#sg_reset_wp) command with the `--all`
option specified.
:::
