---
id: zoned-storage
title: Zoned Storage Devices Overview
sidebar_label: Zoned Storage Devices Overview
---

import Image from '/src/components/Image';

# Zoned Storage Devices

Zoned storage is a class of storage devices that have an address space that is
divided into zones that have write constraints that are different from regular
storage devices.

## Principle of Operation

Zones in zoned storage devices must be written sequentially. This is called the
**sequential write constraint**. Each zone in the device address space has a
write pointer that keeps track of the position of the next write. Data in a
zone cannot be directly overwritten: before being overwritten, the zone must
first be erased using a special command (zone reset). The figure below
illustrates this principle.

<Image src="intro-zoned-storage.png"
title="Zoned Storage Devices Principle"/>

Zoned storage devices can be implemented using different command protocols for
various recording and media technologies. The most common form of zoned storage
today uses the SCSI Zoned Block Commands (ZBC) and Zoned ATA Commands (ZAC)
interfaces with [Shingled Magnetic Recording (SMR)](./smr) hard-disks. ZBC and
ZAC enable a zoned block storage model; SMR technology enables continued areal
density growth that makes it possible to meet expanding data needs, and SMR
technology requires the zoned block access model.

Solid State Drive (SSD) storage devices can also implement a zoned interface in
order to reduce write amplification, to reduce the device's DRAM needs, and to
improve the quality of service at scale. The [NVMe Zoned NameSpace (ZNS)](./zns)
is a specification of the NVMe standard committee that adds a zoned storage
interface to the NVMe interface standard.

## Zone Size and Zone Capacity

The size of a zone of a zoned storage device is the total number of logical
blocks within the zone. The size of each zone is fixed at manufacturing time
and cannot be changed by the user.

:::note
There is one exception to this rule: The ZBC-2 standard extends the ZBC command
set with the FORMAT WITH PRESET command which allows a user to reformat a zoned
SMR hard-disk with a different zone size. This operation is however destructive
and thus cannot be used on a live system.
:::

Some zoned storage devices also define a capacity attribute for each zone. A
zone capacity indicates the number of usable logical blocks within the zone,
starting from the first logical block of the zone. A zone capacity is always
smaller or equal to the zone size. This concept is illustrated in the figure
below.

<Image src="intro-zonesize-vs-capacity.png"
title="Zone Size and Zone Capacity"/>

The use of zone capacities different from the zone size allows for the zone size
to remain constant for all zones while allowing an optimized mapping of a zone
storage capacity to the underlying media characteristics. For instance, in the
case a flash based device, a zone capacity can be aligned to the size of flash
erase blocks without imposing host requirements on the device erase block size.

## Zone Models

The zone interface of zoned storage devices can take different forms. These
forms are referred to as "models", and their differences impacts hosts and
users. It is important to understand these differences, as not all
implementation options are appropriate for a particular storage application.
The two models that are in use today are:

* **Host-Managed** This model accommodates only sequential write workloads to
  deliver both predictable performance and full control over the device zones
  at the host level. Modifications to host software are required to use host
  managed devices.

* **Host-Aware** This model offers backwards compatibility with regular block
  devices, that is, allows random write operations to be issued to any sector.
  But this model also provides the same host control interface provided by
  the host-managed model.

### Host-Managed Model

The host-managed model does not provide backwards compatibility with legacy
host storage stacks. Instead, it delegates management of the device sequential
write constraint to the host software: the host must manage all write
operations. This is done by using the write pointer to enforce sequential
writing within zones.

After data has been written to a zone, the write pointer increments in order to
indicate the starting point of the next write operation in that zone. Any
out-of-order write (write operation that does not start at the zone write
pointer location) forces the device to abort the operation and flag an error.
Recovery from such an error is the responsibility of the controlling host
software. This enforcement allows host-managed devices to deliver predictable
performance.

### Host-Aware Model

The host-aware model simultaneously preserves compatibility with legacy host
storage stacks by being backwards compatible with regular block devices but
also provides the same set of commands for a host to tightly control the device
zones.

All matters of host-side software support and optimization that are discussed
on this site apply to host-aware devices when these devices are used similarly
to host-managed devices.

