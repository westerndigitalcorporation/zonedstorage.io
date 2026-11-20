---
id: ubuntu
title: Ubuntu
sidebar_label: Ubuntu
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# Ubuntu

*<a href="https://www.ubuntu.com" target="_blank">Ubuntu</a>* is a
popular free and open-source Linux distribution, originally based on
*Debian*. *Ubuntu* is released every six months, with long-term
support (LTS) releases every two years.

A complete list of the kernel versions shipped with *Ubuntu* releases
can be found <a href="https://en.wikipedia.org/wiki/
Ubuntu_version_history#Table_of_versions"
target="_blank">here</a>.

## Supported Zoned Block Devices

The table below summarizes zoned block device support readiness for Ubuntu LTS
releases that are still supported by Canonical.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

The table below shows that the pre-compiled kernel shipped with Ubuntu LTS
releases offers support for the file systems and device mapper targets that
support zoned storage devices. Since release 22.04 LTS, this includes the
dm-zoned device mapper.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Pre-Compiled Packages

Since release 24.04 LTS, Ubuntu provides pre-compiled application and library
packages supporting zoned block devices.

Available packages are:

* System utilities packages:
    - *util-linux* (*blkzone* utility)
    - *nvme-cli*
    - *sg3-utils*

* Libraries related packages:
    - *libblkid1* (and *libblkid-dev*)
    - *libzbd2t64* (and *libzbd-dev*)
    - *zbd-utils* (includes both command line and graphical tools)

* File systems related packages:
    - *btrfs-progs*
    - *f2fs-tools*
    - *zonefs-tools*

* Device Mapper related packages:
    - *dm-zoned-tools*
