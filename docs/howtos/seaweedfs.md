---
id: seaweedfs
title: SeaweedFS on Zoned Storage
sidebar_label: SeaweedFS
---

# SeaweedFS on Zoned Storage

<a href="https://github.com/seaweedfs/seaweedfs" target="_blank">*SeaweedFS*</a>
is a distributed storage system for blobs, objects and files. The *master*
manages cluster topology, and *volume servers* store file data. An optional
*filer* provides directories and file names, with access through an *S3*
gateway, *WebDAV* or *FUSE* mounts.

Volume servers pack files ("needles") into large append-only *volume* files
(`<id>.dat`, 30 GB each by default), rather than storing each file separately
on disk. Each volume also has an append-only index (`<id>.idx`). To reclaim
space after deletions, the volume server *vacuums* a volume: it copies live
needles into a new volume file and deletes the old one.

Place volume server directories on
[zoned *XFS*](/docs/filesystems/xfs). *XFS* handles sequential zone writes and
reclaims space after volume files are deleted. *SeaweedFS* requires no
zoned-device support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *SeaweedFS*: tested with release 4.52 (`weed` binary for linux amd64)
- A conventional (random-write) disk, typically an SSD, for the master and
  filer metadata
:::

## How It Fits Together

| Component | Data | Storage |
| :-------- | :--- | :------ |
| Volume server (`weed volume`) | Volume files `*.dat`, `*.vif` | One zoned *XFS* file system per zoned drive (`-dir`) |
| Volume server (`weed volume`) | Volume index files `*.idx` | Zoned *XFS* (default), or an SSD with `-dir.idx` |
| Master (`weed master`) | Cluster topology, Raft state | Conventional storage (`-mdir`) |
| Filer (`weed filer`) | File and directory metadata (embedded *LevelDB* by default) | Conventional storage (`-defaultStoreDir`) |
| S3 gateway (`weed s3`) | None (stateless, stores through the filer) | - |

Only volume servers store bulk data on zoned drives. A volume server can
manage several drives, each with its own *XFS* file system and an entry in
the server's `-dir` list.

## Quick Start

This procedure sets up a single node with two zoned drives, a master,
a volume server, a filer and an S3 gateway. Run setup commands as root.

### 1. Prepare the Zoned XFS File Systems

Check the kernel and xfsprogs versions against the requirements above.

```plaintext
# uname -r
6.17.7
# mkfs.xfs -V
mkfs.xfs version 6.19.0
```

#### SMR Hard Disks (Drives With Conventional Zones)

For SMR disks with conventional zones at the start of the address space,
format and mount each disk directly. This example uses */dev/sda* and
*/dev/sdb*:

```plaintext
# mkfs.xfs /dev/sda
meta-data=/dev/sda               isize=512    agcount=4, agsize=131072 blks
         =                       sectsz=4096  attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=524288, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=1
log      =internal log           bsize=4096   blocks=25087, version=2
         =                       sectsz=4096  sunit=1 blks, lazy-count=1
realtime =internal               extsz=4096   blocks=16252928, rtextents=16252928
         =                       rgcount=248  rgsize=65536 extents
         =                       zoned=1      start=524288 reserved=0
Resetting zones...Done.
# mkfs.xfs /dev/sdb
# mkdir -p /mnt/disk1 /mnt/disk2
# mount /dev/sda /mnt/disk1
# mount /dev/sdb /mnt/disk2
```

The `zoned=1` output indicates that *XFS* uses the drive's sequential zones
as its zoned realtime device. The root directory's *rtinherit* (`t`)
attribute makes new files use that device by default.

```plaintext
# xfs_io -c lsattr /mnt/disk1
-------t--------- /mnt/disk1
```

#### NVMe ZNS SSDs (Drives Without Conventional Zones)

An NVMe ZNS namespace has no conventional zones, so *XFS* needs a separate
conventional block device for its metadata, for example a small conventional
namespace or partition (about 1% of the zoned capacity is enough). Pass the
zoned namespace as the realtime device, both to `mkfs.xfs` and to `mount`.

```plaintext
# mkfs.xfs -r rtdev=/dev/nvme0n2 /dev/nvme1n1p1
# mount -o rtdev=/dev/nvme0n2 /dev/nvme1n1p1 /mnt/disk1
```

