---
id: zoned-storage
title: Zoned Storage Devices Overview
sidebar_label: Zoned Storage Devices Overview
---

import Image from '/src/components/Image';

# Zoned Storage Devices

Zoned storage devices are a class of storage devices that have an address space
that is divided into zones that have write constraints that are different from
regular storage devices.

## Principle of Operation

Zones in zoned storage devices must be written sequentially. This is called the
**sequential write constraint**. Each zone in the device address space has a
write pointer that keeps track of the position of the next write. Data in a
zone cannot be directly overwritten: before being overwritten, the zone must
first be erased using a special command (zone reset). The figure below
illustrates this principle.

<Image src="intro-zoned-storage.png"
title="Zoned Storage Devices Principle"/>

Zoned storage devices can be implemented using various recording and media
technologies. The most common form of zoned storage today uses the SCSI Zoned
Block Commands (ZBC) and Zoned ATA Commands (ZAC) interfaces on [Shingled
Magnetic Recording (SMR)](./smr) HDDs. ZBC and ZAC enable a zoned block storage
model; SMR technology enables continued areal density growth that makes it
possible to meet expanding data needs, and SMR technology requires the zoned
block access model.

Solid State Drive (SSD) storage devices can also implement a zoned interface in
order to reduce write amplification, to reduce the device's DRAM needs, and to
improve the quality of service at scale. The [NVMe Zoned NameSpace
(ZNS)](./zns) is a technical proposal of the NVMe standard committee that adds
a zoned storage interface to the NVMe interface standard.

