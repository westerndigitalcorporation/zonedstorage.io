---
id: index
title: Overview
sidebar_label: Overview
slug: /howtos
---

# How-To Guides

These guides cover installation, configuration and data verification for
storage systems using host-managed SMR hard disks or NVMe Zoned Namespace
(ZNS) SSDs.

Each zoned drive uses the [*XFS* file system](/docs/filesystems/xfs). *XFS*
handles sequential zone writes, zone resets and garbage collection. The
storage software uses ordinary file I/O and requires no zoned-device support.

## Available Guides

| Storage System | Type | What Goes on Zoned Storage |
| :------------- | :--- | :------------------------- |
| [*MinIO*](/docs/howtos/minio) | S3-compatible object storage | Object data on every drive of the MinIO server pool |
| [*BeeGFS*](/docs/howtos/beegfs) | Parallel cluster file system | File contents on the storage targets |
| [*HDFS*](/docs/howtos/hdfs) | Hadoop distributed file system | DataNode block files |
| [*JuiceFS*](/docs/howtos/juicefs) | POSIX file system on object storage | File data chunks in the object store |
| [*SeaweedFS*](/docs/howtos/seaweedfs) | Distributed object and file storage | Volume server volume files |
| [*Garage*](/docs/howtos/garage) | S3-compatible object storage | Object data blocks, one data directory per drive |
| [*RustFS*](/docs/howtos/rustfs) | S3-compatible object storage | Object data, object metadata and internal state, one file system per drive |
| [*AIStore*](/docs/howtos/aistore) | Object storage | Object files on the target mountpaths |
| [*GlusterFS*](/docs/howtos/glusterfs) | Distributed file system | Brick file contents |
| [*Longhorn*](/docs/howtos/longhorn) | Block storage for Kubernetes | Volume replica files (V1 data engine) |
| [*CubeFS*](/docs/howtos/cubefs) | Distributed file system (POSIX and S3) | DataNode extent files (replica volumes) |
| [*Apache Ozone*](/docs/howtos/ozone) | Distributed object store (S3, Hadoop) | Datanode container block files |

Separate metadata services, such as HDFS NameNodes, Ozone Managers, JuiceFS
metadata engines and the Garage metadata database, use conventional storage,
typically SSDs. MinIO and RustFS store their object metadata alongside the
data on the zoned drives.

## Before You Start

:::info System Requirements
- Linux kernel: 6.15+ with CONFIG_XFS_FS and CONFIG_XFS_RT enabled
- xfsprogs: 6.15+
:::

See [Linux Distributions](/docs/distributions/overview) and
[Getting Started](/docs/getting-started) for kernel and package requirements.

Without zoned hardware, use an emulated device in place of a physical drive.
See [Zoned Block Device Emulation](/docs/getting-started/zbd-emulation) for
*zloop* and *null_blk* setup.
