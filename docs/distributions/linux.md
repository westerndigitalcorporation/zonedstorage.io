---
id: linux
title: Linux Distributions
sidebar_label: Linux Distributions
---

# Linux Distributions

As discussed [here](../linux/overview.md), the version and compile
time configuration of a Linux&reg; kernel enable support for zoned block
devices and the features supported. This section gives an overview of the
support provided by the pre-compiled binary kernels shipped with various Linux
distributions.

## Fedora Linux

*<a href="https://getfedora.org" target="_blank">Fedora&reg;</a>* is a Linux
distribution developed by the community-supported *Fedora Project* and primarily
sponsored by *<a href="https://www.redhat.com" target="_blank">
Red Hat&reg;</a>*.

The following table gives an overview of the kernel versions and configuration
used with the latest releases of the *Fedora* distribution. A more complete
list of kernel versions for all releases can be
found <a href="https://en.wikipedia.org/wiki/Fedora_(operating_system)"
target="_blank">here</a>.

<center>

|     Version     | Kernel | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* | *zonefs* | *btrfs* |
| :-------------: | :----: | :-----: | :------: | :----: | :--------: | :------: | :-----: |
| Fedora 26 (EOL) | 4.11   | <Yes/>  | <Yes/>   | <No/>  | <No/>      | <No/>    | <No/>   |
| Fedora 27 (EOL) | 4.13   | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     | <No/>    | <No/>   |
| Fedora 28 (EOL) | 4.16   | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     | <No/>    | <No/>   |
| Fedora 29 (EOL) | 4.18   | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     | <No/>    | <No/>   |
| Fedora 30 (EOL) | 5.0    | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     | <No/>    | <No/>   |
| Fedora 31 (EOL) | 5.3    | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     | <No/>    | <No/>   |
| Fedora 32 (EOL) | 5.6    | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     | <No/>    | <No/>   |
| Fedora 33 (EOL) | 5.8    | <Yes/>  | <Yes/>   | <Yes/> <br/> (after updates) | <Yes/> | <No/> | <No/> |
| Fedora 34 (EOL) | 5.11   | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     | <Yes/>   | <No/>    |
| Fedora 35       | 5.14   | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     | <Yes/>   | <Yes/>   |
| Fedora 36       | 5.17   | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     | <Yes/>   | <Yes/>   |

</center>

Support for the zoned block interface is present and enabled by default in the
binary kernel of all releases of *Fedora* since release 26. Starting with
release 27, the pre-compiled kernel packages also include the *dm-zoned*
device mapper target compiled as a loadable kernel module. Fedora 33 also
provides NVMe Zoned Namespace (ZNS) support after updating the distribution.
Detailed information on how to download and install *Fedora* can be
found <a href="https://docs.fedoraproject.org/en-US/fedora/f33/install-guide/"
target="_blank">here</a>.

## Debian

*<a href="https://www.debian.org" target="_blank">Debian</a>* is one of the
earliest Unix-like operating systems based on the Linux kernel. *Debian*
can be shipped with different operating system kernels, such as Linux,
*kFreeBSD* or *GNU Hurd*. The table below summarizes Debian Linux zoned
storage readiness for the most recent distribution releases.

<center>

|      Version      | Kernel | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :---------------: | :----: | :-----: | :------: | :----: | :--------: |
| 9 <br/> Stretch   | 4.9    | <No/>   | <No/>    | <No/>  | <No/>      |
| 10 <br/> Buster   | 4.19   | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     |
| 11 <br/> Bullseye | 5.10   | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     |

</center>

## Ubuntu

*<a href="https://www.ubuntu.com" target="_blank">Ubuntu</a>* is a popular free
and open-source Linux distribution originally based on *Debian*. *Ubuntu* is
released every six months with long-term support (LTS) releases every two years.

A complete list of the kernel versions shipped with *Ubuntu* releases can be
found <a href="https://en.wikipedia.org/wiki/Ubuntu_version_history#Table_of_versions"
target="_blank">here</a>. The table below summarizes zoned block device support
readiness for the most recent releases.

<center>

|     Version                      | Kernel | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :------------------------------: | :----: | :-----: | :------: | :----: | :--------: |
| 12.04 LTS <br/> Precise Pangolin | 3.2    | <No/>   | <No/>    | <No/>  | <No/>      |
| 14.04 LTS <br/> Trusty Tahr      | 3.13   | <No/>   | <No/>    | <No/>  | <No/>      |
| 16.04 LTS <br/> Xenial Xerus     | 4.4    | <No/>   | <No/>    | <No/>  | <No/>      |
| 17.04 <br/> Zesty Zapus          | 4.10   | <Yes/>  | <No/>    | <No/>  | <No/>      |
| 17.10 <br/> Artful Aardvark      | 4.13   | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 18.04 LTS <br/> Bionic Beaver    | 4.15   | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 18.10	<br/> Cosmic Cuttlefish    | 4.18   | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 19.04	<br/> Disco Dingo          | 5.0    | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 19.10	<br/> Eoan Ermine          | 5.3    | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 20.04	LTS <br/> Focal Fossa      | 5.4    | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 20.10	<br/> Groovy Gorilla       | 5.8    | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 21.04	<br/> Hirsute Hippo        | 5.11   | <Yes/>  | <Yes/>   | <Yes/> | <No/>      |
| 21.10	<br/> Impish Indri         | 5.13   | <Yes/>  | <Yes/>   | <Yes/> | <No/>      |
| 22.04	LTS <br/> Jammy Jellyfish  | 5.17   | <Yes/>  | <Yes/>   | <Yes/> | <No/>      |

