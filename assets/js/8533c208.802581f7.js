"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[1488],{6534:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>d,toc:()=>a});var s=i(5893),t=i(1151);const r={id:"overview",title:"Linux Distributions",sidebar_label:"Overview"},o="Linux Distributions",d={id:"distributions/overview",title:"Linux Distributions",description:"As discussed here, the version and compile time",source:"@site/docs/distributions/overview.md",sourceDirName:"distributions",slug:"/distributions/overview",permalink:"/docs/distributions/overview",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"overview",title:"Linux Distributions",sidebar_label:"Overview"},sidebar:"docs",previous:{title:"MyRocks - ZenFS",permalink:"/docs/benchmarking/myrocks"},next:{title:"Fedora",permalink:"/docs/distributions/fedora"}},l={},a=[{value:"Recommended Linux Distributions",id:"recommended-linux-distributions",level:2},{value:"Other Linux Distributions",id:"other-linux-distributions",level:2},{value:"Checking a Linux Distribution",id:"checking-a-linux-distribution",level:2},{value:"<em>zbd-tools</em> Overview",id:"zbd-tools-overview",level:3},{value:"Example",id:"example",level:3}];function c(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"linux-distributions",children:"Linux Distributions"}),"\n",(0,s.jsxs)(n.p,{children:["As discussed ",(0,s.jsx)(n.a,{href:"/docs/linux/overview",children:"here"}),", the version and compile time\nconfiguration of a Linux\xae kernel enable support for zoned block\ndevices and the features supported. Different Linux distributions are\nconfigured differently, leading to varying levels of support for zoned\nstorage out of the box."]}),"\n",(0,s.jsx)(n.h2,{id:"recommended-linux-distributions",children:"Recommended Linux Distributions"}),"\n",(0,s.jsx)(n.p,{children:"Recent versions of the following Linux distributions provide very good\nsupport for zoned storage. The support provided by the precompiled\nbinary kernels shipped is complete, and zoned storage related binary\npackages are available. Their use is recommended to facilitate\ndevelopment and testing of applications."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/fedora",children:"Fedora"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/opensuse",children:"openSuse"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"other-linux-distributions",children:"Other Linux Distributions"}),"\n",(0,s.jsx)(n.p,{children:"All major Linux distributions provide some level of zoned storage\nsupport. Use the following links to learn more."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/ubuntu",children:"Ubuntu"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/debian",children:"Debian"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/sles",children:"SLES"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/centos",children:"CentOS"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/rhel",children:"RHEL"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/distributions/arch",children:"Arch Linux"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"checking-a-linux-distribution",children:"Checking a Linux Distribution"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsxs)("a",{href:"https://github.com/westerndigitalcorporation/zbd-tools",target:"_blank",children:[(0,s.jsx)(n.em,{children:"zbd-tools"})," project"]})," hosted on GitHub provides the\n",(0,s.jsx)(n.em,{children:"zbd-check"})," utility to facilitate determining the zoned storage related\nfeatures, libraries and applications that a Linux distribution supports."]}),"\n",(0,s.jsxs)(n.h3,{id:"zbd-tools-overview",children:[(0,s.jsx)(n.em,{children:"zbd-tools"})," Overview"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zbd-tools"})," provides the ",(0,s.jsx)(n.em,{children:"zbd-check"})," utility. This command line tool\nchecks the following:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Kernel features enabled: zoned block device types supported (SMR,\nNVMe ZNS, ",(0,s.jsx)(n.em,{children:"nullblk"}),", etc.), file systems and device mapper targets."]}),"\n",(0,s.jsx)(n.li,{children:"Presence of the kernel zone management API header file."}),"\n",(0,s.jsx)(n.li,{children:"User libraries installed."}),"\n",(0,s.jsx)(n.li,{children:"User applications installed."}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["All checks are performed for the system where ",(0,s.jsx)(n.em,{children:"zbd-check"})," is executed."]}),"\n",(0,s.jsxs)(n.p,{children:["To learn more about how to install and use ",(0,s.jsx)(n.em,{children:"zbd-check"}),",\nsee ",(0,s.jsx)("a",{href:"https://github.com/westerndigitalcorporation/zbd-tools/blob\n/master/README.md",target:"_blank",children:"the project README file"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"example",children:"Example"}),"\n",(0,s.jsxs)(n.p,{children:["The following shows an example of the information provided by\n",(0,s.jsx)(n.em,{children:"zbd-check"})," when executed on a Fedora 37 system with all zoned storage\nrelated packages installed."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"$ zbd-check\n------------------------------------------------------------------------\nSystem Information:\n------------------------------------------------------------------------\n- Distribution: Fedora Linux 37 (Workstation Edition)\n- Kernel Version: 6.0\n\n------------------------------------------------------------------------\nKernel features:\n------------------------------------------------------------------------\n- Zoned block devices: supported\n- Devices types:\n    - SAS and SATA SMR hard-disks: supported\n    - NVMe ZNS devices: supported\n    - SCSI debug device ZBC emulation: supported\n    - null_blk device zoned mode: supported\n- file systems:\n    - zonefs: supported\n    - f2fs zoned mode: supported\n    - btrfs zoned mode: supported\n- Device mapper targets:\n    - dm-linear: supported\n    - dm-flakey: supported\n    - dm-crypt: supported\n    - dm-zoned: supported\n\n------------------------------------------------------------------------\nUser Kernel zone management API:\n------------------------------------------------------------------------\n- Zone management kernel API header file: installed\n\n------------------------------------------------------------------------\nUser Libraries:\n------------------------------------------------------------------------\n- libzbc:\n    - Dynamic library installed, version 5.13.0\n    - Static library installed\n    - Development header files installed\n- libzbd:\n    - Dynamic library installed, version 2.0.2\n    - Static library installed\n    - Development header files installed\n- libnvme:\n    - Dynamic library installed, version 1.2\n    - Static library not installed\n    - Development header files installed\n\n------------------------------------------------------------------------\nUser Applications:\n------------------------------------------------------------------------\n- fio: installed, version fio-3.29-7-g01686\n- nvme-cli: installed, version 2.2.1\n- dm-zoned-tools: installed, version 2.2.1\n- zonefs-tools: installed, version 1.5.2\n"})})]})}function u(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>d,a:()=>o});var s=i(7294);const t={},r=s.createContext(t);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);