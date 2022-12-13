"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[4467],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>u});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var m=r.createContext({}),s=function(e){var t=r.useContext(m),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=s(e.components);return r.createElement(m.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,m=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),p=s(n),f=a,u=p["".concat(m,".").concat(f)]||p[f]||c[f]||i;return n?r.createElement(u,o(o({ref:t},d),{},{components:n})):r.createElement(u,o({ref:t},d))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=f;var l={};for(var m in t)hasOwnProperty.call(t,m)&&(l[m]=t[m]);l.originalType=e,l[p]="string"==typeof e?e:a,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},3769:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var r=n(7462),a=(n(7294),n(3905));const i={id:"libnvme",title:"libnvme User Library",sidebar_label:"libnvme User Library"},o="libnvme User Library",l={unversionedId:"tools/libnvme",id:"tools/libnvme",title:"libnvme User Library",description:"libnvme is an open source user library that provides definitions and functions",source:"@site/docs/tools/libnvme.md",sourceDirName:"tools",slug:"/tools/libnvme",permalink:"/docs/tools/libnvme",draft:!1,tags:[],version:"current",frontMatter:{id:"libnvme",title:"libnvme User Library",sidebar_label:"libnvme User Library"},sidebar:"docs",previous:{title:"libzbd User Library",permalink:"/docs/tools/libzbd"},next:{title:"tcmu-runner ZBC Disk Emulation",permalink:"/docs/tools/tcmu-runner"}},m={},s=[{value:"Overview",id:"overview",level:2},{value:"Library Functions",id:"library-functions",level:2},{value:"Library Types",id:"library-types",level:2},{value:"Additional Documentation",id:"additional-documentation",level:2}],d={toc:s};function p(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"libnvme-user-library"},"libnvme User Library"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"libnvme")," is an open source user library that provides definitions and functions\nfor interacting with nvme devices. ",(0,a.kt)("inlineCode",{parentName:"p"},"nvme-cli")," provides convenient ways for a\nuser to interact with nvme devices from the shell, and libnvme provides\nsimiliar access for other programs."),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"libnvme")," provides functions for discovering and managing all nvme devices in a\nLinux environment. When the NVMe ZNS specification was ratified, libnvme\nincorporated definitions for all the types and commands that the NVMe ZNS\nspecification provides."),(0,a.kt)("p",null,"The library can be used to construct nvme passthrough commands and to dispatch\nthese through the Linux nvme driver. For commands that return data, the library\nprovides structures and enumerations to help decode the payloads."),(0,a.kt)("h2",{id:"library-functions"},"Library Functions"),(0,a.kt)("p",null,"All of the ZNS functions provided by ",(0,a.kt)("em",{parentName:"p"},"libnvme")," are prefixed with the\n",(0,a.kt)("inlineCode",{parentName:"p"},"nvme_zns_")," name.  The following are the admin commands defined from the ZNS\nspecifcation:"),(0,a.kt)("center",null,(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Function"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_identify_ns()"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Retrieves the nvme_zns_id_ns structure")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_identify_ctrl()"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Retrieves the nvme_zns_id_ctrl structure")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_get_log_changed_zones()"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Retrieves the nvme_zns_changed_zone_log structure"))))),(0,a.kt)("p",null,"In addition to admin commands, ZNS also defines new IO commands, and ",(0,a.kt)("em",{parentName:"p"},"libnvme"),"\nprovides the following APIs to send them:"),(0,a.kt)("center",null,(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Function"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_append()"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Append data to a zone")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_mgmt_send()"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Requests an action on one or all zones")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_mgmt_recv()"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Returns data containing information about zones"))))),(0,a.kt)("p",null,"Here is a list of the types of actions that the ",(0,a.kt)("inlineCode",{parentName:"p"},"nvme_zns_mgmt_send()")," function\ncan perform: "),(0,a.kt)("center",null,(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Action"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"NVME_ZNS_ZSA_CLOSE"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Sets the zone state to Close")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"NVME_ZNS_ZSA_FINISH"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Sets the zone state to Full")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"NVME_ZNS_ZSA_OPEN"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Sets the zone state to Open")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"NVME_ZNS_ZSA_RESET"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Sets the zone state to Empty")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"NVME_ZNS_ZSA_OFFLINE"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Sets the zone state to Offline")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"NVME_ZNS_ZSA_SET_DESC_EXT"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Sets the zone descriptor extention data, if available"))))),(0,a.kt)("h2",{id:"library-types"},"Library Types"),(0,a.kt)("p",null,"ZNS created new constant types and structures. The following are the structures\nprovided by ",(0,a.kt)("em",{parentName:"p"},"libnvme")," from the ZNS specification:"),(0,a.kt)("center",null,(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Structure"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_id_ns"),(0,a.kt)("td",{parentName:"tr",align:"left"},"ZNS specific Namespace Identification, returned from nvme_zns_identify_ns()")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_id_ctrl"),(0,a.kt)("td",{parentName:"tr",align:"left"},"ZNS specific Controller Identification, returned from nvme_zns_identify_ctrl()")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zns_changed_zone_log"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Log page that indicaties if a zone descriptor has changed for one or more zones, returned from nvme_zns_get_log_changed_zones()")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"nvme_zone_report"),(0,a.kt)("td",{parentName:"tr",align:"left"},"Provides the structure returned from a ZNS Report Zones command, returned from nvme_zns_mgmt_recv()"))))),(0,a.kt)("h2",{id:"additional-documentation"},"Additional Documentation"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"libnvme")," provides more detailed documentation for all functions and types in\nhtml and man pages."))}p.isMDXComponent=!0}}]);