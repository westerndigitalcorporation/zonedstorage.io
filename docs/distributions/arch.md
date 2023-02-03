---
id: arch
title: Arch Linux
sidebar_label: Arch Linux
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# Arch Linux

*<a href="https://archlinux.org/" target="_blank">Arch Linux</a>* is an
independently developed, x86-64 general-purpose Linux distribution that strives
to provide the latest stable versions of most software by following a
rolling-release model. The default installation is a minimal base system,
configured by the user to only add what is purposely required.

Arch Linux uses a rolling release model, meaning that there are no major
updates to completely new versions of the system. A regular system update is
all that is needed to obtain the latest Arch software. The installation images
released every month by the Arch team are simply up-to-date snapshots of the
main system component.

## Supported Zoned Block Devices

Zoned block devices support for Arch is shown in the table below.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

The table below shows the file systems and device mappers enabled with the
latest kernel shipped with Arch.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Pre-Compiled Packages

The community-driven AUR (Arch User Repository) package repository provides
pre-compiled software packages for Arch-based Linux distribution users. The
packages that support zoned block devices are shown below.

* System utility packages:
    - *util-linux*
    - *nvme-cli*
    - *sg3-utils*

* Library related Packages:
    - *libzbd* (includes cli and gtk tools)
    - *util-linux-libs* (includes libblkid)

* File System related packages:
    - *btrfs-progs*
    - *f2fs-tools*
    - *zonefs-tools*

* Device Mapper related packages:
    - *dm-zoned-tools*
