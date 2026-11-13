---
id: glusterfs
title: GlusterFS on Zoned Storage
sidebar_label: GlusterFS
---

# GlusterFS on Zoned Storage

*GlusterFS* is a distributed file system that aggregates directories on
several servers, called *bricks*, into one volume. Clients mount the volume
with a FUSE client. A brick is a directory on a local file system. *GlusterFS*
stores each file as a regular file in the brick, keeps its own metadata in
`trusted.*` extended attributes, and keeps a hard link to each file in the
brick's *.glusterfs* directory.

Put each brick on a [zoned *XFS*](/docs/filesystems/xfs) file system, one per
host-managed SMR disk or NVMe ZNS namespace. The contents of brick files are
written to the sequential zones. Inodes, directories, extended attributes and
the *.glusterfs* hard link tree are *XFS* metadata, stored in the drive's
conventional zones (SMR) or on a separate conventional device (ZNS). The
*glusterd* configuration in */var/lib/glusterd* stays on the server's system
disk. *GlusterFS* needs no zoned-device support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *GlusterFS* server and client 11.x (tested: 11.2 from the Ubuntu 26.04
  *glusterfs-server* and *glusterfs-client* packages, version 11.2-2)
- Tested on kernel 6.17.7 with xfsprogs 6.19.0, with four *GlusterFS*
  servers and one client in privileged containers on one host, each server
  with one 16 GiB *zloop* device
:::

