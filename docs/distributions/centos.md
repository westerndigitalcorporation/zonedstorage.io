---
id: centos
title: CentOS
sidebar_label: CentOS
---

import {
Yes,
No
} from '/src/components/Distro';

# CentOS

*<a href="https://www.centos.org/" target="_blank">CentOS</a>* is a community
maintained Linux distribution derived from the sources of *Red Hat Enterprise
Linux (RHEL)*. *CentOS* release versions follow closely *RHEL* releases, reusing
the same version and release numbers. More information on the distribution
releases and kernel versions can be found <a
href="https://en.wikipedia.org/wiki/CentOS" target="_blank">here</a>.

Due to this design approach, CentOS zoned block device support is identical to
that of Red Hat Enterprise Linux: zoned block device support is not available by
default with the pre-compiled kernels shipped with the distribution.

However, third party repositories such as *<a
href="http://elrepo.org/tiki/HomePage" target="_blank">The Community Enterprise
Linux Repository</a>* provide recent kernels packages precompiled with zoned
block device suport enabled. elrepo provides kernels version 5.12 and 5.13 for
CentOS 7, CentOS 8 and CentOS 8 STream.

<center>

Version|Kernel|ZBD API|ZBC, ZAC|ZNS|*dm-zoned*|
|:-----:|:----:|:-----:|:------:|:----:|:--------:| 
|7|3.10|<No/>|<No/>|<No/> |<No/>|
|7 + elrepro|5.18|<Yes/>|<Yes/>|<Yes/> |<Yes/>|
|8|4.18|<No/>|<No/>|<No/> |<No/>|
|8 + elrepro|5.18|<Yes/>|<Yes/>|<Yes/> |<Yes/>|
|Stream 8|5.13|<No/>|<No/>|<No/> |<No/>|
|Stream 8 + elrepro|5.18|<Yes/>|<Yes/>|<Yes/>|<Yes/>|
|Stream 9|5.14|<Yes/>|<Yes/>|<Yes/>|<No/>|

</center>
