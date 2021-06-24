# Linux Zoned Storage Support Overview

Zoned block device support was initially released with the Linux&reg; kernel
version 4.10. Following versions improved this support and added new features
beyond the raw block device access interface. More advanced features such as
device mapper support and ZBD aware file systems are now available.

## Overview

Applications developers can use zoned block devices through various I/O paths
controlled with different programming interfaces and exposing the device in
different ways. A simplistic representation of the different possible access
paths is shown in the figure below.

<center>
<a><img alt="linux-overview" src="../../assets/img/linux-iopath.png"
title="Linux Zoned block device support overview" width="800"
style="max-width:100%;"></a>
<br><em>Linux Zoned Block Device Support Overview</em></br>
</center>

Three different I/O path implement two POSIX compatible interfaces that
completely hide the write constraints of zoned block devices sequential zones.
These three I/O path are suitable to execute legacy applications, that is,
applications that have not been modified to implement fully sequential write
streams.

* **File Access Interface** This is the interface implemented by a file system
  allowing an application to organize its data in files and directories. Two
  different implementations are available.

    - *ZBD Compliant File System* With this implementation, the file system is
      modified to directly handle the sequential write constraint of zoned block
      devices. Random writes to files by applications are transformed into
      sequential write streams by the file system, consealing the device
      constraints from the application. An example of this is the
      [*F2FS*](../linux/fs.md#f2fs) file system.

    - *Legacy File System* In this case, an unmodified file system is used and
      the device sequential write constraint is handled by a device mapper
      target driver exposing the zoned block device as a regular block device.
      This device mapper is *dm-zoned*. Its characteristics and use are
      discussed in detail in [this article](../linux/dm.md#dm-zoned).

* **Raw Block Access Interface** This is the raw block device file access
  interface that can be used by applications to directly access data stored on
  the device. Similarly to the legacy file system case, this interface is
  also implemented using the [*dm-zoned*](dm.md#dm-zoned)
  device mapper target driver to hide the sequential write constraints from the
  application.

Three additional interfaces are available to applications that have been
written or modified to comply with the sequential write constraint of zoned
block devices. These interfaces directly expose the device constraints to
applications which must ensure that data is written using sequential streams
starting from zones write pointer positions.

* **File Access Interface** This special interface is implemented by the
  [*zonefs*](fs.md#zonefs) file system. *zonefs* is a very simple file system
  that exposes each zone of a zoned block device as a file. However, unlike
  regular POSIX file systems, the sequential write constraint of the device is
  not automatically handled by zonefs. It is the responsibility of the
  application to sequentially write files representing zones.

* **Zoned Raw Block Access Interface** This is the counterpart of the
  *Raw Block Access Interface* without any intermediate driver to handle the
  device constraints. An application can use this interface by directly opening
  the device file representing the zoned block device to gain access to
  zone information and management operations provided by the block layer.
  As an example, [*Linux System Utilities*](../projects/util-linux.md) use this
  interface. Physical zoned block devices as well as logically created zoned
  block devices (e.g. zoned block devices created with the
  [*dm-linear*](../linux/dm.md#dm-linear) device mapper target) support this
  interface. The [*libzbd*](../projects/libzbd.md) user library and tools can
  simplify the implementation of applications using this interface.

* **Passthrough Device Access Interface** This is the interface provided by
  the SCSI generic driver (SG) and NVMe driver which allows an application to
  send SCSI or NVMe commands directly to a device. The kernel interfere
  minimally with the commands sent by applications, resulting in the need for
  application to handle all device constraints itself (e.g. Logical and
  physical sector size, zone boundaries, command timeout, command retry count,
  etc). User level libraries such as [*libzbc*](../projects/libzbc.md) and
  [*libnvme*](../projects/libnvme.md) can greatly simplify the implementation
  of applications using this interface.

## Kernel Versions

The initial release of the zoned block device support with kernel 4.10 was
limited to the block layer ZBD user interface, SCSI layer sequential write
ordering control and native support for the *F2FS* file system. Following
kernel versions added more feature such as device mapper drivers and support
for the block multi-queue infrastructure.

The figure below summarizes the evolution of zoned block device support with
kernel versions.

<center>
<a><img alt="linux-versions" src="../../assets/img/linux-versions.png"
title="Kernel kernel versions and ZBD features" width="680"
style="max-width:100%;"></a>
<br><em>Kernel kernel versions and ZBD features</em></br>
</center>

* **Passthrough Access Support (*SG Access*)** Support for exposing host managed
  ZBC/ZAC hard-disks as SCSI generic (SG) nodes was officially added to kernel
  3.18 with the definition of the device type `TYPE_SCSI` for SCSI devices and
  with the definition of the device class `ATA_DEV_ZAC` for ATA devices. For
  kernels older than version 3.18, SATA host managed ZAC disks will not be
  exposed to the users as SG nodes nor as block device files. These older
  kernels will simply ignore SATA devices reporting a host managed ZAC device
  signature and the devices will not be usable in any way. For SCSI disks or
  SATA disks connected to a compatible SAS HBA, host managed disk will be
  accessible by the user through the node file created by the SG driver to
  represent these disks.

* **Zoned Block Device Access and *F2FS* Support** The block I/O layer zoned
  block device support added to kernel version 4.10 enables exposing
  host managed ZBC and ZAC disks as block device files, similarly to regular
  disks. This support also includes changes to the kernel *libata* command
  translation to enable SCSI ZBC zone block commands translation to ZAC zone ATA
  commands. For applications relying on SCSI generic direct access, this enables
  handling both ZBC (SCSI) and ZAC (ATA) disks with the same code (e.g. ATA
  commands do not need to be issued). Access to zoned block devices is also
  possible using the disk block device file (e.g. */dev/sdX* device file) with
  regular POSIX system calls. However, compared to regular disks, some
  restrictions still apply
  (see [Kernel ZBD Support Restrictions](#zbd-support-restrictions)).

* **Device Mapper and *dm-zoned* Support** With kernel version 4.13.0, support
  for zoned block devices was added to the device mapper infrastructure. This
  support allows using the *dm-linear* and *dm-flakey* device mapper targets on
  top of zoned block devices. Additionally, the *dm-zoned* device mapper
  target driver was also added.

* **Block multi-queue and SCSI multi-queue Support** With kernel
  version 4.16.0, support for the block multi-queue infrastructure was added.
  This improvement enables using host managed ZBC and ZAC disks with the SCSI
  multiqueue (*scsi-mq*) support enabled while retaining support for the legacy
  single queue block I/O path. The block multi queue and *scsi-mq* I/O path are
  the default since kernel version 5.0 with the removal of the legacy single
  queue block I/O path support.

* **zonefs** Kernel 5.6.0 first introduced the *zonefs* file system which
  exposes zones of a zoned block device as regular files. *zonefs* being
  implemented using the kernel internal zoned block device interface, all types
  of zoned block devices are supported (SCSI ZBC, ATA ZAC and NVMe ZNS).

* **Zone Append Operation Support** Kernel version 5.8.0 introduced a generic
  block layer interface for supporting
  [zone append write operations](../introduction/zns.md#zone-append). This
  release also modifies the SCSI layer to emulate these operations using regular
  write commands. With the introduction of NVMe ZNS support (see below), this
  emulation unifies the interface and capabilities of all zoned block devices,
  simplifying the implementation of other features such as file systems.

* **NVM Express Zoned Namespaces** With kernel version 5.9, support for the
  NVMe ZNS command set was added. This enables the nvme driver with the command
  set enhancements required to discover zoned namespaces, and registers these
  with the block layer as host managed zone block devices. This kernel release
  only support devices that do *not* implement any of the zone optional
  characteristics (ZOC), and also requires that the device implements the
  optional Zone Append command.

Improvements to the kernel zoned block device support are still ongoing. Support
for new file systems (e.g. *btrfs*) will be released in the coming months.

## Recommended Kernel Versions

All kernel versions since 4.10 include zoned block device support. However, as
shown in the figure [Kernel versions and features](#kernel-versions), some
versions are recommended over others.

* **Long Term Stable (LTS) Versions** Kernel versions 4.14, 4.19 and 5.4 are
  long term kernel stable versions which will see bug fix back-ports from
  fixes in the mainline (development) kernel. These versions thus benefit from
  stability improvements developed for higher versions. Fixes to the zoned
  block device support infrastructure are also back-ported to these versions.

* **Latest Stable Version** While not necessarily marked as a long term stable
  version, the latest stable kernel version receives all bug fixes being
  developed with the mainline development kernel version following it. Except
  if the version is tagged as a long term support version, back-port of fixes
  to a stable kernel version stops with the switch of the following version from
  mainline to stable. Using a particular kernel stable version for a long time
  is thus not recommended.

For any stable or long term stable kernel version, it is recommended that system
administrators use the latest available release within that version to ensure
that all known problem fixes are applied.

## ZBD Support Restrictions

In order to minimize the amount of changes to the block layer code, various
existing features were reused. Furthermore, other kernel components that are
not compatible with zoned block devices behavior and are too complex to change
were left unmodified. This approach led to a set of constraints that all zoned
block devices must meet to be usable with Linux.

* **Zone size** While the ZBC, ZAC, and ZNS standards do not impose any
  constraint on the zone layout of a device, that is, zones can be of any size,
  the kernel ZBD support is restricted to zoned devices with all zones of equal
  size. The zone size must also be equal to a power of 2 number of logical
  blocks. Only the last zone of a device may optionally have a smaller size (a
  so called *runt* zone). This zone size restriction allows the kernel code to
  use the block layer "chunked" space management normally used for software RAID
  devices. The chunked space management uses power of two arithmetic (bit shift
  operations) to determine which chunk (i.e. which zone) is being accessed and
  ensures that block I/O operations do not cross zone boundaries.

* **Unrestricted Reads** The ZBC and ZAC standards define the *URSWRZ* bit
  indicating if a device will return an error when a read operation is directed
  at unwritten sectors of a sequential write required zone, that is, for a read
  command accessing sectors that are after the write pointer position of a zone.
  Linux only supports ZBC and ZAC host managed hard disks allowing unrestricted
  read commands, or in other words, SMR hard disks reporting the *URSWRZ* bit as
  not set. This restriction has been added to ensure that the block layer disk
  partition scanning process does not result in read commands failing whenever
  the disk partition table is checked.

* **Direct IO Writes** The kernel page cache does not guarantee that cached
  dirty pages will be flushed to a block device in sequential sector order. This
  can lead to unaligned write errors if an application uses buffered writes to
  write sequential write required zones of a device. To avoid this pitfall,
  applications directly using a zoned block device without a file system should
  always write to host managed disk sequential write required zones using
  direct I/O operations, that is, issue `write()` system calls with a block
  device file open using the `O_DIRECT` flag.

* **Zone Append** The ZNS specifications define the optional Zone Append
  command. This command may be used instead of regular write commands when the
  host needs to write data, but wants the device to tell it where the data was
  placed. This allows an efficient host implementation as it does not need to
  track the write pointer or order write commands in any special way. The Linux
  IO stack has been enabled to use this with kernel version 5.8, and the NVMe
  driver requires the device to support this optional command in order for the
  namespace to be usable through the kernel.

All known ZBC and ZAC host-managed hard disks available on the market today have
characteristics compatible with these requirements and can operate with a ZBD
compatible Linux kernel.

