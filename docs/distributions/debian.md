---
id: debian
title: Debian
sidebar_label: Debian
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# Debian

*<a href="https://www.debian.org" target="_blank">Debian</a>* is one of
the earliest Unix-like operating systems based on the Linux kernel.
*Debian* can be shipped with different operating system kernels, such as
Linux, *kFreeBSD* or *GNU Hurd*.

## Supported File Systems and Device Mapper Targets

The table below shows the supported types of zoned block devices for the
most recent distribution releases.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

Starting with the *Bullseye* release, Debian offers support for all kernel
components currently supporting zoned block devices.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Pre-Compiled Packages

Debian does not provide all pre-compiled application packages supporting zoned
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
    - *libzbd1* (and *libzbd-dev*)
    - *zbd-utils* (includes both command line and graphical tools)

* File systems related packages:
    - *btrfs-progs*
    - *f2fs-tools*
