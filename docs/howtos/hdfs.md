---
id: hdfs
title: HDFS on Zoned Storage
sidebar_label: HDFS
---

# HDFS on Zoned Storage

The *Hadoop Distributed File System* (*HDFS*) splits files into blocks,
128 MiB by default, replicated across *DataNodes*. A *NameNode* stores the
namespace and block map. Each *DataNode* stores block replicas as local files
(`blk_<id>`) with checksum files (`blk_<id>_<genstamp>.meta`), in one directory
per drive.

Place the block directories on [*XFS*](/docs/filesystems/xfs) file systems on
host-managed SMR disks or NVMe ZNS SSDs. *HDFS* writes blocks sequentially,
with some appends and truncates. *XFS* handles sequential zone writes,
overwrites of checksum data and space reclamation. *HDFS* needs no
zoned-device support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- Apache Hadoop 3.5.0 (tested with the binary tarball release)
- Java 17: Hadoop 3.5 requires Java 17 on the server side (tested with
  Eclipse Temurin 17.0.21)
- Tested on kernel 6.17.7 with xfsprogs 6.19.0
:::

## How It Fits Together

A single-node (pseudo-distributed) *HDFS* deployment runs two daemons:

- **NameNode**: stores the namespace image (*fsimage*) and edit log in
  `dfs.namenode.name.dir`. This metadata requires frequent small synchronous
  writes and low latency. Losing it means losing the entire file system.
  Keep it on **conventional storage** (an SSD or a mirrored conventional
  disk), not on zoned drives. The same requirement applies to the
  *JournalNode* edits directory (`dfs.journalnode.edits.dir`) in a highly
  available deployment.
- **DataNode**: stores block replicas in the directories listed in
  `dfs.datanode.data.dir`. These directories hold most of the stored data.
  Place them on **zoned XFS**, with one *XFS* file system and one directory
  per zoned drive.

```plaintext
             conventional SSD                    zoned drives (XFS)
        +------------------------+     +-------------+  +-------------+
NameNode| /var/lib/hadoop/name   |     | /data/disk1 |  | /data/disk2 |
        +------------------------+     |  hdfs/data  |  |  hdfs/data  |
                                       +-------------+  +-------------+
                                          DataNode (dfs.datanode.data.dir)
```

## Quick Start

These steps configure a single-node *HDFS* cluster with block storage on a
zoned drive. Run commands prefixed with `#` as root and commands prefixed
with `$` as the `hadoop` account created in Step 1, in a login shell
(`sudo -iu hadoop`). The release is downloaded and extracted in its home
directory.

### Step 1: Prepare a Zoned XFS File System

