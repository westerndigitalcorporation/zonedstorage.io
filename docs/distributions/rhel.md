---
id: rhel
title: RHEL
sidebar_label: RHEL
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# Red Hat Enterprise Linux

*<a href="https://www.redhat.com/" target="_blank"> Red Hat Enterprise
Linux&reg;</a>*, often abbreviated *RHEL*, is a Linux distribution
developed by *Red Hat* and targeted toward the commercial server market.
*Red Hat Enterprise Linux* is released in server versions for several
micro architectures.
The list of kernel versions shipped with all RHEL releases can be
found <a href="https://access.redhat.com/articles/3078" target="_blank">
here</a>.

## Supported Zoned Block Devices

The latest release 9 of *RHEL* is based on the kernel version 5.14. The default
binary kernel shipped with the distribution is configured with zoned block
device support enabled, which enable using SMR and ZNS devices. Earlier versions
of *RHEL* do not have support for zoned storage enabled by default.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

Starting with release 9, *RHEL* pre-compiled kernel package includes loadable
module support for file systems and some device mapper targets supporting zoned
block devices. Support for the *dm-zoned* device mapper target is not enabled by
default.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Precompiled Packages

*RHEL 9* only provides support for zoned block devices with the "standard"
pre-compiled packages, that is, regular system tools and libraries packages.

* System utilities packages:
    - *util-linux* (*blkzone* utility)
    - *nvme-cli*
    - *sg3_utils*

* Libraries related packages:
    - *libblkid* (and *libblkid-devel*)

The file systems user utilities and libraries supporting zoned block devices
need to be compiled from source (e.g. *zonefs-tools*, *btrfs-progs*, and
*libzbd*). Since *RHEL 9* does not include support by default for the *dm-zoned*
device mapper target, compiling and installing the *dm-zoned-tools* project is
not necessary.

## Older RHEL Versions

*RHEL 8* is based on the kernel version 4.18 which includes zoned block device
support. However, this support is not enabled at compile time for the default
binary kernel shipped with the distribution.

All releases of *RHEL 7* are based on the kernel version 3.10 which lacks zoned
block device support.

*RHEL 6* being based on the older kernel 2.6.32, zoned block devices are
not supported.

Users who require a more complete support for zoned block devices can
reconfigure and recompile the RHEL kernel. Using such recompiled kernel may
however conflict with Red Hat support. Users should contact Red Hat support for
more information.
