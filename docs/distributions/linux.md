# Linux Distributions

As discussed [here](../linux/overview.md), the version and compile
time configuration of a Linux&reg; kernel defines the level of support for zoned
block devices. This section gives an overview of the support provided by the
pre-compiled binary kernels shipped with various Linux distributions.

## Fedora Linux

<a href="https://getfedora.org" target="_blank">*Fedora&reg;*</a>
is a Linux distribution developed by the
community-supported *Fedora Project* and sponsored by
<a href="https://www.redhat.com" target="_blank">*Red Hat&reg;*</a>


The following table gives an overview of the kernel versions and configuration
used with the latest releases of the *Fedora* distribution. A more complete
list of kernel versions for all releases can be found
<a href="https://en.wikipedia.org/wiki/Fedora_(operating_system)" target="_blank">here</a>.

<center>

| Distribution version | Initial Kernel version | ZBD support | *dm-zoned* support | ZNS support |
| -------------------- | ---------------------- | ----------- | ------------------ | ----------- |
| Fedora 26 (EOL) | 4.11 | <span style="color:green">YES</span> | <span style="color:red">No</span> | <span style="color:red">No</span> |
| Fedora 27 (EOL) | 4.13 | <span style="color:green">YES</span> | <span style="color:green">YES</span> | <span style="color:red">No</span> |
| Fedora 28 | 4.16 | <span style="color:green">YES</span> | <span style="color:green">YES</span> | <span style="color:red">No</span> |
| Fedora 29 | 4.18 | <span style="color:green">YES</span> | <span style="color:green">YES</span> | <span style="color:red">No</span> |
| Fedora 30 | 5.0 | <span style="color:green">YES</span> | <span style="color:green">YES</span> | <span style="color:red">No</span> |
| Fedora 31 | 5.3 | <span style="color:green">YES</span> | <span style="color:green">YES</span> | <span style="color:red">No</span> |
| Fedora 32 | 5.6 | <span style="color:green">YES</span> | <span style="color:green">YES</span> | <span style="color:red">No</span> |
| Fedora 33 | 5.8 | <span style="color:green">YES</span> | <span style="color:green">YES</span> | <span style="color:green">YES</span> (after updates) |

</center>

Support for the zoned block interface is present and enabled by default in the
binary kernel of all releases of *Fedora* since release 26. Starting with
release 27, the pre-compiled kernel packages also include the *dm-zoned*
device mapper target compiled as a loadable kernel module. Fedora 33 also
provides NVMe Zoned Namespace (ZNS) support after updating the distribution.
Detailed information on how to download and install *Fedora* can be found
<a href="https://docs.fedoraproject.org/en-US/fedora/f33/install-guide/" target="_blank">here</a>.

## Debian

<a href="https://www.debian.org" target="_blank">*Debian*</a> is one of the
earliest Unix-like operating systems based on the Linux kernel. *Debian*
can be shipped with different operating system kernels, such as Linux,
*kFreeBSD* or *GNU Hurd*. The table below summarizes Debian Linux ZBD readiness
for the most recent distribution releases.

<center>

| Distribution version | Kernel version | ZBD support | *dm-zoned* support |
| -------------------- | -------------- | ----------- | ------------------ |
| 9 (Stretch) |	4.9 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 10 (Buster) |	4.19 |  <span style="color:green">YES</span> | <span style="color:green">YES</span> |

</center>

## Ubuntu

<a href="https://www.ubuntu.com" target="_blank">*Ubuntu*</a> is a popular free
and open-source Linux distribution originally based on *Debian*. *Ubuntu* is
released every six months with long-term support (LTS) releases every two years.

A complete list of the kernel versions shipped with *Ubuntu* releases can be
found <a href="https://en.wikipedia.org/wiki/Ubuntu_version_history#Table_of_versions"
target="_blank">here</a>. The table below summarizes zoned block device support
readiness for the most
recent releases.

<center>

| Distribution version | Kernel version | ZBD support | *dm-zoned* support |
| -------------------- | -------------- | ----------- | ------------------ |
| 12.04 LTS (Precise Pangolin) | 3.2 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 14.04 LTS (Trusty Tahr) | 3.13 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 16.04 LTS (Xenial Xerus) | 4.4 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 17.04 (Zesty Zapus) | 4.10 | <span style="color:green">YES</span> | <span style="color:red">No</span> |
| 17.10 (Artful Aardvark) | 4.13 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 18.04 LTS (Bionic Beaver) | 4.15 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 18.10	(Cosmic Cuttlefish) | 4.18 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 19.04	(Disco Dingo) | 5.0 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 19.10	(Eoan Ermine) | 5.3 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 20.04	LTS (Focal Fossa) | 5.4 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 20.10	(Groovy Gorilla) | 5.8 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |

</center>

## Red Hat Enterprise Linux

<a href="https://www.redhat.com/" target="_blank">
*Red Hat Enterprise Linux&reg;*</a>, often abbreviated *RHEL*, is a Linux
distribution developed by *Red Hat* and targeted toward the commercial server
market. *Red Hat Enterprise Linux* is released in server versions for several
micro architectures. 

The list of kernel versions shipped with all *RHEL* releases can be found
<a href="https://access.redhat.com/articles/3078" target="_blank">here</a>.

### RHEL 8

The latest release 8 of *RHEL* is based on the kernel version 4.18 which
includes zoned block device support. However, as shown in the table below, this
support is not enabled at compile time for the binary kernel shipped with the
distribution.

