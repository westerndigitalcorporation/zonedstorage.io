---
id: smr
title: Shingled Magnetic Recording Hard Disks
sidebar_label: Shingled Magnetic Recording Hard Disks
---

import Image from '/src/components/Image';

# Shingled Magnetic Recording Hard Disks

Shingled Magnetic Recording (SMR) is a magnetic storage data recording
technology that is used in hard disk drives (HDDs). Compared to drives of the
same generation that use conventional magnetic recording (CMR) technology,
Shingled Magnetic Recording provides increased areal density. This increased
areal density results in a higher overall per-drive storage capacity when
compared to CMR drives.

## SMR Overview

Conventional magnetic recording places gaps between recording tracks on hard
disk platters to account for Track mis-registration (TMR) budget. These
separators impact areal density, because portions of the platter surface are not
fully utilized to store user data. Shingled magnetic recording removes the gaps
between tracks by writing the tracks in an overlapping manner, forming a pattern
similar to the shingles on a roof. Physically, this is done by writing the data
sequentially and then overlapping (or “shingling”) it with another track of
data. By repeating this process, more data tracks can be placed on each magnetic
surface than can be placed on an equal amount of magnetic surface in a drive
that uses conventional magnetic recording technology. The figure below
illustrates this principle.

<Image src="intro-smr-tracks.png"
title="SMR hard disks overlapping tracks"/>

The write head that is designed for SMR drives is wider than is necessary for
it to write a single track of data. This greater width produces a stronger
magnetic field that is suitable for magnetizing films of high coercivity. After
one track has been written, the recording head is advanced by only part of its
width. This means that the next track partially overwrites the previous one,
leaving only a narrow band of the previous track readable.

Overlapping tracks are grouped into bands called "zones". These zones are of
fixed capacity, which promotes effective data organization and partial update
capability. Recording gaps are placed between zones to prevent data from being
overwritten by the wide write head. These gaps ensure that the wide write head
does not overwrite the first track of a zone when it is writing the last track
of the preceding zone on the same platter surface.

<Image src="intro-smr-zones.png"
title="SMR hard disks track organization"/>

## Fundamental Implications of SMR

