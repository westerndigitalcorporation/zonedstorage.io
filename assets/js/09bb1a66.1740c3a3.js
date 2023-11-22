(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[5319],{7709:(e,A,n)=>{"use strict";n.r(A),n.d(A,{assets:()=>d,contentTitle:()=>r,default:()=>f,frontMatter:()=>o,metadata:()=>l,toc:()=>a});var s=n(5893),i=n(1151),t=n(72);const o={id:"config",title:"Kernel Configuration",sidebar_label:"Kernel Configuration"},r="Kernel Configuration",l={id:"linux/config",title:"Kernel Configuration",description:"Several kernel compilation configuration options control zoned block device",source:"@site/docs/linux/config.md",sourceDirName:"linux",slug:"/linux/config",permalink:"/docs/linux/config",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"config",title:"Kernel Configuration",sidebar_label:"Kernel Configuration"},sidebar:"docs",previous:{title:"Linux Kernel Zoned Storage Support",permalink:"/docs/linux/overview"},next:{title:"Zoned Block Device User Interface",permalink:"/docs/linux/zbd-api"}},d={},a=[{value:"Block Layer",id:"block-layer",level:2},{value:"Zoned Block Devices Core Support",id:"zoned-block-devices-core-support",level:3},{value:"Write Ordering Control",id:"write-ordering-control",level:2},{value:"Device Drivers Configuration",id:"device-drivers-configuration",level:2},{value:"<em>null_blk</em> Logical Device",id:"null_blk-logical-device",level:3},{value:"ZBC and ZAC Hard-Disks Support",id:"zbc-and-zac-hard-disks-support",level:3},{value:"NVMe Zoned Namespace Solid State Disks Support",id:"nvme-zoned-namespace-solid-state-disks-support",level:3},{value:"Device Mapper",id:"device-mapper",level:2},{value:"File Systems",id:"file-systems",level:2},{value:"<em>f2fs</em>",id:"f2fs",level:3},{value:"<em>zonefs</em>",id:"zonefs",level:3},{value:"Kernel Compilation",id:"kernel-compilation",level:2},{value:"Kernel Installation",id:"kernel-installation",level:2}];function c(e){const A={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(A.h1,{id:"kernel-configuration",children:"Kernel Configuration"}),"\n",(0,s.jsx)(A.p,{children:"Several kernel compilation configuration options control zoned block device\nsupport features."}),"\n",(0,s.jsx)(A.h2,{id:"block-layer",children:"Block Layer"}),"\n",(0,s.jsx)(A.h3,{id:"zoned-block-devices-core-support",children:"Zoned Block Devices Core Support"}),"\n",(0,s.jsxs)(A.p,{children:["To allow supported zoned block devices to be exposed as block device files,\nenable the block-layer configuration option ",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"}),". This option\nis part of the ",(0,s.jsx)(A.em,{children:"Enable the block layer"})," top menu of ",(0,s.jsx)(A.code,{children:"make menuconfig"}),"."]}),"\n",(0,s.jsx)(t.Z,{src:"linux-config-zbd.png",titel:"Block layer zoned block device support option with make menuconfig"}),"\n",(0,s.jsx)(A.p,{children:"Setting this configuration option gives users access to the ZBD interface. If\nthis configuration option is not set, users do not have access to the ZBD\ninterface and support for zoned block devices is disabled in all kernel\nsubsystems that include support for these devices (this includes I/O schedulers,\ndevice mappers, and file systems)."}),"\n",(0,s.jsx)(A.h2,{id:"write-ordering-control",children:"Write Ordering Control"}),"\n",(0,s.jsxs)(A.p,{children:["Write ordering control is achieved through the ",(0,s.jsx)(A.em,{children:"deadline"})," (legacy single queue\nblock I/O path) and ",(0,s.jsx)(A.em,{children:"mq-deadline"})," (multi-queue block I/O path) block I/O\nscheduler (see ",(0,s.jsx)(A.a,{href:"/docs/linux/sched",children:"Write Ordering Control"}),"). ",(0,s.jsx)(A.em,{children:"deadline"})," and\n",(0,s.jsx)(A.em,{children:"mq-deadline"})," zoned block device support is automatically enabled if the\n",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"})," configuration option is set."]}),"\n",(0,s.jsxs)(A.p,{children:["It is mandatory to enable this scheduler for zoned block devices. The\nconfiguration option ",(0,s.jsx)(A.code,{children:"CONFIG_MQ_IOSCHED_DEADLINE"})," enables the ",(0,s.jsx)(A.em,{children:"mq-deadline"}),"\nscheduler. The configuration option ",(0,s.jsx)(A.code,{children:"CONFIG_IOSCHED_DEADLINE"})," enables the\n",(0,s.jsx)(A.em,{children:"deadline"})," scheduler. Both options can be selected from the ",(0,s.jsx)(A.em,{children:"IO Schedulers"})," top\nmenu."]}),"\n",(0,s.jsx)(t.Z,{src:"linux-config-sched.png",title:"I/O scheduler configuration with make menuconfig"}),"\n",(0,s.jsxs)(A.p,{children:["As of kernel version 5.0, support for the legacy block-layer single-queue I/O\npath has been removed. Only the ",(0,s.jsx)(A.em,{children:"mq-deadline"})," scheduler remains. As of kernel\nversion 5.2, ",(0,s.jsx)(A.code,{children:"CONFIG_MQ_IOSCHED_DEADLINE"})," is automatically selected when the\n",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"})," configuration option is set."]}),"\n",(0,s.jsx)(A.h2,{id:"device-drivers-configuration",children:"Device Drivers Configuration"}),"\n",(0,s.jsxs)(A.h3,{id:"null_blk-logical-device",children:[(0,s.jsx)(A.em,{children:"null_blk"})," Logical Device"]}),"\n",(0,s.jsxs)(A.p,{children:["The ",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"})," configuration option automatically enables support\nfor zoned block device emulation that uses the ",(0,s.jsx)(A.em,{children:"null_blk"})," device driver."]}),"\n",(0,s.jsx)(A.h3,{id:"zbc-and-zac-hard-disks-support",children:"ZBC and ZAC Hard-Disks Support"}),"\n",(0,s.jsxs)(A.p,{children:["SCSI subsystem support for ZBC and ZAC SMR disks is automatically enabled with\nthe ",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"})," configuration option."]}),"\n",(0,s.jsx)(A.h3,{id:"nvme-zoned-namespace-solid-state-disks-support",children:"NVMe Zoned Namespace Solid State Disks Support"}),"\n",(0,s.jsxs)(A.p,{children:["The NVM Express Zoned Namespace Command Set depends on ",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"}),"\nand ",(0,s.jsx)(A.code,{children:"CONFIG_NVME_CORE"}),". It is automatically built if both of these configuration\noptions are enabled."]}),"\n",(0,s.jsxs)(A.p,{children:["This driver requires the device to support the Zone Append command to\nsuccessfully bind to a zoned namespace. It does not support Zone Excursions.\nSee ",(0,s.jsx)(A.a,{href:"/docs/introduction/zns",children:"Zoned Namespace (ZNS) SSDs"})," for more details about\nthese features."]}),"\n",(0,s.jsx)(A.h2,{id:"device-mapper",children:"Device Mapper"}),"\n",(0,s.jsxs)(A.p,{children:["Zoned block device support for the device mapper subsystem is automatically\nenabled when the ",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"})," option is set. This enables support for\n",(0,s.jsx)(A.em,{children:"dm-linear"})," and ",(0,s.jsx)(A.em,{children:"dm-flakey"})," targets. Note that the ",(0,s.jsx)(A.em,{children:"dm-zoned"})," device mapper\ntarget must be enabled to be usable."]}),"\n",(0,s.jsxs)(A.p,{children:["Enable the ",(0,s.jsx)(A.em,{children:"dm-zoned"})," target by selecting the ",(0,s.jsx)(A.code,{children:"CONFIG_DM_ZONED"})," option from the\nmenu ",(0,s.jsx)(A.em,{children:"Device Drivers --\x3e Multiple devices driver support (RAID and LVM) --\x3e\nDevice mapper support --\x3e Drive-managed zoned block device target support"}),"."]}),"\n",(0,s.jsx)(t.Z,{src:"linux-config-dm.png",title:"dm-zoned device mapper target configuration with make menuconfig"}),"\n",(0,s.jsx)(A.h2,{id:"file-systems",children:"File Systems"}),"\n",(0,s.jsx)(A.h3,{id:"f2fs",children:(0,s.jsx)(A.em,{children:"f2fs"})}),"\n",(0,s.jsxs)(A.p,{children:["Support for zoned block devices in the ",(0,s.jsxs)(A.a,{href:"/docs/linux/fs#f2fs",children:[(0,s.jsx)(A.em,{children:"f2fs"})," file system"]}),"\nis automatically enabled with the ",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"})," configuration option."]}),"\n",(0,s.jsx)(A.h3,{id:"zonefs",children:(0,s.jsx)(A.em,{children:"zonefs"})}),"\n",(0,s.jsxs)(A.p,{children:["Enable compilation of the ",(0,s.jsx)(A.em,{children:"zonefs"})," file system by selecting the\n",(0,s.jsx)(A.code,{children:"CONFIG_ZONEFS_FS"})," option from the menu ",(0,s.jsx)(A.em,{children:"File systems -> zonefs filesystem\nsupport"}),". This option is available only if the ",(0,s.jsx)(A.code,{children:"CONFIG_BLK_DEV_ZONED"})," option is\nset to enable zoned block device support."]}),"\n",(0,s.jsx)(t.Z,{src:"linux-config-zonefs.png",title:"zonefs filesystem configuration with make menuconfig"}),"\n",(0,s.jsx)(A.h2,{id:"kernel-compilation",children:"Kernel Compilation"}),"\n",(0,s.jsx)(A.p,{children:"The kernel compilation process is the same regardless of whether the kernel has\nbeen configured to enable zoned block device support. When the kernel has been\nconfigured to enable zoned block device support, the following commands will\nbuild the kernel."}),"\n",(0,s.jsx)(A.pre,{children:(0,s.jsx)(A.code,{className:"language-bash",children:"$ make all\n"})}),"\n",(0,s.jsxs)(A.p,{children:["The kernel build infrastructure also allows you to build ",(0,s.jsx)(A.em,{children:".rpm"})," or ",(0,s.jsx)(A.em,{children:"i.deb"}),"\npackages. To build RPM packages, use the following command."]}),"\n",(0,s.jsx)(A.pre,{children:(0,s.jsx)(A.code,{className:"language-bash",children:"$ make rpm-pkg\n"})}),"\n",(0,s.jsx)(A.h2,{id:"kernel-installation",children:"Kernel Installation"}),"\n",(0,s.jsx)(A.p,{children:"The procedure for installing a zoned-block-device-enabled kernel is the same as\nthe procedure for installing a regular kernel. Use the following command to\ninstall the kernel locally."}),"\n",(0,s.jsx)(A.pre,{children:(0,s.jsx)(A.code,{className:"language-bash",children:"$ sudo make modules_install install\n"})}),"\n",(0,s.jsx)(A.p,{children:"Follow this command by configuring the system bootloader (if your distribution\nrequires it). Some distributions might not require you to configure the system\nbootloader."}),"\n",(0,s.jsx)(A.p,{children:"Then restart the host system to execute the newly-compiled and newly-installed\nkernel, on which you have enabled support for zoned block devices."}),"\n",(0,s.jsxs)(A.p,{children:["At this point in the installation process, we highly recommend reinstalling the\nkernel headers. By reinstalling the kernel headers, the file\n",(0,s.jsx)(A.em,{children:"/usr/include/linux/blkzoned.h"})," will be installed, which will allow applications\nto be compiled against the ",(0,s.jsx)(A.a,{href:"/docs/linux/zbd-api",children:"zoned block device API"}),"\nsupported by the kernel."]}),"\n",(0,s.jsx)(A.p,{children:"Run the following command to install the kernel user header files."}),"\n",(0,s.jsx)(A.pre,{children:(0,s.jsx)(A.code,{className:"language-bash",children:"$ sudo make headers_install\n"})}),"\n",(0,s.jsxs)(A.p,{children:["See the kernel's ",(0,s.jsx)(A.code,{children:"make help"})," output for more information on this directive."]}),"\n",(0,s.jsxs)(A.p,{children:["After the the kernel user header files have been installed, we recommend that\nyou recompile from source any package that will be used to manage and access\nzoned block devices. In particular, recompiling and re-installing\n",(0,s.jsx)(A.a,{href:"/docs/tools/util-linux",children:"Linux system utilities"})," is highly recommended because\nmany packages rely on ",(0,s.jsx)(A.em,{children:"util-linux"})," zoned block device features (e.g. file\nsystems that use ",(0,s.jsx)(A.em,{children:"libblkid"}),")."]}),"\n",(0,s.jsxs)(A.p,{children:["The installation of the kernel and the installation of the user header files can\nbe simplified by using the RPM packages that are generated with the ",(0,s.jsx)(A.code,{children:"make rpm-pkg"})," command. If you install all of the packages generated by that command,\nyou will install the kernel core itself, the associated driver modules, and the\nuser API herder files. The RPM package ",(0,s.jsx)(A.code,{children:"kernel-headers-<version>.<arch>.rpm"}),"\nmust be installed in order for the kernel user API header files to be updated."]})]})}function f(e={}){const{wrapper:A}={...(0,i.a)(),...e.components};return A?(0,s.jsx)(A,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},72:(e,A,n)=>{"use strict";n.d(A,{Z:()=>i});n(7294);var s=n(5893);const i=function(e){let{src:A,title:i}=e;return(0,s.jsx)("div",{className:"container text--center",children:(0,s.jsxs)("figure",{children:[(0,s.jsx)("img",{src:n(7356)("./"+A).default,width:"640","max-width":"100%"}),(0,s.jsx)("figcaption",{children:(0,s.jsx)("em",{children:i})})]})})}},2461:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/intro-linux-zbd-f4ba5756b82ac441113bd7f9c9dd1dc6.png"},9081:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/intro-smr-tracks-2277a1473f60e1e862f8bb5916422533.png"},9798:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/intro-smr-zones-6296257d2459f5d1872bc28dcfa36ccd.png"},6901:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/intro-zns-128e951b7035733479ad228844c9e7ab.png"},1008:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/intro-zone-append-890c07f2624fe7dcf7c5ee61fe2a6f0b.png"},3505:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/intro-zoned-storage-82ce755eb4ac58c0b289d5bcb8b8c361.png"},3313:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/intro-zonesize-vs-capacity-0f94861db037e13632def2968998b611.png"},737:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-dm-9e8a3c8f8b9a480f921d7d263a9dc113.png"},2334:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-pscsi-e7c9db15cc4aebcf65fb21db3521a144.png"},8408:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-sched-70e55f9f3df2c81df464b476b1c4f636.png"},88:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-tcm1-7684c969474b143f4f71318501623f6f.png"},7417:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-tcm2-6bbd5067f606b5e32db5520dea899278.png"},1972:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-vhost-21cc5561b882aa8097fb30aa35664908.png"},9219:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-zbd-2e5d1a6b239c372fbd3e44f5e3282ebe.png"},1186:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-config-zonefs-34a6f41797ebee8de18ee798e45eb6ea.png"},1809:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-dm-zoned-7f01ae74923ff02b8d01c92fef2d376d.png"},8989:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-iopath-3ad49009873f1211b8e873f9ba540a38.png"},651:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/linux-versions-da4843f4c91f84aa8ef57f001bb6e8f1.png"},6105:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/percona-server-logo-93e864d0f923e386d855f6a8ea67fc8f.png"},9249:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/qemu-151192c8ad3d711f862c27b8b9e5bec4.png"},1523:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tests-zbc-hba-4a57d56fc6c4d400eadc1692b1907a27.png"},4740:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tests-zbc-kernel-166564aae2e5ad8dc156175fbf8f2e85.png"},6593:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tools-libzbc-gzbc-5d6b525337b567661f392ef6d06ad83e.png"},4065:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tools-libzbc-9dc574a0bfec08d195e6e4179d6cd272.png"},5055:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tools-libzbd-gzbd-viewer-63527beb07ac767d890a1b9616c85add.png"},5848:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tools-libzbd-gzbd-3a358277b4b4b8a9ea5629ce574afad4.png"},4162:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tools-tcmu-gzbc-11fb58818ee21d5116da8329d0d479af.png"},4552:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/tools-tcmu-dc8b8095c58f25df749406030dcc1b25.png"},1516:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s="data:image/vnd.microsoft.icon;base64,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WP/47uz/0YFb/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9KDXf/9+fj/15V6/9GAWf/RgFnf0YBZ/9GAWf/RgFr/04hm/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/26OO//Xp5f/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//br6P/erJn/0YBZ/9GAWf/RgFn/0YBZ/9OIZf/9+/r/0oRf/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/ShWH/3amX/+vRyf/37er/2qGM/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/8+Tf/+G1pf/RgFn/0YBZ/9GAWf/RgFn/04hk//79/P/ShWH/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/dqZf/8d7Z//br5//t1c7/4LKi/9KEYP/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/y4dz/4bSk/9GAWf/RgFn/0YBZ/9GAWf/RgFn//fn4/9eWev/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/4riq//Xo5P/aoYz/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//Hf2v/cp5P/0YBZ/9GAWf/RgFnf0YBZ/9GAWf/26ub/4LCg/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/05+T/15V7/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/04hm/9KDXv/RgFn/0YBZ39GAWa7RgFn/0YBZ/+vQyP/s0cn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//Xp5v/UjW7/0YBZ/9GAWf/RgFn/0YBZ/9WPcv/htab/0oNf/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/+fHvP/58O3/2Jh//9GAWf/RgFmu0YBZb9GAWf/RgFn/3KaS//r08v/ShWH/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/5sO4/+3Wz//ShGH/0YBZ/9GAWf/RgVr/79rU////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"},2132:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/zs-logo-178d9855350307325549778e41354d29.png"},2631:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/medias/tools-libzbd-gzbd-viewer-example-b3b4ef97af02e55f8b536f5b1b3c32d0.mp4"},7967:(e,A,n)=>{"use strict";n.r(A),n.d(A,{default:()=>s});const s=n.p+"assets/images/zone-state-machine-de3050d6565c6840b72bd055dbe01f3b.svg"},7356:(e,A,n)=>{var s={"./intro-linux-zbd.png":2461,"./intro-smr-tracks.png":9081,"./intro-smr-zones.png":9798,"./intro-zns.png":6901,"./intro-zone-append.png":1008,"./intro-zoned-storage.png":3505,"./intro-zonesize-vs-capacity.png":3313,"./linux-config-dm.png":737,"./linux-config-pscsi.png":2334,"./linux-config-sched.png":8408,"./linux-config-tcm1.png":88,"./linux-config-tcm2.png":7417,"./linux-config-vhost.png":1972,"./linux-config-zbd.png":9219,"./linux-config-zonefs.png":1186,"./linux-dm-zoned.png":1809,"./linux-iopath.png":8989,"./linux-versions.png":651,"./percona-server-logo.png":6105,"./qemu.png":9249,"./tests-zbc-hba.png":1523,"./tests-zbc-kernel.png":4740,"./tools-libzbc-gzbc.png":6593,"./tools-libzbc.png":4065,"./tools-libzbd-gzbd-viewer-example.mp4":2631,"./tools-libzbd-gzbd-viewer.png":5055,"./tools-libzbd-gzbd.png":5848,"./tools-tcmu-gzbc.png":4162,"./tools-tcmu.png":4552,"./zone-state-machine.svg":7967,"./zs-logo.ico":1516,"./zs-logo.png":2132};function i(e){var A=t(e);return n(A)}function t(e){if(!n.o(s,e)){var A=new Error("Cannot find module '"+e+"'");throw A.code="MODULE_NOT_FOUND",A}return s[e]}i.keys=function(){return Object.keys(s)},i.resolve=t,e.exports=i,i.id=7356},1151:(e,A,n)=>{"use strict";n.d(A,{Z:()=>r,a:()=>o});var s=n(7294);const i={},t=s.createContext(i);function o(e){const A=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(A):{...A,...e}}),[A,e])}function r(e){let A;return A=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(t.Provider,{value:A},e.children)}}}]);