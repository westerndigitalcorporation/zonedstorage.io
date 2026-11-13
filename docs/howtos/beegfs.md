---
id: beegfs
title: BeeGFS on Zoned Storage
sidebar_label: BeeGFS
---

# BeeGFS on Zoned Storage

*BeeGFS* is a parallel cluster file system with separate management, metadata
and storage services. Clients use a kernel module to mount it. File contents
are striped across *storage targets*, directories on the storage servers'
local file systems. Each chunk is stored as a regular file.

Use one [*XFS* file system](/docs/filesystems/xfs) per host-managed SMR disk or
NVMe ZNS namespace. *XFS* converts file writes, including random writes and
overwrites, into sequential zone writes. The *BeeGFS* storage service and
clients require no zoned-device support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled, on the
  storage servers
- xfsprogs: 6.15+
- BeeGFS: 8.x (tested with *BeeGFS* 8.4.1 packages on Ubuntu 26.04 with kernel
  7.0 and xfsprogs 6.18.0)
- A conventional (randomly writable) SSD for the metadata targets, and for
  the *XFS* metadata of NVMe ZNS SSDs
- Kernel headers and a compiler on client machines, to build the *BeeGFS*
  client kernel module
:::

## How It Fits Together

| Component | Data | Where it goes |
|-----------|------|---------------|
| *beegfs-mgmtd* | Small SQLite database (nodes, targets, pools) | System disk |
| *beegfs-meta* | Directory entries and inodes stored as small files and extended attributes | Conventional SSD (ext4 recommended by *BeeGFS*) |
| *beegfs-storage* | File contents, as chunk files in each storage target | **Zoned XFS, one storage target per zoned drive** |
| *beegfs-client* | Nothing persistent (kernel module, mounts `/mnt/beegfs`) | - |

Place only storage targets on zoned drives. The metadata service performs
small, random, latency-sensitive reads and writes for file creation, lookup,
stat and deletion. Use a conventional file system on flash for this service,
as recommended by *BeeGFS*. Some metadata service code paths also call
*posix_fallocate()*, which zoned *XFS* does not support. Storage targets hold
the chunk files on zoned *XFS*.

Use one *XFS* file system per zoned drive and register each as a separate
storage target. *BeeGFS* stripes files across targets; optional buddy
mirroring replicates data across targets. Do not aggregate zoned drives in a
Linux software RAID volume: Linux software RAID does not support zoned block
devices.

## Quick Start

These steps install all services and the client on a single node named
*beegfs01*. For a production deployment on separate machines, run each
service's setup steps on its host and set `-m beegfs01` to the management
host. The example uses these devices:

- */dev/sda* is a host-managed SMR hard disk (storage target 101)
- */dev/nvme0n2* is an NVMe ZNS namespace and */dev/nvme0n1* a conventional
  namespace on the same SSD, used for the *XFS* metadata of the ZNS namespace
  (storage target 102)
- */dev/nvme1n1* is a conventional SSD for the metadata service

### Step 1: Prepare Zoned XFS File Systems

For an SMR hard disk with conventional zones, *XFS* needs no additional
device:

```plaintext
# mkfs.xfs /dev/sda
meta-data=/dev/sda               isize=512    agcount=4, agsize=65536 blks
         =                       sectsz=4096  attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=262144, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=0
log      =internal log           bsize=4096   blocks=16384, version=2
         =                       sectsz=4096  sunit=1 blks, lazy-count=1
realtime =internal               extsz=4096   blocks=3932160, rtextents=3932160
         =                       rgcount=60   rgsize=65536 extents
         =                       zoned=1      start=262144 reserved=0
Resetting zones...Done.
```

An NVMe ZNS namespace has no conventional zones. Specify it as the realtime
device and use a conventional device for *XFS* metadata (about 1% of the zoned
capacity):

