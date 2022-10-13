---
id: zns
title: NVMe Zoned Namespaces (ZNS) SSDs
sidebar_label: NVMe Zoned Namespaces (ZNS) SSDs
---

import Image from '/src/components/Image';
import ImageLink from '/src/components/ImageLink';

# NVMe Zoned Namespaces (ZNS) SSDs

Zoned Namespace (ZNS) SSDs represent a new division of functionality between
host software and flash-based SSDs. A ZNS SSD groups its capacity into zones,
where each zone can be read in any order but must be written sequentially. These
characteristics allow a ZNS SSD to improve its internal data placement and thus
lead to higher performance through higher write throughput, lower QoS, and
increased capacity.

ZNS SSDs implement
the <a href="https://nvmexpress.org/developers/nvme-command-set-specifications/"
target="_blank_">NVMe ZNS Command Set specification</a> as defined by the NVM
Express (NVMe) organization and released as part of the NVMe 2.0 specifications.
The latest revision available is 1.1a.

:::note
See <a href="https://www.usenix.org/conference/atc21/presentation/bjorling"
target="_blank_">ZNS: Avoiding the Flash-Based Block Interface Tax for
Flash-Based SSDs</a> for a deep dive on ZNS SSDs. The article was published
at USENIX ATC 2021.
:::

## Overview

ZNS SSDs follow the Zoned Storage Model. This standards-based architecture takes
a unified approach to storage that enables both Shingled Magnetic
Recording (SMR) HDDs and ZNS SSDs to share a unified software stack.
Specifically for ZNS SSDs, the zone abstraction allows the host to align its
writes to the sequential write required properties of flash-based SSDs, thereby
optimizing data placement onto the SSD's media. Note that the management of
media reliability continues to be the sole responsibility of the ZNS SSD and
should be managed the same way as conventional SSDs.

<Image src="intro-zns.png"
title="Conventional SSDs and ZNS SSDs internal data placement"/>

## The ZNS Zoned Storage Model

The ZNS Command Set specification builds upon the existing
[Host Managed Zoned Storage Model](smr.md#host-managed-model) introduced for SMR
hard-disks with the SCSI ZBC (Zoned Block Command) and ATA ZAC (Zoned ATA Commands)
standards. As a result, both the zone state machine and the
[Zone Block Commands](smr.md#zone-block-commands) set for ZNS are compatible with
the aforementioned standards.

These similarities simplify the implementation of the host storage stack and
applications for simultaneously supporting both host-managed SMR HDDs and ZNS SSDs.

As ZNS SSDs are typically implemented using non-volatile memory, the ZNS
specification introduces extra functionalities to enable such media.
These additional functionalities are described below.

### Zone types

ZBC and ZAC SMR hard-disks can optionally expose a number of conventional zones
which accept random write operations. The ZNS specification does not define this
optional type of random write zone. As NVMe supports multiple namespaces and can
expose separate conventional I/O namespaces, this feature is not required for NVMe
ZNS SSDs.

### Zone Capacity (ZCAP) and Zone Size (ZSZE)

The ZNS specification additionally introduces the concept of Zone Capacity.

Similar to ZBC and ZAC standards, ZNS defines zone size (ZSZE) as the total number
of logical blocks within a zone. The zone capacity (ZCAP) is an additional per-zone
attribute that indicates the number of usable logical blocks within each zone,
starting from the first logical block of each zone. It is always less than or equal
to the zone size.

This new attribute allows the zone size to remain a power-of-two (2^n) number of
logical blocks (facilitating easy logical block to zone number conversions) while
allowing optimized mapping of zone storage capacity to the underlying media
characteristics. For instance, in the case a flash based device, zone capacity
can be aligned to the size of flash erase blocks without requiring the device to
implement a power-of-two sized erase block.

The figure below illustrates the zone capacity concept.

<Image src="intro-zonesize-vs-capacity.png"
title="Zone Size and Zone Capacity"/>

The logical block addresses between the zone capacity(ZCAP) and the end of the zone
(ZSZE) are not mapped to any physical storage blocks and writes to these blocks
will result in an error. Therefore, reads within this area are handled
in the same way as read commands to unwritted blocks.

A zone with a zone capacity smaller than the zone size will be transitioned to
the full state when the number of written blocks equals the zone capacity.

:::note
The total namespace capacity reported by a controller is always equal to the
total number of logical blocks defined by the zones. In other words, if the
namespace contains zones with a capacity that is less than their size, the
reported namespace total capacity includes unusable logical blocks (falling
between zone capacity and zone size) and the usable capacity of the namespace is
equal to the sum of all zones' capacities. In this case, the usable capacity
available is smaller than the reported namespace capacity.
:::

### Active Zones

A controller implementation typically requires the allocation of internal
resources (e.g. write buffers) to execute write operations into zones.
Limitations on the total amount of resources available in the controller may
imply a limit on the total number of zones that can simultaneously be in the
implicit open or explicit open states. This potential limit on the maximum
number of open zones is similarly defined in the ZNS, ZBC and ZAC standards.

The ZNS specification defines an additional limit on the number of zones
that can be in the implicit open, explicit open or closed states. Zones that are
in one of these states are defined as active zones and correspond to zones that are
being written or that have been only partially written. A ZNS SSD may impose a limit
on the maximum number of active zones. This limit is always equal to or greater
than the maximum allowed number of open zones.

This new limit imposes new constraints on user applications. While the maximum
number of open zones of a namespace only limits the number of zones that an
application can simultaneously write, the maximum number of active zones imposes
a limit on the number of zones that an application can choose from for writing.
If the maximum number of active zones is reached, the application must either
Reset or Finish atleast one active zone to be able to choose any other zone for
writing.

Similar to the limit on the maximum number of open zones, a limit on the
maximum number of active zones for a namespace does not affect read operations.
Any zone that is not offline can always be accessed for reading regardless of
the current number of open and active zones.

### Zone Append

The NVMe specification allows a device controller to execute commands present
in the several submission queues available in any order. This has implications
for the host IO stack, namely, if the host submits multiple write commands to
a zone sequentially, the commands may be reordered by the controller before
processing. This violates the sequential write requirement resulting in an error.
Host software can avoid such errors by limiting the number of write commands
outstanding per zone to one. This can potentially result in poor performance,
especially for workloads issuing mostly small write operations.

To avoid this problem, the ZNS specification introduced the new *Zone
Append* command.

A zone append command is a write operation that always specifies the first
logical block of a zone as the write position. When executing the command, the
device controller writes the data within the zone indicated, but does so at the
current zone write pointer position. This change in the write position is
automatic and the effective write position for the data is indicated to the host
through the command completion information. This mechanism allows a host to
submit more than one zone append operation (writes) and lets the device process
them in any order.

The figure below illustrates the differences between regular write operations
and zone append write operations.

<Image src="intro-zone-append.png"
title="Regular Writes and Zone Append Writes"/>

In the example above, the host must issue to the same zone three different
write operations for data A (4KB), B (8KB), and C (16KB). Using regular write
commands, this can be done safely only at a write queue depth of 1 per zone,i.e,
the host must wait for the completion of an outstanding write operation before
issuing the next write request. For each write request, the write position must
be equal to the zone write pointer position. This ensures data stored in the
zone is in the same order as it was issued.

Using zone append write operations, the write queue depth constraint is removed
and the host can issue all three write requests simultaneously. Upon completion
of all write requests, the zone write pointer position is identical to the
previous case as the total amount of data written is equal. However, the
location of the written data within the zone may not correspond to the
host command issuing order as the device controller is free to reorder command
execution as it sees fit. The host can discover the effective write position
of each request through the zone append completion information.

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
