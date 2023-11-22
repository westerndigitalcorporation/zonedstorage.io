---
id: tcmu-runner
title: tcmu-runner ZBC Disk Emulation
sidebar_label: tcmu-runner ZBC Disk Emulation
---

import Image from '/src/components/Image';

# tcmu-runner ZBC Disk Emulation

*tcmu-runner* is an application daemon that can handle the execution of SCSI
commands that are sent by the kernel SCSI target sub component. It makes it
possible for exported SCSI Logical Units (LUNs) to be backed by regular files
or block devices.

## Overview

LinuxIO (LIO&trade;) is the standard open-source SCSI target implementation in the
Linux&reg; kernel. LIO supports all prevalent storage fabrics, including Fibre
Channel, FCoE, iEEE 1394, iSCSI, NVMe-OF, iSER, SRP, etc.

The Target Core Module Userspace (TCMU) implements a fabric that creates a link
between the kernel SCSI target infrastructure and a userspace application.
The kernel-level module that is involved is called `target_core_user` and can
be viewed as a virtual HBA.

*tcmu-runner* implements the userspace-level side of SCSI processing and
handles the details of the TCMU interface (UIO, netlink, pthreads, and DBus).
*tcmu-runner* exports a simpler C-plugin API that allows *file handlers* to be
created to emulate various device types. This is shown in the figure below.

<Image src="tools-tcmu.png" title="tcmu-runner overview"/>

The *ZBC file handler* implements the emulation of a SCSI ZBC host-aware or
host-managed disk by using the TCMU C plugin API. This handler uses a regular
file as the backend storage for the emulated device.

This infrastructure setup ensures that any command that is issued by an
application or by a kernel component (e.g. a file system) is sent to the
*tcmu-runner* daemon through the TCMU kernel driver. The file handler processes
the command in user space by using regular POSIX system calls and a reply is
sent back upon completion of processing of the command. From the point of view
of the application or kernel component that uses the emulated disk, all
accesses appear as though they have been executed on actual hardware.

## Compilation and Installation

The *tcmu-runner* project is hosted on <a href="https://github.com/open-iscsi/tcmu-runner"
target="_blank">GitHub</a>.  The project <a href="https://github.com/open-iscsi/tcmu-runner/blob/master/README.md"
target="_blank">*README*</a> file provides detailed information on how to
compile, install and execute *tcmu-runner* daemon.

The *targetcli* utility, which is available as a package in most distributions,
controls devices that are emulated with *tcmu-runner*. For example, on
[Fedora&reg;](/docs/distributions/fedora) Linux, *tcmu-runner* and *targetcli* can
be installed using the following commands:

```plaintext
# dnf install tcmu-runner
# dnf install targetcli
```

## Kernel Components

*tcmu-runner* relies on the "loopback virtual SAS adapter kernel module" to
expose the emulated device to the kernel SCSI stack as a regular disk. To
enable this kernel module, you must first enable support for the *Generic
Target Core Mod (TCM) and ConfigFS Infrastructure* from the top-level *Device
Drivers* menu.

<Image src="linux-config-tcm1.png"
title="Target Core Module support option with make menuconfig"/>

Only after this infrastructure is enabled can the configuration options
*CONFIG_TCM_USER2* and *CONFIG_LOOPBACK_TARGET* be enabled.

<Image src="linux-config-tcm2.png"
title="TCM user and loopback adapter support option with make menuconfig"/>

## ZBC File Handler

*tcmu-runner* ZBC file handler is compiled and installed by default. This
handler makes it possible to create emulated ZBC disks that use a regular file
as backing storage.

The ZBC file handler supports the emulation of both host-aware and host-managed
SCSI disks. All the characteristics of the emulated device can be configured.
The following table shows the available configuration parameters:

| Option | Description | Default value |
| --- | --- | --- |
| model-**_type_** | Device model type, _HA_ for host aware or _HM_ for host managed | _HM_
| lba-**_size (B)_** | LBA size in bytes (512 or 4096) | 512
| zsize-**_size (MiB)_** | Zone size in MiB | 256 MiB
| conv-**_num_** | Number of conventional zones at LBA 0 (can be 0) | Number of zones corresponding to 1% of the device capacity
| open-**_num_** | Optimal (for host aware) or maximum (for host managed) number of open zones | 128

These parameters are always grouped together into a configuration string with
the format `/[opt1[/opt2][...]@]path_to_backing_file`. For example, to specify
a host managed disk with 128MB zone size, 100 conventional zones and the file
`/var/local/zbc0.raw` as backing storage, use the following configuration string:

```plaintext
cfgstring=model-HM/zsize-128/conv-100@/var/local/zbc.raw
```

## Creating an Emulated disk

The following example shows the creation of a small 20 GB host-managed ZBC disk
with 10 conventional zones and a zone size of 256 MiB, with the file
`/var/local/zbc0.raw` used as backing storage. The emulated disk is emulated
locally using the loopback interface. This requires that *tcmu-runner* is 
running on the system.

With *tcmu-runner* running, the *targetcli* command is used to create the
emulated disk.