```plaintext
# mkfs.xfs -r rtdev=/dev/nvme0n2 /dev/nvme0n1
meta-data=/dev/nvme0n1           isize=512    agcount=4, agsize=262144 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=1
         =                       reflink=0    bigtime=1 inobtcount=1 nrext64=1
         =                       exchange=1   metadir=1
data     =                       bsize=4096   blocks=1048576, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=0
log      =internal log           bsize=4096   blocks=16384, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =/dev/nvme0n2           extsz=4096   blocks=4194304, rtextents=4194304
         =                       rgcount=64   rgsize=65536 extents
         =                       zoned=1      start=0 reserved=0
Discarding blocks...Done.
Resetting zones...Done.
```

`zoned=1` in the *realtime* section confirms that *XFS* manages the device
zones. Format the *BeeGFS* metadata SSD with ext4, using the options recommended
by the *BeeGFS* metadata tuning guide, and create the mount points:

```plaintext
# mkfs.ext4 -I 512 -J size=400 -O dir_index,filetype /dev/nvme1n1
# mkdir -p /data/meta /data/stor01 /data/stor02
```

Add the file systems to */etc/fstab* so they mount at boot. Identify them by
UUID. For *rtdev=*, use a stable path to the zoned namespace, such as a
*/dev/disk/by-id/* link. The *x-systemd.requires=* option makes systemd wait
for that device before mounting:

```plaintext
# blkid -s UUID -o value /dev/nvme1n1
# blkid -s UUID -o value /dev/sda
# blkid -s UUID -o value /dev/nvme0n1
# ls -l /dev/disk/by-id/ | grep nvme0n2
```

```plaintext
UUID=<nvme1n1-uuid>  /data/meta    ext4  noatime,nodiratime,user_xattr  0 0
UUID=<sda-uuid>      /data/stor01  xfs   noatime  0 0
UUID=<nvme0n1-uuid>  /data/stor02  xfs   noatime,rtdev=/dev/disk/by-id/<nvme0n2-id>,x-systemd.requires=/dev/disk/by-id/<nvme0n2-id>  0 0
```

```plaintext
# systemctl daemon-reload
# mount -a
# findmnt -t xfs,ext4 -o TARGET,SOURCE,FSTYPE
TARGET       SOURCE       FSTYPE
/data/meta   /dev/nvme1n1 ext4
/data/stor01 /dev/sda     xfs
/data/stor02 /dev/nvme0n1 xfs
```

The kernel messages show that the zoned devices are in use:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem b38c997f-4fa5-4693-a971-e7d1eef3148c
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks (15 max open zones)
XFS (nvme0n1): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (nvme0n1): Mounting V5 Filesystem 7a8e46dd-9129-46fb-a57c-2c94571b9773
XFS (nvme0n1): Ending clean mount
XFS (nvme0n1): 64 zones of 65536 blocks (14 max open zones)
```

:::warning
NVMe namespace device names such as */dev/nvme0n1* and */dev/nvme0n2* can change
across reboots. During testing, the two namespaces swapped names after a
reboot. An */etc/fstab* entry using `rtdev=/dev/nvme0n2` then pointed to the
wrong device. The mount failed with "Cannot mount filesystem with identical
rtdev and ddev/logdev", and the system entered emergency mode. Always use a
*/dev/disk/by-id/* path for *rtdev=*.
:::

:::tip
To test without a zoned drive, create an emulated zoned block device with
*zloop* as described in
[Zoned Block Device Emulation](/docs/getting-started/zbd-emulation).
Format it with `mkfs.xfs` as for the SMR disk above, then use it as a storage
target.
:::

### Step 2: Install BeeGFS

Add the official *BeeGFS* package repository. For Ubuntu 26.04, use the
following commands. Replace *resolute* with *noble* for 24.04, or with
*bookworm*/*trixie* for Debian:

```plaintext
# wget https://www.beegfs.io/release/beegfs_8.4/gpg/GPG-KEY-beegfs -O /etc/apt/trusted.gpg.d/beegfs.asc
# wget https://www.beegfs.io/release/beegfs_8.4/dists/beegfs-resolute.list -O /etc/apt/sources.list.d/beegfs.list
# apt update
```

On RHEL, Rocky Linux and AlmaLinux 10 (use *rhel9* or *rhel8* for older
releases):

