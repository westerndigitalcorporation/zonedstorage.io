# RocksDB and ZenFS

<a href="https://rocksdb.org/" target="_blank">*RocksDB*</a> is a persistent
key-value store for fast storage devices. It is implemented using a
<a href="https://en.wikipedia.org/wiki/Log-structured_merge-tree"target="_blank">
Log-Structured Merge-Tree (LSM-tree)</a> data structure. Similarly to all
LSM-tree based key-value engine implementations, values are stored in tables
sorted by key order. Tables are always sequentially written and never modified.
This basic principle of the LSM-tree data stucture facilitate the implmentation
of support for zoned block devices.

*RocksDB* is implemented as a C++ library. This library provides functions for
applications to access and manage key-value stores. RocksDB implementation
relies on a plugin architecture to implement support for different storage
types.

## ZenFS

<a href="https://github.com/westerndigitalcorporation/zenfs" target="_blank">*ZenFS*</a>
is a file system plugin for *RocksDB* that utilizes *RockDB* FileSystem
interface to place files into zones on a raw zoned block device. By separating
files into zones and utilizing write life time hints to co-locate data of
similar life times, *ZenFS* can greatly reduce the system write amplification
compared to regular file systems on conventional block devices. *ZenFS* ensures
that there is no background garbage collection in the file system or on the
device, improving performance in terms of throughput, tail latencies and
endurance.

*ZenFS* can store multiple files in a single zone, using an extent allocation
scheme. A file may be composed of one or more extents and all extents of a file
can be stored in the same zone or in different zones of the device. An extent
never spans multiple zones. When all file extents in a zone are invalidated, the
zone can be reset and reused to store new file extents.

ZenFS places file extents into zones based on write lifetime hints (WLTH)
provided by RocksDB library. ZenFS always attempts to palce file extents with
similar WLTH together in the same zones.

Using *ZenFS*, data garbage collection is performed only by RocksDB with the
LSM-tree table compaction process. There is no garbage collection executed
by ZenFS, nor by the ZNS device controller.

## Prerequisites

