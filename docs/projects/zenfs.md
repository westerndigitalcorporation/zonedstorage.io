# Getting started guide for RocksDB on ZNS SSD.


## Introduction to RocksDB
RocksDB is a Key-Value based storage engine, it is implemented as a C++ library.
Applications can link with RocksDB library and via the RocksDB APIs can store and retrieve the data from the backend storage device.
RocksDB uses a LSM tree based data structures to store data. RocksDB writes data to persistent storage in a sorted string format(.sst) which is 
immutable once written to disk. So there will be no random writes to these files, which makes it an ideal candidate for using ZNS SSDs.

RocksDB supports a plugin model, which allows building the external code together with the RocksDB code into a single binary.
ZenFS is built as a Plugin. RocksDB needs ZenFS to be able to write to and read from ZNS SSDs.

RocksDB <a href="https://github.com/facebook/rocksdb/wiki" target="_blank">wiki</a> provides a deep dive on RocksDB internals.


## Introduction to ZenFS
ZenFS is a file system plugin which utilizes RockDB's fileSystem interface to place files into zones on a raw zoned block device. 
By separating files into zones and utilizing write life time hints to co-locate data of similar life times the system write amplification 
is greatly reduced compared to conventional block devices. ZenFS ensures that there is no background garbage collection in the file system
or on the disk, improving performance in terms of throughput, tail latencies and disk endurance.

ZenFS stores data in terms of Zonefiles, each Zonefile is a set of extents, zonefiles can be placed across one or more zones. Individual 
extents do not span across zones. When all zonefiles in a zone are invalidated, the zone is reset by ZenFS, reclaiming the capacity of
the zone. ZenFS places files into zones based on the write lifetime hint(WLTH), which is provided by RocksDB. Files with similar WLTH are
placed together in zones. With ZenFS and ZNS SSD, only RocksDB does the garbage collection, there is no garbage collection being done
by either ZenFS or within the ZNS SSD.

More details on ZenFS can be found <a href="https://github.com/westerndigitalcorporation/zenfs" target="_blank">here</a>.


## Pre-requisites


```plaintext
Linux kernel 5.9 or newer.
Libzbd
Util-linux
```

## Steps to build and install.
```plaintext
$ git clone https://github.com/facebook/rocksdb.git
$ cd rocksdb
$ git clone https://github.com/westerndigitalcorporation/zenfs plugin/zenfs

$ DEBUG_LEVEL=0 ROCKSDB_PLUGINS=zenfs make -j48 db_bench db_stress ldb install
$ pushd
$ cd plugin/zenfs/util
$ make
$ popd
```

Compiling with DEBUG_LEVEL=1, enables debug logs.
The IO scheduler must be set to mq-deadline to avoid writes from being reordered. 
This must be done every time the zoned name space is enumerated (e.g at boot).


## Running db_bench with RocksDB on a ZNS SSD.
```plaintext
$ ./db_bench --fs_uri=zenfs://dev:nvme0n1 --benchmarks=fillrandom --use_direct_reads --key_size=16 --value_size=800 --target_file_size_base=2147483648 --use_direct_io_for_flush_and_compaction --max_bytes_for_level_multiplier=4 --write_buffer_size=2147483648 --target_file_size_multiplier=1 --num=1000000 --threads=2 --max_background_jobs=4
[sudo] password for zns:
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

## ZenFS Utils.
ZenFS has a command line utility called zenfs, it is used to format the SSD to create a new filesystem, list the files, 
back up the filesystem and restore the filesystem. 


### Format ZNS SSD with zenfs utility.

```plaintext
$  echo mq-deadline > /sys/class/block/<zoned block device>/queue/scheduler
$ ./plugin/zenfs/util/zenfs mkfs --zbd=nvme0n1 --aux_path=/tmp/zone-aux --force
ZenFS file system created. Free space: 220246 MB
```

### List files in the filesystem.
```plaintext
$ sudo ./util/zenfs list --zbd=nvme0n1 --path=rocksdbtest/dbbench
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

### Backup ZenFS filesystem.
Backup the .sst files on to a local filesystem.

```plaintext
$ sudo ./util/zenfs backup --zbd=nvme0n1 --path=/tmp/backup
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

### Restore ZenFS from a previous backup.

Restore a ZenFS filesystem from a backed up location.

```plaintext
$ sudo ./util/zenfs restore --zbd=nvme0n1 --path=/tmp/backup/rocksdbtest/dbbench/ --restore_path=rocksdbtest/dbbench
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

