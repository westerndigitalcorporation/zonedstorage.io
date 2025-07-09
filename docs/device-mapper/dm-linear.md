---
id: dm-linear
title: dm-linear
sidebar_label: dm-linear
---

# dm-linear

The *dm-linear* target maps a linear range of blocks of the device-mapper device
onto a linear range on a backend device. *dm-linear* is the basic building
block of logical volume managers like <a href="http://www.sourceware.org/lvm2/"
target="_blank">*LVM*</a>.

*dm-linear* detailed documentation and some usage examples can be found in the
kernel source code documentation file
<a href="https://github.com/torvalds/linux/blob/master/Documentation/admin-guide/device-mapper/linear.rst"
target="_blank">Documentation/admin-guide/device-mapper/linear.rst</a>.

## Zoned Block Device Restrictions

When used with zoned block devices, the *dm-linear* device that is created will
also be a zoned block device with the same zone size as the underlying device.
Several conditions are enforced by the device-mapper core-management code
during the creation of a *dm-linear* target device.

* All backend devices used to map different ranges of the target device must
  have the same zone model.
* If the backend devices are zoned block devices, all devices must have the same
  zone size.
* The mapped ranges must be zone aligned, that is, partial zone mapping is not
  possible.

## Example: Creating a Small Host Managed Disk

This example illustrates how to create a small host-managed disk that uses zone
ranges from a large high capacity host-managed disk. The zone information of
the backend device used is shown below.

```plaintext
# cat /sys/block/sdb/queue/zoned
host-managed
# cat /sys/block/sdb/queue/chunk_sectors
524288
# blkzone report /dev/sdb
  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  ...
  start: 0x010580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010600000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010680000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x010700000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  ...
  start: 0x6d2300000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x6d2380000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

To create a *dm-linear* device named "small-sdb" that joins the first 5
conventional zones of the backend device with the first 10 sequential zones,
use the following command.

```plaintext
# echo "0 2621440 linear /dev/sdb 0
2621440 5242880 linear /dev/sdb 274726912" | dmsetup create small-sdb
```

The resulting device zone model is host-managed and has 15 zones, as shown
below.

```plaintext
# cat /sys/block/dm-0/queue/zoned
host-managed
# cat /sys/block/dm-0/queue/chunk_sectors
524288
# blkzone report /dev/dm-0
  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000200000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000280000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000300000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000380000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000400000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000480000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000500000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000600000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000680000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000700000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

The following shows a script that facilitates the creation of *dm-linear*
devices using zone ranges from a single zoned block device. Such small zoned
block devices can be used to test application limits (e.g. Disk full
conditions).

```bash
#!/bin/bash

if [ $# -ne 3 ]; then
	echo "Usage: $0 <disk> <num conv zones> <num seq zones>"
	exit 1
fi

disk="$1"
nrconv=$2
nrseq=$3
dname="$(basename ${disk})"

# Linear table entries: "start length linear device offset"
# start: starting block in virtual device
# length: length of this segment
# device: block device, referenced by the device name or by major:minor
# offset: starting offset of the mapping on the device

convlen=$(( nrconv * 524288 ))
seqlen=$(( nrseq * 524288 ))

if [ ${convlen} -eq 0 ] && [ ${seqlen} -eq 0 ]; then
	echo "0 zones..."
	exit 1
fi

seqofst=$(blkzone report "$1" | grep "SEQ_WRITE_REQUIRED" |
	  head -n1 | cut -f1 -d',' | cut -f2 -d':' | xargs printf "%d\n")

if [ ${convlen} -gt ${seqofst} ]; then
	nrconv=$(( seqofst / 524288 ))
	echo "Too many conventional zones requested: truncating to $nrconv"
	convlen=${seqofst}
fi

if [ ${convlen} -eq 0 ]; then
	echo "0 ${seqlen} linear ${disk} ${seqofst}" | dmsetup create small-${dname}
elif [ ${seqlen} -eq 0 ]; then
	echo "0 ${convlen} linear ${disk} 0" | dmsetup create small-${dname}
else
	echo "0 ${convlen} linear ${disk} 0
	${convlen} ${seqlen} linear ${disk} ${seqofst}" | dmsetup create small-${dname}
fi
```

## Example: Conventional Zones as a Regular Disk

*dm-linear* can also be used to aggregate a zoned block device's conventional
zones together into a target device that will be usable as a regular disk
(conventional zones can be randomly written). Reusing the previous example
backend disk, 524 conventional zones of 524288 sectors (512 B unit) are
available. The following command creates a *dm-linear* device joining all
conventional zones together.

```plaintext
# echo "0 274726912 linear /dev/sdb 0" | dmsetup create small-sdb
```

The target device is again a host-managed disk but contains only conventional
zones.

```plaintext
# cat /sys/block/dm-0/queue/zoned
host-managed
# cat /sys/block/dm-0/queue/chunk_sectors
524288
# blkzone report /dev/dm-0
  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  ...
  start: 0x010500000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x010580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
```

Because this zoned block device is composed entirely of conventional zones, all
sectors are randomly writable and can therefore be used directly with any file
system.

```plaintext
# mkfs.ext4 /dev/dm-0
mke2fs 1.44.6 (5-Mar-2019)
Creating filesystem with 34340864 4k blocks and 8585216 inodes
Filesystem UUID: 3957429a-5dab-4b30-9797-f9736036a47b
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
	4096000, 7962624, 11239424, 20480000, 23887872

Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done

# mount /dev/dm-0 /mnt
# ls -l /mnt
total 16
drwx------ 2 root root 16384 May 21 17:03 lost+found
```

Applications that need frequent random updates to their metadata can use such
setups to facilitate the implementation of a complex metadata structure. The
remaining sequential zones of the disk can be used directly by the application
to store data.
