"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[360],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return u}});var o=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,o,a=function(e,n){if(null==e)return{};var t,o,a={},i=Object.keys(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=o.createContext({}),c=function(e){var n=o.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},p=function(e){var n=c(e.components);return o.createElement(l.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},m=o.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=c(t),u=a,k=m["".concat(l,".").concat(u)]||m[u]||d[u]||i;return t?o.createElement(k,r(r({ref:n},p),{},{components:t})):o.createElement(k,r({ref:n},p))}));function u(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,r=new Array(i);r[0]=m;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,r[1]=s;for(var c=2;c<i;c++)r[c]=t[c];return o.createElement.apply(null,r)}return o.createElement.apply(null,t)}m.displayName="MDXCreateElement"},1676:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},metadata:function(){return l},toc:function(){return c},default:function(){return d}});var o=t(7462),a=t(3366),i=(t(7294),t(3905)),r=["components"],s={id:"util-linux",title:"Linux System Utilities",sidebar_label:"Linux System Utilities"},l={unversionedId:"tools/util-linux",id:"tools/util-linux",isDocsHomePage:!1,title:"Linux System Utilities",description:"As defined by the project itself, util-linux is a random collection of",source:"@site/docs/tools/util-linux.md",sourceDirName:"tools",slug:"/tools/util-linux",permalink:"/docs/tools/util-linux",version:"current",sidebar_label:"Linux System Utilities",frontMatter:{id:"util-linux",title:"Linux System Utilities",sidebar_label:"Linux System Utilities"},sidebar:"docs",previous:{title:"Tools and Libraries",permalink:"/docs/tools"},next:{title:"ZNS Tools",permalink:"/docs/tools/zns"}},c=[{value:"lsblk",id:"lsblk",children:[]},{value:"blkzone",id:"blkzone",children:[{value:"Zone Report",id:"zone-report",children:[]},{value:"Device capacity",id:"device-capacity",children:[]},{value:"Zone Reset",id:"zone-reset",children:[]}]}],p={toc:c};function d(e){var n=e.components,t=(0,a.Z)(e,r);return(0,i.kt)("wrapper",(0,o.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"As defined by the project itself, ",(0,i.kt)("em",{parentName:"p"},"util-linux")," is a random collection of\nLinux","\xae"," utilities. This project is hosted\non ",(0,i.kt)("a",{href:"https://github.com/karelzak/util-linux",target:"_blank"},"GitHub"),".\nThis project generally packaged in most distributions under the name\n",(0,i.kt)("em",{parentName:"p"},"util-linux")," and installed by default."),(0,i.kt)("p",null,"Among many utilities, ",(0,i.kt)("em",{parentName:"p"},"util-linux")," provides the ",(0,i.kt)("em",{parentName:"p"},"lsblk")," and ",(0,i.kt)("em",{parentName:"p"},"blkzone")," command\nline tools to list zoned block devices and to obtain zone configuration. The\n",(0,i.kt)("em",{parentName:"p"},"blkzone")," tool also allows resetting write pointer of sequential zones."),(0,i.kt)("p",null,"These utilities are especially useful for shell scripting and for\ntroubleshooting of zone management problems in user applications."),(0,i.kt)("h2",{id:"lsblk"},"lsblk"),(0,i.kt)("p",null,"The lsblk command lists all block devices of a system, regardless of the block\ndevice type, that is, also including zoned block devices. The output of ",(0,i.kt)("em",{parentName:"p"},"lsblk"),"\nis as follows."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# lsblk\nNAME     MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT\nsda        8:0    0 167.7G  0 disk\n\u251c\u2500sda1     8:1    0     1G  0 part /boot\n\u251c\u2500sda2     8:2    0 150.7G  0 part /\n\u2514\u2500sda3     8:3    0    16G  0 part [SWAP]\nsdb        8:16   0  12.8T  0 disk\nsdc        8:32   0  12.8T  0 disk\nsdd        8:48   0  13.7T  0 disk\n")),(0,i.kt)("p",null,"By default, there is no indication of the zone model of the listed block\ndevices. To discover this information, the option ",(0,i.kt)("inlineCode",{parentName:"p"},"-z")," can be used."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# lsblk -z\nNAME     ZONED\nsda      none\n\u251c\u2500sda1   none\n\u251c\u2500sda2   none\n\u2514\u2500sda3   none\nsdb      host-managed\nsdc      host-managed\nsdd      host-managed\n")),(0,i.kt)("p",null,"The output of ",(0,i.kt)("em",{parentName:"p"},"lsblk")," can also be formatted as needed using the ",(0,i.kt)("inlineCode",{parentName:"p"},"-o")," option. For\ninstance, the following command will display block device names, size and zone\nmodel."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# lsblk -o NAME,SIZE,ZONED\nNAME       SIZE ZONED\nsda      167.7G none\n\u251c\u2500sda1       1G none\n\u251c\u2500sda2   150.7G none\n\u2514\u2500sda3      16G none\nsdb       12.8T host-managed\nsdc       12.8T host-managed\nsdd       13.7T host-managed\n")),(0,i.kt)("h2",{id:"blkzone"},"blkzone"),(0,i.kt)("p",null,"The ",(0,i.kt)("em",{parentName:"p"},"blkzone")," command line utility allows listing (reporting) the zones of a\nzoned block device and resetting the write pointer of sequential zones. Unlike\nthe ",(0,i.kt)("em",{parentName:"p"},"sg_rep_zone")," and ",(0,i.kt)("em",{parentName:"p"},"sg_reset_wp")," utilities of the\n",(0,i.kt)("a",{parentName:"p",href:"/docs/tools/sg3utils"},(0,i.kt)("em",{parentName:"a"},"sg3utils"))," project, ",(0,i.kt)("em",{parentName:"p"},"blkzone")," relies on the kernel\nprovided ZBD ",(0,i.kt)("inlineCode",{parentName:"p"},"ioctl()")," interface to perform zone report and zone reset\noperations. SCSI commands are not issued directly to the device by ",(0,i.kt)("em",{parentName:"p"},"blkzone"),"."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"blkzone")," command usage is as shown below."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},'# blkzone --help\n\nUsage:\n blkzone <command> [options] <device>\n\nRun zone command on the given block device.\n\nCommands:\n report       Report zone information about the given device\n capacity     Report zone capacity for the given device\n reset        Reset a range of zones.\n open         Open a range of zones.\n close        Close a range of zones.\n finish       Set a range of zones to Full.\n\nOptions:\n -o, --offset <sector>  start sector of zone to act (in 512-byte sectors)\n -l, --length <sectors> maximum sectors to act (in 512-byte sectors)\n -c, --count <number>   maximum number of zones\n -f, --force            enforce on block devices used by the system\n -v, --verbose          display more details\n\n -h, --help             display this help\n -V, --version          display version\n\nArguments:\n <sector> and <sectors> arguments may be followed by the suffixes for\n   GiB, TiB, PiB, EiB, ZiB, and YiB (the "iB" is optional)\n\nFor more details see blkzone(8).\n')),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"The open, close and finish commands of ",(0,i.kt)("em",{parentName:"p"},"blkzone")," are available with ",(0,i.kt)("em",{parentName:"p"},"util-linux"),"\nversion 2.36 onward. The capacity command is available on the master branch."))),(0,i.kt)("h3",{id:"zone-report"},"Zone Report"),(0,i.kt)("p",null,"For listing the zones of device, the following command can be used."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone report /dev/sdd\n  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000080000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000100000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000180000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000200000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000280000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000300000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000380000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000400000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x000480000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  ...\n  start: 0x010500000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x010580000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]\n  start: 0x010600000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x010680000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x010700000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x010780000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  start: 0x010800000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n  ...\n")),(0,i.kt)("p",null,"To restrict the range of zones reported, the options ",(0,i.kt)("inlineCode",{parentName:"p"},"--offset")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"--count"),"\ncan be used. For instance, to report only the first sequential zone of a disk\nstarting at sector 274726912, the following command can be used."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone report --offset 274726912 --count 1 /dev/sdd\nstart: 0x010600000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]\n")),(0,i.kt)("h3",{id:"device-capacity"},"Device capacity"),(0,i.kt)("p",null,"If zone capacity is smaller than zone size, the size listed in blockdev and\nlsblk is not indicating how much data that can be stored on on the zoned block\ndevice. The storage capacity of the device is the sum of the capacity of all\nzones."),(0,i.kt)("p",null,"For determining the storage capcity of a device in sectors, the following command can be used:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone capacity /dev/nullb1\n0x00c350000\n")),(0,i.kt)("h3",{id:"zone-reset"},"Zone Reset"),(0,i.kt)("p",null,"Sequential write zones can be reset with ",(0,i.kt)("em",{parentName:"p"},"blkzone")," using the ",(0,i.kt)("inlineCode",{parentName:"p"},"reset")," operation.\nFor instance, to reset the first sequential zone of a disk starting at sector\n274726912, the following command can be used."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone reset --offset 274726912 --count 1 /dev/sdd\n")),(0,i.kt)("p",null,"If the range of zones specified with the ",(0,i.kt)("inlineCode",{parentName:"p"},"reset")," operation includes conventional\nzones, the command will fail."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone reset /dev/sdd\nblkzone: /dev/sdh: BLKRESETZONE ioctl failed: Remote I/O error\n")),(0,i.kt)("p",null,"The user must exclude all conventional zones. With the disk used for the above\nexample, all conventional zones are located between sector 0 and 274726912. The\nremaining of the disk is composed of sequential write zones. Therefore, the\nfollowing command will reset write pointer in all zones."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone reset --offset 274726912 /dev/sdd\n")),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"This command results in the kernel looping over all sequential zone of the disk\nand executing a zone reset command on each zone. This can be time consuming and\ntakes a significantly longer time compared to using the\n",(0,i.kt)("a",{parentName:"p",href:"/docs/tools/sg3utils#sg_reset_wp"},(0,i.kt)("em",{parentName:"a"},"sg_reset_wp"))," command with the ",(0,i.kt)("inlineCode",{parentName:"p"},"--all"),"\noption specified."))))}d.isMDXComponent=!0}}]);