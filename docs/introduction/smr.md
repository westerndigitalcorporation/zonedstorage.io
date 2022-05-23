---
id: smr
title: Shingled Magnetic Recording
sidebar_label: Shingled Magnetic Recording
---

import Image from '/src/components/Image';

# Shingled Magnetic Recording

Shingled Magnetic Recording (SMR) is a magnetic storage data recording
technology used in hard disk drives (HDDs) to provide increased areal density
compared to same-generation drives using conventional magnetic recording (CMR)
technology, resulting in a higher overall per-drive storage capacity.

## SMR Overview

Conventional magnetic recording places gaps between recording tracks on HDDs to
account for Track mis-registration (TMR) budget. These separators impact areal
density, as portions of the platter surface are not being fully utilized.
Shingled magnetic recording removes the gaps between tracks by writing tracks
in an overlapping manner, forming a pattern similar to shingles on a roof.
Physically, this is done by writing the data sequentially, then overlapping
(or “shingling”) it with another track of data. By repeating this process, more
data tracks can be placed on each magnetic surface. The figure below
illustrates this principle.

<Image src="intro-smr-tracks.png"
title="SMR disks overlapping tracks"/>

The write head designed for SMR drives is wider than required for a single track
of data. It produces a stronger magnetic field suitable for magnetizing films of
high coercivity. Once one track has been written, the recording head is advanced
by only part of its width, so the next track will partially overwrite the
previous one, leaving only a narrow band for reading.

Overlapping tracks are grouped into bands called zones of fixed capacity for
more effective data organization and partial update capability. Recording gaps
between zones are laid to prevent data overwrite by the wide write head from one
zone to another.

<Image src="intro-smr-zones.png"
title="SMR disks track organization"/>

## Fundamental Implications of SMR

Because of the shingled format of SMR, all data streams must be organized and
written sequentially to the media. While the methods of SMR implementation may
differ (see SMR Implementations section below), the data nonetheless must be
written to the media sequentially. Consequently, should a particular data sector
need to be modified or re-written, the entire “band” of tracks (zone) must be
re-written. Because the modified data sector is potentially under another
“shingle” of data, direct modification is not permitted, unlike traditional CMR
drives

In the case of SMR, the entire row of shingles above the modified track of the
sector to modify needs to be rewritten in the process. SMR hard disks still
provide true random-read capability, allowing rapid data access like any
traditional CMR drive. This makes SMR an excellent technology candidate for both
active archive and higher-performance sequential workloads.

## SMR Interface Implementations

The command interface of SMR disks can take different forms, referred to as
models, with visible differences from the host and user point of view. It
is important to understand these differences, as not all implementation options
are appropriate for a particular storage application. The three models
that are in use today are:

* **Host Managed** This model accommodates only sequential write workloads to
  deliver both predictable performance and control at the host level.
  Host-software modifications are required to use host managed SMR drives.

* **Drive Managed** This model deals with the sequential write constraint
  internally, providing a bacward compatible interface. Drive managed disks
  accommodate both sequential and random writing.

* **Host Aware** This model offers the convenience and flexibility of the drive
  managed model, that is, backward compatibility with regular disks, while also
  providing the same host control interface as host managed models.

### Host Managed Model

The host managed model does not provide backwards-compatibility with legacy
host storage stacks, but rather, delegates management of the SMR sequential
write constraint to the host. This is the key difference from drive managed
disks: host managed devices do not allow any random write operations within
(sequential write required) zones.

With the host managed model, the device blocks are organized in a number of
zones ranging from one to potentially many thousands. There are two types of
zones: sequential write required zones and optional conventional zones.
Conventional zones, which typically occupy a very small percentage of the
overall drive capacity, can accept random writes and are typically used to
store metadata. Sequential write required zones occupy the majority of the
overall drive capacity where the device enforces sequentiality of all write
commands within each zone. It should be noted that with the Host Managed model,
random read commands are supported and perform comparably to that of standard
drives.

The host must manage all write operations to be in sequence within a particular
sequential write required zone by following a write pointer. Once data is
written to the zone, the write pointer increments to indicate the starting
point of the next write operation in that zone. Any out-of-order writes, that
is, a write operation not starting at the zone write pointer location, will
force the drive to abort the operation and flag an error. Recovery from such an
error is the responsibility of the controlling host software. This enforcement
allows host managed devices to deliver predictable performance.

### Drive Managed Model

In the drive managed SMR disk model the drive deals with the sequential write
constraint internally, providing a backwards compatible interface. The
performance characteristics of drive managed SMR disks will however depend on
the applications used and workloads executed.

### Host Aware Model

The host aware model is the superset of the host managed and drive managed
models as it simultaneously preserves compatibility with legacy host storage
stacks (backward compatibility with regular disks) and provides the same set of
commands for a host to tightly control the disk write operation handling.

