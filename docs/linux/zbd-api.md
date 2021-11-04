# Zoned Block Device User Interface

User applications can access the zone information of a zoned block device and
can manage the zones of a zoned block device by using two types of interfaces.

1. *sysfs* attribute files, accessible either directly from applications as
   regular files or from scripted languages (shell scripts, python, etc).

2. *ioctl()* system calls, suitable for use from C programs or other programming
   languages that have an equivalent system-call binding.

The *sysfs* files and *ioctl()* commands available to applications have evolved
since the introduction of zoned block device support in Kernel 4.10. The
availability of files and commands per kernel version is detailed in the
following sections.

## Sysfs Interface

Programs that use scripting languages (e.g. bash scripts) can access zoned
device information through *sysfs* attribute files. The attribute files provided
are shown in the following table.

<center>

| File | Kernel version | Description |
| ----- | -------------- | ----------- |
| /sys/block/*dev name*/queue/zoned | 4.10.0 | Device zoned model |
| /sys/block/*dev name*/queue/chunk_sectors | 4.10.0 | Device zone size |
| /sys/block/*dev name*/queue/nr_zones | 4.20.0 | Total number of zones |
| /sys/block/*dev name*/queue/zone_append_max_bytes | 5.8.0 | Maximum size in bytes of a zone append write operation |
| /sys/block/*dev name*/queue/max_open_zones | 5.9.0 | Maximum number of open zones |
| /sys/block/*dev name*/queue/max_active_zones | 5.9.0 | Maximum number of active zones |

</center>

### Device Zoned Model

The zone model of a zoned device can be discovered by using the `zoned` device
queue attribute file. For example: for a zoned block device named *sdb*, the
following shell command displays the device zoned model.

```plaintext
# cat /sys/block/sdb/queue/zoned
host-managed
```

The possible values of the *zoned* attribute file are shown in the table below.

<center>

| Value | Description |
| ----- | ----------- |
| none | Regular block device, including drive-managed SMR disks |
| host-aware | Host-aware device model |
| host-managed | Host-managed device model |

</center>

### Device Zone Size

The device zone size can be read from the *sysfs* queue attribute file that is
named `chunk_sectors`. For a device named *sdb* (the same device as in the
previous example), the following command gives the device zone size.

```plaintext
# cat /sys/block/sdb/queue/chunk_sectors
524288
```

The value is displayed as a number of 512B sectors, regardless of the actual
logical and physical block size of the device. In this example, the device zone
size is *524288 x 512 = 256 MiB*.

### Number of Zones

The sysfs queue attribute file *nr_zones* was introduced in Linux kernel version
4.20.0, and is available to obtain the total number of zones of a zoned device.

```plaintext
# cat /sys/block/sdb/queue/nr_zones
55880
```

This attribute value is always 0 for a regular block device.

## *ioctl()* Application Programming Interface

The C header file `/usr/include/linux/blkzoned.h` contains macro definitions and
data structure definitions that allow application developers to obtain
information about zoned block devices and to manage the zones of the devices.

### Zone Information Data Structures

The data structure `struct blk_zone` defines a zone-descriptor structure that 
contains a complete description of a zone: this includes the zone's location on
the device, the zone type, its condition (state), and the position of the zone
write pointer (for sequential zones). For kernels Up to kernel version 5.8, this
data structure is as shown below.

```c
/**
 * struct blk_zone - Zone descriptor for BLKREPORTZONE ioctl.
 *
 * @start: Zone start in 512 B sector units
 * @len: Zone length in 512 B sector units
 * @wp: Zone write pointer location in 512 B sector units
 * @type: see enum blk_zone_type for possible values
 * @cond: see enum blk_zone_cond for possible values
 * @non_seq: Flag indicating that the zone is using non-sequential resources
 *           (for host-aware zoned block devices only).
 * @reset: Flag indicating that a zone reset is recommended.
 * @reserved: Padding to 64 B to match the ZBC/ZAC defined zone descriptor size.
 *
 * start, len, capacity and wp use the regular 512 B sector unit, regardless
 * of the device logical block size. The overall structure size is 64 B to
 * match the size of the ZBC-, ZAC- and ZNS-defined zone descriptor and to 
 * allow support for future additional zone information.
 */
struct blk_zone {
        __u64   start;          /* Zone start sector */
        __u64   len;            /* Zone length in number of sectors */
        __u64   wp;             /* Zone write pointer position */
        __u8    type;           /* Zone type */
        __u8    cond;           /* Zone condition */
        __u8    non_seq;        /* Non-sequential write resources active */
        __u8    reset;          /* Reset write pointer recommended */
        __u8    reserved[36];
};
```

