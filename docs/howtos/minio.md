---
id: minio
title: MinIO on Zoned Storage
sidebar_label: MinIO
---

# MinIO on Zoned Storage

*MinIO* is an S3-compatible object storage server. Each configured drive is a
local file system. Objects are stored in directories containing an *xl.meta*
metadata file and, for larger objects, *part.N* data files.

Use one [zoned *XFS*](/docs/filesystems/xfs) file system per host-managed SMR
disk or NVMe ZNS namespace. *XFS* handles sequential zone writes and space
reclamation. *MinIO* uses its standard file I/O and needs no zoned-device
support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *MinIO* community edition server and *mc* client built from source with Go
  1.24 or newer (tested: *minio* module version
  v0.0.0-20260212201848-7aac2a2c5b7c and *mc* module version
  v0.0.0-20251106162529-77f82e18b540, both built with Go 1.26.10, on Linux
  6.17 with xfsprogs 6.19)
:::

:::note
The *MinIO* community edition repositories are archived. Community binaries
(*dl.min.io/server/minio/...*) and container images are no longer published.
Build the server and client from source, as described in the
[*MinIO* README](https://github.com/minio/minio#install-from-source).

Binaries under *dl.min.io/aistor/...* are the commercial *MinIO AIStor* edition
and require a license for S3 operations.
:::

## How It Fits Together

The *minio server* process stores object data and internal state on the
configured drive paths:

- **Object data and metadata**: `<drive>/<bucket>/<object>/xl.meta` and
  `<drive>/<bucket>/<object>/<data-dir>/part.N`. Small objects are inlined into
  *xl.meta*.
- **Internal state**: `<drive>/.minio.sys/` holds the drive format, bucket and
  IAM configuration, temporary upload files and the *.trash* directory of
  deleted objects.

*MinIO* does not use a separate metadata database. *XFS* keeps its own
metadata (inodes and directories) in the drive's conventional zones for SMR,
or on a separate conventional device for NVMe ZNS. File contents, including
*MinIO*'s *xl.meta* files, use sequential zones.

*MinIO* recommends one *XFS* file system per physical drive, without RAID or
LVM. With four or more drives, erasure coding splits objects into data and
parity shards, with one shard per drive. Mount each SMR disk or ZNS namespace
at a separate path, such as */mnt/disk1* and */mnt/disk2*.

## Quick Start: Single Drive

### Step 1: Prepare a Zoned XFS File System

For an SMR disk with conventional zones, format the whole disk and assign a
label for persistent mounts. Most host-managed SMR disks have conventional
zones.

```plaintext
# mkfs.xfs -L MINIODRIVE1 /dev/sda
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
# mkdir -p /mnt/disk1
# mount -o noatime LABEL=MINIODRIVE1 /mnt/disk1
```

The *zoned=1* field identifies a zoned realtime device. At mount time, *XFS*
reports the number of zones and the open-zone limit:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem e41c5cde-37dd-42bc-aab6-cdc4c78cd371
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

A ZNS namespace has no conventional zones. Place *XFS* metadata on a
conventional block device, such as a conventional namespace or SSD partition.
Specify the ZNS namespace as the realtime device when formatting and mounting:

```plaintext
# mkfs.xfs -L MINIODRIVE1 -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mount -o noatime,rtdev=/dev/nvme0n2 LABEL=MINIODRIVE1 /mnt/disk1
```

See [XFS](/docs/filesystems/xfs#usage) for details on both cases.

:::tip
For emulated hardware, create a *zloop* device as described in
[Zoned Block Device Emulation](/docs/getting-started/zbd-emulation) and use it
in place of */dev/sda*. The examples used *zloop* devices with 256 MiB zones
and four conventional zones.
:::

Mount every drive at a consistent path. Add label-based entries to
*/etc/fstab* to mount them at boot:

```plaintext
LABEL=MINIODRIVE1  /mnt/disk1  xfs  defaults,noatime  0  2
```

For an NVMe ZNS drive, add the realtime device to the mount options:

```plaintext
LABEL=MINIODRIVE1  /mnt/disk1  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0  2
```

:::note
NVMe device names are not guaranteed to be stable across reboots. Prefer a
persistent name such as */dev/disk/by-id/nvme-...* for the *rtdev=* option.
:::

### Step 2: Install MinIO

Build the *minio* server and *mc* client with Go 1.24 or newer. With Go 1.21 or
later, *GOTOOLCHAIN=auto* downloads a newer toolchain if required.

```plaintext
$ GOTOOLCHAIN=auto go install github.com/minio/minio@latest
$ GOTOOLCHAIN=auto go install github.com/minio/mc@latest
$ ~/go/bin/minio --version
minio version DEVELOPMENT.GOGET (commit-id=DEVELOPMENT.GOGET)
Runtime: go1.26.10 linux/amd64
License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
Copyright: 2015-0000 MinIO, Inc.
```

By default, *go install* writes binaries to *~/go/bin*. Replace *user* below
with the build account. Install the binaries, create the *minio-user* service
account and give it ownership of the mount point:

```plaintext
# install -m 755 ~user/go/bin/minio ~user/go/bin/mc /usr/local/bin/
# groupadd -r minio-user
# useradd -M -r -g minio-user minio-user
# chown minio-user:minio-user /mnt/disk1
```

### Step 3: Configure MinIO

Create the environment file */etc/default/minio*, pointing *MINIO_VOLUMES* at
the zoned *XFS* mount. Choose your own root credentials.

```plaintext
MINIO_ROOT_USER=myminioadmin
MINIO_ROOT_PASSWORD=minio-secret-key-change-me
MINIO_VOLUMES="/mnt/disk1"
MINIO_OPTS="--console-address :9001"
```

Create */usr/lib/systemd/system/minio.service* from the unit file in the
[*MinIO* documentation](https://github.com/minio/docs/blob/main/source/includes/linux/common-installation.rst).
It runs `/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES` as
*minio-user*, using */etc/default/minio* as its environment file.

### Step 4: Start MinIO and Verify

Start the service:

```plaintext
# systemctl enable --now minio.service
```

For a foreground test instead of the service, run the server as a user that
owns */mnt/disk1*:

```plaintext
$ MINIO_ROOT_USER=myminioadmin MINIO_ROOT_PASSWORD=minio-secret-key-change-me \
    minio server /mnt/disk1 --console-address :9001
INFO: Formatting 1st pool, 1 set(s), 1 drives per set.
INFO: WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2026 MinIO, Inc.
License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
Version: DEVELOPMENT.GOGET (go1.26.10 linux/amd64)

API: http://127.0.0.1:9000
WebUI: http://127.0.0.1:9001

Docs: https://docs.min.io
```

Configure the *mc* client with an alias for the server, then create a bucket
and upload a test object:

```plaintext
$ mc alias set zoned http://127.0.0.1:9000 myminioadmin minio-secret-key-change-me
Added `zoned` successfully.
$ mc mb zoned/mybucket
Bucket created successfully `zoned/mybucket`.
$ dd if=/dev/urandom of=obj.bin bs=1M count=256
$ mc cp obj.bin zoned/mybucket/
`obj.bin` -> `zoned/mybucket/obj.bin`
┌────────────┬─────────────┬──────────┬──────────────┐
│ Total      │ Transferred │ Duration │ Speed        │
│ 256.00 MiB │ 256.00 MiB  │ 00m00s   │ 764.21 MiB/s │
└────────────┴─────────────┴──────────┴──────────────┘
$ mc ls zoned/mybucket
[2026-11-03 14:32:03 CET] 256MiB STANDARD obj.bin
```

Download the object and compare SHA-256 checksums:

```plaintext
$ mc cp zoned/mybucket/obj.bin obj.down
$ sha256sum obj.bin obj.down
c787ca7ed588d094192cb27241d2900b5ca8034608298ec8641eca298ceac0b4  obj.bin
c787ca7ed588d094192cb27241d2900b5ca8034608298ec8641eca298ceac0b4  obj.down
$ mc admin info zoned
●  127.0.0.1:9000
   Uptime: 5 seconds
   Version: <development>
   Network: 1/1 OK
   Drives: 1/1 OK
   Pool: 1

┌──────┬──────────────────────┬─────────────────────┬──────────────┐
│ Pool │ Drives Usage         │ Erasure stripe size │ Erasure sets │
│ 1st  │ 1.8% (total: 14 GiB) │ 1                   │ 1            │
└──────┴──────────────────────┴─────────────────────┴──────────────┘

1 drive online, 0 drives offline, EC:0
```

Check that the object files use sequential zones. The *XFS* *realtime* flag
(*r*) identifies files on the realtime device. On zoned *XFS*, each realtime
group (*RG*) maps to a zone; *xfs_bmap* shows the extent locations in
*RT-BLOCK-RANGE*:

```plaintext
# cd /mnt/disk1
# find mybucket | head -4
mybucket
mybucket/obj.bin
mybucket/obj.bin/8d8dbe90-3d19-4058-83c4-6341caac0f5d
mybucket/obj.bin/8d8dbe90-3d19-4058-83c4-6341caac0f5d/part.2
# xfs_io -c lsattr mybucket/obj.bin/xl.meta mybucket/obj.bin/*/part.1
r---------------X mybucket/obj.bin/xl.meta
r---------------X mybucket/obj.bin/8d8dbe90-3d19-4058-83c4-6341caac0f5d/part.1
# xfs_bmap -v mybucket/obj.bin/*/part.1
mybucket/obj.bin/8d8dbe90-3d19-4058-83c4-6341caac0f5d/part.1:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..32775]:      6815744..6848519  9 (0..32775)       32776
```

The write pointers also advanced in the zones used by *XFS*:

```plaintext
# blkzone report /dev/sda | sed -n 5,9p
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x010018 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x008018 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x008028 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0x008018 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
```

## Multi-Drive Deployment with Erasure Coding

For production, *MinIO* recommends at least four drives, each with its own
*XFS* file system. Use one zoned *XFS* file system per SMR disk or ZNS
namespace to enable erasure coding across the drives.

### Step 1: Format and Mount the Drives

```plaintext
# mkfs.xfs -L MINIODRIVE1 /dev/sda
# mkfs.xfs -L MINIODRIVE2 /dev/sdb
# mkfs.xfs -L MINIODRIVE3 /dev/sdc
# mkfs.xfs -L MINIODRIVE4 /dev/sdd
# mkdir -p /mnt/disk{1..4}
# for i in 1 2 3 4; do mount -o noatime LABEL=MINIODRIVE$i /mnt/disk$i; done
# chown minio-user:minio-user /mnt/disk{1..4}
# findmnt -t xfs -o SOURCE,TARGET,OPTIONS
SOURCE   TARGET     OPTIONS
/dev/sda /mnt/disk1 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdb /mnt/disk2 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdc /mnt/disk3 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdd /mnt/disk4 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
```

Add one */etc/fstab* entry per drive:

```plaintext
LABEL=MINIODRIVE1  /mnt/disk1  xfs  defaults,noatime  0  2
LABEL=MINIODRIVE2  /mnt/disk2  xfs  defaults,noatime  0  2
LABEL=MINIODRIVE3  /mnt/disk3  xfs  defaults,noatime  0  2
LABEL=MINIODRIVE4  /mnt/disk4  xfs  defaults,noatime  0  2
```

### Step 2: Configure and Start MinIO

Use *MinIO*'s expansion notation in */etc/default/minio* to list the drives:

```plaintext
MINIO_ROOT_USER=myminioadmin
MINIO_ROOT_PASSWORD=minio-secret-key-change-me
MINIO_VOLUMES="/mnt/disk{1...4}"
MINIO_OPTS="--console-address :9001"
```

All drives must be empty on first start. Run `systemctl restart minio.service`
to initialize them as a four-drive erasure set:

```plaintext
INFO: Formatting 1st pool, 1 set(s), 4 drives per set.
INFO: WARNING: Host local has more than 2 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
...
```

### Step 3: Verify

```plaintext
$ mc mb zoned/mybucket
Bucket created successfully `zoned/mybucket`.
$ mc cp obj.bin zoned/mybucket/
$ mc cat zoned/mybucket/obj.bin | sha256sum
c787ca7ed588d094192cb27241d2900b5ca8034608298ec8641eca298ceac0b4  -
$ mc admin info zoned
●  127.0.0.1:9000
   Uptime: 11 seconds
   Version: <development>
   Network: 1/1 OK
   Drives: 4/4 OK
   Pool: 1

┌──────┬──────────────────────┬─────────────────────┬──────────────┐
│ Pool │ Drives Usage         │ Erasure stripe size │ Erasure sets │
│ 1st  │ 0.9% (total: 28 GiB) │ 4                   │ 1            │
└──────┴──────────────────────┴─────────────────────┴──────────────┘

4 drives online, 0 drives offline, EC:2
```

The *EC:2* output indicates two data shards and two parity shards. Each drive
holds one shard of each object part. In this example, the *part.N* files are
about 8 MiB each. Check the realtime flag and extent mapping on each drive:

```plaintext
# for d in /mnt/disk{1..4}; do xfs_io -c lsattr $d/mybucket/obj.bin/*/part.1; done
r---------------X /mnt/disk1/mybucket/obj.bin/adc059c1-c4f7-42b6-8eff-1e996ba2e000/part.1
r---------------X /mnt/disk2/mybucket/obj.bin/adc059c1-c4f7-42b6-8eff-1e996ba2e000/part.1
r---------------X /mnt/disk3/mybucket/obj.bin/adc059c1-c4f7-42b6-8eff-1e996ba2e000/part.1
r---------------X /mnt/disk4/mybucket/obj.bin/adc059c1-c4f7-42b6-8eff-1e996ba2e000/part.1
# xfs_bmap -v /mnt/disk3/mybucket/obj.bin/*/part.1
/mnt/disk3/mybucket/obj.bin/adc059c1-c4f7-42b6-8eff-1e996ba2e000/part.1:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..16391]:      6291456..6307847  8 (0..16391)       16392
```

### Replacing a Drive

Format the replacement zoned drive with the original label and mount it at
the same path. Restart *MinIO* to rebuild the missing shards. In the test, a
reformatted drive was rebuilt automatically after a restart, and the object
remained readable from the other three drives:

```plaintext
Healing drive '/mnt/disk2' - 'mc admin heal alias/ --verbose' to check the current status.
Healing drive '/mnt/disk2' - use 4 parallel workers.
Healing of drive '/mnt/disk2' is finished (healed: 2, skipped: 0).
```

## MinIO Drive Requirements on Zoned XFS

The tested configuration met the following requirements from *MinIO*'s
[hardware checklist](https://github.com/minio/docs/blob/main/source/operations/checklists/hardware.rst):

- **XFS file system**: *MinIO* recognizes zoned *XFS* as *XFS* and accepts it
  without a warning.
- **Direct I/O**: multi-drive deployments write *part.N* shard files with
  *O_DIRECT*, followed by *fdatasync()*. *MinIO* skips its *O_DIRECT* self-test
  for *XFS*, which supports direct I/O on zoned devices. Tracing the server's
  *openat(O_DIRECT)* calls confirmed this in the test. Single-drive deployments
  do not use *O_DIRECT*.
- **One drive per mount, no RAID/LVM**: each zoned drive has its own *XFS*
  file system.
- **Label-based mounts**: *mkfs.xfs -L* and *LABEL=* mounts work for zoned
  *XFS*. For NVMe ZNS, the label belongs to the main (metadata) device, and the
  zoned namespace is given with the *rtdev=* mount option.

*MinIO* does not use *fallocate()* preallocation or reflink copies for its data
files, so the [zoned XFS limitations](/docs/filesystems/xfs#limitations) on
these features do not affect it.

## Production Notes

- **One file system per drive.** Use one zoned *XFS* file system per SMR disk
  or ZNS namespace and let *MinIO* erasure coding provide redundancy across
  drives. Use the same number and size of drives per server, as recommended by
  *MinIO*.

- **Open zones.** *XFS* limits simultaneous writes to one fewer than the
  device's maximum number of open zones (see
  `/sys/fs/xfs/<dev>/zoned/max_open_zones`). Concurrent uploads produce
  concurrent shard writes on each drive. For SMR disks, reducing
  *max_open_zones* can improve throughput. See
  [XFS tuning](/docs/filesystems/xfs#tuning).

- **Space reclaim after deletes.** *MinIO* moves deleted objects to
  `<drive>/.minio.sys/tmp/.trash/` and removes them in the background. In the
  tests, space was reclaimed after about five minutes, the default cleanup
  interval. *XFS* then reset the empty zones. Usage reported by *df* does not
  drop immediately after deletion.

- **Running full.** *MinIO* refuses uploads when a drive reaches its minimum
  free-space threshold. In a four-drive test, repeated fills, deletions and
  rewrites exercised *XFS* garbage collection. All 108 remaining objects
  passed checksum verification. For workloads with frequent deletes and
  overwrites, raising *zonegc_low_space* starts garbage collection earlier:

  ```plaintext
  # echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
  ```

- **XFS retry on error.** *MinIO* recommends setting *XFS* *max_retries* to 0
  for the *EIO*, *ENOSPC* and *default* metadata error classes. This reports
  errors to *MinIO* rather than retrying indefinitely. The settings are also
  available on zoned *XFS*:

  ```plaintext
  # for c in EIO ENOSPC default; do echo 0 > /sys/fs/xfs/sda/error/metadata/$c/max_retries; done
  # cat /sys/fs/xfs/sda/error/metadata/{EIO,ENOSPC,default}/max_retries
  0
  0
  0
  ```

## Troubleshooting

- **Downloads from *dl.min.io/server/...* return "410 Gone".** The community
  edition binaries are no longer distributed. Build *minio* and *mc* from source
  as shown in [Step 2](#step-2-install-minio).

- **"No valid license found, running in offline mode. All S3 operations are
  denied."** You are running the commercial *MinIO AIStor* binary (downloaded
  from *dl.min.io/aistor/...*), which requires a license. Use the community
  edition built from source, or install an *AIStor* license.

- **"Storage backend has reached its minimum free drive threshold."** A drive
  has reached *MinIO*'s free-space threshold. Delete objects and wait for the
  background trash cleanup before writing again.

- **Files not on the zoned device.** If *xfs_io -c lsattr* does not show the
  *r* flag for *part.N* files, check that the drive was formatted with
  *zoned=1* in the *mkfs.xfs* output and that the *rtinherit* (*t*) flag is set
  on the mount point directory (*xfs_io -c lsattr /mnt/disk1*).

## Learn More

- [MinIO source repository and README](https://github.com/minio/minio)
- [MinIO documentation sources](https://github.com/minio/docs)
- [MinIO client (mc)](https://github.com/minio/mc)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
