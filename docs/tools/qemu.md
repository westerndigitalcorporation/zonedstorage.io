---
id: qemu
title: QEMU and KVM
sidebar_label: QEMU and KVM
---

import Image from '/src/components/Image';

# QEMU and KVM

*<a href="https://www.qemu.org/" target="_blank">QEMU</a>* is a generic machine
emulator and virtualizer. *QEMU* also provides the userspace components
of the widely used <a href="https://www.linux-kvm.org/" target="_blank">*KVM*
(Kernel-based Virtual Machine)</a>.

## QEMU and zoned block devices

Host managed SMR disks can be directly attached to a *QEMU* guest for running
applications in a virtual machine environment. This is especially useful in the
case of software and kernel development and tests.

There are two supported methods to attach Host managed SMR zoned disks to a QEMU
guest: *virtio-scsi* and *vhost-scsi*.

Furthermore, *QEMU* also allows emulating NVMe devices implementing zoned
namespaces.

## *QEMU virtio-scsi*

This is the simplest method to attach a zoned block device for access from a
QEMU guest. To do so, the QEMU option *virtio-scsi-pci* is used after defining a
virtual PCI bus and SCSI host.

For instance, the following command will run QEMU with 

```plaintext
# qemu-kvm (your options) \
	-device pcie-root-port,bus=pcie.0,id=rp1 \
	-device virtio-scsi-pci,bus=pcie.0,id=scsi0 \
	-drive file={==/dev/sdf==},format=raw,if=none,id=zbc0 \
	-device scsi-block,bus=scsi0.0,drive=zbc0
```

The first line `-device pcie-root-port,bus=pcie.0,id=rp1` creates a PCIe root
complex. The second line `-device virtio-scsi-pci,bus=pcie.0,id=scsi0` defines
a virtio adapter connected to the PCIe bus previously defined. Finally, the last
2 lines `-drive file=/dev/sdf,format=raw,if=none,id=zbc0` and
`-device scsi-block,bus=scsi0.0,drive=zbc0` define the device connected to the
virtio SCSI adapter. In this example, since `-device scsi-block` is used, the
host device to attach is specified using the device block device file
(`/dev/sdf`) in this example.

See <a href="https://github.com/qemu/qemu/blob/master/docs/pcie_pci_bridge.txt"
target="_blank">here</a> for a detailed description of these options.

Though this method allows attaching a zoned block disk to a QEMU guest, SCSI
command sense data is not processed correctly in QEMU versions prior to version
4.1. This causes the guest operating system to hang if the guest attempts to
access a command sense data (for instance upon command failures). This
attachment method should thus be avoided with versions of QEMU older than
version 4.1.

To avoid the sense data problem with QEMU versions preceding version 4.1, a
zoned disk can be attached to a guest using the device SG node file as a
specifier. In this case, the option `-device scsi-generic` must be used. The
command line is changed as follows.

```plaintext
# qemu-kvm (your options) \
	-device pcie-root-port,bus=pcie.0,id=rp1 \
	-device virtio-scsi-pci,bus=pcie.0,id=scsi0 \
	-drive file={==/dev/sg5==},format=raw,if=none,id=zbc0 \
	-device scsi-generic,bus=scsi0.0,drive=zbc0
```

On the host, the correspondance between a block device file and its SG node file
can be discovered using the `lsscsi` command.

```plaintext
# lsscsi -g
...
[10:0:1:0]   zbc     HGST     HSH721415AL42M0  a250  {==/dev/sdf==}   {==/dev/sg5==}
...
```

Once the guest operating system is started, attachment of the host device can be
checked with any of the methods shown [here](../getting-started/smr-disk.md).
For instance, the output of the `lsscsi` command will be as follows with the
above example setup.

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

To allow attaching physical disks as well as
[*tcmu-runner*](../tools/tcmu-runner.md) emulated ZBC disks, the kernel
configuration option *COFNGI_TCM_PSCSI* should also be enbaled. This option can
be found in the menu *Device Drivers* -> *Generic Target Core Mod (TCM) and
ConfigFS Infrastructure*.

<Image src="linux-config-pscsi.png"
title="pSCSI TCM support option with make menuconfig"/>

### Attaching a host physical disk

To attach to a virtual machine guest a zoned device, a virtual TCM SAS adapter
must first be prepared using the *targetcli* tool. The device to attach must be
specified using a block device file. The example below illustrates this
operation for the disk `/dev/sdf`.

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
Created target {==naa.5001405a160fe2e1==}.
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
    o- {==naa.5001405a160fe2e1==} .......................................... [TPGs: 1]
      o- tpg1 .............................. [naa.500140565cd16730, no-gen-acls]
        o- acls ...................................................... [ACLs: 0]
        o- luns ...................................................... [LUNs: 1]
          o- lun0 .............................. [pscsi/disk1 (/dev/sdf) (None)]
/> exit
```

The World-Wide port name assigned by *targetcli* can then be used to specify the
device to attach on QEMU command line.

```plaintext
# qemu-kvm (your options) \
	-device pcie-root-port,bus=pcie.0,id=rp1 \
	-device vhost-scsi-pci,wwpn={==naa.5001405a160fe2e1==},bus=pcie.0
```

The attached disk can then be seen from the guest OS using (for instance) the
*lsscsi* command.

```plaintext
# lsscsi -g
[0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0
[6:0:1:0]    zbc     HGST     HSH721415AL42M0  a250  /dev/sdb   /dev/sg1
```

### Attaching an emulated ZBC disk

*tcmu-runner* can be used to create emulated ZBC host managed SCSI disks. The
emulated disk created can be used either locally on the host using the loopback
fabric adapter, as explained [here](./tcmu-runner.md#creating-an-emulated-disk).

Similarly to a physical device (previous section), the emulated ZBC disk can
also be attached to a vhost virtual adapter for use within a KVM guest operating
system. The following example illustrates this procedure, creating a small 20GB
host managed SCSI disk with 256 MB zones including 10 conventional zones.

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
Created target {==naa.5001405a0776dce3==}.
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
  |   o- zbc0  [model-HM/zsize-256/conv-10@/var/local/zbc0.raw (20.0GiB) activated]
  |     o- alua ............................................... [ALUA Groups: 1]
  |       o- default_tg_pt_gp ................... [ALUA state: Active/optimized]
  o- iscsi ........................................................ [Targets: 0]
  o- loopback ..................................................... [Targets: 0]
  o- vhost ........................................................ [Targets: 1]
    o- {==naa.5001405a0776dce3==} .......................................... [TPGs: 1]
      o- tpg1 .............................. [naa.500140533e375d94, no-gen-acls]
        o- acls ...................................................... [ACLs: 0]
        o- luns ...................................................... [LUNs: 1]
          o- lun0 ............................... [user/zbc0 (default_tg_pt_gp)]
/> exit
```

The virtual machine can then be started with the emulated ZBC disk attached
using the World-Wide port name assigned by *targetcli*.

```plaintext
# qemu-kvm (your options) \
	-device pcie-root-port,bus=pcie.0,id=rp1 \
	-device vhost-scsi-pci,wwpn={==naa.5001405a0776dce3==},bus=pcie.0
```

The disk is listed on the guest with tools such as *lsscsi*.

```plaintext
# lsscsi -g
[0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0
[6:0:1:0]    zbc     LIO-ORG  TCMU ZBC device  0002  /dev/sdb   /dev/sg1
```

## *QEMU* NVMe ZNS Device emulation

[This article](../getting-started/zns-emulation.md) describes in details, with
examples, how *QEMU* can be configured to create an emulated NVMe ZNS namespace
visible by the guest operating system.