The shingled format of SMR dictates that all data streams must be organized and
written sequentially to the media. There are different methods of implementing
SMR (see the [SMR Interface
Implementations](docs/introduction/smr#smr-interface-implementations) section
below), but the data must be written to the media sequentially regardless of
which method is used. If a particular data sector has to be modified or
re-written, then the entire band of tracks (the "zone") must be re-written.
Because the modified data sector could be under another “shingle” of data,
direct modification is not permitted. This is never the case in traditional CMR
drives.

To modify a sector in a track (when using SMR), you must rewrite the row of
shingles above the track containing the target sector. SMR hard disks provide
true random-read capability, allowing rapid data access in the way that you've
come to expect from traditional CMR drives. This makes SMR an excellent
technology candidate for both active archive and higher-performance sequential
workloads.

## Governing Standards

A specification for commands has been defined for SMR hard disks that implement
the host-managed and host-aware models. These command interfaces are
standards-based and have been developed by the INCITS T10 committee for SCSI
hard disks and by the INCITS T13 committee for ATA hard disks. No industry
standard exists for the drive-Managed model, because it is backwards-compatible
and transparent to hosts.

### SCSI Standard: ZBC

"Zoned Block Command (ZBC) revision 05" is the standard that defines zone
management commands and read/write command behavior for Host-Managed and Host-
Aware SCSI drives. The ZBC specification defines the model and command-set
extensions for zoned block devices, and have been implemented in conjunction
with the applicable clauses of the SPC-5 and SBC-4 specifications.

#### Acquiring the SCSI ZBC Standard

The Zoned Block Commands specifications document is published
as <a href="https://standards.incits.org/apps/group_public/project/details.php?project_id=525"
target="_blank">ANSI INCITS 536-2016: Information technology – Zoned Block
Commands (ZBC)</a> and can be purchased from the <a href="http://webstore.ansi.org/"
target="_blank">ANSI webstore</a>. This document is available at no cost to
INCITS T10 member companies. Contact INCITS for further information.

### ATA Standard: ZAC

The Zoned Device ATA Command Set (ZAC) is the standard that specifies the
command set that host systems use to access storage devices that implement
either the "Host-Aware Zones" feature set or the "Host-Managed Zones" feature
set. The INCITS Technical Committee T13 is responsible for all interface
standards that relate to the popular AT Attachment (ATA) storage interface,
which is used with many disk drives. The Zoned Device ATA Command Set standard
is an extension of the ATA implementation standards that are described in "AT
Attachment - 8 ATA/ATAPI Architecture Model (ATA8-AAM)", and it provides a
common command set for systems manufacturers, system integrators, software
suppliers and suppliers of storage devices that provide one of the
zone-feature sets.

#### Acquiring the ATA ZAC Standard

The Zoned Device ATA Command Set specifications document is published
as <a href="https://standards.incits.org/apps/group_public/project/details.php?project_id=403"
target="_blank">INCITS 537-2016: Information technology – Zoned Device ATA
Command Set (ZAC)</a> and can be purchased from the <a href="http://webstore.ansi.org/"
target="_blank">ANSI webstore</a>. This document is available at no cost to
INCITS T13 member companies. Contact INCITS for further information.

## SMR Interface Implementations

An SMR disk implementation can have three possible interfaces, and their
differences impact hosts and users.

The first two interfaces are defined by the [host-managed and host-aware zone
models](zoned-storage.md#zone-models).

An SMR disk implementation may also choose to hide the SMR sequential write
constraint to the host. This is the **Drive Managed Model** defined by the ZBC
standard. This model handles the SMR sequential-write constraint internally (in
the disk firmware) and provides a backwards-compatible interface to the host.
Drive-managed disks accommodate both sequential and random writing, and can be
used as a replacement for CMR drives without any modification to the host
software.

The performance characteristics of drive-managed SMR disks depend on the
internal disk firmware implementation, applications used and the workloads
executed. This is similar to the performance of host-aware disks that are
used by a host as regular drives.

## SMR Zone Management

The ZAC and ZBC standards describe the set of commands that are necessary for a
host application to manage zones of Host-Managed and Host-Aware drives.
Although these two standards describe commands for two separate command
protocols (SCSI and ATA), the zone types and zone management commands that they
define are semantically identical, and the behavior of the read and write
commands that they define are compatible. The ZBC and ZAC standards each define
the same zone models, and those zone models are discussed in the [SMR Interface
Implementations](#smr-interface-implementations) section.

### Zone Types

The ZAC and ZBC standards allow for two different [zone
types](zoned-storage.md#zone-types) to be used with the host-managed and host-
aware models.

* **Conventional zones** are optional with the host-managed and host-aware
  SMR disks. If present, they typically occupy a very small percentage of the
  overall capacity of a drive.

* **Sequential-write-required zones** are mandatory with the host-managed model
  and cannot be found on host-aware disk models. These zones are subject to the
  SMR sequential write constraint and thus can be written only sequentially.

* **Sequential-write-preferred zones** are mandatory with the host-aware model
  and cannot be found on host-managed drives.

### Zone Management Commands

Both the ZAC and the ZBC standards define [five zone management
commands](zoned-storage.md#zone-management-commands) as extensions of the
drive's basic command set (which is similar to the set of commands defined for
CMR drives).

### Zone Resources Limits

The ZAC and ZBC standards define only one [zone resources
limit](zoned-storage.md#zone-resources-limits). A drive can have a limit on the
number of zones that can be in the implicit open or explicit open state (open
zones).

An [active zone resource limit](zoned-storage.md#active-zones-limit) is not
defined for SMR hard disks by the ZBC and ZAC standards.  The user can assume
that SMR hard disks do not have a limit on the number of zones that can be
active (that is, on the number of zones on the drive that can be partially
written).

Since host-aware drives are backwards compatible with regular CMR disks, the
ZBC and ZAC standards do not define any limit on the number of open zones for
this model. However, the standards define that a drive can advertize and optimal
maximum number of open zones. This is a non-restrictive guideline for the host
rather than an enforced limit. The host software can use this information to
avoid performance degradation due to an excessive number of zone partially
written on the device.

### Zone Append

The ZAC and ZBC standards do not define a [zone append
command](zoned-storage.md#zone-append) for SMR hard disks. However, this
command semantic can be emulated by host software stacks.
