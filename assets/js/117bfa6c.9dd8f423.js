"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[1732],{8876:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>a});var s=i(7624),t=i(4552);const o={id:"linux",title:"Setting-up a Zoned Storage Compatible Linux System",sidebar_label:"Setting-up a Zoned Storage Compatible Linux System"},l="Setting-up a Zoned Storage Compatible Linux System",r={id:"getting-started/linux",title:"Setting-up a Zoned Storage Compatible Linux System",description:"Overview",source:"@site/docs/getting-started/linux.md",sourceDirName:"getting-started",slug:"/getting-started/linux",permalink:"/docs/getting-started/linux",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"linux",title:"Setting-up a Zoned Storage Compatible Linux System",sidebar_label:"Setting-up a Zoned Storage Compatible Linux System"},sidebar:"docs",previous:{title:"Linux Zoned Storage Ecosystem",permalink:"/docs/introduction/linux-ecosystem"},next:{title:"Getting started with Emulated Zoned Block Devices",permalink:"/docs/getting-started/zbd-emulation"}},d={},a=[{value:"Overview",id:"overview",level:2},{value:"Linux Distribution",id:"linux-distribution",level:2},{value:"Overview",id:"overview-1",level:3},{value:"Recommended Linux Distributions",id:"recommended-linux-distributions",level:2},{value:"Modifying a Linux Distribution Installation",id:"modifying-a-linux-distribution-installation",level:2},{value:"Checking the Kernel Version",id:"checking-the-kernel-version",level:3},{value:"Checking Zoned Block Device Support",id:"checking-zoned-block-device-support",level:3},{value:"Kernel Upgrade",id:"kernel-upgrade",level:3},{value:"Checking a System&#39;s Configuration",id:"checking-a-systems-configuration",level:2},{value:"Write Ordering Control",id:"write-ordering-control",level:3},{value:"System Utilities",id:"system-utilities",level:3},{value:"<em>lsblk</em> and <em>blkzone</em>",id:"lsblk-and-blkzone",level:4},{value:"lsscsi",id:"lsscsi",level:4},{value:"sg3_utils",id:"sg3_utils",level:4}];function c(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"setting-up-a-zoned-storage-compatible-linux-system",children:"Setting-up a Zoned Storage Compatible Linux System"}),"\n",(0,s.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,s.jsx)(n.p,{children:"The first step in getting zoned storage working is setting up a Linux system\nthat is compatible with zoned storage. Such a system has the following\ncomponents:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"linux#linux-distribution",children:"A compatible Linux distribution"})," with the right\nkernel version"]}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"linux#checking-a-systems-configuration",children:"Support for zoned block devices"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"linux#system-utilities",children:"Necessary system utilities"})}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Follow the instructions on this page to set up a zoned-storage compatible\nsystem. Click on each of the links above in turn and follow the instructions\nto set up a Linux system for zoned storage."}),"\n",(0,s.jsx)(n.h2,{id:"linux-distribution",children:"Linux Distribution"}),"\n",(0,s.jsx)(n.h3,{id:"overview-1",children:"Overview"}),"\n",(0,s.jsxs)(n.p,{children:["The zoned block device (ZBD) interface that supports ",(0,s.jsx)(n.a,{href:"/docs/introduction/smr",children:"SCSI ZBC and ATA ZAC\ndisks"})," was added to the Linux\xae kernel in version\n4.10. ",(0,s.jsx)(n.a,{href:"/docs/introduction/zns",children:"NVMe zoned namespace (ZNS)"})," devices are\nsupported from kernel version 5.9 (inclusive). All Linux kernel versions higher\nthan 5.9 support zoned storage devices."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["Linux kernels prior to version 4.10 do not implement the zoned block device\ninterface. If you use a kernel older than kernel 4.10, you can access and\nmanage SCSI ZBC and ATA ZAC disks, but only in a limited way. This is discussed\nin more detail in the ",(0,s.jsx)(n.a,{href:"/docs/linux/overview",children:"Linux Support"})," document."]})}),"\n",(0,s.jsxs)(n.p,{children:["To verify that a zoned block device has been discovered and correctly\ninitalized, several user utilities must be installed on the test system. These\nutilities are discussed in more detail in the section called ",(0,s.jsx)(n.a,{href:"linux#system-utilities",children:"System\nUtilities"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["It is possible to configure, compile, and install your own kernel, but this is\nnot recommended for people without prior experience of kernel configuration. If\nthis is your first time setting up a zoned-storage-compatible Linux system, use\none of the ",(0,s.jsx)(n.a,{href:"linux#recommended-linux-distributions",children:"recommended Linux\ndistributions"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["More advanced users might prefer ",(0,s.jsx)(n.a,{href:"linux#modifying-a-linux-distribution-installation",children:"to modify their preferred system"}),"\nby compiling a zoned-storage-compatible kernel and installing it from source,\nand then installing all necessary user packages."]}),"\n",(0,s.jsx)(n.h2,{id:"recommended-linux-distributions",children:"Recommended Linux Distributions"}),"\n",(0,s.jsx)(n.p,{children:"Some Linux distributions provide zoned-storage support out of the box\n(without any modification). A regular installation of any of these\ndistributions provides a system that is ready to use with SMR hard disks\nand ZNS SSDs."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/fedora",children:"Fedora 36 or above"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/opensuse",children:"Latest openSUSE Tumbleweed"})}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:['These distributions are "rolling release" Linux distributions. They provide the\nmost recent stable Linux kernel, they have zoned block device support enabled,\nand they have all the system user packages (e.g. ',(0,s.jsx)(n.a,{href:"/docs/tools/util-linux",children:"Linux system\nutilities"}),") necessary to support zoned storage."]}),"\n",(0,s.jsx)(n.p,{children:"Installation instructions are available on the website of each distribution.\nThe installation of these distributions is beyond the scope of this Zoned\nStorage documentation."}),"\n",(0,s.jsx)(n.h2,{id:"modifying-a-linux-distribution-installation",children:"Modifying a Linux Distribution Installation"}),"\n",(0,s.jsxs)(n.p,{children:["Linux systems that are not on the ",(0,s.jsx)(n.a,{href:"linux#recommended-linux-distributions",children:"Recommended\nDistributions"})," list do not support zoned\nstorage by default, but some of them can be modified to provide some level of\nsupport for zoned storage. More information about the level of support provided\nby these Linux distributions can be found on\nthe ",(0,s.jsx)(n.a,{href:"/docs/distributions/overview",children:"Linux Distributions page"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"If you know what you're doing, you can modify your preferred Linux distribution\nto enable or improve its support for zoned storage."}),"\n",(0,s.jsx)(n.p,{children:"Two conditions must be met to ensure that a system's Linux kernel supports the\nzoned block device interface."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The kernel version ",(0,s.jsx)(n.a,{href:"linux#checking-the-kernel-version",children:"must be 4.10.0 or higher"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The kernel configuration option ",(0,s.jsxs)(n.a,{href:"linux#checking-zoned-block-device-support",children:[(0,s.jsx)(n.em,{children:"CONFIG_BLK_DEV_ZONED"})," must be enabled"]}),"."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"checking-the-kernel-version",children:"Checking the Kernel Version"}),"\n",(0,s.jsxs)(n.p,{children:["The command ",(0,s.jsx)(n.code,{children:"uname"})," makes it possible to check the version of the kernel running\non a system. For example, on a ",(0,s.jsx)(n.em,{children:"Fedora 36"})," distribution, this command and its\noutput is as follows."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# uname -r\n5.18.11-200.fc36.x86_64\n"})}),"\n",(0,s.jsx)(n.p,{children:"If the system kernel version is older than version 4.10, the kernel must\nbe upgraded to a more recent version to gain zoned block device support."}),"\n",(0,s.jsx)(n.h3,{id:"checking-zoned-block-device-support",children:"Checking Zoned Block Device Support"}),"\n",(0,s.jsxs)(n.p,{children:["Zoned block device support might not be enabled by default in the running\nkernel. The kernel configuration option that is used to enable zoned block\ndevice support is ",(0,s.jsx)(n.code,{children:"CONFIG_BLK_DEV_ZONED"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["Several methods can be used to determine whether the option\n",(0,s.jsx)(n.code,{children:"CONFIG_BLK_DEV_ZONED"})," has been enabled in the kernel. Not all of these\nmethods work for every Linux distribution. In some distributions, the\nconfiguration file for the running kernel can be found in the ",(0,s.jsx)(n.code,{children:"/boot"})," directory\nor in the directory containing the kernel modules."]}),"\n",(0,s.jsx)(n.p,{children:"The following commands test whether your installed kernel supports zoned block\ndevices."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# cat /boot/config-`uname -r` | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n"})}),"\n",(0,s.jsx)(n.p,{children:"or"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# cat /lib/modules/`uname -r`/config | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n"})}),"\n",(0,s.jsxs)(n.p,{children:["If the output of one of these commands is ",(0,s.jsx)(n.code,{children:"CONFIG_BLK_DEV_ZONED=y"}),",\nthen zoned block devices are supported by the kernel. If the output is\n",(0,s.jsx)(n.code,{children:"CONFIG_BLK_DEV_ZONED=n"}),", then block device support is disabled and\nthe kernel must be recompiled in order to enable block device support."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"For kernels older than kernel version 4.10, the output of these commands is\nalways empty. Kernels older than kernel version 4.10 do not support zoned block\ndevices."})}),"\n",(0,s.jsxs)(n.p,{children:["If your kernel exports its configuration through the ",(0,s.jsx)(n.em,{children:"proc"})," file system, use one\nof the following sets of commands to retreive the status of\n",(0,s.jsx)(n.code,{children:"CONFIG_BLK_DEV_ZONED"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# modprobe configs\n# cat /proc/config.gz | gunzip | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n"})}),"\n",(0,s.jsx)(n.p,{children:"or"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# modprobe configs\n# zcat /proc/config.gz | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n"})}),"\n",(0,s.jsx)(n.h3,{id:"kernel-upgrade",children:"Kernel Upgrade"}),"\n",(0,s.jsx)(n.p,{children:"If either the system kernel version is too old or if the kernel does not have\nzoned block device support, a new Linux kernel must be configured, compiled and\ninstalled to support zoned block devices."}),"\n",(0,s.jsxs)(n.p,{children:["Learn how to enable zoned block device support in the kernel configuration\n",(0,s.jsx)(n.a,{href:"/docs/linux/config",children:"here"}),". We recommend that you always use the\nhighest-available stable kernel version or a recent long-term-stable kernel\nversion higher than 4.10. Information on available long term and stable kernel\nversions can be found ",(0,s.jsx)("a",{href:"https://www.kernel.org/",target:"_blank",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"checking-a-systems-configuration",children:"Checking a System's Configuration"}),"\n",(0,s.jsx)(n.p,{children:"A Linux system properly configured for zoned block device support has the\nfollowing:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"A kernel that supports zoned block devices"}),"\n",(0,s.jsx)(n.li,{children:"Proper zoned device configuration"}),"\n",(0,s.jsx)(n.li,{children:"(in some cases) System utliities that provide zoned block device information."}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"write-ordering-control",children:"Write Ordering Control"}),"\n",(0,s.jsx)(n.p,{children:"By default, the Linux kernel does not guarantee the order in which commands are\ndelivered to a block device. This means that an application that writes\nsequentially to a disk might have its write commands delivered to the disk in a\ndifferent order than the order sent by the application. This might cause write\nerrors if the application is writing to sequential write required zones of a\nzoned device."}),"\n",(0,s.jsx)(n.p,{children:'To avoid this problem, a "zone write lock mechanism" that serializes writes to\nsequential zones is implemented by all kernels that support zoned block devices.\nFor kernel versions between 4.10 and 4.15 (inclusive) no special configuration\nis necessary and the kernel guarantees the delivery of write commands to the\ndevice in the same order as the order of write requests issued by the\napplication.'}),"\n",(0,s.jsxs)(n.p,{children:["In kernel version 4.16, the implementation of zone write locking was moved to\nthe ",(0,s.jsx)(n.em,{children:"deadline"})," and ",(0,s.jsx)(n.em,{children:"mq-deadline"})," block I/O scheduler. Therefore, in kernels of\nversion 4.16 and higher, you must use this scheduler with zoned block devices\nin order to make the kernel guarantee the order of write commands."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.em,{children:"mq-deadline"})," block I/O scheduler is enabled only if the SCSI multi-queue\n(",(0,s.jsx)(n.em,{children:"scsi-mq"}),") infrastructure is enabled. This feature use can be controlled by\nusing the kernel boot argument ",(0,s.jsx)(n.em,{children:"scsi_mod.use_blk_mq"}),". ",(0,s.jsx)(n.em,{children:"scsi-mq"})," is always\nenabled by default since kernel version 5.0 and the legacy single-queue SCSI\ncommand path (",(0,s.jsx)(n.em,{children:"deadline"})," scheduler) is no longer supported."]})}),"\n",(0,s.jsx)(n.p,{children:"To see which block I/O scheduler a zoned disk uses, run the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# cat /sys/block/sdb/queue/scheduler\n[none] mq-deadline kyber bfq\n"})}),"\n",(0,s.jsxs)(n.p,{children:["If the disk block I/O scheduler that has been selected is not\n",(0,s.jsx)(n.em,{children:"mq-deadline"})," as in the example above, use the following command to\nchange the scheduler:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# echo mq-deadline > /sys/block/sdb/queue/scheduler\n\n# cat sys/block/sdb/queue/scheduler\n[mq-deadline] kyber bfq none\n"})}),"\n",(0,s.jsx)(n.h3,{id:"system-utilities",children:"System Utilities"}),"\n",(0,s.jsx)(n.p,{children:"Certain system utilities should be installed on the system in order to verify\nthe correct operation of zoned block devices and to troubleshoot problems."}),"\n",(0,s.jsxs)(n.p,{children:["If one of the ",(0,s.jsx)(n.a,{href:"linux#recommended-linux-distributions",children:"recommended Linux\ndistributions"})," is being used, these\nutilities are installed by default."]}),"\n",(0,s.jsxs)(n.h4,{id:"lsblk-and-blkzone",children:[(0,s.jsx)(n.em,{children:"lsblk"})," and ",(0,s.jsx)(n.em,{children:"blkzone"})]}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.em,{children:"lsblk"})," command in Linux lists block devices, which includes zoned block\ndevices. Some usage examples are provided in the ",(0,s.jsx)(n.a,{href:"/docs/tools/util-linux#lsblk",children:"lsblk section of the tools\ndocumentation page"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.em,{children:"blkzone"})," utility lists (reports) the zones of a zoned block device and\nmakes it possible to reset the write pointer position of a range of zones in\nthe device. ",(0,s.jsx)(n.em,{children:"blkzone"})," also allows executing other zone management functions such\nas opening, closing and finishing a zone."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"blkzone"})," usage examples are provided in the ",(0,s.jsx)(n.a,{href:"/docs/tools/util-linux#blkzone",children:"blkzone section of the tools\ndocumentation page"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["Both ",(0,s.jsx)(n.em,{children:"lsblk"})," and ",(0,s.jsx)(n.em,{children:"blkzone"})," are part of the ",(0,s.jsx)(n.em,{children:"util-linux"})," package, which is\ninstalled by default on most Linux distributions. However, the zone block device\nsupport for these utilities (and so the existence of the ",(0,s.jsx)(n.em,{children:"blkzone"})," utility\nitself) depend on wether the Linux distribution used supports zoned block\ndevices. If the kernel was manually upgraded to enable zoned block device\nsupport, the ",(0,s.jsx)(n.em,{children:"util-linux"})," package must also be compiled and installed manually\nto match the zoned block device support of the new kernel."]}),"\n",(0,s.jsxs)(n.p,{children:["Information on the ",(0,s.jsx)(n.em,{children:"util-linux"})," package can be found ",(0,s.jsx)(n.a,{href:"/docs/tools/util-linux",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h4,{id:"lsscsi",children:"lsscsi"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)("a",{href:"http://sg.danny.cz/scsi/lsscsi.html",target:"_blank",children:(0,s.jsx)(n.em,{children:"lsscsi"})}),"\ncommand lists information about the SCSI devices connected to a Linux system.\n",(0,s.jsx)(n.em,{children:"lsscsi"})," is generally available as a package in most Linux distributions.\nRefer to your distribution documentation to find the name of the package that\nprovides the ",(0,s.jsx)(n.em,{children:"lsscsi"})," utility."]}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"/docs/tools/sg3utils#lsscsi",children:"SCSI Generic Utilities"})," document provides more\ninformation and usage examples of ",(0,s.jsx)(n.em,{children:"lssci"}),"."]}),"\n",(0,s.jsx)(n.h4,{id:"sg3_utils",children:"sg3_utils"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)("a",{href:"http://sg.danny.cz/sg/sg3_utils.html",target:"_blank",children:(0,s.jsx)(n.em,{children:"sg3_utils"})})," package is a collection of command line tools\nthat send SCSI commands to a SCSI device."]}),"\n",(0,s.jsxs)(n.p,{children:["In Linux, all disks are exposed as SCSI disks. This includes ATA drives.\n",(0,s.jsx)(n.em,{children:"sg3_utils"})," can be used to manage SAS ZBC disks as well as SATA ZAC disks. When\ndealing with SATA disks connected to SATA ports (for example, an AHCI adapter),\nthe kernel ATA subsystem (libata) translates SCSI commands into ATA commands."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"sg3_utils"})," includes three command line tools specific to ZBC disks:"]}),"\n",(0,s.jsx)("center",{children:(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{style:{textAlign:"left"},children:"Utility Name"}),(0,s.jsx)(n.th,{style:{textAlign:"left"},children:"SCSI Command Invoked"}),(0,s.jsx)(n.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"left"},children:(0,s.jsx)(n.strong,{children:"sg_rep_zones"})}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"REPORT ZONES"}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"Get the ZBC disk's zone information"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"left"},children:(0,s.jsx)(n.strong,{children:"sg_reset_wp"})}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"RESET WRITE POINTER"}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"Reset one zone or all zones of the ZBC disk"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"left"},children:(0,s.jsx)(n.strong,{children:"sg_zone"})}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"CLOSE ZONE, FINISH ZONE, OPEN ZONE"}),(0,s.jsx)(n.td,{style:{textAlign:"left"},children:"Sends one of these commands to the given ZBC disk"})]})]})]})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/tools/sg3utils#sg3_utils",children:"This section"})," shows some examples of these\nutilities execution."]})]})}function h(e={}){const{wrapper:n}={...(0,t.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},4552:(e,n,i)=>{i.d(n,{I:()=>r,M:()=>l});var s=i(1504);const t={},o=s.createContext(t);function l(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);