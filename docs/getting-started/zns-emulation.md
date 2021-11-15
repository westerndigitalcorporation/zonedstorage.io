# Getting Started with Emulated NVMe ZNS Devices

Emulated NVMe ZNS devices make it possible to do application development and kernel tests even if you do not have access to physical NVMe ZNS devices. There are two ways to emulate NVMe ZNS devices.

* ***null_blk***: The null_blk kernel driver is equipped to emulate zoned block
  devices with a zone configuration that is compatible with real NVMe ZNS
  devices. This method is discussed in more detail in the [Zoned Block Device
  Emulation with null_blk](nullblk.md) chapter of the Getting Started Guide.

* ***QEMU***: This open source machine emulator and virtualizer is equipped to
  create emulated NVMe devices that use regular files on the host as a
  backstores. Recent versions of QEMU support the emulation of Zoned
  Namespaces.

## *QEMU*

<a href="https://www.qemu.org/" target="_blank">*QEMU*</a> has supported the
emulation of NVMe namespaces since version 1.6. But the emulation of zoned
namespaces has been supported only since version 6.0 of *QEMU*. If the host
Linux distribution does not provide *QEMU* version 6.0 or above, *QEMU* has
to be compiled from source. Detailed information on how to compile and install
*QEMU* from source can be found <a href="https://www.qemu.org/download/#source"
target="_blank">on the QEMU download page</a>.

### Creating an Emulated Zoned Namespace

To create an emulated zoned namespace, you must first have a backing-store file
that the namespace can use. The size of the file determines the capacity of the
namespace that will be seen from the guest OS running in the *QEMU* virtual
machine.

For example: to create a 32GiB zoned namespace, you must first create a 32 GiB
file on the host. This can be done by using the *truncate* command to
create a sparse file or by using the *dd* command to create a fully allocated file.

#### Creating the Backstore

This guide provides instructions for two methods of creating the backstore file:

1. Using truncate
2. Using dd

##### Using truncate to create an Emulated Zone Namespace Backstore

Run the following command to use ``truncate`` to create a backstore file:

```plaintext
# truncate -s 32G /var/lib/qemu/images/zns.raw

# ls -l /var/lib/qemu/images/zns.raw
-rw-r--r-- 1 root root 34359738368 Jun 21 15:13 /var/lib/qemu/images/zns.raw
```

##### Using dd to create an Emulated Zone Namespace Backstore

Run the following command to use ``dd`` to create a backstore file:

```plaintext
# dd if=/dev/zero of=/var/lib/qemu/images/zns.raw bs=1M count=32768
32768+0 records in
32768+0 records out
34359738368 bytes (34 GB, 32 GiB) copied, 11.4072 s, 3.0 GB/s

# ls -l /var/lib/qemu/images/zns.raw
-rw-r--r-- 1 root root 34359738368 Jun 22 11:22 /var/lib/qemu/images/zns.raw
```

#### Creating a ZNS and using the Backstore File

Execute *QEMU* with command line options and arguments to create a zoned
namespace that uses the backstore file as storage. In the following example,
the backstore file is used to emulate a zoned namespace that has zones of 64
MiB and a zone capacity of 62 MiB. The namespace block size is 4096 B.  The
namespace is set to allow at most 16 open zones and 32 active zones.

```plaintext
# /usr/local/bin/qemu-system-x86_64 \
...
-device nvme,id=nvme0,serial=deadbeef,zoned.zasl=5 \
-drive file=${znsimg},id=nvmezns0,format=raw,if=none \
-device nvme-ns,drive=nvmezns0,bus=nvme0,nsid=1,logical_block_size=4096,\
physical_block_size=4096,zoned=true,zoned.zone_size=64M,zoned.\
zone_capacity=62M,zoned.max_open=16,zoned.max_active=32,\
uuid=5e40ec5f-eeb6-4317-bc5e-c919796a5f79
...
```

### Verifying an Emulated Zoned Namespace

