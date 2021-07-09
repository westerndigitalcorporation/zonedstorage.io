# Zoned Namespaces (ZNS) SSDs

Zoned Namespace (ZNS) SSDs represent a new division of functionality between host software and flash-based SSDs. A ZNS SSD groups its capacity into zones, where each zone can be read in any order but must be written sequentially. These characteristics allow a ZNS SSD to improve its internal data placement and thus lead to higher performance through higher write throughput, lower QoS, and increased capacity.

ZNS SSDs implement the <a href="https://nvmexpress.org/developers/nvme-command-set-specifications/" target="_blank_">NVMe ZNS Command Set specification</a> as defined by the NVM Express (NVMe) organization and released as part of the NVMe 2.0 specifications. The latest revision available is 1.1.

!!! NOTE
     See <a
     href="https://www.usenix.org/conference/atc21/presentation/bjorling"
     target="_blank_">ZNS: Avoiding the Flash-Based Block Interface Tax for Flash-Based SSDs</a> for a deep dive on ZNS SSDs. The article was published at USENIX ATC 2021.

## Overview

The ZNS SSD follows the Zoned Storage Model. This standards-based architecture, which takes a unified approach to storage that enables both Shingled Magnetic Recording (SMR) in HDDs and ZNS SSDs to share a unified software stack. Specifically for ZNS SSDs, the zone abstraction allows the host aligning its writes to the sequential write required properties of flash-based SSDs, and thereby optimizes data placement onto the SSD's media. Note that the management of media reliability continues to be the sole responsibility of the ZNS SSD and should be managed the same way as conventional SSDs.

<center>
<img alt="zns" src="../../assets/img/intro-zns.png"
title="Conventioal SSDs and ZNS SSDs internal data placement" width="800"
style="max-width:100%;">
<br><em>Conventional SSDs and ZNS SSDs internal data placement</em></br>
</center>

## The ZNS Zoned Storage Model

