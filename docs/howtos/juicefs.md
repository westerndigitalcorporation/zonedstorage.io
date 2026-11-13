---
id: juicefs
title: JuiceFS on Zoned Storage
sidebar_label: JuiceFS
---

# JuiceFS on Zoned Storage

[*JuiceFS*](https://juicefs.com/docs/community/introduction/) is an open-source,
POSIX-compatible distributed file system. A database such as *Redis*,
*SQLite*, *MySQL* or *TiKV* stores file system metadata. File data is split
into chunks and then blocks, 4 MiB by default, stored as objects in S3,
*MinIO* or a local directory. Clients mount the file system through *FUSE*
and can cache blocks on local storage.

Place the object store on [*XFS*](/docs/filesystems/xfs) to use host-managed
SMR disks or NVMe ZNS SSDs. *JuiceFS* writes new block objects rather than
updating existing ones. *XFS* handles sequential zone writes and reclaims
space after objects are deleted. The local cache can also use zoned *XFS*.
Keep the metadata database on conventional storage.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- FUSE support (`/dev/fuse` and the `fusermount` utility)
- JuiceFS Community Edition: tested with version 1.4.2
- Metadata engine: tested with SQLite (embedded) and Redis 7.4
- Optional S3 back-end: tested with *MinIO* (built from source) on zoned *XFS*
:::

## How It Fits Together

Place the components as follows:

| Component | Stores | Where to place it |
|-----------|--------|-------------------|
| Object storage | File data blocks (`chunks/` objects) | Zoned *XFS* (directly with `--storage file`, or through an S3 server such as *MinIO* running on zoned *XFS*) |
| Local cache (`--cache-dir`) | Copies of recently read blocks, and blocks waiting to be uploaded with `--writeback` | Optionally zoned *XFS* |
| Metadata engine | Inodes, directories, chunk maps | Conventional storage (SSD), e.g. *SQLite* for a single host or *Redis* for production |

## Quick Start

This single-host setup uses a directory on zoned *XFS* for block objects and
*SQLite* on conventional storage for metadata.

### Step 1: Prepare a Zoned XFS File System

Check the [*XFS* requirements](/docs/filesystems/xfs#system-requirements)
before formatting the drive.

**SMR hard disk with conventional zones.** *XFS* stores its metadata in the
conventional zones. Format and mount the disk, `/dev/sda` in this example:

```plaintext
# mkfs.xfs /dev/sda
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
# mkdir -p /mnt/zoned
# mount /dev/sda /mnt/zoned
```

The `zoned=1` field identifies a zoned realtime device. At mount time, *XFS*
reports the number of zones and the open-zone limit:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem 78ccf25c-0d89-4e8d-b899-7ebdb5267b7e
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

**NVMe ZNS SSD.** A ZNS namespace has no conventional zones. Use a separate
conventional block device for *XFS* metadata, such as a conventional
namespace or SSD partition. Specify the ZNS namespace as the realtime device
when formatting and mounting:

```plaintext
# mkfs.xfs -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mkdir -p /mnt/zoned
# mount -o rtdev=/dev/nvme0n2 /dev/nvme1n1 /mnt/zoned
```

See the [*XFS* page](/docs/filesystems/xfs) for details.

:::tip
For emulated hardware, create a *zloop* device as described in
[Zoned Block Device Emulation](/docs/getting-started/zbd-emulation), format it
with `mkfs.xfs` and mount it on `/mnt/zoned`. The tests used this setup.
:::

To mount at boot, add the appropriate entry to */etc/fstab*: the first line
for SMR, or the second for ZNS. Replace the main device name with its file
system UUID, obtained with `blkid`.

```plaintext
/dev/sda      /mnt/zoned  xfs  defaults                  0 0
/dev/nvme1n1  /mnt/zoned  xfs  defaults,rtdev=/dev/nvme0n2  0 0
```

### Step 2: Install JuiceFS

*JuiceFS* is a single static binary. The official install script downloads the
latest release, verifies its checksum and installs it in */usr/local/bin*:

```plaintext
# curl -sSL https://d.juicefs.com/install | sh -
...
Checking packages integrity ...
juicefs-1.4.2-linux-amd64.tar.gz: OK
Install juicefs to /usr/local/bin/juicefs successfully!
# juicefs version
juicefs version 1.4.2+2026-10-22.46af7af
```

Alternatively, download the `juicefs-<version>-linux-amd64.tar.gz` archive from
the [*JuiceFS* releases page](https://github.com/juicedata/juicefs/releases)
and copy the `juicefs` binary it contains to */usr/local/bin*.

### Step 3: Create the JuiceFS File System

Create a *JuiceFS* volume named *myjfs*. `--storage file` stores block objects
in the local directory specified by `--bucket`. Keep the *SQLite* database
on conventional storage, under */var/lib/juicefs* in this example.

```plaintext
# mkdir -p /var/lib/juicefs /mnt/zoned/juicefs
# juicefs format --storage file --bucket /mnt/zoned/juicefs/ \
      sqlite3:///var/lib/juicefs/myjfs.db myjfs
<INFO>: Meta address: sqlite3:///var/lib/juicefs/myjfs.db [NewClient@interface.go:645]
<WARNING>: Set storage tier: not supported [createStorage@format.go:290]
<INFO>: Data use file:///mnt/zoned/juicefs/myjfs/ [format@format.go:571]
<INFO>: Volume is formatted as {
  "Name": "myjfs",
  "UUID": "f0d278ef-dd14-4281-911f-c27ac7473c9d",
  "Storage": "file",
  "Tiers": {
    "0": {
      "ID": 0,
      "StorageClass": "",
      "Tag": ""
    }
  },
  "Bucket": "/mnt/zoned/juicefs/",
  "BlockSize": 4096,
  "Compression": "none",
  "EncryptAlgo": "aes256gcm-rsa",
  "TrashDays": 1,
  "MetaVersion": 1,
  "MinClientVersion": "1.1.0-A",
  "DirStats": true,
  "EnableACL": false
} [format@format.go:608]
```

The local disk back-end does not support storage tiers. Its *Set storage
tier: not supported* warning is expected and is unrelated to zoned storage.

:::note
Use `--capacity` to limit logical *JuiceFS* usage. This example sets a 12 GiB
limit on a 14 GiB *XFS* file system:

```plaintext
# juicefs config sqlite3:///var/lib/juicefs/myjfs.db --capacity 12 --yes
  capacity: 0 B -> 12 GiB
```

To set the limit at creation time, use `juicefs format --capacity <GiB>`.

This limit does not cap backing-store usage. Stale slices from edits and
overwrites remain in object storage for the trash retention period
(`--trash-days`) and can fill *XFS* before the logical limit is reached. The
2 GiB margin in this example is not a safe minimum for every workload.

Monitor free space on the backing *XFS* file system. Allow headroom for
retained data, pending deletions and garbage collection. See
[Deleted Data, Trash and Space Reclaim](#deleted-data-trash-and-space-reclaim)
and the [JuiceFS trash documentation](https://juicefs.com/docs/community/security/trash#gc).
:::

### Step 4: Mount JuiceFS

Mount the volume on */jfs*. The `-d` option runs the *FUSE* client in the
background. This example places the cache on a second zoned *XFS* file
system mounted at */mnt/zoned-cache*. Omit `--cache-dir` to use the default
location, */var/jfsCache* when running as root.

```plaintext
# juicefs mount -d --cache-dir /mnt/zoned-cache/juicefs-cache \
      sqlite3:///var/lib/juicefs/myjfs.db /jfs
<INFO>: Meta address: sqlite3:///var/lib/juicefs/myjfs.db [NewClient@interface.go:645]
<WARNING>: Set storage tier: not supported [createStorage@format.go:290]
<INFO>: Data use file:///mnt/zoned/juicefs/myjfs/ [mount@mount.go:620]
<INFO>: OK, myjfs is ready at "/jfs" [checkMountpoint@mount_unix.go:327]
# df -h /jfs
Filesystem      Size  Used Avail Use% Mounted on
JuiceFS:myjfs   1.0P     0  1.0P   0% /jfs
```

For boot-time mounts, `--update-fstab` adds an */etc/fstab* entry and creates
the */sbin/mount.juicefs* helper link. See
[Mount JuiceFS at Boot Time](https://juicefs.com/docs/community/mount_juicefs_at_boot_time).

```plaintext
# juicefs mount -d --update-fstab --cache-dir /mnt/zoned-cache/juicefs-cache \
      sqlite3:///var/lib/juicefs/myjfs.db /jfs
```

The entry uses the `juicefs` file system type and mount options without
leading dashes:

```plaintext
sqlite3:///var/lib/juicefs/myjfs.db  /jfs  juicefs  _netdev,cache-dir=/mnt/zoned-cache/juicefs-cache  0 0
```

The `_netdev` option orders the *JuiceFS* mount after local file system mounts.

### Step 5: Write and Read Data

Write a file through the *JuiceFS* mount, unmount, clear the local block cache
and remount. Compare checksums to verify the data read from the object store
without using the *JuiceFS* cache:

```plaintext
# dd if=/dev/urandom of=/root/test.bin bs=1M count=1024 status=none
# cp /root/test.bin /jfs/
# juicefs umount /jfs
# rm -rf /mnt/zoned-cache/juicefs-cache
# juicefs mount -d --cache-dir /mnt/zoned-cache/juicefs-cache \
      sqlite3:///var/lib/juicefs/myjfs.db /jfs
# sha256sum /root/test.bin /jfs/test.bin
9365eb5c93cdfde56a3f17aab7e9a339691edf0c9883e44e24948b0b68de26c6  /root/test.bin
9365eb5c93cdfde56a3f17aab7e9a339691edf0c9883e44e24948b0b68de26c6  /jfs/test.bin
```

### Step 6: Verify the Data Is on the Zoned Device

The 1 GiB file was split into 4 MiB block objects stored under the bucket
directory on the zoned *XFS* file system:

```plaintext
# ls /mnt/zoned/juicefs/myjfs/chunks/0/0 | head -4
10_0_4194304
10_10_4194304
10_11_4194304
10_12_4194304
# find /mnt/zoned/juicefs -type f | wc -l
513
```

The *XFS* *realtime* flag (`r`) identifies files on the zoned realtime device.
Use `xfs_bmap` to inspect their realtime extents:

```plaintext
# xfs_io -c lsattr /mnt/zoned/juicefs/myjfs/chunks/0/0/10_0_4194304
r---------------X /mnt/zoned/juicefs/myjfs/chunks/0/0/10_0_4194304
# xfs_bmap -v /mnt/zoned/juicefs/myjfs/chunks/0/0/10_0_4194304
/mnt/zoned/juicefs/myjfs/chunks/0/0/10_0_4194304:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..2047]:       3737608..3739655  3 (67592..69639)    2048
   1: [2048..4095]:    3862536..3864583  3 (192520..194567)  2048
   2: [4096..6143]:    3866632..3868679  3 (196616..198663)  2048
   3: [6144..8191]:    3870728..3872775  3 (200712..202759)  2048
```

In the zone report, `zcond:14(fu)` marks full zones, with their write pointers
at the end:

```plaintext
# blkzone report /dev/sda
...
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
...
```

Read-cache files also carry the realtime flag on the cache drive:

```plaintext
# ls -d /mnt/zoned-cache/juicefs-cache/*/raw/chunks/0/0/* | head -1
/mnt/zoned-cache/juicefs-cache/4bf9de19-6720-4446-843c-8d787e476127/raw/chunks/0/0/17_0_4194304
# xfs_io -c lsattr /mnt/zoned-cache/juicefs-cache/4bf9de19-6720-4446-843c-8d787e476127/raw/chunks/0/0/17_0_4194304
r---------------X /mnt/zoned-cache/juicefs-cache/4bf9de19-6720-4446-843c-8d787e476127/raw/chunks/0/0/17_0_4194304
```

## Using an S3 Object Store on Zoned Storage

The local file back-end stores objects on a single host. For a shared,
multi-client deployment, use an S3-compatible object store on zoned *XFS*,
such as [MinIO](/docs/howtos/minio).

This example uses a *MinIO* server at `http://127.0.0.1:9000` with its data on
a zoned *XFS* file system mounted at */mnt/zoned-minio*. Select it with
`--storage minio`; use `--storage s3` for other S3 services.

```plaintext
# juicefs format --storage minio --bucket http://127.0.0.1:9000/myjfs \
      --access-key minioadmin --secret-key minioadmin123 \
      sqlite3:///var/lib/juicefs/s3jfs.db s3jfs
<INFO>: Data use minio://127.0.0.1:9000/myjfs/s3jfs/ [format@format.go:571]
...
# juicefs mount -d sqlite3:///var/lib/juicefs/s3jfs.db /s3jfs
# cp /root/test.bin /s3jfs/
# sha256sum /s3jfs/test.bin
fa99ddbd5952c5372d048c706bfc67c414792a956b16edae606c3ee06bae020a  /s3jfs/test.bin
```

*JuiceFS* creates the bucket if needed. The *MinIO* *part.1* file for each
block object resides on the zoned realtime device:

```plaintext
# xfs_io -c lsattr /mnt/zoned-minio/myjfs/s3jfs/chunks/0/0/1_0_4194304/e6d68a4a-69e2-4fe5-b2e7-3a19e4744de1/part.1
r---------------X /mnt/zoned-minio/myjfs/s3jfs/chunks/0/0/1_0_4194304/e6d68a4a-69e2-4fe5-b2e7-3a19e4744de1/part.1
# xfs_bmap -v /mnt/zoned-minio/myjfs/s3jfs/chunks/0/0/1_0_4194304/e6d68a4a-69e2-4fe5-b2e7-3a19e4744de1/part.1
/mnt/zoned-minio/myjfs/s3jfs/chunks/0/0/1_0_4194304/e6d68a4a-69e2-4fe5-b2e7-3a19e4744de1/part.1:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..8199]:       6291456..6299655  8 (0..8199)         8200
```

:::tip
Pass the access and secret keys through the `ACCESS_KEY` and `SECRET_KEY`
environment variables instead of the command line to keep them out of the
process list and shell history.
:::

## Production Notes

### Metadata Engine

*SQLite* is limited to a single host. For multi-host access, use *Redis*,
*TiKV* or *MySQL*, with the database on a conventional SSD. The following
local-storage example changes the metadata engine to *Redis*:

```plaintext
# juicefs format --storage file --bucket /mnt/zoned/juicefs/ \
      redis://127.0.0.1:6379/1 myjfs
# juicefs mount -d redis://127.0.0.1:6379/1 /jfs
```

Enable *Redis* persistence (AOF and/or RDB) and follow the *JuiceFS*
[Redis best practices](https://juicefs.com/docs/community/redis_best_practices).

### One XFS File System per Drive, Multiple Drives

Use one *XFS* file system per zoned drive. With the local file back-end,
`juicefs format --shards` distributes block objects across bucket directories
by hash. The `%d` in the bucket path expands to a shard index from 0 to N-1.
For two drives mounted at */mnt/zoned0* and */mnt/zoned1*:

```plaintext
# juicefs format --storage file --shards 2 --bucket "/mnt/zoned%d/juicefs/" \
      sqlite3:///var/lib/juicefs/sjfs.db sjfs
<INFO>: Data use shard2://file:///mnt/zoned0/juicefs/sjfs/ [format@format.go:571]
...
```

In the test, writing a 1 GiB file placed 513 MiB of block objects on each
drive. For multi-host deployments, use an S3 object store across the zoned
drives, as in [MinIO on Zoned Storage](/docs/howtos/minio).

### Deleted Data, Trash and Space Reclaim

Deleted files remain in */jfs/.trash* for one day by default (`TrashDays: 1`).
Their block objects occupy space on *XFS* until they are removed. Configure
retention with `juicefs config <META-URL> --trash-days <N>`.

With `--trash-days 0`, deleted blocks were removed immediately in the tests.
After object deletion, *XFS* can reset zones with no valid data and reclaim
partially valid zones through garbage collection.
`juicefs gc <META-URL> --delete` cleans up leaked objects and pending deletions.

Edits and overwrites leave stale slices in object storage for the same
retention period. These slices are not visible under */jfs/.trash* and can
make backing-store usage exceed the logical usage reported by `df /jfs`.
Use `juicefs status <META-URL> --more` to inspect *Trash Files* and *Trash
Slices*, and monitor the backing file system separately with `df /mnt/zoned`.
Size free-space headroom for the workload's retention and cleanup needs.
The [JuiceFS trash documentation](https://juicefs.com/docs/community/security/trash#gc)
describes stale-slice cleanup.

### XFS Tuning

*JuiceFS* uploads up to `--max-uploads` objects concurrently, 20 by default.
*XFS* assigns concurrent writes to separate zones up to its open-zone limit.
Check the *max_open_zones* sysfs attribute; use the *max_open_zones* mount
option to lower the limit if needed:

```plaintext
# cat /sys/fs/xfs/sda/zoned/max_open_zones
14
```

To start reclaiming partially valid zones earlier, raise *zonegc_low_space*,
the percentage of free space *XFS* tries to keep available for writes:

```plaintext
# cat /sys/fs/xfs/sda/zoned/zonegc_low_space
0
# echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
```

Refer to the [*XFS* tuning section](/docs/filesystems/xfs#tuning) for details.

### Local Cache

The read cache works on zoned *XFS*. `--cache-dir` sets its location;
`--cache-size` and `--free-space-ratio` control space usage. Cached blocks are
written once and deleted on eviction.

With `--writeback`, new blocks are staged in the cache before upload. They
cannot be evicted until uploaded, so size the cache for pending writes. See
[Writeback Cache Fills Up](#writeback-cache-fills-up).

## Troubleshooting

### Writes Fail With Input/Output Errors When the Zoned Drive Is Full

When the zoned *XFS* file system holding the object storage runs out of space,
the *JuiceFS* client log shows upload failures such as:

```plaintext
<ERROR>: upload inode: 610 chunk: 924 (length: 67108864) fail: (max tries) upload block chunks/0/0/924_10_4194304: write /mnt/zoned/juicefs/myjfs/chunks/0/0/.jfs.924_10_4194304.tmp.7656557550574095303: no space left on device (after 11 tries) [flushData@writer.go:123]
<WARNING>: write inode:610 error: input/output error [commitThread@writer.go:219]
```

In the full-drive test, the application blocked for several minutes during
upload retries, then received `Input/output error`. The underlying failure
was *XFS* returning `ENOSPC`. The client could not be unmounted cleanly; the
partially written file retained its blocks until the client was killed and
its stale session expired.

Set `--capacity` below the backing file system size to limit logical usage
(see [Step 3](#step-3-create-the-juicefs-file-system)). When that limit is
reached, *JuiceFS* returns `No space left on device`, as shown below. This
does not prevent the backing file system from filling first: stale slices
from overwrites can consume space beyond the logical usage.

Monitor `df /mnt/zoned` and the *Trash Files* and *Trash Slices* fields in
`juicefs status <META-URL> --more`. Allow space for retention, pending
deletions and garbage collection; see
[Deleted Data, Trash and Space Reclaim](#deleted-data-trash-and-space-reclaim).

```plaintext
# dd if=/dev/zero of=/jfs/big.bin bs=4M count=4000
dd: error writing '/jfs/big.bin': No space left on device
dd: closing output file '/jfs/big.bin': No space left on device
```

### Writeback Cache Fills Up

With `--writeback`, failed uploads leave staged blocks in the cache regardless
of `--cache-size`. The client logs `Upload list is too full` and
`space not enough on device, upload it directly`. Check free space in the
object store and size the cache for the expected volume of pending writes.

### Space Is Not Freed After Deleting Files

Check */jfs/.trash* and the `TrashDays` setting in `juicefs status <META-URL>`.
Deleted data remains on *XFS* until retention expires and cleanup removes its
objects. `juicefs gc <META-URL> --delete` removes leaked objects and pending
deletions. Stale slices from overwrites also consume space; see
[Deleted Data, Trash and Space Reclaim](#deleted-data-trash-and-space-reclaim).

## Learn More

- [*JuiceFS* Community Edition documentation](https://juicefs.com/docs/community/introduction/)
- [*JuiceFS* standalone quick start](https://juicefs.com/docs/community/getting-started/standalone)
- [How to set up object storage](https://juicefs.com/docs/community/reference/how_to_set_up_object_storage)
- [Cache](https://juicefs.com/docs/community/guide/cache)
- [Mount *JuiceFS* at boot time](https://juicefs.com/docs/community/mount_juicefs_at_boot_time)
- [*XFS* zoned storage support](/docs/filesystems/xfs)
- [MinIO on Zoned Storage](/docs/howtos/minio)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
