---
id: sles
title: SLES
sidebar_label: SLES
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# SUSE Linux Enterprise Server

*<a href="https://www.suse.com/products/server/" target="_blank">
SUSE Linux Enterprise Server (SLES)</a>* is a Linux-based operating
system developed by *SUSE&reg;*. *SLES* is designed primarily for
servers, mainframes and workstations. Major versions of *SLES* are
released at an interval of 3 to 4 years, while minor versions called
"Service Packs" are released about every 12 months.

A complete list of the kernel versions used with SLES versions can be
found *<a href="https://www.suse.com/support/kb/doc/?id=000019587"
target="_blank">here</a>*.

## Supported Zoned Block Devices

The table below shows the supported types of zoned block devices for the
available distribution releases.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

Similarly to openSUSE Leap 15.4, SLES version 15.4 pre-compiled kernel now
includes loadable modules for all file systems and device mapper targets that
have zoned storage support.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Pre-Compiled Packages

SLES does not provide a complete set of pre-compiled application and library
packages supporting zoned block devices. In particular, a pre-compiled package
for the *zonefs* utilities is missing (*zonefs-tools* needs to be compiled from
source).

* System utilities packages:
    - *util-linux* (*blkzone* utility)
    - *nvme-cli*
    - *sg3_utils*

* Libraries related packages:
    - *libblkid1* (and *libblkid-devel*)
    - *libnvme1* (and *libnvme-devel*)

* File systems related packages:
    - *btrfsprogs*
    - *f2fs-tools*

* Device Mapper related packages:
    - *dm-zoned-tools*