</center>

## Red Hat Enterprise Linux

*<a href="https://www.redhat.com/" target="_blank">
Red Hat Enterprise Linux&reg;</a>*, often abbreviated *RHEL*, is a Linux
distribution developed by *Red Hat* and targeted toward the commercial server
market. *Red Hat Enterprise Linux* is released in server versions for several
micro architectures. 

The list of kernel versions shipped with all *RHEL* releases can be
found <a href="https://access.redhat.com/articles/3078" target="_blank">
here</a>.

### RHEL 9

The latest release 9 of *RHEL* is based on the kernel version 5.14.  The default
binary kernel shipped with the distribution is configured with zoned block
device support enabled, which enable using SMR and ZNS devices. However,
advanced features suh as the dm-zoned device mapper and file systems with zoned
block device support are not available.

<center>

| Version |  Kernel   | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :-----: | :-------: | :-----: | :------: | :----: | :--------: |
| RHEL 9  | 5.14.0-70 | <Yes/>  | <Yes/>   | <Yes/> | <No/>      |

</center>

Users who require a more complete support for zoned block devices can
[reconfigure and recompile the *RHEL* kernel](../linux/config.md). Using such
recompiled kernel may however conflict with *Red Hat* support. Users should
contact *Red Hat* support for more information.

### RHEL 8

*RHEL 8* is based on the kernel version 4.18 which includes zoned block device
support. However, as shown in the table below, this support is not enabled at
compile time for the default binary kernel shipped with the distribution.

<center>

| Version  |   Kernel   | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :------: | :--------: | :-----: | :------: | :----: | :--------: |
| RHEL 8   | 4.18.0-80  | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 8.1 | 4.18.0-147 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 8.2 | 4.18.0-193 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 8.3 | 4.18.0-240 | <No/>   | <No/>    | <No/>  | <No/>      |

</center>

Users who require zoned block device support can recompile the *RHEL* kernel
after [enabling zoned block device support](../linux/config.md). Using such
recompiled kernel may however conflict with *Red Hat* support. Users should
contact *Red Hat* support for more information.

### RHEL 7 and 6

As indicated in the table below, all releases of *RHEL 7* are based on the
kernel version 3.10 which lacks zoned block device support.

<center>

| Version  |   Kernel   | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :------: | :--------: | :-----: | :------: | :----: | :--------: |
| RHEL 7.0 | 3.10.0-123 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 7.1 | 3.10.0-229 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 7.2 | 3.10.0-327 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 7.3 | 3.10.0-514 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 7.4 | 3.10.0-693 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 7.5 | 3.10.0-862 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 7.6 | 3.10.0-957 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 7.7 | 3.10.0-1062 | <No/>  | <No/>    | <No/>  | <No/>      |
| RHEL 7.8 | 3.10.0-1127 | <No/>  | <No/>    | <No/>  | <No/>      |
| RHEL 7.9 | 3.10.0-1160 | <No/>  | <No/>    | <No/>  | <No/>      |

</center>

*RHEL 6* being based on the older kernel 2.6.32, zoned block devices are not
supported.

<center>

| Version  |   Kernel   | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :------: | :--------: | :-----: | :------: | :----: | :--------: |
| RHEL 6.0 | 2.6.32-71  | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.1 | 2.6.32-131 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.2 | 2.6.32-220 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.3 | 2.6.32-279 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.4 | 2.6.32-358 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.5 | 2.6.32-431 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.6 | 2.6.32-504 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.7 | 2.6.32-573 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.8 | 2.6.32-642 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.9 | 2.6.32-696 | <No/>   | <No/>    | <No/>  | <No/>      |
| RHEL 6.10 | 2.6.32-754 | <No/>  | <No/>    | <No/>  | <No/>      |
| RHEL 6 ELS+ | 2.6.32-754 | <No/> | <No/>   | <No/>  | <No/>      |

</center>

## CentOS

*<a href="https://www.centos.org/" target="_blank">CentOS</a>* is a community
maintained Linux distribution derived from the sources of *Red Hat Enterprise
Linux (RHEL)*. *CentOS* release versions follow closely *RHEL* releases, reusing
the same version and release numbers. More information on the distribution
releases and kernel versions can be
found <a href="https://en.wikipedia.org/wiki/CentOS" target="_blank">here</a>.

