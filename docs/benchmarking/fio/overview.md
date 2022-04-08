---
id: overview
title: Overview
sidebar_label: Overview
slug: /benchmarking/fio/overview
---

# Overview

The *Flexible I/O Tester (fio)* was originally written as a test tool for the
kernel block I/O stack. Over the years, *fio* however gained many features and
detailed performance statistics output that turned this tool into a standard
benchmark application for storage devices.

*fio* source code is available on <a href="https://github.com/axboe/fio"
target="_blank">GitHub</a>.

## fio Zoned Block Device Support

Support for zoned block devices was added to *fio* with version 3.9. All
previous versions do not provide guarantees for write command ordering with
host managed zoned block devices. Executing workloads is still possible, but
requires writing complex *fio* scripts.

### Command Line Options

Changes to *fio* to support zoned block devices include several new options
allowing a user to control zoned block device compliant workloads. *fio*
already implemented the option `--zonemode` which allows defining workloads
operating on disjoint ranges of blocks. This option was reused to define the new
*zbd* zone mode.

When the *zbd* zone mode is used by an *fio* job, the `--zonerange` option is
ignored and the `--zonesize` option is automatically set to the device zone
size. Furthermore, the behavior of read and write commands is modified as
follows.

* Read and write commands are split when a zone boundary is crossed.

* For sequential writes, the write stream is always started from a zone write
  pointer position. If the next zone to be written is not empty, the write
  stream "jumps" to that zone write pointer and resumes.

* For random write workloads, write commands are always issued at the write
  pointer position of the target zone of the write command.

* Any write command targeting a sequential zone that is full (entirely written)
  will trigger a reset of the zone write pointer before issuing the write I/O.

* By default, all read commands always target written sectors, that is, sectors
  between the start sector and the write pointer position of sequential write
  zones. This behavior can be disabled, allowing read commands to be issued to
  any sector, using the new option `read_beyond_wp`.

Additionally, finer control over the workload operation can be added with the
following new options.

* **--max_open_zones** This option limits the number of zones that are being
  written by a workload. With this option, a random write workload cannot issue
  write commands targeting more zones than the limit set. Once a zone that is
  being written becomes full, another zone is chosen and writes are allowed to
  target the zone, resulting in a constant number of zones being written always
  at most equal to the `max_open_zones` limit.

* **--zone_reset_threshold and --zone_reset_frequency** These two options allow
  a user to emulate the execution of zone reset commands being issued by an
  application.

In addition to these options, the *zbd* zone mode automatically enables job
synchronization to ensure that a workload spanning multiple threads or processes
can concurrently execute write I/Os targeting the same zone.

### Restrictions

As discussed in the [kernel support
document](../../linux/overview.md#zbd-support-restrictions), using
direct write I/O is mandatory for zoned block devices. The *zbd* zone mode,
when enabled, enforces this requirement by checking that the option
`--direct=1` is specified for any job executing write I/Os.

The `--offset` and `--size` options must specify values that are aligned to the
device zone size.

## Examples

* [ZAC fio Examples](zac-fio.md): fio benchmarking examples for ZAC devices.
