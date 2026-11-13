---
id: rustfs
title: RustFS on Zoned Storage
sidebar_label: RustFS
---

# RustFS on Zoned Storage

*RustFS* is an S3-compatible object storage server written in Rust. Each
configured drive is a directory on a local file system. *RustFS* stores each
object in a directory with an *xl.meta* metadata file. Larger objects also
have *part.N* data files. With four or more drives, *RustFS* erasure-codes
each object across the drives.

Use one [zoned *XFS*](/docs/filesystems/xfs) file system per host-managed SMR
disk or NVMe ZNS namespace. *XFS* stores object files, including *xl.meta*,
in sequential zones and keeps its own metadata in conventional zones (SMR) or
on a separate conventional device (ZNS). *XFS* handles sequential zone writes
and space reclamation. *RustFS* uses regular file I/O and needs no zoned
storage support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *RustFS* 1.0.4 (tested with the official *rustfs-linux-x86_64-musl* binary
  and the *rustfs/rustfs* container image, both version 1.0.4)
- Tested on Linux 6.17.7 with xfsprogs 6.19, *aws-cli* 2.39.3 and the
  *RustFS* *rc* client 0.1.37
:::

## How It Fits Together

A *RustFS* server stores all of its state on the drives listed in
*RUSTFS_VOLUMES*. It has no separate metadata database.

| Data | Location | Storage |
|------|----------|---------|
| Object metadata, small objects (inlined) | `<drive>/<bucket>/<object>/xl.meta` | zoned *XFS* |
| Object data | `<drive>/<bucket>/<object>/<data-dir>/part.N` and `part.N.meta` | zoned *XFS* |
| Format, configuration, IAM, bucket metadata | `<drive>/.rustfs.sys/` | zoned *XFS* |
| Uploads in progress, deleted objects | `<drive>/.rustfs.sys/tmp/` and `<drive>/.rustfs.sys/tmp/.trash/` | zoned *XFS* |
| *XFS* metadata (inodes, directories, log) | SMR conventional zones or ZNS metadata device | conventional |
| *RustFS* binary and logs | for example */usr/local/bin*, */var/log/rustfs* | conventional |

*RustFS* writes new objects to *.rustfs.sys/tmp/* and renames them into the
bucket directory. Both paths are on the same file system, so the data stays on
the zoned device.

The *RustFS* documentation recommends *XFS* for all data drives and JBOD
operation: one file system per physical drive, without hardware RAID. Mount
each SMR disk or ZNS namespace at a separate path, such as */data/rustfs0* and
*/data/rustfs1*.

## Quick Start: Single Drive

These steps run *RustFS* with one zoned drive. Run commands prefixed with `#`
as root and commands prefixed with `$` as a regular user.

### Step 1: Prepare a Zoned XFS File System

For an SMR disk with conventional zones, format the whole disk and assign a
label for persistent mounts:

```plaintext
# mkfs.xfs -L RUSTFS0 /dev/sda
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
# mkdir -p /data/rustfs0
# mount -o noatime LABEL=RUSTFS0 /data/rustfs0
```

The *RustFS* documentation suggests `-i size=512 -n ftype=1`. Both are
already the *mkfs.xfs* defaults, as shown by *isize=512* and *ftype=1* above.
The *zoned=1* field identifies a zoned realtime device. At mount time, the
kernel log reports the number of zones and the open-zone limit:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem 65786f4a-f12c-41bf-a038-00592465bcd3
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

A ZNS namespace has no conventional zones. Place the *XFS* metadata on a
conventional block device, such as a conventional namespace or an SSD
partition, and specify the ZNS namespace as the realtime device:

```plaintext
# mkfs.xfs -L RUSTFS0 -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mount -o noatime,rtdev=/dev/nvme0n2 LABEL=RUSTFS0 /data/rustfs0
```

