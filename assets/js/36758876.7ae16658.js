(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[2352],{3905:(e,n,t)=>{"use strict";t.d(n,{Zo:()=>c,kt:()=>u});var A=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var A=Object.getOwnPropertySymbols(e);n&&(A=A.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,A)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,A,a=function(e,n){if(null==e)return{};var t,A,a={},s=Object.keys(e);for(A=0;A<s.length;A++)t=s[A],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(A=0;A<s.length;A++)t=s[A],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var o=A.createContext({}),l=function(e){var n=A.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},c=function(e){var n=l(e.components);return A.createElement(o.Provider,{value:n},e.children)},d="mdxType",g={inlineCode:"code",wrapper:function(e){var n=e.children;return A.createElement(A.Fragment,{},n)}},p=A.forwardRef((function(e,n){var t=e.components,a=e.mdxType,s=e.originalType,o=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=l(t),p=a,u=d["".concat(o,".").concat(p)]||d[p]||g[p]||s;return t?A.createElement(u,r(r({ref:n},c),{},{components:t})):A.createElement(u,r({ref:n},c))}));function u(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var s=t.length,r=new Array(s);r[0]=p;var i={};for(var o in n)hasOwnProperty.call(n,o)&&(i[o]=n[o]);i.originalType=e,i[d]="string"==typeof e?e:a,r[1]=i;for(var l=2;l<s;l++)r[l]=t[l];return A.createElement.apply(null,r)}return A.createElement.apply(null,t)}p.displayName="MDXCreateElement"},7993:(e,n,t)=>{"use strict";t.d(n,{Z:()=>a});var A=t(7294);const a=function(e){let{src:n,title:a}=e;return A.createElement("div",{className:"container text--center"},A.createElement("figure",null,A.createElement("img",{src:t(7356)("./"+n).default,width:"640","max-width":"100%"}),A.createElement("figcaption",null,A.createElement("em",null,a))))}},7270:(e,n,t)=>{"use strict";t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var A=t(7462),a=(t(7294),t(3905)),s=t(7993);const r={id:"tcmu-runner",title:"tcmu-runner ZBC Disk Emulation",sidebar_label:"tcmu-runner ZBC Disk Emulation"},i="tcmu-runner ZBC Disk Emulation",o={unversionedId:"tools/tcmu-runner",id:"tools/tcmu-runner",title:"tcmu-runner ZBC Disk Emulation",description:"tcmu-runner is an application daemon that can handle the execution of SCSI",source:"@site/docs/tools/tcmu-runner.md",sourceDirName:"tools",slug:"/tools/tcmu-runner",permalink:"/docs/tools/tcmu-runner",draft:!1,tags:[],version:"current",frontMatter:{id:"tcmu-runner",title:"tcmu-runner ZBC Disk Emulation",sidebar_label:"tcmu-runner ZBC Disk Emulation"},sidebar:"docs",previous:{title:"libnvme User Library",permalink:"/docs/tools/libnvme"},next:{title:"QEMU and KVM",permalink:"/docs/tools/qemu"}},l={},c=[{value:"Overview",id:"overview",level:2},{value:"Compilation and Installation",id:"compilation-and-installation",level:2},{value:"Kernel Components",id:"kernel-components",level:2},{value:"ZBC File Handler",id:"zbc-file-handler",level:2},{value:"Creating an Emulated disk",id:"creating-an-emulated-disk",level:2},{value:"Using an Emulated disk",id:"using-an-emulated-disk",level:2},{value:"Scripts",id:"scripts",level:2}],d={toc:c},g="wrapper";function p(e){let{components:n,...t}=e;return(0,a.kt)(g,(0,A.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"tcmu-runner-zbc-disk-emulation"},"tcmu-runner ZBC Disk Emulation"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," is an application daemon that can handle the execution of SCSI\ncommands that are sent by the kernel SCSI target sub component. It makes it\npossible for exported SCSI Logical Units (LUNs) to be backed by regular files\nor block devices."),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,"LinuxIO (LIO","\u2122",") is the standard open-source SCSI target implementation in the\nLinux","\xae"," kernel. LIO supports all prevalent storage fabrics, including Fibre\nChannel, FCoE, iEEE 1394, iSCSI, NVMe-OF, iSER, SRP, etc."),(0,a.kt)("p",null,"The Target Core Module Userspace (TCMU) implements a fabric that creates a link\nbetween the kernel SCSI target infrastructure and a userspace application.\nThe kernel-level module that is involved is called ",(0,a.kt)("inlineCode",{parentName:"p"},"target_core_user")," and can\nbe viewed as a virtual HBA."),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," implements the userspace-level side of SCSI processing and\nhandles the details of the TCMU interface (UIO, netlink, pthreads, and DBus).\n",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," exports a simpler C-plugin API that allows ",(0,a.kt)("em",{parentName:"p"},"file handlers")," to be\ncreated to emulate various device types. This is shown in the figure below."),(0,a.kt)(s.Z,{src:"tools-tcmu.png",title:"tcmu-runner overview",mdxType:"Image"}),(0,a.kt)("p",null,"The ",(0,a.kt)("em",{parentName:"p"},"ZBC file handler")," implements the emulation of a SCSI ZBC host-aware or\nhost-managed disk by using the TCMU C plugin API. This handler uses a regular\nfile as the backend storage for the emulated device."),(0,a.kt)("p",null,"This infrastructure setup ensures that any command that is issued by an\napplication or by a kernel component (e.g. a file system) is sent to the\n",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," daemon through the TCMU kernel driver. The file handler processes\nthe command in user space by using regular POSIX system calls and a reply is\nsent back upon completion of processing of the command. From the point of view\nof the application or kernel component that uses the emulated disk, all\naccesses appear as though they have been executed on actual hardware."),(0,a.kt)("h2",{id:"compilation-and-installation"},"Compilation and Installation"),(0,a.kt)("p",null,"The ",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," project is hosted on ",(0,a.kt)("a",{href:"https://github.com/open-iscsi/tcmu-runner",target:"_blank"},"GitHub"),".  The project ",(0,a.kt)("a",{href:"https://github.com/open-iscsi/tcmu-runner/blob/master/README.md",target:"_blank"},(0,a.kt)("em",{parentName:"p"},"README"))," file provides detailed information on how to\ncompile, install and execute ",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," daemon."),(0,a.kt)("p",null,"The ",(0,a.kt)("em",{parentName:"p"},"targetcli")," utility, which is available as a package in most distributions,\ncontrols devices that are emulated with ",(0,a.kt)("em",{parentName:"p"},"tcmu-runner"),". For example, on\n",(0,a.kt)("a",{parentName:"p",href:"../distributions/fedora"},"Fedora","\xae")," Linux, ",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," and ",(0,a.kt)("em",{parentName:"p"},"targetcli")," can\nbe installed using the following commands:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-plaintext"},"# dnf install tcmu-runner\n# dnf install targetcli\n")),(0,a.kt)("h2",{id:"kernel-components"},"Kernel Components"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"tcmu-runner"),' relies on the "loopback virtual SAS adapter kernel module" to\nexpose the emulated device to the kernel SCSI stack as a regular disk. To\nenable this kernel module, you must first enable support for the ',(0,a.kt)("em",{parentName:"p"},"Generic\nTarget Core Mod (TCM) and ConfigFS Infrastructure")," from the top-level ",(0,a.kt)("em",{parentName:"p"},"Device\nDrivers")," menu."),(0,a.kt)(s.Z,{src:"linux-config-tcm1.png",title:"Target Core Module support option with make menuconfig",mdxType:"Image"}),(0,a.kt)("p",null,"Only after this infrastructure is enabled can the configuration options\n",(0,a.kt)("em",{parentName:"p"},"CONFIG_TCM_USER2")," and ",(0,a.kt)("em",{parentName:"p"},"CONFIG_LOOPBACK_TARGET")," be enabled."),(0,a.kt)(s.Z,{src:"linux-config-tcm2.png",title:"TCM user and loopback adapter support option with make menuconfig",mdxType:"Image"}),(0,a.kt)("h2",{id:"zbc-file-handler"},"ZBC File Handler"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," ZBC file handler is compiled and installed by default. This\nhandler makes it possible to create emulated ZBC disks that use a regular file\nas backing storage."),(0,a.kt)("p",null,"The ZBC file handler supports the emulation of both host-aware and host-managed\nSCSI disks. All the characteristics of the emulated device can be configured.\nThe following table shows the available configuration parameters:"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Option"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"),(0,a.kt)("th",{parentName:"tr",align:null},"Default value"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"model-",(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("em",{parentName:"strong"},"type"))),(0,a.kt)("td",{parentName:"tr",align:null},"Device model type, ",(0,a.kt)("em",{parentName:"td"},"HA")," for host aware or ",(0,a.kt)("em",{parentName:"td"},"HM")," for host managed"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("em",{parentName:"td"},"HM"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"lba-",(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("em",{parentName:"strong"},"size (B)"))),(0,a.kt)("td",{parentName:"tr",align:null},"LBA size in bytes (512 or 4096)"),(0,a.kt)("td",{parentName:"tr",align:null},"512")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"zsize-",(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("em",{parentName:"strong"},"size (MiB)"))),(0,a.kt)("td",{parentName:"tr",align:null},"Zone size in MiB"),(0,a.kt)("td",{parentName:"tr",align:null},"256 MiB")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"conv-",(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("em",{parentName:"strong"},"num"))),(0,a.kt)("td",{parentName:"tr",align:null},"Number of conventional zones at LBA 0 (can be 0)"),(0,a.kt)("td",{parentName:"tr",align:null},"Number of zones corresponding to 1% of the device capacity")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"open-",(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("em",{parentName:"strong"},"num"))),(0,a.kt)("td",{parentName:"tr",align:null},"Optimal (for host aware) or maximum (for host managed) number of open zones"),(0,a.kt)("td",{parentName:"tr",align:null},"128")))),(0,a.kt)("p",null,"These parameters are always grouped together into a configuration string with\nthe format ",(0,a.kt)("inlineCode",{parentName:"p"},"/[opt1[/opt2][...]@]path_to_backing_file"),". For example, to specify\na host managed disk with 128MB zone size, 100 conventional zones and the file\n",(0,a.kt)("inlineCode",{parentName:"p"},"/var/local/zbc0.raw")," as backing storage, use the following configuration string:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-plaintext"},"cfgstring=model-HM/zsize-128/conv-100@/var/local/zbc.raw\n")),(0,a.kt)("h2",{id:"creating-an-emulated-disk"},"Creating an Emulated disk"),(0,a.kt)("p",null,"The following example shows the creation of a small 20 GB host-managed ZBC disk\nwith 10 conventional zones and a zone size of 256 MiB, with the file\n",(0,a.kt)("inlineCode",{parentName:"p"},"/var/local/zbc0.raw")," used as backing storage. The emulated disk is emulated\nlocally using the loopback interface. This requires that ",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," is\nrunning on the system."),(0,a.kt)("p",null,"With ",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," running, the ",(0,a.kt)("em",{parentName:"p"},"targetcli")," command is used to create the\nemulated disk."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-plaintext"},"# targetcli\ntargetcli shell version 2.1.fb49\nCopyright 2011-2013 by Datera, Inc and others.\nFor help on commands, type 'help'.\n\n/> cd /backstores/user:zbc\n/backstores/user:zbc> create name=zbc0 size=20G cfgstring=model-HM/zsize-256/conv-10@/var/local/zbc0.raw\nCreated user-backed storage object zbc0 size 21474836480.\n/backstores/user:zbc> cd /loopback\n/loopback> create\nCreated target naa.500140529100d742.\n/loopback> cd naa.500140529100d742/luns\n/loopback/naa...9100d742/luns> create /backstores/user:zbc/zbc0 0\nCreated LUN 0.\n/loopback/naa...9100d742/luns> cd /\n/> ls\no- / ..................................................................... [...]\n  o- backstores .......................................................... [...]\n  | o- block .............................................. [Storage Objects: 0]\n  | o- fileio ............................................. [Storage Objects: 0]\n  | o- pscsi .............................................. [Storage Objects: 0]\n  | o- ramdisk ............................................ [Storage Objects: 0]\n  | o- user:fbo ........................................... [Storage Objects: 0]\n  | o- user:poma .......................................... [Storage Objects: 0]\n  | o- user:zbc ........................................... [Storage Objects: 1]\n  |   o- zbc0  [model-HM/zsize-256/conv-10@/var/local/zbc0.raw (20.0GiB) activated]\n  |     o- alua ............................................... [ALUA Groups: 1]\n  |       o- default_tg_pt_gp ................... [ALUA state: Active/optimized]\n  o- iscsi ........................................................ [Targets: 0]\n  o- loopback ..................................................... [Targets: 1]\n  | o- naa.500140529100d742 ............................. [naa.50014059e05d5424]\n  |   o- luns ........................................................ [LUNs: 1]\n  |     o- lun0 ................................. [user/zbc0 (default_tg_pt_gp)]\n  o- vhost ........................................................ [Targets: 0]\n/> exit\n")),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"backstore create")," command specifies the capacity of the emulated disk with\nthe argument ",(0,a.kt)("inlineCode",{parentName:"p"},"size=20G"),". The backing file ",(0,a.kt)("inlineCode",{parentName:"p"},"/var/local/zbc0.raw")," is created if\nnecessary and is resized to match the specified capacity."),(0,a.kt)("p",null,"When the backstore is linked to ",(0,a.kt)("inlineCode",{parentName:"p"},"lun0")," of the loopback link, the emulated\ndevice becomes visible to the kernel and its management initialized the same\nway physical devices are initialized. This is reported in the kernel messages\nlog:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-plaintext"},"# dmesg\n...\nscsi host11: TCM_Loopback\nscsi 11:0:1:0: Direct-Access-ZBC LIO-ORG  TCMU ZBC device  0002 PQ: 0 ANSI: 5\nsd 11:0:1:0: Attached scsi generic sg4 type 20\nsd 11:0:1:0: [sde] Host-managed zoned block device\nsd 11:0:1:0: [sde] 41943040 512-byte logical blocks: (21.5 GB/20.0 GiB)\nsd 11:0:1:0: [sde] 80 zones of 524288 logical blocks\nsd 11:0:1:0: [sde] Write Protect is off\nsd 11:0:1:0: [sde] Mode Sense: 0f 00 00 00\nsd 11:0:1:0: [sde] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA\nsd 11:0:1:0: [sde] Optimal transfer size 65536 bytes\nsd 11:0:1:0: [sde] Attached SCSI disk\n")),(0,a.kt)("p",null,"The disk can now be listed with tools such as ",(0,a.kt)("em",{parentName:"p"},"lsblk")," and ",(0,a.kt)("em",{parentName:"p"},"lsscsi"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-plaintext"},"# lsscsi -g\n[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0\n[4:0:0:0]    zbc     ATA      HGST HSH721414AL T220  /dev/sdb   /dev/sg1\n[10:0:1:0]   zbc     ATA      HGST HSH721414AL W209  /dev/sdc   /dev/sg2\n[10:0:2:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdd   /dev/sg3\n[11:0:1:0]   zbc     LIO-ORG  TCMU ZBC device  0002  /dev/sde   /dev/sg4\n")),(0,a.kt)("h2",{id:"using-an-emulated-disk"},"Using an Emulated disk"),(0,a.kt)("p",null,"All ZBD-compliant tools and applications are able to access and control the\nemulated disk in exactly the same manner as they would control a physical\ndevice. For example, the ",(0,a.kt)("a",{parentName:"p",href:"/docs/tools/libzbc#graphical-interface"},(0,a.kt)("em",{parentName:"a"},"libzbc")," graphical interface\n(gzbc)")," can be used to display the emulated disk\nzones."),(0,a.kt)(s.Z,{src:"tools-tcmu-gzbc.png",title:"tcmu-runner ZBC emulated disk view in gzbc",mdxType:"Image"}),(0,a.kt)("h2",{id:"scripts"},"Scripts"),(0,a.kt)("p",null,"The following script creates an emulated disk with a single command:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'#!/bin/bash\n\nif [ $# != 5 ]; then\n        echo "Usage: $0 <disk name> <cap (GB)> HM|HA <zone size (MB)> <conv zones num>"\n        exit 1;\nfi\n\ndname="$1"\ncap="$2"\nmodel="$3"\nzs="$4"\ncnum="$5"\n\nnaa="naa.50014059cfa9ba75"\n\n# Setup emulated disk\ncat << EOF | targetcli\n\ncd /backstores/user:zbc\ncreate name=${dname} size=${cap}G cfgstring=model-${model}/zsize-${zs}/conv-${cnum}@/var/local/${dname}.raw\ncd /loopback\ncreate ${naa}\ncd ${naa}/luns\ncreate /backstores/user:zbc/${dname} 0\ncd /\nexit\n\nEOF\n\nsleep 1\ndisk=`lsscsi | grep "TCMU ZBC device" | cut -d \'/\' -f3 | sed \'s/ //g\'`\necho "mq-deadline" > /sys/block/"${disk}"/queue/scheduler\n')),(0,a.kt)("p",null,"Tearing down an emulated disk can also be automated with a single command line\nas shown below."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'#!/bin/bash\n\nif [ $# != 1 ]; then\n    echo "Usage: $0 <disk name (e.g. zbc0)"\n    exit 1;\nfi\n\ndname="$1"\n\nnaa="naa.50014059cfa9ba75"\n\n# Delete emulated disk\ncat << EOF | targetcli\n\ncd /loopback/${naa}/luns\ndelete 0\ncd /loopback\ndelete ${naa}\ncd /backstores/user:zbc\ndelete ${dname}\ncd /\nexit\n\nEOF\n')))}p.isMDXComponent=!0},5:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/intro-linux-zbd-f4ba5756b82ac441113bd7f9c9dd1dc6.png"},8477:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/intro-smr-tracks-2277a1473f60e1e862f8bb5916422533.png"},6020:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/intro-smr-zones-6296257d2459f5d1872bc28dcfa36ccd.png"},6525:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/intro-zns-128e951b7035733479ad228844c9e7ab.png"},3006:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/intro-zone-append-890c07f2624fe7dcf7c5ee61fe2a6f0b.png"},7702:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/intro-zoned-storage-82ce755eb4ac58c0b289d5bcb8b8c361.png"},1328:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/intro-zonesize-vs-capacity-0f94861db037e13632def2968998b611.png"},26:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-dm-9e8a3c8f8b9a480f921d7d263a9dc113.png"},7690:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-pscsi-e7c9db15cc4aebcf65fb21db3521a144.png"},7876:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-sched-70e55f9f3df2c81df464b476b1c4f636.png"},2448:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-tcm1-7684c969474b143f4f71318501623f6f.png"},6245:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-tcm2-6bbd5067f606b5e32db5520dea899278.png"},2623:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-vhost-21cc5561b882aa8097fb30aa35664908.png"},4959:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-zbd-2e5d1a6b239c372fbd3e44f5e3282ebe.png"},4670:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-config-zonefs-34a6f41797ebee8de18ee798e45eb6ea.png"},672:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-dm-zoned-7f01ae74923ff02b8d01c92fef2d376d.png"},4791:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-iopath-3ad49009873f1211b8e873f9ba540a38.png"},530:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/linux-versions-da4843f4c91f84aa8ef57f001bb6e8f1.png"},9889:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/percona-server-logo-93e864d0f923e386d855f6a8ea67fc8f.png"},8244:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/qemu-151192c8ad3d711f862c27b8b9e5bec4.png"},308:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tests-zbc-hba-4a57d56fc6c4d400eadc1692b1907a27.png"},8695:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tests-zbc-kernel-166564aae2e5ad8dc156175fbf8f2e85.png"},6312:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tools-libzbc-gzbc-5d6b525337b567661f392ef6d06ad83e.png"},8920:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tools-libzbc-9dc574a0bfec08d195e6e4179d6cd272.png"},6925:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tools-libzbd-gzbd-viewer-63527beb07ac767d890a1b9616c85add.png"},5922:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tools-libzbd-gzbd-3a358277b4b4b8a9ea5629ce574afad4.png"},5089:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tools-tcmu-gzbc-11fb58818ee21d5116da8329d0d479af.png"},6479:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/tools-tcmu-dc8b8095c58f25df749406030dcc1b25.png"},9972:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A="data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRgFkA0YBZGtGAWW/RgFmu0YBZ39GAWf/RgFn/0YBZ/9GAWf/RgFnf0YBZrtGAWW/RgFka0YBZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRgFkA0YBZP9GAWbbRgFn90YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf3RgFm20YBZP9GAWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0YBZEtGAWaTRgFn/0YBZ/9GAWf/RgFn/0YBZ/9OGYv/ZnYX/3quY/96tm//booz/1Y1u/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZqtGAWRgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANGAWTXRgFnm0YBZ/9GAWf/RgFn/1Itr/+bCtf/05+L//fv6//r08v/26+j/9urm//nx7v/9+/r/+O/s/+vPxv/YmoL/0YBZ/9GAWf/RgFn/0YBZ5tGAWTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRgFlS0YBZ+tGAWf/RgFn/0oRf/+jHvP/8+Pb/8+Ld/+K4qf/Vj3H/0YBa/9GAWf/RgFn/0YBZ/9OGY//erJn/7dbO//z5+P/w29T/1pJ2/9GAWf/RgFn/0YBZ+tGAWVIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0YBZNdGAWfrRgFn/0YBZ/9eWfP/26+f/9ejk/9uijP/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/1Y9y/+3Wzv/79/X/4LCg/9GAWf/RgFn/0YBZ+tGAWTUAAAAAAAAAAAAAAAAAAAAAAAAAANGAWRLRgFnm0YBZ/9GAWf/ZnYX/+/Xz/+rNw//Sg13/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/+Cwn//79/b/5L2v/9GAWf/RgFn/0YBZ5tGAWRIAAAAAAAAAAAAAAADRgFkA0YBZqtGAWf/RgFn/1pJ1//r08v/mw7f/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9ulkf/8+Pb/4LKi/9GAWf/RgFn/0YBZqtGAWQAAAAAAAAAAANGAWT/RgFn/0YBZ/9GBW//z5N//7dPL/9GAWf/RgFn/1Y9y/+vPx//qz8f/6s/H/+rPx//qz8f/6s/H/+rPx//qz8f/6s/H/+rPx//qz8f/6s/H/96tm//RgFn/0YBZ/9+vnf/89/b/15V5/9GAWf/RgFn/0YBZPwAAAADRgFkA0YBZttGAWf/RgFn/47mq//rz8f/Th2X/0YBZ/9GAWf/Ui2z/+vX0//ju7P/qzcX/6s3F/+rNxf/qzcX/6s3F/+rNxf/qzcX/6s3F/+rNxf/qzcX/3qua/9GAWf/RgFn/0YBZ/+zTy//x3df/0YBZ/9GAWf/RgFm20YBZANGAWRrRgFn90YBZ/9GCXP/48O3/4LOj/9GAWf/RgFn/0YBZ/9GAWf/cqJX//fv6/9+xof/Timn/36+f/+XCtv/lwLT/3auZ/9KDX//RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/1Y1u//z49//an4j/0YBZ/9GAWf3RgFka0YBZb9GAWf/RgFn/4LKh//nx7v/RgVv/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/qzsX///////jx7v/oysD/4bWm/+G2qP/qzsb/9ejl/9iag//RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/7NLJ/+zTy//RgFn/0YBZ/9GAWW/RgFmu0YBZ/9KFYP/8+fj//fr5/9OHZP/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9ujjv/58e//4beo/9GAWf/RgFn/0YBZ/9GAWf/aoYv/8+Tg/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/cpZH/+vTx/9GAWf/RgFn/0YBZrtGAWd/RgFn/0YBZ/+7Xz//v2dH/0YFa/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWP/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWP/47uz/0YFb/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9KDXf/9+fj/15V6/9GAWf/RgFnf0YBZ/9GAWf/RgFr/04hm/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/26OO//Xp5f/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//br6P/erJn/0YBZ/9GAWf/RgFn/0YBZ/9OIZf/9+/r/0oRf/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/ShWH/3amX/+vRyf/37er/2qGM/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/8+Tf/+G1pf/RgFn/0YBZ/9GAWf/RgFn/04hk//79/P/ShWH/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/dqZf/8d7Z//br5//t1c7/4LKi/9KEYP/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/y4dz/4bSk/9GAWf/RgFn/0YBZ/9GAWf/RgFn//fn4/9eWev/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/4riq//Xo5P/aoYz/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//Hf2v/cp5P/0YBZ/9GAWf/RgFnf0YBZ/9GAWf/26ub/4LCg/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/05+T/15V7/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/04hm/9KDXv/RgFn/0YBZ39GAWa7RgFn/0YBZ/+vQyP/s0cn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ//Xp5v/UjW7/0YBZ/9GAWf/RgFn/0YBZ/9WPcv/htab/0oNf/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/+fHvP/58O3/2Jh//9GAWf/RgFmu0YBZb9GAWf/RgFn/3KaS//r08v/ShWH/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/5sO4/+3Wz//ShGH/0YBZ/9GAWf/RgVr/79rU///////htqf/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/9Obh///+/v/cp5P/0YBZ/9GAWW/RgFka0YBZ/dGAWf/RgFn/9uvo/+S+sf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgVv/5sO4//Xo5P/x4Nv/8d/a//Tn4//v2tT/9enm//Xp5v/ShWL/0YBZ/9GAWf/RgFn/0YBZ/9eWe//8+fj/26GL/9GAWf/RgFn90YBZGtGAWQDRgFm20YBZ/9GAWf/fr53/+vTy/9SMbP/RgFn/0YBZ/9GAWf/RgFj/0YBY/9GAWP/RgFj/0YBZ/9SLa//UjG3/0YFc/9GAWP/ThmT/9uvo/+3Vzv/RgFn/0YBZ/9GAWf/RgFn/8d7Y/+zSyf/RgFn/0YBZ/9GAWbbRgFkAAAAAANGAWT/RgFn/0YBZ/9GAWf/w29T/8d/Z/9GBW//RgFn/04hm//nx7//69PL/+vTy//r08v/69PL/+vTy//r08v/69PL/+vTy//r08v/8+Pf//////9uijv/RgFn/0YBZ/+S+sf/58u//1Ipp/9GAWf/RgFn/0YBZPwAAAAAAAAAA0YBZANGAWarRgFn/0YBZ/9OJaP/37On/7dTM/9GBW//Rglz/2Z6H/9mfiP/Zn4j/2Z+I/9mfiP/Zn4j/2Z+I/9mfiP/Zn4j/2Z+I/9mfiP/Zn4j/04hn/9GAWf/gsqL//Pf2/9uhi//RgFn/0YBZ/9GAWarRgFkAAAAAAAAAAAAAAAAA0YBZEtGAWebRgFn/0YBZ/9aRdP/37er/8d7Y/9SLa//RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgVv/5sO4//z39v/dqZb/0YBZ/9GAWf/RgFnm0YBZEgAAAAAAAAAAAAAAAAAAAAAAAAAA0YBZNdGAWfrRgFn/0YBZ/9SKav/w3db/+vTy/+K5qv/Sgl3/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/26SP//Tm4f/47uv/2Z2G/9GAWf/RgFn/0YBZ+tGAWTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0YBZUtGAWfrRgFn/0YBZ/9GAWv/gs6L/+O7r//rz8f/rz8f/3aqY/9WNbf/RgVv/0YFa/9OGYv/aoIr/5sK2//bq5v/89/b/6Mi9/9KFYv/RgFn/0YBZ/9GAWfrRgFlSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0YBZNdGAWebRgFn/0YBZ/9GAWf/RgVv/3qya/+3Wzv/47+z//vz8//36+f/9+ff//vz8//v18//x3tj/47ut/9OIZv/RgFn/0YBZ/9GAWf/RgFnm0YBZNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0YBZEtGAWarRgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/ThWH/1pJ1/9aUeP/UiWf/0YBY/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZqtGAWRIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0YBZANGAWT/RgFm20YBZ/dGAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn/0YBZ/9GAWf/RgFn90YBZttGAWT/RgFkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANGAWQDRgFka0YBZb9GAWa7RgFnf0YBZ/9GAWf/RgFn/0YBZ/9GAWd/RgFmu0YBZb9GAWRrRgFkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8AD//8AAP/8AAA/+AAAH/AAAA/gAAAHwAAAA8AAAAOAAAABgAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAGAAAABwAAAA8AAAAPgAAAH8AAAD/gAAB/8AAA//wAA///AA/8="},51:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/zs-logo-178d9855350307325549778e41354d29.png"},6334:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/medias/tools-libzbd-gzbd-viewer-example-b3b4ef97af02e55f8b536f5b1b3c32d0.mp4"},1485:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>A});const A=t.p+"assets/images/zone-state-machine-de3050d6565c6840b72bd055dbe01f3b.svg"},7356:(e,n,t)=>{var A={"./intro-linux-zbd.png":5,"./intro-smr-tracks.png":8477,"./intro-smr-zones.png":6020,"./intro-zns.png":6525,"./intro-zone-append.png":3006,"./intro-zoned-storage.png":7702,"./intro-zonesize-vs-capacity.png":1328,"./linux-config-dm.png":26,"./linux-config-pscsi.png":7690,"./linux-config-sched.png":7876,"./linux-config-tcm1.png":2448,"./linux-config-tcm2.png":6245,"./linux-config-vhost.png":2623,"./linux-config-zbd.png":4959,"./linux-config-zonefs.png":4670,"./linux-dm-zoned.png":672,"./linux-iopath.png":4791,"./linux-versions.png":530,"./percona-server-logo.png":9889,"./qemu.png":8244,"./tests-zbc-hba.png":308,"./tests-zbc-kernel.png":8695,"./tools-libzbc-gzbc.png":6312,"./tools-libzbc.png":8920,"./tools-libzbd-gzbd-viewer-example.mp4":6334,"./tools-libzbd-gzbd-viewer.png":6925,"./tools-libzbd-gzbd.png":5922,"./tools-tcmu-gzbc.png":5089,"./tools-tcmu.png":6479,"./zone-state-machine.svg":1485,"./zs-logo.ico":9972,"./zs-logo.png":51};function a(e){var n=s(e);return t(n)}function s(e){if(!t.o(A,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return A[e]}a.keys=function(){return Object.keys(A)},a.resolve=s,e.exports=a,a.id=7356}}]);