:::info ZonedStorage.io focuses on host-managed devices
The documentation pages on this site focus on host-managed devices. Host-aware
devices that are used as regular devices are not discussed.
:::

## Zone Types

The standards governing the characteristics and operation of zoned storage
devices define three different types of zones.

* **Conventional zones** typically occupy a very small percentage of the overall
  capacity of a device. Accesses to conventional zones are similar to those of
  regular block devices (that is: conventional zones accept random write
  operations and are usually used to store metadata). Conventional zones do not
  have a write pointer.

* **Sequential-write-required zones** accept random read commands and perform
  comparably to random read commands on standard block devices. However, these
  zones are subject to the zoned storage sequential write constraint and thus
  can only be written sequentially. Any write command must indicate a start
  sector that is aligned with the zone write pointer.

* **Sequential-write-preferred zones** accept both random read and random write
  commands. However, unlike conventional zones, sequential-write-preferred zones
  have a write pointer and can be used exactly like sequential-write-required
  zones.

In general, sequential-write-required and sequential-write-preferred zones are
collectively referred to as sequential zones.

The availability of each type of zone on a particular zoned device depends on
the device governing standard and the device zone model. Conventional zones are
optional and can be found on both host-managed and host-aware devices.
Sequential write required zones are only defined for host-managed devices and
sequential write preferred zones are only defined for host-aware devices.

## Zone Management Commands

Zoned storage devices also provide zone discovery and management commands as
extensions of the device basic command set (which is similar to the set of
commands defined for regular block devices).

Host software can discover the zone organization of a zoned storage device using
the **REPORT ZONES** command. This command returns a list of zone descriptors
that indicate the starting block, size, type, and state of a zone. For
sequential write required zones and sequential write preferred zones, a zone
descriptor also indicates the current position of the zone write pointer. This
information allows host software to implement sequential write streams to zones.

Zones can be managed using the following commands.

* **RESET ZONE WRITE POINTER** is the command that host software use to
  reset the location of a zone write pointer to the beginning of the zone. After
  this command is executed, all data that was written to the zone is lost and
  cannot be accessed.

* **OPEN ZONE** A zoned block device may require internal resources (for
  example, persistent zone resources) to maintain each zone. Insufficient
  resources may result in degraded functionality (for example, reduced
  performance or increased power consumption). The *OPEN ZONE* command allows an
  application to explicitly open a zone, and indicates to the device that the
  resources necessary for writing the zone should remain available until the zone
  is fully written or until the zone is closed by using the *CLOSE ZONE*
  command. The performance benefits achieved by using this command depend upon
  the device media type and implementation of zone management.

* **CLOSE ZONE** allows an application to explicitly close a zone that was
  opened using the *OPEN ZONE* command. *CLOSE ZONE* indicates to the device
  that the resources used for writing to the zone are no longer necessary and
  can be released.

* **FINISH ZONE** allows an application to move a zone's write pointer to the
  end of the zone, preventing any further write operations to the zone until it
  is reset.

## Zone States and State Transitions

Each sequential zone of a zoned storage device has a state attribute that
indicates the usage of the blocks within the zone and the device resources that
zone uses. The following states are defined.

* **Empty** None of the blocks within the zone contain valid data.

* **Full** All of the blocks within the zone have been written or the zone has
  been finished by the host using the *FINISH ZONE* command.

* **Implicit Open** Some blocks in the zone have recently been written by the
  host. The zone is using device internal resources.

* **Explicit Open** The zone was allocated device internal resources by the host
  software through the execution of an *OPEN ZONE* command.

* **Closed** The device internal resources used by a zone were freed explicitly
  by the host through the execution of a *CLOSE ZONE* command, or the device
  implicitly freed the internal resources assigned to the zone to serve write
  operations targetting different zones.

* **Read Only** The zone can only be read. This state generally corresponds to a
  defective state of the device, e.g. for a hard-disk, the zone is stored on a
  platter with a broken write head .

* **Offline** The zone cannot be read nor written. This state generally
  corresponds to a defective state of the device, e.g. the storage media for the
  zone is not operating anymore.

The execution of zone management commands and of write operations may change the
state of a zone. The most common transitions defined by all zoned storage device
standards are shown in the figure below.