```plaintext
# rpm --import https://www.beegfs.io/release/beegfs_8.4/gpg/GPG-KEY-beegfs
# wget https://www.beegfs.io/release/beegfs_8.4/dists/beegfs-rhel10.repo -O /etc/yum.repos.d/beegfs.repo
```

Install the services, client, command-line tools and client kernel module
build dependencies. On RHEL systems, use `dnf install` and *kernel-devel*:

```plaintext
# apt install beegfs-mgmtd libbeegfs-license beegfs-meta beegfs-storage \
      beegfs-client beegfs-tools beegfs-utils linux-headers-$(uname -r) build-essential
```

```plaintext
# dpkg -l | grep beegfs
ii  beegfs-client      20:8.4.1   all     BeeGFS client
ii  beegfs-meta        20:8.4.1   amd64   BeeGFS metadata server daemon
ii  beegfs-mgmtd       20:8.4.1   amd64   The BeeGFS management service
ii  beegfs-storage     20:8.4.1   amd64   BeeGFS storage server daemon
ii  beegfs-tools       20:8.4.1   amd64   A collection of tools for managing BeeGFS.
ii  beegfs-utils       20:8.4.1   amd64   BeeGFS utils
ii  libbeegfs-ib       20:8.4.1   amd64   BeeGFS InfiniBand support
ii  libbeegfs-license  20:8.4.1   amd64   Shared library for verifying BeeGFS licenses.
```

### Step 3: Configure Authentication and TLS

*BeeGFS* 8 services require connection authentication by default, and the
management service requires TLS. Create a shared secret and copy it to
*/etc/beegfs/conn.auth* on every server and client. Create a TLS certificate
for the management service. A self-signed certificate is sufficient for this
test system. See the *BeeGFS* TLS documentation for production configuration
and the contents of *san.cnf*; the example adds the host name *beegfs01* to
that file:

```plaintext
# dd if=/dev/random of=/etc/beegfs/conn.auth bs=128 count=1
# chown root:root /etc/beegfs/conn.auth
# chmod 400 /etc/beegfs/conn.auth
# cd /etc/beegfs
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -config san.cnf
```

### Step 4: Initialize the Services

Initialize the management database on the system disk and the metadata target
on the conventional SSD:

```plaintext
# /opt/beegfs/sbin/beegfs-mgmtd --init
Created new database version 6 at "/var/lib/beegfs/mgmtd.sqlite".
# /opt/beegfs/sbin/beegfs-setup-meta -p /data/meta/beegfs_meta -s 1 -m beegfs01
```

Register one storage target per zoned *XFS* file system. `-s` specifies the
storage service's numeric ID; `-i` specifies the target's numeric ID:

```plaintext
# /opt/beegfs/sbin/beegfs-setup-storage -p /data/stor01/beegfs_storage -s 1 -i 101 -m beegfs01
Preparing storage target directory: /data/stor01/beegfs_storage
 * Creating format.conf file...
 * Creating chunks directory...
 * Creating buddymir directory...
 * Creating target numeric ID file: /data/stor01/beegfs_storage/targetNumID
 * Creating server numeric ID file: /data/stor01/beegfs_storage/nodeNumID
Updating config file: /etc/beegfs/beegfs-storage.conf
 * Setting management host: beegfs01
 * Appending to target directory list in config file...
 * Disabling usage of uninitialized storage targets in config file...
 * Fetching the underlying device...
Underlying device detected: /dev/sda
Fetching UUID of the file system on that device...
Found UUID b38c997f-4fa5-4693-a971-e7d1eef3148c
Appending UUID to config file...
All done.
# /opt/beegfs/sbin/beegfs-setup-storage -p /data/stor02/beegfs_storage -s 1 -i 102
```

*beegfs-setup-storage* adds the target directory to *storeStorageDirectory*
and the *XFS* UUID to *storeFsUUID* in */etc/beegfs/beegfs-storage.conf*. It
also sets *storeAllowFirstRunInit = false*. These settings prevent the storage
service from starting when the target file system is not mounted, rather
than allowing it to write into the empty mount point. No additional
zoned-specific configuration is required.

Configure the client to use the management host:

