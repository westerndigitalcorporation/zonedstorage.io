---
id: faq
title: Frequently Asked Questions
sidebar_label: Frequently Asked Questions
---

# Frequently Asked Questions

### **Can I change the size of the zones of a device?**

The size of the zones of a physical zoned device are fixed at manufacturing
time by the device vendor. For a particular device model, it is not possible
to change the zone size.

Device emulation software such as
[tcmu-runner](/docs/tools/tcmu-runner) allow defining zoned block devices with
different zone sizes. While this does not replace the ability to change an
existing device zone size, such solution allows exploring the impact of the
device zone size on the application being developed.

### **With a host managed drive, how do I change the position of a zone write pointer?**

The write pointer position of a zone changes automatically in response to the
following operations.

* A write operation (regular write command, write same command) issued with
  a starting LBA equal to the zone write pointer current location or a zone
  append write operation issued with a starting LBA equal to the zone start LBA:
  the write pointer position advances by an amount of LBAs written.
* A zone reset operation: the write pointer position of the target zone(s)
  is reset to the start of the zone.
* A zone finish operation: the write pointer position of the target zone(s)
  is changed an invalid value with the zone condition cnahed to FULL.
* A device low level format operation: the write pointer of all zones is reset.

No other command, operation or user action can change the position of a zone
write pointer to any position within the zone.

### **How do I rewind the position of a zone write pointer?**

As mentioned in the previous question reply, resetting a zone will rewind the
zone write pointer position to the first LBA of the zone. A low level device
format operation will also reset all zones.

### **How do I partially rewind the position of a zone write pointer?**

This is not possible. A zone write pointer can only be moved back to the start
LBA of the zone using a reset write pointer command.

### **Can I create partitions on my host managed device?**

Kernel versions 4.10 to 5.4 include support for partition tables on host managed
zoned block devices. However, partitioning tools such as
<a href="https://gparted.org/" target="_blank">*gparted*</a> generally used to
create GUID partition tables do not support host managed zoned devices that do
not have a conventional zone at the beginning and end of the LBA space. If the
first zone and last zone of the device are sequential write required zones,
writing the primary and secondary GPT header and table entries will likely fail,
resulting in an incorrect or corrupted partition table that will not be
recognized by the kernel block layer.

:::note
Linux&reg; kernel mandates that partitions of a zoned block device be zone
aligned. That is, the start sector of all device partitions must be the start
sector of a zone and the end sector of the partitions must be the last sector of
a zone.
:::

Support for partition tables on host managed zoned block devices has been
removed from the kernel with version 5.5.0. Using the
[*dm-linear*](/docs/device-mapper/dm-linear) device mapper target to logically
isolate smaller portions of a host managed device is the replacement and
preferred solution.

More information on partition support can be found [here](/docs/linux/part).
