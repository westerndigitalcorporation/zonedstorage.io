"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[7086],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>k});var i=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},a=Object.keys(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=i.createContext({}),d=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=d(e.components);return i.createElement(l.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},c=i.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=d(n),c=o,k=p["".concat(l,".").concat(c)]||p[c]||m[c]||a;return n?i.createElement(k,r(r({ref:t},u),{},{components:n})):i.createElement(k,r({ref:t},u))}));function k(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,r=new Array(a);r[0]=c;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:o,r[1]=s;for(var d=2;d<a;d++)r[d]=n[d];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}c.displayName="MDXCreateElement"},2354:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>m,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var i=n(7462),o=(n(7294),n(3905));const a={id:"linux",title:"Setting-up a Zoned Storage Compatible Linux System",sidebar_label:"Setting-up a Zoned Storage Compatible Linux System"},r="Setting-up a Zoned Storage Compatible Linux System",s={unversionedId:"getting-started/linux",id:"getting-started/linux",title:"Setting-up a Zoned Storage Compatible Linux System",description:"Overview",source:"@site/docs/getting-started/linux.md",sourceDirName:"getting-started",slug:"/getting-started/linux",permalink:"/docs/getting-started/linux",draft:!1,tags:[],version:"current",frontMatter:{id:"linux",title:"Setting-up a Zoned Storage Compatible Linux System",sidebar_label:"Setting-up a Zoned Storage Compatible Linux System"},sidebar:"docs",previous:{title:"Linux Zoned Storage Ecosystem",permalink:"/docs/introduction/linux-ecosystem"},next:{title:"Getting started with Emulated Zoned Block Devices",permalink:"/docs/getting-started/zbd-emulation"}},l={},d=[{value:"Overview",id:"overview",level:2},{value:"Linux Distribution",id:"linux-distribution",level:2},{value:"Overview",id:"overview-1",level:3},{value:"Recommended Linux Distributions",id:"recommended-linux-distributions",level:2},{value:"Modifying a Linux Distribution Installation",id:"modifying-a-linux-distribution-installation",level:2},{value:"Checking the Kernel Version",id:"checking-the-kernel-version",level:3},{value:"Checking Zoned Block Device Support",id:"checking-zoned-block-device-support",level:3},{value:"Kernel Upgrade",id:"kernel-upgrade",level:3},{value:"Checking a System&#39;s Configuration",id:"checking-a-systems-configuration",level:2},{value:"Write Ordering Control",id:"write-ordering-control",level:3},{value:"System Utilities",id:"system-utilities",level:3},{value:"<em>lsblk</em> and <em>blkzone</em>",id:"lsblk-and-blkzone",level:4},{value:"lsscsi",id:"lsscsi",level:4},{value:"sg3_utils",id:"sg3_utils",level:4}],u={toc:d},p="wrapper";function m(e){let{components:t,...n}=e;return(0,o.kt)(p,(0,i.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"setting-up-a-zoned-storage-compatible-linux-system"},"Setting-up a Zoned Storage Compatible Linux System"),(0,o.kt)("h2",{id:"overview"},"Overview"),(0,o.kt)("p",null,"The first step in getting zoned storage working is setting up a Linux system\nthat is compatible with zoned storage. Such a system has the following\ncomponents:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"linux#linux-distribution"},"A compatible Linux distribution")," with the right\nkernel version"),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"linux#checking-a-systems-configuration"},"Support for zoned block devices")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"linux#system-utilities"},"Necessary system utilities"))),(0,o.kt)("p",null,"Follow the instructions on this page to set up a zoned-storage compatible\nsystem. Click on each of the links above in turn and follow the instructions\nto set up a Linux system for zoned storage."),(0,o.kt)("h2",{id:"linux-distribution"},"Linux Distribution"),(0,o.kt)("h3",{id:"overview-1"},"Overview"),(0,o.kt)("p",null,"The zoned block device (ZBD) interface that supports ",(0,o.kt)("a",{parentName:"p",href:"/docs/introduction/smr"},"SCSI ZBC and ATA ZAC\ndisks")," was added to the Linux","\xae"," kernel in version\n4.10. ",(0,o.kt)("a",{parentName:"p",href:"/docs/introduction/zns"},"NVMe zoned namespace (ZNS)")," devices are\nsupported from kernel version 5.9 (inclusive). All Linux kernel versions higher\nthan 5.9 support zoned storage devices."),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"Linux kernels prior to version 4.10 do not implement the zoned block device\ninterface. If you use a kernel older than kernel 4.10, you can access and\nmanage SCSI ZBC and ATA ZAC disks, but only in a limited way. This is discussed\nin more detail in the ",(0,o.kt)("a",{parentName:"p",href:"/docs/linux/overview"},"Linux Support")," document.")),(0,o.kt)("p",null,"To verify that a zoned block device has been discovered and correctly\ninitalized, several user utilities must be installed on the test system. These\nutilities are discussed in more detail in the section called ",(0,o.kt)("a",{parentName:"p",href:"linux#system-utilities"},"System\nUtilities"),"."),(0,o.kt)("p",null,"It is possible to configure, compile, and install your own kernel, but this is\nnot recommended for people without prior experience of kernel configuration. If\nthis is your first time setting up a zoned-storage-compatible Linux system, use\none of the ",(0,o.kt)("a",{parentName:"p",href:"linux#recommended-linux-distributions"},"recommended Linux\ndistributions"),"."),(0,o.kt)("p",null,"More advanced users might prefer ",(0,o.kt)("a",{parentName:"p",href:"linux#modifying-a-linux-distribution-installation"},"to modify their preferred system"),"\nby compiling a zoned-storage-compatible kernel and installing it from source,\nand then installing all necessary user packages."),(0,o.kt)("h2",{id:"recommended-linux-distributions"},"Recommended Linux Distributions"),(0,o.kt)("p",null,"Some Linux distributions provide zoned-storage support out of the box\n(without any modification). A regular installation of any of these\ndistributions provides a system that is ready to use with SMR hard disks\nand ZNS SSDs."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"../distributions/fedora"},"Fedora 36 or above"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"../distributions/opensuse"},"Latest openSUSE Tumbleweed")))),(0,o.kt)("p",null,'These distributions are "rolling release" Linux distributions. They provide the\nmost recent stable Linux kernel, they have zoned block device support enabled,\nand they have all the system user packages (e.g. ',(0,o.kt)("a",{parentName:"p",href:"../tools/util-linux"},"Linux system\nutilities"),") necessary to support zoned storage."),(0,o.kt)("p",null,"Installation instructions are available on the website of each distribution.\nThe installation of these distributions is beyond the scope of this Zoned\nStorage documentation."),(0,o.kt)("h2",{id:"modifying-a-linux-distribution-installation"},"Modifying a Linux Distribution Installation"),(0,o.kt)("p",null,"Linux systems that are not on the ",(0,o.kt)("a",{parentName:"p",href:"linux#recommended-distributions"},"Recommended\nDistributions")," list do not support zoned\nstorage by default, but some of them can be modified to provide some level of\nsupport for zoned storage. More information about the level of support provided\nby these Linux distributions can be found on\nthe ",(0,o.kt)("a",{parentName:"p",href:"/docs/distributions/overview"},"Linux Distributions page"),"."),(0,o.kt)("p",null,"If you know what you're doing, you can modify your preferred Linux distribution\nto enable or improve its support for zoned storage."),(0,o.kt)("p",null,"Two conditions must be met to ensure that a system's Linux kernel supports the\nzoned block device interface."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"The kernel version ",(0,o.kt)("a",{parentName:"p",href:"linux#checking-the-kernel-version"},"must be 4.10.0 or higher"),".")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"The kernel configuration option ",(0,o.kt)("a",{parentName:"p",href:"linux#checking-zoned-block-device-support"},(0,o.kt)("em",{parentName:"a"},"CONFIG_BLK_DEV_ZONED")," must be enabled"),"."))),(0,o.kt)("h3",{id:"checking-the-kernel-version"},"Checking the Kernel Version"),(0,o.kt)("p",null,"The command ",(0,o.kt)("inlineCode",{parentName:"p"},"uname")," makes it possible to check the version of the kernel running\non a system. For example, on a ",(0,o.kt)("em",{parentName:"p"},"Fedora 36")," distribution, this command and its\noutput is as follows."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-plaintext"},"# uname -r\n5.18.11-200.fc36.x86_64\n")),(0,o.kt)("p",null,"If the system kernel version is older than version 4.10, the kernel must\nbe upgraded to a more recent version to gain zoned block device support."),(0,o.kt)("h3",{id:"checking-zoned-block-device-support"},"Checking Zoned Block Device Support"),(0,o.kt)("p",null,"Zoned block device support might not be enabled by default in the running\nkernel. The kernel configuration option that is used to enable zoned block\ndevice support is ",(0,o.kt)("inlineCode",{parentName:"p"},"CONFIG_BLK_DEV_ZONED"),"."),(0,o.kt)("p",null,"Several methods can be used to determine whether the option\n",(0,o.kt)("inlineCode",{parentName:"p"},"CONFIG_BLK_DEV_ZONED")," has been enabled in the kernel. Not all of these\nmethods work for every Linux distribution. In some distributions, the\nconfiguration file for the running kernel can be found in the ",(0,o.kt)("inlineCode",{parentName:"p"},"/boot")," directory\nor in the directory containing the kernel modules."),(0,o.kt)("p",null,"The following commands test whether your installed kernel supports zoned block\ndevices."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-plaintext"},"# cat /boot/config-`uname -r` | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n")),(0,o.kt)("p",null,"or"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-plaintext"},"# cat /lib/modules/`uname -r`/config | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n")),(0,o.kt)("p",null,"If the output of one of these commands is ",(0,o.kt)("inlineCode",{parentName:"p"},"CONFIG_BLK_DEV_ZONED=y"),",\nthen zoned block devices are supported by the kernel. If the output is\n",(0,o.kt)("inlineCode",{parentName:"p"},"CONFIG_BLK_DEV_ZONED=n"),", then block device support is disabled and\nthe kernel must be recompiled in order to enable block device support."),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"For kernels older than kernel version 4.10, the output of these commands is\nalways empty. Kernels older than kernel version 4.10 do not support zoned block\ndevices.")),(0,o.kt)("p",null,"If your kernel exports its configuration through the ",(0,o.kt)("em",{parentName:"p"},"proc")," file system, use one\nof the following sets of commands to retreive the status of\n",(0,o.kt)("inlineCode",{parentName:"p"},"CONFIG_BLK_DEV_ZONED"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-plaintext"},"# modprobe configs\n# cat /proc/config.gz | gunzip | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n")),(0,o.kt)("p",null,"or"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-plaintext"},"# modprobe configs\n# zcat /proc/config.gz | grep CONFIG_BLK_DEV_ZONED\nCONFIG_BLK_DEV_ZONED=y\n")),(0,o.kt)("h3",{id:"kernel-upgrade"},"Kernel Upgrade"),(0,o.kt)("p",null,"If either the system kernel version is too old or if the kernel does not have\nzoned block device support, a new Linux kernel must be configured, compiled and\ninstalled to support zoned block devices."),(0,o.kt)("p",null,"Learn how to enable zoned block device support in the kernel configuration\n",(0,o.kt)("a",{parentName:"p",href:"/docs/linux/config"},"here"),". We recommend that you always use the\nhighest-available stable kernel version or a recent long-term-stable kernel\nversion higher than 4.10. Information on available long term and stable kernel\nversions can be found ",(0,o.kt)("a",{href:"https://www.kernel.org/",target:"_blank"},"here"),"."),(0,o.kt)("h2",{id:"checking-a-systems-configuration"},"Checking a System's Configuration"),(0,o.kt)("p",null,"A Linux system properly configured for zoned block device support has the\nfollowing:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"A kernel that supports zoned block devices"),(0,o.kt)("li",{parentName:"ol"},"Proper zoned device configuration "),(0,o.kt)("li",{parentName:"ol"},"(in some cases) System utliities that provide zoned block device information.")),(0,o.kt)("h3",{id:"write-ordering-control"},"Write Ordering Control"),(0,o.kt)("p",null,"By default, the Linux kernel does not guarantee the order in which commands are\ndelivered to a block device. This means that an application that writes\nsequentially to a disk might have its write commands delivered to the disk in a\ndifferent order than the order sent by the application. This might cause write\nerrors if the application is writing to sequential write required zones of a\nzoned device."),(0,o.kt)("p",null,'To avoid this problem, a "zone write lock mechanism" that serializes writes to\nsequential zones is implemented by all kernels that support zoned block devices.\nFor kernel versions between 4.10 and 4.15 (inclusive) no special configuration\nis necessary and the kernel guarantees the delivery of write commands to the\ndevice in the same order as the order of write requests issued by the\napplication.'),(0,o.kt)("p",null,"In kernel version 4.16, the implementation of zone write locking was moved to\nthe ",(0,o.kt)("em",{parentName:"p"},"deadline")," and ",(0,o.kt)("em",{parentName:"p"},"mq-deadline")," block I/O scheduler. Therefore, in kernels of\nversion 4.16 and higher, you must use this scheduler with zoned block devices\nin order to make the kernel guarantee the order of write commands."),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"The ",(0,o.kt)("em",{parentName:"p"},"mq-deadline")," block I/O scheduler is enabled only if the SCSI multi-queue\n(",(0,o.kt)("em",{parentName:"p"},"scsi-mq"),") infrastructure is enabled. This feature use can be controlled by\nusing the kernel boot argument ",(0,o.kt)("em",{parentName:"p"},"scsi_mod.use_blk_mq"),". ",(0,o.kt)("em",{parentName:"p"},"scsi-mq")," is always\nenabled by default since kernel version 5.0 and the legacy single-queue SCSI\ncommand path (",(0,o.kt)("em",{parentName:"p"},"deadline")," scheduler) is no longer supported.")),(0,o.kt)("p",null,"To see which block I/O scheduler a zoned disk uses, run the following command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-plaintext"},"# cat /sys/block/sdb/queue/scheduler\n[none] mq-deadline kyber bfq\n")),(0,o.kt)("p",null,"If the disk block I/O scheduler that has been selected is not\n",(0,o.kt)("em",{parentName:"p"},"mq-deadline")," as in the example above, use the following command to\nchange the scheduler:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-plaintext"},"# echo mq-deadline > /sys/block/sdb/queue/scheduler\n\n# cat sys/block/sdb/queue/scheduler\n[mq-deadline] kyber bfq none\n")),(0,o.kt)("h3",{id:"system-utilities"},"System Utilities"),(0,o.kt)("p",null,"Certain system utilities should be installed on the system in order to verify\nthe correct operation of zoned block devices and to troubleshoot problems."),(0,o.kt)("p",null,"If one of the ",(0,o.kt)("a",{parentName:"p",href:"linux#recommended-linux-distribution"},"recommended Linux\ndistributions")," is being used, these\nutilities are installed by default."),(0,o.kt)("h4",{id:"lsblk-and-blkzone"},(0,o.kt)("em",{parentName:"h4"},"lsblk")," and ",(0,o.kt)("em",{parentName:"h4"},"blkzone")),(0,o.kt)("p",null,"The ",(0,o.kt)("em",{parentName:"p"},"lsblk")," command in Linux lists block devices, which includes zoned block\ndevices. Some usage examples are provided in the ",(0,o.kt)("a",{parentName:"p",href:"../tools/util-linux#lsblk"},"lsblk section of the tools\ndocumentation page"),"."),(0,o.kt)("p",null,"The ",(0,o.kt)("em",{parentName:"p"},"blkzone")," utility lists (reports) the zones of a zoned block device and\nmakes it possible to reset the write pointer position of a range of zones in\nthe device. ",(0,o.kt)("em",{parentName:"p"},"blkzone")," also allows executing other zone management functions such\nas opening, closing and finishing a zone."),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"blkzone")," usage examples are provided in the ",(0,o.kt)("a",{parentName:"p",href:"../tools/util-linux#blkzone"},"blkzone section of the tools\ndocumentation page"),"."),(0,o.kt)("p",null,"Both ",(0,o.kt)("em",{parentName:"p"},"lsblk")," and ",(0,o.kt)("em",{parentName:"p"},"blkzone")," are part of the ",(0,o.kt)("em",{parentName:"p"},"util-linux")," package, which is\ninstalled by default on most Linux distributions. However, the zone block device\nsupport for these utilities (and so the existence of the ",(0,o.kt)("em",{parentName:"p"},"blkzone")," utility\nitself) depend on wether the Linux distribution used supports zoned block\ndevices. If the kernel was manually upgraded to enable zoned block device\nsupport, the ",(0,o.kt)("em",{parentName:"p"},"util-linux")," package must also be compiled and installed manually\nto match the zoned block device support of the new kernel."),(0,o.kt)("p",null,"Information on the ",(0,o.kt)("em",{parentName:"p"},"util-linux")," package can be found ",(0,o.kt)("a",{parentName:"p",href:"../tools/util-linux"},"here"),"."),(0,o.kt)("h4",{id:"lsscsi"},"lsscsi"),(0,o.kt)("p",null,"The ",(0,o.kt)("a",{href:"http://sg.danny.cz/scsi/lsscsi.html",target:"_blank"},(0,o.kt)("em",{parentName:"p"},"lsscsi")),"\ncommand lists information about the SCSI devices connected to a Linux system.\n",(0,o.kt)("em",{parentName:"p"},"lsscsi")," is generally available as a package in most Linux distributions.\nRefer to your distribution documentation to find the name of the package that\nprovides the ",(0,o.kt)("em",{parentName:"p"},"lsscsi")," utility."),(0,o.kt)("p",null,"The ",(0,o.kt)("a",{parentName:"p",href:"/docs/tools/sg3utils#lsscsi"},"SCSI Generic Utilities")," document provides more\ninformation and usage examples of ",(0,o.kt)("em",{parentName:"p"},"lssci"),"."),(0,o.kt)("h4",{id:"sg3_utils"},"sg3_utils"),(0,o.kt)("p",null,"The ",(0,o.kt)("a",{href:"http://sg.danny.cz/sg/sg3_utils.html",target:"_blank"},(0,o.kt)("em",{parentName:"p"},"sg3_utils"))," package is a collection of command line tools\nthat send SCSI commands to a SCSI device."),(0,o.kt)("p",null,"In Linux, all disks are exposed as SCSI disks. This includes ATA drives.\n",(0,o.kt)("em",{parentName:"p"},"sg3_utils")," can be used to manage SAS ZBC disks as well as SATA ZAC disks. When\ndealing with SATA disks connected to SATA ports (for example, an AHCI adapter),\nthe kernel ATA subsystem (libata) translates SCSI commands into ATA commands."),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"sg3_utils")," includes three command line tools specific to ZBC disks:"),(0,o.kt)("center",null,(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Utility Name"),(0,o.kt)("th",{parentName:"tr",align:"left"},"SCSI Command Invoked"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("strong",{parentName:"td"},"sg_rep_zones")),(0,o.kt)("td",{parentName:"tr",align:"left"},"REPORT ZONES"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Get the ZBC disk's zone information")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("strong",{parentName:"td"},"sg_reset_wp")),(0,o.kt)("td",{parentName:"tr",align:"left"},"RESET WRITE POINTER"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Reset one zone or all zones of the ZBC disk")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("strong",{parentName:"td"},"sg_zone")),(0,o.kt)("td",{parentName:"tr",align:"left"},"CLOSE ZONE, FINISH ZONE, OPEN ZONE"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Sends one of these commands to the given ZBC disk"))))),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/tools/sg3utils#sg3_utils"},"This section")," shows some examples of these\nutilities execution."))}m.isMDXComponent=!0}}]);