---
id: aistore
title: NVIDIA AIStore on Zoned Storage
sidebar_label: AIStore
---

# NVIDIA AIStore on Zoned Storage

*NVIDIA AIStore* (*AIS*) is a scale-out object storage system. A cluster
consists of *proxies* (gateways), which serve the API and own the cluster
map, and *targets*, which store objects. Each target stores objects as
regular files, with per-object metadata in extended attributes, on a set of
*mountpaths*. A mountpath is a directory on a local file system. *AIS*
requires each mountpath to be a separate file system, and recommends *XFS*.

Format each host-managed SMR disk or NVMe ZNS namespace with
[zoned *XFS*](/docs/filesystems/xfs) and configure each file system as one
target mountpath. Object contents go to the sequential zones. *XFS* metadata,
including the extended attributes that hold *AIS* object metadata, goes to
the disk's conventional zones (SMR) or a separate conventional device (ZNS).
The proxy and the target's own configuration directory stay on conventional
storage. *AIS* uses standard file I/O and needs no zoned-device support.

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
- *AIStore* 5.2 (release tag *v1.5.2*): *aisnode* built from source with Go
  1.27.3, *ais* CLI 1.34
- Tested on Linux 6.17.7 with xfsprogs 6.19.0, with one proxy and one target
  with four mountpaths on 16 GiB *zloop* devices
:::

## How It Fits Together

| Component | Stores | Placement |
|-----------|--------|-----------|
| Proxy (*aisnode -role=proxy*) | Cluster map, bucket metadata, cluster configuration in its *confdir* | Conventional storage (SSD) |
| Target (*aisnode -role=target*) | Configuration and copies of cluster metadata in its *confdir* | Conventional storage (SSD) |
| Target mountpaths | Objects under `<mountpath>/@ais/<bucket>/%ob/`, work files under `%wk/`, small metadata files (*.ais.vmd*, *.ais.bmd*, *.ais.smap*) at the mountpath root | One zoned *XFS* file system per drive |
| Object metadata (*user.ais.lom* xattr) | Checksum, version, size, copy locations | *XFS* metadata: conventional zones or ZNS metadata device |

```plaintext
              conventional SSD                       zoned drives (XFS)
       +----------------------------+   +-------------+       +-------------+
proxy  | /var/lib/ais/proxy         |   | /data/disk1 |  ...  | /data/disk4 |
       +----------------------------+   |  @ais/...   |       |  @ais/...   |
       +----------------------------+   +-------------+       +-------------+
target | /var/lib/ais/target        |         target mountpaths (fspaths)
       +----------------------------+
```

A target distributes objects across its mountpaths by object name. With
mirroring enabled on a bucket, a target keeps additional copies of each object
on other mountpaths. Erasure coding distributes slices across targets, not
mountpaths.

## Quick Start

These steps set up one proxy and one target with four zoned drives on one
host. Commands prefixed with `#` run as root. Commands prefixed with `$` run
as the `ais` account created in Step 1, in a login shell (`sudo -iu ais`),
which builds *AIS* in its home directory and owns the mountpaths.

### Step 1: Prepare Zoned XFS File Systems

