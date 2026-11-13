---
id: longhorn
title: Longhorn on Zoned Storage
sidebar_label: Longhorn
---

# Longhorn on Zoned Storage

*Longhorn* is a distributed block storage system for *Kubernetes*. It provides
persistent volumes and replicates each volume across nodes. The *V1 data
engine* stores each replica as a directory of sparse files on a node disk: a
*volume-head-NNN.img* file that receives new writes, one
*volume-snap-NAME.img* file per snapshot, and small *.meta* files.

Each node disk is a directory on a local *ext4* or *XFS* file system. Format
each host-managed SMR disk or NVMe ZNS namespace with
[zoned *XFS*](/docs/filesystems/xfs) and add its mount point to *Longhorn* as
a disk. The replica files are then stored in sequential zones. *XFS* handles
the random overwrites that *Longhorn* sends to the replica files, as well as
punching holes and reclaiming space. The *Longhorn* engine binaries, instance
managers and *Kubernetes* itself stay on the conventional root disk. The
*V2 data engine* (SPDK) uses raw block devices instead of a file system and
is not covered here.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *Longhorn* V1 data engine with its node prerequisites (*open-iscsi* and the
  *iscsid* daemon, an NFSv4 client such as *nfs-common*, *cryptsetup*,
  *dmsetup*)
- Tested with *Longhorn* 1.13.0 (Helm chart 1.13.0) on *k3s* v1.36.5+k3s1,
  in an Ubuntu 26.04.1 KVM guest with kernel 7.0.0-38-generic, xfsprogs
  6.18.0, open-iscsi 2.1.11 and nfs-common 2.8.5
:::

## How It Fits Together

| Component | Data | Placement |
|-----------|------|-----------|
| Replica files (*volume-head-NNN.img*, *volume-snap-NAME.img*, *.meta*) | Volume contents and snapshots | Zoned *XFS*, under `<disk>/replicas/<volume>-<id>/` |
| Disk marker (*longhorn-disk.cfg*) | Disk UUID | Zoned *XFS*, at the root of each disk |
| Engine binaries, instance manager state | *Longhorn* executables | Default data path */var/lib/longhorn* on the conventional root disk |
| *Longhorn* objects (volumes, replicas, settings) | Custom resources | *Kubernetes* API store (*etcd* or *k3s* SQLite) on conventional storage |
| Container images, kubelet state | *Kubernetes* node state | Conventional root disk |

The *Longhorn* engine exposes each volume to the workload node as a block
device (*/dev/longhorn/`<volume>`*) through a local iSCSI target. The
workload's file system, *ext4* by default, is created on that block device.
The replica process translates block writes into *O_DIRECT* writes at the
same offsets in the replica files. Zoned *XFS* places each write in a
sequential zone and remaps the file extent, so overwrites inside the volume do
not overwrite data in place on the drive.

Volume snapshots do not use reflink. A snapshot freezes the current head
file as *volume-snap-NAME.img* and creates a new empty sparse head file.
Space is freed by punching holes (`fallocate(FALLOC_FL_PUNCH_HOLE)`) into the
replica files and by deleting them.

```plaintext
                       conventional root disk                    zoned drives (XFS)
           +-----------------------------------------+   +-------------+  +-------------+
k3s/k8s    | /var/lib/rancher, /var/lib/kubelet      |   | /mnt/disk1  |  | /mnt/disk2  |
Longhorn   | /var/lib/longhorn (engine binaries)     |   |  replicas/  |  |  replicas/  |
           +-----------------------------------------+   +-------------+  +-------------+
                                                            Longhorn disks tagged "zoned"
```

## Quick Start

These steps add a zoned drive to an existing single-node *k3s* cluster,
install *Longhorn*, and run a pod with a persistent volume whose replica is
stored on the zoned drive. Run commands prefixed with `#` as root and
commands prefixed with `$` as a user with a *kubeconfig* for the cluster.

### Step 1: Prepare a Zoned XFS File System

For an SMR disk with conventional zones, format the whole disk and assign a
label for persistent mounts:

```plaintext
# mkfs.xfs -L LONGHORN1 /dev/sda
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
# mkdir -p /mnt/disk1
# mount -o noatime LABEL=LONGHORN1 /mnt/disk1
# findmnt /mnt/disk1
TARGET     SOURCE   FSTYPE OPTIONS
/mnt/disk1 /dev/sda xfs    rw,noatime,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
```

