
# Zoned Block Device Partition Support

Support for partition tables on zoned block devices depends on the kernel
version being used.

## Kernel Versions 4.10 to 5.4

All kernels from version 4.10.0 (first kernel including zoned block
device support) to version 5.4 support partition tables on zoned block
devices. For these kernels, the start sector and the size of the partitions on 
the zoned block device must be aligned to the zone boundaries of the device. 
In other words: a partition must start with the first sector of a zone and end 
on the last sector of a zone.

A zone report operation on a partition device (as opposed to a zone report for
the entire container device) reports zone sector information (zone start
sector and write pointer position) relative to the partition start sector.
Similarly, a zone reset operation must specify a target zone range relative to
the partition start sector. In effect, a zoned block device partition can be
treated exactly like a regular disk: the partition zoned block device is used 
with a start sector of 0. All zone and IO operations will be executed 
correctly, taking into account the partition start sector and size.

For host-aware zoned block device models, creating partitions using standard tools like <a href="https://gparted.org" target="_blank">gparted</a> works as expected. Because these standard partitioning tools do not have zoned-block-device support implemented, users must manually align the partitions to the zone's boundaries in order to satisfy kernel constraints. This alignment is not automatically done by the partitioning tool.

The lack of zoned-block device support for partition management tools
can result in write-IO errors for host-managed zoned disk models. If the zones
that are used to store the partition table data are sequential write-required
zones, then the partition tool must be able correctly to write-align (1) the
partition table information on the disk with (2) the write pointer position 
of the zones to be written. For instance, with the GUID partition table 
format, if the last zone of the disk is a sequential write required zone, 
the secondary GPT header and table entries will not necessarily be writable 
at the end of the disk LBA space (the end of the last zone of the disk). 
Although performing this alignment (manually) is possible, such a procedure 
would be very difficult and unreliable.

We recommend using the [*dm-linear*](../linux/dm.md#dm-linear) device mapper
target to isolate smaller portions of large host-managed devices, as this is
a better solution than partitions. Users should assume that partitions are 
not supported for host-managed zoned block devices.

## Kernel Versions 5.5 and later

As of kernel version 5.5.0, partition support for host-managed zoned
block devices is no longer provided. If a well-formatted partition table is
detected on a host-managed zoned block device, the kernel will ignore it and
will not create the block device files that represent the partitions.

For host-aware zoned block devices, partitions are still supported. However, the
kernel behavior differs from previous versions. If a valid partition table is
detected on a host-aware zoned device, the device zone model is changed to
*none*, which disables the use of the device and the use of its partitions as
zoned block devices. In other words, a partitioned host-aware device is, under
these conditions, always turned into a logical regular block device. Deleting 
the device partition table will re-enable the use of the host-aware device 
as a zoned block device.