The ZNS Command Set specification builds upon the existing
[Host Managed Zoned Storage Model](smr.md#host-managed-model) introduced for SMR
hard-disks with the SCSI ZBC (Zoned Block Command) standard and the ATA ZAC
(Zoned ATA Commands) standard. A compatible zone state machine was defined, and
a similar set of [Zone Block Commands](smr.md#zone-block-commands) was defined.

These similarities simplify the implementation of the host storage stack and
applications for simultaneously supporting both host-managed SMR hard-disks and
 ZNS SSDs.

Given that ZNS SSDs typically is implemented using non-volatile memory, the ZNS specification introduces extra functionalities to enable this type of media and is described below.

### Zone types

ZBC and ZAC SMR hard-disks can optionally expose a number of conventional zones
which accept random write operations. The ZNS specification does not define this optional set of random write zones, as NVMe supports multiple namespace, and therefore can expose a separate namespace that supports conventional I/O accesses.

### Zone Capacity and Zone Size

The ZNS specification introduces the concept of a Zone
Capacity. This concept is not defined in the ZBC and ZAC standards.

Similar to ZBC and ZAC standards, ZNS defines the zone size as the total
number of logical blocks within a zone. A zone capacity is an additional
per-zone attribute that indicates the number of usable logical blocks within
each zone, starting from the first logical block of each zone. A zone capacity
is always smaller or equal to the zone size.

This new attribute was introduced to allow for the zone size to remain a power
of two number of logical blocks (facilitating easy logical block to zone number
conversions) while allowing optimized mapping of a zone storage capacity to the
underlying media characteristics. For instance, in the case a flash based
device, a zone capacity can be aligned to the size of flash erase blocks without
requiring that the device implements a power-of-two sized erased block.

The figure below illustrates the zone capacity concept.

<center>
<img alt="zone-capacity" src="../../assets/img/intro-zonesize-vs-capacity.png"
title="Zone Size and Zone Capacity" width="640" style="max-width:100%;">
<br><em>Zone Size and Zone Capacity</em></br>
</center>

As the logical block addresses between the zone capacity and the end of the
zone are not mapped to any physical storage blocks, write accesses to
these blocks will result in an error. Therefore, reading in this area is handled in the
same way as when reading unwritted blocks.

A zone with a zone capacity smaller than the zone size will be transitioned to a
full condition when the number of written blocks equals the zone capacity.

!!! Note
	The total namespace capacity reported by a controller is always equal to
	the total number of logical blocks defined by the zones. In other words,
	this reported capacity includes unusable logical blocks of zones with a
	zone capacity lower than the zone size. The usable capacity of the
	namespace is equal to the sum of all zones capacities. This usable
	capacity is always smaller than the reported namespace capacity if the
	namespace contains zones with a zone capacity lower than the zone size.

### Active Zones

A controller implementation typically requires the allocation of internal
resources (e.g. a write buffer) to execute write operations into zones.
Therefore, limitations on the total amount of resources available to the controller may imply
a limit on the total number of zones that can be simultaneously in the implicit
open or explicit open conditions. This potential limit on the maximum number of
open zones is similarly defined in the ZNS, ZBC, and ZAC standards.

The ZNS specification however defines an additional limit on the number of zones that can be
in the implicit open, explicit open or closed conditions. Any zone with such
condition is defined as an active zone and correspond to any zone that is being
written or that has been only partially written. A ZNS SSD may
impose a limit on the maximum number of zones that can be active. This limit is
always equal or larger than the limit on the maximum number of open zones.

This new limit imposes new constraints on user applications. While the maximum
number of open zones of a namespace only limits the number of zones that an
application can simultaneously write, the maximum number of active zones imposes
a limit on the number of zones that an application can choose for storing data.
If the maximum number of active zones is reached, the application must either
reset or finish some active zones before being able to chose other zones for
storing data.

Similar to the limit on the maximum number of open zones, a limit on the
maximum number of active zones for a namespace does not affect read operations.
Any zone that is not offline can always be accessed for reading regardless of
the current number of open and active zones.

### Zone Append

The NVMe specifications allow a device controller to execute commands present
in the several submission queues available in any order. This has implications
for the host IO stack, namely, even if the host submits write commands directed
at a zone sequentially, the commands may be reordered before they are processed
and violate the sequential write requirement, resulting in errors. Host software
can avoid such error by limiting the number of write commands outstanding per
zone to one. This can potentially result in poor performance, especially for
workloads issuing mostly small write operations.

To avoid this problem, the ZNS specification introduced the new *Zone
Append* command.

A zone append command is a write operation that specifies the first
logical block of a zone as the write position. When executing the command, the
device controller write the data within the zone indicated, but do so at the
current zone write pointer position. This change in the write position is
automatic and the effective write position for the data is indicated to the host
through the command completion information. This mechanism allows a host to
simultaneously submit several zone append operations and let the device process
these in any order.

The figure below illustrates the differences between regular write operations
and zone append write operations.

<center>
<img alt="zone-append" src="../../assets/img/intro-zone-append.png"
title="Regular Writes and Zone Append Writes" width="640" style="max-width:100%;">
<br><em>Regular Writes and Zone Append Writes</em></br>
</center>

In the example above, the host must issue to the same zone three different
write operations for data A (4KB), B (8KB), and C (16KB). Using regular write
commands, this can be done safely only at a write queue depth of 1 per zone,i
that is, the host must wait for the completion of an outstanding write
operation before issuing the next write request. For each write request,
the write position must be equal to the zone write pointer position. This result
in the data being stored in the zone in the same order as issued.

Using zone append write operations, the write queue depth constraint is removed
and the host can issue all three write requests simultaneously. Upon completion
of all write requests, the zone write pointer position is identical to the
previous case as the total amount of data written is equal. However, the
location of the written data within the zone may not correspond to the
host command issuing order as the device controller is free to reorder command
execution as it sees fit. The host can discover the effective write position
of each request through the zone append completion information.

## Presentations

Additional information is available here:

<center>
<br><a href="https://www.youtube.com/watch?v=9yVWb3rbces" target="_blank">From Open-Channel SSDs to Zoned Namespaces, OCP 2019 Global Summit.</a></br>
<a href="https://www.youtube.com/watch?v=9yVWb3rbces" target="_blank">
![Zoned Namespaces at OCP](https://img.youtube.com/vi/9yVWb3rbces/0.jpg "Zoned
Namespace Presentation at the OCP 2019 Global Summit")</a>
<br>*The presentation covers the motivation for ZNS SSDs, the journey, and a general overview of the interface.*</br>
</center>

<center>
<br><a href="https://www.youtube.com/watch?v=qpbBuyYT6fc" target="_blank">File System Native Support of Zoned Block Devices: Regular vs Append Writes, SDC2020</a></br>
<a href="https://www.youtube.com/watch?v=qpbBuyYT6fc" target="_blank">
![ZNS btrfs at SDC2020](https://img.youtube.com/vi/qpbBuyYT6fc/0.jpg "ZNS and btrfs at SNIA SDC 2020")</a>
<br>*ZNS and btrfs.*</br>
</center>

<center>
<br><a href="https://www.youtube.com/watch?v=FwMQqIGZFsE" target="_blank">Zoned Block Device Support in Hadoop HDFS, SDC2020</a></br>
<a href="https://www.youtube.com/watch?v=FwMQqIGZFsE" target="_blank">
![ZNS HDFS at SDC2020](https://img.youtube.com/vi/FwMQqIGZFsE/0.jpg "ZNS and HDFS at SNIA SDC 2020")</a>
<br>*ZNS and HDFS.*</br>
</center>

<center>
<br><a href="https://www.youtube.com/watch?v=cbX3P56Jp0o" target="_blank">Zoned Namespaces (ZNS) SSDs: Disrupting the Storage Industry, SDC2020</a></br>
<a href="https://www.youtube.com/watch?v=cbX3P56Jp0o" target="_blank">
![ZNS HDFS at SDC2020](https://img.youtube.com/vi/cbX3P56Jp0o/0.jpg "ZNS at SNIA SDC 2020")</a>
<br>*ZNS Overview*</br>
</center>