```plaintext
# targetcli
targetcli shell version 2.1.fb49
Copyright 2011-2013 by Datera, Inc and others.
For help on commands, type 'help'.

/> cd /backstores/user:zbc
/backstores/user:zbc> create name=zbc0 size=20G cfgstring=model-HM/zsize-256/conv-10@/var/local/zbc0.raw
Created user-backed storage object zbc0 size 21474836480.
/backstores/user:zbc> cd /loopback
/loopback> create
Created target naa.500140529100d742.
/loopback> cd naa.500140529100d742/luns
/loopback/naa...9100d742/luns> create /backstores/user:zbc/zbc0 0
Created LUN 0.
/loopback/naa...9100d742/luns> cd /
/> ls
o- / ..................................................................... [...]
  o- backstores .......................................................... [...]
  | o- block .............................................. [Storage Objects: 0]
  | o- fileio ............................................. [Storage Objects: 0]
  | o- pscsi .............................................. [Storage Objects: 0]
  | o- ramdisk ............................................ [Storage Objects: 0]
  | o- user:fbo ........................................... [Storage Objects: 0]
  | o- user:poma .......................................... [Storage Objects: 0]
  | o- user:zbc ........................................... [Storage Objects: 1]
  |   o- zbc0  [model-HM/zsize-256/conv-10@/var/local/zbc0.raw (20.0GiB) activated]
  |     o- alua ............................................... [ALUA Groups: 1]
  |       o- default_tg_pt_gp ................... [ALUA state: Active/optimized]
  o- iscsi ........................................................ [Targets: 0]
  o- loopback ..................................................... [Targets: 1]
  | o- naa.500140529100d742 ............................. [naa.50014059e05d5424]
  |   o- luns ........................................................ [LUNs: 1]
  |     o- lun0 ................................. [user/zbc0 (default_tg_pt_gp)]
  o- vhost ........................................................ [Targets: 0]
/> exit
```

The `backstore create` command specifies the capacity of the emulated disk with
the argument `size=20G`. The backing file `/var/local/zbc0.raw` is created if
necessary and is resized to match the specified capacity.

When the backstore is linked to `lun0` of the loopback link, the emulated
device becomes visible to the kernel and its management initialized the same
way physical devices are initialized. This is reported in the kernel messages
log:

```plaintext
# dmesg
...
scsi host11: TCM_Loopback
scsi 11:0:1:0: Direct-Access-ZBC LIO-ORG  TCMU ZBC device  0002 PQ: 0 ANSI: 5
sd 11:0:1:0: Attached scsi generic sg4 type 20
sd 11:0:1:0: [sde] Host-managed zoned block device
sd 11:0:1:0: [sde] 41943040 512-byte logical blocks: (21.5 GB/20.0 GiB)
sd 11:0:1:0: [sde] 80 zones of 524288 logical blocks
sd 11:0:1:0: [sde] Write Protect is off
sd 11:0:1:0: [sde] Mode Sense: 0f 00 00 00
sd 11:0:1:0: [sde] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
sd 11:0:1:0: [sde] Optimal transfer size 65536 bytes
sd 11:0:1:0: [sde] Attached SCSI disk
```

The disk can now be listed with tools such as *lsblk* and *lsscsi*:

```plaintext
# lsscsi -g
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0
[4:0:0:0]    zbc     ATA      HGST HSH721414AL T220  /dev/sdb   /dev/sg1
[10:0:1:0]   zbc     ATA      HGST HSH721414AL W209  /dev/sdc   /dev/sg2
[10:0:2:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdd   /dev/sg3
[11:0:1:0]   zbc     LIO-ORG  TCMU ZBC device  0002  /dev/sde   /dev/sg4
```

## Using an Emulated disk

All ZBD-compliant tools and applications are able to access and control the
emulated disk in exactly the same manner as they would control a physical
device. For example, the [*libzbc* graphical interface
(gzbc)](/docs/tools/libzbc#graphical-interface) can be used to display the
emulated disk zones.

<Image src="tools-tcmu-gzbc.png"
title="tcmu-runner ZBC emulated disk view in gzbc"/>

## Scripts

The following script creates an emulated disk with a single command:

```bash
#!/bin/bash

if [ $# != 5 ]; then
        echo "Usage: $0 <disk name> <cap (GB)> HM|HA <zone size (MB)> <conv zones num>"
        exit 1;
fi

dname="$1"
cap="$2"
model="$3"
zs="$4"
cnum="$5"

naa="naa.50014059cfa9ba75"

# Setup emulated disk
cat << EOF | targetcli

cd /backstores/user:zbc
create name=${dname} size=${cap}G cfgstring=model-${model}/zsize-${zs}/conv-${cnum}@/var/local/${dname}.raw
cd /loopback
create ${naa}
cd ${naa}/luns
create /backstores/user:zbc/${dname} 0
cd /
exit

EOF

sleep 1
disk=`lsscsi | grep "TCMU ZBC device" | cut -d '/' -f3 | sed 's/ //g'`
echo "mq-deadline" > /sys/block/"${disk}"/queue/scheduler
```

Tearing down an emulated disk can also be automated with a single command line
as shown below.

```bash
#!/bin/bash

if [ $# != 1 ]; then
	echo "Usage: $0 <disk name (e.g. zbc0)"
	exit 1;
fi

dname="$1"

naa="naa.50014059cfa9ba75"

# Delete emulated disk
cat << EOF | targetcli

cd /loopback/${naa}/luns
delete 0
cd /loopback
delete ${naa}
cd /backstores/user:zbc
delete ${dname}
cd /
exit

EOF
```
