---
id: opensuse
title: openSuse
sidebar_label: openSuse
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# openSUSE

*<a href="https://www.opensuse.org/" target="_blank">openSUSE</a>*,
formerly called *SUSE Linux* and *SuSE Linux Professional*, is a widely
used Linux distribution sponsored by SUSE Linux GmbH and other companies.
*openSUSE's* focus is creating usable open-source tools for software
developers and system administrators while providing a user-friendly
desktop and feature-rich server environment.

openSUSE is available in a stable base with the openSUSE Leap version.
The openSUSE Tumbleweed is a rolling release which offers more up-to-date
free software.

The list of kernel versions shipped with openSUSE releases can be found
*<a href="https://en.wikipedia.org/wiki/OpenSUSE_version_history"
target="_blank">here</a>*.

## Supported Zoned Block Devices

Zoned block device support with the shipped kernel for the available releases
is shown in the table below.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

Starting with version 15.4, openSUSE Leap pre-compiled kernel includes loadable
modules for all file systems and device mapper targets that have zoned storage
support. As a bleeding-edge distribution, openSUSE Tumbleweed offers the same
support since the update to kernel version 5.9.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Pre-Compiled Packages

openSUSE provides a comprehensive set of pre-compiled application and library
packages supporting zoned block devices.

* System utilities packages:
    - *util-linux* (*blkzone* utility)
    - *nvme-cli*
    - *sg3_utils*

* Libraries related packages:
    - *libblkid1* (and *libblkid-devel*)
    - *libnvme1* (and *libnvme-devel*)
    - *libzbd* (and *libzbd-devel*)
    - *libzbd-cli-tools*
    - *libzbd-gtk-tools*

* File systems related packages:
    - *zonefs-tools*
    - *btrfsprogs*
    - *f2fs-tools*

* Device Mapper related packages:
    - *dm-zoned-tools*
