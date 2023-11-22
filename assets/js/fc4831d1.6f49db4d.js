"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[4835],{753:(e,s,o)=>{o.r(s),o.d(s,{assets:()=>d,contentTitle:()=>l,default:()=>u,frontMatter:()=>r,metadata:()=>c,toc:()=>a});var n=o(5893),i=o(1151),t=o(9860);const r={id:"fedora",title:"Fedora",sidebar_label:"Fedora"},l="Fedora",c={id:"distributions/fedora",title:"Fedora",description:"Fedora&reg; is a",source:"@site/docs/distributions/fedora.md",sourceDirName:"distributions",slug:"/distributions/fedora",permalink:"/docs/distributions/fedora",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"fedora",title:"Fedora",sidebar_label:"Fedora"},sidebar:"docs",previous:{title:"Overview",permalink:"/docs/distributions/overview"},next:{title:"openSuse",permalink:"/docs/distributions/opensuse"}},d={},a=[{value:"Supported Zoned Block Devices",id:"supported-zoned-block-devices",level:2},{value:"Supported File Systems and Device Mapper Targets",id:"supported-file-systems-and-device-mapper-targets",level:2},{value:"Available Pre-Compiled Packages",id:"available-pre-compiled-packages",level:2}];function b(e){const s={em:"em",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...(0,i.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"fedora",children:"Fedora"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.em,{children:(0,n.jsx)("a",{href:"https://getfedora.org",target:"_blank",children:"Fedora\xae"})})," is a\nLinux distribution developed by the community-supported ",(0,n.jsx)(s.em,{children:"Fedora Project"}),"\nand primarily sponsored by ",(0,n.jsx)(s.em,{children:(0,n.jsx)("a",{href:"https://www.redhat.com",target:"_blank",children:"Red Hat\xae"})}),".\nDetailed information on how to download and install Fedora\ncan be found ",(0,n.jsx)("a",{href:"https://docs.fedoraproject.org/en-US/fedora/f33/install-guide/",target:"_blank",children:"here"}),"."]}),"\n",(0,n.jsxs)(s.p,{children:["The following tables give an overview of the kernel versions and\nconfiguration used with the latest releases of the Fedora distribution.\nA more complete list of kernel versions for all releases can be found ",(0,n.jsx)("a",{href:"https://en.wikipedia.org/wiki/Fedora_Linux",target:"_blank",children:"here"}),"."]}),"\n",(0,n.jsx)(s.h2,{id:"supported-zoned-block-devices",children:"Supported Zoned Block Devices"}),"\n",(0,n.jsx)(s.p,{children:"Support for the zoned block interface is present and enabled by default\nin the binary kernel of all releases of Fedora since release 26. Fedora\n33 was the first release to provide NVMe Zoned Namespace (ZNS) support\nafter updating the distribution."}),"\n",(0,n.jsx)(s.p,{children:"As shown in the table below, recent Fedora releases provide support for\nall types of zoned block devices."}),"\n",(0,n.jsx)("div",{children:(0,n.jsxs)("table",{class:"table-dist",children:[(0,n.jsx)(t.kc,{}),(0,n.jsx)(t.Mb,{})]})}),"\n",(0,n.jsx)(s.h2,{id:"supported-file-systems-and-device-mapper-targets",children:"Supported File Systems and Device Mapper Targets"}),"\n",(0,n.jsxs)(s.p,{children:["Starting with release 27, the precompiled kernel packages include the\n",(0,n.jsx)(s.em,{children:"dm-zoned"})," device mapper target compiled as a loadable kernel module."]}),"\n",(0,n.jsx)("div",{children:(0,n.jsxs)("table",{class:"table-dist",children:[(0,n.jsx)(t.QK,{}),(0,n.jsx)(t.Z,{})]})}),"\n",(0,n.jsx)(s.h2,{id:"available-pre-compiled-packages",children:"Available Pre-Compiled Packages"}),"\n",(0,n.jsx)(s.p,{children:"Since Fedora release 34, a comprehensive set of pre-compiled application and\nlibrary packages support zoned block devices."}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(s.p,{children:"System utilities packages:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.em,{children:"util-linux"})," (",(0,n.jsx)(s.em,{children:"blkzone"})," utility)"]}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"nvme-cli"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"sg3_utils"})}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(s.p,{children:"Libraries related packages:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.em,{children:"libblkid"})," (and ",(0,n.jsx)(s.em,{children:"libblkid-devel"}),")"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.em,{children:"libnvme"})," (and ",(0,n.jsx)(s.em,{children:"libnvme-devel"}),")"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.em,{children:"libzbd"})," (and ",(0,n.jsx)(s.em,{children:"libzbd-devel"}),")"]}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"libzbd-cli-tools"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"libzbd-gtk-tools"})}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(s.p,{children:"File systems related packages:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"zonefs-tools"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"btrfs-progs"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"f2fs-tools"})}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(s.p,{children:"Device Mapper related packages:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.em,{children:"dm-zoned-tools"})}),"\n"]}),"\n"]}),"\n"]})]})}function u(e={}){const{wrapper:s}={...(0,i.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(b,{...e})}):b(e)}},9860:(e,s,o)=>{o.d(s,{Z:()=>a,QK:()=>c,kc:()=>l,Mb:()=>d});o(7294);var n=o(6550);const i=[{distribution:"34",kernel:"5.11",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"35",kernel:"5.14",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"36",kernel:"5.17",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"37",kernel:"6.0",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"Stretch",kernel:"4.9",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/debian"},{distribution:"Buster",kernel:"4.19",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/debian"},{distribution:"Bullseye",kernel:"5.10",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/debian"},{distribution:"7",kernel:"3.10",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/centos"},{distribution:"7 + elrepro",kernel:"5.18",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"8",kernel:"4.18",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/centos"},{distribution:"8 + elrepro",kernel:"5.18",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"Stream 8",kernel:"5.13",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/centos"},{distribution:"Stream8+elrepro",kernel:"5.18",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"Stream 9",kernel:"5.14",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"7",kernel:"3.10.0-123",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.1",kernel:"3.10.0-229",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.2",kernel:"3.10.0-327",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.3",kernel:"3.10.0-514",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.4",kernel:"3.10.0-693",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.5",kernel:"3.10.0-862",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.6",kernel:"3.10.0-957",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.7",kernel:"3.10.0-1062",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.8",kernel:"3.10.0-1127",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.9",kernel:"3.10.0-1160",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8",kernel:"4.18.0-80",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8.1",kernel:"4.18.0-147",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8.2",kernel:"4.18.0-193",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8.3",kernel:"4.18.0-240",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"9",kernel:"5.14.0-70",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/rhel"},{distribution:"11.3",kernel:"3.0.76",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/sles"},{distribution:"11.4",kernel:"3.0.101",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.0",kernel:"3.12",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.1",kernel:"3.12",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.2",kernel:"4.4",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.3",kernel:"4.4",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.4",kernel:"4.12",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15",kernel:"4.12",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.1",kernel:"4.12.14",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.2",kernel:"5.3.18",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.3",kernel:"5.3.18",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.4",kernel:"5.14.21",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.0 (Leap)",kernel:"4.12",zbczac:"No",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.1 (Leap)",kernel:"4.12",zbczac:"No",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.2 (Leap)",kernel:"5.3",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.3 (Leap)",kernel:"5.3",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.4 (Leap)",kernel:"5.14.21",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"Tumbleweed",kernel:"Latest Stable 5.9 +",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"12.04 LTS",kernel:"3.2",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/ubuntu"},{distribution:"14.04 LTS",kernel:"3.13",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/ubuntu"},{distribution:"16.04 LTS",kernel:"4.4",zbczac:"No",nvmezns:"No",nullblk:"No",scsidebug:"No",pathlocation:"/docs/distributions/ubuntu"},{distribution:"18.04 LTS",kernel:"4.15",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/ubuntu"},{distribution:"20.04 LTS",kernel:"5.4",zbczac:"Yes",nvmezns:"No",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/ubuntu"},{distribution:"22.04 LTS",kernel:"5.17",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/ubuntu"},{distribution:"Arch",kernel:"6.1 +",zbczac:"Yes",nvmezns:"Yes",nullblk:"Yes",scsidebug:"Yes",pathlocation:"/docs/distributions/arch"}],t=[{distribution:"34",kernel:"5.11",f2fs:"Yes",zonefs:"Yes",zbczac:"No",zns:"No",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"35",kernel:"5.14",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"36",kernel:"5.14",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"37",kernel:"6.0",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/fedora"},{distribution:"Stretch",kernel:"4.9",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/debian"},{distribution:"Buster",kernel:"4.19",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/debian"},{distribution:"Bullseye",kernel:"5.10",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/debian"},{distribution:"7",kernel:"3.10",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/centos"},{distribution:"7 + elrepro",kernel:"5.18",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"8",kernel:"4.18",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/centos"},{distribution:"8 + elrepro",kernel:"5.18",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"Stream 8",kernel:"5.13",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/centos"},{distribution:"Stream8+elrepro",kernel:"5.18",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"Stream 9",kernel:"5.14",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/centos"},{distribution:"7",kernel:"3.10.0-123",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.1",kernel:"3.10.0-229",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.2",kernel:"3.10.0-327",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.3",kernel:"3.10.0-514",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.4",kernel:"3.10.0-693",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.5",kernel:"3.10.0-862",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.6",kernel:"3.10.0-957",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.7",kernel:"3.10.0-1062",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.8",kernel:"3.10.0-1127",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"7.9",kernel:"3.10.0-1160",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8",kernel:"4.18.0-80",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8.1",kernel:"4.18.0-147",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8.2",kernel:"4.18.0-193",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"8.3",kernel:"4.18.0-240",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/rhel"},{distribution:"9",kernel:"5.14.0-70",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/rhel"},{distribution:"11.3",kernel:"3.0.76",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/sles"},{distribution:"11.4",kernel:"3.0.101",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.0",kernel:"3.12",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.1",kernel:"3.12",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.2",kernel:"4.4",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.3",kernel:"4.4",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/sles"},{distribution:"12.4",kernel:"4.12",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15",kernel:"4.12",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.1",kernel:"4.12.14",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.2",kernel:"5.3.18",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.3",kernel:"5.3.18",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.4",kernel:"5.14.21",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/sles"},{distribution:"15.0 (Leap)",kernel:"4.12",f2fs:"Yes",zonefs:"Yes",zbczac:"No",zns:"No",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.1 (Leap)",kernel:"4.12",f2fs:"Yes",zonefs:"Yes",zbczac:"No",zns:"No",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.2 (Leap)",kernel:"5.3",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.3 (Leap)",kernel:"5.3",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"15.4 (Leap)",kernel:"5.14.21",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"Tumbleweed",kernel:"Latest Stable 5.9 +",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/opensuse"},{distribution:"12.04 LTS",kernel:"3.2",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/ubuntu"},{distribution:"14.04 LTS",kernel:"3.13",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/ubuntu"},{distribution:"16.04 LTS",kernel:"4.4",f2fs:"No",zonefs:"No",zbczac:"No",zns:"No",linear:"No",flakey:"No",zoned:"No",crypt:"No",pathlocation:"/docs/distributions/ubuntu"},{distribution:"18.04 LTS",kernel:"4.15",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/ubuntu"},{distribution:"20.04 LTS",kernel:"5.4",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"No",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/ubuntu"},{distribution:"22.04 LTS",kernel:"5.17",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"No",crypt:"Yes",pathlocation:"/docs/distributions/ubuntu"},{distribution:"Arch",kernel:"6.1 + ",f2fs:"Yes",zonefs:"Yes",zbczac:"Yes",zns:"Yes",linear:"Yes",flakey:"Yes",zoned:"Yes",crypt:"Yes",pathlocation:"/docs/distributions/arch"}];var r=o(5893);function l(){return(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"Distribution Version"}),(0,r.jsx)("th",{children:"Kernel Version"}),(0,r.jsx)("th",{children:"SCSI ZBC and ATA ZAC Support"}),(0,r.jsx)("th",{children:"NVMe ZNS Support"}),(0,r.jsx)("th",{children:(0,r.jsxs)("a",{href:"../getting-started/zbd-emulation#zoned-block-device-emulation-with-null_blk",target:"_blank",children:[(0,r.jsx)("em",{children:"null_blk"})," Zone \xa0 Emulation Support"]})}),(0,r.jsx)("th",{children:(0,r.jsxs)("a",{href:"../getting-started/zbd-emulation#smr-hard-disk-emulation-with-scsi_debug",target:"_blank",children:[(0,r.jsx)("em",{children:"scsi_debug"})," ZBC \xa0 Emulation \xa0Support\xa0"]})})]})}function c(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{colSpan:"2"}),(0,r.jsx)("th",{colSpan:"4",children:"File Systems"}),(0,r.jsx)("th",{colSpan:"4",children:"Device Mapper"})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{rowSpan:"4",children:"Distribution Version"}),(0,r.jsx)("th",{rowSpan:"4",children:"Kernel Version"}),(0,r.jsx)("th",{rowSpan:"4",children:"f2fs"}),(0,r.jsx)("th",{rowSpan:"4",children:"zonefs"}),(0,r.jsx)("th",{colSpan:"2",rowSpan:"3",children:"btrfs"}),(0,r.jsx)("th",{rowSpan:"4",children:"linear"}),(0,r.jsx)("th",{rowSpan:"4",children:"flakey"}),(0,r.jsx)("th",{rowSpan:"4",children:"zoned"}),(0,r.jsx)("th",{rowSpan:"4",children:"crypt"})]}),(0,r.jsx)("tr",{}),(0,r.jsx)("tr",{}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"ZBC/ZAC"}),(0,r.jsx)("th",{children:"ZNS"})]})]})}function d(){let e=(0,n.TH)();return i.filter((s=>s.pathlocation===e.pathname)).map((e=>(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:e.distribution}),(0,r.jsx)("td",{children:e.kernel}),(0,r.jsx)("td",{className:"Yes"===e.zbczac?"background-green":"background-red",children:e.zbczac}),(0,r.jsx)("td",{className:"Yes"===e.nvmezns?"background-green":"background-red",children:e.nvmezns}),(0,r.jsx)("td",{className:"Yes"===e.nullblk?"background-green":"background-red",children:e.nullblk}),(0,r.jsx)("td",{className:"Yes"===e.scsidebug?"background-green":"background-red",children:e.scsidebug})]})))}function a(){let e=(0,n.TH)();return t.filter((s=>s.pathlocation===e.pathname)).map((e=>(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:e.distribution}),(0,r.jsx)("td",{children:e.kernel}),(0,r.jsx)("td",{className:"Yes"===e.f2fs?"background-green":"background-red",children:e.f2fs}),(0,r.jsx)("td",{className:"Yes"===e.zonefs?"background-green":"background-red",children:e.zonefs}),(0,r.jsx)("td",{className:"Yes"===e.zbczac?"background-green":"background-red",children:e.zbczac}),(0,r.jsx)("td",{className:"Yes"===e.zns?"background-green":"background-red",children:e.zns}),(0,r.jsx)("td",{className:"Yes"===e.linear?"background-green":"background-red",children:e.linear}),(0,r.jsx)("td",{className:"Yes"===e.flakey?"background-green":"background-red",children:e.flakey}),(0,r.jsx)("td",{className:"Yes"===e.zoned?"background-green":"background-red",children:e.zoned}),(0,r.jsx)("td",{className:"Yes"===e.crypt?"background-green":"background-red",children:e.crypt})]})))}},1151:(e,s,o)=>{o.d(s,{Z:()=>l,a:()=>r});var n=o(7294);const i={},t=n.createContext(i);function r(e){const s=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),n.createElement(t.Provider,{value:s},e.children)}}}]);