If your guest operating system is a Linux distribution and the Linux
distribution's kernel version is higher than 5.9.0, the emulated NVMe ZNS
device can be checked using the *nvme* command (see [Linux Tools for
ZNS](../tools/zns.md).

```
# nvme list
Node             SN                   Model                                    Namespace Usage                      Format           FW Rev
---------------- -------------------- ---------------------------------------- --------- -------------------------- ---------------- --------
/dev/nvme0n1     deadbeef             QEMU NVMe Ctrl                           1          34.36  GB /  34.36  GB      4 KiB +  0 B   1.0
```

The *lsscsi* utility shows the emulated NVMe device:

```
# lsscsi -g
[2:0:0:0]    cd/dvd  QEMU     QEMU DVD-ROM     2.5+  /dev/sr0   /dev/sg0
[N:0:0:1]    disk    QEMU NVMe Ctrl__1                          /dev/nvme0n1  -
```

Using the *blkzone* utility, the namespace zone configuration can be inspected.

```
# blkzone report /dev/nvme0n1 | less
  start: 0x000000000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000020000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000040000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000060000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x000080000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
...
  start: 0x003f80000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x003fa0000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x003fc0000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0x003fe0000, len 0x020000, cap 0x01f000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```

!!! NOTE

    The total number of zones of the namespace directly depends on
    the size of the backstore file used and on the zone size configured. In the
    above example, the emulated namespace has 512 zones (32 GiB / 64 MiB).

```
# cat /sys/block/nvme0n1/queue/nr_zones 
512
```

If the emulated namespace is configured with a zone capacity smaller than the
zone size, the total capacity defined by the backstore file will not be
usable. The effective usable capacity can be reported using *blkzone* with the
*capacity* command, as shown here:

```
# blkzone capacity /dev/nvme0n1
0x003e00000
```

In this case, the namespace's effective storage capacity is 0x003e00000
(65011712) 512-Byte sectors, which is equivalent to 512 zones of 62 MiB
capacity.

### Using an Emulated Zoned Namespace

The behavior of a *QEMU*-emulated NVMe ZNS device is fully compliant with the
NVMe ZNS specifications, with one exception: the state of namespace zones is
not persistent across restarts of the *QEMU* emulation. The state of zones is
preserved only as long as *QEMU* is running, even if the guest operating system
is rebooted. If *QEMU* is restarted and the same backstore file is used, then
the guest operating system will see the namespace with all zones in the empty
state.

### Emulated Zoned Namespace Options

The implementation of NVMe device emulation and ZNS namespace emulation in
*QEMU* provides several configuration options to control the characteristics of
the device. The full list of options and parameters is documented <a
href="https://qemu-project.gitlab.io/qemu/system/nvme.html"
target="_blank">here</a>.

[comment]: <> (TODO: The link above this comment is broken. It goes nowhere.)

The options and parameters related to Zoned Namespaces are as follows.

| Option | Default Value | Description |
| ------ | ------------- | ----------- |
| zoned.zasl=UINT32 | 0 | Zone Append Size Limit. If left at the default (0), the zone append size limit will be equal to the maximum data transfer size (MDTS). Otherwise, the zone append size limit is equal to 2 to the power of zasl multiplied by the minimum memory page size (4096 B), but cannot exceed the maximum data transfer size. |
| zoned.zone_size=*SIZE* | 128MiB | Define the zone size (ZSZE) |
| zoned.zone_capacity=*SIZE* | 0 | Define the zone capacity (ZCAP). If left at the default (0), the zone capacity will equal the zone size. |
| zoned.descr_ext_size=*UINT32* | 0 | Set the Zone Descriptor Extension Size (ZDES). Must be a multiple of 64 bytes. |
| zoned.cross_read=*BOOL* | off | Set to "on" to allow reads to cross zone boundaries. |
| zoned.max_active=*UINT32* | 0 | Set the maximum number of active resources (MAR). The default (0) allows all zones to be active. |
| zoned.max_open=*UINT32* | 0 | Set the maximum number of open resources (MOR).  The default (0) allows all zones to be open. If ``zoned.max_active`` is specified, this value must be less than or equal to that. |

## *QEMU* Execution Example

The following script uses *QEMU* to run a virtual machine with 8 CPU cores,
16 GiB of memory, and bridged networking. The bridge device *virbr0* is assumed
to already exist. The last device added to the virtual machine on the *QEMU*
command line is a 32 GiB NVMe ZNS device.

```bash
#!/bin/sh

#
# Some variables
#
bridge="virbr0"
vmimg="/var/lib/qemu/boot-disk.qcow2"
znsimg="/var/lib/qemu/zns.raw"

#
# Run QEMU
#
sudo /usr/local/bin/qemu-system-x86_64 \
-name guest=FedoraServer34 \
-machine pc-q35-5.2,accel=kvm \
-m 16384 \
-smp 8,sockets=8,cores=1,threads=1 \
-rtc base=utc,driftfix=slew \
-nographic \
-no-hpet \
-global ICH9-LPC.disable_s3=1 \
-global ICH9-LPC.disable_s4=1 \
-boot strict=on \
-audiodev none,id=noaudio \
-object rng-random,id=objrng0,filename=/dev/urandom \
-msg timestamp=on \
-device pcie-root-port,port=0x10,chassis=1,id=pci.1,bus=pcie.0,multifunction=on,addr=0x2 \
-netdev bridge,id=hostnet0,br=${bridge} \
-device virtio-net-pci,netdev=hostnet0,id=net0,mac=52:54:00:fa:2d:b9,bus=pci.1,addr=0x0 \
-device pcie-root-port,port=0x11,chassis=2,id=pci.2,bus=pcie.0,addr=0x2.0x1 \
-blockdev node-name="vmstorage",driver=qcow2,file.driver=file,file.filename="${vmimg}",file.node-name="vmstorage.qcow2",file.discard=unmap \
-device virtio-blk-pci,bus=pci.2,addr=0x0,drive="vmstorage",id=virtio-disk0,bootindex=1 \
-device pcie-root-port,port=0x12,chassis=3,id=pci.3,bus=pcie.0,addr=0x2.0x2 \
-device virtio-balloon-pci,id=balloon0,bus=pci.3,addr=0x0 \
-device pcie-root-port,port=0x13,chassis=4,id=pci.4,bus=pcie.0,addr=0x2.0x3 \
-device virtio-rng-pci,rng=objrng0,id=rng0,bus=pci.4,addr=0x0 \
-device pcie-root-port,port=0x14,chassis=5,id=pci.5,bus=pcie.0,addr=0x2.0x4 \
-device nvme,id=nvme0,serial=deadbeef,zoned.zasl=5,bus=pci.5 \
-drive file=${znsimg},id=nvmezns0,format=raw,if=none \
-device nvme-ns,drive=nvmezns0,bus=nvme0,nsid=1,logical_block_size=4096,physical_block_size=4096,zoned=true,zoned.zone_size=64M,zoned.zone_capacity=62M,zoned.max_open=16,zoned.max_active=32,uuid=5e40ec5f-eeb6-4317-bc5e-c919796a5f79
```
