---
id: garage
title: Garage on Zoned Storage
sidebar_label: Garage
---

# Garage on Zoned Storage

*Garage* is an S3-compatible object store developed by Deuxfleurs for
geo-distributed clusters of small servers. Each node splits uploaded objects
into blocks (1 MiB by default), compresses them with zstd and stores each block
as a separate file in its data directory. A metadata database (LMDB by
default, or SQLite) in a separate metadata directory holds buckets, keys, the
object index and block reference counts.

Put each data directory on a [zoned *XFS*](/docs/filesystems/xfs) file system,
one per host-managed SMR disk or NVMe ZNS namespace. Block files are written
once, renamed into place and later deleted, and *XFS* handles sequential zone
writes and space reclamation. The metadata directory belongs on conventional
storage, as the *Garage* documentation recommends an SSD for it. *Garage* uses
standard file I/O and needs no zoned-device support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *Garage* v2.5.0 (tested with the official static binary,
  *x86_64-unknown-linux-musl*), and an S3 client (tested with *aws-cli* 2.39.3
  from the *amazon/aws-cli* container image)
- Tested on kernel 6.17.7 with xfsprogs 6.19.0
:::

## How It Fits Together

A *Garage* node runs a single `garage server` process. The same binary is the
administration CLI (`garage status`, `garage layout`, `garage bucket`, ...).
Data is placed as follows:

| Component | Configuration key | Contents | Placement |
|-----------|-------------------|----------|-----------|
| Data blocks | `data_dir` | `<dir>/<xx>/<yy>/<hash>.zst` (compressed) or `<hash>` (uncompressed) block files | Zoned *XFS*, one file system per drive |
| Metadata | `metadata_dir` | node key, cluster layout, LMDB (`db.lmdb/`) or SQLite (`db.sqlite`) database | Conventional SSD |
| Metadata snapshots | `metadata_snapshots_dir` | copies of the metadata database (default: `<metadata_dir>/snapshots/`) | Conventional storage |

`data_dir` accepts either one path or a list of paths with capacities. With a
list, *Garage* assigns each of 1024 hash slices to one directory, in proportion
to the configured capacities, and writes each block to the directory of its
slice. Redundancy comes from replication across nodes
(`replication_factor`), not across the drives of one node.

*XFS* keeps its own metadata (inodes and directories) in the conventional zones
of an SMR disk, or on a separate conventional device for NVMe ZNS. The contents
of the block files use sequential zones.

```plaintext
          conventional SSD                    zoned drives (XFS)
     +-----------------------+    +----------------+  +----------------+
     | /var/lib/garage/meta  |    | /mnt/disk1     |  | /mnt/disk2     |
     |   db.lmdb/            |    |   garage/xx/yy |  |   garage/xx/yy |
     +-----------------------+    +----------------+  +----------------+
          metadata_dir                       data_dir (one entry per drive)
```

## Quick Start

These steps set up a single-node *Garage* instance with its data directory on
one zoned drive, then extend it to several drives. Run commands prefixed with
`#` as root and commands prefixed with `$` as the `garage` service account
created in Step 1, for example with `sudo -u garage`.

### Step 1: Prepare a Zoned XFS File System

