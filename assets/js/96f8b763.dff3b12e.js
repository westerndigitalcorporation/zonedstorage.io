"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[5802],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=p(r),d=a,b=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return r?n.createElement(b,i(i({ref:t},c),{},{components:r})):n.createElement(b,i({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},2657:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const o={id:"index",title:"Overview",sidebar_label:"Overview",slug:"/tools"},i="Tools and Libraries",l={unversionedId:"tools/index",id:"tools/index",title:"Overview",description:"This collection of articles describes user level applications and libraries",source:"@site/docs/tools/index.md",sourceDirName:"tools",slug:"/tools",permalink:"/docs/tools",draft:!1,tags:[],version:"current",frontMatter:{id:"index",title:"Overview",sidebar_label:"Overview",slug:"/tools"},sidebar:"docs",previous:{title:"RocksDB with ZenFS",permalink:"/docs/applications/zenfs"},next:{title:"Linux System Utilities",permalink:"/docs/tools/util-linux"}},s={},p=[],c={toc:p};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"tools-and-libraries"},"Tools and Libraries"),(0,a.kt)("p",null,"This collection of articles describes user level applications and libraries\nsupporting zoned block devices."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/util-linux"},"Linux System Utilities"),": Learn about the icollection of\nLinux","\xae"," utilities supporting zoned block devices.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/sg3utils"},"SCSI Generic Utilities"),": Learn about ZBC feature set support of\nthe SCSI generic package (",(0,a.kt)("em",{parentName:"p"},"sg3utils"),");")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/libzbc"},"libzbc User Library"),": Learn about the programming interface and\ntools provided by the ",(0,a.kt)("em",{parentName:"p"},"libzbc")," user library to manipulate ZBC and ZAC devices.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/libnvme"},"libnvme User Library"),": Learn about the programming interface and\ntools provided by the ",(0,a.kt)("em",{parentName:"p"},"libnvme")," user library to manipulate NVMe controllers\nand namespaces supporting the Zoned Namespace command set.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/libzbd"},"libzbd User Library"),": Learn about the programming interface and\ntools provided by the ",(0,a.kt)("em",{parentName:"p"},"libzbd")," user library to facilitate the management of\nzoned block devices using a kernel including zoned block device support.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/tcmu-runner"},"tcmu-runner ZBC Disk Emulation"),": Learn how to use the\n",(0,a.kt)("em",{parentName:"p"},"tcmu-runner")," SCSI device emulation tool to setup emulated ZBC disks.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/qemu"},"QEMU"),": Learn how to attach zoned block devices to a QEMU guest.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/docs/tools/zns"},"Linux Tools for ZNS"),": Learn about Linux kernel support and tooling\nfor NVM Express' Zoned Namespace (ZNS) Command Set."))))}u.isMDXComponent=!0}}]);