The ZNS commands were not tested for this guide. See
[XFS](/docs/filesystems/xfs#usage) for details on both cases.

:::tip
To try this setup without a zoned drive, create an emulated device with
*zloop* as described in
[Zoned Block Device Emulation](/docs/getting-started/zbd-emulation) and use it
in place of */dev/sda*. This guide was tested with 16 GiB *zloop* devices with
256 MiB zones and four conventional zones.
:::

To mount the file system at boot, add a label-based entry to */etc/fstab*:

```plaintext
LABEL=RUSTFS0  /data/rustfs0  xfs  defaults,noatime  0  0
```

For an NVMe ZNS drive, add the realtime device to the mount options. Prefer a
persistent name such as */dev/disk/by-id/nvme-...* for *rtdev=*:

```plaintext
LABEL=RUSTFS0  /data/rustfs0  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0  0
```

The */etc/fstab* entries were not tested; the test mounted the file systems
manually with the same options.

### Step 2: Install RustFS

Download the official binary:

```plaintext
$ wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
$ unzip rustfs-linux-x86_64-musl-latest.zip
$ ./rustfs --version
rustfs 1.0.4
build time   : 2026-10-25 13:46:05 +00:00
build profile: release
build os     : linux-x86_64
build target : x86_64-unknown-linux-musl
...
# install -m 755 rustfs /usr/local/bin/
```

To run *RustFS* as a dedicated user instead of root, create the account and
give it ownership of the mount point:

```plaintext
# groupadd -r rustfs-user
# useradd -M -r -g rustfs-user rustfs-user
# chown rustfs-user:rustfs-user /data/rustfs0
```

### Step 3: Configure RustFS

Create the environment file */etc/default/rustfs*. Point *RUSTFS_VOLUMES* at
the zoned *XFS* mount and choose your own credentials:

```plaintext
RUSTFS_ACCESS_KEY=myrustfsadmin
RUSTFS_SECRET_KEY=rustfs-secret-key-change-me
RUSTFS_VOLUMES="/data/rustfs0"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
```

Create */etc/systemd/system/rustfs.service* from the unit file in the
[*RustFS* Linux prerequisites](https://docs.rustfs.com/en/installation/linux/prerequisites-and-service#configure-the-systemd-service).
It runs `/usr/local/bin/rustfs $RUSTFS_VOLUMES` with */etc/default/rustfs* as
its environment file and sets `LimitNOFILE=1048576`. If you created
*rustfs-user*, change *User* and *Group* in the unit. The systemd unit was not
tested for this guide.

### Step 4: Start RustFS

Start the service:

```plaintext
# mkdir -p /var/log/rustfs
# systemctl daemon-reload
# systemctl enable --now rustfs.service
```

The test ran the server in the foreground instead, as root with logging to
standard output. The JSON log lines are trimmed here:

```plaintext
# RUSTFS_ACCESS_KEY=myrustfsadmin RUSTFS_SECRET_KEY=rustfs-secret-key-change-me \
    RUSTFS_ADDRESS=:9000 RUSTFS_CONSOLE_ENABLE=true RUSTFS_CONSOLE_ADDRESS=:9001 \
    RUSTFS_OBS_LOGGER_LEVEL=info rustfs server /data/rustfs0
...
{"level":"INFO","message":"Starting RustFS server",...,"server_address":"[::]:9000",...,"version":"refs/tags/1.0.4",...}
{"level":"INFO","message":"Formatting storage pool",...,"pool_id":1,"set_count":1,"drives_per_set":1,...}
{"level":"INFO","message":"Startup endpoints ready",...,"localhost_endpoint":"http://127.0.0.1:9000",...}
{"level":"INFO","message":"Storage durability mode resolved",...,"mode":"strict",...}
...
```

### Step 5: Write and Read Data

Any S3 client works. These examples use the *AWS CLI* with path-style access
to the local endpoint. The test ran the *amazon/aws-cli* container with host
networking.

```plaintext
$ export AWS_ACCESS_KEY_ID=myrustfsadmin
$ export AWS_SECRET_ACCESS_KEY=rustfs-secret-key-change-me
$ export AWS_DEFAULT_REGION=us-east-1
$ aws --endpoint-url http://127.0.0.1:9000 s3 mb s3://mybucket
make_bucket: mybucket
$ dd if=/dev/urandom of=obj.bin bs=1M count=256
$ dd if=/dev/urandom of=small.bin bs=1K count=64
$ aws --endpoint-url http://127.0.0.1:9000 s3 cp obj.bin s3://mybucket/
upload: ./obj.bin to s3://mybucket/obj.bin
$ aws --endpoint-url http://127.0.0.1:9000 s3 cp small.bin s3://mybucket/
upload: ./small.bin to s3://mybucket/small.bin
$ aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://mybucket
2026-11-03 15:06:09  268435456 obj.bin
2026-11-03 15:06:10      65536 small.bin
```

Download the object and compare SHA-256 checksums:

```plaintext
$ aws --endpoint-url http://127.0.0.1:9000 s3 cp s3://mybucket/obj.bin obj.down
download: s3://mybucket/obj.bin to ./obj.down
$ sha256sum obj.bin obj.down
c0255823bdb3cb8fccfb9910919ae60b6db7a0b5d759a4d728ee5bcbfb13edaa  obj.bin
c0255823bdb3cb8fccfb9910919ae60b6db7a0b5d759a4d728ee5bcbfb13edaa  obj.down
```

### Step 6: Verify the Data Is on the Zoned Device

The *AWS CLI* uploaded the 256 MiB object as a multipart upload with 8 MiB
parts. *RustFS* stored each part as a *part.N* file with a small
*part.N.meta* file. The 64 KiB object has no part files; its data is inlined
in *xl.meta*:

```plaintext
# cd /data/rustfs0
# ls -l mybucket/obj.bin mybucket/obj.bin/*/
mybucket/obj.bin:
total 8
drwxr-xr-x 2 root root   4096 Nov  3 16:06 c73c1b87-674c-4310-9ebd-c0ff925350b3
-rw-r--r-- 1 root root   2869 Nov  3 16:06 xl.meta

mybucket/obj.bin/c73c1b87-674c-4310-9ebd-c0ff925350b3/:
total 262404
-rw-r--r-- 1 root root 8388864 Nov  3 16:06 part.1
...
```

The *XFS* realtime flag (*r*) identifies files on the realtime (zoned)
device. The root directory has the *rtinherit* flag (*t*), which new files
inherit:

```plaintext
# xfs_io -c lsattr . mybucket/obj.bin/xl.meta mybucket/obj.bin/*/part.1 \
    mybucket/obj.bin/*/part.1.meta mybucket/small.bin/xl.meta
-------t--------- .
r---------------X mybucket/obj.bin/xl.meta
r---------------X mybucket/obj.bin/c73c1b87-674c-4310-9ebd-c0ff925350b3/part.1
r---------------X mybucket/obj.bin/c73c1b87-674c-4310-9ebd-c0ff925350b3/part.1.meta
r---------------X mybucket/small.bin/xl.meta
```

On zoned *XFS*, each realtime group (*RG*) maps to one zone. *xfs_bmap*
shows the extent locations in *RT-BLOCK-RANGE*, in 512-byte units:

```plaintext
# xfs_bmap -v mybucket/obj.bin/*/part.1 mybucket/small.bin/xl.meta
mybucket/obj.bin/c73c1b87-674c-4310-9ebd-c0ff925350b3/part.1:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..16391]:      8912912..8929303 13 (16..16407)      16392
mybucket/small.bin/xl.meta:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..135]:        6815776..6815911  9 (32..167)          136
```

The write pointers advanced in the sequential zones used by *XFS*:

```plaintext
# blkzone report /dev/sda | sed -n 5,10p
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x020098 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x01c098 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x010080 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0x014080 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000480000, len 0x080000, cap 0x080000, wptr 0x01c0b0 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
```

## Multi-Drive Deployment with Erasure Coding

With four or more drives, *RustFS* forms an erasure set and stores one shard
of each object part per drive. The test used four zoned drives and the
*rustfs/rustfs* container image.

### Step 1: Format and Mount the Drives

```plaintext
# mkfs.xfs -L RUSTFS0 /dev/sda
# mkfs.xfs -L RUSTFS1 /dev/sdb
# mkfs.xfs -L RUSTFS2 /dev/sdc
# mkfs.xfs -L RUSTFS3 /dev/sdd
# mkdir -p /data/rustfs{0..3}
# for i in 0 1 2 3; do mount -o noatime LABEL=RUSTFS$i /data/rustfs$i; done
# findmnt -t xfs -o SOURCE,TARGET,OPTIONS
SOURCE   TARGET         OPTIONS
/dev/sda /data/rustfs0  rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdb /data/rustfs1  rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdc /data/rustfs2  rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdd /data/rustfs3  rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
```

Add one */etc/fstab* entry per drive:

```plaintext
LABEL=RUSTFS0  /data/rustfs0  xfs  defaults,noatime  0  0
LABEL=RUSTFS1  /data/rustfs1  xfs  defaults,noatime  0  0
LABEL=RUSTFS2  /data/rustfs2  xfs  defaults,noatime  0  0
LABEL=RUSTFS3  /data/rustfs3  xfs  defaults,noatime  0  0
```

### Step 2: Configure and Start RustFS

For the systemd service, list the drives with *RustFS*'s brace expansion in
*/etc/default/rustfs* and restart the service:

```plaintext
RUSTFS_VOLUMES="/data/rustfs{0...3}"
```

The test ran the container image instead. The container runs as user ID
10001, so that user must own the mount points. All drives must be empty on
first start.

```plaintext
# chown 10001:10001 /data/rustfs{0..3}
# mkdir -p /var/log/rustfs && chown 10001:10001 /var/log/rustfs
# docker run -d --name rustfs -p 9000:9000 -p 9001:9001 \
    -v /data/rustfs0:/data/rustfs0 -v /data/rustfs1:/data/rustfs1 \
    -v /data/rustfs2:/data/rustfs2 -v /data/rustfs3:/data/rustfs3 \
    -v /var/log/rustfs:/var/log/rustfs \
    -e RUSTFS_ACCESS_KEY=myrustfsadmin \
    -e RUSTFS_SECRET_KEY=rustfs-secret-key-change-me \
    -e RUSTFS_VOLUMES='/data/rustfs{0...3}' \
    -e RUSTFS_ADDRESS=:9000 \
    -e RUSTFS_CONSOLE_ENABLE=true -e RUSTFS_CONSOLE_ADDRESS=:9001 \
    -e RUSTFS_OBS_LOGGER_LEVEL=info -e RUSTFS_OBS_LOG_DIRECTORY=/var/log/rustfs/ \
    rustfs/rustfs:latest
# docker logs rustfs
Initializing data directories: /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
Initializing log directory: /var/log/rustfs/
Starting: /usr/bin/rustfs  /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
```

The log file shows a single erasure set with four drives, each on its own
device:

```plaintext
{"level":"INFO","message":"Collected local endpoint disk-topology diagnostics ...","diagnostics":"path='/data/rustfs0', canonical='/data/rustfs0', st_dev='8:0', device_ids=[sda]; ...
{"level":"INFO","message":"Formatting storage pool",...,"pool_id":1,"set_count":1,"drives_per_set":4,...}
```

### Step 3: Verify

```plaintext
$ aws --endpoint-url http://127.0.0.1:9000 s3 mb s3://mybucket
make_bucket: mybucket
$ aws --endpoint-url http://127.0.0.1:9000 s3 cp obj.bin s3://mybucket/
upload: ./obj.bin to s3://mybucket/obj.bin
$ aws --endpoint-url http://127.0.0.1:9000 s3 cp s3://mybucket/obj.bin obj.down
download: s3://mybucket/obj.bin to ./obj.down
$ sha256sum obj.bin obj.down
c0255823bdb3cb8fccfb9910919ae60b6db7a0b5d759a4d728ee5bcbfb13edaa  obj.bin
c0255823bdb3cb8fccfb9910919ae60b6db7a0b5d759a4d728ee5bcbfb13edaa  obj.down
```

The *RustFS* [*rc* client](https://docs.rustfs.com/en/operations/rc) reports
the erasure-coding layout. With four drives, the default parity is 2:

```plaintext
$ rc alias set zoned http://127.0.0.1:9000 myrustfsadmin rustfs-secret-key-change-me
✓ Alias 'zoned' configured successfully.
$ rc admin info cluster zoned
Cluster Information  (online)
...
  RustFS Version: 2026-10-25T18:21:25+08:00@1.0.4
  Servers:       1
  Disks:         4 (4 online)
  Storage:       513.45 MiB / 56.00 GiB (0%)
  Buckets:       1
  Objects:       2

  Backend:       Erasure
  EC Parity:     2
...
```

With two data and two parity shards, each drive holds half of every part. The
*part.N* files on each drive are 4 MiB for the 8 MiB upload parts, and each
drive stores 128 MiB of the 256 MiB object. All shards are on the zoned
devices:

```plaintext
# for d in /data/rustfs{0..3}; do xfs_io -c lsattr $d/mybucket/obj.bin/*/part.1; done
r---------------X /data/rustfs0/mybucket/obj.bin/a1402594-557f-4099-bad8-12af00bed59a/part.1
r---------------X /data/rustfs1/mybucket/obj.bin/a1402594-557f-4099-bad8-12af00bed59a/part.1
r---------------X /data/rustfs2/mybucket/obj.bin/a1402594-557f-4099-bad8-12af00bed59a/part.1
r---------------X /data/rustfs3/mybucket/obj.bin/a1402594-557f-4099-bad8-12af00bed59a/part.1
# xfs_bmap -v /data/rustfs2/mybucket/obj.bin/*/part.1
/data/rustfs2/mybucket/obj.bin/a1402594-557f-4099-bad8-12af00bed59a/part.1:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..2047]:       5242912..5244959  6 (32..2079)        2048
   1: [2048..4095]:    5249056..5251103  6 (6176..8223)      2048
   2: [4096..8191]:    5244960..5249055  6 (2080..6175)      4096
   3: [8192..8199]:    5251104..5251111  6 (8224..8231)         8
```

### Replacing a Drive

Format the replacement zoned drive with the original label, mount it at the
same path and give the *RustFS* user ownership. In the test, the container
was stopped, one drive was reformatted and the container was started again.
*RustFS* detected the empty drive and rebuilt its shards:

```plaintext
{"level":"INFO","message":"renew_disk attached unformatted replacement and will trigger heal_disk, Endpoint { ... path: \"/data/rustfs1\", ... }",...}
{"level":"INFO","message":"Heal task completed","event":"heal_task_state",...,"heal_type":"erasure_set","state":"completed",...}
```

After healing, the rebuilt drive held the *part.N* files of all objects with
the *r* flag, and all objects passed checksum verification.

## RustFS I/O on Zoned XFS

The tests traced the *RustFS* 1.0.4 server with *strace* during uploads and
checked the source code of the same release:

- **No preallocation.** No *fallocate()* calls occurred, and the 1.0.4 source
  does not call *fallocate()*. The
  [zoned XFS limitation](/docs/filesystems/xfs#limitations) on persistent
  preallocation therefore does not affect *RustFS*, even though the *RustFS*
  file-system recommendations mention *fallocate*.
- **Buffered writes by default.** *part.N* files are created with
  `O_WRONLY|O_CREAT|O_TRUNC` (no *O_DIRECT*) in *.rustfs.sys/tmp/*, then
  flushed with *fdatasync()*/*fsync()* (durability mode *strict*, the
  default) and renamed into the bucket.
- **Optional direct I/O.** Setting `RUSTFS_OBJECT_DIRECT_IO_WRITE_ENABLE=true`
  makes *RustFS* create *part.N* files with *O_DIRECT*. In the four-drive test,
  shard files were written with *O_DIRECT* to the zoned devices, carried the
  *r* flag and passed checksum verification. The test also set
  `RUSTFS_OBJECT_DIRECT_IO_READ_ENABLE=true`, but no *O_DIRECT* reads were
  observed for the test objects. Both settings are off by default.
- **No reflink or quotas.** *RustFS* does not depend on reflink copies or
  *XFS* quotas.

## Production Notes

- **One file system per drive.** Use one zoned *XFS* file system per SMR disk
  or ZNS namespace, without RAID or LVM, and let *RustFS* erasure coding
  provide redundancy across drives.

- **Metadata stays on conventional storage only at the XFS level.** *RustFS*
  keeps its own configuration and object metadata (*xl.meta*,
  *.rustfs.sys/*) as files on the data drives, so they are written to
  sequential zones together with object data. Only *XFS* metadata uses
  conventional zones or the ZNS metadata device. Keep the operating system
  and *RustFS* logs (*RUSTFS_OBS_LOG_DIRECTORY*) on conventional storage.

- **Open zones.** *XFS* uses one fewer than the device's maximum open zones
  for file writes (*14* on the test devices, see
  `/sys/fs/xfs/<dev>/zoned/max_open_zones`). Concurrent uploads produce
  concurrent shard writes on each drive. For SMR disks, a lower
  *max_open_zones* mount option can improve throughput. See
  [XFS tuning](/docs/filesystems/xfs#tuning).

- **Space reclaim after deletes.** *RustFS* removes some deleted object
  files immediately and moves others to `<drive>/.rustfs.sys/tmp/.trash/`. A
  background task empties *.trash* every five minutes. In the single-drive
  test, deleting two 256 MiB objects freed 512 MiB immediately; the remaining
  256 MiB in *.trash* was freed at the next cleanup run. *XFS* resets zones
  that no longer hold valid data; partially valid zones are reclaimed by
  garbage collection when free space runs low.

- **Running full.** In the four-drive test, *RustFS* accepted uploads until
  the drives were 100% full; it did not stop at a free-space threshold. The
  upload that hit the full drives failed with HTTP 500. After half of the
  objects were deleted, the freed space was written again until the drives
  were full, which required *XFS* garbage collection of partially valid
  zones. All 107 remaining 256 MiB objects passed checksum verification.
  Leave free space on each drive for workloads with frequent deletes. To
  start garbage collection earlier, raise *zonegc_low_space*:

  ```plaintext
  # echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
  ```

- **Direct I/O.** Direct I/O is optional. If you enable
  `RUSTFS_OBJECT_DIRECT_IO_WRITE_ENABLE`, test it with your workload first;
  the tests here used a single server with emulated drives.

## Troubleshooting

- **Uploads fail with HTTP 500 when drives are full.** The client reports
  `AWS_ERROR_S3_INTERNAL_ERROR: Response code indicates internal server
  error`. The *RustFS* log shows:

  ```plaintext
  "message":"failed to shutdown erasure writers after write error: Custom { kind: StorageFull, ...
  "message":"Erasure encode write quorum unavailable: erasure write quorum (required=3, achieved=0, failed=4, total=4, ...
  ```

  The drives are out of space. Delete objects; space held in *.trash* is
  freed within five minutes.

- **"std fd cache disabled: RLIMIT_NOFILE soft limit too low for 512
  fds/disk; using open-per-read".** The process file descriptor limit is
  low. The systemd unit from the *RustFS* documentation sets
  `LimitNOFILE=1048576`. The foreground test ran with the default limit and
  logged this warning, without other effects in the test.

- **Permission denied with the container image.** The container runs as user
  ID 10001. Run `chown 10001:10001` on each mount point and on the log
  directory.

- **Files not on the zoned device.** If `xfs_io -c lsattr` does not show the
  *r* flag on *part.N* or *xl.meta* files, check that *mkfs.xfs* reported
  *zoned=1*, that *RUSTFS_VOLUMES* points to the zoned mount, and that the
  *rtinherit* (*t*) flag is set on the mount point
  (`xfs_io -c lsattr /data/rustfs0`). See
  [Placing Data on the Main Device](/docs/filesystems/xfs#placing-data-on-the-main-device).

## Learn More

- [RustFS documentation](https://docs.rustfs.com/en/)
- [RustFS Linux prerequisites and service setup](https://docs.rustfs.com/en/installation/linux/prerequisites-and-service)
- [RustFS Docker installation](https://docs.rustfs.com/en/installation/container/docker)
- [RustFS CLI client (rc)](https://docs.rustfs.com/en/operations/rc)
- [RustFS source repository](https://github.com/rustfs/rustfs)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
