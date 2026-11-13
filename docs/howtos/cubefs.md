---
id: cubefs
title: CubeFS on Zoned Storage
sidebar_label: CubeFS
---

# CubeFS on Zoned Storage

*CubeFS* is a distributed file system with a POSIX interface (*FUSE* client)
and an S3-compatible interface (*ObjectNode*). A *Master* manages the cluster,
*MetaNodes* keep the file system metadata in memory and on local disk, and
*DataNodes* store file contents. Each *DataNode* data partition is a directory
of *extent* files on a local disk: files larger than 1 MiB use *normal extents*
(one file of up to 128 MiB per extent). Smaller files are appended to 64 shared
*tiny extent* files and deleted by punching holes into them.

Place the *DataNode* disk directories on [zoned *XFS*](/docs/filesystems/xfs)
file systems on host-managed SMR disks or NVMe ZNS SSDs, one file system per
drive. *XFS* writes extent data sequentially into the zones, frees punched
ranges and deleted files, and reclaims zones. The *Master* and *MetaNode*
data stay on conventional storage. The *DataNode* needs no zoned-device
support. The *blobstore* erasure-coding subsystem does not work on zoned
*XFS* (see [Blobstore Is Not Supported](#blobstore-is-not-supported)).

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *FUSE* support (*/dev/fuse*) on client hosts
- *CubeFS* 3.6.0 (tested with the *cubefs-3.6.0-linux-amd64.tar.gz* release
  binaries, commit f6a14a59, on Linux 6.17.7 with xfsprogs 6.19.0)
:::

## How It Fits Together

A single-node replica deployment runs four server roles from the same
*cfs-server* binary, plus the *cfs-client* *FUSE* client:

| Component | Stores | Placement |
|-----------|--------|-----------|
| *Master* | Cluster topology, volumes, users (*walDir*, *storeDir*) | Conventional SSD |
| *MetaNode* | Inodes and dentries (*metadataDir*, *raftDir*) | Conventional SSD |
| *DataNode* | Data partitions with extent files (*disks*) | **Zoned XFS**, one per drive |
| *DataNode* raft log | Raft WAL of the node (*raftDir*) | Conventional SSD |
| *ObjectNode* | No persistent data; serves S3 from the volumes | - |
| *cfs-client* | No persistent data; *FUSE* mount of a volume | - |

Each data partition directory on a zoned drive contains:

- **Extent files** `1` to `64` (tiny extents, shared by small files) and
  `1025`, `1026`, ... (normal extents, up to 128 MiB each).
- **Small metadata files**: *EXTENT_CRC* (per-block checksums), *META*,
  *APPLY*, *EXTENT_META*, *NORMALEXTENT_DELETE*, *TINYEXTENT_DELETE* and a
  per-partition raft WAL in *wal_N/*.

All of these files inherit the *realtime* attribute and are stored in
sequential zones. *XFS* keeps its own metadata (inodes, directories) in the
conventional zones of an SMR disk, or on a separate conventional device for
NVMe ZNS.

```plaintext
          conventional SSD                       zoned drives (XFS)
     +-------------------------+      +--------------------+  +--------------------+
     | /var/lib/cubefs/master  |      | /data/disk1/cubefs |  | /data/disk2/cubefs |
     | /var/lib/cubefs/metanode|      |  datapartition_1_  |  |  datapartition_7_  |
     | /var/lib/cubefs/datanode|      |  datapartition_2_  |  |  ...               |
     +-------------------------+      +--------------------+  +--------------------+
      Master, MetaNode, raft logs          DataNode "disks" (one entry per drive)
```

## Quick Start

These steps set up a single-node cluster with one replica, two zoned data
drives, a *FUSE* mount and the S3 endpoint. *CubeFS* recommends at least three
nodes with three replicas for production. Run all commands as root.

### Step 1: Prepare Zoned XFS File Systems

Check the *XFS* [requirements](/docs/filesystems/xfs#system-requirements)
before formatting the drives.

For an SMR disk with conventional zones, format the whole disk:

```plaintext
# mkfs.xfs -L CUBEFSDISK1 /dev/sda
meta-data=/dev/sda               isize=512    agcount=4, agsize=65536 blks
         =                       sectsz=4096  attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=262144, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=1
log      =internal log           bsize=4096   blocks=25087, version=2
         =                       sectsz=4096  sunit=1 blks, lazy-count=1
realtime =internal               extsz=4096   blocks=3932160, rtextents=3932160
         =                       rgcount=60   rgsize=65536 extents
         =                       zoned=1      start=262144 reserved=0
Resetting zones...Done.
# mkfs.xfs -L CUBEFSDISK2 /dev/sdb
# mkdir -p /data/disk1 /data/disk2
# mount -o noatime LABEL=CUBEFSDISK1 /data/disk1
# mount -o noatime LABEL=CUBEFSDISK2 /data/disk2
```

The *zoned=1* field identifies a zoned realtime device. The kernel log shows
the number of zones and the open-zone limit:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem 157cbf6f-bd13-4ded-a090-2116dfbd7096
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

An NVMe ZNS namespace has no conventional zones. Put the *XFS* metadata on a
conventional block device, such as a conventional namespace or an SSD
partition, and use the ZNS namespace as the realtime device:

```plaintext
# mkfs.xfs -L CUBEFSDISK1 -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mount -o noatime,rtdev=/dev/nvme0n2 LABEL=CUBEFSDISK1 /data/disk1
```

The ZNS commands were not tested for this guide. See
[XFS](/docs/filesystems/xfs#usage) for details on both cases.

:::tip
For emulated hardware, create *zloop* devices as described in
[Zoned Block Device Emulation](/docs/getting-started/zbd-emulation) and use
them in place of */dev/sda* and */dev/sdb*. This guide was tested with two
16 GiB *zloop* devices with 256 MiB zones and four conventional zones.
:::

Add the file systems to */etc/fstab* to mount them at boot (not tested in
this setup):

```plaintext
# SMR HDDs
LABEL=CUBEFSDISK1  /data/disk1  xfs  defaults,noatime  0  0
LABEL=CUBEFSDISK2  /data/disk2  xfs  defaults,noatime  0  0
# NVMe ZNS SSD with a conventional metadata device
LABEL=CUBEFSDISK1  /data/disk1  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0  0
```

Create the *DataNode* directories on the zoned file systems. They inherit the
*rtinherit* attribute (`t`) from the file system root, so all files created
below them are placed on the zoned device:

```plaintext
# mkdir /data/disk1/cubefs /data/disk2/cubefs
# xfs_io -c lsattr /data/disk1/cubefs
-------t--------X /data/disk1/cubefs
```

### Step 2: Install CubeFS

Download the release tarball from
[GitHub](https://github.com/cubefs/cubefs/releases), verify its checksum and
install the binaries:

```plaintext
# curl -LO https://github.com/cubefs/cubefs/releases/download/v3.6.0/cubefs-3.6.0-linux-amd64.tar.gz
# curl -LO https://github.com/cubefs/cubefs/releases/download/v3.6.0/cubefs-3.6.0-linux-amd64.tar.gz.sha256sum
# cat cubefs-3.6.0-linux-amd64.tar.gz.sha256sum
f00c717ba14e9d182a43c0a6fe23c8239eb037c07b4408ede5fbbcd85b833f56  cubefs-3.6.0-linux-amd64.tar.gz
# sha256sum cubefs-3.6.0-linux-amd64.tar.gz
f00c717ba14e9d182a43c0a6fe23c8239eb037c07b4408ede5fbbcd85b833f56  cubefs-3.6.0-linux-amd64.tar.gz
# tar xzf cubefs-3.6.0-linux-amd64.tar.gz
# install -m 755 cubefs/build/bin/cfs-server cubefs/build/bin/cfs-client cubefs/build/bin/cfs-cli /usr/local/bin/
# cfs-server -v
CubeFS Server
Version : v3.6.0
Branch  : HEAD
Commit  : f6a14a59e59960345fc7da9061ec546d39f8ee81
Build   : go1.20.4 linux amd64 2026-08-13 15:18
```

### Step 3: Configure the Services

Create a directory on conventional storage for the *Master*, *MetaNode* and
raft data, and one for the configuration files:

```plaintext
# mkdir -p /var/lib/cubefs /etc/cubefs
```

*/etc/cubefs/master.json*: `singleNodeMode` creates volumes with one replica.
`legacyDataMediaType` 2 declares the existing data as HDD media; use 1 for SSD
media such as ZNS drives (only HDD was tested).

```json
{
  "clusterName": "cfs-zoned",
  "id": "1",
  "role": "master",
  "ip": "127.0.0.1",
  "listen": "17010",
  "prof": "17020",
  "peers": "1:127.0.0.1:17010",
  "retainLogs": "200",
  "logLevel": "warn",
  "logDir": "/var/lib/cubefs/master/logs",
  "walDir": "/var/lib/cubefs/master/wal",
  "storeDir": "/var/lib/cubefs/master/store",
  "metaNodeReservedMem": "102400000",
  "legacyDataMediaType": 2,
  "singleNodeMode": "true"
}
```

*/etc/cubefs/metanode.json*: metadata stays on conventional storage.

```json
{
  "role": "metanode",
  "listen": "17210",
  "prof": "17220",
  "raftHeartbeatPort": "17230",
  "raftReplicaPort": "17240",
  "exporterPort": 17250,
  "logLevel": "warn",
  "logDir": "/var/lib/cubefs/metanode/logs",
  "totalMem": "1073741824",
  "metadataDir": "/var/lib/cubefs/metanode/meta",
  "raftDir": "/var/lib/cubefs/metanode/raft",
  "masterAddr": ["127.0.0.1:17010"]
}
```

*/etc/cubefs/datanode.json*: list one directory per zoned drive in `disks`, in
the form `path:reservedSpace` (bytes). `mediaType` 2 is HDD and 1 is SSD.
`raftDir` stays on conventional storage.

```json
{
  "role": "datanode",
  "listen": "17310",
  "prof": "17320",
  "raftHeartbeat": "17330",
  "raftReplica": "17340",
  "exporterPort": 17350,
  "raftDir": "/var/lib/cubefs/datanode/raft",
  "logDir": "/var/lib/cubefs/datanode/logs",
  "logLevel": "warn",
  "cell": "cell-01",
  "mediaType": 2,
  "diskRdonlySpace": 5368709120,
  "disks": [
    "/data/disk1/cubefs:1073741824",
    "/data/disk2/cubefs:1073741824"
  ],
  "masterAddr": ["127.0.0.1:17010"]
}
```

*/etc/cubefs/objectnode.json*:

```json
{
  "role": "objectnode",
  "listen": "17410",
  "prof": "17420",
  "logLevel": "warn",
  "logDir": "/var/lib/cubefs/objectnode/logs",
  "masterAddr": ["127.0.0.1:17010"]
}
```

*~/.cfs-cli.json* for the *cfs-cli* management tool:

```json
{
  "masterAddr": ["127.0.0.1:17010"],
  "timeout": 60
}
```

### Step 4: Start the Cluster

Start the services in this order. In the test, each ran in the foreground
(`-f`) in its own terminal; for production, run them as *systemd* services
(not tested here).

```plaintext
# cfs-server -f -c /etc/cubefs/master.json
# cfs-server -f -c /etc/cubefs/metanode.json
# cfs-server -f -c /etc/cubefs/datanode.json
# cfs-server -f -c /etc/cubefs/objectnode.json
```

Check that the *DataNode* is active and has registered both zoned disks:

```plaintext
# cfs-cli datanode list
[Data nodes]
ID	NODESET	ADDRESS                         	DP	MAX_DP	WRITABLE	ALLOCATABLE	ACTIVE	MEDIA	ZONE   	POOL             	RACK   	ForbidWriteOfVer0	TAG
5 	3      	127.0.0.1:17310(localhost:17310)	0 	200   	Yes     	Yes        	Active	HDD  	default	2(defaultHDDPool)	default	notForbid
# cfs-cli datanode info 127.0.0.1:17310
[Data node info]
  ID                        : 5
  Address                   : 127.0.0.1:17310(localhost:17310)
...
  Available                 : 18.00 GB
...
  Total                     : 18.00 GB
...
  MediaType                 : HDD
...
  AllDisks                  : [/data/disk1/cubefs /data/disk2/cubefs]
  Bad disks                 : []
...
```

Create a user and a single-replica volume. With an HDD-only cluster, the
volume must be placed in the HDD storage pool (pool 2):

```plaintext
# cfs-cli user create cubefs -y
...
  User ID    : cubefs
  Access Key : ZNHRqBSjSlGsUyjI
  Secret Key : DLmqrtXynojTujNoRreoU0s5g8vuNr4Z
...
# cfs-cli volume create zvol cubefs --capacity 20 --replica-num 1 --poolId 2 --pools 2 -y
Create volume success.
```

The *DataNode* creates three data partitions for the new volume, as
directories on the zoned drives:

```plaintext
# ls /data/disk1/cubefs /data/disk2/cubefs
/data/disk1/cubefs:
datapartition_1_128849018880  datapartition_2_128849018880

/data/disk2/cubefs:
datapartition_3_128849018880
```

### Step 5: Mount the Volume

Create */etc/cubefs/client.json*:

```json
{
  "masterAddr": "127.0.0.1:17010",
  "mountPoint": "/mnt/cubefs",
  "volName": "zvol",
  "owner": "cubefs",
  "logDir": "/var/lib/cubefs/client/logs",
  "logLevel": "warn",
  "profPort": "17510"
}
```

Mount the volume. *cfs-client* runs in the background after the mount:

```plaintext
# mkdir -p /mnt/cubefs
# cfs-client -c /etc/cubefs/client.json
# findmnt /mnt/cubefs
TARGET      SOURCE      FSTYPE OPTIONS
/mnt/cubefs cubefs-zvol fuse   rw,nosuid,nodev,relatime,user_id=0,group_id=0,allow_other,max_read=131072
# df -h /mnt/cubefs
Filesystem      Size  Used Avail Use% Mounted on
cubefs-zvol      20G     0   20G   0% /mnt/cubefs
```

### Step 6: Write and Read Data

Copy a 1 GiB file and 200 small files (up to 64 KiB) to the volume, drop the
page cache and compare checksums:

```plaintext
# head -c 1G /dev/urandom > test.bin
# mkdir -p small && for i in $(seq 1 200); do head -c $((RANDOM*2+1)) /dev/urandom > small/small$i; done
# (cd small && sha256sum small* > ../small.sums)
# mkdir -p /mnt/cubefs/data
# cp test.bin /mnt/cubefs/data/
# cp -r small /mnt/cubefs/data/
# sync; echo 3 > /proc/sys/vm/drop_caches
# sha256sum test.bin /mnt/cubefs/data/test.bin
fba25860e31e8537ccd9026467030b9fa5797039d3804076f2f8f322d2557fda  test.bin
fba25860e31e8537ccd9026467030b9fa5797039d3804076f2f8f322d2557fda  /mnt/cubefs/data/test.bin
# (cd /mnt/cubefs/data/small && sha256sum -c --quiet ~/small.sums && echo OK)
OK
```

The *ObjectNode* serves each volume as an S3 bucket of the same name, using
the user's access and secret key. The test used *boto3* with the region set
to *us-east-1*:

```python
import boto3
s3 = boto3.client("s3", endpoint_url="http://127.0.0.1:17410",
                  aws_access_key_id="ZNHRqBSjSlGsUyjI",
                  aws_secret_access_key="DLmqrtXynojTujNoRreoU0s5g8vuNr4Z",
                  region_name="us-east-1")
s3.upload_file("b.bin", "zvol", "s3/obj.bin")
s3.download_file("zvol", "s3/obj.bin", "obj.down")
```

```plaintext
$ sha256sum b.bin obj.down
8d67c6613a5aa98dfc3eb6b83f7c1cf9a6e40acce493441af3a20a40322c3b1a  b.bin
8d67c6613a5aa98dfc3eb6b83f7c1cf9a6e40acce493441af3a20a40322c3b1a  obj.down
# ls -l /mnt/cubefs/s3
-rw-r--r-- 1 root root 314572800 Nov  3 16:25 obj.bin
```

Objects uploaded through S3 are files in the volume and use the same extent
files on the zoned drives.

### Step 7: Verify the Data Is on the Zoned Devices

The 1 GiB file was split into 128 MiB normal extents (*1025* to *1028*) in
several data partitions. The small files went to normal extents (*1029* and
up) and tiny extents (*1* to *64*):

```plaintext
# cd /data/disk1/cubefs/datapartition_2_128849018880
# ls -l | grep -v ' 0 Nov'
total 526824
-rw-r--r-- 1 root root     61371 Nov  3 16:20 10
-rw-r--r-- 1 root root 134217728 Nov  3 16:19 1025
-rw-r--r-- 1 root root 134217728 Nov  3 16:19 1026
-rw-r--r-- 1 root root 134217728 Nov  3 16:19 1027
-rw-r--r-- 1 root root 133169152 Nov  3 16:19 1028
-rw-r--r-- 1 root root     43205 Nov  3 16:19 1029
...
-rwxr-xr-x 1 root root         1 Nov  3 16:17 APPLY
-rw-r--r-- 1 root root   4497412 Nov  3 16:20 EXTENT_CRC
-rw-r--r-- 1 root root        20 Nov  3 16:20 EXTENT_META
-rw-r--r-- 1 root root       419 Nov  3 16:17 META
drwxr-xr-x 2 root root        63 Nov  3 16:17 wal_2
```

The extent and checksum files have the *realtime* attribute (`r`). The
*xfs_bmap* output shows the extents in the realtime group (*RG*, one group
per zone) column. In the test, a 128 MiB extent file had 92 extents within
one zone:

```plaintext
# xfs_io -c lsattr . 1026 EXTENT_CRC
-------t--------X .
r---------------X 1026
r---------------X EXTENT_CRC
# xfs_bmap -v 1026
1026:
 EXT: FILE-OFFSET       RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..4095]:        8390664..8394759 12 (2056..6151)      4096
   1: [4096..6143]:     8396808..8398855 12 (8200..10247)     2048
   2: [6144..8191]:     8400904..8402951 12 (12296..14343)    2048
   3: [8192..10239]:    8394760..8396807 12 (6152..8199)      2048
...
  91: [261728..262143]: 8652440..8652855 12 (263832..264247)   416
# xfs_bmap -v 10
10:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..119]:        3144584..3144703  1 (523144..523263)   120
```

The zone report shows full (*fu*), open (*oi*) and empty (*em*) zones. This
report was taken after the fill and delete tests described below; *XFS* had
reset the zones whose data was deleted:

```plaintext
# blkzone report /dev/sda
  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
...
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x000580000, len 0x080000, cap 0x080000, wptr 0x07f828 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
...
```

## Production Notes

### Disks, Reserved Space and Capacity

- **One file system per drive.** Format each SMR disk or ZNS namespace as a
  separate zoned *XFS* file system and list one directory per drive in the
  *DataNode* `disks` setting. Do not combine zoned drives with LVM or RAID;
  *CubeFS* replicates data partitions across *DataNodes*.
- **Read-only threshold.** The *DataNode* raises `diskRdonlySpace` to at
  least 5 GiB. It subtracts this value from each disk's capacity and stops
  creating new extents on the disk when its free space falls below it. On the
  16 GiB test drives (14 GiB of sequential zones), 9 GiB per drive was usable.
  On large SMR disks, this is negligible.
- **Media type.** Set `mediaType` in *datanode.json* to 2 for SMR disks and 1
  for SSDs. The volume must be created in the matching storage pool (see
  [Troubleshooting](#troubleshooting)).
- **Conventional storage for metadata.** Keep the *Master* (`walDir`,
  `storeDir`), *MetaNode* (`metadataDir`, `raftDir`) and *DataNode*
  `raftDir` on SSDs or other conventional storage.

### Punch Hole, Preallocation and Overwrites

The *DataNode* uses *fallocate()* in three ways. On zoned *XFS*:

- **Punch hole** (`FALLOC_FL_PUNCH_HOLE | FALLOC_FL_KEEP_SIZE`) works. The
  *DataNode* uses it to delete small files from tiny extents and to clear
  entries in *EXTENT_CRC*. In the test, the deleted ranges were freed (the
  tiny extent file had no allocated blocks afterwards); *XFS* garbage
  collection reclaims the space in partially valid zones.
- **Preallocation** (`FALLOC_FL_KEEP_SIZE`) of the *EXTENT_CRC* files fails
  with *EOPNOTSUPP*, because zoned *XFS* does not support persistent
  preallocation. The *DataNode* ignores this error and writes the checksums
  without preallocation. Tracing the *DataNode* showed 150 failed
  preallocation calls and no errors in its logs during the tests.
- **Overwrites** of existing file data (random writes through *FUSE*) work.
  In the test, four 16 MiB overwrites into a 300 MiB file produced the
  expected checksum. *XFS* writes overwritten data out of place.

The *DataNode* does not use reflink or quotas.

### Deletes and Space Reclaim

*CubeFS* deletes file data asynchronously. In the test, deleting 1 GiB of
large files reduced the drive usage reported by *df* within about 30 to 60
seconds: the *DataNode* removed the normal extent files, and *XFS* reset
the zones that no longer held valid data. Repeated cycles of writing 4 GiB
and deleting 2 GiB, run after the volume had been filled once, completed
without errors. All 14 remaining 1 GiB files, the overwritten file and the
S3 object passed checksum verification afterwards.

Small files in tiny extents leave invalid ranges in partially used zones
after deletion. For workloads with many small-file deletes, consider raising
*zonegc_low_space* so that *XFS* starts garbage collection earlier:

```plaintext
# cat /sys/fs/xfs/sda/zoned/max_open_zones
14
# cat /sys/fs/xfs/sda/zoned/zonegc_low_space
0
# echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
```

### Open Zones

*XFS* uses one fewer than the device's open-zone limit for file data (14 on
the test drives). Each data partition appends to its own extent files, and
*XFS* tries to keep concurrently written files in separate zones, so many
active data partitions per disk share this limit. Use the *max_open_zones*
mount option to lower it for SMR disks. See
[XFS tuning](/docs/filesystems/xfs#tuning).

### Restart

After stopping and restarting the *DataNode*, it reloaded its data
partitions from the zoned drives, and all files read back with the same
checksums.

### Blobstore Is Not Supported

The *blobstore* erasure-coding subsystem stores data in chunk files on the
*BlobNode* disks. When it creates a chunk, the *BlobNode* preallocates the
4 KiB chunk header with *fallocate()* mode 0
(`blobnode/core/storage/datafile.go`, `writeMeta()`) and fails if that call
fails. On zoned *XFS*, the call returns *EOPNOTSUPP*:

```plaintext
PreAllocate(0, 4096): operation not supported
PunchHole(0, 4096): <nil>
```

This output is from a test program calling the *BlobNode*'s
*sys.PreAllocate()* and *sys.PunchHole()* functions on a zoned *XFS* file
system. The same calls succeed on regular *XFS*. Use replica volumes with
*DataNodes* on zoned drives, and keep *blobstore* disks on conventional
storage.

## Troubleshooting

### "poolId(1) not found in available pools(2)"

```plaintext
# cfs-cli volume create zvol cubefs --capacity 20 --replica-num 1 -y
Error: Create volume failed case:
poolId(1) not found in available pools(2) for zoneName(default)
```

The default storage pool (1) is for SSD media. In a cluster where all
*DataNodes* have `mediaType` 2 (HDD), create the volume with
`--poolId 2 --pools 2`.

### Small Files Are Not Written to Tiny Extents Right After Startup

For about one minute after a data partition is created or the *DataNode*
starts, its tiny extents are not yet available. Writes of small files are
retried in normal extents, and the *DataNode* warning log shows:

```plaintext
[WARN ] repl_protocol.go:434: ... ResultMesg(DiskNoSpaceErr)] ... err[ActionPreparePkt_checkPacketAndPrepare partition 3 GetAvailableTinyExtent error no available extent]
```

The data is written correctly. The tiny extents become available after the
first tiny extent repair cycle. This behavior is not specific to zoned
storage.

### Writes Fail with "no space left on the device" While XFS Has Free Space

The client reports an I/O error, and the *DataNode* error log shows:

```plaintext
[ERROR] repl_protocol.go:436: ... _Opcode(OpCreateExtent)_CRC(0)_ResultMesg(DiskNoSpaceErr)] ... err[ActionCreateExtent:_no space left on the device]
```

The disk reached the `diskRdonlySpace` threshold (at least 5 GiB per disk),
and its data partitions became read-only. In the test, this happened when
*df* still reported about 4.9 GiB free per drive. Delete data or add drives.
After deletion, the data partitions became writable again within about a
minute.

### Extent Files Are Not on the Zoned Device

If `xfs_io -c lsattr` does not show the `r` flag on extent files, the
`disks` entry is not on the zoned file system, or the *rtinherit* attribute
was cleared on a parent directory. Check the mount with `df` and the
directory attributes with `xfs_io -c lsattr`; see
[Placing Data on the Main Device](/docs/filesystems/xfs#placing-data-on-the-main-device).

## Learn More

- [CubeFS documentation](https://cubefs.io/docs/master/overview/introduction.html)
- [CubeFS standalone deployment](https://github.com/cubefs/cubefs/blob/master/docs/source/quickstart/single-deploy.md)
- [CubeFS production environment recommendations](https://github.com/cubefs/cubefs/blob/master/docs/source/deploy/env.md)
- [CubeFS releases](https://github.com/cubefs/cubefs/releases)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
