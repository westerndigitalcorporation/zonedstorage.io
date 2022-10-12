---
id: smr
title: Shingled Magnetic Recording (SMR) HDDs
sidebar_label: Shingled Magnetic Recording (SMR) HDDs
---

import Image from '/src/components/Image';

# Shingled Magnetic Recording

Shingled Magnetic Recording (SMR) is a magnetic storage data recording
technology that is used in hard disk drives (HDDs). Compared to drives of the
same generation that use conventional magnetic recording (CMR) technology,
Shingled Magnetic Recording (SMR) provides increased areal density. This
increased areal density results in a higher overall per-drive storage capacity
when compared to CMR drives.

## SMR Overview

Conventional magnetic recording places gaps between recording tracks on HDDs to
account for Track mis-registration (TMR) budget. These separators impact areal
density, because portions of the platter surface are not fully utilized.
Shingled magnetic recording removes the gaps between tracks by writing the
tracks in an overlapping manner, forming a pattern similar to the shingles on a
roof. Physically, this is done by writing the data sequentially and then
overlapping (or “shingling”) it with another track of data. By repeating this
process, more data tracks can be placed on each magnetic surface than can be
placed on an equal amount of magnetic surface in a drive that uses conventional
magnetic recording technology. The figure below illustrates this principle.

<Image src="intro-smr-tracks.png"
title="SMR disks overlapping tracks"/>

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
of the preceding zone on the same surface.

<Image src="intro-smr-zones.png"
title="SMR disks track organization"/>

## Fundamental Implications of SMR

The shingled format of SMR dictates that all data streams must be organized and
written sequentially to the media. There are different methods of implementing
SMR (see SMR Implementations section below), but the data must be written to the
media sequentially regardless of which method is used. If a particular data
sector has to be modified or re-written, then the entire band of tracks (the
"zone") must be re-written.  Because the modified data sector could be under
another “shingle” of data, direct modification is not permitted. This is never
the case in traditional CMR drives.

To modify a track in a sector (when using SMR), you must rewrite the row of
shingles above the sector containing the target track. SMR hard disks provide
true random-read capability, allowing rapid data access in the way that you've
come to expect from traditional CMR drives. This makes SMR an excellent
technology candidate for both active archive and higher-performance sequential
workloads.

## SMR Interface Implementations

The command interface of SMR disks can take different forms. These forms are
referred to as "models", and their differences impacts hosts and users. It is
important to understand these differences, as not all implementation options are
appropriate for a particular storage application.  The three models that are in
use today are:

* **Host Managed** This model accommodates only sequential write workloads to
  deliver both predictable performance and control at the host level.
  Modifications to host software are required to use host managed SMR drives.

* **Drive Managed** This model respects the sequential write constraint
  internally and provides a backwards-compatible interface. Drive managed disks
  accommodate both sequential and random writing.

* **Host Aware** This model offers backwards compatibility with regular disks
  in the same way that the drive-managed model does, but also provides the
  same host control interface provided by host-managed models.

### Host-Managed Model

The host-managed model does not provide backwards compatibility with legacy
host storage stacks. Instead, it delegates management of the SMR "sequential
write constraint" to the host. This is the key difference between host-managed
disks and drive-managed disks: host-managed devices do not allow random
write operations within (sequential write required) zones.

In the host-managed model, device blocks are organized into zones that can
number anywhere from one to many thousands. There are two types of zones: (1)
sequential write-required zones and (2) conventional zones (which are
optional). Conventional zones, which typically occupy a very small percentage
of a drive's overall capacity, can accept random writes and are usually used to
store metadata. Sequential-write-required zones occupy the majority of the
drive's overall capacity. In the Host Managed model, random read commands are
supported and perform comparably to random read commands on standard drives.

The host must manage all write operations. This is done by using the write
pointer to enforce sequential writing within sequential write required zones.
After data has been written to a zone, the write pointer increments in order to
indicate the starting point of the next write operation in that zone. Any
out-of-order writes (write operations that do not start at the zone write
pointer location) force the drive to abort the operation and flag an error.
Recovery from such an error is the responsibility of the controlling host
software. This enforcement allows host-managed devices to deliver predictable
performance.

### Drive-Managed Model

