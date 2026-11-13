---
id: ozone
title: Apache Ozone on Zoned Storage
sidebar_label: Apache Ozone
---

# Apache Ozone on Zoned Storage

*Apache Ozone* is a distributed object store with S3, Hadoop file system
(*ofs*) and native client interfaces. The *Ozone Manager* (*OM*) stores the
namespace (volumes, buckets and keys). The *Storage Container Manager* (*SCM*)
allocates blocks and groups them into *containers*. *Datanodes* store each
container as a directory of block files on local file systems, one per drive.

Place the *Datanode* data directories on [zoned *XFS*](/docs/filesystems/xfs)
file systems on host-managed SMR disks or NVMe ZNS SSDs. With the default
*FILE_PER_BLOCK* layout, each block (256 MiB by default) is a single file
written sequentially. *XFS* handles zone writes and space reclamation, and
*Ozone* needs no zoned-device support. Keep the *OM* and *SCM* databases, the
*Datanode* *Ratis* logs and the per-volume container *RocksDB* on
conventional SSD storage.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- Apache Ozone 2.2.2 (tested with the binary release tarball)
- Java 11 or 17 (tested with Eclipse Temurin 17.0.21)
- Tested on kernel 6.17.7 with xfsprogs 6.19.0, using *zloop* emulated zoned
  devices
:::

## How It Fits Together

