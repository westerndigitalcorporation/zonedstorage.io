(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[8416],{276:(e,n,A)=>{"use strict";A.r(n),A.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>g,frontMatter:()=>a,metadata:()=>o,toc:()=>r});var s=A(7624),t=A(4552),i=A(336);const a={id:"qemu",title:"QEMU and KVM",sidebar_label:"QEMU and KVM"},c="QEMU and KVM",o={id:"tools/qemu",title:"QEMU and KVM",description:"QEMU is a generic machine",source:"@site/docs/tools/qemu.md",sourceDirName:"tools",slug:"/tools/qemu",permalink:"/docs/tools/qemu",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"qemu",title:"QEMU and KVM",sidebar_label:"QEMU and KVM"},sidebar:"docs",previous:{title:"tcmu-runner ZBC Disk Emulation",permalink:"/docs/tools/tcmu-runner"},next:{title:"Overview",permalink:"/docs/linux"}},d={},r=[{value:"QEMU and zoned block devices",id:"qemu-and-zoned-block-devices",level:2},{value:"<em>QEMU virtio-scsi</em>",id:"qemu-virtio-scsi",level:2},{value:"QEMU Command Example",id:"qemu-command-example",level:3},{value:"Analysis of QEMU Command",id:"analysis-of-qemu-command",level:4},{value:"Sense data in QEMU prior to Version 4.1",id:"sense-data-in-qemu-prior-to-version-41",level:3},{value:"<em>QEMU vhost-scsi</em>",id:"qemu-vhost-scsi",level:2},{value:"Enabling the host vhost target module",id:"enabling-the-host-vhost-target-module",level:3},{value:"Attaching a host physical disk",id:"attaching-a-host-physical-disk",level:3},{value:"Attaching an emulated ZBC disk",id:"attaching-an-emulated-zbc-disk",level:3},{value:"<em>QEMU</em> NVMe ZNS Device emulation",id:"qemu-nvme-zns-device-emulation",level:2}];function l(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,t.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"qemu-and-kvm",children:"QEMU and KVM"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:(0,s.jsx)("a",{href:"https://www.qemu.org/",target:"_blank",children:"QEMU"})})," is a generic machine\nemulator and virtualizer. ",(0,s.jsx)(n.em,{children:"QEMU"})," provides the userspace components of the\nwidely used ",(0,s.jsxs)("a",{href:"https://www.linux-kvm.org/",target:"_blank",children:[(0,s.jsx)(n.em,{children:"KVM"}),"\n(Kernel-based Virtual Machine)"]}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"qemu-and-zoned-block-devices",children:"QEMU and zoned block devices"}),"\n",(0,s.jsxs)(n.p,{children:["Host-managed SMR disks can be attached directly to a ",(0,s.jsx)(n.em,{children:"QEMU"})," guest and used for\nrunning applications in a virtual machine environment. This is useful for\nsoftware and kernel development and tests."]}),"\n",(0,s.jsxs)(n.p,{children:["There are two supported methods for attaching host-managed SMR zoned disks to a\nQEMU guest: (1) ",(0,s.jsx)(n.a,{href:"/docs/tools/qemu#qemu-virtio-scsi",children:"virtio-scsi"})," and (2)\n",(0,s.jsx)(n.a,{href:"/docs/tools/qemu#qemu-vhost-scsi",children:"vhost-scsi"}),".  ",(0,s.jsx)(n.em,{children:"virtio-scsi"})," is the simpler\nof the two methods. ",(0,s.jsx)(n.em,{children:"vhost-scsi"})," is the faster of the two methods, but cannot\nbe used without QEMU KVM acceleration."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"QEMU"})," also makes it possible to emulate NVMe devices that implement zoned\nnamespaces."]}),"\n",(0,s.jsx)(n.h2,{id:"qemu-virtio-scsi",children:(0,s.jsx)(n.em,{children:"QEMU virtio-scsi"})}),"\n",(0,s.jsxs)(n.p,{children:["This is the simplest method for attaching a zoned block device so that it can\nbe accessed by a QEMU guest. Define a virtual PCI bus and SCSI host and then\nuse the QEMU option ",(0,s.jsx)(n.em,{children:"virtio-scsi-pci"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"qemu-command-example",children:"QEMU Command Example"}),"\n",(0,s.jsx)(n.p,{children:"For example, the following command runs QEMU:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# qemu-kvm (your options) \\\n\t-device pcie-root-port,bus=pcie.0,id=rp1 \\\n\t-device virtio-scsi-pci,bus=pcie.0,id=scsi0 \\\n\t-drive file=/dev/sdf,format=raw,if=none,id=zbc0 \\\n\t-device scsi-block,bus=scsi0.0,drive=zbc0\n"})}),"\n",(0,s.jsx)(n.h4,{id:"analysis-of-qemu-command",children:"Analysis of QEMU Command"}),"\n",(0,s.jsxs)(n.p,{children:["The first line, ",(0,s.jsx)(n.code,{children:"-device pcie-root-port,bus=pcie.0,id=rp1"}),", creates a PCIe root\ncomplex."]}),"\n",(0,s.jsxs)(n.p,{children:["The second line, ",(0,s.jsx)(n.code,{children:"-device virtio-scsi-pci,bus=pcie.0,id=scsi0"}),",\ndefines a virtio adapter that connects to the previously-defined PCIe bus."]}),"\n",(0,s.jsxs)(n.p,{children:["The last 2 lines, ",(0,s.jsx)(n.code,{children:"-drive file=/dev/sdf,format=raw,if=none,id=zbc0"}),"\nand ",(0,s.jsx)(n.code,{children:"-device scsi-block,bus=scsi0.0,drive=zbc0"}),", define the device that is\nconnected to the virtio SCSI adapter. In this example, ",(0,s.jsx)(n.code,{children:"-device scsi-block"})," is\nused, which means that the host device that will be attached is specified with\nthe device block device file (",(0,s.jsx)(n.code,{children:"/dev/sdf"}),")."]}),"\n",(0,s.jsxs)(n.p,{children:["See ",(0,s.jsx)("a",{href:"https://github.com/qemu/qemu/blob/master/docs/pcie_pci_bridge.txt",target:"_blank",children:"here"})," for a detailed description of these options."]}),"\n",(0,s.jsx)(n.h3,{id:"sense-data-in-qemu-prior-to-version-41",children:"Sense data in QEMU prior to Version 4.1"}),"\n",(0,s.jsx)(n.p,{children:"Although this method makes it possible to attach a zoned block disk to a QEMU\nguest, SCSI command sense data is not processed correctly in older QEMU\nversions (this includes all QEMU versions prior to version 4.1). This causes\nthe guest operating system to hang if the guest attempts to access command\nsense data (for example, after command failures). Because of older QEMU\nversions' inability to properly process SCSI command sense data, you should\navoid this attachment method with versions of QEMU older than version 4.1."}),"\n",(0,s.jsxs)(n.p,{children:['The "sense data problem" can be avoided with QEMU versions prior to version\n4.1 by attaching a zoned disk to a guest using the "device SG node file" as\na specifier. If you do this, you must use the option ',(0,s.jsx)(n.code,{children:"-device scsi-generic"}),".\nTo do this, change the command on the command line in the following way:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# qemu-kvm (your options) \\\n\t-device pcie-root-port,bus=pcie.0,id=rp1 \\\n\t-device virtio-scsi-pci,bus=pcie.0,id=scsi0 \\\n\t-drive file=/dev/sg5,format=raw,if=none,id=zbc0 \\\n\t-device scsi-generic,bus=scsi0.0,drive=zbc0\n"})}),"\n",(0,s.jsxs)(n.p,{children:["On the host, the correspondance between a block device file and its SG node file\ncan be discovered using the ",(0,s.jsx)(n.code,{children:"lsscsi"})," command."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# lsscsi -g\n...\n[10:0:1:0]   zbc     HGST     HSH721415AL42M0  a250  /dev/sdf   /dev/sg5\n...\n"})}),"\n",(0,s.jsxs)(n.p,{children:["After the guest operating system has been started, attachment of the host\ndevice can be checked with any of the methods shown in ",(0,s.jsx)(n.a,{href:"/docs/getting-started/smr-disk",children:"the SMR disk section of\nthe Getting Started Guide"}),".  For example, the\noutput of the ",(0,s.jsx)(n.code,{children:"lsscsi"})," command will be as follows with the above example setup."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# lsscsi -g\n[0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0\n[6:0:1:0]    zbc     HGST     HSH721415AL42M0  a250  /dev/sdb   /dev/sg1\n"})}),"\n",(0,s.jsx)(n.h2,{id:"qemu-vhost-scsi",children:(0,s.jsx)(n.em,{children:"QEMU vhost-scsi"})}),"\n",(0,s.jsx)(n.p,{children:"This attachment method uses a fabric module in the host kernel to provide KVM\nguests with a fast virtio-based connection to SCSI LUNs. This method cannot be\nused without QEMU KVM acceleration."}),"\n",(0,s.jsx)(n.h3,{id:"enabling-the-host-vhost-target-module",children:"Enabling the host vhost target module"}),"\n",(0,s.jsxs)(n.p,{children:["The host kernel configuration must have the ",(0,s.jsx)(n.em,{children:"CONFIG_VHOST_SCSI"})," option enabled.\nThis option is found in the top level ",(0,s.jsx)(n.em,{children:"Virtualization"})," menu of the kernel\nconfiguration."]}),"\n",(0,s.jsx)(i.c,{src:"linux-config-vhost.png",title:"vhost-scsi support option with make menuconfig"}),"\n",(0,s.jsxs)(n.p,{children:["To make it possible to attach physical disks as well as\n",(0,s.jsx)(n.a,{href:"/docs/tools/tcmu-runner",children:(0,s.jsx)(n.em,{children:"tcmu-runner"})}),"-emulated ZBC disks, you must enable\nthe kernel configuration option ",(0,s.jsx)(n.em,{children:"COFNGI_TCM_PSCSI"}),". This option can be found in\nthe menu ",(0,s.jsx)(n.em,{children:"Device Drivers"})," -> ",(0,s.jsx)(n.em,{children:"Generic Target Core Mod (TCM) and ConfigFS\nInfrastructure"}),"."]}),"\n",(0,s.jsx)(i.c,{src:"linux-config-pscsi.png",title:"pSCSI TCM support option with make menuconfig"}),"\n",(0,s.jsx)(n.h3,{id:"attaching-a-host-physical-disk",children:"Attaching a host physical disk"}),"\n",(0,s.jsxs)(n.p,{children:["To attach a zoned device to a virtual machine guest, you must first prepare a\nvirtual TCM SAS adapter, using the ",(0,s.jsx)(n.em,{children:"targetcli"})," tool. Specify the device to\nattach by using a block device file. The example below illustrates this\noperation for the disk ",(0,s.jsx)(n.code,{children:"/dev/sdf"}),":"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Use the targetcli Tool to Create a Device"})}),"\n",(0,s.jsxs)(n.p,{children:["Use ",(0,s.jsx)(n.em,{children:"targetcli"})," to create the device that you will attach."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# targetcli\ntargetcli shell version 2.1.fb49\nCopyright 2011-2013 by Datera, Inc and others.\nFor help on commands, type 'help'.\n\n/> cd backstores/pscsi\n/backstores/pscsi> create name=disk1 dev=/dev/sdf\nNote: block backstore recommended for SCSI block devices\nCreated pscsi storage object disk1 using /dev/sdf\n/backstores/pscsi> cd /vhost\n/vhost> create\nCreated target naa.5001405a160fe2e1.\nCreated TPG 1.\n/vhost/naa.5001405a160fe2e1> cd /vhost/naa.5001405a160fe2e1/tpg1/luns\n/vhost/naa.50...2e1/tpg1/luns> create /backstores/pscsi/disk1\nCreated LUN 0.\n/vhost/naa.50...2e1/tpg1/luns> cd /\n/> ls\no- / ..................................................................... [...]\n  o- backstores .......................................................... [...]\n  | o- block .............................................. [Storage Objects: 0]\n  | o- fileio ............................................. [Storage Objects: 0]\n  | o- pscsi .............................................. [Storage Objects: 1]\n  | | o- disk1 ............................................ [/dev/sdf activated]\n  | |   o- alua ............................................... [ALUA Groups: 0]\n  | o- ramdisk ............................................ [Storage Objects: 0]\n  | o- user:fbo ........................................... [Storage Objects: 0]\n  | o- user:rbd ........................................... [Storage Objects: 0]\n  | o- user:zbc ........................................... [Storage Objects: 0]\n  o- iscsi ........................................................ [Targets: 0]\n  o- loopback ..................................................... [Targets: 0]\n  o- vhost ........................................................ [Targets: 1]\n  o- naa.5001405a160fe2e1 ............................................ [TPGs: 1]\n      o- tpg1 .............................. [naa.500140565cd16730, no-gen-acls]\n        o- acls ...................................................... [ACLs: 0]\n        o- luns ...................................................... [LUNs: 1]\n          o- lun0 .............................. [pscsi/disk1 (/dev/sdf) (None)]\n/> exit\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Use qemu-kvm to Attach the Device"})}),"\n",(0,s.jsxs)(n.p,{children:["The World-Wide port name assigned by ",(0,s.jsx)(n.em,{children:"targetcli"})," can then be used to specify\nthe device to attach, using a qemu-kvm command on the command line:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# qemu-kvm (your options) \\\n       -device pcie-root-port,bus=pcie.0,id=rp1 \\\n       -device vhost-scsi-pci,wwpn=naa.5001405a160fe2e1,bus=pcie.0\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Confirm that the disk is visible to the Virtual Machine Guest OS"})}),"\n",(0,s.jsxs)(n.p,{children:["List the attached disk from the guest OS by using the ",(0,s.jsx)(n.em,{children:"lsscsi"})," command:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# lsscsi -g\n[0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0\n[6:0:1:0]    zbc     HGST     HSH721415AL42M0  a250  /dev/sdb   /dev/sg1\n"})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"attaching-an-emulated-zbc-disk",children:"Attaching an emulated ZBC disk"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"tcmu-runner"})," can be used to create emulated ZBC host-managed SCSI disks. The\nemulated disk that is created can be used locally on the host using the\nloopback fabric adapter, as explained in the ",(0,s.jsx)(n.a,{href:"/docs/tools/tcmu-runner#creating-an-emulated-disk",children:'"Creating an Emulated Disk"\nsection of the tcmu-runner page'}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["The emulated ZBC disk can be attached to a vhost virtual adapter for use within\na KVM guest operating system. This is done in a manner similar to the manner in\nwhich a physical device is attached. (See ",(0,s.jsx)(n.a,{href:"/docs/tools/qemu#attaching-a-host-physical-disk",children:'"Attaching a Host Physical\nDisk"'})," for the particulars of\nattaching a physical device)."]}),"\n",(0,s.jsx)(n.p,{children:"The following example illustrates this procedure, creating a small 20GB\nhost-managed SCSI disk with 256 MB zones including 10 conventional zones:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Use targetcli to Create a 20GB Host-managed SCSI Disk"})}),"\n",(0,s.jsx)(n.p,{children:"Run the following command to create a 20GB host-managed SCSI disk with\n256 MB zones (including 10 conventional zones):"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# targetcli\ntargetcli shell version 2.1.fb49\nCopyright 2011-2013 by Datera, Inc and others.\nFor help on commands, type 'help'.\n\n/> cd /backstores/user:zbc\n/backstores/user:zbc> create name=zbc0 size=20G cfgstring=model-HM/zsize-256/conv-10@/var/local/zbc0.raw\nCreated user-backed storage object zbc0 size 21474836480.\n/backstores/user:zbc> cd /vhost\n/vhost> create\nCreated target naa.5001405a0776dce3.\nCreated TPG 1.\n/vhost> /vhost/naa.5001405a0776dce3/tpg1/luns create /backstores/user:zbc/zbc0\nCreated LUN 0.\n/vhost> cd /\n/> ls\no- / ..................................................................... [...]\n  o- backstores .......................................................... [...]\n  | o- block .............................................. [Storage Objects: 0]\n  | o- fileio ............................................. [Storage Objects: 0]\n  | o- pscsi .............................................. [Storage Objects: 0]\n  | o- ramdisk ............................................ [Storage Objects: 0]\n  | o- user:fbo ........................................... [Storage Objects: 0]\n  | o- user:rbd ........................................... [Storage Objects: 0]\n  | o- user:zbc ........................................... [Storage Objects: 1]\n  | o- zbc0 [model-HM/zsize-256/conv-10@/var/local/zbc0.raw (20.0GiB) activated]\n  |     o- alua ............................................... [ALUA Groups: 1]\n  |       o- default_tg_pt_gp ................... [ALUA state: Active/optimized]\n  o- iscsi ........................................................ [Targets: 0]\n  o- loopback ..................................................... [Targets: 0]\n  o- v  host ...................................................... [Targets: 1]\n  o- naa.5001405a0776dce3 ............................................ [TPGs: 1]\n     o- tpg1 ............................... [naa.500140533e375d94, no-gen-acls]\n        o- acls ...................................................... [ACLs: 0]\n        o- luns ...................................................... [LUNs: 1]\n          o- lun0 ............................... [user/zbc0 (default_tg_pt_gp)]\n/> exit\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Start the Virtual Machine with qemu-kvm"})}),"\n",(0,s.jsxs)(n.p,{children:["Start the virtual machine with the emulated ZBC disk attached by using the\nWorld-Wide port name that was assigned by ",(0,s.jsx)(n.em,{children:"targetcli"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# qemu-kvm (your options) \\\n       -device pcie-root-port,bus=pcie.0,id=rp1 \\\n       -device vhost-scsi-pci,wwpn=naa.5001405a0776dce3,bus=pcie.0\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Confirm That the Disk is Visible to the Virtual Machine Guest OS"})}),"\n",(0,s.jsxs)(n.p,{children:["List the disk on the command line of the guest by using ",(0,s.jsx)(n.em,{children:"lsscsi"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# lsscsi -g\n[0:0:0:0]    disk    ATA      QEMU HARDDISK    2.5+  /dev/sda   /dev/sg0\n[6:0:1:0]    zbc     LIO-ORG  TCMU ZBC device  0002  /dev/sdb   /dev/sg1\n"})}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"qemu-nvme-zns-device-emulation",children:[(0,s.jsx)(n.em,{children:"QEMU"})," NVMe ZNS Device emulation"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/getting-started/zbd-emulation#nvme-zoned-namespace-device-emulation-with-qemu",children:"This article"}),"\ndescribes in detail how ",(0,s.jsx)(n.em,{children:"QEMU"})," can be configured to create an emulated NVMe ZNS\nnamespace that is visible to the guest operating system. Example commands and an\nexample shell script are provided as references."]})]})}function g(e={}){const{wrapper:n}={...(0,t.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},336:(e,n,A)=>{"use strict";A.d(n,{c:()=>t});A(1504);var s=A(7624);const t=function(e){let{src:n,title:t}=e;return(0,s.jsx)("div",{className:"container text--center",children:(0,s.jsxs)("figure",{children:[(0,s.jsx)("img",{src:A(4356)("./"+n).default,width:"640","max-width":"100%"}),(0,s.jsx)("figcaption",{children:(0,s.jsx)("em",{children:t})})]})})}},2124:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/intro-linux-zbd-f4ba5756b82ac441113bd7f9c9dd1dc6.png"},8036:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/intro-smr-tracks-2277a1473f60e1e862f8bb5916422533.png"},5868:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/intro-smr-zones-6296257d2459f5d1872bc28dcfa36ccd.png"},736:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/intro-zns-128e951b7035733479ad228844c9e7ab.png"},9852:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/intro-zone-append-890c07f2624fe7dcf7c5ee61fe2a6f0b.png"},1260:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/intro-zoned-storage-82ce755eb4ac58c0b289d5bcb8b8c361.png"},5188:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/intro-zonesize-vs-capacity-0f94861db037e13632def2968998b611.png"},6792:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-dm-9e8a3c8f8b9a480f921d7d263a9dc113.png"},8500:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-pscsi-e7c9db15cc4aebcf65fb21db3521a144.png"},2692:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-sched-70e55f9f3df2c81df464b476b1c4f636.png"},4244:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-tcm1-7684c969474b143f4f71318501623f6f.png"},8052:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-tcm2-6bbd5067f606b5e32db5520dea899278.png"},2696:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-vhost-21cc5561b882aa8097fb30aa35664908.png"},3709:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-zbd-2e5d1a6b239c372fbd3e44f5e3282ebe.png"},1868:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-config-zonefs-34a6f41797ebee8de18ee798e45eb6ea.png"},6552:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-dm-zoned-7f01ae74923ff02b8d01c92fef2d376d.png"},9949:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-iopath-3ad49009873f1211b8e873f9ba540a38.png"},3040:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/linux-versions-da4843f4c91f84aa8ef57f001bb6e8f1.png"},1508:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/percona-server-logo-93e864d0f923e386d855f6a8ea67fc8f.png"},8503:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/qemu-151192c8ad3d711f862c27b8b9e5bec4.png"},4020:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tests-zbc-hba-4a57d56fc6c4d400eadc1692b1907a27.png"},700:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tests-zbc-kernel-166564aae2e5ad8dc156175fbf8f2e85.png"},4560:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tools-libzbc-gzbc-5d6b525337b567661f392ef6d06ad83e.png"},2116:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tools-libzbc-9dc574a0bfec08d195e6e4179d6cd272.png"},8312:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tools-libzbd-gzbd-viewer-63527beb07ac767d890a1b9616c85add.png"},6288:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tools-libzbd-gzbd-3a358277b4b4b8a9ea5629ce574afad4.png"},511:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tools-tcmu-gzbc-11fb58818ee21d5116da8329d0d479af.png"},1448:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/tools-tcmu-dc8b8095c58f25df749406030dcc1b25.png"},464:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s="data:image/vnd.microsoft.icon;base64,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WP/47uz/0YFb/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9KDXf/9+fj/15V6/9GAWf/RgFnf0YBZ/9GAWf/RgFr/04hm/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/26OO//Xp5f/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//br6P/erJn/0YBZ/9GAWf/RgFn/0YBZ/9OIZf/9+/r/0oRf/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/ShWH/3amX/+vRyf/37er/2qGM/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/8+Tf/+G1pf/RgFn/0YBZ/9GAWf/RgFn/04hk//79/P/ShWH/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/dqZf/8d7Z//br5//t1c7/4LKi/9KEYP/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/y4dz/4bSk/9GAWf/RgFn/0YBZ/9GAWf/RgFn//fn4/9eWev/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/4riq//Xo5P/aoYz/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//Hf2v/cp5P/0YBZ/9GAWf/RgFnf0YBZ/9GAWf/26ub/4LCg/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/05+T/15V7/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/04hm/9KDXv/RgFn/0YBZ39GAWa7RgFn/0YBZ/+vQyP/s0cn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//Xp5v/UjW7/0YBZ/9GAWf/RgFn/0YBZ/9WPcv/htab/0oNf/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/+fHvP/58O3/2Jh//9GAWf/RgFmu0YBZb9GAWf/RgFn/3KaS//r08v/ShWH/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/5sO4/+3Wz//ShGH/0YBZ/9GAWf/RgVr/79rU////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"},3423:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/zs-logo-178d9855350307325549778e41354d29.png"},3048:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/medias/tools-libzbd-gzbd-viewer-example-b3b4ef97af02e55f8b536f5b1b3c32d0.mp4"},5936:(e,n,A)=>{"use strict";A.r(n),A.d(n,{default:()=>s});const s=A.p+"assets/images/zone-state-machine-de3050d6565c6840b72bd055dbe01f3b.svg"},4356:(e,n,A)=>{var s={"./intro-linux-zbd.png":2124,"./intro-smr-tracks.png":8036,"./intro-smr-zones.png":5868,"./intro-zns.png":736,"./intro-zone-append.png":9852,"./intro-zoned-storage.png":1260,"./intro-zonesize-vs-capacity.png":5188,"./linux-config-dm.png":6792,"./linux-config-pscsi.png":8500,"./linux-config-sched.png":2692,"./linux-config-tcm1.png":4244,"./linux-config-tcm2.png":8052,"./linux-config-vhost.png":2696,"./linux-config-zbd.png":3709,"./linux-config-zonefs.png":1868,"./linux-dm-zoned.png":6552,"./linux-iopath.png":9949,"./linux-versions.png":3040,"./percona-server-logo.png":1508,"./qemu.png":8503,"./tests-zbc-hba.png":4020,"./tests-zbc-kernel.png":700,"./tools-libzbc-gzbc.png":4560,"./tools-libzbc.png":2116,"./tools-libzbd-gzbd-viewer-example.mp4":3048,"./tools-libzbd-gzbd-viewer.png":8312,"./tools-libzbd-gzbd.png":6288,"./tools-tcmu-gzbc.png":511,"./tools-tcmu.png":1448,"./zone-state-machine.svg":5936,"./zs-logo.ico":464,"./zs-logo.png":3423};function t(e){var n=i(e);return A(n)}function i(e){if(!A.o(s,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return s[e]}t.keys=function(){return Object.keys(s)},t.resolve=i,e.exports=t,t.id=4356},4552:(e,n,A)=>{"use strict";A.d(n,{I:()=>c,M:()=>a});var s=A(1504);const t={},i=s.createContext(t);function a(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);