In the drive-managed SMR disk model, the drive respects the sequential write
constraint internally without exposing this constraint to the host software.
Thisprovides a backwards-compatible interface. The performance characteristics
of drive-managed SMR disks depend on the internal disk firmware implementation,
applications used and the workloads executed.

### Host Aware Model

The host aware model is the superset of the host managed and drive managed
models as it simultaneously preserves compatibility with legacy host storage
stacks (backwards compatibility with regular disks) and provides the same set of
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

A specification for commands has been defined for SMR disks that implement the
Host-Managed and Host-Aware models. These command interfaces are
standards-based and have been developed by the INCITS T10 committee for SCSI
drives and by the INCITS T13 committee for ATA drives. No industry standard
exists for the Drive-Managed model, because it is backward-compatible and
transparent to hosts.

### SCSI Standard: ZBC

"Zoned Block Command (ZBC) revision 05" is the standard that defines zone
management commands and read/write command behavior for Host-Managed and Host-
Aware SCSI drives. ZBC specifications define the model- and command-set
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
set.  The INCITS Technical Committee T13 is responsible for all interface
standards that relate to the popular AT Attachment (ATA) storage interface,
which is used with many disk drives. The Zoned Device ATA Command Set standard
is an extension to the ATA implementation standards that are described in "AT
Attachment - 8 ATA/ATAPI Architecture Model (ATA8-AAM)", and it provides a
common command set for systems manufacturers, system integrators, software
suppliers, and suppliers of storage devices that provide one of the
zone-feature sets.

#### Acquiring the ATA ZAC Standard

The Zoned Device ATA Command Set specifications document is published
as <a href="https://standards.incits.org/apps/group_public/project/details.php?project_id=403"
target="_blank">INCITS 537-2016: Information technology – Zoned Device ATA
Command Set (ZAC)</a> and can be purchased from the <a href="http://webstore.ansi.org/"
target="_blank">ANSI webstore</a>. This document is available at no cost to
INCITS T13 member companies. Contact INCITS for further information.

## Zone Block Commands

The ZAC and ZBC standards describe the set of commands that are necessary for a
host application to manage zones of Host-Managed and Host-Aware drives.
Although these two standards describe commands for two separate protocols (SCSI
and ATA), the zone management commands that they define are semantically
identical, and the behavior of the read and write commands that they define are
compatible. The ZBC and ZAC standards each define the zone models, and those
zone models are discussed in the [SMR Interface
Implementations](#smr-interface-implementations) section.

### Five Zone Management Commands

Both the ZAC and the ZBC standards define five zone management commands as
extensions of the disk's basic command set (which is similar to the set
of commands defined for CMR drives).

* **REPORT ZONES** is the command that  host implementations use to discover
  the zone organization of a host-managed or a host-aware drive. The *REPORT
  ZONES* command returns a list of zone descriptors that indicate the starting
  LBA, size, type, and condition of a zone. For sequential write required zones
  (Host-Managed drives) and sequential write preferred zones (Host-Aware
  drives), a zone descriptor also indicates the current position of the zone
  write pointer. This information allows host software to implement sequential
  write streams to zones.

* **RESET ZONE WRITE POINTER** is the command that host software uses to
  reset the location of a zone write pointer to the beginning of the zone. After
  this command is executed, all data that was written to the zone is lost and
  cannot be accessed.

* **OPEN ZONE** A zoned block device requires internal resources (for example,
  Persistent zone resources) to maintain each zone. Insufficient resources may
  result in degraded functionality (for example, Reduced performance or
  increased power consumption). The *OPEN ZONE* command allows an application
  explicitly to open a zone, and indicates to the drive that the resources
  necessary for writing a zone will remain available until the zone is fully
  written or until the zone is closed by using the *CLOSE ZONE* command. The
  performance benefits achieved by using this command depend upon the drive
  implementation of zone management.

* **CLOSE ZONE** allows an application to explicitly close a zone that was
  opened using the *OPEN ZONE* command. *CLOSE ZONE* indicates to the drive
  that the resources used for writing to the zone are no longer necessary and
  can be released.

* **FINISH ZONE** allows an application to move the zone's write pointer to the
  end of the zone, preventing any further write operations to the zone until it
  is reset.