As indicated in the comments to this data structure definition, the unit that
is used to indicate (1) the zone start position, (2) the zone's size and (3) the
write pointer position is 512B sector size. This holds true regardless of the
actual logical block size of the device. Even for a device with a 4KB logical
sector, the above zone descriptor fields use a 512-byte sector size unit.

The *capacity* field was added to *struct blk_zone* in kernel version 5.9. With
this change, the data structure is as follows.

```
/**
 * struct blk_zone - Zone descriptor for BLKREPORTZONE ioctl.
 *
 * @start: Zone start in 512 B sector units
 * @len: Zone length in 512 B sector units
 * @wp: Zone write pointer location in 512 B sector units
 * @type: see enum blk_zone_type for possible values
 * @cond: see enum blk_zone_cond for possible values
 * @non_seq: Flag indicating that the zone is using non-sequential resources
 *           (for host-aware zoned block devices only).
 * @reset: Flag indicating that a zone reset is recommended.
 * @resv: Padding for 8B alignment.
 * @capacity: Zone usable capacity in 512 B sector units
 * @reserved: Padding to 64 B to match the ZBC, ZAC and ZNS defined zone
 *            descriptor size.
 *
 * start, len, capacity and wp use the regular 512 B sector unit, regardless
 * of the device logical block size. The overall structure size is 64 B to
 * match the ZBC, ZAC and ZNS defined zone descriptor and allow support for
 * future additional zone information.
 */
struct blk_zone {
        __u64   start;          /* Zone start sector */
        __u64   len;            /* Zone length in number of sectors */
        __u64   wp;             /* Zone write pointer position */
        __u8    type;           /* Zone type */
        __u8    cond;           /* Zone condition */
        __u8    non_seq;        /* Non-sequential write resources active */
        __u8    reset;          /* Reset write pointer recommended */
        __u8    resv[4];
        __u64   capacity;       /* Zone capacity in number of sectors */
        __u8    reserved[24];
};
```