<center>

| Distribution version | Kernel version | ZBD support | *dm-zoned* support |
| -------------------- | -------------- | ----------- | ------------------ |
| RHEL 8 | 4.18.0-80 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 8.1 | 4.18.0-147 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 8.2 | 4.18.0-193 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 8.3 | 4.18.0-240 | <span style="color:red">No</span> | <span style="color:red">No</span> |

</center>

Users who require zoned block device support can recompile the *RHEL* kernel
after [enabling zoned block device support](../linux/config.md). Using such
recompiled kernel may however conflict with *Red Hat* support. Users should
contact *Red Hat* support for more information.

### RHEL 7 and 6

As indicated in the table below, all releases of *RHEL 7* are based on the
kernel version 3.10 which lacks zoned block device support.

<center>

| Distribution version | Kernel version | ZBD support | *dm-zoned* support |
| -------------------- | -------------- | ----------- | ------------------ |
| RHEL 7.0 | 3.10.0-123 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.1 | 3.10.0-229 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.2 | 3.10.0-327 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.3 | 3.10.0-514 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.4 | 3.10.0-693 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.5 | 3.10.0-862 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.6 | 3.10.0-957 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.7 | 3.10.0-1062 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.8 | 3.10.0-1127 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 7.9 | 3.10.0-1160 | <span style="color:red">No</span> | <span style="color:red">No</span> |

</center>

*RHEL 6* being based on the older kernel 2.6.32, zoned block devices are not
supported.

<center>

| Distribution version | Kernel version | ZBD support | *dm-zoned* support |
| -------------------- | -------------- | ----------- | ------------------ |
| RHEL 6.0 | 2.6.32-71 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.1 | 2.6.32-131 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.2 | 2.6.32-220 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.3 | 2.6.32-279 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.4 | 2.6.32-358 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.5 | 2.6.32-431 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.6 | 2.6.32-504 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.7 | 2.6.32-573 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.8 | 2.6.32-642 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.9 | 2.6.32-696 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6.10 | 2.6.32-754 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| RHEL 6 ELS+ | 2.6.32-754 | <span style="color:red">No</span> | <span style="color:red">No</span> |

</center>

## CentOS

<a href="https://www.centos.org/" target="_blank">*CentOS*</a> is a community
maintained Linux distribution derived from the sources of *Red Hat Enterprise
Linux (RHEL)*. *CentOS* release versions follow closely *RHEL* releases, reusing
the same version and release numbers. More information on the distribution
releases and kernel versions can be found <a href="https://en.wikipedia.org/wiki/CentOS"
target="_blank">here</a>.

Due to this design approach, *CentOS* zoned block device support level is
identical to that of *Red Hat Enterprise Linux*. There is currently no zoned
block device support available with the pre-compiled kernels shipped with the
distribution.

## SUSE Linux Enterprise Server

<a href="https://www.suse.com/products/server/" target="_blank">
*SUSE Linux Enterprise Server (SLES)*</a> is a Linux-based operating system
developed by *SUSE&reg;*. *SLES* is designed primarily for servers, mainframes and
workstations. Major versions of *SLES* are released at an interval of 3 to 4
years while minor versions called "Service Packs" are released about every 12
months.

A complete list of the kernel versions used with *SLES* versions can be found
<a href="https://wiki.microfocus.com/index.php/SUSE/SLES/Kernel_versions"
target="_blank">here</a>. The following table only lists the most recent
versions under long term service support.

<center>

| Distribution version | Kernel version | ZBD support | *dm-zoned* support |
| -------------------- | -------------- | ----------- | ------------------ |
| 11.3 | 3.0.76 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 11.4 | 3.0.101 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 12.0 | 3.12 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 12.1 | 3.12 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 12.2 | 4.4 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 12.3 | 4.4 | <span style="color:red">No</span> | <span style="color:red">No</span> |
| 12.4 | 4.12 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 15 | 4.12 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 15.1 | 4.12.14 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| 15.2 | 5.3.18 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |

</center>

## openSUSE

<a href="https://www.opensuse.org/" target="_blank">*openSUSE*</a>, formerly
called *SUSE Linux* and *SuSE Linux Professional*, is a widely used Linux
distribution sponsored by SUSE Linux GmbH and other companies. *openSUSE* focus
is creating usable open-source tools for software developers and system
administrators while providing a user-friendly desktop and feature-rich server
environment.

*openSUSE* is available in a stable base with the *openSUSE Leap* version. The
*openSUSE Tumbleweed* is a rolling release which offers more up-to-date free
software.

The list of kernel versions shipped with openSUSE releases can be found
<a href="https://en.wikipedia.org/wiki/OpenSUSE_version_history"
target="_blank">here</a>. Zoned block device support with the shipped kernel for
the latest releases is shown in the table below.

<center>

| Distribution version | Kernel version | ZBD support | *dm-zoned* support |
| -------------------- | -------------- | ----------- | ------------------ |
| Leap 15.0 | 4.12 | <span style="color:green">YES</span> | <span style="color:red">NO</span> |
| Leap 15.1 | 4.12 | <span style="color:green">YES</span> | <span style="color:red">NO</span> |
| Leap 15.2 | 5.3 | <span style="color:green">YES</span> | <span style="color:green">YES</span> |
| Tumbleweed | latest stable (5.9+) | <span style="color:green">YES</span> | <span style="color:green">YES</span> |

</center>