*ZenFS* requires a Linux kernel implementing support for NVMe Zonednamespaces,
that is, a kernel version 5.9 or newer. The kernel used must also be configured
with [zoned block device support enabled](/linux/config#kernel-configuration).

*ZenFS* code uses the [*libzbd*](/projects/libzbd) library. The latest
version of this library must be compiled and installed prior to compiling,
installing and using *RocksDB-ZenFS*.

## Building and Installing ZenFS

Detailed instructions on how to compile and install *ZenFS* is provided by the
*ZenFS* project <a href="https://github.com/westerndigitalcorporation/zenfs/blob/master/README.md" target="_blank">
README file</a>.

As mentioned in the *ZenFS* build instructions, it is also important to set
the IO scheduler of the NVMe ZNS device to *mq-deadline* to avoid write
operations from being reordered. This can be automatically done on system boot
using a [*udev* rule](/linux/sched#automatic-persistent-configuration).

## ZenFS Utils

*ZenFS* provides a command line utility called *zenfs*. This utility is used to
format the zoned device to create a new filesystem, list the files, and back-up
or restore the filesystem.

### Formatting a NVMe ZNS Device

To format the NVMe ZNS device `/dev/nvme0n1`, the following command is used.

```plaintext
# zenfs mkfs --zbd=nvme0n1 --aux_path=/tmp/zone-aux --force
ZenFS file system created. Free space: 220246 MB
```

### List Files of a NVMe ZNS Device

Once formatted, *RocksDB* use will started creating files on the zoned device
through *ZenFS*. Listing the files present on the device is done as follows.

```plaintext
# zenfs list --zbd=nvme0n1 --path=rocksdbtest/dbbench
           0    Jul 20 2021 18:13:52            LOCK
       66979    Jul 20 2021 18:14:01            LOG
    26961453    Jul 20 2021 18:13:55            000014.sst
    26961524    Jul 20 2021 18:13:55            000015.sst
    26961904    Jul 20 2021 18:13:55            000016.sst
    26963148    Jul 20 2021 18:13:55            000017.sst
   102734225    Jul 20 2021 18:13:56            000019.sst
    26962608    Jul 20 2021 18:13:55            000020.sst
    26961566    Jul 20 2021 18:13:56            000021.sst
    26963214    Jul 20 2021 18:13:56            000022.sst
    26963380    Jul 20 2021 18:13:57            000023.sst
   102594916    Jul 20 2021 18:13:58            000025.sst
    26546055    Jul 20 2021 18:13:59            000026.sst
   102540090    Jul 20 2021 18:14:00            000028.sst
   190808702    Jul 20 2021 18:14:01            000029.log
   102826791    Jul 20 2021 18:14:00            000030.sst
          16    Jul 20 2021 18:13:52            CURRENT
          37    Jul 20 2021 18:13:52            IDENTITY
        1586    Jul 20 2021 18:14:01            MANIFEST-000004
        6178    Jul 20 2021 18:13:52            OPTIONS-000007

```

### Backing-up a ZenFS Filesystem

To backup all table and metadata files on a NVMe ZNS device to a local
filesystem, the following command can be used.

```plaintext
# zenfs backup --zbd=nvme0n1 --path=/tmp/backup
rocksdbtest/dbbench/LOCK
rocksdbtest/dbbench/LOG
rocksdbtest/dbbench/000014.sst
rocksdbtest/dbbench/000015.sst
rocksdbtest/dbbench/000016.sst
rocksdbtest/dbbench/000017.sst
rocksdbtest/dbbench/000019.sst
rocksdbtest/dbbench/000020.sst
rocksdbtest/dbbench/000021.sst
rocksdbtest/dbbench/000022.sst
rocksdbtest/dbbench/000023.sst
rocksdbtest/dbbench/000025.sst
rocksdbtest/dbbench/000026.sst
rocksdbtest/dbbench/000028.sst
rocksdbtest/dbbench/000029.log
rocksdbtest/dbbench/000030.sst
rocksdbtest/dbbench/CURRENT
rocksdbtest/dbbench/IDENTITY
rocksdbtest/dbbench/MANIFEST-000004
rocksdbtest/dbbench/OPTIONS-000007
```

To restore a NVMe ZNS device using a previous back-up, the following command can
be used.

```plaintext
# zenfs restore --zbd=nvme0n1 --path=/tmp/backup/rocksdbtest/dbbench/ \
		--restore_path=rocksdbtest/dbbench
/tmp/backup/rocksdbtest/dbbench/CURRENT
/tmp/backup/rocksdbtest/dbbench/LOCK
/tmp/backup/rocksdbtest/dbbench/000015.sst
/tmp/backup/rocksdbtest/dbbench/000022.sst
/tmp/backup/rocksdbtest/dbbench/LOG
/tmp/backup/rocksdbtest/dbbench/MANIFEST-000004
/tmp/backup/rocksdbtest/dbbench/000023.sst
/tmp/backup/rocksdbtest/dbbench/000028.sst
/tmp/backup/rocksdbtest/dbbench/000025.sst
/tmp/backup/rocksdbtest/dbbench/000030.sst
/tmp/backup/rocksdbtest/dbbench/IDENTITY
/tmp/backup/rocksdbtest/dbbench/OPTIONS-000007
/tmp/backup/rocksdbtest/dbbench/000020.sst
/tmp/backup/rocksdbtest/dbbench/000019.sst
/tmp/backup/rocksdbtest/dbbench/000016.sst
/tmp/backup/rocksdbtest/dbbench/000014.sst
/tmp/backup/rocksdbtest/dbbench/000026.sst
/tmp/backup/rocksdbtest/dbbench/000029.log
/tmp/backup/rocksdbtest/dbbench/000021.sst
/tmp/backup/rocksdbtest/dbbench/000017.sst
```

## Performance Benchmark

*RocksDB* provides the *db_bench* utility to test and bechmark performance of a
device. The following command provides an example of *db_bench* execution using
a NVMe ZNS device formatted with *ZenFS*.

```plaintext
# db_bench --fs_uri=zenfs://dev:nvme0n1 --benchmarks=fillrandom \
	   --use_direct_reads --key_size=16 --value_size=800 \
	   --target_file_size_base=2147483648 \
	   --use_direct_io_for_flush_and_compaction \
	   --max_bytes_for_level_multiplier=4 --write_buffer_size=2147483648 \
	   --target_file_size_multiplier=1 --num=1000000 --threads=2 \
	   --max_background_jobs=4
Initializing RocksDB Options from the specified file
Initializing RocksDB Options from command-line flags
RocksDB:    version 6.21
Date:       Tue Jul 20 20:24:56 2021
CPU:        32 * AMD EPYC 7302P 16-Core Processor
CPUCache:   512 KB
Keys:       16 bytes each (+ 0 bytes user-defined timestamp)
Values:     800 bytes each (400 bytes after compression)
Entries:    1000000
Prefix:    0 bytes
Keys per prefix:    0
RawSize:    778.2 MB (estimated)
FileSize:   396.7 MB (estimated)
Write rate: 0 bytes/second
Read rate: 0 ops/second
Compression: Snappy
Compression sampling rate: 0
Memtablerep: skip_list
Perf Level: 1
------------------------------------------------
Initializing RocksDB Options from the specified file
Initializing RocksDB Options from command-line flags
DB path: [rocksdbtest/dbbench]
fillrandom   :      10.447 micros/op 191441 ops/sec;  149.0 MB/s
```

