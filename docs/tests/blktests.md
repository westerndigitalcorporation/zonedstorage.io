---
id: blktests
title: Kernel Block Layer Tests
sidebar_label: Kernel Block Layer Tests
---

# Kernel Block Layer Tests

*blktests* is a test suite for Linux;reg; kernel storage stack, that is, the
block I/O layer as well as underlying device specific layers (SCSI, NVMe, SRP,
etc). *blktests* is heavily inspired by the *xfstests* framework for testing
file systems.

Recent contributions to *blktests* added zoned block device tests support.

The *blktests* project is hosted on
[GitHub](https://github.com/osandov/blktests).

## Overview

*blktests* organizes test cases into groups. The test groups currently available
are as shown in the table below.

<center>

| Group name | Description |
| :--------- | :---------- |
| **block** | Block layer generic tests |
| **loop** | Loopback device tests |
| **meta** | *blktests* self tests |
| **nbd** | Network block device driver tests |
| **nvme** | NVMe driver tests |
| **nvmeof-mp** | NVME-over-fabrics multipath tests |
| **scsi** | SCSI layer tests |
| **srp** | SCSI RDMA Protocol driver tests |
| **zbd** | Zoned block device tests |

</center>

The test groups supporting zoned block devices are *block* and *zbd*.
[*blkzone*](../tools/util-linux.md#blkzone) and [*fio*](../benchmarking/fio/overview.md)
version 3.9 or higher must be installed for executing these test groups.

## Configuration

Detailed generic information on how to configure and run *blktests* is
provided <a href="https://github.com/osandov/blktests/blob/master/Documentation/running-tests.md"
target="_blank">here</a>.

For executing tests against a physical zoned block device (e.g. a ZBC/ZAC disk),
the following `config` file should be prepared and copied to the *blktests*
installation directory. Tests can also be executed directly from the source
directory if the `config` file is copied in that location.

```bash
# Tests target device list
TEST_DEVS=(/dev/sdd)

# Enable zoned block device mode for the block group genertic tests 
RUN_ZONED_TESTS=1
```

With this configuration, all tests relevant to zoned block devices will be
executed. The execution duration can be several 10s of minutes depending on the
target device and host system. To Shorten execution, the options `TIMEOUT` and
`QUICK_RUN` can be added to the configuration.

```bash
# Tests target device list
TEST_DEVS=(/dev/sdd)

# Enable zoned block device mode for the block group genertic tests
RUN_ZONED_TESTS=1

# Speed up execution (weaker tests)
QUICK_RUN=1
TIMEOUT=30
```

Of note is that the block layer generic tests of the *block* group also include
test cases executed against a logical device (*null_blk* block device). These
tests are executed twice, once with the *null_blk* device configured as a
regular block device and a second time with the *null_blk* device configured as
a zoned block device. To reduce the test cases execution to only the physical
device specified in the configuration file, the `DEVICE_ONLY` option can be set.

```bash
# Tests target device list
TEST_DEVS=(/dev/sdd)

# Enable zoned block device mode for the block group genertic tests
RUN_ZONED_TESTS=1

# Speed up execution (weaker tests)
QUICK_RUN=1
TIMEOUT=30

# Exercise only the devices in TEST_DEVS
DEVICE_ONLY=1
```

## Execution

*blktests* execution is done using the `check` script present in the top level
directory. This script optionally takes as argument a list of test groups or
test cases to execute. Bu default, without any argument, all test groups will be
executed.

For zoned block device tests, executing the test cases of the *block* and *zbd*
test groups is sufficient.

As discussed in the [configuration](#configuration) section above, several
options can speedup the execution of *blktests*. Such quick runs are indeed
faster but at the cost of weaker testing compared to full runs.

### Full Run

The following command executes all test cases relevant to zoned block devices
with the device specified in the `config` configuration file as target. In this
example, no options are added.

```plaintext
# ./check block zbd
block/001 (stress device hotplugging)                        [passed]
    runtime  120.013s  ...  123.440s
block/002 (remove a device while running blktrace)           [passed]
    runtime  0.741s  ...  0.761s
block/003 => sdd (run various discard sizes)                 [not run]
    /dev/sdd is a zoned block device
block/004 => sdd (run lots of flushes)                       [passed]
    runtime     98.876s  ...  82.665s
    write iops  170      ...  203
block/005 => sdd (switch schedulers while doing IO)          [passed]
    read iops  1415    ...  791
    runtime    6.765s  ...  11.242s
block/006 (run null-blk in blocking mode)                    [passed]
    read iops  154220   ...  152356
    runtime    19.158s  ...  19.229s
block/006 (zoned) (run null-blk in blocking mode)            [passed]
    read iops  150692   ...  146826
    runtime    19.128s  ...  19.720s
block/007 => sdd (test classic and hybrid IO polling)        [not run]
    /dev/sdd is a zoned block device
block/008 (do IO while hotplugging CPUs)                     [not run]
    CPU hotplugging is not supported
block/009 (check page-cache coherency after BLKDISCARD)      [passed]
    runtime  0.827s  ...  0.868s
block/010 (run I/O on null_blk with shared and non-shared tags) [passed]
    Individual tags read iops  254661    ...  253371
    Shared tags read iops      174876    ...  174933
    runtime                    695.714s  ...  715.579s
block/010 (zoned) (run I/O on null_blk with shared and non-shared tags) [passed]
    Individual tags read iops  253356    ...  252487
    Shared tags read iops      174871    ...  174780
    runtime                    667.479s  ...  652.577s
block/011 => sdd (disable PCI device while doing I/O)        [passed]
    runtime  8.293s  ...  17.760s
block/012 => sdd (check that a read-only block device fails writes) [not run]
    /dev/sdd is a zoned block device
block/013 => sdd (try BLKRRPART on a mounted device)         [not run]
    /dev/sdd is a zoned block device
block/014 (run null-blk with blk-mq and timeout injection configured) [not run]
    null_blk module does not have parameter timeout
block/015 (run null-blk on different schedulers with requeue injection configured) [not run]
    null_blk module does not have parameter requeue
block/016 (send a signal to a process waiting on a frozen queue) [passed]
    runtime  8.055s  ...  8.055s
block/016 (zoned) (send a signal to a process waiting on a frozen queue) [passed]
    runtime  8.055s  ...  8.055s
block/017 (do I/O and check the inflight counter)            [passed]
    runtime  1.691s  ...  1.675s
block/017 (zoned) (do I/O and check the inflight counter)    [passed]
    runtime  1.690s  ...  1.692s
block/018 (do I/O and check iostats times)                   [passed]
    runtime  5.075s  ...  5.077s
block/019 => sdd (break PCI link device while doing I/O)     [not run]
    /dev/sdd is a zoned block device
block/020 (run null-blk on different schedulers with only one hardware tag) [passed]
    runtime  43.139s  ...  43.191s
block/020 (zoned) (run null-blk on different schedulers with only one hardware tag) [passed]
    runtime  43.120s  ...  43.206s
block/021 (read/write nr_requests on null-blk with different schedulers) [passed]
    runtime  1.396s  ...  1.393s
block/021 (zoned) (read/write nr_requests on null-blk with different schedulers) [passed]
    runtime  1.399s  ...  1.419s
block/023 (do I/O on all null_blk queue modes)               [passed]
    runtime  0.276s  ...  0.280s
block/023 (zoned) (do I/O on all null_blk queue modes)       [passed]
    runtime  0.279s  ...  0.302s
block/024 (do I/O faster than a jiffy and check iostats times) [passed]
    runtime  4.902s  ...  4.904s
block/025 (do a huge discard with 4k sector size)            [passed]
    runtime  8.869s  ...  8.921s
block/027 (stress device hotplugging with running fio jobs and different schedulers) [not run]
    no support for io cgroup controller; if it is enabled, you may need to boot with cgroup_no_v1=io
block/028 (do I/O on scsi_debug with DIF/DIX enabled)        [passed]
    runtime  19.924s  ...  19.942s
zbd/001 => sdd (sysfs and ioctl)                             [passed]
    runtime    ...  0.706s
zbd/002 => sdd (report zone)                                 [passed]
    runtime    ...  6.534s
zbd/003 => sdd (reset sequential required zones)             [passed]
    runtime    ...  13.324s
zbd/004 => sdd (write split across sequential zones)         [passed]
    runtime    ...  17.019s
zbd/005 => sdd (write command ordering)                      [passed]
    runtime       ...  178.335s
    write io      ...  7196672
    write iops    ...  933
zbd/006 => sdd (revalidate)                                  [passed]
    runtime       ...  61.028s
    write io      ...  1805004
    write iops    ...  15041
```

The output of some tests is *[not run]*. This is not a failure. This only
indicates that the target device specified in the configuration file does not
support the feature being tested. For example, in the above run, test case
*block/003* is not executed against the specified host managed disk because the
disk does not support the *discard* command.

### Quick Run

*blkltests* execution can be accelerated using the `TIMEOUT`, `QUICK_RUN` and
`DEVICE_ONLY` configuration options.

```bash
# Tests target device list
TEST_DEVS=(/dev/sdd)

# Enable zoned block device mode for the block group genertic tests
RUN_ZONED_TESTS=1

# Speed up execution (weaker tests)
QUICK_RUN=1
TIMEOUT=30

# Exercise only the devices in TEST_DEVS
DEVICE_ONLY=1
```

Running only the *block* and *zbd* test groups with the above configuration
gives the following results.

```plaintext
# ./check block zbd
block/003 => sdd (run various discard sizes)                 [not run]
    /dev/sdd is a zoned block device
block/004 => sdd (run lots of flushes)                       [passed]
    runtime     913.097s  ...  33.714s
    write iops            ...  239
block/005 => sdd (switch schedulers while doing IO)          [passed]
    read iops  2975     ...  3573
    runtime    22.510s  ...  19.194s
block/007 => sdd (test classic and hybrid IO polling)        [not run]
    /dev/sdd is a zoned block device
block/008 => sdd (do IO while hotplugging CPUs)              [not run]
    /dev/sdd is a zoned block device
block/011 => sdd (disable PCI device while doing I/O)        [passed]
    runtime    ...  30.322s
block/012 => sdd (check that a read-only block device fails writes) [not run]
    /dev/sdd is a zoned block device
block/013 => sdd (try BLKRRPART on a mounted device)         [not run]
    /dev/sdd is a zoned block device
block/019 => sdd (break PCI link device while doing I/O)     [not run]
    /dev/sdd is a zoned block device
zbd/001 => sdd (sysfs and ioctl)                             [passed]
    runtime  1.328s  ...  0.521s
zbd/003 => sdd (reset sequential required zones)             [passed]
    runtime  9.591s  ...  11.008s
zbd/004 => sdd (write split across sequential zones)         [passed]
    runtime  11.772s  ...  11.743s
zbd/005 => sdd (write command ordering)                      [passed]
    runtime     59.688s  ...  167.521s
    write io    7201536  ...  7113472
    write iops  933      ...  921
zbd/006 => sdd (revalidate)                                  [passed]
    runtime     7.063s  ...  39.464s
    write io            ...  2097152
    write iops          ...  48971
```

