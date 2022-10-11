---
id: debian
title: Debian
sidebar_label: Debian
---

# Debian

*<a href="https://www.debian.org" target="_blank">Debian</a>* is one of the earliest Unix-like operating systems based on the Linux kernel. *Debian* can be shipped with different operating system kernels, such as Linux, *kFreeBSD* or *GNU Hurd*. The table below summarizes Debian Linux zoned storage readiness for the most recent distribution releases.

<center>

|Name|Version|Kernel|ZBD API|ZBC, ZAC|ZNS|*dm-zoned*|
|:-----:|:-----:|:----:|:-----:|:------:|:----:|:--------:| 
|Stretch|9|4.9|<No/>|<No/>|<No/>|<No/>|
|Buster|10|4.19|<Yes/>|<Yes/>|<No/>|<Yes/>|
|Bullseye|11|5.10|<Yes/>|<Yes/>|<Yes/> |<Yes/>|

</center>

export function Yes() { return (<span style={{ color:'#00ff00'}}> Yes </span> ); }

export function No() { return (<span style={{ color:'#ff0000'}}> No </span>);}