Similarly to drive managed disks, the performance of host aware disks when used
as regular disks will depend on application and workload.

All host-side software support and optimization discussed in this site apply
to host aware SMR disks when these devices are used similarly to host managed
disks.

:::info ZonedStorage.io focuses on host managed devices
The documentation pages of this site focus on host managed SMR disks. Drive
managed and host aware disks used as regular devices are not discussed.
:::

## Governing Standards

A new specification of commands have been defined for SMR disks implementing the
Host Managed and Host Aware models. These new command interfaces are all
standards-based and developed by the INCITS T10 committee for SCSI drives and
the INCITS T13 committee for ATA drives. There is no specific industry standard
for the Drive Managed model because it is backward compatible and purely
transparent to hosts.

### SCSI Standard: ZBC

The Zoned Block Command (ZBC) revision 05 is the published approved standard
defining the new zone management commands and read/write command behavior for
Host Managed and Host Aware SCSI drives. Implemented in conjunction with the
applicable clauses of the SPC-5 and SBC-4 specifications, the ZBC specifications
define the model and command set extensions for zoned block devices.

The Zoned Block Commands specifications document is published
as <a href="https://standards.incits.org/apps/group_public/project/details.php?project_id=525"
target="_blank">ANSI INCITS 536-2016: Information technology – Zoned Block
Commands (ZBC)</a> and can be purchased from the <a href="http://webstore.ansi.org/"
target="_blank">ANSI webstore</a>. This document is available at no cost to
INCITS T10 member companies. Contact INCITS for further information.

### ATA Standard: ZAC

The INCITS Technical Committee T13 is responsible for all interface standards
relating to the popular AT Attachment (ATA) storage interface used with many
disk drive today. The Zoned Device ATA Command Set (ZAC) is the published
approved standard specifying the command set that host systems use to access
storage devices that implement the Host Aware Zones feature set or the Host
Managed Zones feature set. This standard is an extension to the ATA
implementation standards described in AT Attachment - 8 ATA/ATAPI Architecture
Model (ATA8-AAM) and provides a common command set for systems manufacturers,
system integrators, software suppliers, and suppliers of storage devices that
provide one of the zones feature sets.

The Zoned Device ATA Command Set specifications document is published
as <a href="https://standards.incits.org/apps/group_public/project/details.php?project_id=403"
target="_blank">INCITS 537-2016: Information technology – Zoned Device ATA
Command Set (ZAC)</a> and can be purchased from the <a href="http://webstore.ansi.org/"
target="_blank">ANSI webstore</a>. This document is available at no cost to
INCITS T13 member companies. Contact INCITS for further information.

## Zone Block Commands

The ZAC and ZBC standards describe the set of commands necessary for a host
application to manage zones of a Host Managed or Host Aware drive. While these
two standards describe commands for two separate protocols (SCSI and ATA), the
zone management commands defined are semantically identical and the behavior of
read and write commands defined are also compatible. In addition to the zone
management commands, the ZBC and ZAC standards also both define the zone models
discussed in the [SMR Interface Implementations](#smr-interface-implementations)
section.

Both standards define five zone management commands as extensions to the disk
basic command set similar to that of a CMR drive.

* **REPORT ZONES** is the command that a host implementation can use to discover
  the zone organization of a host managed or host aware drive. The *REPORT
  ZONES* command returns a list of zone descriptors indicating the starting LBA,
  size, type and condition of a zone. For sequential write required zones (Host
  Managed drives) and sequential write preferred zones (Host Aware drives), a
  zone descriptor also indicates the current position of the zone write pointer.
  This information allows host software to implement sequential write streams to
  zones.

* **RESET ZONE WRITE POINTER** is the command that a host software can use to
  reset the location of a zone write pointer to the beginning of the zone. After
  execution of this command, all data that was written to the zone is lost and
  cannot be accessed.

* **OPEN ZONE** A zoned block device requires internal resources (e.g.
  Persistent zone resources) to maintain each zone. Insufficient resources may
  result in degraded functionality (e.g. Reduced performance or increased power
  consumption). The *OPEN ZONE* command allows an application to explicitly open
  a zone indicating to the drive that resources necessary for writing a zone are
  kept available until the zone is fully written or the zone is closed using the
  *CLOSE ZONE* command. The performance benefits that can be achieved using
  this command are dependent on the drive implementation of zone management.

* **CLOSE ZONE** allows an application to explicitly close a zone that was open
  using the *OPEN ZONE* command to indicate to the drive that the resources used
  for writing to a zone are no longer necessary and can be released.

* **FINISH ZONE** allows an application to move the write pointer of a zone to
  the end of the zone to prevent any further write operations to the zone until
  it is reset.