The *zoned=1* field identifies a zoned realtime device. The kernel log
reports the number of zones and the open-zone limit:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem 9de25a8b-cda9-405b-9d38-495b4fd85edd
XFS (sda): Ending clean mount
XFS (sda): limiting open zones to 15 due to total zone count (60)
XFS (sda): 60 zones of 65536 blocks (15 max open zones)
```

A ZNS namespace has no conventional zones. Place the *XFS* metadata on a
conventional block device, such as a conventional namespace or an SSD
partition, and specify the ZNS namespace as the realtime device. The ZNS
commands were not tested for this guide.

```plaintext
# mkfs.xfs -L LONGHORN1 -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mkdir -p /mnt/disk1
# mount -o noatime,rtdev=/dev/nvme0n2 LABEL=LONGHORN1 /mnt/disk1
```

See [XFS](/docs/filesystems/xfs#usage) for details on both cases.

:::tip
For emulated hardware, create a *zloop* device as described in
[Zoned Block Device Emulation](/docs/getting-started/zbd-emulation) and use it
in place of */dev/sda*. The examples used 16 GiB *zloop* devices with 256 MiB
zones and four conventional zones, created inside the KVM guest.
:::

*Longhorn* requires extra disks to be listed in */etc/fstab* so they are
mounted before *Longhorn* starts after a reboot. Add one entry per drive
(not tested in this guide):

```plaintext
LABEL=LONGHORN1  /mnt/disk1  xfs  defaults,noatime  0  2
```

For an NVMe ZNS drive, add the realtime device to the mount options:

```plaintext
LABEL=LONGHORN1  /mnt/disk1  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0  2
```

:::note
NVMe device names are not guaranteed to be stable across reboots. Prefer a
persistent name such as */dev/disk/by-id/nvme-...* for the *rtdev=* option.
Do not use a symbolic link as the *Longhorn* disk path. If the drive must
appear at another path, use a bind mount, as described in the
[*Longhorn* best practices](https://longhorn.io/docs/latest/best-practices/#setting-up-extra-disks).
:::

### Step 2: Install the Node Prerequisites

The V1 data engine attaches volumes through iSCSI and needs an NFSv4 client
for backups and ReadWriteMany volumes. On Ubuntu:

```plaintext
# apt-get install -y open-iscsi nfs-common cryptsetup dmsetup
# systemctl enable --now iscsid
```

Other requirements, such as mount propagation and the *bash*, *curl*,
*findmnt*, *blkid* and *lsblk* tools, are listed in the
[*Longhorn* installation requirements](https://longhorn.io/docs/latest/deploy/install/#installation-requirements).
The test used a single-node *k3s* cluster installed with the *k3s* install
script (`INSTALL_K3S_EXEC="--disable traefik"`).

### Step 3: Install Longhorn

Install *Longhorn* with Helm. On a single node, set the replica counts to 1.
On a multi-node cluster, keep the defaults.

```plaintext
$ helm repo add longhorn https://charts.longhorn.io
$ helm repo update
$ helm install longhorn longhorn/longhorn --version 1.13.0 \
    --namespace longhorn-system --create-namespace \
    --set defaultSettings.defaultReplicaCount=1 \
    --set persistence.defaultClassReplicaCount=1 \
    --set csi.attacherReplicaCount=1 --set csi.provisionerReplicaCount=1 \
    --set csi.resizerReplicaCount=1 --set csi.snapshotterReplicaCount=1 \
    --set longhornUI.replicas=1
...
Longhorn is now installed on the cluster!
$ kubectl -n longhorn-system rollout status ds/longhorn-manager
daemon set "longhorn-manager" successfully rolled out
```

*Longhorn* creates a default disk at */var/lib/longhorn/* on each node. That
directory also holds the engine binaries.

### Step 4: Add the Zoned Drive as a Longhorn Disk

Add */mnt/disk1* to the *Longhorn* node object with a *zoned* tag, and
disable scheduling on the default disk so new replicas go to the zoned drive.
Use the default disk's name from the node spec
(`kubectl -n longhorn-system get nodes.longhorn.io node1 -o yaml`). The same
change can be made in the *Longhorn* UI under **Node > Edit node and disks**
(not tested).

```plaintext
$ kubectl -n longhorn-system patch nodes.longhorn.io node1 --type merge -p '
spec:
  disks:
    zoned-disk1:
      path: /mnt/disk1
      allowScheduling: true
      diskType: filesystem
      storageReserved: 0
      tags: ["zoned"]
    default-disk-8f7cdc2509124a01:
      path: /var/lib/longhorn/
      allowScheduling: false
      diskType: filesystem
      storageReserved: 18376514764
      tags: []
