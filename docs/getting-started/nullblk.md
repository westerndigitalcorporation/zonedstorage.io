# Zoned Block Device Emulation with *null_blk*

The 
[Linux&reg; *null_blk* driver](https://www.kernel.org/doc/Documentation/block/null_blk.txt)
is a powerful tool that can emulate various types of block devices.
Since kernel version 4.19, the *null_blk* driver has been able to
emulate zoned block devices. Because memory backup has been added to
the *null_blk* device for data reading and writing operations, the
*null_blk* driver has become a practical, powerful tool that can be
used for application development and tests.

## Creating a Zoned *null* Block Device &mdash; Simplest Case

The simplest way to create a *null_blk* emulated zoned block
device is to specify `zoned=1` as an argument that follows the
*modprobe **null_blk* command on the command line, as in the following
example:

```plaintext
# modprobe null_blk nr_devices=1 zoned=1
```

This creates a single, host-managed zoned block device that has a zone
size of 256M and a total capacity of 250 GB (1000 zones). No
conventional zones are created with this simple command.

```plaintext
# blkzone report /dev/nullb0
  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000080000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000100000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000180000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x01f300000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x01f380000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

## Listing *null_blk* Zoned Block Device Parameters

The *null_blk* kernel module accepts many arguments to adjust the zone
configuration of the emulated device. The zone-related arguments can
be listed using the *modinfo* command and those arguments can be
modified by using *configfs* once the *null_blk* module is loaded.

```
# modinfo null_blk
...
parm:           zoned:Make device as a host-managed zoned block device. Default: false (bool)
parm:           zone_size:Zone size in MB when block device is zoned. Must be power-of-two: Default: 256 (ulong)
parm:           zone_capacity:Zone capacity in MB when block device is zoned. Can be less than or equal to zone size. Default: Zone size (ulong)
parm:           zone_nr_conv:Number of conventional zones when block device is zoned. Default: 0 (uint)
parm:           zone_max_open:Maximum number of open zones when block device is zoned. Default: 0 (no limit) (uint)
parm:           zone_max_active:Maximum number of active zones when block device is zoned. Default: 0 (no limit) (uint)
```
The parameters that are related to zoned-device emulation are shown in
the table below.

<center>

| Argument | Value | Description |                                       
| -------- | ----- | ----------- |                                         
| zoned | 0 or 1 | Disable or enable zoned mode (default: disabled) |
| zone_size | zone size in MiB | The size of each zone (default: 256) |
| zone_capacity | zone capacity in MiB | The capacity of each zone (default: zone size) |
| zone_nr_conv | number | Number of conventional zones (default: 0) |
| zone_max_open | number | Maximum number of open zones (default: 0, meaning no limit) |
| zone_max_active | number | Maximum number of active zones (default: 0, meaning no limit) |
                                                                                 
</center>  

## Creating a *null_blk* Zoned Block Device &mdash; More Advanced Cases (configfs)

To create an emulated zoned block device with *null_blk*, as shown above, the
*modprobe* command can be used. Additional parameters can be passed to this
command to configure the emulated disk.

```plaintext
# modprobe null_blk nr_devices=1 \
	zoned=1 \
	zone_nr_conv=4 \
	zone_size=64 \
```

In this example, the arguments mean the following:

   1. ``nr_devices=1`` means that only one (1) device will be created.
   2. ``zoned=1`` means that all devices that are created will be zoned devices.
   3. ``zone_nr_conv=4`` sets the number of conventional zones to four (4).
   4. ``zone_size=64`` sets the size of each zone to sixty-four (64) megabytes.


The *configfs* interface of the *null_blk* driver provides a more powerful
method for creating emulated zoned block devices. The *configfs* parameters
of the *null_blk* driver can be listed by running the following commands:

```plaintext
# modprobe null_blk nr_devices=0

# cat /sys/kernel/config/nullb/features
memory_backed,discard,bandwidth,cache,badblocks,zoned,zone_size,zone_capacity,zone_nr_conv,zone_max_open,zone_max_active
```

The *configfs* interface can be used to script the creation of emulated zoned
block devices with different zone configurations. An example is provided below.

```bash
#!/bin/bash

if [ $# != 4 ]; then
        echo "Usage: $0 <sect size (B)> <zone size (MB)> <nr conv zones> <nr seq zones>"
        exit 1
fi

scriptdir=$(cd $(dirname "$0") && pwd)

modprobe null_blk nr_devices=0 || return $?

function create_zoned_nullb()
{
        local nid=0
        local bs=$1
        local zs=$2
        local nr_conv=$3
        local nr_seq=$4

        cap=$(( zs * (nr_conv + nr_seq) ))

        while [ 1 ]; do
                if [ ! -b "/dev/nullb$nid" ]; then
                        break
                fi
                nid=$(( nid + 1 ))
        done

        dev="/sys/kernel/config/nullb/nullb$nid"
        mkdir "$dev"

        echo $bs > "$dev"/blocksize
        echo 0 > "$dev"/completion_nsec
        echo 0 > "$dev"/irqmode
        echo 2 > "$dev"/queue_mode
        echo 1024 > "$dev"/hw_queue_depth
        echo 1 > "$dev"/memory_backed
        echo 1 > "$dev"/zoned

        echo $cap > "$dev"/size
        echo $zs > "$dev"/zone_size
        echo $nr_conv > "$dev"/zone_nr_conv

        echo 1 > "$dev"/power

        echo mq-deadline > /sys/block/nullb$nid/queue/scheduler

        echo "$nid"
}

nulldev=$(create_zoned_nullb $1 $2 $3 $4)
echo "Created /dev/nullb$nulldev"
```

This script (*nullblk-zoned.sh*) takes four arguments:

   1. the sector size in bytes of the emulated device
   2. the device zone size in MiB
   3. the number of conventional zones (which can be 0)
   4. the number of sequential write required zones.

Memory-backing for written sectors can be turned on with this script
(memory_backed=1). This enables run-time persistence of the data written to
the sectors of the emulated device. The writen data is lost when the emulated
device is destroyed.

For example, a small zoned device with 4 conventional zones and 8 sequential
write required zones of 64 MiB can be created with the following command:

```plaintext
# nullblk-zoned.sh 4096 64 4 8
Created /dev/nullb0
# blkzone report /dev/nullb0 
  start: 0x000000000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000020000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000040000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000060000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x0000a0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x0000c0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x0000e0000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000100000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x000820000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000840000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000860000, len 0x020000, cap 0x020000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

## Deleting a *null_blk* Zoned Block Device

There are two ways to delete *null_blk* zoned block devices. One way is used to
delete *null_blk* zoned block devices that were created using *modprobe* and
the other way is used to delete *null_blk* zoned block devices that were
created using *configfs*.

### Deleting ZBD that were created with modprobe

Emulated devices created by using *modprobe* (and not created using *configfs*)
can be deleted by removing the *null_blk* kernel module:

```plaintext
# rmmod null_blk
```

This command will not delete emulated devices that were created through the
*configfs* interface.

### Deleting ZBD that were created with configfs

The following script is the counterpart of the zoned block device creation
script shown above. It can be used to destroy *null_blk* devices created
through *configfs*.

```bash
#!/bin/bash

if [ $# != 1 ]; then
	echo "Usage: $0 <nullb ID>"
	exit 1
fi

nid=$1

if [ ! -b "/dev/nullb$nid" ]; then
	echo "/dev/nullb$nid: No such device"
	exit 1
fi

echo 0 > /sys/kernel/config/nullb/nullb$nid/power
rmdir /sys/kernel/config/nullb/nullb$nid

echo "Destroyed /dev/nullb$nid"
```

## Emulating SMR HDD

The *nullblk-zoned.sh* script makes it possible to create zoned block
devices that correspond to a possible configuration of an SMR hard
disk, with no limit on the maximum number of open zones. This script
can be modified to add a limit to the number of open zones on the
emulated device (the *zone_max_open* parameter controls this), to more
faithfully emulate an SMR HDD's characteristics.

The *zone_capacity* and *zone_max_active* parameters should not be
used when the emulated device is meant to mimic the characteristics of
an SMR hard disk.

## Emulating NVMe ZNS SSD

The *zone_capacity* and *zone_max_active* parameters make it possible to
create an emulated zoned block device that mimics the characteristics of a
NVMe Zoned Namespace SSD. The *zone_capacity* parameter is used to specify
the number of sectors in each zone that can be read and written. The
*zone_max_active* argument is used to specify a limit on the number of
zones that can be in the closed state, the implicit-open state, or the
explicit-open state.


