---
id: index
title: Overview
sidebar_label: Overview
slug: /device-mapper
---

Linux device mapper subsystem includes several target driver supporting zoned
block devices.

## Supported Targets

The list of device mapper target drivers with native zoned block device support
is as follows.

* [dm-linear](/docs/device-mapper/dm-linear)
* [dm-crypt](/docs/device-mapper/dm-crypt)
* [dm-zoned](/docs/device-mapper/dm-zoned)

In addition to these targets, the following development/debugging oriented
device mapper target drivers are also supported.

* [dm-flakey](/docs/device-mapper/dm-flakey)
* [dm-delay](/docs/device-mapper/dm-delay)

## Other Target Drivers

Any device mapper target driver that is not listed above cannot be used with
zoned block devices. Attempting to set such target on a zoned block devie will
be rejected by the device mapper core code and an error returned to the user.