See [*XFS*](/docs/filesystems/xfs) for more details on both formats.

:::tip
To test without a zoned drive, create an emulated zoned block device with
*zloop* as described in [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
and use it in place of */dev/sda*. This guide was tested with two 64 GiB
*zloop* devices, each with 256 MiB zones and 8 conventional zones.
:::

#### Persistent Mounts

Add the file systems to */etc/fstab* to mount them at boot. For ZNS devices,
specify the realtime device with the `rtdev` mount option.

```plaintext
# SMR HDDs
/dev/sda         /mnt/disk1  xfs  defaults,noatime                   0 0
/dev/sdb         /mnt/disk2  xfs  defaults,noatime                   0 0
# NVMe ZNS (conventional metadata partition + zoned namespace)
/dev/nvme1n1p1   /mnt/disk1  xfs  rtdev=/dev/nvme0n2,noatime         0 0
```

Using `/dev/disk/by-id/` names instead of */dev/sdX* names keeps the entries
stable when device names change across reboots.

### 2. Install SeaweedFS

*SeaweedFS* is a single static binary, `weed`, that provides all server
roles. Download the release archive for your architecture from the
<a href="https://github.com/seaweedfs/seaweedfs/releases" target="_blank">SeaweedFS releases page</a>
and install it.

```plaintext
# curl -LO https://github.com/seaweedfs/seaweedfs/releases/download/4.52/linux_amd64.tar.gz
# tar xzf linux_amd64.tar.gz
# install -m 755 weed /usr/local/bin/weed
# weed version
version 30GB 4.52 984eac6a790be89e2a11de175a7413e1e3e32dd3 linux amd64
```

The `30GB` in the version string is the maximum volume size of this build.
The release page also provides `*_large_disk` archives, built for volumes
larger than 30 GB.

### 3. Start the Master

The master keeps its state in the `-mdir` directory. Place it on
conventional storage, for example */var/lib/seaweedfs* on the system SSD.

```plaintext
# mkdir -p /var/lib/seaweedfs/master /var/lib/seaweedfs/idx /var/lib/seaweedfs/filer
# weed master -ip=127.0.0.1 -mdir=/var/lib/seaweedfs/master -volumeSizeLimitMB=1024
```

The `-volumeSizeLimitMB` option sets the size at which the master stops
assigning writes to a volume and creates a new one. The default is 30720
(30 GB). This guide uses a 1 GB limit because each 64 GiB test device holds
only two 30 GB volumes. See [Volume Size](#volume-size) for sizing guidance.

### 4. Start the Volume Server on the Zoned Drives

Use `-dir` to specify one directory per zoned drive and `-max` to set the
maximum number of volumes per directory. With `-max=0`, the volume server
computes the limit by dividing the file system's free space by the volume
size limit.

```plaintext
# weed volume -ip=127.0.0.1 -master=127.0.0.1:9333 \
      -dir=/mnt/disk1,/mnt/disk2 -max=0,0 \
      -dir.idx=/var/lib/seaweedfs/idx
```

Without `-dir.idx`, append-only index files are stored alongside volume
files on the zoned drives. Set `-dir.idx` to an SSD directory to keep index
updates and index loading at server startup off the hard disks.

Check the capacity reported by the master. In this test setup, each of the
two 61 GiB file systems has capacity for 60 volumes of 1 GB.

```plaintext
# curl -s http://127.0.0.1:9333/dir/status | jq -c '.Topology | {Max, Free}'
{"Max":120,"Free":120}
```

### 5. Start the Filer and the S3 Gateway

The filer provides file names, directories and S3 access. Place its
metadata store (embedded *LevelDB* by default) on conventional storage.

```plaintext
# weed filer -ip=127.0.0.1 -master=127.0.0.1:9333 -defaultStoreDir=/var/lib/seaweedfs/filer
# weed s3 -filer=127.0.0.1:8888
```

For production, run each `weed` command as a service, such as a *systemd*
unit. Configure S3 credentials as described in the
<a href="https://github.com/seaweedfs/seaweedfs/wiki/Amazon-S3-API" target="_blank">SeaweedFS S3 documentation</a>.
Without credentials, the S3 gateway accepts anonymous requests. Use
anonymous access only for testing.

### 6. Write and Read Data

Upload a test file directly to the volume servers with `weed upload`, read
it back from the volume server, and compare the checksums.

```plaintext
$ head -c 200M /dev/urandom > sample.bin
$ sha256sum sample.bin
e9f3dc839ed3f16fb2aecf12a85f319f25a588b1b1870e694450d97b624b66b2  sample.bin
$ weed upload -master=127.0.0.1:9333 sample.bin
[{"fileName":"sample.bin","url":"127.0.0.1:8080/1,0117eddfdf","fid":"1,0117eddfdf","size":209715200}]
$ curl -s -o download.bin http://127.0.0.1:8080/1,0117eddfdf
$ sha256sum download.bin
e9f3dc839ed3f16fb2aecf12a85f319f25a588b1b1870e694450d97b624b66b2  download.bin
```

Repeat the upload and checksum comparison through the filer HTTP API, using a path name.

```plaintext
$ curl -s -F file=@sample.bin http://127.0.0.1:8888/docs/
{"name":"sample.bin","size":209715200}
$ curl -s -o filer.bin http://127.0.0.1:8888/docs/sample.bin
$ sha256sum filer.bin
e9f3dc839ed3f16fb2aecf12a85f319f25a588b1b1870e694450d97b624b66b2  filer.bin
```

To test the S3 API, create a bucket, upload the file and compare its checksum.
This example uses `curl` with anonymous access.

```plaintext
$ curl -s -X PUT http://127.0.0.1:8333/mybucket -o /dev/null -w "%{http_code}\n"
200
$ curl -s -T sample.bin http://127.0.0.1:8333/mybucket/sample.bin -o /dev/null -w "%{http_code}\n"
200
$ curl -s http://127.0.0.1:8333/mybucket/sample.bin | sha256sum
e9f3dc839ed3f16fb2aecf12a85f319f25a588b1b1870e694450d97b624b66b2  -
```

### 7. Verify the Data Is on the Zoned Drives

List the volume files on the zoned file systems. Each S3 bucket is a separate
*SeaweedFS* collection, with the bucket name as its volume file prefix.

```plaintext
# ls -l /mnt/disk2
total 307260
-rw-r--r-- 1 root root 92275928 Nov  3 14:30 2.dat
-rw-r--r-- 1 root root      194 Nov  3 14:30 2.vif
-rw-r--r-- 1 root root 41943608 Nov  3 14:30 4.dat
-rw-r--r-- 1 root root      194 Nov  3 14:30 4.vif
-rw-r--r-- 1 root root 46137968 Nov  3 14:30 6.dat
-rw-r--r-- 1 root root      194 Nov  3 14:30 6.vif
-rw-r--r-- 1 root root 41943528 Nov  3 14:30 mybucket_10.dat
-rw-r--r-- 1 root root      194 Nov  3 14:30 mybucket_10.vif
-rw-r--r-- 1 root root 20971768 Nov  3 14:30 mybucket_12.dat
-rw-r--r-- 1 root root      194 Nov  3 14:30 mybucket_12.vif
-rw-r--r-- 1 root root 37749176 Nov  3 14:30 mybucket_14.dat
-rw-r--r-- 1 root root      194 Nov  3 14:30 mybucket_14.vif
-rw-r--r-- 1 root root 33554824 Nov  3 14:30 mybucket_8.dat
-rw-r--r-- 1 root root      194 Nov  3 14:30 mybucket_8.vif
-rw-r--r-- 1 root root       36 Nov  3 14:30 vol_dir.uuid
```

The *realtime* attribute (`r`) shows that the volume files are stored on the
zoned realtime device.

```plaintext
# xfs_io -c lsattr /mnt/disk2/*.dat
r---------------X /mnt/disk2/2.dat
r---------------X /mnt/disk2/4.dat
r---------------X /mnt/disk2/6.dat
r---------------X /mnt/disk2/mybucket_10.dat
r---------------X /mnt/disk2/mybucket_12.dat
r---------------X /mnt/disk2/mybucket_14.dat
r---------------X /mnt/disk2/mybucket_8.dat
```

`xfs_bmap` lists file extents on the realtime device under *RT-BLOCK-RANGE*.
In this example, all extents are in realtime group (zone) 29.

```plaintext
# xfs_bmap -v /mnt/disk2/2.dat
/mnt/disk2/2.dat:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE      RG RG-OFFSET         TOTAL
   0: [0..4095]:       19398656..19402751  29 (0..4095)          4096
   1: [4096..6143]:    19421184..19423231  29 (22528..24575)     2048
   2: [6144..8191]:    19410944..19412991  29 (12288..14335)     2048
   3: [8192..16383]:   19402752..19410943  29 (4096..12287)      8192
   4: [16384..18431]:  19417088..19419135  29 (18432..20479)     2048
   5: [18432..22527]:  19412992..19417087  29 (14336..18431)     4096
   6: [22528..24575]:  19419136..19421183  29 (20480..22527)     2048
   7: [24576..180231]: 19423232..19578887  29 (24576..180231)  155656
```

Realtime group 29 corresponds to drive zone 37, after the drive's 8
conventional zones. The zone write pointer is at sector 0x2c008 (180232
sectors), matching the end of *2.dat* shown above. The volume data was
written sequentially into this zone.

```plaintext
# blkzone report -o 0x1280000 -c 1 /dev/sdb
  start: 0x001280000, len 0x080000, cap 0x080000, wptr 0x02c008 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
```

## Volume Preallocation and Vacuum

### Do Not Use Volume Preallocation

The master option `-volumePreallocate` makes volume servers preallocate the
full volume size with `fallocate()` when they create a volume. Zoned *XFS*
does not support persistent preallocation (see the
[*XFS* limitations](/docs/filesystems/xfs#limitations)), and `fallocate()`
fails with `EOPNOTSUPP`:

```plaintext
# xfs_io -f -c "falloc 0 1m" /mnt/disk1/ftest
fallocate: Operation not supported
```

*SeaweedFS* logs a warning but creates the volume despite the preallocation
failure. Writes to the volume still succeed.

```plaintext
W1103 14:17:24.470603 volume_create_linux.go:24 Preallocate 1073741824 bytes disk space for /mnt/disk1/prealloc_15.dat: operation not supported
```

The volume server still requires free space equal to the full preallocation
size to vacuum the volume. In tests with `-volumePreallocate`, vacuuming
failed when file system free space fell below the volume size limit, even
when most of the volume contained deleted data:

```plaintext
E1103 14:21:25.115826 volume_grpc_vacuum.go:79 failed compact volume 40: insufficient free space for compaction in /mnt/disk3: need 1073741824 bytes (data: 1073741824, ...
```

**Do not set `-volumePreallocate`**; it is off by default. Zoned *XFS* writes
data sequentially without it. In the test above, disabling the option
allowed the same vacuum to complete on the same nearly full file system.

### Vacuum (Compaction) Works Unchanged

Deleting a file marks its needle as deleted; it does not free disk space.
Every `-vacuumIntervalSeconds` (default 840 seconds), the master requests
vacuum for volumes above `-garbageThreshold` (default 0.3). The volume server
writes a compacted copy and deletes the old file. *XFS* then reclaims the
space occupied by the old file.

To start vacuum manually, use `weed shell`. This example first deletes the
200 MiB file uploaded through the filer.

```plaintext
$ curl -s -X DELETE http://127.0.0.1:8888/docs/sample.bin
$ printf "lock\nvolume.vacuum -garbageThreshold=0.3\nunlock\n" | weed shell -master=127.0.0.1:9333
```

In this test, *2.dat* shrank from 92 MB to 38 MB, and its data moved to a new
zone (realtime group 39).

```plaintext
# ls -l /mnt/disk2/2.dat
-rw-r--r-- 1 root root 37749248 Nov  3 14:31 /mnt/disk2/2.dat
# xfs_bmap -v /mnt/disk2/2.dat
/mnt/disk2/2.dat:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE      RG RG-OFFSET        TOTAL
   0: [0..2047]:       24641536..24643583  39 (0..2047)         2048
   1: [2048..28671]:   24645632..24672255  39 (4096..30719)    26624
   2: [28672..30719]:  24643584..24645631  39 (2048..4095)      2048
   3: [30720..73735]:  24672256..24715271  39 (30720..73735)   43016
```

After vacuum deletes the old volume file, *XFS* can reset any zones left with
no valid data. Zones shared with other files require garbage collection
before they can be reset.

## Production Notes

### One File System per Drive

Format every zoned drive as its own *XFS* file system and list all of them in
the `-dir` option of the volume server, with one `-max` value per directory.

```plaintext
# weed volume -master=master1:9333 \
      -dir=/mnt/disk1,/mnt/disk2,/mnt/disk3,/mnt/disk4 -max=0,0,0,0 \
      -dir.idx=/var/lib/seaweedfs/idx
```

Do not combine several zoned drives into one file system with RAID or LVM:
*SeaweedFS* already distributes volumes across directories and servers, and
handles redundancy with replication (`-defaultReplication`) or erasure
coding.

### Volume Size

A 30 GB volume spans about 120 zones on a drive with 256 MiB SMR zones.
The volume size does not need to match the zone size. When choosing
`-volumeSizeLimitMB`, consider capacity and compaction costs:

- With `-max=0`, the volume server computes the number of volumes per drive
  at startup by dividing free space by the volume size limit. Small drives
  or emulated test devices may need a limit below the 30 GB default to
  accommodate enough volumes.
- Vacuum needs free space for the live data in the volume being compacted.
  Smaller volumes reduce the free space required and the data rewritten per
  vacuum, but increase the number of files and index entries to manage.
- Volumes larger than 30 GB require the `large_disk` build of `weed`.

### Open Zones and Concurrent Writers

*XFS* places concurrent file writes in separate zones, up to the file
system's open zone limit. The kernel reports this limit at mount time.
Use the *max_open_zones* mount option to lower it.

```plaintext
XFS (sda): limiting open zones to 62 due to total zone count (248)
XFS (sda): 248 zones of 65536 blocks size (62 max open)
```

*SeaweedFS* keeps several writable volumes per collection: 7 by default for
unreplicated data. See `[master.volume_growth]` in the output of
`weed scaffold -config=master`. Each S3 bucket is a separate collection.

The number of active volumes affects how many files share each open zone.
With more concurrent volume writers than open zones, files share zones;
vacuum can then leave live data from other volumes in those zones. *XFS*
must relocate that data before resetting the zones. See
[*XFS* tuning](/docs/filesystems/xfs#tuning) for the *zonegc_low_space*
garbage-collection threshold.

### Free Space

Volume servers mark all volumes in a directory read-only when free space
drops below `-minFreeSpace` (default 1%). Reserve free space on each zoned
drive for both volume vacuuming and *XFS* garbage collection.

## Troubleshooting

### Volume Creation Logs "Preallocate ... operation not supported"

The master has `-volumePreallocate` enabled, but zoned *XFS* does not support
`fallocate()`. Remove the option from the master command line. See
[Do Not Use Volume Preallocation](#do-not-use-volume-preallocation).

### Vacuum Fails With "insufficient free space for compaction"

Check whether `-volumePreallocate` is enabled, especially if `data:` equals
the volume size limit. Disable preallocation as described above.

Without preallocation, vacuum still needs space for a compacted copy of the
live data. Deleting objects reduces that data but does not release disk space
until vacuum completes. Allow compaction headroom when sizing the deployment;
lowering `-volumeSizeLimitMB` does not shrink existing volume files.

### Uploads Fail With "No writable volumes and no free volumes left"

All volume slots (`-max`) are in use. This can happen when the volume size
limit is large relative to drive capacity: a 64 GiB test device holds only
two volumes at the default 30 GB limit. Lower `-volumeSizeLimitMB` on the
master, add drives, or raise `-max`. Raising `-max` beyond available space
causes volume creation to fail with `No more free space left`.

### Uploads Fail With "volume growth is frozen after master state loss"

The master metadata directory (`-mdir`) was lost or replaced, but the volume
directories still contain data from the previous cluster. The volume server
records the cluster identity in a hidden `.vid_stamp` file in each `-dir`.
This *SeaweedFS* safety check is unrelated to zoned storage.

Restore the master state, or verify the volumes before running
`volume.growth.resume` in `weed shell`. For a fresh test setup, empty the
volume directories completely, including hidden files.

## Learn More

- <a href="https://github.com/seaweedfs/seaweedfs/wiki" target="_blank">SeaweedFS documentation (wiki)</a>
- <a href="https://github.com/seaweedfs/seaweedfs/wiki/Optimization" target="_blank">SeaweedFS optimization</a>
- <a href="https://github.com/seaweedfs/seaweedfs/wiki/Amazon-S3-API" target="_blank">SeaweedFS S3 API</a>
- [*XFS* zoned storage support](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
