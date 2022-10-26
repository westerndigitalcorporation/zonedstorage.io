---
id: fedora
title: Fedora
sidebar_label: Fedora
---

import {
Yes,
No
} from '/src/components/Distro';

# Fedora

*<a href="https://getfedora.org" target="_blank">Fedora&reg;</a>* is a Linux
distribution developed by the community-supported *Fedora Project* and primarily
sponsored by *<a href="https://www.redhat.com" target="_blank"> Red
Hat&reg;</a>*.

The following table gives an overview of the kernel versions and configuration
used with the latest releases of the Fedora distribution. A more complete list
of kernel versions for all releases can be found <a
href="https://en.wikipedia.org/wiki/Fedora_(operating_system)"
target="_blank">here</a>.

<center>

|Version|Kernel|ZBD API|ZBC, ZAC|ZNS|*dm-zoned*|*zonefs*|*btrfs*|
|:-----:|:----:|:-----:|:------:|:----:|:--------:|:----:|:--------:| 
|26(EOL)|4.11|<Yes/>|<Yes/>|<No/> |<No/>|<No/> |<No/>|
|27(EOL)|4.13|<Yes/>|<Yes/>|<No/> |<Yes/>|<No/> |<No/>|
|28(EOL)|4.16|<Yes/>|<Yes/>|<No/> |<Yes/>|<No/> |<No/>|
|29(EOL)|4.18|<Yes/>|<Yes/>|<No/> |<Yes/>|<No/> |<No/>|
|30(EOL)|5.0|<Yes/>|<Yes/>|<No/> |<Yes/>|<No/> |<No/>|
|30(EOL)|5.0|<Yes/>|<Yes/>|<No/> |<Yes/>|<No/> |<No/>|
|31(EOL)|5.3|<Yes/>|<Yes/>|<No/> |<Yes/>|<No/> |<No/>|
|32(EOL)|5.6|<Yes/>|<Yes/>|<No/> |<Yes/>|<No/> |<No/>|
|33(EOL)|5.8|<Yes/>|<Yes/>|<Yes/> <br/> (After Updates) |<Yes/>|<No/> |<No/>|
|34(EOL)|5.11|<Yes/>|<Yes/>|<Yes/> |<Yes/>|<Yes/> |<No/>|
|35|5.14|<Yes/>|<Yes/>|<Yes/> |<Yes/>|<Yes/> |<Yes/>|
|36|5.17|<Yes/>|<Yes/>|<Yes/> |<Yes/>|<Yes/> |<Yes/>|

</center>

Support for the zoned block interface is present and enabled by default in the
binary kernel of all releases of Fedora since release 26. Starting with release
27, the pre-compiled kernel packages also include the dm-zoned device mapper
target compiled as a loadable kernel module. Fedora 33 also provides NVMe Zoned
Namespace (ZNS) support after updating the distribution. Detailed information on
how to download and install Fedora can be found *<a
href="https://docs.fedoraproject.org/en-US/fedora/f33/install-guide/"
target="_blank">here</a>*
