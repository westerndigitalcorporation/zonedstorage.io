---
id: zns
title: NVMe Zoned Namespaces (ZNS) Devices
sidebar_label: NVMe Zoned Namespaces (ZNS) Devices
---

import Image from '/src/components/Image';
import ImageLink from '/src/components/ImageLink';

# NVMe Zoned Namespaces (ZNS) Devices

NVMe Zoned Namespace (ZNS) devices introduce a new division of functionality
between host software and the device controller. A ZNS device exposes its
capacity into zones, where each zone can be read in any order but must be
written sequentially.

The <a href="https://nvmexpress.org/" target="_blank_">NVM Express (NVMe)
organization</a> released as part of the NVMe 2.0 specifications
the <a href="https://nvmexpress.org/developers/nvme-command-set-specifications/"
target="_blank_">NVMe ZNS Command Set specification</a>. The latest revision
of this specification available is 1.1. The NVMe ZNS specification define a
command interface that applies to all NVMe defined command transport. This
command set is independent of the storage media technology used by the device
and applies equally to flash-based solid state drives (SSDs) or [SMR hard
disks](/docs/introduction/smr).

The most common type of ZNS devices found today are flash-based SSDs. For this
type of device, the ZNS interface characteristics allow improving internal data
placement and thus leads to higher performance through higher write throughput,
improved QoS (lower access latencies) and increased capacity.

:::note
See <a href="https://www.usenix.org/conference/atc21/presentation/bjorling"
target="_blank_">ZNS: Avoiding the Flash-Based Block Interface Tax for
Flash-Based SSDs</a> for a deep dive on ZNS SSDs. The article was published
at USENIX ATC 2021.
:::

## Overview

The ZNS specifications follows the [Zoned Storage
Model](/docs/introduction/zoned-storage). This standards-based architecture,
which takes a unified approach to storage that enables both Shingled Magnetic
Recording (SMR) in HDDs and ZNS SSDs to share a unified software stack.

Specifically for ZNS SSDs, the zone abstraction allows the host aligning its
writes to the sequential write required properties of flash-based SSDs, and
thereby optimizes data placement onto the SSD's media. Note that the management
of media reliability continues to be the sole responsibility of the ZNS SSD and
should be managed the same way as conventional SSDs.

<Image src="intro-zns.png"
title="Conventional SSDs and ZNS SSDs internal data placement"/>

## The ZNS Zoned Storage Model