<Image src="zone-state-machine.svg"
title="Zone State Transitions Overview"/>

Transition into the *read-only* or *offline* states happen generally after a
device internal event causing defects. Zones that are in either state cannot
return to a fully functional state.

For all other states, the execution of a *RESET ZONE* command always changes the
zone state to *empty*, indicating that none of the blocks in the zone contain
valid data.

A write operation into a zone with the *empty* state change the zone state to
*implicit open*. Writing all blocks of an implicitly opened zone changes its
state to *full*. A *FINISH ZONE* command also changes a zone state to full.

An empty or implicitly open zone can be transitioned to the *explicitly open*
state using the *EXPLICIT OPEN* command. Conversely, implicitly or explicitly
opened zoned can be transitioned to the *closed* state using the *CLOSE ZONE*
command.

## Zone Resources Limits

A zoned storage device implementation may require the allocation of internal
resources (e.g. a write buffer) to execute write operations into zones.
Furthermore, the storage media characteristics of the device may also limit the
amount of zones that can be in a partially written state.

### Open Zones Limit

Limitations on the total amount of internal resources available to a zoned
storage device for processing write operations may impose a limit on the total
number of zones that can simultaneously be in the implicit open or explicit open
state (open zones). If such limit exists, the zoned storage device may fail write
and *OPEN ZONE* commands to avoid exceeding the maximum number of open zones
allowed.

This limit does not affect read operations.

### Active Zones Limit

Any zone in the implicit open, explicit open or closed state is defined as an
active zone and correspond to any zone that is being written or that has been
only partially written. A zoned storage device may impose a limit on the maximum
number of zones that can be active. This limit is always equal or larger than
the limit on the maximum number of open zones.

While the maximum number of open zones of a zoned storage device only limits the
number of zones that a host software can simultaneously write, the maximum
number of active zones imposes a limit on the number of zones that it can choose
for storing data. If the maximum number of active zones is reached, the host
software must either reset or finish some active zones before being able to
choose other zones for storing data.

Similar to the limit on the maximum number of open zones, a limit on the
maximum number of active zones does not affect read operations. Any zone that is
not offline can always be accessed for reading regardless of the current number
of open and active zones.

## Zone Append

The sequential write constraint imposed by the sequential write required zones
of host-managed devices has implications on the host IO stack. Namely, all
write commands directed at a sequential zone must not be reordered before they
are received by the device and executed. Otherwise, the sequential write
requirement would not be met, resulting in write errors. However, the complexity
of host IO stacks and the lack of ordering guarantees with some storage adapters
and command transports may not allow an implementation to order write commands
as required for sequential zones.

Host software can avoid write errors by limiting the number of write commands
outstanding per zone to one. But this can result in poor performance, especially
for workloads issuing mostly small write operations.

To avoid this problem, some zoned storage devices define the *Zone Append*
command. A zone append command is a write operation that specifies the first
logical block of a zone as the write position. When executing the command, the
device write the data within the zone indicated, but do so at the current zone
write pointer position. This change in the write position is automatic and the
effective write position for the data is indicated to the host through the
command completion information. This mechanism allows a host to simultaneously
submit several zone append operations and let the device process these in any
order.

The figure below illustrates the differences between regular write operations
and zone append write operations.

<Image src="intro-zone-append.png"
title="Regular Writes and Zone Append Writes"/>

In the example above, the host must issue to the same zone three different
write operations for data A (4KB), B (8KB), and C (16KB). Using regular write
commands, this can be done safely only at a write queue depth of 1 per zone,
that is, the host must wait for the completion of an outstanding write
operation before issuing the next write request. For each write request,
the write position must be equal to the zone write pointer position. This
results in the data being stored in the zone in the same order as issued.

Using zone append write operations, the write queue depth constraint is removed
and the host can issue all three write requests simultaneously. Upon completion
of all write requests, the zone write pointer position is identical to the
previous case as the total amount of data written is equal. However, the
location of the written data within the zone may not correspond to the
host command issuing order as commands may have been reordered on their way to
the device. The host can discover the effective write position of each request
through the zone append completion information.