'
node.longhorn.io/node1 patched
```

*Longhorn* detects the file system as *xfs* and reports the disk as ready:

```plaintext
$ kubectl -n longhorn-system get nodes.longhorn.io node1 \
    -o jsonpath='{.status.diskStatus.zoned-disk1}' | python3 -m json.tool
{
    "conditions": [
        {
            ...
            "message": "Disk zoned-disk1(/mnt/disk1) on node node1 is ready",
            "status": "True",
            "type": "Ready"
        },
        {
            ...
            "message": "Disk zoned-disk1(/mnt/disk1) on node node1 is schedulable",
            "status": "True",
            "type": "Schedulable"
        }
    ],
    "diskName": "zoned-disk1",
    "diskPath": "/mnt/disk1",
    "diskType": "filesystem",
    "filesystemType": "xfs",
    ...
    "storageAvailable": 14994636800,
    "storageMaximum": 15032385536,
    "storageScheduled": 0
}
# ls /mnt/disk1
longhorn-disk.cfg  replicas
```

### Step 5: Create a StorageClass, a Volume and a Pod

Create a StorageClass that selects disks with the *zoned* tag. The
*unmapMarkSnapChainRemoved* parameter lets trim requests from the workload
also free space in snapshots that were already marked as removed (see
[Space Reclaim](#space-reclaim-trim-snapshots-and-volume-deletion)). Save the
following as *longhorn-zoned.yaml*:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: longhorn-zoned
provisioner: driver.longhorn.io
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: Immediate
parameters:
  numberOfReplicas: "1"
  dataLocality: "best-effort"
  diskSelector: "zoned"
  fsType: "ext4"
  unmapMarkSnapChainRemoved: "enabled"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: zoned-pvc
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: longhorn-zoned
  resources:
    requests:
      storage: 4Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: zoned-app
spec:
  containers:
  - name: app
    image: busybox:1.37
    command: ["sleep", "infinity"]
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: zoned-pvc
```

Apply it and check that the replica was scheduled on the zoned disk:

```plaintext
$ kubectl apply -f longhorn-zoned.yaml
storageclass.storage.k8s.io/longhorn-zoned created
persistentvolumeclaim/zoned-pvc created
pod/zoned-app created
$ kubectl wait --for=condition=Ready pod/zoned-app --timeout=300s
pod/zoned-app condition met
$ kubectl -n longhorn-system get volumes.longhorn.io
NAME                                       DATA ENGINE   STATE      ROBUSTNESS   SCHEDULED   SIZE         NODE    AGE
pvc-f6ad9775-6795-4087-83c4-699cf7b68364   v1            attached   healthy                  4294967296   node1   17s
$ kubectl -n longhorn-system get replicas.longhorn.io \
    -o custom-columns=NAME:.metadata.name,DISK:.spec.diskPath
NAME                                                  DISK
pvc-f6ad9775-6795-4087-83c4-699cf7b68364-r-9841d0ef   /mnt/disk1
```

### Step 6: Write and Read Data

Write 1 GiB of random data into the volume and record its checksum. Then
delete and recreate the pod, so the volume is detached and attached again,
and compare the checksum:

```plaintext
$ kubectl exec zoned-app -- sh -c "dd if=/dev/urandom of=/data/test.bin bs=1M count=1024; sync; sha256sum /data/test.bin"
1073741824 bytes (1.0GB) copied, 3.823019 seconds, 267.9MB/s
69bf5932a75ec7a220e77e280c0c25e395e67444574db96177fb4d281b5919ed  /data/test.bin
$ kubectl delete pod zoned-app
pod "zoned-app" deleted from default namespace
$ kubectl apply -f longhorn-zoned.yaml
$ kubectl wait --for=condition=Ready pod/zoned-app --timeout=300s
$ kubectl exec zoned-app -- sha256sum /data/test.bin
69bf5932a75ec7a220e77e280c0c25e395e67444574db96177fb4d281b5919ed  /data/test.bin
```

