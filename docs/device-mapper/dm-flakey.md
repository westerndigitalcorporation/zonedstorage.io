---
id: dm-flakey
title: dm-flakey
sidebar_label: dm-flakey
---

# dm-flakey

The *dm-flakey* target is similar to the *dm-linear* target, except that it
periodically exhibits unreliable behavior. This target is useful for simulating
failing devices during testing. In the case of zoned block devices,
simulating write errors to sequential zones can help to debug application
write-pointer management.

*dm-flakey* works like this: at the time the table is loaded, the device does
not generate errors for some seconds (*up* time), but then exhibits unreliable
behavior for *down* seconds. This cycle then repeats.

## Error modes

Several error-simulation behaviors can be configured.

* **drop_writes** All write I/Os are silently ignored and dropped. Read I/Os
  are handled correctly.
* **error_writes** All write I/Os are failed with an error signaled. Read I/Os
  are handled correctly.
* **corrupt_bio_byte** During the *down* time, replace the Nth byte of the
  data of each read or write block I/O with a specified value.

The default error mode is to fail all I/O requests during the *down* time of the
simulation cycle.

## Zoned Block Device Restrictions

The same zone alignment restrictions that apply to the
[*dm-linear*](/docs/device-mapper/dm-linear) target also apply to *dm-flakey*.

## Examples

*dm-flakey* detailed documentation and usage examples can be found in the kernel
source code documentation file <a href="https://github.com/torvalds/linux/blob/master/Documentation/admin-guide/device-mapper/dm-flakey.rst"
target="_blank">Documentation/admin-guide/device-mapper/dm-flakey.rst</a>.