Check the *XFS* [requirements](/docs/filesystems/xfs#system-requirements)
before formatting the drive.

For an SMR hard disk with conventional zones, format the whole disk and mount
it:

```plaintext
# mkfs.xfs -L GARAGEDATA1 /dev/sda
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
# mount -o noatime LABEL=GARAGEDATA1 /mnt/disk1
```

The *zoned=1* field identifies a zoned realtime device. The kernel log shows
the number of zones and the open-zone limit:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem 915e7289-91fa-4199-a9b7-d4a6153a4af7
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

An NVMe ZNS namespace has no conventional zones and needs a separate
conventional block device for *XFS* metadata, such as a conventional
namespace or an SSD partition. Specify the zoned namespace as the realtime
device:

```plaintext
# mkfs.xfs -L GARAGEDATA1 -r rtdev=/dev/nvme0n2 /dev/nvme1n1
...
realtime =/dev/nvme0n2           extsz=4096   blocks=4194304, rtextents=4194304
         =                       rgcount=64   rgsize=65536 extents
         =                       zoned=1      start=0 reserved=0
Discarding blocks...Done.
Resetting zones...Done.
# mkdir -p /mnt/disk1
# mount -o noatime,rtdev=/dev/nvme0n2 LABEL=GARAGEDATA1 /mnt/disk1
```

See [XFS](/docs/filesystems/xfs#usage) for details on both cases.

:::tip
To try this setup without a zoned drive, create an emulated device with
*zloop* as described in [Zoned Block Device
Emulation](/docs/getting-started/zbd-emulation) and use it in place of
*/dev/sda*. This guide was tested with 16 GiB *zloop* devices with 256 MiB
zones and 4 conventional zones. The ZNS layout was tested with a *zloop*
device without conventional zones as the realtime device and a 1 GiB loop
device as the main device; it was not tested on NVMe ZNS hardware.
:::

To mount the file systems at boot, add them to */etc/fstab* (not tested in
this setup). For NVMe ZNS, prefer a persistent */dev/disk/by-id/* name for
*rtdev=*:

```plaintext
# SMR HDD
LABEL=GARAGEDATA1  /mnt/disk1  xfs  defaults,noatime  0  2
# NVMe ZNS SSD with a conventional metadata device
LABEL=GARAGEDATA1  /mnt/disk1  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0  2
```

Create a system account for *Garage*. It needs no home directory or login
shell:

```plaintext
# useradd --system --user-group --no-create-home --shell /usr/sbin/nologin garage
```

Create the data directory on the zoned file system and the metadata directory
on conventional storage, owned by that account:

```plaintext
# mkdir -p /mnt/disk1/garage /var/lib/garage/meta
# chown garage:garage /mnt/disk1/garage /var/lib/garage/meta
```

The file system root has the *rtinherit* attribute (`t`), so all files created
under */mnt/disk1* are placed on the zoned device:

```plaintext
# xfs_io -c lsattr /mnt/disk1
-------t--------- /mnt/disk1
```

### Step 2: Install Garage

Download the static binary for your architecture from the
[*Garage* download page](https://garagehq.deuxfleurs.fr/download/):

```plaintext
# curl -o /usr/local/bin/garage https://garagehq.deuxfleurs.fr/_releases/v2.5.0/x86_64-unknown-linux-musl/garage
# chmod +x /usr/local/bin/garage
$ garage --version
garage v2.5.0 [features: bundled-libs, consul-discovery, fjall, journald, k2v, kubernetes-discovery, lmdb, metrics, sqlite, syslog, telemetry-otlp]
```

The `dxflrs/garage:v2.5.0` container image contains the same binary. With a
container, bind-mount */etc/garage.toml*, the metadata directory and each
zoned mount point at the same paths inside the container. The tests in this
guide used the binary directly.

### Step 3: Configure Garage

Create */etc/garage.toml*. `metadata_dir` points to conventional storage and
`data_dir` to the directory on the zoned file system. Generate the RPC secret
with `openssl rand -hex 32` and the admin token with
`openssl rand -base64 32`.

```toml
metadata_dir = "/var/lib/garage/meta"
data_dir = "/mnt/disk1/garage"
db_engine = "lmdb"
metadata_auto_snapshot_interval = "6h"

replication_factor = 1

rpc_bind_addr = "[::]:3901"
rpc_public_addr = "127.0.0.1:3901"
rpc_secret = "<output of openssl rand -hex 32>"

[s3_api]
s3_region = "garage"
api_bind_addr = "[::]:3900"
root_domain = ".s3.garage.localhost"

[admin]
api_bind_addr = "[::]:3903"
admin_token = "<output of openssl rand -base64 32>"
```

`replication_factor = 1` is for a single-node test. For a cluster, use 3 and
follow the [*Garage* cluster deployment
guide](https://garagehq.deuxfleurs.fr/documentation/cookbook/real-world/).

### Step 4: Start Garage and Create the Layout

Start the server in the foreground for a first test:

```plaintext
$ RUST_LOG=garage=info garage server
INFO garage::server: Loading configuration from /etc/garage.toml...
INFO garage_db::lmdb_adapter: Opening LMDB database at: /var/lib/garage/meta/db.lmdb
INFO garage_rpc::system: Generating new node key pair.
INFO garage_rpc::system: Node ID of this node: 61ccebbd48f26aa8
...
INFO garage_net::netapp: Listening on [::]:3901
INFO garage_api_common::generic_server: S3 API server listening on http://[::]:3900
INFO garage_api_common::generic_server: Admin API server listening on http://[::]:3903
```

To run *Garage* as a service, see the [*Garage* systemd
cookbook](https://garagehq.deuxfleurs.fr/documentation/cookbook/systemd/). Its
unit uses `DynamicUser=true` and `StateDirectory=garage`, which only allows
writes below */var/lib/garage*. With data directories on */mnt/diskN*, run the
service as a fixed user (`User=garage`) instead, or add the mount points with
`ReadWritePaths=`. The systemd unit was not tested in this setup.

In a second terminal, assign the node a zone and a capacity. Use the usable
capacity of the data file systems (14 GiB for one 16 GiB test drive):

```plaintext
$ garage status
==== HEALTHY NODES ====
ID                Hostname  Address         Tags  Zone  Capacity          DataAvail  ResyncQueue  Version
61ccebbd48f26aa8  node1     127.0.0.1:3901              NO ROLE ASSIGNED             0            v2.5.0
$ garage layout assign -z dc1 -c 14G 61ccebbd48f26aa8
$ garage layout apply --version 1
...
dc1                 Tags  Partitions        Capacity  Usable capacity
  61ccebbd48f26aa8  []    256 (256 new)     13.0 GiB  13.0 GiB (100.0%)
  TOTAL                   256 (256 unique)  13.0 GiB  13.0 GiB (100.0%)

New cluster layout with updated role assignment has been applied in cluster.
$ garage status
==== HEALTHY NODES ====
ID                Hostname  Address         Tags  Zone  Capacity  DataAvail          ResyncQueue  Version
61ccebbd48f26aa8  node1     127.0.0.1:3901  []    dc1   13.0 GiB  14.0 GiB (100.0%)  0            v2.5.0
```

*DataAvail* is the free space of the zoned file system that holds `data_dir`.

### Step 5: Create a Bucket and Key

```plaintext
$ garage bucket create mybucket
$ garage key create mybucket-key
==== ACCESS KEY INFORMATION ====
Key ID:              GK5402d27df2ed1e8a332eb8e9
Key name:            mybucket-key
Secret key:          2b6394761327a666804ac724c4c4b216eea1131fd1296ead300d613cdbd432a2
...
$ garage bucket allow --read --write --owner mybucket --key mybucket-key
$ garage bucket info mybucket
...
==== KEYS FOR THIS BUCKET ====
Permissions  Access key                                Local aliases
RWO          GK5402d27df2ed1e8a332eb8e9  mybucket-key
```

### Step 6: Write and Read Data

Configure any S3 client with the key, the region `garage` and the endpoint
`http://127.0.0.1:3900`. With *aws-cli*:

```plaintext
$ export AWS_ACCESS_KEY_ID=GK5402d27df2ed1e8a332eb8e9
$ export AWS_SECRET_ACCESS_KEY=2b6394761327a666804ac724c4c4b216eea1131fd1296ead300d613cdbd432a2
$ export AWS_DEFAULT_REGION=garage AWS_ENDPOINT_URL=http://127.0.0.1:3900
$ dd if=/dev/urandom of=obj.bin bs=1M count=256
$ aws s3 cp obj.bin s3://mybucket/obj.bin
upload: ./obj.bin to s3://mybucket/obj.bin
$ aws s3 ls s3://mybucket/
2026-11-03 15:06:06  268435456 obj.bin
$ aws s3 cp s3://mybucket/obj.bin obj.down
download: s3://mybucket/obj.bin to ./obj.down
$ sha256sum obj.bin obj.down
15dfb7e8549e22428b2769411c2df74fb6798e86ee9e9e810dd17e3c4b809c17  obj.bin
15dfb7e8549e22428b2769411c2df74fb6798e86ee9e9e810dd17e3c4b809c17  obj.down
```

The tests ran *aws-cli* from the *amazon/aws-cli* container image with host
networking.

### Step 7: Verify the Data Is on the Zoned Device

The 256 MiB object is stored as 256 block files of about 1 MiB, in
subdirectories named after the first bytes of each block hash. Random data
does not compress, so each `.zst` file is the 1 MiB block plus a zstd frame
header:

```plaintext
# cd /mnt/disk1/garage
# find . -name '*.zst' | wc -l
256
# find . -name '*.zst' | head -1
./d7/81/d781bc56135b50551fd61fe9c30e0ffa3a90fe531543846924ff07c8d58e9fa5.zst
# ls -l d7/81/
-rw-rw-r-- 1 garage garage 1048613 Nov  3 16:06 d781bc56135b50551fd61fe9c30e0ffa3a90fe531543846924ff07c8d58e9fa5.zst
```

The *XFS* realtime flag (`r`) shows that the block file is on the realtime
(zoned) device. On zoned *XFS*, each realtime group (*RG*) maps to one zone:

```plaintext
# xfs_io -c lsattr d7/81/d781bc56135b50551fd61fe9c30e0ffa3a90fe531543846924ff07c8d58e9fa5.zst
r---------------X d7/81/d781bc56135b50551fd61fe9c30e0ffa3a90fe531543846924ff07c8d58e9fa5.zst
# xfs_bmap -v d7/81/d781bc56135b50551fd61fe9c30e0ffa3a90fe531543846924ff07c8d58e9fa5.zst
d7/81/d781bc56135b50551fd61fe9c30e0ffa3a90fe531543846924ff07c8d58e9fa5.zst:
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..2055]:       2621448..2623503  1 (8..2063)         2056
```

The write pointers of the first sequential zones advanced. The first zone of
the realtime device is full, and the next one is open:

```plaintext
# blkzone report /dev/sda | sed -n 5,9p
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x000808 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

The metadata database stays on conventional storage, in
*/var/lib/garage/meta/db.lmdb*.

## Multiple Zoned Drives per Node

*Garage* supports several data directories per node without RAID. Format and
mount each zoned drive as a separate *XFS* file system (as in
[Step 1](#step-1-prepare-a-zoned-xfs-file-system)) and list one directory per
drive in `data_dir`, with the usable capacity of each drive:

```toml
data_dir = [
    { path = "/mnt/disk1/garage", capacity = "14G" },
    { path = "/mnt/disk2/garage", capacity = "14G" },
    { path = "/mnt/disk3/garage", capacity = "14G" },
    { path = "/mnt/disk4/garage", capacity = "15G" },
]
```

Restart *Garage* and update the node capacity in the layout to the sum of the
drives:

```plaintext
$ garage layout assign -c 52G 61ccebbd48f26aa8
$ garage layout apply --version 2
$ garage status
==== HEALTHY NODES ====
ID                Hostname  Address         Tags  Zone  Capacity  DataAvail         ResyncQueue  Version
61ccebbd48f26aa8  node1     127.0.0.1:3901  []    dc1   48.4 GiB  56.7 GiB (99.5%)  264          v2.5.0
```

In the test, the fourth drive was the ZNS-style configuration (zoned device
without conventional zones plus a conventional metadata device). New blocks
were distributed over all four drives in proportion to their capacities.
Blocks written before the change stayed on */mnt/disk1*. After uploading four
128 MiB objects, a rebalance moved them to their primary locations:

```plaintext
# for i in 1 2 3 4; do echo disk$i $(find /mnt/disk$i/garage -name '*.zst' | wc -l); done
disk1 391
disk2 127
disk3 132
disk4 133
$ garage repair --yes rebalance
61ccebbd48f26aa8  Repair launched
# for i in 1 2 3 4; do echo disk$i $(find /mnt/disk$i/garage -name '*.zst' | wc -l); done
disk1 180
disk2 197
disk3 201
disk4 205
```

All objects passed checksum comparison after the rebalance, and block files
on every drive had the `r` flag:

```plaintext
# xfs_bmap -v /mnt/disk4/garage/12/a6/12a6c1a8832939595b7bd4fe043fa4dd1c9ec074506b7957e1650ad1624812f7.zst
 EXT: FILE-OFFSET      RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..2055]:       2097152..2099207  4 (0..2055)         2056
```

To retire a drive, mark its entry `read_only = true`, run
`garage repair --yes rebalance` and remove the entry once the directory
contains no files. See [Multi-HDD
support](https://garagehq.deuxfleurs.fr/documentation/operations/multi-hdd/).
The read-only procedure was not tested in this setup.

## Production Notes

- **One file system per drive.** Use one zoned *XFS* file system and one
  `data_dir` entry per SMR disk or ZNS namespace. Do not combine zoned drives
  with LVM or RAID. Use replication across nodes (`replication_factor = 3` in
  a cluster) for redundancy.

- **Metadata on conventional storage.** Keep `metadata_dir` (and
  `metadata_snapshots_dir`, if set) on an SSD. The *Garage* documentation
  notes that LMDB can be corrupted by an unclean shutdown and recommends
  `metadata_auto_snapshot_interval`; snapshots need up to about four times the
  database size.

- **Block write pattern.** *Garage* writes each block to a temporary file
  (`<hash>.tmpXXXXXXXX`), renames it to its final name, and never modifies it
  afterwards. Tracing the server during uploads showed no *fallocate()* calls,
  so the [zoned XFS limitations](/docs/filesystems/xfs#limitations) on
  preallocation, reflink and quotas do not affect it. Larger blocks
  (`block_size = "10M"`, as recommended by *Garage* for large files) mean
  fewer, larger files; this was not tested.

- **data_fsync.** With `data_fsync = true`, *Garage* calls *fsync()* on each
  block file and its directory before acknowledging the write. The
  multi-drive and fill tests ran with `data_fsync = true` without errors. The
  default is `false`.

- **Space reclaim after deletes.** Deleting an object does not free space
  immediately. *Garage* drops the block references and deletes a block file
  only after the block has had zero references for 10 minutes (the
  compiled-in `BLOCK_GC_DELAY`). In the tests, *df* reported the same usage
  for about 10 minutes after the delete and then dropped (from 274 MiB to
  18 MiB after deleting a 256 MiB object). Metadata tombstones are kept for
  24 hours. *XFS* then resets zones that no longer contain valid data and
  garbage-collects partially used zones when free space runs low.

- **Running full.** In a fill test on one 14 GiB drive, 50 objects of
  256 MiB filled the file system to 90%. After 24 of them were deleted, five
  more uploads succeeded and the sixth failed with *ENOSPC* about one minute
  after the deletes, while the deleted blocks were still on disk (see
  [Troubleshooting](#uploads-fail-with-no-space-left-on-device)). About
  10 minutes after the deletes, *Garage* removed the block files, usage
  dropped to 57% and 15 zones were empty. A further 18 objects of 256 MiB
  were then written, and all 49 remaining objects passed checksum
  verification. Plan for the reclaim delay: keep
  free space for at least 10 minutes of writes on each drive. For workloads
  with frequent deletes, raising *zonegc_low_space* starts *XFS* garbage
  collection earlier:

  ```plaintext
  # cat /sys/fs/xfs/sda/zoned/zonegc_low_space
  0
  # echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
  ```

- **Open zones.** *XFS* limits simultaneous file data writes to one fewer
  than the device's maximum number of open zones
  (`/sys/fs/xfs/<dev>/zoned/max_open_zones`, 14 on the test devices).
  Concurrent uploads and resync workers share this limit. See
  [XFS tuning](/docs/filesystems/xfs#tuning).

- **Scrub.** *Garage* scrubs each data directory every 25 to 35 days, reading
  every block file and checking its hash. Start a scrub manually with
  `garage repair --yes scrub start` and adjust the pause between blocks with
  `garage worker set scrub-tranquility`. In the test, a scrub of about
  270 blocks finished in 10 seconds. Corrupted blocks are renamed to
  `<hash>.zst.corrupted` and fetched again from other nodes; with
  `replication_factor = 1` there is no other copy. *Garage* does not delete
  the `.corrupted` files. Set `disable_scrub = true` only if the data is
  checked by other means.

- **Block repair.** After layout changes, run `garage repair --yes blocks` to
  check that referenced blocks exist on disk and that unreferenced block
  files are removed. See [Durability &
  Repairs](https://garagehq.deuxfleurs.fr/documentation/operations/durability-repairs/).

## Troubleshooting

### Uploads Fail with "No space left on device"

The client reports:

```plaintext
upload failed: - to s3://gcbucket/f6 An error occurred (ServiceUnavailable) when calling the UploadPart operation (reached max retries: 2): Internal error: Could not reach quorum of 1 (sets=Some(1)). 0 of 1 request succeeded, others returned errors: ["f6ae3c91be13b4b3: IO error: No space left on device (os error 28)"]
```

The zoned *XFS* file system holding `data_dir` is full. If objects were
deleted recently, their block files are still on disk until the 10-minute
block GC delay has passed. Check the pending work with `garage stats` (the
*block_ref* *GcTodo* column and *resync queue length*) and `df`. Wait for
*Garage* to delete the block files, add drives, or delete more data.

### Scrub Reports Corrupt Blocks

```plaintext
WARN garage_block::manager: Block a143e48a4c2fcc2b is corrupted. Renaming to .corrupted and resyncing.
ERROR garage_block::repair: Found corrupt data block during scrub: d781bc56135b5055
```

The block file's content does not match its hash. In a cluster, *Garage*
fetches a valid copy from another node. With a single copy, the block
appears in `garage block list-errors`. Use `garage block info <hash>` to find
the affected objects, then delete those objects or run
`garage block purge --yes <hash>` to remove the references. Delete the
`.corrupted` files manually. In the test, the corruption was injected by
overwriting bytes in a block file.

### Block Files Are Not on the Zoned Device

If `xfs_io -c lsattr` does not show the `r` flag on block files, check that
the drive was formatted with *zoned=1* in the *mkfs.xfs* output, that
`data_dir` points to the zoned mount, and that the *rtinherit* (`t`) flag is
set on the parent directories. See [Placing Data on the Main
Device](/docs/filesystems/xfs#placing-data-on-the-main-device).

### Blocks Stay on the First Drive After Adding Drives

*Garage* does not move existing blocks when `data_dir` entries are added.
Run `garage repair --yes rebalance` to move them to their primary
directories.

## Learn More

- [Garage documentation](https://garagehq.deuxfleurs.fr/documentation/)
- [Garage configuration reference](https://garagehq.deuxfleurs.fr/documentation/reference-manual/configuration/)
- [Garage multi-HDD support](https://garagehq.deuxfleurs.fr/documentation/operations/multi-hdd/)
- [Garage durability and repairs](https://garagehq.deuxfleurs.fr/documentation/operations/durability-repairs/)
- [Garage source repository](https://git.deuxfleurs.fr/Deuxfleurs/garage)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
