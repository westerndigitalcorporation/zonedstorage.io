---
id: dm-delay
title: dm-delay
sidebar_label: dm-delay
---

# dm-delay

The *dm-delay* target introduces delays for read, write or flush operations.
This target is intended as a test tool for simulating variations in the response
time of a block device.

## Zoned Block Device Restrictions

The same zone alignment restrictions that apply to the
[*dm-linear*](/docs/device-mapper/dm-linear) target also apply to *dm-delay*.

## Examples

*dm-delay* detailed documentation and usage examples can be found in the kernel
source code documentation file
<a href="https://github.com/torvalds/linux/blob/master/Documentation/device-mapper/delay.rst"
target="_blank">Documentation/admin-guide/device-mapper/delay.rst</a>.