### Step 7: Verify the Data Is on the Zoned Device

The replica directory contains a 4 GiB sparse head file. About 1.1 GiB is
allocated: the 1 GiB test file plus the *ext4* metadata inside the volume.

```plaintext
# cd /mnt/disk1/replicas/pvc-f6ad9775-6795-4087-83c4-699cf7b68364-3bba5577
# ls -ls
total 1181932
1181924 -rw-r--r-- 1 root root 4294967296 Nov  3 15:12 volume-head-000.img
      4 -rw-r--r-- 1 root root        126 Nov  3 15:11 volume-head-000.img.meta
      4 -rw-r--r-- 1 root root        160 Nov  3 15:11 volume.meta
```

All replica files have the *realtime* attribute (`r`). The *xfs_bmap* output
shows the head file's extents on the realtime (zoned) device in the
*RT-BLOCK-RANGE* and realtime group (*RG*, one group per zone) columns. The
holes are unwritten ranges of the sparse file.

```plaintext
# xfs_io -c lsattr *
r---------------X volume-head-000.img
r---------------X volume-head-000.img.meta
r---------------X volume.meta
# xfs_bmap -v volume-head-000.img
volume-head-000.img:
 EXT: FILE-OFFSET         RT-BLOCK-RANGE   RG RG-OFFSET          TOTAL
   0: [0..7]:             5510056..5510063  6 (267176..267183)       8
   1: [8..15]:            5509856..5509863  6 (266976..266983)       8
   2: [16..4111]:         3277168..3281263  2 (131440..135535)    4096
   3: [4112..4183]:       5509880..5509951  6 (267000..267071)      72
   4: [4184..4223]:       hole                                      40
   5: [4224..4231]:       3276944..3276951  2 (131216..131223)       8
   6: [4232..4239]:       5509952..5509959  6 (267072..267079)       8
   7: [4240..4359]:       hole                                     120
...
```

The zone report shows four full zones (`zcond:14(fu)`) and open zones with
advanced write pointers. In the test, *blkzone* (util-linux 2.41.3) printed
an invalid write pointer value for full zones; the zone condition identifies
them.

```plaintext
# blkzone report /dev/sda | sed -n 5,12p
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x000010 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0xffffffffffcfffff reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0xffffffffffc7ffff reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0xffffffffffbfffff reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000480000, len 0x080000, cap 0x080000, wptr 0xffffffffffb7ffff reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000500000, len 0x080000, cap 0x080000, wptr 0x0413f8 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000580000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

## Replica File I/O on Zoned XFS

Tracing the replica process with *strace* during volume creation, snapshots,
trim and snapshot deletion showed the following:

- **No preallocation.** New head files are opened with
  `O_RDWR|O_CREAT|O_TRUNC|O_DIRECT` and sized with *truncate()*, which creates
  a sparse file. The only *fallocate()* mode used was
  `FALLOC_FL_KEEP_SIZE|FALLOC_FL_PUNCH_HOLE`, which zoned *XFS* supports. The
  *longhorn-engine* source has no caller of the plain *fallocate()* helper in
  *sparse-tools*. The lack of persistent preallocation on zoned *XFS* (see
  [Limitations](/docs/filesystems/xfs#limitations)) therefore does not affect
  *Longhorn*.
- **Direct I/O.** Replica data is read and written with *O_DIRECT*. Zoned
  *XFS* accepted these writes without any configuration change.
- **No reflink.** Snapshots switch the replica to a new head file and do not
  share blocks between files.
- **Fragmentation.** Writes reach the replica at the volume's block offsets.
  After the 1 GiB sequential file write, the head file had about 570 extents,
  many of them 4 KiB *ext4* metadata blocks. After the overwrite test below,
  it had about 1,250 extents.

## Space Reclaim: Trim, Snapshots and Volume Deletion

*Longhorn* reclaims space by punching holes into replica files and by deleting
them. Zoned *XFS* then resets any zone that no longer contains valid data.
The following behavior was observed in the test, with the
*longhorn-zoned* StorageClass from Step 5.

**Trim.** Deleting a file inside the volume does not free space on the zoned
drive. Run *fstrim* on the volume's file system, either from the node on the
volume mount or with a *Longhorn*
[recurring filesystem-trim job](https://longhorn.io/docs/latest/nodes-and-volumes/volumes/trim-filesystem/).
*Longhorn* converts the discards into hole punches in the head file. In this
test, a 512 MiB file written after a snapshot was deleted and trimmed:

```plaintext
# ls -ls volume-head-001.img
524384 -rw-r--r-- 1 root root 4294967296 Nov  3 15:13 volume-head-001.img
# fstrim -v /var/lib/kubelet/plugins/kubernetes.io/csi/driver.longhorn.io/.../globalmount
/var/lib/kubelet/plugins/kubernetes.io/csi/driver.longhorn.io/.../globalmount: 2.9 GiB (3069906944 bytes) trimmed
# ls -ls volume-head-001.img
156 -rw-r--r-- 1 root root 4294967296 Nov  3 15:13 volume-head-001.img
# df -h /mnt/disk1
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda         14G  1.2G   13G   9% /mnt/disk1
```

Trim frees only data held by the head file and by snapshots already marked
as removed. Data captured in an active snapshot stays allocated.

**Snapshot deletion.** Deleting a snapshot that has another snapshot as its
child merges it into the child, and the snapshot file is deleted within a few
seconds. The newest snapshot, whose child is the volume head, cannot be merged
into the live head. *Longhorn* marks it as removed (`markRemoved: true`) and
keeps the file:

```plaintext
$ kubectl -n longhorn-system get snapshots.longhorn.io \
    -o custom-columns=N:.metadata.name,REMOVED:.status.markRemoved