:::note
Red Hat ended support for its *Red Hat Gluster Storage* product on
31 December 2024. The upstream project continues with community releases;
the latest release at the time of writing is
[11.2](https://github.com/gluster/glusterfs/releases/tag/v11.2) (July 2025).
Some downstream projects have dropped *GlusterFS* support, for example
Proxmox VE 9.
:::

## How It Fits Together

| Component | Data | Placement |
|-----------|------|-----------|
| *glusterd* (management daemon, one per server) | Peer and volume configuration in */var/lib/glusterd* | Conventional system disk |
| *glusterfsd* (brick process, one per brick) | File contents in the brick directory | Zoned *XFS*, sequential zones |
| *glusterfsd* | Directories, `trusted.*` xattrs, *.glusterfs* hard links | Zoned *XFS* metadata (conventional zones or conventional device) |
| *glustershd* (self-heal daemon) | Heal indexes in *.glusterfs/indices* | Zoned *XFS* metadata |
| FUSE client (*glusterfs*) | None | Client host |

*GlusterFS* places whole files on bricks. In a *distribute* volume, each
file is stored on one brick, chosen by a hash of the file name. In a
*replicate* volume, each file is stored in full on every brick of a replica
set. In a *disperse* volume, each file is split into erasure-coded fragments,
one per brick. Each fragment is a regular file of the same name in the
brick.

```plaintext
        server1             server2             server3             server4
   +--------------+    +--------------+    +--------------+    +--------------+
   | /data/disk1  |    | /data/disk1  |    | /data/disk1  |    | /data/disk1  |
   |   brick/     |    |   brick/     |    |   brick/     |    |   brick/     |
   +--------------+    +--------------+    +--------------+    +--------------+
     zoned XFS            zoned XFS           zoned XFS           zoned XFS
   (/dev/sda, SMR)     (/dev/sda, SMR)     (/dev/sda, SMR)     (/dev/sda, SMR)
```

## Quick Start

These steps create a four-server distribute volume, then a replica 3 volume
and a disperse volume on the same drives. Run commands prefixed with `#` as
root. Repeat the steps marked *on every server* on each server.

### Step 1: Prepare a Zoned XFS File System (on Every Server)

Check the *XFS* [requirements](/docs/filesystems/xfs#system-requirements)
before formatting the drive. The *GlusterFS* documentation recommends an
inode size of 512 bytes for bricks, which is also the *mkfs.xfs* default.

For an SMR disk with conventional zones, format the whole disk and mount it:

```plaintext
# mkfs.xfs -i size=512 -L GLBRICK1 /dev/sda
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
# mkdir -p /data/disk1
# mount -o noatime LABEL=GLBRICK1 /data/disk1
```

The *zoned=1* field identifies a zoned realtime device. The kernel log
confirms the zoned mount:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem 659921ca-889f-4c48-a657-1a1c95e204db
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

An NVMe ZNS namespace has no conventional zones. Place the *XFS* metadata on
a conventional block device, such as a conventional namespace or an SSD
partition, and specify the ZNS namespace as the realtime device:

```plaintext
# mkfs.xfs -i size=512 -L GLBRICK1 -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mount -o noatime,rtdev=/dev/nvme0n2 LABEL=GLBRICK1 /data/disk1
```

See [XFS](/docs/filesystems/xfs#usage) for details on both cases. The ZNS
commands were not tested for this guide.

:::tip
For emulated hardware, create a *zloop* device as described in
[Zoned Block Device Emulation](/docs/getting-started/zbd-emulation) and use it
in place of */dev/sda*. The examples used 16 GiB *zloop* devices with 256 MiB
zones and four conventional zones.
:::

Add the file system to */etc/fstab* so that it is mounted before *glusterd*
starts its bricks:

```plaintext
# SMR HDD
LABEL=GLBRICK1  /data/disk1  xfs  defaults,noatime  0  2
# NVMe ZNS SSD with a conventional metadata device
LABEL=GLBRICK1  /data/disk1  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0  2
```

NVMe device names are not guaranteed to be stable across reboots. Prefer a
persistent name such as */dev/disk/by-id/nvme-...* for the *rtdev=* option.
The */etc/fstab* entries were not tested for this guide.

Create the brick directory inside the mount point, not on the mount point
itself. If the drive is not mounted, *GlusterFS* then finds no brick directory
instead of writing to the root file system. New directories inherit the
*realtime* attribute (`t`, *rtinherit*) from the file system root:

```plaintext
# mkdir -p /data/disk1/brick
# xfs_io -c lsattr /data/disk1/brick
-------t--------X /data/disk1/brick
```

### Step 2: Install GlusterFS (on Every Server)

Install the server package from your distribution or from the
[*GlusterFS* community packages](https://docs.gluster.org/en/main/Install-Guide/Community-Packages/).
On Ubuntu 26.04:

```plaintext
# apt install glusterfs-server
# systemctl enable --now glusterd
# gluster --version
glusterfs 11.2
...
```

The test ran *glusterd* in the foreground in containers
(`glusterd -N --log-file=-`), so the *systemctl* command was not tested.
*glusterd* listens on TCP port 24007; each brick process uses one port of
the range 49152-60999 by default. Open these ports between the servers and
to the clients.

### Step 3: Create the Trusted Storage Pool

From *server1*, add the other servers to the pool:

```plaintext
# gluster peer probe server2
peer probe: success
# gluster peer probe server3
peer probe: success
# gluster peer probe server4
peer probe: success
# gluster pool list
UUID					Hostname 	State
11404c98-6ad1-4c8f-8769-09a63f4ef328	server2  	Connected
cba697a3-b195-4d4e-a35d-ffd264f59451	server3  	Connected
afe236e0-93b6-4bac-9055-e0ee8417ecdb	server4  	Connected
bb91d787-80cc-4122-9059-822862726a84	localhost	Connected
```

### Step 4: Create and Start a Volume

Create a distribute volume with one brick per server:

```plaintext
# gluster volume create gvdist server1:/data/disk1/brick server2:/data/disk1/brick \
    server3:/data/disk1/brick server4:/data/disk1/brick
volume create: gvdist: success: please start the volume to access data
# gluster volume start gvdist
volume start: gvdist: success
# gluster volume info gvdist

Volume Name: gvdist
Type: Distribute
Volume ID: 24b069f1-6251-4d5f-8da2-737ebf9857a7
Status: Started
Snapshot Count: 0
Number of Bricks: 4
Transport-type: tcp
Bricks:
Brick1: server1:/data/disk1/brick
Brick2: server2:/data/disk1/brick
Brick3: server3:/data/disk1/brick
Brick4: server4:/data/disk1/brick
...
```

*GlusterFS* reports the brick file system and its mount options:

```plaintext
# gluster volume status gvdist server1:/data/disk1/brick detail
Status of volume: gvdist
------------------------------------------------------------------------------
Brick                : Brick server1:/data/disk1/brick
...
Online               : Y
File System          : xfs
Device               : /dev/sda
Mount Options        : rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
Inode Size           : 512
Disk Space Free      : 13.9GB
Total Disk Space     : 14.0GB
...
```

### Step 5: Mount the Volume and Write Data

On a client, install the FUSE client (*glusterfs-client* on Ubuntu) and
mount the volume:

```plaintext
# mkdir -p /mnt/gvdist
# mount -t glusterfs server1:/gvdist /mnt/gvdist
# df -h /mnt/gvdist
Filesystem       Size  Used Avail Use% Mounted on
server1:/gvdist   56G  574M   56G   1% /mnt/gvdist
```

The volume capacity is the sum of the four 14 GiB zoned file systems.
Write eight 128 MiB files, drop the page cache, and compare the files:

```plaintext
# for i in 1 2 3 4 5 6 7 8; do head -c 128M /dev/urandom > /root/f$i.bin; done
# cp /root/f*.bin /mnt/gvdist/
# echo 3 > /proc/sys/vm/drop_caches
# sha256sum /root/f1.bin /mnt/gvdist/f1.bin
64e887803c113a180d45cff821cd7b1a7b519ff1bbbbec6666a176a2adc432d5  /root/f1.bin
64e887803c113a180d45cff821cd7b1a7b519ff1bbbbec6666a176a2adc432d5  /mnt/gvdist/f1.bin
# for i in 1 2 3 4 5 6 7 8; do cmp /root/f$i.bin /mnt/gvdist/f$i.bin && echo ok$i; done
ok1
ok2
...
ok8
```

To mount the volume at boot, add an entry such as the following to
*/etc/fstab* on the client (not tested):

```plaintext
server1:/gvdist  /mnt/gvdist  glusterfs  defaults,_netdev,backup-volfile-servers=server2:server3  0  0
```

### Step 6: Verify the Data Is on the Zoned Device

The distribute volume placed each file on one brick, as whole files with
the original names. In this test, the hash placed no files on *server3*:

```plaintext
# ls -l /data/disk1/brick        # on server1
-rw-r--r--+2 root root 134217728 Nov  3 15:06 f5.bin
-rw-r--r--+2 root root 134217728 Nov  3 15:06 f8.bin
# ls -l /data/disk1/brick        # on server4
-rw-r--r--+2 root root 134217728 Nov  3 15:06 f1.bin
-rw-r--r--+2 root root 134217728 Nov  3 15:06 f2.bin
-rw-r--r--+2 root root 134217728 Nov  3 15:06 f7.bin
```

The link count of 2 is the hard link in *.glusterfs*, named after the
file's *GFID*. The *GlusterFS* metadata is stored in extended attributes:

```plaintext
# cd /data/disk1/brick
# find .glusterfs -samefile f5.bin
.glusterfs/75/24/752433c5-b45b-48c7-8f3f-1d0dbb925765
# getfattr -d -m . -e hex f5.bin
# file: f5.bin
trusted.gfid=0x752433c5b45b48c78f3f1d0dbb925765
trusted.gfid2path.f7ee630889ac3652=0x3030303030303030...
trusted.glusterfs.mdata=0x0100000000000000...
```

The brick file has the *realtime* attribute (`r`). *xfs_bmap* shows its
extents on the realtime (zoned) device in the *RT-BLOCK-RANGE* and realtime
group (*RG*, one group per zone) columns:

```plaintext
# xfs_io -c lsattr f5.bin
r---------------X f5.bin
# xfs_bmap -v f5.bin
f5.bin:
 EXT: FILE-OFFSET       RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..4095]:        2621440..2625535  1 (0..4095)         4096
   1: [4096..6143]:     2630288..2632335  1 (8848..10895)     2048
   2: [6144..10895]:    2625536..2630287  1 (4096..8847)      4752
...
  88: [261656..262143]: 2865496..2865983  1 (244056..244543)   488
```

The two files on *server1* (2 x 128 MiB, RG 1 in the *xfs_bmap* output)
filled one 256 MiB sequential zone of the drive:

```plaintext
# blkzone report /dev/sda | sed -n 4,7p
  start: 0x000180000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

*xfs_bmap* reports 512-byte units. In this test, the first sequential zone
(RG 0) was still empty after the writes.

## Replicated and Dispersed Volumes

Several volumes can share the same zoned file systems if each volume uses
its own brick directory. A brick directory cannot contain, or be contained
by, another brick. The test created a replica 3 volume and a disperse
volume (two data fragments and one redundancy fragment) next to the
distribute volume:

```plaintext
# mkdir -p /data/disk1/rep /data/disk1/ec        # on every server
# gluster volume create gvrep replica 3 server2:/data/disk1/rep \
    server3:/data/disk1/rep server4:/data/disk1/rep
volume create: gvrep: success: please start the volume to access data
# gluster volume start gvrep
volume start: gvrep: success
# gluster volume create gvec disperse 3 redundancy 1 server1:/data/disk1/ec \
    server2:/data/disk1/ec server3:/data/disk1/ec
volume create: gvec: success: please start the volume to access data
# gluster volume start gvec
volume start: gvec: success
# gluster volume info gvec
...
Type: Disperse
Number of Bricks: 1 x (2 + 1) = 3
...
```

A 512 MiB file written to both volumes read back with the same checksum:

```plaintext
# mount -t glusterfs server1:/gvec /mnt/gvec
# mount -t glusterfs server1:/gvrep /mnt/gvrep
# df -h /mnt/gvec /mnt/gvrep
Filesystem      Size  Used Avail Use% Mounted on
server1:/gvec    28G  1.1G   27G   4% /mnt/gvec
server1:/gvrep   14G  528M   14G   4% /mnt/gvrep
# head -c 512M /dev/urandom > /root/big.bin
# cp /root/big.bin /mnt/gvec/ && cp /root/big.bin /mnt/gvrep/
# echo 3 > /proc/sys/vm/drop_caches
# sha256sum /root/big.bin /mnt/gvec/big.bin /mnt/gvrep/big.bin
879289e0da03c83e6693cf6ff38a412be256853075292e68513a2778a34da5d8  /root/big.bin
879289e0da03c83e6693cf6ff38a412be256853075292e68513a2778a34da5d8  /mnt/gvec/big.bin
879289e0da03c83e6693cf6ff38a412be256853075292e68513a2778a34da5d8  /mnt/gvrep/big.bin
```

On each server, the replica brick holds the full 512 MiB file. The disperse
brick holds a 256 MiB fragment, with the erasure-coding state in
`trusted.ec.*` attributes. Both are on the zoned device:

```plaintext
# ls -l /data/disk1/ec /data/disk1/rep        # on server2
/data/disk1/ec:
-rw-r--r--+2 root root 268435456 Nov  3 15:07 big.bin

/data/disk1/rep:
-rw-r--r--+2 root root 536870912 Nov  3 15:07 big.bin
# xfs_io -c lsattr /data/disk1/ec/big.bin /data/disk1/rep/big.bin
r---------------X /data/disk1/ec/big.bin
r---------------X /data/disk1/rep/big.bin
# getfattr -d -m trusted.ec -e hex /data/disk1/ec/big.bin
# file: data/disk1/ec/big.bin
trusted.ec.config=0x0000080301000200
trusted.ec.dirty=0x00000000000000000000000000000000
trusted.ec.size=0x0000000020000000
trusted.ec.version=0x00000000000010000000000000001000
```

Self-heal also worked on zoned bricks in the test. With the brick process
on *server4* stopped, a 256 MiB file was written to the replica volume.
After `gluster volume start gvrep force` restarted the brick and
`gluster volume heal gvrep` ran, the healed copy on *server4* had the
source file's checksum and the `r` attribute:

```plaintext
# gluster volume heal gvrep info | grep -E "Brick|Number"
Brick server2:/data/disk1/rep
Number of entries: 0
Brick server3:/data/disk1/rep
Number of entries: 0
Brick server4:/data/disk1/rep
Number of entries: 0
```

## GlusterFS Features on Zoned XFS

The tested results for *GlusterFS* features that depend on the brick file
system:

| Feature | Result on zoned *XFS* |
|---------|-----------------------|
| Brick checks at *volume create* | Accepted without warnings; reports `File System: xfs` and `Inode Size: 512` |
| `trusted.*` xattrs, *.glusterfs* hard links | Work; stored as *XFS* metadata |
| Distribute, replicate, disperse, self-heal | Work |
| `fallocate` from clients | Fails with *Operation not supported* (zoned *XFS* has no persistent preallocation) |
| Hole punching (`fallocate -p`) | Works |
| `features.shard` | Works for written data; shard files are on the zoned device |
| `storage.reserve` (default 1%) | Accepted; see *Running full* in [Production Notes](#production-notes) |
| Direct I/O (`O_DIRECT`) from clients | Fails with the default volume options, also on non-zoned *XFS*; see [Troubleshooting](#troubleshooting) |
| Volume snapshots | Not supported: *GlusterFS* snapshots require bricks on thin-provisioned LVM |

*Snapshots*: `gluster snapshot create` requires each brick to be on its own
thin-provisioned LVM logical volume. A zoned *XFS* file system is created
directly on the zoned drive, so snapshot creation fails:

```plaintext
# gluster snapshot create snap1 gvdist no-timestamp
snapshot create: failed: Snapshots not supported for all bricks in volume gvdist.
Snapshot command failed
```

*Preallocation*: applications that require `fallocate()`, for example
virtual machine images created with full preallocation, fail on zoned
bricks. The error is returned to the client:

```plaintext
# fallocate -l 64M /mnt/gvdist/fa.bin
fallocate: fallocate failed: Operation not supported
```

## Production Notes

- **One XFS per drive.** Format each SMR disk or ZNS namespace as its own
  zoned *XFS* file system with one brick (or one brick directory per volume)
  on it. Do not combine zoned drives with LVM or RAID; use replicate or
  disperse volumes for redundancy across servers.

- **Metadata and configuration on conventional storage.** *glusterd* keeps
  the pool and volume configuration in */var/lib/glusterd*, and the daemons
  log to */var/log/glusterfs*. Keep both on the server's conventional system
  disk. For NVMe ZNS, the *XFS* metadata device holds the brick directories,
  xattrs and the *.glusterfs* tree, so size it for the expected number of
  files.

- **Health checks.** Every brick process writes a timestamp to
  *.glusterfs/health_check* every 30 seconds
  (`storage.health-check-interval`). On zoned *XFS*, each such write is a
  small out-of-place write to a sequential zone. The amount of data is
  small, but it leaves invalid blocks that garbage collection must reclaim.

- **Open zones.** *XFS* writes file data to at most one fewer zones than the
  device's open-zone limit. Concurrent writes to a brick, including writes
  from several volumes that share the drive, share this limit. Read it from
  *sysfs* and lower it with the *max_open_zones* mount option if required:

  ```plaintext
  # cat /sys/fs/xfs/sda/zoned/max_open_zones
  14
  ```

- **Running full.** In a fill test on the replica
  volume, writes continued until the zoned file systems were full and then
  failed with *No space left on device* at the client. The default
  `storage.reserve` of 1% did not stop writes before *XFS* reported
  *ENOSPC* in this test. After deleting half of the files, rewriting the
  freed space and reading all remaining files, all 54 files matched
  their source. To leave *XFS* more room for garbage collection, raise
  *zonegc_low_space*:

  ```plaintext
  # echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
  ```

  See [XFS tuning](/docs/filesystems/xfs#tuning).

- **Space reclaim after deletes.** *GlusterFS* removes the brick file and its
  *.glusterfs* hard link when a client deletes a file. In the test, *df* on
  the brick showed the space as free within seconds. *XFS* resets zones that
  no longer contain valid data and garbage-collects partially valid zones when
  free space runs low.

## Troubleshooting

### O_DIRECT Writes Fail with "Invalid argument"

With the default volume options, `dd ... oflag=direct` on the FUSE mount
failed:

```plaintext
# dd if=/dev/zero of=/mnt/gvdist/od.bin bs=1M count=8 oflag=direct
dd: IO error: Invalid input
```

The brick log showed writes at offsets that are not aligned to the 4 KiB
sector size:

```plaintext
E [MSGID: 113072] [posix-inode-fd-ops.c:2137:posix_writev] 0-gvdist-posix: write failed: offset 655344, [Invalid argument]
```

The same error occurred on a brick on a conventional (non-zoned) *XFS* file
system with 4 KiB sectors, so it is not specific to zoned storage. Any one
of the following volume options made `O_DIRECT` writes succeed on the zoned
bricks in the test:

```plaintext
# gluster volume set gvdist network.remote-dio enable
# gluster volume set gvdist performance.strict-o-direct on
# gluster volume set gvdist performance.write-behind off
```

`network.remote-dio` removes the `O_DIRECT` flag before the request reaches
the brick, so the brick writes through the page cache. With
`performance.strict-o-direct on`, the client honors `O_DIRECT` and does not
aggregate the writes. A file written with `O_DIRECT` after one of these
changes read back with the correct checksum.

### Volume Create Fails with "Brick may be containing or be contained by an existing brick"

```plaintext
volume create: gvtest: failed: Brick: server1:/data/disk1 not available. Brick may be containing or be contained by an existing brick.
```

Each brick must be a separate directory tree. Use a separate subdirectory of
the zoned file system for each volume, such as */data/disk1/brick* and
*/data/disk1/rep*, and do not use the mount point itself as a brick.

### Disperse Volume Create Asks "This configuration is not optimal"

`gluster volume create ... disperse 4 redundancy 1` prompts for
confirmation, because the number of data fragments (3) is not a power of
two. Use a configuration such as *disperse 3 redundancy 1* or *disperse 6
redundancy 2*, or answer `y` if the layout is intended.

### Files Are Not on the Zoned Device

If `xfs_io -c lsattr` does not show the `r` flag on brick files, check that
the drive was formatted with *zoned=1* in the *mkfs.xfs* output, that the
brick directory is on the zoned file system (`df /data/disk1/brick`), and
that the *rtinherit* flag (`t`) is set on the brick directory. See
[Placing Data on the Main Device](/docs/filesystems/xfs#placing-data-on-the-main-device).

## Learn More

- [GlusterFS documentation](https://docs.gluster.org/en/main/)
- [GlusterFS Quick Start Guide](https://docs.gluster.org/en/main/Quick-Start-Guide/Quickstart/)
- [Setting up GlusterFS volumes](https://docs.gluster.org/en/main/Administrator-Guide/Setting-Up-Volumes/)
- [Managing GlusterFS volume snapshots](https://docs.gluster.org/en/main/Administrator-Guide/Managing-Snapshots/)
- [GlusterFS source repository](https://github.com/gluster/glusterfs)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
