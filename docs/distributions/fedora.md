---
id: fedora
title: Fedora
sidebar_label: Fedora
---

import {
KernelTableHeader,
FileSystemsDeviceMapperTableHeader,
KernelTabledata,
FileSystemDevicMapperTabledata
} from '/src/components/Distro';

# Fedora

*<a href="https://getfedora.org" target="_blank">Fedora&reg;</a>* is a
Linux distribution developed by the community-supported *Fedora Project*
and primarily sponsored by *<a
href="https://www.redhat.com" target="_blank">Red Hat&reg;</a>*.
Detailed information on how to download and install Fedora
can be found <a
href="https://docs.fedoraproject.org/en-US/fedora/f33/install-guide/"
target="_blank">here</a>.

The following tables give an overview of the kernel versions and
configuration used with the latest releases of the Fedora distribution.
A more complete list of kernel versions for all releases can be found <a
href="https://en.wikipedia.org/wiki/Fedora_Linux"
target="_blank">here</a>.

## Supported Zoned Block Devices

Support for the zoned block interface is present and enabled by default
in the binary kernel of all releases of Fedora since release 26. Fedora
33 was the first release to provide NVMe Zoned Namespace (ZNS) support
after updating the distribution.

As shown in the table below, recent Fedora releases provide support for
all types of zoned block devices.

<div>
    <table class="table-dist">
        <KernelTableHeader></KernelTableHeader>
        <KernelTabledata></KernelTabledata>
    </table>
</div>

## Supported File Systems and Device Mapper Targets

Starting with release 27, the precompiled kernel packages include the
*dm-zoned* device mapper target compiled as a loadable kernel module.

<div>
    <table class="table-dist">
        <FileSystemsDeviceMapperTableHeader>
        </FileSystemsDeviceMapperTableHeader>
        <FileSystemDevicMapperTabledata>
        </FileSystemDevicMapperTabledata>
    </table>
</div>

## Available Pre-Compiled Packages

Since Fedora release 34, a comprehensive set of pre-compiled application and
library packages support zoned block devices.

* System utilities packages:
    - *util-linux* (*blkzone* utility)
    - *nvme-cli*
    - *sg3_utils*

* Libraries related packages:
    - *libblkid* (and *libblkid-devel*)
    - *libnvme* (and *libnvme-devel*)
    - *libzbd* (and *libzbd-devel*)
    - *libzbd-cli-tools*
    - *libzbd-gtk-tools*

* File systems related packages:
    - *zonefs-tools*
    - *btrfs-progs*
    - *f2fs-tools*

* Device Mapper related packages:
    - *dm-zoned-tools*
