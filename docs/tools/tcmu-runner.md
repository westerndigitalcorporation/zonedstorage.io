# tcmu-runner ZBC Disk Emulation

*tcmu-runner* is an application daemon that can handle the execution of SCSI
commands sent by the kernel SCSI target sub component, allowing exporting SCSI
Logical Units (LUNs) to be backed by regular files or block devices.

## Overview

LinuxIO (LIO&trade;) is the standard open-source SCSI target implementation in the
Linux&reg; kernel. LIO supports all prevalent storage fabrics, including Fibre
Channel, FCoE, iEEE 1394, iSCSI, NVMe-OF, iSER, SRP, etc.

The Target Core Module Userspace (TCMU) implements a fabric that creates a link
between the kernel SCSI target infrastructure and a user space application.
The kernel level module involved is `target_core_user` and can be viewed as a
virtual HBA.

*tcmu-runner* implements the userspace level side of the ank processing,
handling the details of the TCMU interface (UIO, netlink, pthreads, and DBus).
*tcmu-runner* exports a more simple C plugin API allowing the creation of
*file handlers* to emulate various device types. This organization is shown
in the figure below.

<center>
<a><img alt="tcmu-runner" src="../../assets/img/projects-tcmu.png"
title="*tcmu-runner* overview" width="640" style="max-width:100%;"></a>
<br><em>tcmu-runner Overview</em></br>
</center>

The *ZBC file handler* implements a SCSI ZBC host aware or host managed disk
emulation using TCMU C plugin API. This handler uses a regular file as the
backend storage for the emulated device.

With this infrastructure setup, any command issued by an application or by a
kernel component (e.g. a file system) will be sent to the *tcmu-runner* daemon
through the TCMU kernel driver. The file handler can process the command in user
space using regular POSIX system calls and a reply sent back on completion of
the command processing. From the point of view of the application or kernel
component using the emulated disk, all accesses appear as executing on actual
hardware.

## Compilation and Installation

The *tcmu-runner* project is hosted on <a href="https://github.com/open-iscsi/tcmu-runner"
target="_blank">GitHub</a>. The project
<a href="https://github.com/open-iscsi/tcmu-runner/blob/master/README.md"
target="_blank">*README*</a> file provides detailed information on how to
compile, install and execute *tcmu-runner* daemon.

The control of *tcmu-runner* emulated devices is achieved using the *targetcli*
utility available as a package with most distributions. For instance, on
[Fedora&reg;](../distributions/linux.md#fedora-linux) Linux, *tcmu-runner* and
*targetcli* can be installed using the following commands.

```plaintext
# dnf install tcmu-runner
# dnf install targetcli
```

## Kernel Components

*tcmu-runner* relies on the loopback virtual SAS adapter kernel module to expose
the emulated device as a regular disk to the kernel SCSI stack. Enabling this
kernel module first requires that support for the *Generic Target Core Mod (TCM)
and ConfigFS Infrastructure* be enabled from the top-level *Device Drivers*
menu.

<center>
![config-tcm](../assets/img/linux-config-tcm1.png "Target Core Module support option with `make menuconfig`")
<br>*Target Core Module support option with `make menuconfig`*</br>
</center>

With  this infrastructure enabled, the configuration option *CONFIG_TCM_USER2*
and *CONFIG_LOOPBACK_TARGET* can be enabled.

<center>
![config-tcm-mods](../assets/img/linux-config-tcm2.png "TCM user and loopback adapter support option with `make menuconfig`")
<br>*TCM user and loopback adapter support option with `make menuconfig`*</br>
</center>

## ZBC File Handler

*tcmu-runner* ZBC file handler is compiled and installed by default. This
handler allows the creation of emulated ZBC disks with a regular file used as
backing storage.

The ZBC file handler supports the emulation of both host aware and host managed
SCSI disks. Furthermore, the characteristics of the emulated device can all be
configured. The following table shows the configuration parameters available.

| Option | Description | Default value |
| --- | --- | --- |
| model-**_type_** | Device model type, _HA_ for host aware or _HM_ for host managed | _HM_
| lba-**_size (B)_** | LBA size in bytes (512 or 4096) | 512
| zsize-**_size (MiB)_** | Zone size in MiB | 256 MiB
| conv-**_num_** | Number of conventional zones at LBA 0 (can be 0) | Number of zones corresponding to 1% of the device capacity
| open-**_num_** | Optimal (for host aware) or maximum (for host managed) number of open zones | 128

These parameters are always grouped together into a configuration string with
the format `/[opt1[/opt2][...]@]path_to_backing_file`. For instance, to specify
a host managed disk with 128MB zone size, 100 conventional zones and the file
`/var/local/zbc0.raw` as backing storage, the following configuration string can
be used.

```plaintext
cfgstring=model-HM/zsize-128/conv-100@/var/local/zbc.raw
```

## Creating an Emulated disk

The following example shows how to create a small 20 GB host managed ZBC disk
with 10 conventional zones and a 256 MiB zone size, with the file
`/var/local/zbc0.raw` used as backing storage. The emulated disk will be locally
emulated using the loopback interface. This require that *tcmu-runner* be
executed on the system.

With *tcmu-runner* running, the *targetcli* command is used to create the
emulated disk.

```plaintext
# targetcli
targetcli shell version 2.1.fb49
Copyright 2011-2013 by Datera, Inc and others.
For help on commands, type 'help'.

/> cd /backstores/user:zbc
/backstores/user:zbc> {==create name=zbc0 size=20G cfgstring=model-HM/zsize-256/conv-10@/var/local/zbc0.raw==}
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

The backstore create command specifies the emulated disk capacity with the
argument `size=20G`. The backing file `/var/local/zbc0.raw` will be created if
necessary and resized to match the requested capacity.

When the backstore is linked to `lun0` of the loopback link, the emulated device
becomes visible by the kernel and its management initialized in the same manner
as with physical devices. This can be seen in the kernel messages log.

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

The disk can now be listed with tools such as *lsblk* and *lsscsi*.

```plaintext
# lsscsi -g
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0
[4:0:0:0]    zbc     ATA      HGST HSH721414AL T220  /dev/sdb   /dev/sg1
[10:0:1:0]   zbc     ATA      HGST HSH721414AL W209  /dev/sdc   /dev/sg2
[10:0:2:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdd   /dev/sg3
[11:0:1:0]   zbc     LIO-ORG  TCMU ZBC device  0002  /dev/sde   /dev/sg4
```

## Using an Emulated disk

All ZBD compliant tools and applications will be able to access and control the
emulated disk in exactly the same manner as a physical device. For instance,
[*libzbc* graphical interface (gzbc)](libzbc.md#graphical-interface) can be used
to display the emulated disk zones.

<center>
![tcmu-gzbc](../assets/img/projects-tcmu-gzbc.png "*tcmu-runner* ZBC emulated disk view in *gzbc*")
<br>*tcmu-runner* ZBC emulated disk view in *gzbc*</br>
</center>

## Scripts

The following script is useful to create an emulated disk with a single command.

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

