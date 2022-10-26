---
id: rhel
title: RHEL
sidebar_label: RHEL
---

import {
Yes,
No
} from '/src/components/Distro';

# Red Hat Enterprise Linux

*<a href="https://www.redhat.com/" target="_blank"> Red Hat Enterprise
Linux&reg;</a>*, often abbreviated *RHEL*, is a Linux distribution developed by
*Red Hat* and targeted toward the commercial server market. *Red Hat Enterprise
Linux* is released in server versions for several micro architectures.

The list of kernel versions shipped with all RHEL releases can be found <a
href="https://access.redhat.com/articles/3078" target="_blank">here</a>.

## RHEL9 

The latest release 9 of *RHEL* is based on the kernel version 5.14. The default
binary kernel shipped with the distribution is configured with zoned block
device support enabled, which enable using SMR and ZNS devices. However,
advanced features suh as the dm-zoned device mapper and file systems with zoned
block device support are not available.

<center>

|Version|Kernel|ZBD API|ZBC, ZAC|ZNS|*dm-zoned*|
|:-----:|:----:|:-----:|:------:|:----:|:--------:| 
|9|5.14.0-70|<Yes/>|<Yes/>|<Yes/>|<No/>|

</center>

Users who require a more complete support for zoned block devices can <a
href="https://zonedstorage.io/docs/linux/config" target="_blank"> reconfigure
and recompile the RHEL kernel</a>. Using such recompiled kernel may however
conflict with Red Hat support. Users should contact Red Hat support for more
information.

## RHEL8 

*RHEL 8* is based on the kernel version 4.18 which includes zoned block device
support. However, as shown in the table below, this support is not enabled at
compile time for the default binary kernel shipped with the distribution.

<center>

|Version|Kernel|ZBD API|ZBC, ZAC|ZNS|*dm-zoned*|
|:-----:|:----:|:-----:|:------:|:----:|:--------:| 
|8|4.18.0-80|<No/>|<No/>|<No/> |<No/>|
|8.1|4.18.0-147|<No/>|<No/>|<No/> |<No/>|
|8.2|4.18.0-193|<No/>|<No/>|<No/> |<No/>|
|8.3|4.18.0-240|<No/>|<No/>|<No/> |<No/>|
</center>

Users who require zoned block device support can recompile the RHEL kernel
after <a href="https://zonedstorage.io/docs/linux/config" target="_blank">
enabling zoned block device support</a>. Using such recompiled kernel may
however conflict with Red Hat support. Users should contact Red Hat support for
more information.

## RHEL7 

As indicated in the table below, all releases of *RHEL 7* are based on the
kernel version 3.10 which lacks zoned block device support.

<center>

|Version|Kernel|ZBD API|ZBC, ZAC|ZNS|*dm-zoned*|
|:-----:|:----:|:-----:|:------:|:----:|:--------:| 
|7|3.10.0-123|<No/>|<No/>|<No/> |<No/>|
|7.1|3.10.0-229|<No/>|<No/>|<No/> |<No/>|
|7.2|3.10.0-327|<No/>|<No/>|<No/> |<No/>|
|7.3|3.10.0-514|<No/>|<No/>|<No/> |<No/>|
|7.4|3.10.0-693|<No/>|<No/>|<No/> |<No/>|
|7.5|3.10.0-862|<No/>|<No/>|<No/> |<No/>|
|7.6|3.10.0-957|<No/>|<No/>|<No/> |<No/>|
|7.7|3.10.0-1062|<No/>|<No/>|<No/> |<No/>|
|7.8|3.10.0-1127|<No/>|<No/>|<No/> |<No/>|
|7.9|3.10.0-1160|<No/>|<No/>|<No/> |<No/>|

</center>

## RHEL6 

*RHEL 6* being based on the older kernel 2.6.32, zoned block devices are not
supported.

<center>

|Version|Kernel|ZBD API|ZBC, ZAC|ZNS|*dm-zoned*|
|:-----:|:----:|:-----:|:------:|:----:|:--------:| 
|6|2.6.32-71|<No/>|<No/>|<No/> |<No/>|
|6.1|2.6.32-131|<No/>|<No/>|<No/> |<No/>|
|6.2|2.6.32-220|<No/>|<No/>|<No/> |<No/>|
|6.3|2.6.32-358|<No/>|<No/>|<No/> |<No/>|
|6.4|2.6.32-358|<No/>|<No/>|<No/> |<No/>|
|6.5|2.6.32-431|<No/>|<No/>|<No/> |<No/>|
|6.6|2.6.32-504|<No/>|<No/>|<No/> |<No/>|
|6.7|2.6.32-573|<No/>|<No/>|<No/> |<No/>|
|6.8|2.6.32-642|<No/>|<No/>|<No/> |<No/>|
|6.9|2.6.32-696|<No/>|<No/>|<No/> |<No/>|
|6 ELS+|2.6.32-754|<No/>|<No/>|<No/> |<No/>|

</center>
