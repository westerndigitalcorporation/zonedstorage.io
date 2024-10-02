"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[1298],{4475:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>r,contentTitle:()=>o,default:()=>h,frontMatter:()=>d,metadata:()=>a,toc:()=>c});var t=s(4848),i=s(8453);const d={id:"smr-disk",title:"Getting Started with SMR Hard Disks",sidebar_label:"Getting Started with SMR Hard Disks"},o="Getting Started with SMR Hard Disks",a={id:"getting-started/smr-disk",title:"Getting Started with SMR Hard Disks",description:"Hard disk drives that use Shingled Magnetic Recording",source:"@site/docs/getting-started/smr-disk.md",sourceDirName:"getting-started",slug:"/getting-started/smr-disk",permalink:"/docs/getting-started/smr-disk",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"smr-disk",title:"Getting Started with SMR Hard Disks",sidebar_label:"Getting Started with SMR Hard Disks"},sidebar:"docs",previous:{title:"Getting started with Emulated Zoned Block Devices",permalink:"/docs/getting-started/zbd-emulation"},next:{title:"Getting Started with NVMe ZNS Devices",permalink:"/docs/getting-started/zns-device"}},r={},c=[{value:"Serial ATA ZAC Disks and SATA Host Controllers",id:"serial-ata-zac-disks-and-sata-host-controllers",level:2},{value:"Verifying The Disk",id:"verifying-the-disk",level:3},{value:"Checking The Disk Information",id:"checking-the-disk-information",level:3},{value:"Discovering The Disk Zone Configuration",id:"discovering-the-disk-zone-configuration",level:3},{value:"Using a SAS Host Bus Adapter",id:"using-a-sas-host-bus-adapter",level:2},{value:"HBA Compatibility",id:"hba-compatibility",level:3},{value:"Verifying The Disk",id:"verifying-the-disk-1",level:3}];function l(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"getting-started-with-smr-hard-disks",children:"Getting Started with SMR Hard Disks"})}),"\n",(0,t.jsxs)(n.p,{children:["Hard disk drives that use ",(0,t.jsx)(n.a,{href:"/docs/introduction/smr",children:"Shingled Magnetic Recording"}),"\ntechnology can have different interface implementations. This results in\ndifferent usage models:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Drive Managed Interface:"})," SMR disks that implement this interface are seen\nby the host kernel and by applications as identical to regular disks. Most\nLinux\xae kernels recognize these disks. SMR disks that implement this\ninterface make no LBA-space zoning information available to the host. Drive\nManaged disks are therefore not considered to be zoned block devices."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Zoned Block Interface:"})," SMR hard-disk drives that implement the ZBC and\nZAC feature sets also provide commands to the host that allow the host to\nidentify and control the device's zones. This interface has two different\nvariations, or model implementations (See\n",(0,t.jsx)(n.a,{href:"/docs/introduction/smr#smr-interface-implementations",children:"SMR Interface Implementations"}),").\nThose two model implementations are:"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Host Aware:"}),' This zone model offers the convenience and flexibility\nof Drive Managed disks (for example, it provides random write\ncapabilities) and also supports the full set of zone commands defined\nin the ZBC and the ZAC standards. Host Aware disks can support both\nthe regular block device abstraction ("regular disk") and the zoned\nblock device abstraction.']}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Host Managed:"}),' This zone model defines a device type that is\ndifferent from the "regular disk" device type. Host Managed disks can\nbe used only as zoned block devices. This is necessary in order to\nsatisfy the strong sequential write constraints defined by this zone\nmodel.']}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"In the following sections, Host Aware disk models are considered to have\ncharacteristics similar to Host Managed drives. Sequential writes are therefore\nassumed to be a constraint for the correct operation of drives that implement\nthe Host Aware disk model."}),"\n",(0,t.jsx)(n.h2,{id:"serial-ata-zac-disks-and-sata-host-controllers",children:"Serial ATA ZAC Disks and SATA Host Controllers"}),"\n",(0,t.jsx)(n.p,{children:"Serial ATA (SATA) host adapters, including those that use the Advance Host\nController Interface (AHCI) standard, are able to scan and initialize\nconnections with Host Aware disks. Most AHCI host adapters are known to work\nwith Host Managed disk drives (this is because the adapter usually does not\nreact to the device signature of the connected disk)."}),"\n",(0,t.jsx)(n.h3,{id:"verifying-the-disk",children:"Verifying The Disk"}),"\n",(0,t.jsxs)(n.p,{children:["On systems that have ",(0,t.jsx)(n.a,{href:"/docs/linux",children:"zoned block device support enabled"}),", SATA\nhost aware disks and host managed disks can be connected directly to SATA ports\non the host controller."]}),"\n",(0,t.jsxs)(n.p,{children:["After booting the system, use the ",(0,t.jsx)(n.em,{children:"lsscsi"})," utility to list all SCSI devices\nattached to the system and verify the presence of the newly-connected disk:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# lsscsi -g\n[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0\n[5:0:0:0]    zbc     ATA      HGST HSH721415AL T220  /dev/sdb   /dev/sg1\n"})}),"\n",(0,t.jsx)(n.p,{children:"In this example, the disk '/dev/sda' is the system boot disk and the disk\n'/dev/sdb' is recognized as a ZBC disk."}),"\n",(0,t.jsxs)(n.p,{children:["The second column of ",(0,t.jsx)(n.code,{children:"lsscsi"})," output indicates the device type. The value\n",(0,t.jsx)(n.em,{children:"zbc"})," is always used for Host Managed ZBC and ZAC disks. This corresponds\nto the ZBC-defined device type ",(0,t.jsx)(n.em,{children:"0x14"})," for SAS disks and corresponds to the\nZAC-defined device signature ",(0,t.jsx)(n.em,{children:"0xabcd"})," for SATA disks. Because Host Aware\ndisks have the same device type or device signature as regular disks,\nlsscsi lists host aware disks as ",(0,t.jsx)(n.em,{children:"disk"}),"."]}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.em,{children:"lsscsi"})," utility does not list SATA ZAC disks with the type ",(0,t.jsx)(n.em,{children:"zac"}),". The type\n",(0,t.jsx)(n.em,{children:"zbc"})," is always used, because the kernel internally implements a SCSI-to-ATA\ntranslation layer (SAT), which allows SATA devices to be represented as SCSI\ndevices."]})}),"\n",(0,t.jsx)(n.h3,{id:"checking-the-disk-information",children:"Checking The Disk Information"}),"\n",(0,t.jsxs)(n.p,{children:["Verify the zone model of the disk by checking the ",(0,t.jsx)(n.em,{children:"zoned"})," sysfs attribute:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# cat /sys/block/sdb/queue/zoned\nhost-managed\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The possible values of the ",(0,t.jsx)(n.em,{children:"zoned"})," attribute are shown in the table below."]}),"\n",(0,t.jsx)("center",{children:(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{style:{textAlign:"left"},children:"Value"}),(0,t.jsx)(n.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{style:{textAlign:"left"},children:"none"}),(0,t.jsx)(n.td,{style:{textAlign:"left"},children:"Regular disk or drive managed ZBC/ZAC disk"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{style:{textAlign:"left"},children:"host-aware"}),(0,t.jsx)(n.td,{style:{textAlign:"left"},children:"Host aware ZBC/ZAC disk"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{style:{textAlign:"left"},children:"host-managed"}),(0,t.jsx)(n.td,{style:{textAlign:"left"},children:"Host managed ZBC/ZAC disk"})]})]})]})}),"\n",(0,t.jsx)(n.p,{children:"Kernel messages also contain useful information about the disk:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# dmesg\nahci 0000:00:11.5: version 3.0\nahci 0000:00:11.5: AHCI 0001.0301 32 slots 2 ports 6 Gbps 0x3 impl SATA mode\nahci 0000:00:11.5: flags: 64bit ncq sntf led clo only pio slum part ems deso sadm sds apst\n...\nscsi host5: ahci\nata5: SATA max UDMA/133 abar m524288@0x9d100000 port 0x9d100200 irq 55\nata5: SATA link up 6.0 Gbps (SStatus 133 SControl 300)\nata5.00: ATA-9: HGST HSH721414ALN6M0, L4GMT220, max UDMA/133\nata5.00: 27344764928 sectors, multi 0: LBA48 NCQ (depth 32), AA\nata5.00: configured for UDMA/133\n...\nsd 5:0:0:0: Attached scsi generic sg1 type 20\nsd 5:0:0:0: [sdb] Host-managed zoned block device\nsd 5:0:0:0: [sdb] 3662151680 4096-byte logical blocks: (15.0 TB/13.6 TiB)\nsd 5:0:0:0: [sdb] 55880 zones of 65536 logical blocks\nsd 5:0:0:0: [sdb] Write Protect is off\nsd 5:0:0:0: [sdb] Mode Sense: 00 3a 00 00\nsd 5:0:0:0: [sdb] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA\nsd 5:0:0:0: [sdb] Attached SCSI disk\n...\n"})}),"\n",(0,t.jsx)(n.p,{children:'The zone model of the disk is confirmed to be "host managed". The total number\nof zones on the disk is also displayed. In this example, the disk capacity is\n15 TB and the disk has 55880 zones.'}),"\n",(0,t.jsxs)(n.p,{children:["The zone size of the disk can be inspected by using sysfs to examine the\nattribute ",(0,t.jsx)(n.em,{children:"chunk_sectors"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# cat /sys/block/sdb/queue/chunk_sectors \n524288\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The value is displayed as a number of 512B sectors regardless of the actual\nlogical and physical block size of the disk. In this example, the disk zone size\nis ",(0,t.jsx)(n.em,{children:"524288 x 512 = 256 MiB"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["As of Linux kernel version 4.20.0, the sysfs attribute ",(0,t.jsx)(n.em,{children:"nr_zones"}),"\nreports the total number of zones on the disk:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# cat /sys/block/sdb/queue/nr_zones\n55880\n"})}),"\n",(0,t.jsx)(n.h3,{id:"discovering-the-disk-zone-configuration",children:"Discovering The Disk Zone Configuration"}),"\n",(0,t.jsxs)(n.p,{children:["To obtain detailed information on the disk zone configuration, for instance the\nnumber of conventional zones available, the\n",(0,t.jsx)(n.a,{href:"/docs/tools/util-linux#blkzone",children:(0,t.jsx)(n.em,{children:"blkzone"})})," utility can be used."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# blkzone report /dev/sdb\n  start: 0x000000000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000080000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000100000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  ...\n  start: 0x010480000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x010500000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x010580000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x010600000, len 0x080000, wptr 0x000008 reset:0 non-seq:0, zcond: 4(cl) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x010680000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x010700000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  ...\n  start: 0x6d2280000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x6d2300000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x6d2380000, len 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n"})}),"\n",(0,t.jsx)(n.p,{children:"This output shows that that the 512B sector range (from 0 up to 0x010600000) is\ndivided into 524 conventional zones. The sector space starting at 0x010600000\nand ending at the last sector of the disk is divided into 55356 sequential\nwrite required zones."}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.a,{href:"/docs/tools/libzbc#zone-information",children:(0,t.jsx)(n.em,{children:"zbc_report_zones"})})," of\n",(0,t.jsx)(n.a,{href:"/docs/tools/libzbc",children:(0,t.jsx)(n.em,{children:"libzbc"})})," provides more detailed information in a more\nreadable format."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# zbc_report_zones /dev/sdb\nDevice /dev/sdb:\n    Vendor ID: ATA HGST HSH721415AL T220\n    Zoned block device interface, Host-managed zone model\n    29297213440 512-bytes sectors\n    3662151680 logical blocks of 4096 B\n    3662151680 physical blocks of 4096 B\n    15000.173 GB capacity\n    Read commands are unrestricted\n    Maximum number of open sequential write required zones: 128\n    55880 zones from 0, reporting option 0x00\n55880 / 55880 zones:\nZone 00000: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 0, 524288 sectors\nZone 00001: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 524288, 524288 sectors\nZone 00002: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 1048576, 524288 sectors\n...\nZone 00521: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 273154048, 524288 sectors\nZone 00522: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 273678336, 524288 sectors\nZone 00523: type 0x1 (Conventional), cond 0x0 (Not-write-pointer), sector 274202624, 524288 sectors\nZone 00524: type 0x2 (Sequential-write-required), cond 0x4 (Closed), reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 274726920\nZone 00525: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 275251200, 524288 sectors, wp 275251200\nZone 00526: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 275775488, 524288 sectors, wp 275775488\n...\nZone 55877: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29295640576, 524288 sectors, wp 29295640576\nZone 55878: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29296164864, 524288 sectors, wp 29296164864\nZone 55879: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 29296689152, 524288 sectors, wp 29296689152\n"})}),"\n",(0,t.jsx)(n.h2,{id:"using-a-sas-host-bus-adapter",children:"Using a SAS Host Bus Adapter"}),"\n",(0,t.jsx)(n.p,{children:"AHCI adapters can only accomodate Serial ATA disks and generally only provide a\nlimited number of ports. SAS Host Bus Adapters (HBA) are widely used in\nenterprise applications to overcome AHCI limitations. The SAS transport layer\nused by SAS HBAs can equally accomodate both Serial ATA and SCSI disks."}),"\n",(0,t.jsx)(n.h3,{id:"hba-compatibility",children:"HBA Compatibility"}),"\n",(0,t.jsx)(n.p,{children:"While most AHCI adapters for Serial ATA disks generally do not cause any\nproblem with host managed ZAC disks identification, SAS HBAs on the other\nhand may suffer from a lack of support depending on the HBA model being used."}),"\n",(0,t.jsx)(n.p,{children:"The compatibility of a SAS HBA with host managed disks mainly depends on\nthe following factors."}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["The HBA must have the ability to recognize the host managed device type\n",(0,t.jsx)(n.em,{children:"0x14"})," of host managed SAS disks (ZBC/SCSI)."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["The HBA must have the ability to recognize the host managed device signature\n",(0,t.jsx)(n.em,{children:"0xabcd"})," of SATA host managed ZAC disks and translate this signature into\nthe ZBC defined SCSI device type ",(0,t.jsx)(n.em,{children:"0x14"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Generalizing the previous point, the HBA must implement a SCSI-to-ATA\ntranslation (SAT) layer supporting the conversion of host issued ZBC zone\ncommands into ZAC zone commands that can be executed by a SATA ZAC disk\nconnected to the HBA."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Any HBA failing the first requirement will not expose a ZBC host managed disk to\nthe host. Similarly, an HBA failing to comply with the second and third\nrequirement will fail to expose to the host a host managed ZAC disk as a ZBC\nhost managed disk."}),"\n",(0,t.jsxs)(n.p,{children:["In the case of a host aware disk model, the device type and device signature\nhandling will not cause any problem (recall that host aware disks use the\nregular disk device type and signatur ",(0,t.jsx)(n.em,{children:"0x00"}),"). Host aware disks will thus always\nbe useable as regular disks with any HBA. The execution of ZBC zone commands\nwith a SAS host aware disk may also work most of the time. However, similarly\nto host managed disk, the absence of a ZBC/ZAC compatible SAT layer will prevent\nthe use of a Serial ATA host aware disk as a ZBC host aware disk. The ZBC zone\ncommands sent to the SATA disk will not be translated and result in command\nfailures."]}),"\n",(0,t.jsxs)(n.p,{children:["The compatibility of an HBA model with the ZBC and ZAC standards should be\nchecked with the HBA vendor. Under some conditions, an HBA compatibility can\nalso be checked using the ",(0,t.jsxs)(n.a,{href:"/docs/tests/zbc-tests",children:[(0,t.jsx)(n.em,{children:"libzbc"})," conformance test\nsuite"]}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"verifying-the-disk-1",children:"Verifying The Disk"}),"\n",(0,t.jsx)(n.p,{children:"If you are using a compatible HBA and you have connected the drive and rebooted\nthe system, verifying the disk identification and checking the disk parameters\nand zone configuration can be done in the exact same manner as with Serial ATA\ndisks as discussed above."}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsx)(n.p,{children:"Remember that most SAS HBAs have plug-and-play features that make it unnecessary\nto reboot the system after connecting or disconnecting a disk to it."})}),"\n",(0,t.jsxs)(n.p,{children:["In these examples, ",(0,t.jsx)(n.code,{children:"/dev/sdc"})," is an SAS disk connected to an SAS HBA and\n",(0,t.jsx)(n.em,{children:"/dev/sdd"})," is a SATA disk connected to the same HBA."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# lsscsi -g\n[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0\n[5:0:0:0]    zbc     ATA      HGST HSH721415AL T220  /dev/sdb   /dev/sg1\n[10:0:2:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdc   /dev/sg2\n[10:0:3:0]   zbc     ATA      HGST HSH721415AL T220  /dev/sdd   /dev/sg3\n"})}),"\n",(0,t.jsx)(n.p,{children:"Inspecting the kernel messages shows no differences between the initialization\nof the SAS drive and the SATA disk."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-plaintext",children:"# dmesg\n...\nscsi 10:0:2:0: Direct-Access-ZBC HGST     HSH721414AL52M0  a220 PQ: 0 ANSI: 7\nscsi 10:0:2:0: SSP: handle(0x001b), sas_addr(0x5000cca0000025c5), phy(1), device_name(0x5000cca0000025c7)\nscsi 10:0:2:0: enclosure logical id (0x500062b200f35d40), slot(2)\nscsi 10:0:2:0: enclosure level(0x0000), connector name(     )\nsd 10:0:2:0: Attached scsi generic sg2 type 20\nsd 10:0:2:0: [sdc] Host-managed zoned block device\nsd 10:0:2:0: [sdc] 27344764928 512-byte logical blocks: (14.0 TB/12.7 TiB)\nsd 10:0:2:0: [sdc] 4096-byte physical blocks\nsd 10:0:2:0: [sdc] 52156 zones of 524288 logical blocks\nsd 10:0:2:0: [sdc] Write Protect is off\nsd 10:0:2:0: [sdc] Mode Sense: f7 00 10 08\nsd 10:0:2:0: [sdc] Write cache: enabled, read cache: enabled, supports DPO and FUA\nsd 10:0:2:0: [sdc] Attached SCSI disk\n...\nscsi 10:0:3:0: Direct-Access-ZBC ATA      HGST HSH721415AL T220 PQ: 0 ANSI: 6\nscsi 10:0:3:0: SATA: handle(0x001c), sas_addr(0x300062b200f35d43), phy(3), device_name(0x5000cca25bc2e26f)\nscsi 10:0:3:0: enclosure logical id (0x500062b200f35d40), slot(1)\nscsi 10:0:3:0: enclosure level(0x0000), connector name(     )\nscsi 10:0:3:0: atapi(n), ncq(y), asyn_notify(n), smart(y), fua(y), sw_preserve(y)\nsd 10:0:3:0: Attached scsi generic sg3 type 20\nsd 10:0:3:0: [sdd] Host-managed zoned block device\nsd 10:0:3:0: [sdd] 3662151680 4096-byte logical blocks: (15.0 TB/13.6 TiB)\nsd 10:0:3:0: [sdd] 55880 zones of 65536 logical blocks\nsd 10:0:3:0: [sdd] Write Protect is off\nsd 10:0:3:0: [sdd] Mode Sense: 9b 00 10 08\nsd 10:0:3:0: [sdd] Write cache: enabled, read cache: enabled, supports DPO and FUA\nsd 10:0:3:0: [sdd] Attached SCSI disk\n...\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Both disks are identified by the kernel as ",(0,t.jsx)(n.em,{children:"Direct-Access-ZBC"})," devices.  This\nindicates that the HBA is correctly translating the ZAC host managed device\nsignature into a ZBC host managed device type."]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>a});var t=s(6540);const i={},d=t.createContext(i);function o(e){const n=t.useContext(d);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),t.createElement(d.Provider,{value:n},e.children)}}}]);