The *capacity* field indicates the usable zone capacity of a zone in units of
512B sectors. The presence, or validity, of this field within the structure is
indicated using a zone report flag.
See [*Obtaining Zone Information*](#obtaining-zone-information) below for
details.

### Zone Type

The `type` field of a zone descriptor can have only one of the values defined by
the enumeration `enum blk_zone_type`.

```c
/**
 * enum blk_zone_type - Types of zones allowed in a zoned device.
 *
 * @BLK_ZONE_TYPE_CONVENTIONAL: The zone has no write pointer and can be writen
 *                              randomly. Zone reset has no effect on the zone.
 * @BLK_ZONE_TYPE_SEQWRITE_REQ: The zone must be written sequentially
 * @BLK_ZONE_TYPE_SEQWRITE_PREF: The zone can be written non-sequentially
 *
 * Any other value not defined is reserved and must be considered as invalid.
 */
enum blk_zone_type {
        BLK_ZONE_TYPE_CONVENTIONAL      = 0x1,
        BLK_ZONE_TYPE_SEQWRITE_REQ      = 0x2,
        BLK_ZONE_TYPE_SEQWRITE_PREF     = 0x3,
};
```

### Zone Condition

The `cond` field of the `struct blkzone` data structure defines the current
condition of a zone. The possible condition (state) values of this field are
defined by the `blk_zone_cond` enumeration.

```c
/**
 * enum blk_zone_cond - Condition [state] of a zone in a zoned device.
 *
 * @BLK_ZONE_COND_NOT_WP: The zone has no write pointer, it is conventional.
 * @BLK_ZONE_COND_EMPTY: The zone is empty.
 * @BLK_ZONE_COND_IMP_OPEN: The zone is open, but not explicitly opened.
 * @BLK_ZONE_COND_EXP_OPEN: The zones was explicitly opened by an
 *                          OPEN ZONE command.
 * @BLK_ZONE_COND_CLOSED: The zone was [explicitly] closed after writing.
 * @BLK_ZONE_COND_FULL: The zone is marked as full, possibly by a zone
 *                      FINISH ZONE command.
 * @BLK_ZONE_COND_READONLY: The zone is read-only.
 * @BLK_ZONE_COND_OFFLINE: The zone is offline (sectors cannot be read/written).
 *
 * The Zone Condition state machine in the ZBC/ZAC standards maps the above
 * deinitions as:
 *   - ZC1: Empty         | BLK_ZONE_EMPTY
 *   - ZC2: Implicit Open | BLK_ZONE_COND_IMP_OPEN
 *   - ZC3: Explicit Open | BLK_ZONE_COND_EXP_OPEN
 *   - ZC4: Closed        | BLK_ZONE_CLOSED
 *   - ZC5: Full          | BLK_ZONE_FULL
 *   - ZC6: Read Only     | BLK_ZONE_READONLY
 *   - ZC7: Offline       | BLK_ZONE_OFFLINE
 *
 * Conditions 0x5 to 0xC are reserved by the current ZBC/ZAC spec and should
 * be considered invalid.
 */
enum blk_zone_cond {
        BLK_ZONE_COND_NOT_WP    = 0x0,
        BLK_ZONE_COND_EMPTY     = 0x1,
        BLK_ZONE_COND_IMP_OPEN  = 0x2,
        BLK_ZONE_COND_EXP_OPEN  = 0x3,
        BLK_ZONE_COND_CLOSED    = 0x4,
        BLK_ZONE_COND_READONLY  = 0xD,
        BLK_ZONE_COND_FULL      = 0xE,
        BLK_ZONE_COND_OFFLINE   = 0xF,
};
```

Under a device's normal operation, some of these conditions cannot result
directly from host-initiated operations. These conditions are
`BLK_ZONE_COND_OFFLINE` and `BLK_ZONE_COND_READONLY`. They can be set only by
the device itself, to indicate zones with capabilities that have been limited by
a hardware defect.

The condition `BLK_ZONE_COND_EXP_OPEN` (or *explicit open*), is the result of
the successful execution of an `OPEN ZONE` command
(see [Zone Block Commands](../introduction/smr.md#zone-block-commands).

Because the `OPEN ZONE` command is not supported by the kernel ZBD interface, a
zone can be transitioned to the *explicit open* zone condition only by using
direct device access--that is, by issuing the SCSI `OPEN ZONE` command through
the *SG_IO* interface (using *libzbc*, the *libzbc zbc_open_zone* utility or the
*sg_zone* utility).

## *ioctl()* Commands

Several *ioctl()* commands are defined to manipulate and obtain information and
manipulate the zones of a zoned block device. All supported commands are shown
below.

```c
/**
 * Zoned block device ioctl's:
 *
 * @BLKREPORTZONE: Get zone information. Takes a zone report as argument.
 *                 The zone report will start from the zone containing the
 *                 sector specified in the report request structure.
 * @BLKRESETZONE: Reset the write pointer of the zones in the specified
 *                sector range. The sector range must be zone aligned.
 * @BLKGETZONESZ: Get the device zone size in number of 512 B sectors.
 * @BLKGETNRZONES: Get the total number of zones of the device.
 * @BLKOPENZONE: Open the zones in the specified sector range.
 *               The 512 B sector range must be zone aligned.
 * @BLKCLOSEZONE: Close the zones in the specified sector range.
 *                The 512 B sector range must be zone aligned.
 * @BLKFINISHZONE: Mark the zones as full in the specified sector range.
 *                 The 512 B sector range must be zone aligned.
 */
#define BLKREPORTZONE   _IOWR(0x12, 130, struct blk_zone_report)
#define BLKRESETZONE    _IOW(0x12, 131, struct blk_zone_range)
#define BLKGETZONESZ    _IOR(0x12, 132, __u32)
#define BLKGETNRZONES   _IOR(0x12, 133, __u32)
#define BLKOPENZONE     _IOW(0x12, 134, struct blk_zone_range)
#define BLKCLOSEZONE    _IOW(0x12, 135, struct blk_zone_range)
#define BLKFINISHZONE   _IOW(0x12, 136, struct blk_zone_range)
```

Not all commands are available on all kernel versions. The following table shows
the kernel version that introduced each command.

<center>

| Command | Kernel version | Description |
| ----- | -------------- | ----------- |
| BLKREPORTZONE | 4.10.0 | Get zone information |
| BLKRESETZONE | 4.10.0 | Reset a zone write pointer |
| BLKGETZONESZ | 4.20.0 | Get a device zone size |
| BLKGETNRZONES | 4.20.0 | Get the total number of zones of a device |
| BLKOPENZONE | 5.5.0 | Explicitly open a zone |
| BLKCLOSEZONE | 5.5.0 | Close a zone |
| BLKFINISHZONE | 5.5.0 | Finish a zone |

</center>

### Obtaining Zone Information

The *BLKREPORTZONE* command allows an application to obtain a device's zone
information in the form of an array of zone descriptors. The data argument
that is passed to the `ioctl()` must be the address of a memory area large
enough to store one `struct blk_zone_report` header structure, followed by an
array of zone descriptors.

The zone report header structure `blk_zone_report` is as shown below.

```c
/**
 * struct blk_zone_report - BLKREPORTZONE ioctl request/reply
 *
 * @sector: starting sector of report
 * @nr_zones: IN maximum / OUT actual
 * @reserved: padding to 16 byte alignment
 * @zones: Space to hold @nr_zones @zones entries on reply.
 *
 * The array of at most @nr_zones must follow this structure in memory.
 */
struct blk_zone_report {
	__u64		sector;
	__u32		nr_zones;
	__u8		reserved[4];
	struct blk_zone zones[0];
};
```

The header indicates the 512-byte sector from which the report should start as
well as  the number of zone descriptors in the array following the header. A
typical use of the `BLKREPORTZONE` command to obtain information on all the
zones of a device is as shown below.

```c
#include <stdlib.h>
#include <linux/blkzoned.h>

unsigned long long start_sector = 0;
struct blk_zone_report *hdr;
size_t hdr_len;
int nr_zones = 256;

hdr_len = sizeof(struct blk_zone_report) + nr_zones * sizeof(struct blkzone);
hdr = malloc(hdr_len);
if (!hdr)
	return -1;

while (1) {
	hdr->sector = start_sector;
	hdr->nr_zones = nr_zones;

	ret = ioctl(fd, BLKREPORTZONE, hdr);
	if (ret)
		goto error;

	if (!hdr->nr_zones) {
		/* Done */
		break;
	}

	printf("Got %u zone descriptors\n", hdr->nr_zones);
	...

	/* The next report must start after the last zone reported */
	start_sector = hdr->zones[hdr->nr_zones - 1].start +
		       hdr->zones[hdr->nr_zones - 1].len;
}
```

The number of zone descriptors obtained is returned to the user in the
`nr_zones` field of the report header structure `blk_zone_report`.

With the introduction of zone capacity support for NVMe Zoned Namepsaces in
kernel version 5.9, zone descriptors gained the `capacity` field. The presence
of this field is indicated by the new `flag` field added to
`struct blk_zone_report`.

```c
/**
 * enum blk_zone_report_flags - Feature flags of reported zone descriptors.
 *
 * @BLK_ZONE_REP_CAPACITY: Zone descriptor has capacity field.
 */
enum blk_zone_report_flags {
        BLK_ZONE_REP_CAPACITY   = (1 << 0),
};

/**
 * struct blk_zone_report - BLKREPORTZONE ioctl request/reply
 *
 * @sector: starting sector of report
 * @nr_zones: IN maximum / OUT actual
 * @flags: one or more flags as defined by enum blk_zone_report_flags.
 * @zones: Space to hold @nr_zones @zones entries on reply.
 *
 * The array of at most @nr_zones must follow this structure in memory.
 */
struct blk_zone_report {
	__u64		sector;
	__u32		nr_zones;
	__u32		flags;
	struct blk_zone zones[0];
};
```

If the `flags` field of `struct blk_zone_report` has the flag
`BLK_ZONE_REP_CAPACITY` set, then the zone descriptor's structure will have a
valid value set in the `capacity` field of `sturct blk_zone`. Otherwise, this
field can be ignored as it will show a value of 0.

The example code below, extracted from the code of the
[*libzbd*](../projects/libzbd.md) library, illustrates how applications can
implement backward-compatible support for zone capacity information by using the
autotools build environment.

```
# less configure.ac
...
AC_CHECK_HEADER(linux/blkzoned.h, [],
                [AC_MSG_ERROR([Couldn't find linux/blkzoned.h. Kernel too old ?])],
                [[#include <linux/blkzoned.h>]])

AC_CHECK_MEMBER([struct blk_zone.capacity],
                [AC_DEFINE(HAVE_BLK_ZONE_REP_V2, [1], [report zones includes zone capacity])],
                [], [[#include <linux/blkzoned.h>]])
...

# less lib/zbd.h
...
/*
 * Handle kernel zone capacity support
 */
#ifndef HAVE_BLK_ZONE_REP_V2
#define BLK_ZONE_REP_CAPACITY   (1 << 0)

struct blk_zone_v2 {
        __u64   start;          /* Zone start sector */
        __u64   len;            /* Zone length in number of sectors */
        __u64   wp;             /* Zone write pointer position */
        __u8    type;           /* Zone type */
        __u8    cond;           /* Zone condition */
        __u8    non_seq;        /* Non-sequential write resources active */
        __u8    reset;          /* Reset write pointer recommended */
        __u8    resv[4];
        __u64   capacity;       /* Zone capacity in number of sectors */
        __u8    reserved[24];
};
#define blk_zone blk_zone_v2

struct blk_zone_report_v2 {
        __u64   sector;
        __u32   nr_zones;
        __u32   flags;
struct blk_zone zones[0];
};
#define blk_zone_report blk_zone_report_v2
#endif /* HAVE_BLK_ZONE_REP_V2 */
...
```

With this method, the main code responsible for issuing and parsing zone reports
always has access to the `capacity` field of `struct blk_zone` regardless of
the kernel version the code is executed on. For kernels before kernel version
5.9, the zone capacity field will always be equal to 0, meaning that the zone
capacity should be ignored and that the zone size should be used in its place.
Different coding techniques can also be used to always return a zone capacity
equal to the zone size for kernels lacking support for this field.

The command line utility [`blkzone`](../projects/util-linux.md#blkzone), which
is part of the *util-linux* project, uses the *BLKREPORTZONE* command to
implement its *report* function. Its code was modified similarly to the above
method to allow its correct compilation and execution regardless of the version
of the kernel being used.

### Resetting a Zone Write Pointer

The write pointer of a single sequential zone or of a range of contiguous
sequential zones can be reset using the `BLKRESETZONE` command. Resetting a
sequential zone write pointer position will also transition the zone to the
*Empty* condition (`BLK_ZONE_COND_EMPTY`).

The range of zones to reset is defined using the data structure `blk_zone_range`
shown below.

```c
/**
 * struct blk_zone_range - BLKRESETZONE/BLKOPENZONE/
 *                         BLKCLOSEZONE/BLKFINISHZONE ioctl
 *                         requests
 * @sector: Starting sector of the first zone to operate on.
 * @nr_sectors: Total number of sectors of all zones to operate on.
 */
struct blk_zone_range {
        __u64           sector;
        __u64           nr_sectors;
};
```

The `sector` field must specify the start sector of the first zone to reset. The
`nr_sectors` field specifies the total length of the range of zones to reset.
This length must be at least as large as one zone.

As indicated in comments describing the `blk_zone_range` structure, the commands
`BLKOPENZONE`, `BLKCLOSEZONE` and `BLKFINISHZONE` also use this data structure
to define the range of zones on which the command will operate.

The following code shows an example use of the `BLKRESETZONE` command to reset a
single zone starting at sector 274726912 with a zone size of 256 MiB (524288
sectors of 512B).

```c
#include <linux/blkzoned.h>

struct blk_zone_range zrange;
int ret;

zrange.sector = 274726912;
zrange.nr_sectors = 524288;

ret = ioctl(fd, BLKRESETZONE, &zrange);
if (ret)
	goto error;
...
```

The device file descriptor `fd` must be open for writing in order for this
command to succeed.

The  command line utility [`blkzone`](../projects/util-linux.md#blkzone) uses
the *BLKRESETZONE* command to implement its *reset* functionality.

### Opening, Closing and Finishing Zones

Explicitly opening a zone or a range of zones can be done using the
*BLKOPENZONE* command. This command uses the same arguments as the
*BLKRESETZONE* command. It takes a pointer to a data structure `blk_zone_range`,
which specifies the range of zones to operate on.

Closing a zone is done using the command *BLKCLOSEZONE*. Finishing a zone--that
is, transitioning the zone to the *full* condition (`BLK_ZONE_COND_FULL`), is
done using the *BLKFINISHZONE* command. Both of these commands also take as 
arguments a pointer to the `blk_zone_range` data structure to specify the range
of zones to operate on.

The *BLKOPENZONE*, *BLKCLOSEZONE* and *BLKFINISHZONE* commands were introduced
in kernel version 5.5.0.

### Zone Size and Number of Zones

Linux&reg; kernel version 4.20 introduced two new commands: one to obtain
a zoned device's zone size (`BLKGETZONESZ`), and one to obtain the total number
of zones of the device (`BLKGETNRZONES`). Both commands take a pointer to an
unsigned 32-bit integer variable as an argument, and the zone-size value or the
number of zones will be returned. The following sample C code illustrates the
use of these commands.

```c
#include <linux/blkzoned.h>
#include <stdio.h>

unsigned int nr_zones, zone_size;
int ret;

ret = ioctl(fd, ,BLKGETZONESZ, &zone_size);
if (ret)
	goto error;
ret = ioctl(fd, ,BLKGETNRZONES, &nr_zones);
if (ret)
	goto error;

printf("Device has %u zones of %u 512-Bytes sectors\n",
       nr_zones, zone_size);
...
```

The command `BLKGETNRZONES` is especially useful for allocating an array of zone
descriptors large enough for a zone report on all the zones of a device.