The ZNS Command Set specification builds upon the [host-managed zoned storage
model](/docs/introduction/zoned-storage#zone-models) which was first introduced
for SMR hard-disks with the SCSI ZBC (Zoned Block Command) standard and the ATA
ZAC (Zoned ATA Commands) standard. A compatible [zone state
machine](/docs/introduction/zoned-storage#zone-states-and-state-transitions) was
defined, and a similar set of [zone management
commands](/docs/introduction/zoned-storage#zone-management-commands) was
defined.

These similarities simplify the implementation of the host storage stack and
applications for simultaneously supporting both host-managed SMR hard-disks and
ZNS SSDs.

Given that ZNS SSDs typically is implemented using non-volatile memory, the ZNS
specification introduces additional functionalities to efficiently enable this
type of media.

### Zone types

ZBC and ZAC SMR hard-disks can optionally expose a number of [conventional
zones](/docs/introduction/zoned-storage#zone-types) which accept random write
operations. The ZNS specification does not define this optional set of random
write zones, as NVMe supports multiple namespace, and therefore can expose a
separate namespace that supports conventional I/O accesses.

The ZNS specification mandates that all zones of a zoned namespace must have the
sequential-write-required type.

### Zone Capacity and Zone Size

The ZNS specification introduced the concept of a [zone
capacity](/docs/introduction/zoned-storage#zone-size-and-zone-capacity). This
concept is not defined in the ZBC and ZAC standards.

Similar to ZBC and ZAC standards, ZNS defines the zone size as the total
number of logical blocks within a zone. A zone capacity is an additional
per-zone attribute that indicates the number of usable logical blocks within
each zone, starting from the first logical block of each zone. A zone capacity
is always smaller or equal to the zone size.

This new attribute was introduced to allow for the zone size to remain a power
of two number of logical blocks (facilitating logical block to zone number
conversions) while allowing optimized mapping of a zone storage capacity to the
underlying media characteristics. For instance, in the case a flash based
device, a zone capacity can be aligned to the size of flash erase blocks without
requiring that the device implements a power-of-two sized erased block.

As the logical block addresses between the zone capacity and the end of the
zone are not mapped to any physical storage blocks, write accesses to
these blocks will result in an error. Therefore, reading in this area is handled
in the same way as when reading unwritted blocks.

A zone with a zone capacity smaller than the zone size will be transitioned to a
full condition when the number of written blocks equals the zone capacity.

:::note
The total namespace capacity reported by a controller is always equal to the
total number of logical blocks defined by the zones. In other words, this
reported capacity includes unusable logical blocks of zones with a zone capacity
lower than the zone size. The usable capacity of the namespace is equal to the
sum of all zones capacities. This usable capacity is always smaller than the
reported namespace capacity if the namespace contains zones with a zone capacity
lower than the zone size.
:::

### Zone Resources Limits

The ZNS specification allows a ZNS controller to report a limit on the total
number of zones that can be simultaneously in the implicit open or explicit open
state ([open zones limit](/docs/introduction/zoned-storage#open-zones-limit)).
This potential limit on the maximum number of open zones is similarly defined in
the ZBC, and ZAC standards.

However, unlike the ZBC and ZAC standards, the ZNS specification defines an
additional [limit on the number of active
zones](/docs/introduction/zoned-storage#active-zones-limit), that is, zones that
have the implicit open, explicit open or closed state. A ZNS SSD may impose a
limit on the maximum number of zones that can be active. This limit is always
equal or larger than the limit on the maximum number of open zones.

### Zone Append

The NVMe specifications allow a device controller to execute commands present
in the several submission queues available in any order. This has implications
for the host IO stack, namely, even if the host submits write commands directed
at a zone sequentially, the commands may be reordered before they are processed
and violate the sequential write requirement, resulting in errors. Host software
can avoid such error by limiting the number of write commands outstanding per
zone to one. This can potentially result in poor performance, especially for
workloads issuing mostly small write operations.

To avoid this problem, the ZNS specification introduced the new [*Zone
Append*](/docs/introduction/zoned-storage#zone-append) command. Support for this
command is defined as optional in the ZNS specification. However, Linux support
for zoned block devices requires that a ZNS device supports the zone append
command.

## Presentations

The following OCP 2019 Global Summit presentation covers the motivation for
ZNS SSDs, the journey, and a general overview of the interface.

<ImageLink src="https://img.youtube.com/vi/9yVWb3rbces/0.jpg"
title="From Open-Channel SSDs to Zoned Namespaces, OCP 2019 Global Summit."
url="https://www.youtube.com/watch?v=9yVWb3rbces"/>

The following SNIA SDC presentations illustrate how ZNS SSDs can be used with
real-world applications.

<ImageLink src="https://img.youtube.com/vi/qpbBuyYT6fc/0.jpg"
url="https://www.youtube.com/watch?v=qpbBuyYT6fc"
title="File System Native Support of Zoned Block Devices: Regular vs Append
Writes, SDC2020"/>

<ImageLink src="https://img.youtube.com/vi/FwMQqIGZFsE/0.jpg"
title="Zoned Block Device Support in Hadoop HDFS, SDC2020"
url="https://www.youtube.com/watch?v=FwMQqIGZFsE"/>

<ImageLink src="https://img.youtube.com/vi/cbX3P56Jp0o/0.jpg"
title="Zoned Namespaces (ZNS) SSDs: Disrupting the Storage Industry, SDC2020"
url="https://www.youtube.com/watch?v=cbX3P56Jp0o"/>
