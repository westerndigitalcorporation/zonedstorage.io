---
id: overview
title: Linux Distributions
sidebar_label: Overview
---

# Linux Distributions

As discussed [here](../linux/overview.md), the version and compile time
configuration of a Linux&reg; kernel enable support for zoned block
devices and the features supported. Different Linux distributions are
configured differently, leading to varying levels of support for zoned
storage out of the box.

## Recommended Linux Distributions

Recent versions of the following Linux distributions provide very good
support for zoned storage. The support provided by the precompiled
binary kernels shipped is complete, and zoned storage related binary
packages are available. Their use is recommended to facilitate
development and testing of applications.

 - [Fedora](../distributions/fedora.md)
 - [openSuse](../distributions/opensuse.md)

## Other Linux Distributions

All major Linux distributions provide some level of zoned storage
support. Use the following links to learn more.

 - [Ubuntu](../distributions/ubuntu.md)
 - [Debian](../distributions/debian.md)
 - [SLES](../distributions/sles.md)
 - [CentOS](../distributions/centos.md)
 - [RHEL](../distributions/rhel.md)
 - [Arch Linux](../distributions/arch.md)

## Checking a Linux Distribution

The <a href="https://github.com/westerndigitalcorporation/zbd-tools"
target="_blank">*zbd-tools* project</a> hosted on GitHub provides the
*zbd-check* utility to facilitate determining the zoned storage related
features, libraries and applications that a Linux distribution supports.

### *zbd-tools* Overview

*zbd-tools* provides the *zbd-check* utility. This command line tool
checks the following:
* Kernel features enabled: zoned block device types supported (SMR,
NVMe ZNS, *nullblk*, etc.), file systems and device mapper targets.
* Presence of the kernel zone management API header file.
* User libraries installed.
* User applications installed.

All checks are performed for the system where *zbd-check* is executed.

To learn more about how to install and use *zbd-check*,
see <a href="https://github.com/westerndigitalcorporation/zbd-tools/blob
/master/README.md" target="_blank">the project README file</a>.

### Example

The following shows an example of the information provided by
*zbd-check* when executed on a Fedora 37 system with all zoned storage
related packages installed.

```
$ zbd-check
------------------------------------------------------------------------
System Information:
------------------------------------------------------------------------
- Distribution: Fedora Linux 37 (Workstation Edition)
- Kernel Version: 6.0

------------------------------------------------------------------------
Kernel features:
------------------------------------------------------------------------
- Zoned block devices: supported
- Devices types:
    - SAS and SATA SMR hard-disks: supported
    - NVMe ZNS devices: supported
    - SCSI debug device ZBC emulation: supported
    - null_blk device zoned mode: supported
- file systems:
    - zonefs: supported
    - f2fs zoned mode: supported
    - btrfs zoned mode: supported
- Device mapper targets:
    - dm-linear: supported
    - dm-flakey: supported
    - dm-crypt: supported
    - dm-zoned: supported

------------------------------------------------------------------------
User Kernel zone management API:
------------------------------------------------------------------------
- Zone management kernel API header file: installed

------------------------------------------------------------------------
User Libraries:
------------------------------------------------------------------------
- libzbc:
    - Dynamic library installed, version 5.13.0
    - Static library installed
    - Development header files installed
- libzbd:
    - Dynamic library installed, version 2.0.2
    - Static library installed
    - Development header files installed
- libnvme:
    - Dynamic library installed, version 1.2
    - Static library not installed
    - Development header files installed

------------------------------------------------------------------------
User Applications:
------------------------------------------------------------------------
- fio: installed, version fio-3.29-7-g01686
- nvme-cli: installed, version 2.2.1
- dm-zoned-tools: installed, version 2.2.1
- zonefs-tools: installed, version 1.5.2
```