A single-node deployment runs the *SCM*, *OM* and *Datanode* daemons and,
optionally, the *S3 Gateway*. The *Ozone* [production
deployment](https://ozone.apache.org/docs/administrator-guide/configuration/performance/placeholder)
guide lists *ext4* and *XFS* as supported local file systems, recommends
SSDs for all metadata and *Ratis* logs, and recommends JBOD (no RAID or LVM)
for data drives.

| Data | Setting | Placement |
| ---- | ------- | --------- |
| *OM* database (namespace) | `ozone.om.db.dirs` | conventional SSD |
| *SCM* database (containers, pipelines) | `ozone.scm.db.dirs` | conventional SSD |
| *Datanode* ID, *OM*/*SCM* *Ratis* logs, fallback metadata | `ozone.scm.datanode.id.dir`, `ozone.metadata.dirs` | conventional SSD |
| *Datanode* *Ratis* (write pipeline) logs | `hdds.container.ratis.datanode.storage.dir` | conventional SSD |
| Container *RocksDB* (block metadata, one per volume) | `hdds.datanode.container.db.dir` | conventional SSD |
| Container block files (`*.block`) and container descriptors | `hdds.datanode.dir` | **zoned XFS**, one per drive |

If `hdds.datanode.container.db.dir` is not set, the *Datanode* creates the
container *RocksDB* inside each data volume, which places it on the zoned
device. This works (see [Production Notes](#container-rocksdb-placement)),
but the *Ozone* documentation recommends fast storage for it.

```plaintext
           conventional SSD                        zoned drives (XFS)
     +----------------------------+     +-------------------+  +-------------------+
OM   | /var/lib/ozone/om          |     | /data/disk1/ozone |  | /data/disk2/ozone |
SCM  | /var/lib/ozone/scm         |     |  hdds/<cluster>/  |  |  hdds/<cluster>/  |
DN   | /var/lib/ozone/dn-ratis    |     |   current/        |  |   current/        |
     | /var/lib/ozone/container-db|     |    containerDir0/ |  |    containerDir0/ |
     +----------------------------+     +-------------------+  +-------------------+
                                             Datanode (hdds.datanode.dir)
```

## Quick Start

These steps configure a single-node *Ozone* cluster with container data on a
zoned drive. Run commands prefixed with `#` as root and commands prefixed
with `$` as the `ozone` account created in Step 1, in a login shell
(`sudo -iu ozone`). The release is downloaded and extracted in its home
directory.

### Step 1: Prepare a Zoned XFS File System

Check the *XFS* [requirements](/docs/filesystems/xfs#system-requirements)
before formatting the drive.

For an SMR hard disk (or any zoned device with conventional zones at the start
of its address space), format the whole disk and mount it:

```plaintext
# mkfs.xfs /dev/sda
meta-data=/dev/sda               isize=512    agcount=4, agsize=65536 blks
...
realtime =internal               extsz=4096   blocks=3932160, rtextents=3932160
         =                       rgcount=60   rgsize=65536 extents
         =                       zoned=1      start=262144 reserved=0
Resetting zones...Done.
# mkdir -p /data/disk1
# mount -o noatime /dev/sda /data/disk1
```

The *zoned=1* field identifies a zoned realtime device. The kernel log
confirms the zoned mount:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem e23f343d-bd35-4bf0-a7f6-50c9a9dcfb83
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

An NVMe ZNS SSD has no conventional zones and requires a separate conventional
block device for *XFS* metadata, such as a conventional namespace or a small
SSD partition. Specify the zoned namespace as the realtime device:

```plaintext
# mkfs.xfs -r rtdev=/dev/nvme0n2 /dev/nvme1n1
...
realtime =/dev/nvme0n2           extsz=4096   blocks=4194304, rtextents=4194304
         =                       rgcount=64   rgsize=65536 extents
         =                       zoned=1      start=0 reserved=0
Discarding blocks...Done.
Resetting zones...Done.
# mkdir -p /data/disk2
# mount -o noatime,rtdev=/dev/nvme0n2 /dev/nvme1n1 /data/disk2
```

The ZNS layout was tested with a *zloop* device without conventional zones
as the realtime device and a 1 GiB loop device as the metadata device, not
with ZNS hardware. See the [XFS](/docs/filesystems/xfs) page for details on
both cases.

:::tip
To try this setup without a zoned drive, create an emulated device with
*zloop* as described in [Zoned Block Device
Emulation](/docs/getting-started/zbd-emulation) and use it in place of
`/dev/sda`. This guide was tested with 16 GiB *zloop* devices with 256 MiB
zones (4 conventional zones for the SMR case, none for the ZNS case).
:::

To mount the file systems at boot, add them to */etc/fstab*. Prefer
persistent */dev/disk/by-id/* names to */dev/sdX* and */dev/nvmeXnY* names.
These entries were not tested on the test host.

```plaintext
# SMR HDD
/dev/sda      /data/disk1  xfs  defaults,noatime                    0 0
# NVMe ZNS SSD with a conventional metadata device
/dev/nvme1n1  /data/disk2  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0 0
```

Create the non-root account that runs *Ozone*, with a home directory for the
release tarball:

```plaintext
# useradd --create-home --user-group --shell /bin/bash ozone
```

Create the *Datanode* directory on the zoned file system and the metadata
directories on conventional SSD storage (*/var/lib/ozone* in this example),
owned by the `ozone` account:

```plaintext
# mkdir -p /data/disk1/ozone
# mkdir -p /var/lib/ozone/{metadata,om,scm,dn-id,dn-ratis,container-db}
# chown -R ozone:ozone /data/disk1/ozone /var/lib/ozone
```

New directories inherit the *rtinherit* attribute (`t`) from the file system
root, so container files created under */data/disk1/ozone* are stored on
the zoned device:

```plaintext
$ xfs_io -c lsattr /data/disk1/ozone
-------t--------X /data/disk1/ozone
```

### Step 2: Install Java and Ozone

Install a Java 11 or 17 runtime from your distribution or from a tarball,
such as [Eclipse Temurin](https://adoptium.net/). Download the *Ozone*
binary release from an [Apache mirror](https://ozone.apache.org/download/),
verify its checksum and extract it:

```plaintext
$ curl -O https://dlcdn.apache.org/ozone/2.2.2/ozone-2.2.2.tar.gz
$ curl -O https://downloads.apache.org/ozone/2.2.2/ozone-2.2.2.tar.gz.sha512
$ cat ozone-2.2.2.tar.gz.sha512
acbef827afee9865f8556924d97bc36b4cd571994e749b717d5b1838d29477b608231b7f4973d7c21b679d381e4ffc9efb4d23a2cb469d5da18ef7f52c32f396  ozone-2.2.2.tar.gz
$ sha512sum ozone-2.2.2.tar.gz
acbef827afee9865f8556924d97bc36b4cd571994e749b717d5b1838d29477b608231b7f4973d7c21b679d381e4ffc9efb4d23a2cb469d5da18ef7f52c32f396  ozone-2.2.2.tar.gz
$ tar xzf ozone-2.2.2.tar.gz
$ cd ozone-2.2.2
```

Set `JAVA_HOME` in *etc/hadoop/ozone-env.sh* and check that *Ozone* runs:

```plaintext
$ echo 'export JAVA_HOME=/opt/jdk-17' >> etc/hadoop/ozone-env.sh
$ bin/ozone version
...
2.2.2(Katmai)
Source code repository Unknown -r 01e1be11f064b770dec1c0452f3e669e1125563f
Compiled with protoc 3.25.9, 3.25.8 (Ratis)
...
With Apache Ratis: 3.2.1 from 07a340e37662b1f0c9fd2dfde79fccb728060d34
...
```

### Step 3: Configure Ozone

Edit *etc/hadoop/ozone-site.xml*. Set every metadata location to
conventional storage and `hdds.datanode.dir` to the zoned file system. A
single *Datanode* requires replication factor *ONE* and an *SCM* safe-mode
threshold of one *Datanode*.

```xml
<configuration>
  <property>
    <name>ozone.scm.names</name>
    <value>localhost</value>
  </property>
  <property>
    <name>ozone.om.address</name>
    <value>localhost</value>
  </property>
  <property>
    <name>ozone.metadata.dirs</name>
    <value>/var/lib/ozone/metadata</value>
  </property>
  <property>
    <name>ozone.om.db.dirs</name>
    <value>/var/lib/ozone/om</value>
  </property>
  <property>
    <name>ozone.scm.db.dirs</name>
    <value>/var/lib/ozone/scm</value>
  </property>
  <property>
    <name>ozone.scm.datanode.id.dir</name>
    <value>/var/lib/ozone/dn-id</value>
  </property>
  <property>
    <name>hdds.container.ratis.datanode.storage.dir</name>
    <value>/var/lib/ozone/dn-ratis</value>
  </property>
  <property>
    <name>hdds.datanode.container.db.dir</name>
    <value>/var/lib/ozone/container-db</value>
  </property>
  <property>
    <name>hdds.datanode.dir</name>
    <value>/data/disk1/ozone</value>
  </property>
  <property>
    <name>ozone.server.default.replication</name>
    <value>1</value>
  </property>
  <property>
    <name>hdds.scm.safemode.min.datanode</name>
    <value>1</value>
  </property>
</configuration>
```

:::note
The *Datanode* reports a minimum free space per volume to *SCM* (the larger
of `hdds.datanode.volume.min.free.space`, 20 GB by default, and
`hdds.datanode.volume.min.free.space.percent`, 2% by default). *SCM* creates
a write pipeline only if a volume has room for a full container
(`ozone.scm.container.size`, 5 GB by default) on top of this reserve, so
drives with less than about 25 GB available get no pipeline. The tests
used 16 GiB emulated drives and set
`hdds.datanode.volume.min.free.space` to `512MB`. Production-size SMR and ZNS
drives do not need this change. See
[Troubleshooting](#no-write-pipeline-on-small-drives).
:::

### Step 4: Initialize and Start Ozone

Initialize the *SCM* and *OM* metadata (only once, before first use). The
*OM* initialization contacts the running *SCM*:

```plaintext
$ bin/ozone scm --init
...
INFO server.StorageContainerManager: SCM initialization succeeded. Current cluster id for sd=/var/lib/ozone/scm/scm; cid=CID-f471a763-541d-49d3-97b3-60982c7a67cc; layoutVersion=10; scmId=93053505-6ed7-4714-ae27-536deb405a3e
$ bin/ozone --daemon start scm
$ bin/ozone om --init
...
OM initialization succeeded.Current cluster id for sd=/var/lib/ozone/om/om;cid=CID-f471a763-541d-49d3-97b3-60982c7a67cc;layoutVersion=9
$ bin/ozone --daemon start om
$ bin/ozone --daemon start datanode
$ bin/ozone --daemon start s3g
```

Daemon logs are written to the *logs/* directory of the installation. The
test ran the daemons with `ozone --daemon start` as a regular user; *systemd*
units were not tested.

After about a minute, *SCM* leaves safe mode and creates a *RATIS/ONE*
write pipeline. Check the *Datanode* and its capacity:

```plaintext
$ bin/ozone admin safemode status
SCM is out of safe mode.
$ bin/ozone admin pipeline list
Pipeline{ Id: d8fa5076-67b6-4091-8afc-392682a7d169, Nodes: [ {fbf3ae9f-1745-4c52-9ff6-c88c60910a03(localhost/127.0.0.1), ReplicaIndex: 0},], ReplicationConfig: RATIS/ONE, State:OPEN, ...}
$ bin/ozone admin datanode usageinfo --address=localhost
Usage Information (1 Datanodes)
...
Filesystem Capacity     : 15032385536 B (14 GB)
...
Ozone Capacity          : 15030882297 B (14.00 GB)
Ozone Used              : 147456 B (144 KB)
...
```

The *SCM* web interface is at `http://localhost:9876/`, the *OM* web
interface at `http://localhost:9874/`.

### Step 5: Write and Read Data

Create a volume and a bucket, upload a 1 GiB test file with the *Ozone*
shell, download it again and compare the checksums:

```plaintext
$ head -c 1G /dev/urandom > test.bin
$ bin/ozone sh volume create /vol1
$ bin/ozone sh bucket create /vol1/bucket1
$ bin/ozone sh key put /vol1/bucket1/test.bin test.bin
$ bin/ozone sh key list /vol1/bucket1
[ {
  "volumeName" : "vol1",
  "bucketName" : "bucket1",
  "name" : "test.bin",
  "dataSize" : 1073741824,
  ...
  "replicationConfig" : {
    "replicationFactor" : "ONE",
    "requiredNodes" : 1,
    "minimumNodes" : 1,
    "replicationType" : "RATIS"
  },
  ...
} ]
$ bin/ozone sh key get /vol1/bucket1/test.bin test-copy.bin
$ sha256sum test.bin test-copy.bin
5a3a4ea0a64d547710a9ee10c2c54618c21daab3b25c6c1b228b6486a69fa7fe  test.bin
5a3a4ea0a64d547710a9ee10c2c54618c21daab3b25c6c1b228b6486a69fa7fe  test-copy.bin
```

The *S3 Gateway* listens on port 9878. Without Kerberos security, it accepts
any access key and secret. Upload and download an object with the AWS CLI:

```plaintext
$ export AWS_ACCESS_KEY_ID=testuser AWS_SECRET_ACCESS_KEY=testsecret AWS_DEFAULT_REGION=us-east-1
$ head -c 300M /dev/urandom > obj.bin
$ aws --endpoint-url http://localhost:9878 s3 mb s3://bucket2
make_bucket: bucket2
$ aws --endpoint-url http://localhost:9878 s3 cp obj.bin s3://bucket2/obj.bin
upload: ./obj.bin to s3://bucket2/obj.bin
$ aws --endpoint-url http://localhost:9878 s3 cp s3://bucket2/obj.bin obj.down
download: s3://bucket2/obj.bin to ./obj.down
$ sha256sum obj.bin obj.down
8ee42b6e07f46a524f402ce7b3424c410c4a3c9f44237c58d22b43f240a4aa2b  obj.bin
8ee42b6e07f46a524f402ce7b3424c410c4a3c9f44237c58d22b43f240a4aa2b  obj.down
```

S3 buckets are created in the */s3v* volume.

### Step 6: Verify the Data Is on the Zoned Device

The 1 GiB key is stored as four 256 MiB blocks. The key information lists the
container of each block:

```plaintext
$ bin/ozone sh key info /vol1/bucket1/test.bin
...
  "ozoneKeyLocations" : [ {
    "containerID" : 1,
    "localID" : 117883640217600001,
    "length" : 268435456,
    ...
  }, {
    "containerID" : 2,
    "localID" : 117883640217600002,
    ...
```

Each container is a directory with a *chunks/* subdirectory holding one
*.block* file per block, and a *metadata/* subdirectory holding the
container descriptor:

```plaintext
$ cd /data/disk1/ozone/hdds/CID-*/current/containerDir0
$ ls -l 1/chunks 1/metadata
1/chunks:
total 524296
-rw-rw-r-- 1 ozone ozone 268435456 Nov  3 16:13 117883640217600001.block
-rw-rw-r-- 1 ozone ozone 268435456 Nov  3 16:13 117883640217600003.block

1/metadata:
total 4
-rw-rw-r-- 1 ozone ozone 632 Nov  3 16:13 1.container
```

The block files have the *realtime* attribute (`r`). The *xfs_bmap* output
shows the extents on the realtime (zoned) device in the *RT-BLOCK-RANGE* and
realtime group (*RG*, one group per zone) columns:

```plaintext
$ xfs_io -c lsattr 1/chunks/* 1/metadata/*
r---------------X 1/chunks/117883640217600001.block
r---------------X 1/chunks/117883640217600003.block
r---------------X 1/metadata/1.container
$ xfs_bmap -v 1/chunks/117883640217600001.block
1/chunks/117883640217600001.block:
 EXT: FILE-OFFSET       RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..96255]:       4718648..4814903  5 (56..96311)      96256
   1: [96256..98303]:   4816952..4818999  5 (98360..100407)   2048
   2: [98304..100351]:  4814904..4816951  5 (96312..98359)    2048
...
 117: [450560..452607]: 4515872..4517919  4 (321568..323615)  2048
...
 136: [518144..524287]: 4569120..4575263  4 (374816..380959)  6144
```

The drive's zone report shows the write pointers after the upload: four
256 MiB zones are full, and the write pointers of other zones have
advanced.

```plaintext
# blkzone report /dev/sda
...
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x000040 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x000020 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x0019f0 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000480000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000500000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000580000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
...
```

With `hdds.datanode.container.db.dir` set, the container *RocksDB* of each
volume is on the SSD, and the zoned file systems hold only container
directories. In a test with two data volumes (*/data/disk1* and
*/data/disk2*):

```plaintext
$ ls -d /var/lib/ozone/container-db/db/CID-*/DS-*/container.db
/var/lib/ozone/container-db/db/CID-f471a763-541d-49d3-97b3-60982c7a67cc/DS-c90af366-9031-42d5-a2d4-ef3bfa6ec733/container.db
/var/lib/ozone/container-db/db/CID-f471a763-541d-49d3-97b3-60982c7a67cc/DS-d36ac1bf-d64d-4da3-9acd-0c7857343702/container.db
$ ls /data/disk1/ozone/hdds/CID-*/
current  tmp
```

Stop the daemons from the installation directory:

```plaintext
$ bin/ozone --daemon stop s3g
$ bin/ozone --daemon stop datanode
$ bin/ozone --daemon stop om
$ bin/ozone --daemon stop scm
```

## Production Notes

### Multiple Zoned Drives per Datanode

Format and mount each zoned drive as a separate *XFS* file system and list
one directory per drive in `hdds.datanode.dir`, separated by commas. Do not
combine zoned drives with LVM or RAID; *Ozone* replicates or erasure-codes
data across *Datanodes*.

```xml
  <property>
    <name>hdds.datanode.dir</name>
    <value>/data/disk1/ozone,/data/disk2/ozone,/data/disk3/ozone</value>
  </property>
```

The *Datanode* creates one container *RocksDB* per volume under
`hdds.datanode.container.db.dir`. In a test with an SMR-style and a
ZNS-style volume, the *Datanode* placed new containers on both volumes,
and block files on both had the realtime attribute. `hdds.datanode.dir`
entries can be tagged with a storage type such as `[DISK]` for storage
policies.

### Container RocksDB Placement

Without `hdds.datanode.container.db.dir`, the container *RocksDB*
(*container.db*) is created inside each data volume, and its files are
stored on the zoned device (realtime attribute `r`). The test cluster ran in
this configuration without errors. *RocksDB* writes its write-ahead log,
*MANIFEST* and *SST* files as new files, which fits zoned *XFS*, but block
metadata updates then share the zoned drive with block data. On an SMR disk,
this adds small writes and reads that compete with block I/O. Set
`hdds.datanode.container.db.dir` to an SSD directory, as recommended by the
*Ozone* documentation. Back up the SSD: losing a volume's container database
makes the containers on that volume unusable.

### Preallocation, Direct I/O and Other Zoned XFS Limitations

The *Datanode* was traced with *strace* during the tests:

- Block files are opened with `O_RDWR|O_CREAT` and written with buffered
  I/O. No *fallocate* call was issued on block files.
- *RocksDB* calls `fallocate(FALLOC_FL_KEEP_SIZE)` on new *WAL* and
  *MANIFEST* files (`allow_fallocate` defaults to true). On zoned *XFS* this
  returns *EOPNOTSUPP*, and *RocksDB* continues without preallocation. This
  only affects a container database stored on the zoned file system.
- No file on the data volume was opened with *O_DIRECT*.

*Ozone* does not use reflinks or disk quotas on the data volumes, so the
[zoned XFS limitations](/docs/filesystems/xfs#limitations) did not affect
the tested operations. The *Datanode* *Ratis* log directory was on SSD in all
tests; *Ratis* logs on zoned *XFS* were not tested.

### Replication on a Single Node

With one *Datanode*, use replication factor *ONE*
(`ozone.server.default.replication` = `1`, or `--type=RATIS
--replication=ONE` per key). A key written with *RATIS/THREE* fails because
*SCM* cannot create a three-node pipeline:

```plaintext
$ bin/ozone sh key put --type=RATIS --replication=THREE /vol1/bucket1/three.bin small.bin
INTERNAL_ERROR Unable to allocate a container to the block of size: 268435456, replicationConfig: RATIS/THREE. Cannot create pipeline as it would exceed the limit per datanode: 2 replicationConfig: RATIS/THREE
```

Use three or more *Datanodes* for *RATIS/THREE*, and at least the number of
data plus parity units for erasure coding (for example 5 for *RS-3-2*).
Multi-node deployments were not tested.

### Container Close, Deletes and Space Reclaim

- Containers are closed when they reach `hdds.container.close.threshold`
  (90%) of `ozone.scm.container.size` (5 GB by default), or on request with
  `ozone admin container close`. In the test, a manual close took about
  three minutes from *CLOSING* to *CLOSED*. Closing does not rewrite block
  files.
- `ozone sh key delete` removes the key from the *OM* immediately. *Datanodes*
  delete the block files later: the *OM* key-deleting service, the *SCM*
  block-deleting service and the *Datanode* block-deleting service each run
  about once per minute (`ozone.block.deleting.service.interval`,
  `hdds.scm.block.deleting.service.interval`,
  `hdds.datanode.block.deleting.service.interval`). In the tests, block files
  were removed and file system usage dropped 1.5 to 2.5 minutes after the
  delete:

  ```plaintext
  16:47:32  delete 8 keys (8 GiB)        used: 8961 MiB  9473 MiB  blocks=72
  16:49:35                               used: 8961 MiB  9473 MiB  blocks=72
  16:49:55                               used: 6401 MiB  3841 MiB  blocks=40
  ```
- *XFS* resets zones that no longer contain valid data. After the deletes
  above, 38 of the 64 zones of the ZNS-style drive were empty again. Partially
  valid zones are reclaimed by *XFS* garbage collection when free space runs
  low. A 256 MiB block file can be spread over several zones (blocks written
  concurrently share open zones), as in the *xfs_bmap* output above.

### XFS Tuning

By default, *XFS* uses all but one of the drive's open zones for file writes.
Concurrent block writes on a *Datanode* share this limit. Use the
*max_open_zones* mount option to lower it, or raise *zonegc_low_space* to
start garbage collection earlier for workloads with many deletes. Read the
current values from *sysfs*:

```plaintext
# cat /sys/fs/xfs/sda/zoned/max_open_zones
14
# cat /sys/fs/xfs/sda/zoned/zonegc_low_space
0
# echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
```

See the [XFS tuning section](/docs/filesystems/xfs#tuning) for details.

## Troubleshooting

### No Write Pipeline on Small Drives

`ozone admin pipeline list` shows no pipelines, and the *Datanode* log
contains:

```plaintext
WARN volume.HddsVolume: Volume /data/disk1/ozone/hdds has insufficient space for write operation. Available: 15030882297, Free space to spare: 21474836480
```

The volume is smaller than the default minimum free space of 20 GB
(`hdds.datanode.volume.min.free.space`). This is unrelated to zoned storage
and occurs with small or emulated drives. Lower the setting (for example
`512MB` for test drives), restart the *Datanode* and wait for *SCM* to create
the pipeline.

### Writes Fail While the Drives Still Have Free Space

Clients report:

```plaintext
INTERNAL_ERROR org.apache.hadoop.ozone.om.exceptions.OMException: Unable to allocate a container to the block of size: 268435456, replicationConfig: RATIS/ONE. null
```

and the *Datanode* log shows:

```plaintext
INFO volume.CapacityVolumeChoosingPolicy: No volumes have enough space for a new container.  Most available space: 4830223499 bytes; required space: 5368709120, ...
WARN keyvalue.KeyValueHandler: Operation: CreateContainer , ... Message: Container creation failed, due to disk out of space , Result: DISK_OUT_OF_SPACE ...
```

A new container requires free space for a full container
(`ozone.scm.container.size`, 5 GB by default) on one volume. In the test,
writes stopped with 37% of the 2 × 16 GiB test drives free. The failure
also closed the write pipeline and its open containers; *SCM* created a new
pipeline and all previously written keys remained readable with matching
checksums. Deleting keys freed space (see above), and new writes succeeded
afterwards. This is independent of zoned storage. On small drives, lower
`ozone.scm.container.size` (the first test used `1GB`).

### Block Files Are Not on the Zoned Device

If `xfs_io -c lsattr` does not show the `r` flag on *.block* files, the
*rtinherit* attribute was cleared on a parent directory, or
`hdds.datanode.dir` points to a directory on another file system. Check the
mount with `df` and the directory attributes with `xfs_io -c lsattr`; see
[Placing Data on the Main
Device](/docs/filesystems/xfs#placing-data-on-the-main-device).

## Learn More

- [Apache Ozone documentation](https://ozone.apache.org/docs/)
- [Try Ozone on Bare Metal](https://ozone.apache.org/docs/quick-start/installation/bare-metal)
- [Ozone Production Deployment](https://ozone.apache.org/docs/administrator-guide/configuration/performance/placeholder)
- [Directory Configurations for Datanode](https://ozone.apache.org/docs/administrator-guide/configuration/basic/directories/datanode)
- [Ozone Hardware and Sizing](https://ozone.apache.org/docs/administrator-guide/installation/hardware-and-sizing)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