Check the *XFS* [requirements](/docs/filesystems/xfs#system-requirements)
before formatting the drive.

For an SMR hard disk (or any zoned device with conventional zones at the start
of its address space), format the whole disk and mount it.

```plaintext
# mkfs.xfs /dev/sda
# mkdir -p /data/disk1
# mount /dev/sda /data/disk1
```

An NVMe ZNS SSD has no conventional zones and requires a separate conventional
block device for *XFS* metadata, such as a conventional namespace or a small
SSD partition. Specify the zoned device as the realtime device.

```plaintext
# mkfs.xfs -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mkdir -p /data/disk1
# mount -o rtdev=/dev/nvme0n2 /dev/nvme1n1 /data/disk1
```

See the [XFS](/docs/filesystems/xfs) page for details on both cases. The kernel
log confirms that the file system uses zoned storage:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem feb85e3e-24cb-423a-927a-51034f88f619
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

:::tip
To try this setup without a zoned drive, create an emulated device with
*zloop* as described in [Zoned Block Device
Emulation](/docs/getting-started/zbd-emulation) and use it in place of
`/dev/sda`. This guide was tested with 16 GiB *zloop* devices with 256 MiB
zones and 4 conventional zones.
:::

To mount the file system at boot, add it to */etc/fstab*. Prefer persistent
*/dev/disk/by-id/* names to */dev/sdX* names.

```plaintext
# SMR HDD
/dev/sda      /data/disk1  xfs  defaults                  0 0
# NVMe ZNS SSD with a conventional metadata device
/dev/nvme1n1  /data/disk1  xfs  defaults,rtdev=/dev/nvme0n2  0 0
```

Create the non-root account that runs *HDFS*, with a home directory for the
release tarball:

```plaintext
# useradd --create-home --user-group --shell /bin/bash hadoop
```

Create the *DataNode* directory on the zoned file system and a *NameNode*
directory on conventional storage, owned by the `hadoop` account:

```plaintext
# mkdir -p /data/disk1/hdfs/data /var/lib/hadoop/name
# chown -R hadoop:hadoop /data/disk1/hdfs /var/lib/hadoop
```

New files and directories inherit the *realtime* attribute (`t`, *rtinherit*)
from the file system root. This places the contents of *HDFS* files under
*/data/disk1* on the zoned device:

```plaintext
$ xfs_io -c lsattr /data/disk1/hdfs/data
-------t--------X /data/disk1/hdfs/data
```

### Step 2: Install Java and Hadoop

Hadoop 3.5 requires Java 17. Install a Java 17 JDK from your distribution or
from a tarball, such as [Eclipse Temurin](https://adoptium.net/). Download
the Hadoop binary release from an [Apache
mirror](https://hadoop.apache.org/releases.html), verify its checksum and
extract it.

```plaintext
$ curl -O https://dlcdn.apache.org/hadoop/common/hadoop-3.5.0/hadoop-3.5.0.tar.gz
$ curl -O https://downloads.apache.org/hadoop/common/hadoop-3.5.0/hadoop-3.5.0.tar.gz.sha512
$ cat hadoop-3.5.0.tar.gz.sha512
SHA512 (hadoop-3.5.0.tar.gz) = 04ab94496cc00c8b7a28d03f6308eff8d2a4e7f37a9da5e8e086e4d6fc990e7a94d661908f6a6136039536efb362614b8aecdef185b5fb8ed588f0b152c7aa16
$ sha512sum hadoop-3.5.0.tar.gz
04ab94496cc00c8b7a28d03f6308eff8d2a4e7f37a9da5e8e086e4d6fc990e7a94d661908f6a6136039536efb362614b8aecdef185b5fb8ed588f0b152c7aa16  hadoop-3.5.0.tar.gz
$ tar xzf hadoop-3.5.0.tar.gz
$ cd hadoop-3.5.0
```

Set `JAVA_HOME` in *etc/hadoop/hadoop-env.sh* to the root of the Java 17
installation, and check that Hadoop runs.

```plaintext
$ echo 'export JAVA_HOME=/opt/jdk-17' >> etc/hadoop/hadoop-env.sh
$ bin/hdfs version
Hadoop 3.5.0
Source code repository https://github.com/apache/hadoop.git -r dbcc7cd797100e6b32cd84f85b53a5193a5f9af0
Compiled by cnauroth on 2026-03-24T16:56Z
...
```

### Step 3: Configure HDFS

Edit *etc/hadoop/core-site.xml* to set the default file system:

```xml
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://localhost:9000</value>
  </property>
</configuration>
```

Edit *etc/hadoop/hdfs-site.xml* to place the *NameNode* metadata on
conventional storage and the *DataNode* blocks on the zoned file system. With
a single *DataNode*, the replication factor must be 1.

```xml
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>1</value>
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///var/lib/hadoop/name</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///data/disk1/hdfs/data</value>
  </property>
</configuration>
```

### Step 4: Format the NameNode and Start HDFS

Format the *NameNode* metadata directory (only once, before first use):

```plaintext
$ bin/hdfs namenode -format
...
INFO common.Storage: Storage directory /var/lib/hadoop/name has been successfully formatted.
...
```

Start the *NameNode* and *DataNode* daemons:

```plaintext
$ bin/hdfs --daemon start namenode
$ bin/hdfs --daemon start datanode
```

:::note
`sbin/start-dfs.sh` also starts the daemons (and a *SecondaryNameNode*), but
requires passphraseless *ssh* to localhost, as described in the Hadoop [Single
Node Setup](https://hadoop.apache.org/docs/r3.5.0/hadoop-project-dist/hadoop-common/SingleCluster.html)
guide. Daemon logs are written to the *logs/* directory of the installation.
:::

Check that the *DataNode* has registered and that its reported capacity
matches the zoned file system. The test device was a 16 GiB drive with
1 GiB of conventional zones and 14 GiB reported for data:

```plaintext
$ bin/hdfs dfsadmin -report
Configured Capacity: 15032385536 (14 GB)
Present Capacity: 15032373248 (14.00 GB)
DFS Remaining: 15032369152 (14.00 GB)
DFS Used: 4096 (4 KB)
DFS Used%: 0.00%
...
-------------------------------------------------
Live datanodes (1):

Name: 127.0.0.1:9866 (localhost)
Hostname: node1
Decommission Status : Normal
Configured Capacity: 15032385536 (14 GB)
DFS Used: 4096 (4 KB)
Non DFS Used: 12288 (12 KB)
DFS Remaining: 15032369152 (14.00 GB)
DFS Used%: 0.00%
DFS Remaining%: 100.00%
...
```

```plaintext
$ df -h /data/disk1
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda         14G     0   14G   0% /data/disk1
```

The *NameNode* web interface is available at `http://localhost:9870/`.

### Step 5: Write and Read Data

Create a home directory, upload a 1 GiB test file, download it again and
compare the checksums.

```plaintext
$ head -c 1G /dev/urandom > test.bin
$ bin/hdfs dfs -mkdir -p /user/hadoop
$ bin/hdfs dfs -put test.bin /user/hadoop/
$ bin/hdfs dfs -ls /user/hadoop
Found 1 items
-rw-r--r--   1 hadoop supergroup 1073741824 2026-11-03 14:16 /user/hadoop/test.bin
$ bin/hdfs dfs -get /user/hadoop/test.bin test-copy.bin
$ sha256sum test.bin test-copy.bin
af18c3b7756ba86b96a4fd276c9b97b5d97fc01328b31e68755ae38d055018a7  test.bin
af18c3b7756ba86b96a4fd276c9b97b5d97fc01328b31e68755ae38d055018a7  test-copy.bin
$ bin/hdfs dfs -checksum /user/hadoop/test.bin
/user/hadoop/test.bin	MD5-of-262144MD5-of-512CRC32C	00000200000000000004000099fd2cd33e2be8613797e86fdf42e4d7
```

### Step 6: Verify the Data Is on the Zoned Device

The 1 GiB file was stored as eight 128 MiB blocks. The block files are in the
*finalized* directory of the block pool on the zoned file system:

```plaintext
$ cd /data/disk1/hdfs/data/current/BP-*/current/finalized/subdir0/subdir0/
$ ls -l
total 1056832
-rw-rw-r-- 1 hadoop hadoop 134217728 Nov  3 14:16 blk_1073741825
-rw-rw-r-- 1 hadoop hadoop   1048583 Nov  3 14:16 blk_1073741825_1001.meta
-rw-rw-r-- 1 hadoop hadoop 134217728 Nov  3 14:16 blk_1073741826
-rw-rw-r-- 1 hadoop hadoop   1048583 Nov  3 14:16 blk_1073741826_1002.meta
...
-rw-rw-r-- 1 hadoop hadoop 134217728 Nov  3 14:16 blk_1073741832
-rw-rw-r-- 1 hadoop hadoop   1048583 Nov  3 14:16 blk_1073741832_1008.meta
```

The block file and its checksum file have the *realtime* attribute (`r`).
The *xfs_bmap* output shows the block file's extents on the realtime (zoned)
device in the *RT-BLOCK-RANGE* and realtime group (*RG*, one group per zone)
columns:

```plaintext
$ xfs_io -c lsattr blk_1073741825 blk_1073741825_1001.meta
r---------------X blk_1073741825
r---------------X blk_1073741825_1001.meta
$ xfs_bmap -v blk_1073741825
blk_1073741825:
 EXT: FILE-OFFSET       RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..4095]:        3670056..3674151  3 (40..4135)        4096
   1: [4096..6143]:     3676200..3678247  3 (6184..8231)      2048
...
  33: [106496..156151]: 3509632..3559287  2 (363904..413559) 49656
...
  45: [242208..262143]: 4264640..4284575  4 (70336..90271)   19936
```

The drive's zone report shows the write pointers after the 1 GiB upload in
this test: three 256 MiB zones are full, and a fourth zone's write pointer
has advanced.

```plaintext
# blkzone report /dev/sda
...
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0x0160a0 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000480000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
```

Return to the Hadoop installation directory before stopping the daemons:

```plaintext
$ bin/hdfs --daemon stop datanode
$ bin/hdfs --daemon stop namenode
```

## Production Notes

### Multiple Zoned Drives per DataNode

Format and mount each zoned drive as a separate *XFS* file system. List one
directory per drive in `dfs.datanode.data.dir`, separated by commas. Do not
combine zoned drives into one volume with LVM or RAID. *HDFS* distributes
blocks across the listed directories and uses replication across nodes for
redundancy.

```xml
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///data/disk1/hdfs/data,file:///data/disk2/hdfs/data,file:///data/disk3/hdfs/data</value>
  </property>
  <property>
    <name>dfs.datanode.du.reserved</name>
    <value>268435456</value>
  </property>
  <property>
    <name>dfs.datanode.failed.volumes.tolerated</name>
    <value>1</value>
  </property>
```

- `dfs.datanode.du.reserved` reserves space for non-*HDFS* use, in bytes
  per volume (default: 0). It can also be set per directory
  (`dfs.datanode.du.reserved./data/disk1/hdfs/data`). *XFS* reserves space
  internally for zone garbage collection, so it does not require this
  setting. Leaving additional free space per drive can reduce
  garbage-collection work when drives are nearly full.
- `dfs.datanode.failed.volumes.tolerated` sets how many volumes can fail
  before the *DataNode* stops (default: 0, so any failed drive stops the
  *DataNode*). With multiple drives per node, set it to allow the
  *DataNode* to continue serving the remaining drives after one fails.
- New blocks are distributed over the volumes in round-robin order by
  default. With drives of different capacity, consider
  `dfs.datanode.fsdataset.volume.choosing.policy` set to
  `org.apache.hadoop.hdfs.server.datanode.fsdataset.AvailableSpaceVolumeChoosingPolicy`.

### Block Writes, Appends, Truncates and Deletes

- *HDFS* writes a new block replica sequentially in the *rbw* directory,
  then renames it into *finalized*. It does not use preallocation
  (*fallocate*) and therefore does not require the persistent preallocation
  support that zoned *XFS* lacks.
- `hdfs dfs -appendToFile` moves the finalized replica back to *rbw*, appends
  data to the block file and rewrites the last checksum entry in the
  *.meta* file. `hdfs dfs -truncate` shortens the block file with
  *ftruncate*. Zoned *XFS* supports both operations by writing overwritten
  data to a new location. The garbage-collection work from these operations
  depends on how often the workload appends to or truncates files.
- *DataNodes* delete block files asynchronously after the *NameNode*
  invalidates them. *XFS* can reset zones with no valid data; its garbage
  collector reclaims partially valid zones when free space runs low.
- A 128 MiB block file can be split into several extents spread over a few
  zones, as in the *xfs_bmap* output above (where extents range from about
  300 KiB to 24 MiB; *xfs_bmap* reports 512-byte units).

### XFS Tuning

By default, *XFS* uses all but one of the drive's open zones for file writes.
Concurrent *DataNode* writers share this limit. Use the *max_open_zones*
mount option to lower it, or raise *zonegc_low_space* to start garbage
collection earlier. Read the current values from *sysfs*:

```plaintext
# cat /sys/fs/xfs/sda/zoned/max_open_zones
14
# cat /sys/fs/xfs/sda/zoned/zonegc_low_space
0
```

See the [XFS tuning section](/docs/filesystems/xfs#tuning) for details.

## Troubleshooting

### Writes Fail with "could only be written to 0 of the 1 minReplication nodes"

The client reports:

```plaintext
put: File /user/hadoop/f20.bin._COPYING_ could only be written to 0 of the 1 minReplication nodes. There are 1 datanode(s) running and 1 node(s) are excluded in this operation.
```

The corresponding *DataNode* log shows:

```plaintext
WARN org.apache.hadoop.hdfs.server.datanode.fsdataset.RoundRobinVolumeChoosingPolicy: The volume[file:/data/disk1/hdfs/data/] with the available space (=919229711 B) is less than the block size (=134217728 B).
...
org.apache.hadoop.util.DiskChecker$DiskOutOfSpaceException: Out of space: The volume with the most available space (=1071640562 B) is less than the block size (=134217728 B).
```

The default *HDFS* round-robin volume choosing policy requires more free
space than the block size alone. It accepts a new block only if the volume's
available space exceeds the block size plus
`dfs.datanode.round-robin-volume-choosing-policy.additional-available-space`
(1 GiB by default). This requirement is independent of zoned storage and
leaves about 1.1 GiB per drive unused, which is significant on small or
emulated drives. Delete data, add drives, or lower that setting. Deleted
space becomes available after the *DataNode* removes the block files and
*XFS* resets or garbage-collects the zones.

### Block Files Are Not on the Zoned Device

If `xfs_io -c lsattr` does not show the `r` flag on block files, the
*rtinherit* attribute was cleared on a parent directory, or
`dfs.datanode.data.dir` points to a directory that is not on the zoned file
system. Check the mount with `df` and the directory attributes with
`xfs_io -c lsattr`; see [Placing Data on the Main
Device](/docs/filesystems/xfs#placing-data-on-the-main-device).

### The NameNode or DataNode Does Not Start

Hadoop 3.5 requires Java 17 for its daemons. Check that `JAVA_HOME` in
*etc/hadoop/hadoop-env.sh* points to a Java 17 installation. Check the daemon
logs in the installation's *logs/* directory for startup errors.

## Learn More

- [Apache Hadoop 3.5.0 documentation](https://hadoop.apache.org/docs/r3.5.0/)
- [Hadoop Single Node Setup](https://hadoop.apache.org/docs/r3.5.0/hadoop-project-dist/hadoop-common/SingleCluster.html)
- [Hadoop Cluster Setup](https://hadoop.apache.org/docs/r3.5.0/hadoop-project-dist/hadoop-common/ClusterSetup.html)
- [HDFS Architecture](https://hadoop.apache.org/docs/r3.5.0/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html)
- [hdfs-default.xml configuration reference](https://hadoop.apache.org/docs/r3.5.0/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