Due to this design approach, *CentOS* zoned block device support is
identical to that of *Red Hat Enterprise Linux*: zoned block device support
is not available by default with the pre-compiled kernels shipped with the
distribution.

However, third party repositories such as <a href="http://elrepo.org/tiki/HomePage"
target="_blank">The Community Enterprise Linux Repository</a> provide recent
kernels packages precompiled with zoned block device suport enabled. *elrepo*
provides kernels version 5.12 and 5.13 for *CentOS 7*, *CentOS 8* and
*CentOS 8 STream*.

<center>

| Version                  | Kernel | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :----------------------: | :----: | :-----: | :------: | :----: | :--------: |
| CentOS 7                 | 3.10   | <No/>   | <No/>    | <No/>  | <No/>      |
| CentOS 7 + elrepo        | 5.18   | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     |
| CentOS 8                 | 4.18   | <No/>   | <No/>    | <No/>  | <No/>      |
| CentOS 8 + elrepo        | 5.18   | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     |
| CentOS Stream 8          | 5.13   | <No/>   | <No/>    | <No/>  | <No/>      |
| CentOS Stream 8 + elrepo | 5.18   | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     |
| CentOS Stream 9          | 5.14   | <Yes/>  | <Yes/>   | <Yes/> | <No/>      |

</center>

## SUSE Linux Enterprise Server

*<a href="https://www.suse.com/products/server/" target="_blank">
SUSE Linux Enterprise Server (SLES)</a>* is a Linux-based operating system
developed by *SUSE&reg;*. *SLES* is designed primarily for servers, mainframes
and workstations. Major versions of *SLES* are released at an interval of 3 to
4 years while minor versions called "Service Packs" are released about every 12
months.

A complete list of the kernel versions used with *SLES* versions can be
found <a href="https://wiki.microfocus.com/index.php/SUSE/SLES/Kernel_versions"
target="_blank">here</a>. The following table only lists the most recent
versions under long term service support.

<center>

| Version | Kernel  | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :-----: | :-----: | :-----: | :------: | :----: | :--------: |
| 11.3    | 3.0.76  | <No/>   | <No/>    | <No/>  | <No/>      |
| 11.4    | 3.0.101 | <No/>   | <No/>    | <No/>  | <No/>      |
| 12.0    | 3.12    | <No/>   | <No/>    | <No/>  | <No/>      |
| 12.1    | 3.12    | <No/>   | <No/>    | <No/>  | <No/>      |
| 12.2    | 4.4     | <No/>   | <No/>    | <No/>  | <No/>      |
| 12.3    | 4.4     | <No/>   | <No/>    | <No/>  | <No/>      |
| 12.4    | 4.12    | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 15      | 4.12    | <Yes/>  | <Yes/>   | <No/>  | <No/>      |
| 15.1    | 4.12.14 | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     |
| 15.2    | 5.3.18  | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     |
| 15.3    | 5.3.18  | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     |

</center>

## openSUSE

*<a href="https://www.opensuse.org/" target="_blank">openSUSE</a>*, formerly
called *SUSE Linux* and *SuSE Linux Professional*, is a widely used Linux
distribution sponsored by SUSE Linux GmbH and other companies. *openSUSE* focus
is creating usable open-source tools for software developers and system
administrators while providing a user-friendly desktop and feature-rich server
environment.

*openSUSE* is available in a stable base with the *openSUSE Leap* version. The
*openSUSE Tumbleweed* is a rolling release which offers more up-to-date free
software.

The list of kernel versions shipped with openSUSE releases can be
found <a href="https://en.wikipedia.org/wiki/OpenSUSE_version_history"
target="_blank">here</a>. Zoned block device support with the shipped kernel
for the latest releases is shown in the table below.

<center>

| Version    | Kernel                     | ZBD API | ZBC, ZAC |  ZNS   | *dm-zoned* |
| :--------: | :------------------------: | :-----: | :------: | :----: | :--------: |
| Leap 15.0  | 4.12                       | <Yes/>  | <No/>    | <No/>  | <No/>      |
| Leap 15.1  | 4.12                       | <Yes/>  | <No/>    | <No/>  | <No/>      |
| Leap 15.2  | 5.3                        | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     |
| Leap 15.3  | 5.3                        | <Yes/>  | <Yes/>   | <No/>  | <Yes/>     |
| Tumbleweed | Latest Stable <br/> (5.9+) | <Yes/>  | <Yes/>   | <Yes/> | <Yes/>     |

</center>

export function Yes() {
  return (
    <span
      style={{
        color: '#00ff00'
      }}>
      Yes
    </span>
  );
}

export function No() {
  return (
    <span
      style={{
        color: '#ff0000'
      }}>
      No
    </span>
  );
}
