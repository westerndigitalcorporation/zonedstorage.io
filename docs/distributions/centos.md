---
id: centos
title: CentOS
sidebar_label: CentOS
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# CentOS

*<a href="https://www.centos.org/" target="_blank">CentOS</a>* is a community
maintained Linux distribution derived from the sources of *Red Hat Enterprise
Linux (RHEL)*. *CentOS* release versions follow closely *RHEL* releases, reusing
the same version and release numbers.

More information on the distribution releases and kernel versions can be
found <a href="https://en.wikipedia.org/wiki/CentOS" target="_blank">here</a>.

## Supported Zoned Block Devices

Due to this design approach, CentOS zoned block device support is identical to
that of Red Hat Enterprise Linux: zoned block device support is not available by
default with the precompiled kernel shipped with CentOS 7, CentOS 8 and CentOS
Stream 8, all of which have reached their end of life. CentOS Stream 9 and
CentOS Stream 10 kernels have zoned block device support enabled.

Third party repositories such
as <a href="http://elrepo.org/tiki/HomePage" target="_blank">
The Community Enterprise Linux Repository (elrepo)</a> also provide recent
kernels packages precompiled with zoned block device support enabled.

The table below shows the supported types of zoned block devices.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

As shown in the table below, *CentOS Stream 9* and *CentOS Stream 10* kernels
only include the *dm-linear*, *dm-flakey* and *dm-crypt* device mapper targets.
*CentOS Stream 10* also includes the *btrfs* file system. *f2fs*, *zonefs*, zoned
*XFS* and *dm-zoned* are not enabled.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Pre-Compiled Packages

The CentOS Stream 9 and CentOS Stream 10 distributions only provide support for
zoned block devices with the "standard" pre-compiled packages, that is, regular
system tools and libraries packages.

* System utilities packages:
    - *util-linux* (*blkzone* utility)
    - *nvme-cli*
    - *sg3_utils*

* Libraries related packages:
    - *libblkid* (and *libblkid-devel*)
    - *libnvme* (and *libnvme-devel*)

The user utilities related to file systems and device mapper targets supporting
zoned block devices need to be compiled from source (e.g. *zonefs-tools*,
*btrfs-progs*, *dm-zoned-tools*, etc).
