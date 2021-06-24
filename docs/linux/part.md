
# Zoned Block Device Partition Support

Support for partition tables on zoned block devices depends on the kernel
version being used.

## Kernel Versions 4.10 to 5.4

All kernels starting with version 4.10.0 (first kernel including zoned block
device support) up to version 5.4 support partition tables on zoned block
devices. For these kernels, The start sector and size of partitions of a zoned
block device must be aligned to zone boundaries of the device. That is, a
partition must start with the first sector of a zone and ends on the last sector
of a zone.

A zone report operation on a partition device (as opposed to a zone report for
the entire container device) will report zone sector information (zone start
sector and write pointer position) relative to the partition start sector.
Similarly, a zone reset operation must specify a target zone range relative to
the partition start sector. In effect, a zoned block device partition can be
treated exactly like a regular disk, using the partition zoned block device with
a start sector of 0. All zone and IO operations will be executed correctly
taking into account the partition start sector and size.

For host aware zoned block device models, creating partitions using a standard
tools such as <a href="https://gparted.org/" target="_blank">*gparted*</a> to
create a GUID partition table will work as expected. Since well-known partition
tools do not have zoned block device support implemented, users must manually
align the partitions to zone boundaries to satisfy the kernel constraint. This
alignement will not be automatically done by the partitioning tool.

However, the lack of zoned block device support for partition management tools
can result in write IO errors for host managed zoned disk models. If the zones
to be used to store the partition table data are sequential write required
zones, then the partition tool must be able to correctly write align the
partition table information on disk with the write pointer position of the
zones that will be written. For instance, with the GUID partition table format,
if the last zone of the disk is a sequential write required zone, the secondary
GPT header and table entries will not necessarily be writable at the end of the
disk LBA space, that is, at the end of the last zone of the disk. While manually
performing this alignment is possible, such a procedure would be very difficult
and unreliable.

As a result, Using the [*dm-linear*](../linux/dm.md#dm-linear) device mapper
target to isolate smaller portions of a large host managed device is a better
solution than partitions. Users should assume that partitions are not supported
for host managed zoned block devices.

## Kernel Versions 5.5 and later

Starting with the kernel version 5.5.0, partition support for host managed zoned
block devices is ino longer provided. If a well formatted partition table is
detected on a host managed zoned block device, the kernel will ignore it and
will not create the block device files representing the partitions.

For host aware zoned block devices, partitions are still supported. However, the
kernel behavior differs from previosu versions. If a valid partition table is
detected on a host aware zoned device, the device zone model is changed to
*none*, completely disabling the use of the device and of its partitions as
zoned block devices. In other words, a partitioned host aware device is always
turned into a logical regular block device. Deleting the device partition table
will enable again the use of the host aware device as a zoned block device.

