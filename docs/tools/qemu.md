---
id: qemu
title: QEMU and KVM
sidebar_label: QEMU and KVM
---

import Image from '/src/components/Image';

# QEMU and KVM

*<a href="https://www.qemu.org/" target="_blank">QEMU</a>* is a generic machine
emulator and virtualizer. *QEMU* provides the userspace components of the
widely used <a href="https://www.linux-kvm.org/" target="_blank">*KVM*
(Kernel-based Virtual Machine)</a>.

## QEMU and zoned block devices

Host-managed SMR disks can be attached directly to a *QEMU* guest and used for
running applications in a virtual machine environment. This is useful for
software and kernel development and tests.

There are two supported methods for attaching host-managed SMR zoned disks to a
QEMU guest: (1) [virtio-scsi](/docs/tools/qemu#qemu-virtio-scsi) and (2)
[vhost-scsi](/docs/tools/qemu#qemu-vhost-scsi).  *virtio-scsi* is the simpler
of the two methods. *vhost-scsi* is the faster of the two methods, but cannot
be used without QEMU KVM acceleration.

*QEMU* also makes it possible to emulate NVMe devices that implement zoned
namespaces.

## *QEMU virtio-scsi*

This is the simplest method for attaching a zoned block device so that it can
be accessed by a QEMU guest. Define a virtual PCI bus and SCSI host and then
use the QEMU option *virtio-scsi-pci*.

### QEMU Command Example

For example, the following command runs QEMU:

```plaintext
# qemu-kvm (your options) \
	-device pcie-root-port,bus=pcie.0,id=rp1 \
	-device virtio-scsi-pci,bus=pcie.0,id=scsi0 \
	-drive file=/dev/sdf,format=raw,if=none,id=zbc0 \
	-device scsi-block,bus=scsi0.0,drive=zbc0
```

#### Analysis of QEMU Command

The first line, `-device pcie-root-port,bus=pcie.0,id=rp1`, creates a PCIe root
complex. 

The second line, `-device virtio-scsi-pci,bus=pcie.0,id=scsi0`,
defines a virtio adapter that connects to the previously-defined PCIe bus.

The last 2 lines, `-drive file=/dev/sdf,format=raw,if=none,id=zbc0`
and `-device scsi-block,bus=scsi0.0,drive=zbc0`, define the device that is
connected to the virtio SCSI adapter. In this example, `-device scsi-block` is
used, which means that the host device that will be attached is specified with 
the device block device file (`/dev/sdf`).

See <a href="https://github.com/qemu/qemu/blob/master/docs/pcie_pci_bridge.txt"
target="_blank">here</a> for a detailed description of these options.

### Sense data in QEMU prior to Version 4.1

Although this method makes it possible to attach a zoned block disk to a QEMU
guest, SCSI command sense data is not processed correctly in older QEMU
versions (this includes all QEMU versions prior to version 4.1). This causes
the guest operating system to hang if the guest attempts to access command
sense data (for example, after command failures). Because of older QEMU
versions' inability to properly process SCSI command sense data, you should
avoid this attachment method with versions of QEMU older than version 4.1. 

The "sense data problem" can be avoided with QEMU versions prior to version
4.1 by attaching a zoned disk to a guest using the "device SG node file" as
a specifier. If you do this, you must use the option `-device scsi-generic`.
To do this, change the command on the command line in the following way:

```plaintext
# qemu-kvm (your options) \
	-device pcie-root-port,bus=pcie.0,id=rp1 \
	-device virtio-scsi-pci,bus=pcie.0,id=scsi0 \
	-drive file=/dev/sg5,format=raw,if=none,id=zbc0 \
	-device scsi-generic,bus=scsi0.0,drive=zbc0
```

On the host, the correspondance between a block device file and its SG node file
can be discovered using the `lsscsi` command.

```plaintext
# lsscsi -g
...
[10:0:1:0]   zbc     HGST     HSH721415AL42M0  a250  /dev/sdf   /dev/sg5
...
```

After the guest operating system has been started, attachment of the host
device can be checked with any of the methods shown in [the SMR disk section of
the Getting Started Guide](/docs/getting-started/smr-disk).  For example, the
output of the `lsscsi` command will be as follows with the above example setup.

```plaintext
# lsscsi -g
[0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0
[6:0:1:0]    zbc     HGST     HSH721415AL42M0  a250  /dev/sdb   /dev/sg1
```

## *QEMU vhost-scsi*

This attachment method uses a fabric module in the host kernel to provide KVM
guests with a fast virtio-based connection to SCSI LUNs. This method cannot be
used without QEMU KVM acceleration.

### Enabling the host vhost target module

The host kernel configuration must have the *CONFIG_VHOST_SCSI* option enabled.
This option is found in the top level *Virtualization* menu of the kernel
configuration.

<Image src="linux-config-vhost.png"
title="vhost-scsi support option with make menuconfig"/>

To make it possible to attach physical disks as well as
[*tcmu-runner*](/docs/tools/tcmu-runner)-emulated ZBC disks, you must enable
the kernel configuration option *CONFIG_TCM_PSCSI*. This option can be found in
the menu *Device Drivers* -> *Generic Target Core Mod (TCM) and ConfigFS
Infrastructure*.

<Image src="linux-config-pscsi.png"
title="pSCSI TCM support option with make menuconfig"/>

### Attaching a host physical disk

To attach a zoned device to a virtual machine guest, you must first prepare a
virtual TCM SAS adapter, using the *targetcli* tool. Specify the device to
attach by using a block device file. The example below illustrates this
operation for the disk `/dev/sdf`:

1. **Use the targetcli Tool to Create a Device**
   
   Use *targetcli* to create the device that you will attach.

    ```plaintext
    # targetcli
    targetcli shell version 2.1.fb49
    Copyright 2011-2013 by Datera, Inc and others.
    For help on commands, type 'help'.
    
    /> cd backstores/pscsi
    /backstores/pscsi> create name=disk1 dev=/dev/sdf
    Note: block backstore recommended for SCSI block devices
    Created pscsi storage object disk1 using /dev/sdf
    /backstores/pscsi> cd /vhost
    /vhost> create
    Created target naa.5001405a160fe2e1.
    Created TPG 1.
    /vhost/naa.5001405a160fe2e1> cd /vhost/naa.5001405a160fe2e1/tpg1/luns
    /vhost/naa.50...2e1/tpg1/luns> create /backstores/pscsi/disk1
    Created LUN 0.
    /vhost/naa.50...2e1/tpg1/luns> cd /
    /> ls
    o- / ..................................................................... [...]
      o- backstores .......................................................... [...]
      | o- block .............................................. [Storage Objects: 0]
      | o- fileio ............................................. [Storage Objects: 0]
      | o- pscsi .............................................. [Storage Objects: 1]
      | | o- disk1 ............................................ [/dev/sdf activated]
      | |   o- alua ............................................... [ALUA Groups: 0]
      | o- ramdisk ............................................ [Storage Objects: 0]
      | o- user:fbo ........................................... [Storage Objects: 0]
      | o- user:rbd ........................................... [Storage Objects: 0]
      | o- user:zbc ........................................... [Storage Objects: 0]
      o- iscsi ........................................................ [Targets: 0]
      o- loopback ..................................................... [Targets: 0]
      o- vhost ........................................................ [Targets: 1]
      o- naa.5001405a160fe2e1 ............................................ [TPGs: 1]
          o- tpg1 .............................. [naa.500140565cd16730, no-gen-acls]
            o- acls ...................................................... [ACLs: 0]
            o- luns ...................................................... [LUNs: 1]
              o- lun0 .............................. [pscsi/disk1 (/dev/sdf) (None)]
    /> exit
    ```

2. **Use qemu-kvm to Attach the Device**

   The World-Wide port name assigned by *targetcli* can then be used to specify
the device to attach, using a qemu-kvm command on the command line:

   ```plaintext
   # qemu-kvm (your options) \
          -device pcie-root-port,bus=pcie.0,id=rp1 \
          -device vhost-scsi-pci,wwpn=naa.5001405a160fe2e1,bus=pcie.0
   ```

3. **Confirm that the disk is visible to the Virtual Machine Guest OS**

   List the attached disk from the guest OS by using the *lsscsi* command:

    ```plaintext
    # lsscsi -g
    [0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0
    [6:0:1:0]    zbc     HGST     HSH721415AL42M0  a250  /dev/sdb   /dev/sg1
    ```

### Attaching an emulated ZBC disk

*tcmu-runner* can be used to create emulated ZBC host-managed SCSI disks. The
emulated disk that is created can be used locally on the host using the
loopback fabric adapter, as explained in the ["Creating an Emulated Disk"
section of the tcmu-runner page](/docs/tools/tcmu-runner#creating-an-emulated-disk).

The emulated ZBC disk can be attached to a vhost virtual adapter for use within
a KVM guest operating system. This is done in a manner similar to the manner in
which a physical device is attached. (See ["Attaching a Host Physical
Disk"](/docs/tools/qemu#attaching-a-host-physical-disk) for the particulars of
attaching a physical device). 

The following example illustrates this procedure, creating a small 20GB
host-managed SCSI disk with 256 MB zones including 10 conventional zones:

1. **Use targetcli to Create a 20GB Host-managed SCSI Disk**

   Run the following command to create a 20GB host-managed SCSI disk with 
   256 MB zones (including 10 conventional zones):

    ```plaintext
    # targetcli
    targetcli shell version 2.1.fb49
    Copyright 2011-2013 by Datera, Inc and others.
    For help on commands, type 'help'.

    /> cd /backstores/user:zbc
    /backstores/user:zbc> create name=zbc0 size=20G cfgstring=model-HM/zsize-256/conv-10@/var/local/zbc0.raw
    Created user-backed storage object zbc0 size 21474836480.
    /backstores/user:zbc> cd /vhost
    /vhost> create
    Created target naa.5001405a0776dce3.
    Created TPG 1.
    /vhost> /vhost/naa.5001405a0776dce3/tpg1/luns create /backstores/user:zbc/zbc0
    Created LUN 0.
    /vhost> cd /
    /> ls
    o- / ..................................................................... [...]
      o- backstores .......................................................... [...]
      | o- block .............................................. [Storage Objects: 0]
      | o- fileio ............................................. [Storage Objects: 0]
      | o- pscsi .............................................. [Storage Objects: 0]
      | o- ramdisk ............................................ [Storage Objects: 0]
      | o- user:fbo ........................................... [Storage Objects: 0]
      | o- user:rbd ........................................... [Storage Objects: 0]
      | o- user:zbc ........................................... [Storage Objects: 1]
      | o- zbc0 [model-HM/zsize-256/conv-10@/var/local/zbc0.raw (20.0GiB) activated]
      |     o- alua ............................................... [ALUA Groups: 1]
      |       o- default_tg_pt_gp ................... [ALUA state: Active/optimized]
      o- iscsi ........................................................ [Targets: 0]
      o- loopback ..................................................... [Targets: 0]
      o- v  host ...................................................... [Targets: 1]
      o- naa.5001405a0776dce3 ............................................ [TPGs: 1]
         o- tpg1 ............................... [naa.500140533e375d94, no-gen-acls]
            o- acls ...................................................... [ACLs: 0]
            o- luns ...................................................... [LUNs: 1]
              o- lun0 ............................... [user/zbc0 (default_tg_pt_gp)]
    /> exit
    ```

2. **Start the Virtual Machine with qemu-kvm**

   Start the virtual machine with the emulated ZBC disk attached by using the
World-Wide port name that was assigned by *targetcli*:

    ```plaintext
    # qemu-kvm (your options) \
           -device pcie-root-port,bus=pcie.0,id=rp1 \
           -device vhost-scsi-pci,wwpn=naa.5001405a0776dce3,bus=pcie.0
    ```

3. **Confirm That the Disk is Visible to the Virtual Machine Guest OS**

   List the disk on the command line of the guest by using *lsscsi*:

    ```plaintext
    # lsscsi -g
    [0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0
    [6:0:1:0]    zbc     LIO-ORG  TCMU ZBC device  0002  /dev/sdb   /dev/sg1
    ```

## *QEMU* NVMe ZNS Device emulation

*QEMU* support the emulation of NVMe devices with Zoned Namespace support.
These use regular files on the host as a backstores. Within a guest VM, an
emulated ZNS device acts like a physical device.

This is supported since version 6.0 of *QEMU*. If the host Linux distribution
does not provide *QEMU* version 6.0 or above, *QEMU* has to be compiled from
source. Detailed information on how to compile and install *QEMU* from source
can be found <a href="https://www.qemu.org/download/#source"
target="_blank">on the QEMU download page</a>.

### Creating an Emulated Zoned Namespace

To create an emulated zoned namespace, you must first have a backing-store file
that the namespace can use. The size of the file determines the capacity of the
namespace that will be seen from the guest OS running in the *QEMU* virtual
machine.

For example: to create a 32GiB zoned namespace, you must first create a 32 GiB
file on the host. This can be done by using the *truncate* command to
create a sparse file or by using the *dd* command to create a fully allocated
file.

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

Execute *QEMU* with command-line options and arguments to create a zoned
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
distribution's kernel version is higher than 5.9.0, the emulated SSD with ZNS
support can be checked by using the *nvme* command (see [Linux Tools for
ZNS](/docs/tools/zns)).

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

:::note
The total number of zones of the namespace directly depends on the size of the
backstore file used and on the zone size configured. In the above example, the
emulated namespace has 512 zones (32 GiB / 64 MiB).
:::

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

The behavior of a *QEMU*-emulated SSD with ZNS support is fully compliant with the
NVMe Zoned Namespace Command Set specification, with one exception: the state of namespace zones is
not persistent across restarts of the *QEMU* emulation. The state of zones is
preserved only as long as *QEMU* is running, even if the guest operating system
is rebooted. If *QEMU* is restarted and the same backstore file is used, then
the guest operating system will see the namespace with all zones in the empty
state.

### Emulated Zoned Namespace Options

The implementation of NVMe device emulation and ZNS namespace emulation in
*QEMU* provides several configuration options to control the characteristics of
the device. The full list of options and parameters is
documented <a href="https://qemu-project.gitlab.io/qemu/system/nvme.html"
target="_blank">here</a>.

The options and parameters related to Zoned Namespaces are as follows.

<center>

| Option | Default Value | Description |
| :----- | :------------ | :---------- |
| zoned.zasl=UINT32 | 0 | Zone Append Size Limit. If left at the default (0), the zone append size limit will be equal to the maximum data transfer size (MDTS). Otherwise, the zone append size limit is equal to 2 to the power of zasl multiplied by the minimum memory page size (4096 B), but cannot exceed the maximum data transfer size. |
| zoned.zone_size=*SIZE* | 128MiB | Define the zone size (ZSZE) |
| zoned.zone_capacity=*SIZE* | 0 | Define the zone capacity (ZCAP). If left at the default (0), the zone capacity will equal the zone size. |
| zoned.descr_ext_size=*UINT32* | 0 | Set the Zone Descriptor Extension Size (ZDES). Must be a multiple of 64 bytes. |
| zoned.cross_read=*BOOL* | off | Set to "on" to allow reads to cross zone boundaries. |
| zoned.max_active=*UINT32* | 0 | Set the maximum number of active resources (MAR). The default (0) allows all zones to be active. |
| zoned.max_open=*UINT32* | 0 | Set the maximum number of open resources (MOR).  The default (0) allows all zones to be open. If ``zoned.max_active`` is specified, this value must be less than or equal to that. |

</center>

### *QEMU* Execution Example

The following script uses *QEMU* to run a virtual machine with 8 CPU cores,
16 GiB of memory, and bridged networking. The bridge device *virbr0* is assumed
already to exist. The last device added to the virtual machine on the *QEMU*
command line is a 32 GiB NVMe device with Zoned Namespace support.

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