N       REMOVED
snap2   true
```

In the test, the removed snapshot was merged automatically into the next
snapshot when one was created. Space held by a removed newest snapshot was
freed by deleting the data inside the volume and running *fstrim*. With
*unmapMarkSnapChainRemoved* enabled, the hole punches also apply to the
removed snapshot file. In this test, the drive went from 3.7 GiB to 1.2 GiB
used, and the number of empty zones rose from 20 to 41:

```plaintext
# ls -ls *.img
      0 -rw-r--r-- 1 root root 4294967296 Nov  3 15:21 volume-head-003.img
3803708 -rw-r--r-- 1 root root 4294967296 Nov  3 15:22 volume-snap-snap3.img
$ kubectl -n longhorn-system delete snapshots.longhorn.io snap3
$ kubectl exec zoned-app -- sh -c "rm /data/test3.bin; sync"
# fstrim -v /var/lib/kubelet/plugins/kubernetes.io/csi/driver.longhorn.io/.../globalmount
...: 2.5 GiB (2717888512 bytes) trimmed
# ls -ls *.img
    240 -rw-r--r-- 1 root root 4294967296 Nov  3 15:22 volume-head-003.img
1181928 -rw-r--r-- 1 root root 4294967296 Nov  3 15:22 volume-snap-snap3.img
# df -h /mnt/disk1
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda         14G  1.2G   13G   9% /mnt/disk1
```

The test file written before the snapshots was still intact after these
operations (same SHA-256 as in Step 6).

**Volume deletion.** Deleting the PVC (with `reclaimPolicy: Delete`) removed
the replica directories within about 30 seconds. *XFS* reset the freed zones:

```plaintext
$ kubectl delete pod zoned-app
$ kubectl delete pvc zoned-pvc
# ls /mnt/disk1/replicas /mnt/disk2/replicas
/mnt/disk1/replicas:

/mnt/disk2/replicas:
# df -h /mnt/disk1 /mnt/disk2
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda         14G  4.0K   14G   1% /mnt/disk1
/dev/sdb         14G  4.0K   14G   1% /mnt/disk2
```

## Production Notes

- **One XFS file system per drive.** Add each zoned drive as a separate
  *Longhorn* disk with the same tag and let *Longhorn* replicas provide
  redundancy across nodes. The *Longhorn* best practices suggest LVM to
  aggregate disks; for zoned drives, use one zoned *XFS* file system per SMR
  disk or ZNS namespace instead. In the test, raising a volume to two replicas
  rebuilt the second replica on a second zoned drive (*/mnt/disk2*), with the
  `r` attribute on all rebuilt files and an unchanged checksum. Replica
  rebuilds on one node required the *replica-soft-anti-affinity* setting,
  which should stay disabled on multi-node production clusters.

- **Keep Kubernetes and Longhorn system data on conventional storage.** The
  default data path */var/lib/longhorn* holds the engine binaries. Keep it on
  the conventional root disk and disable scheduling on the default disk, or
  remove it, so replicas use only the zoned disks. The *Kubernetes* API store
  (*etcd* or *k3s* SQLite), kubelet state and container images also belong on
  conventional storage.

- **Latency.** *Longhorn* documents HDDs as verified but recommends SSD or
  NVMe storage, because high latency can make volumes unstable under heavy
  I/O, during rebuilds and during backups. SMR disks have HDD latency, and
  *XFS* garbage collection adds background writes. Test rebuild and backup
  behavior under the expected load before using SMR disks for
  latency-sensitive volumes.

- **Over-provisioning and garbage collection.** Replica files are sparse, and
  *Longhorn*'s default *Storage Over Provisioning Percentage* lets the volume
  sizes exceed disk capacity. Overwrites inside a volume are written out of
  place on zoned *XFS*, and the old blocks become garbage until *XFS*
  reclaims them. In the test, an 11 GiB volume on a 14 GiB zoned disk (with
  *storage-minimal-available-percentage* lowered to 10) was filled with
  9.8 GiB five times, deleting the file in between without trim. All writes
  completed, and the final file's checksum was the same after a pod restart.
  Leave free space on each disk, run recurring trim jobs, and limit
  snapshot retention so that snapshot files do not pin overwritten data.

- **Open zones.** *XFS* limits concurrent data writes to one fewer than the
  device's open-zone limit (see `/sys/fs/xfs/<dev>/zoned/max_open_zones`).
  Each replica is one file, so a disk with many active volumes has many
  concurrent writers. For SMR disks, reducing *max_open_zones* with the mount
  option of the same name can improve throughput. See
  [XFS tuning](/docs/filesystems/xfs#tuning).

- **zonegc_low_space.** For volumes with frequent overwrites, raising
  *zonegc_low_space* starts *XFS* garbage collection earlier:

  ```plaintext
  # echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
  ```

- **Not tested.** Multi-node clusters, backups to S3 or NFS, ReadWriteMany
  volumes, volume encryption, NVMe ZNS devices, */etc/fstab* mounts at boot
  and node reboots were not tested for this guide.

## Troubleshooting

- **"Kubernetes cluster unreachable: Get "http://localhost:8080/version""
  from *helm* on a *k3s* node.** *helm* does not read the *k3s* kubeconfig by
  default. Set `export KUBECONFIG=/etc/rancher/k3s/k3s.yaml` (the *k3s*
  `--write-kubeconfig-mode 644` option makes it readable by non-root users).

- **"Permission denied" when listing replica directories.** Replica
  directories are created with mode 0700 and owned by root. Run *ls*,
  *xfs_io* and *xfs_bmap* on them as root.

- **Snapshot stays in the list after deletion.** The newest snapshot cannot
  be merged into the live volume head. It remains with `markRemoved: true`
  until the next snapshot is created, or its space is freed by trim when
  *unmapMarkSnapChainRemoved* is enabled. See
  [Space Reclaim](#space-reclaim-trim-snapshots-and-volume-deletion).

- **Space is not freed after deleting files in a volume.** The workload's
  file system does not discard deleted blocks by default. Run *fstrim* on the
  volume or configure a recurring trim job.

- **Replica files are not on the zoned device.** If *xfs_io -c lsattr* does
  not show the `r` flag for `volume-*.img` files, check that the drive was
  formatted with *zoned=1* in the *mkfs.xfs* output and that the *rtinherit*
  (`t`) flag is set on the disk directory (*xfs_io -c lsattr /mnt/disk1*).
  Also check that the replica is on the zoned disk
  (`kubectl -n longhorn-system get replicas.longhorn.io -o custom-columns=NAME:.metadata.name,DISK:.spec.diskPath`)
  and that scheduling is disabled on the default disk.

## Learn More

- [Longhorn documentation](https://longhorn.io/docs/latest/)
- [Longhorn installation requirements](https://longhorn.io/docs/latest/deploy/install/#installation-requirements)
- [Longhorn multiple disk support](https://longhorn.io/docs/latest/nodes-and-volumes/nodes/multidisk/)
- [Longhorn trim filesystem](https://longhorn.io/docs/latest/nodes-and-volumes/volumes/trim-filesystem/)
- [Longhorn best practices](https://longhorn.io/docs/latest/best-practices/)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