```plaintext
# /opt/beegfs/sbin/beegfs-setup-client -m beegfs01
```

If the client runs on the same machine as the servers, disable the client
mount sanity check in */etc/beegfs/beegfs-client.conf*, as recommended by
*BeeGFS*. Otherwise, the client may try to mount before the metadata service
is ready at boot, causing the mount to fail (see
[Troubleshooting](#troubleshooting)):

```plaintext
sysMountSanityCheckMS        = 0
```

### Step 5: Start BeeGFS

```plaintext
# systemctl enable --now beegfs-mgmtd beegfs-meta beegfs-storage
# systemctl enable --now beegfs-client
```

On its first start, *beegfs-client* builds the client kernel module for the
running kernel. Check that all services and targets are registered and
online. The *beegfs* tool locates the management service through the client
mount and uses */etc/beegfs/cert.pem* and */etc/beegfs/conn.auth* by default:

```plaintext
# beegfs node list
ID    TYPE        ALIAS
c:7   client      c5C6-6AE9E473-beegfs01
m:1   meta        node_meta_1
s:1   storage     node_storage_1
mg:1  management  management
# beegfs target list --state --capacity
ID     TYPE     ALIAS               NODE  STORAGE_POOL  REACHABILITY  LAST_CONTACT  CONSISTENCY  SYNC_STATE  CAP_POOL   SPACE    SPACE_USED        SPACE_FREE  INODES  INODES_USED     INODES_FREE
m:1    meta     target_meta_1       m:1   (n/a)         Online        29s ago       Good         Healthy     Emergency  7.3GiB   260.1MiB (3.47%)  7.1GiB      524.3k  66.1k (12.60%)  458.2k
s:101  storage  target_storage_101  s:1   s:1           Online        29s ago       Good         Healthy     Normal     14.0GiB  512.0MiB (3.57%)  13.5GiB     524.3k  78.0 (0.01%)    524.2k
s:102  storage  target_storage_102  s:1   s:1           Online        29s ago       Good         Healthy     Normal     15.0GiB  32.0KiB (0.00%)   15.0GiB     2.1M    77.0 (0.00%)    2.1M
```

For storage targets, the *SPACE* column reports the zoned devices' capacity.
The output above is from small test devices.

:::note
Until a license is installed, the *beegfs* tool prints a license warning after
every command, and at most five clients can mount the file system. Run
`beegfs license` to obtain a free community license or an enterprise license,
as described in the *BeeGFS* licensing documentation.
:::

### Step 6: Write Data and Check That It Lands on the Zoned Drives

Optionally, set the default stripe pattern to use two targets per file (both
zoned drives in this example):

```plaintext
# beegfs entry set --num-targets 2 --chunk-size 1MiB /mnt/beegfs
Summary: processed 1 entries | configuration updates: Chunksize (1048576), DefaultNumTargets (2)
```

Write a file through the client and compare checksums before and after
dropping caches. This checks read-back consistency, not crash durability;
dropping caches evicts only clean pages.

```plaintext
# mkdir /mnt/beegfs/test
# dd if=/dev/urandom of=/mnt/beegfs/test/bigfile bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 6.08461 s, 176 MB/s
# sha256sum /mnt/beegfs/test/bigfile
323f583e73a875be020979b5bc32cda167fbb6045dd7b562256ed71b99f7b8e7  /mnt/beegfs/test/bigfile
# echo 3 > /proc/sys/vm/drop_caches
# sha256sum /mnt/beegfs/test/bigfile
323f583e73a875be020979b5bc32cda167fbb6045dd7b562256ed71b99f7b8e7  /mnt/beegfs/test/bigfile
# beegfs entry info /mnt/beegfs/test/bigfile
PATH           ENTRY_ID      TYPE  META_NODE  META_MIRROR   STORAGE_POOL  STRIPE_PATTERN  STORAGE_TARGETS  STORAGE_MIRRORS  REMOTE_TARGETS  COOL_DOWN  CLIENT_SESSIONS         ACCESS    STATE
/test/bigfile  0-6AE9E4AF-1  file  m:1        (unmirrored)  (file)        RAID0 (2x1M)    s:102,s:101      (unmirrored)     (none)          (n/a)      Reading: 0, Writing: 0  Unlocked  Available
```

The output shows the file striped across both storage targets. On the storage
server, chunk files are named after the entry ID. The `r` in the *lsattr*
output is the *XFS* realtime flag. The *xfs_bmap* output places the chunk data
in realtime groups (*RG*), which correspond to zones on the zoned device:

```plaintext
# find /data/stor0*/beegfs_storage/chunks -name '0-6AE9E4AF-1' | sort
/data/stor01/beegfs_storage/chunks/u0/6AE9/E/0-6AE9E401-1/0-6AE9E4AF-1
/data/stor02/beegfs_storage/chunks/u0/6AE9/E/0-6AE9E401-1/0-6AE9E4AF-1
# cd /data/stor01/beegfs_storage/chunks/u0/6AE9/E/0-6AE9E401-1
# xfs_io -c lsattr 0-6AE9E4AF-1
r---------------X 0-6AE9E4AF-1
# xfs_bmap -v 0-6AE9E4AF-1
0-6AE9E4AF-1:
 EXT: FILE-OFFSET        RT-BLOCK-RANGE   RG RG-OFFSET         TOTAL
   0: [0..524287]:       8388608..8912895 12 (0..524287)      524288
   1: [524288..1048575]: 8912896..9437183 13 (0..524287)      524288
```

Each 256 MiB extent in this example fills one zone. The device's zone report
shows those zones in the *full* (*fu*) condition and the current write pointer
of an open (*oi*) zone:

```plaintext
# blkzone report /dev/sda | grep -v 'zcond: 1(em)'
  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
...
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x050eb8 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x000800000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000880000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
```

## Production Notes

- **One file system per drive, one target per file system.** Format every
  zoned drive with its own *XFS* file system and register it with
  `beegfs-setup-storage -p <mount>/beegfs_storage -s <server-id> -i <target-id>`.
  A storage service can serve multiple targets. *BeeGFS* stripes files across
  targets; buddy mirroring (an enterprise feature) replicates chunks across
  targets for redundancy.
- **Keep metadata on flash.** Size the metadata SSDs as recommended by
  *BeeGFS* (about 0.3% to 0.5% of the total storage capacity). For NVMe ZNS
  SSDs, also reserve about 1% of the zoned capacity on a conventional device
  for the *XFS* metadata (*rtdev* setup).
- **Mount options.** The *XFS* mount options suggested by the *BeeGFS* storage
  tuning guide (`noatime,nodiratime,logbufs=8,logbsize=256k,largeio,inode64,swalloc,allocsize=131072k`)
  were accepted on zoned *XFS* during testing. They are not required for zoned
  operation.
- **Open zones.** *XFS* writes concurrently to as many zones as the device
  allows, minus one reserved for garbage collection. Concurrent *BeeGFS*
  writers share these open zones. Check the limit in sysfs and reduce it with
  the *max_open_zones* mount option. The sysfs directory is named after the
  main device, such as *nvme0n1* for the ZNS example above:

  ```plaintext
  # cat /sys/fs/xfs/sda/zoned/max_open_zones
  14
  ```

- **Garbage collection.** When clients delete or overwrite chunk data, *XFS*
  garbage collection reclaims space from partially invalid zones. For targets
  with frequent overwrites or deletions, raise the *zonegc_low_space* threshold
  (a percentage of free space) to start garbage collection earlier. See the
  [XFS tuning section](/docs/filesystems/xfs#tuning):

  ```plaintext
  # cat /sys/fs/xfs/sda/zoned/zonegc_low_space
  0
  # echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
  ```

- **Full targets.** Client writes to a full target fail with
  "No space left on device". Deleting files allows *XFS* to reclaim space.
  *BeeGFS* capacity pools (*cap-pool-storage-limits* in
  */etc/beegfs/beegfs-mgmtd.toml*) direct new chunks away from targets with low
  free space. Keep them enabled and allow headroom for *XFS* garbage
  collection.
- **Quotas.** *BeeGFS* quota (an enterprise feature) relies on user and group
  quota accounting of the storage target file systems. *XFS* does not support
  quotas on file systems with a zoned realtime device yet: mounting with quota
  options logs "Cannot turn on quotas for realtime filesystem" and the file
  system is mounted without quota accounting.
- **Network ports.** Open the default *BeeGFS* ports between nodes: 8008
  (management, TCP and UDP) and 8010 (management gRPC, used by the *beegfs*
  tool), 8005 (metadata), 8003 (storage) and 8004 (client), TCP and UDP.
- **Containers.** *BeeGFS* provides official container images for its server
  services (*ghcr.io/thinkparq/beegfs-mgmtd*, *beegfs-meta* and
  *beegfs-storage*). Bind-mount a zoned *XFS* directory into the storage
  container to use it as a storage target. See the *BeeGFS* container
  documentation.

## Troubleshooting

**The ZNS file system fails to mount at boot ("Cannot mount filesystem with
identical rtdev and ddev/logdev").** The *rtdev=* option in */etc/fstab* uses
a kernel device name that changed after a reboot. Use a */dev/disk/by-id/*
path for *rtdev=* and add *x-systemd.requires=* with the same path, as shown in
Step 1.

**beegfs-client fails at boot with "Mount sanity check failed. Canceling
mount."** The client started before the metadata service on the same machine
was ready. Set `sysMountSanityCheckMS = 0` in
*/etc/beegfs/beegfs-client.conf* on nodes that run both servers and the client,
or start the client after the servers (`systemctl restart beegfs-client`).

**beegfs-storage fails with "Target ID reservation request was rejected" after
reformatting a drive.** A newly initialized target directory gets a new
internal target ID, but the numeric ID (e.g. 102) is still registered with the
old internal ID. Delete the old registration before starting the storage
service only if the old target's data is already lost:

```plaintext
# beegfs target delete s:102 --yes
# systemctl restart beegfs-storage
```

**beegfs-storage fails with "Unable to open auth file: /etc/beegfs/conn.auth".**
*BeeGFS* 8 requires connection authentication by default. Copy the same
*conn.auth* file to all nodes. Explicitly disabling authentication on all
nodes is possible but not recommended.

**Files are not striped over small test targets.** Targets in the *Emergency*
capacity pool do not receive new chunks. The default limits (10 GiB free space
and 1 million free inodes for *Emergency*, 512 GiB for *Low*) place small
emulated zoned devices in the *Low* or *Emergency* pool. For a test setup,
lower the limits in */etc/beegfs/beegfs-mgmtd.toml*, then restart
*beegfs-mgmtd* and *beegfs-meta*:

```plaintext
[cap-pool-storage-limits]
inodes-low = "100k"
inodes-emergency = "10k"
space-low = "4GiB"
space-emergency = "1GiB"
```

**fallocate fails on a BeeGFS mount.** The *BeeGFS* client does not implement
*fallocate*, so `fallocate` on */mnt/beegfs* fails with "Operation not
supported". This limitation is independent of zoned storage. Zoned *XFS* also
does not support persistent preallocation (see the
[XFS limitations](/docs/filesystems/xfs#limitations)), so storage targets
cannot preallocate space locally. Data writes, sparse files and truncation
are supported.

## Learn More

- [BeeGFS documentation](https://doc.beegfs.io/latest/): installation,
  configuration and administration, including the
  [Quick Start Guide](https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html),
  [Storage Node Tuning](https://doc.beegfs.io/latest/advanced_topics/storage_tuning.html),
  [Authentication](https://doc.beegfs.io/latest/advanced_topics/authentication.html),
  [Configuring TLS](https://doc.beegfs.io/latest/advanced_topics/tls.html) and
  [Licensing](https://doc.beegfs.io/latest/advanced_topics/licensing.html)
- [BeeGFS downloads and package repositories](https://www.beegfs.io/c/download/)
- [BeeGFS source code](https://github.com/ThinkParQ/beegfs)
- [XFS on zoned block devices](/docs/filesystems/xfs)
- [Zoned block device emulation](/docs/getting-started/zbd-emulation)