Check the *XFS* [requirements](/docs/filesystems/xfs#system-requirements)
before formatting the drives.

For SMR disks (or any zoned device with conventional zones at the start of
its address space), format each whole disk with a label:

```plaintext
# mkfs.xfs -L AISDISK1 /dev/sda
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
# mkfs.xfs -L AISDISK2 /dev/sdb
# mkfs.xfs -L AISDISK3 /dev/sdc
# mkfs.xfs -L AISDISK4 /dev/sdd
```

*zoned=1* in the *realtime* section confirms the zoned realtime device. Create
the account that builds and runs *AIS*. The build in Step 2 needs a home
directory and Go in its `PATH`:

```plaintext
# useradd --create-home --user-group --shell /bin/bash ais
```

Mount the file systems with *noatime*, which the *AIS* performance guide
recommends, and give the `ais` account ownership:

```plaintext
# mkdir -p /data/disk{1..4}
# for i in 1 2 3 4; do mount -o noatime LABEL=AISDISK$i /data/disk$i; done
# chown ais:ais /data/disk{1..4}
# findmnt -t xfs -o SOURCE,TARGET,OPTIONS
SOURCE   TARGET      OPTIONS
/dev/sda /data/disk1 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdb /data/disk2 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdc /data/disk3 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
/dev/sdd /data/disk4 rw,noatime,attr2,inode64,logbufs=8,logbsize=32k,noquota,max_open_zones=15
```

The kernel log reports the zone count and open-zone limit for each file
system:

```plaintext
XFS (sda): EXPERIMENTAL zoned RT device feature enabled.  Use at your own risk!
XFS (sda): Mounting V5 Filesystem a0b461b9-937d-4da9-84fa-bee945f1c97e
XFS (sda): Ending clean mount
XFS (sda): 60 zones of 65536 blocks size (15 max open)
```

An NVMe ZNS namespace has no conventional zones. Place the *XFS* metadata on a
conventional block device, such as a conventional namespace or an SSD
partition, and specify the ZNS namespace as the realtime device:

```plaintext
# mkfs.xfs -L AISDISK1 -r rtdev=/dev/nvme0n2 /dev/nvme1n1
# mount -o noatime,rtdev=/dev/nvme0n2 LABEL=AISDISK1 /data/disk1
```

The ZNS commands were not tested for this guide. See
[XFS](/docs/filesystems/xfs#usage) for details on both cases.

:::tip
To try this setup without zoned drives, create emulated devices with *zloop*
as described in [Zoned Block Device
Emulation](/docs/getting-started/zbd-emulation) and use them in place of
*/dev/sda* to */dev/sdd*. This guide was tested with four 16 GiB *zloop*
devices with 256 MiB zones and four conventional zones each.
:::

To mount the file systems at boot, add one */etc/fstab* entry per drive (not
tested on the test host):

```plaintext
# SMR HDDs
LABEL=AISDISK1  /data/disk1  xfs  defaults,noatime  0  2
LABEL=AISDISK2  /data/disk2  xfs  defaults,noatime  0  2
LABEL=AISDISK3  /data/disk3  xfs  defaults,noatime  0  2
LABEL=AISDISK4  /data/disk4  xfs  defaults,noatime  0  2
# NVMe ZNS SSD with a conventional metadata device
LABEL=AISDISK1  /data/disk1  xfs  defaults,noatime,rtdev=/dev/nvme0n2  0  2
```

NVMe device names can change across reboots. Prefer a
*/dev/disk/by-id/nvme-...* name for the *rtdev=* option.

### Step 2: Build AIStore

The *v1.5.2* release assets contain the *ais* CLI
(*ais-linux-amd64.tar.gz*) but not the *aisnode* server binary. Build both
from the release tag. The *go.mod* file requires Go 1.27; if your installed
Go is older, select a toolchain explicitly:

```plaintext
$ git clone --depth 1 -b v1.5.2 https://github.com/NVIDIA/aistore.git
$ cd aistore
$ GOTOOLCHAIN=go1.27.3 make node cli
Building aisnode 38dfeb3 [build tags: mono]
...
*** To enable autocompletions in your current shell, run:
*** 'source cmd/cli/autocomplete/bash' or 'source cmd/cli/autocomplete/zsh'
$ ~/go/bin/aisnode -h 2>&1 | grep Version
  Version 5.2.38dfeb3 (build: 2026-11-03T16:05:50+0100)
$ ~/go/bin/ais version
version 1.34.38dfeb3 (build 2026-11-03T16:06:47+0100)
```

*make* writes the binaries to *$GOBIN*, or *$GOPATH/bin* (by default
*~/go/bin* of the `ais` account). Install them in */usr/local/bin*:

```plaintext
# install -m 755 ~ais/go/bin/aisnode ~ais/go/bin/ais /usr/local/bin/
```

### Step 3: Configure AIStore

Each node reads two files at startup: the initial cluster configuration
(`-config`) and its local configuration (`-local_config`). Create the
directories for configuration and logs on conventional storage:

```plaintext
# mkdir -p /etc/ais /var/lib/ais/{proxy,target} /var/log/ais/{proxy,target}
# chown -R ais:ais /etc/ais /var/lib/ais /var/log/ais
```

Create */etc/ais/ais.json*, the initial cluster configuration. The file
below was derived from the development deployment script
(*deploy/dev/local/aisnode_config.sh*). Sections that are not listed use the
*AIS* defaults; see the
[configuration documentation](https://github.com/NVIDIA/aistore/blob/main/docs/configuration.md).

```json
{
  "features": "0",
  "backend": {},
  "timeout": {
    "cplane_operation": "2s",
    "max_keepalive": "5s",
    "cold_get_conflict": "5s",
    "max_host_busy": "20s",
    "startup_time": "1m",
    "join_startup_time": "3m",
    "send_file_time": "5m",
    "ec_streams_time": "10m",
    "object_md": "2h"
  },
  "proxy": {
    "primary_url": "http://127.0.0.1:8080",
    "original_url": "http://127.0.0.1:8080",
    "discovery_url": "",
    "non_electable": false
  },
  "space": {
    "cleanupwm": 65,
    "lowwm": 75,
    "highwm": 90,
    "out_of_space": 95,
    "batch_size": 32768,
    "dont_cleanup_time": "120m"
  },
  "resilver": { "enabled": true },
  "memsys": {
    "min_free": "2gb",
    "default_buf": "32kb",
    "to_gc": "4gb",
    "hk_time": "3m",
    "min_pct_total": 0,
    "min_pct_free": 0
  },
  "versioning": { "enabled": true, "validate_warm_get": false },
  "net": {
    "l4": { "proto": "tcp", "sndrcv_buf_size": -1 },
    "http": {
      "use_https": false,
      "server_crt": "server.crt",
      "server_key": "server.key",
      "domain_tls": "",
      "client_ca_tls": "",
      "client_auth_tls": 0,
      "idle_conn_time": "6s",
      "idle_conns_per_host": 32,
      "idle_conns": 256,
      "write_buffer_size": 0,
      "read_buffer_size": 0,
      "chunked_transfer": true,
      "skip_verify": false
    },
    "use_ipv6": false
  },
  "auth": {},
  "log": {
    "level": "3",
    "max_size": "4mb",
    "max_total": "128mb",
    "flush_time": "10s",
    "stats_time": "60s",
    "to_stderr": false
  }
}
```

Create the proxy's local configuration, */etc/ais/proxy.json*. The public
port must differ from the intra-cluster ports:

```json
{
  "confdir": "/var/lib/ais/proxy",
  "log_dir": "/var/log/ais/proxy",
  "host_net": {
    "hostname": "127.0.0.1",
    "port": "8080",
    "port_intra_control": "9080",
    "port_intra_data": "10080"
  }
}
```

Create the target's local configuration, */etc/ais/target.json*. The
*fspaths* section lists the mountpaths, one per zoned *XFS* file system. The
empty string is the optional mountpath label. Because the proxy runs on the
same host in this example, the target uses different ports:

```json
{
  "confdir": "/var/lib/ais/target",
  "log_dir": "/var/log/ais/target",
  "host_net": {
    "hostname": "127.0.0.1",
    "port": "8081",
    "port_intra_control": "9081",
    "port_intra_data": "10081"
  },
  "fspaths": {
    "/data/disk1": "",
    "/data/disk2": "",
    "/data/disk3": "",
    "/data/disk4": ""
  }
}
```

### Step 4: Start the Cluster

Start the proxy first, then the target. `-ntargets=1` tells the primary proxy
how many targets to wait for at startup. The test ran both processes in the
foreground in separate terminals; a *systemd* service setup was not tested.

```plaintext
$ aisnode -config=/etc/ais/ais.json -local_config=/etc/ais/proxy.json -role=proxy -ntargets=1
E 16:08:11.768505 config:3734 Warning: load initial global config from /etc/ais/ais.json
```

```plaintext
$ aisnode -config=/etc/ais/ais.json -local_config=/etc/ais/target.json -role=target
E 16:08:16.619206 config:3734 Warning: load initial global config from /etc/ais/ais.json
```

The warning appears on first start, when the node has no persisted cluster
configuration yet. Point the *ais* CLI at the proxy and check the cluster:

```plaintext
$ export AIS_ENDPOINT=http://127.0.0.1:8080
$ ais show cluster
PROXY            MEM USED(%)     MEM AVAIL       SYS CPU(%)      UPTIME  STATUS
p[gGwtZpiv][P]   0.03%           43.25GiB        0%              -       online

TARGET           MEM USED(%)     MEM AVAIL       CAP USED(%)     CAP AVAIL       SYS CPU(%)      UPTIME  STATUS
t[uZyfRdPY]      0.03%           43.25GiB        0%              56.000GiB       9%              -       online

Cluster:
   CLI Endpoint:        http://127.0.0.1:8080
   Proxies:             1
   Targets:             1 (num disks: 4)
   Capacity:            used 24.00KiB (0%), available 56.00GiB
...
$ ais storage mountpath
uZyfRdPY
        Used: min= 0%, avg= 0%, max= 0%
                                        /data/disk1 /dev/sda(xfs)
                                        /data/disk2 /dev/sdb(xfs)
                                        /data/disk3 /dev/sdc(xfs)
                                        /data/disk4 /dev/sdd(xfs)
```

The target log (*/var/log/ais/target/aistarget.INFO*) shows the disks found
for each mountpath and the result of the extended attribute probe:

```plaintext
I 16:08:16.748688 dutils_linux:118 [/dev/sda]: [sda:{4096 0}]
...
W 16:08:16.754007 vinit:62 t[uZyfRdPY] VMD v1(uZyfRdPY, [/data/disk1 /data/disk4 /data/disk2 /data/disk3]) initialized
I 16:08:16.754068 fs:1302 volume: [56.00GiB, ssd]
I 16:08:16.781693 xattr_unix:102 max xattr size [ 65536 mp[/data/disk3, sdc, ssd] ]
```

*AIS* classifies each disk from its *rotational* attribute. The emulated
*zloop* devices report *ssd*; SMR disks are expected to report *hdd* (not
tested).

### Step 5: Write and Read Data

Create a bucket, upload a 256 MiB object and eight 1 MiB objects, and list
them with their checksums and locations:

```plaintext
$ ais bucket create ais://zbucket
"ais://zbucket" created
$ head -c 256M /dev/urandom > obj.bin
$ for i in $(seq 1 8); do head -c 1M /dev/urandom > small$i.bin; done
$ ais put obj.bin ais://zbucket/obj.bin
PUT "obj.bin" => ais://zbucket/obj.bin
$ ais put "small{1..8}.bin" ais://zbucket/small/ --yes
PUT 8 files => ais://zbucket/small/
$ ais ls ais://zbucket --props name,size,checksum,location
NAME                     SIZE            CHECKSUM                LOCATION
obj.bin                  256.00MiB       e19bec8e69d69270        t[uZyfRdPY]:mp[/data/disk1, sda, ssd]
small/small1.bin         1.00MiB         10cd336954e2e25f        t[uZyfRdPY]:mp[/data/disk2, sdb, ssd]
small/small2.bin         1.00MiB         94dc556d0bbaaeaa        t[uZyfRdPY]:mp[/data/disk4, sdd, ssd]
...
small/small8.bin         1.00MiB         e0240cb5695941b4        t[uZyfRdPY]:mp[/data/disk3, sdc, ssd]
```

*AIS* computes an *xxhash2* checksum on upload. Download the object, compare
SHA-256 checksums with the original, and read it again with *AIS*'s checksum
validation:

```plaintext
$ ais get ais://zbucket/obj.bin obj.down
GET obj.bin from ais://zbucket as obj.down (256.00MiB)
$ sha256sum obj.bin obj.down
5843e6d8d2be6a22f25244f359c2b3280650fde36826a91244436352dd6f71d5  obj.bin
5843e6d8d2be6a22f25244f359c2b3280650fde36826a91244436352dd6f71d5  obj.down
$ ais get ais://zbucket/obj.bin /dev/null --checksum
GET and discard obj.bin from ais://zbucket (256.00MiB)
```

### Step 6: Verify the Data Is on the Zoned Devices

Objects are regular files under `<mountpath>/@ais/<bucket>/%ob/`, with the
object name as the path:

```plaintext
$ cd /data/disk1
$ find . -maxdepth 4
.
./.ais.vmd
./.ais.smap
./@ais
./@ais/zbucket
./@ais/zbucket/%ch
./@ais/zbucket/%ut
./@ais/zbucket/%ds
./@ais/zbucket/%dw
./@ais/zbucket/%ob
./@ais/zbucket/%ob/obj.bin
./@ais/zbucket/%ob/small
./@ais/zbucket/%wk
./@ais/zbucket/%wk/small
./@ais/zbucket/%ec
./@ais/zbucket/%mt
./.ais.bmd.prev
./.ais.bmd
```

The object file has the *realtime* attribute (`r`). *xfs_bmap* shows its
extents on the realtime device; each realtime group (*RG*) is one zone. In
the test, the 256 MiB object filled one 256 MiB zone (RG 1) in 179 extents,
mostly 1 MiB each (*xfs_bmap* reports 512-byte units):

```plaintext
$ xfs_io -c lsattr @ais/zbucket/%ob/obj.bin
r---------------X @ais/zbucket/%ob/obj.bin
$ xfs_bmap -v @ais/zbucket/%ob/obj.bin
@ais/zbucket/%ob/obj.bin:
 EXT: FILE-OFFSET       RT-BLOCK-RANGE   RG RG-OFFSET        TOTAL
   0: [0..2047]:        2621448..2623495  1 (8..2055)         2048
   1: [2048..10239]:    2625544..2633735  1 (4104..12295)     8192
...
 177: [523456..524279]: 3144904..3145727  1 (523464..524287)   824
 178: [524280..524287]: 3145728..3145735  2 (0..7)               8
```

*AIS* stores the object metadata (checksum, version, size and copy
locations) in the *user.ais.lom* extended attribute, 221 bytes for this
object, and the target ID in *user.ais.daemon_id* on the mountpath root.
*XFS* keeps extended attributes with its metadata, not on the realtime
device:

```plaintext
$ getfattr -d -m - @ais/zbucket/%ob/obj.bin .
# file: @ais/zbucket/%ob/obj.bin
user.ais.lom=0sAgEr5QO6VgxF7QAAeHhoYXNoMuMvvQABZTE5YmVjOGU2OWQ2OTI3MOMvvQACMeMvvQADAAAAABAAAADjL70ABgAAAAAAAAAA4y+9AAcAA...

# file: .
user.ais.daemon_id="uZyfRdPY"
```

The zone report of the drive shows the full zone that holds the object and
two open zones that hold the smaller files:

```plaintext
# blkzone report /dev/sda | sed -n 5,8p
  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x080000 reset:0 non-seq:0, zcond:14(fu) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x001020 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x001000 reset:0 non-seq:0, zcond: 2(oi) [type: 2(SEQ_WRITE_REQUIRED)]
```

### Step 7: Mirror Objects Across Mountpaths

A bucket with mirroring enabled keeps the configured number of copies of each
object on different mountpaths of the same target. Enabling it starts a job
that copies the existing objects:

```plaintext
$ ais bucket props set ais://zbucket mirror.enabled=true mirror.copies=2
"mirror.enabled" set to: "true" (was: "false")

Bucket props successfully updated.
Started job n41CQ4qF1vX. To monitor the progress, run 'ais show job n41CQ4qF1vX'
$ ais object show ais://zbucket/obj.bin --props copies,location
PROPERTY         VALUE
copies           2 [/data/disk4 /data/disk1]
location         t[uZyfRdPY]:mp[/data/disk1, sda, ssd]
$ xfs_io -c lsattr /data/disk4/@ais/zbucket/%ob/obj.bin
r---------------X /data/disk4/@ais/zbucket/%ob/obj.bin
```

Erasure coding places slices on different targets and needs more than one
target. With a single target, the request fails:

```plaintext
$ ais bucket props set ais://zbucket ec.enabled=true ec.data_slices=2 ec.parity_slices=1
Error: ErrNotEnoughTargets: not enough target nodes: EC configuration (D = 2, P = 1) requires at least 4 targets (have 1).
```

Erasure coding was not tested on zoned *XFS* for this guide.

## AIStore Disk Checks on Zoned XFS

The tested target accepted zoned *XFS* mountpaths without changes:

- **File system type and ID.** At startup and on `mountpath attach`, *AIS*
  records the device, file system type and file system ID (*statfs* *f_fsid*)
  of each mountpath and refuses two mountpaths on the same file system. Each
  zoned *XFS* file system reports its own ID:

  ```plaintext
  $ ais storage mountpath show --json
  ...
                "/data/disk1": {
                      "mountpath_label": "",
                      "fs": {
                          "Fs": "/dev/sda",
                          "FsType": "xfs",
                          "FsID": "66339,0"
                      },
                      "disks": [
                          "sda"
                      ],
  ...
  ```

  Attaching a bind mount of an already-used file system was rejected:

  ```plaintext
  $ ais storage mountpath attach uZyfRdPY=/data/disk1x
  Error: FsID 66340,0: filesystem sharing is not allowed: mp[/data/disk1x, fs=/dev/sdb/xfs, unknown] vs "/data/disk2"
  ```

- **Extended attributes.** The target probes the maximum xattr size on
  startup. Zoned *XFS* reported 64 KiB (`max xattr size [ 65536 ...]` in the
  log above).

- **Direct I/O.** The filesystem health checker (*FSHC*) reads existing files
  and writes temporary files in `<mountpath>/.$deleted/fshc-on-err/` with
  *O_DIRECT*, followed by *fsync*. Run it on demand per mountpath:

  ```plaintext
  $ ais storage mountpath fshc uZyfRdPY=/data/disk1
  t[uZyfRdPY]: started filesystem health check on mountpath "/data/disk1"
  ```

  The target log shows the result:

  ```plaintext
  I 16:09:22.139013 fshc:301 3. write 4 temp files to /data/disk1/.$deleted/fshc-on-err
  I 16:09:22.187521 fshc:329 4. remove /data/disk1/.$deleted/fshc-on-err
  I 16:09:22.187559 fshc:185 mp[/data/disk1, sda, ssd] appears to be healthy
  ```

  All four mountpaths passed. Tracing the target with *strace* confirmed
  `openat(..., O_RDWR|O_CREAT|O_TRUNC|O_DIRECT|O_CLOEXEC)` calls for the
  health-check files.

- **No preallocation or reflink.** *AIS* does not call *fallocate()* or use
  reflink copies; no *fallocate* calls were seen while tracing uploads and
  health checks. Uploads write a work file under `%wk/` with buffered I/O.
  The [zoned XFS limitations](/docs/filesystems/xfs#limitations) on
  preallocation, reflink and quotas do not affect it.

## Production Notes

- **One file system per drive.** Format each SMR disk or ZNS namespace as a
  separate zoned *XFS* file system and list each as a mountpath. Do not
  combine zoned drives with LVM or RAID. Use mirroring within a target, or
  erasure coding or mirroring across targets, for redundancy.

- **Metadata on conventional storage.** Keep the proxy and target *confdir*
  directories on an SSD. The target also writes small copies of the cluster
  map and bucket metadata (*.ais.smap*, *.ais.bmd*, *.ais.vmd*) to each
  mountpath root; these files land on the zoned device, and their *XFS*
  metadata and the object xattrs stay on the conventional part of the file
  system.

- **Uneven fill across mountpaths.** *AIS* selects the mountpath by object
  name. In a test with about 700 objects of 64 MiB, one mountpath reached
  93% usage while the others were at 78% to 80%. Usage close to full
  increases the work *XFS* garbage collection has to do on that drive. The
  *AIS* capacity watermarks (*space.cleanupwm*, *lowwm*, *highwm*,
  *out_of_space*, 65/75/90/95% by default) apply to the target as a whole:
  above *highwm*, the target logs `_not_ running store cleanup: ... high-wm`
  warnings.

- **Space reclaim after deletes.** Deleted objects are removed from the file
  system immediately. In the test, `df` usage dropped within seconds after
  `ais object rm` and `ais rmo --prefix`. Deleting large objects left whole
  zones without valid data, and *XFS* reset them; an *XFS* trace of a refill
  after deleting about 20 GiB showed 16 to 20 zone resets per drive and no
  garbage-collection victim selection. Workloads that delete small objects
  mixed with long-lived ones leave partially valid zones that *XFS* garbage
  collection must copy. Raising *zonegc_low_space* starts garbage collection
  earlier:

  ```plaintext
  # echo 5 > /sys/fs/xfs/sda/zoned/zonegc_low_space
  ```

- **Open zones.** By default, *XFS* writes to at most the device's open-zone
  limit minus one (14 for the test devices, see
  `/sys/fs/xfs/sda/zoned/max_open_zones`). Concurrent uploads to one
  mountpath share this limit. For SMR disks, a lower *max_open_zones* mount
  option can improve throughput. See
  [XFS tuning](/docs/filesystems/xfs#tuning). The other *XFS* mount options
  from the *AIS* performance guide (*largeio*, *swalloc*, *allocsize*) were
  not tested on zoned *XFS*.

- **Restarts.** After a cluster shutdown (`ais cluster shutdown`), unmount
  and remount, the target found its mountpaths and all objects. A downloaded
  object matched its original SHA-256 checksum.

- **Tested load.** Repeated overwrites of 40 objects of 64 MiB, a fill to
  85% with interleaved objects, deletion of half of them and a refill to 93%
  completed without errors. All 695 remaining objects matched their SHA-256
  checksums.

## Troubleshooting

- **"go: download go1.27 for linux/amd64: toolchain not available".**
  *GOTOOLCHAIN=auto* tries to download the version in *go.mod* (*go 1.27*)
  without a patch level. Name a released toolchain, such as
  `GOTOOLCHAIN=go1.27.3`.

- **"http error code 'Service Unavailable'" right after startup.** The cluster
  is still starting (`ais show cluster` shows the *cluster-not-started-yet*
  alert). Wait a few seconds and retry.

- **"filesystem sharing is not allowed".** Two mountpaths are on the same
  file system. Use one zoned *XFS* file system per mountpath.

- **`ais put` with several files asks "[Y/N]" and cancels.** Multi-file
  uploads ask for confirmation. Add `--yes` in scripts.

- **Object files not on the zoned device.** If *xfs_io -c lsattr* does not
  show the `r` flag for files under `%ob/`, check that *mkfs.xfs* reported
  *zoned=1* and that the mountpath directory has the *rtinherit* flag (`t`):

  ```plaintext
  $ xfs_io -c lsattr /data/disk1
  -------t--------X /data/disk1
  ```

## Learn More

- [AIStore source repository](https://github.com/NVIDIA/aistore)
- [AIStore getting started](https://github.com/NVIDIA/aistore/blob/main/docs/getting_started.md)
- [AIStore configuration](https://github.com/NVIDIA/aistore/blob/main/docs/configuration.md)
- [AIStore performance tuning](https://github.com/NVIDIA/aistore/blob/main/docs/performance.md)
- [AIStore filesystem health checker](https://github.com/NVIDIA/aistore/blob/main/docs/fshc.md)
- [AIStore on-disk layout](https://github.com/NVIDIA/aistore/blob/main/docs/on_disk_layout.md)
- [XFS on zoned storage](/docs/filesystems/xfs)
- [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation)
