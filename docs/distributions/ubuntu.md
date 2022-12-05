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

The table below shows that the pre-compiled kernel shipped with Ubuntu only
offers partial support for file systems and device mapper targets that support
zoned storage devices. In particular, no LTS release offers support for the
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

Ubuntu does not provide all pre-compiled application packages supporting zoned
block devices. In particular, user utilities for the *zonefs* file system and
the *dm-zoned* device mapper target are not available (these utilities need to
be compiled from source).

Available packages are:

* System utilities packages:
    - *util-linux* (*blkzone* utility)
    - *nvme-cli*
    - *sg3-utils*

* Libraries related packages:
    - *libblkid1* (and *libblkid-dev*)
    - *libzbd2* (and *libzbd-dev*)
    - *zbd-utils* (includes both command line and graphical tools)

* File systems related packages:
    - *btrfs-progs*
    - *f2fs-tools*
