(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[7918],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>m,kt:()=>p});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var c=a.createContext({}),i=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=i(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,c=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),u=i(n),p=l,g=u["".concat(c,".").concat(p)]||u[p]||d[p]||r;return n?a.createElement(g,o(o({ref:t},m),{},{components:n})):a.createElement(g,o({ref:t},m))}));function p(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,o=new Array(r);o[0]=u;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:l,o[1]=s;for(var i=2;i<r;i++)o[i]=n[i];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1994:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>Et});var a=n(7294),l=n(6010),r=n(1944),o=n(7524),s=n(5281),c=n(7462),i=n(5999),m=n(9960);function d(e){const{permalink:t,title:n,subLabel:r,isNext:o}=e;return a.createElement(m.Z,{className:(0,l.Z)("pagination-nav__link",o?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},r&&a.createElement("div",{className:"pagination-nav__sublabel"},r),a.createElement("div",{className:"pagination-nav__label"},n))}function u(e){const{previous:t,next:n}=e;return a.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,i.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},t&&a.createElement(d,(0,c.Z)({},t,{subLabel:a.createElement(i.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),n&&a.createElement(d,(0,c.Z)({},n,{subLabel:a.createElement(i.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}var p=n(2263),g=n(4104),h=n(373),f=n(4477);const b={unreleased:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(i.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(i.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function v(e){const t=b[e.versionMetadata.banner];return a.createElement(t,e)}function E(e){let{versionLabel:t,to:n,onClick:l}=e;return a.createElement(i.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:a.createElement("b",null,a.createElement(m.Z,{to:n,onClick:l},a.createElement(i.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function y(e){let{className:t,versionMetadata:n}=e;const{siteConfig:{title:r}}=(0,p.Z)(),{pluginId:o}=(0,g.gA)({failfast:!0}),{savePreferredVersionName:c}=(0,h.J)(o),{latestDocSuggestion:i,latestVersionSuggestion:m}=(0,g.Jo)(o),d=null!=i?i:(u=m).docs.find((e=>e.id===u.mainDocId));var u;return a.createElement("div",{className:(0,l.Z)(t,s.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},a.createElement("div",null,a.createElement(v,{siteTitle:r,versionMetadata:n})),a.createElement("div",{className:"margin-top--md"},a.createElement(E,{versionLabel:m.label,to:d.path,onClick:()=>c(m.name)})))}function k(e){let{className:t}=e;const n=(0,f.E)();return n.banner?a.createElement(y,{className:t,versionMetadata:n}):null}function N(e){let{className:t}=e;const n=(0,f.E)();return n.badge?a.createElement("span",{className:(0,l.Z)(t,s.k.docs.docVersionBadge,"badge badge--secondary")},a.createElement(i.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:n.label}},"Version: {versionLabel}")):null}function L(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:n}=e;return a.createElement(i.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:a.createElement("b",null,a.createElement("time",{dateTime:new Date(1e3*t).toISOString()},n))}}," on {date}")}function C(e){let{lastUpdatedBy:t}=e;return a.createElement(i.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:a.createElement("b",null,t)}}," by {user}")}function _(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:n,lastUpdatedBy:l}=e;return a.createElement("span",{className:s.k.common.lastUpdated},a.createElement(i.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&n?a.createElement(L,{lastUpdatedAt:t,formattedLastUpdatedAt:n}):"",byUser:l?a.createElement(C,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}const T="iconEdit_eYIM";function Z(e){let{className:t,...n}=e;return a.createElement("svg",(0,c.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,l.Z)(T,t),"aria-hidden":"true"},n),a.createElement("g",null,a.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function w(e){let{editUrl:t}=e;return a.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:s.k.common.editThisPage},a.createElement(Z,null),a.createElement(i.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}const B="tag_zVej",x="tagRegular_sFm0",O="tagWithCount_h2kH";function j(e){let{permalink:t,label:n,count:r}=e;return a.createElement(m.Z,{href:t,className:(0,l.Z)(B,r?O:x)},n,r&&a.createElement("span",null,r))}const A="tags_jXut",H="tag_QGVx";function S(e){let{tags:t}=e;return a.createElement(a.Fragment,null,a.createElement("b",null,a.createElement(i.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),a.createElement("ul",{className:(0,l.Z)(A,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:n}=e;return a.createElement("li",{key:n,className:H},a.createElement(j,{label:t,permalink:n}))}))))}const I="lastUpdated_vbeJ";function P(e){return a.createElement("div",{className:(0,l.Z)(s.k.docs.docFooterTagsRow,"row margin-bottom--sm")},a.createElement("div",{className:"col"},a.createElement(S,e)))}function U(e){let{editUrl:t,lastUpdatedAt:n,lastUpdatedBy:r,formattedLastUpdatedAt:o}=e;return a.createElement("div",{className:(0,l.Z)(s.k.docs.docFooterEditMetaRow,"row")},a.createElement("div",{className:"col"},t&&a.createElement(w,{editUrl:t})),a.createElement("div",{className:(0,l.Z)("col",I)},(n||r)&&a.createElement(_,{lastUpdatedAt:n,formattedLastUpdatedAt:o,lastUpdatedBy:r})))}function M(e){const{content:t}=e,{metadata:n}=t,{editUrl:r,lastUpdatedAt:o,formattedLastUpdatedAt:c,lastUpdatedBy:i,tags:m}=n,d=m.length>0,u=!!(r||o||i);return d||u?a.createElement("footer",{className:(0,l.Z)(s.k.docs.docFooter,"docusaurus-mt-lg")},d&&a.createElement(P,{tags:m}),u&&a.createElement(U,{editUrl:r,lastUpdatedAt:o,lastUpdatedBy:i,formattedLastUpdatedAt:c})):null}var V=n(6668);function D(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const a=n.slice(2,e.level);e.parentIndex=Math.max(...a),n[e.level]=t}));const a=[];return t.forEach((e=>{const{parentIndex:n,...l}=e;n>=0?t[n].children.push(l):a.push(l)})),a}function z(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:a}=e;return t.flatMap((e=>{const t=z({toc:e.children,minHeadingLevel:n,maxHeadingLevel:a});return function(e){return e.level>=n&&e.level<=a}(e)?[{...e,children:t}]:t}))}function R(e){const t=e.getBoundingClientRect();return t.top===t.bottom?R(e.parentNode):t}function W(e,t){var n;let{anchorTopOffset:a}=t;const l=e.find((e=>R(e).top>=a));if(l){var r;return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(R(l))?l:null!=(r=e[e.indexOf(l)-1])?r:null}return null!=(n=e[e.length-1])?n:null}function F(){const e=(0,a.useRef)(0),{navbar:{hideOnScroll:t}}=(0,V.L)();return(0,a.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function q(e){const t=(0,a.useRef)(void 0),n=F();(0,a.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:a,linkActiveClassName:l,minHeadingLevel:r,maxHeadingLevel:o}=e;function s(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(a),s=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const a=[];for(let l=t;l<=n;l+=1)a.push("h"+l+".anchor");return Array.from(document.querySelectorAll(a.join()))}({minHeadingLevel:r,maxHeadingLevel:o}),c=W(s,{anchorTopOffset:n.current}),i=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(l),e.classList.add(l),t.current=e):e.classList.remove(l)}(e,e===i)}))}return document.addEventListener("scroll",s),document.addEventListener("resize",s),s(),()=>{document.removeEventListener("scroll",s),document.removeEventListener("resize",s)}}),[e,n])}function G(e){let{toc:t,className:n,linkClassName:l,isChild:r}=e;return t.length?a.createElement("ul",{className:r?void 0:n},t.map((e=>a.createElement("li",{key:e.id},a.createElement("a",{href:"#"+e.id,className:null!=l?l:void 0,dangerouslySetInnerHTML:{__html:e.value}}),a.createElement(G,{isChild:!0,toc:e.children,className:n,linkClassName:l}))))):null}const J=a.memo(G);function Y(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:l="table-of-contents__link",linkActiveClassName:r,minHeadingLevel:o,maxHeadingLevel:s,...i}=e;const m=(0,V.L)(),d=null!=o?o:m.tableOfContents.minHeadingLevel,u=null!=s?s:m.tableOfContents.maxHeadingLevel,p=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:l}=e;return(0,a.useMemo)((()=>z({toc:D(t),minHeadingLevel:n,maxHeadingLevel:l})),[t,n,l])}({toc:t,minHeadingLevel:d,maxHeadingLevel:u});return q((0,a.useMemo)((()=>{if(l&&r)return{linkClassName:l,linkActiveClassName:r,minHeadingLevel:d,maxHeadingLevel:u}}),[l,r,d,u])),a.createElement(J,(0,c.Z)({toc:p,className:n,linkClassName:l},i))}const $="tableOfContents_bqdL";function X(e){let{className:t,...n}=e;return a.createElement("div",{className:(0,l.Z)($,"thin-scrollbar",t)},a.createElement(Y,(0,c.Z)({},n,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}var K=n(6043);const Q="tocCollapsibleButton_TO0P",ee="tocCollapsibleButtonExpanded_MG3E";function te(e){let{collapsed:t,...n}=e;return a.createElement("button",(0,c.Z)({type:"button"},n,{className:(0,l.Z)("clean-btn",Q,!t&&ee,n.className)}),a.createElement(i.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page"))}const ne="tocCollapsible_ETCw",ae="tocCollapsibleContent_vkbj",le="tocCollapsibleExpanded_sAul";function re(e){let{toc:t,className:n,minHeadingLevel:r,maxHeadingLevel:o}=e;const{collapsed:s,toggleCollapsed:c}=(0,K.u)({initialState:!0});return a.createElement("div",{className:(0,l.Z)(ne,!s&&le,n)},a.createElement(te,{collapsed:s,onClick:c}),a.createElement(K.z,{lazy:!0,className:ae,collapsed:s},a.createElement(Y,{toc:t,minHeadingLevel:r,maxHeadingLevel:o})))}const oe="anchorWithStickyNavbar_LWe7",se="anchorWithHideOnScrollNavbar_WYt5";function ce(e){let{as:t,id:n,...r}=e;const{navbar:{hideOnScroll:o}}=(0,V.L)();return"h1"!==t&&n?a.createElement(t,(0,c.Z)({},r,{className:(0,l.Z)("anchor",o?se:oe),id:n}),r.children,a.createElement("a",{className:"hash-link",href:"#"+n,title:(0,i.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):a.createElement(t,(0,c.Z)({},r,{id:void 0}))}var ie=n(2802),me=n(8596),de=n(4996);function ue(e){return a.createElement("svg",(0,c.Z)({viewBox:"0 0 24 24"},e),a.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}const pe={breadcrumbsContainer:"breadcrumbsContainer_Z_bl",breadcrumbHomeIcon:"breadcrumbHomeIcon_OVgt"};function ge(e){let{children:t,href:n,isLast:l}=e;const r="breadcrumbs__link";return l?a.createElement("span",{className:r,itemProp:"name"},t):n?a.createElement(m.Z,{className:r,href:n,itemProp:"item"},a.createElement("span",{itemProp:"name"},t)):a.createElement("span",{className:r},t)}function he(e){let{children:t,active:n,index:r,addMicrodata:o}=e;return a.createElement("li",(0,c.Z)({},o&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,l.Z)("breadcrumbs__item",{"breadcrumbs__item--active":n})}),t,a.createElement("meta",{itemProp:"position",content:String(r+1)}))}function fe(){const e=(0,de.Z)("/");return a.createElement("li",{className:"breadcrumbs__item"},a.createElement(m.Z,{"aria-label":(0,i.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:(0,l.Z)("breadcrumbs__link",pe.breadcrumbsItemLink),href:e},a.createElement(ue,{className:pe.breadcrumbHomeIcon})))}function be(){const e=(0,ie.s1)(),t=(0,me.Ns)();return e?a.createElement("nav",{className:(0,l.Z)(s.k.docs.docBreadcrumbs,pe.breadcrumbsContainer),"aria-label":(0,i.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},a.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&a.createElement(fe,null),e.map(((t,n)=>{const l=n===e.length-1;return a.createElement(he,{key:n,active:l,index:n,addMicrodata:!!t.href},a.createElement(ge,{href:t.href,isLast:l},t.label))})))):null}var ve=n(3905),Ee=n(5742);var ye=n(2389),ke=n(2949);function Ne(){const{prism:e}=(0,V.L)(),{colorMode:t}=(0,ke.I)(),n=e.theme,a=e.darkTheme||n;return"dark"===t?a:n}var Le=n(7594),Ce=n.n(Le);const _e=/title=(?<quote>["'])(?<title>.*?)\1/,Te=/\{(?<range>[\d,-]+)\}/,Ze={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}};function we(e,t){const n=e.map((e=>{const{start:n,end:a}=Ze[e];return"(?:"+n+"\\s*("+t.flatMap((e=>{var t,n;return[e.line,null==(t=e.block)?void 0:t.start,null==(n=e.block)?void 0:n.end].filter(Boolean)})).join("|")+")\\s*"+a+")"})).join("|");return new RegExp("^\\s*(?:"+n+")\\s*$")}function Be(e,t){let n=e.replace(/\n$/,"");const{language:a,magicComments:l,metastring:r}=t;if(r&&Te.test(r)){const e=r.match(Te).groups.range;if(0===l.length)throw new Error("A highlight range has been given in code block's metastring (``` "+r+"), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.");const t=l[0].className,a=Ce()(e).filter((e=>e>0)).map((e=>[e-1,[t]]));return{lineClassNames:Object.fromEntries(a),code:n}}if(void 0===a)return{lineClassNames:{},code:n};const o=function(e,t){switch(e){case"js":case"javascript":case"ts":case"typescript":return we(["js","jsBlock"],t);case"jsx":case"tsx":return we(["js","jsBlock","jsx"],t);case"html":return we(["js","jsBlock","html"],t);case"python":case"py":case"bash":return we(["bash"],t);case"markdown":case"md":return we(["html","jsx","bash"],t);default:return we(Object.keys(Ze),t)}}(a,l),s=n.split("\n"),c=Object.fromEntries(l.map((e=>[e.className,{start:0,range:""}]))),i=Object.fromEntries(l.filter((e=>e.line)).map((e=>{let{className:t,line:n}=e;return[n,t]}))),m=Object.fromEntries(l.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.start,t]}))),d=Object.fromEntries(l.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.end,t]})));for(let p=0;p<s.length;){const e=s[p].match(o);if(!e){p+=1;continue}const t=e.slice(1).find((e=>void 0!==e));i[t]?c[i[t]].range+=p+",":m[t]?c[m[t]].start=p:d[t]&&(c[d[t]].range+=c[d[t]].start+"-"+(p-1)+","),s.splice(p,1)}n=s.join("\n");const u={};return Object.entries(c).forEach((e=>{let[t,{range:n}]=e;Ce()(n).forEach((e=>{null!=u[e]||(u[e]=[]),u[e].push(t)}))})),{lineClassNames:u,code:n}}const xe="codeBlockContainer_Ckt0";function Oe(e){let{as:t,...n}=e;const r=function(e){const t={color:"--prism-color",backgroundColor:"--prism-background-color"},n={};return Object.entries(e.plain).forEach((e=>{let[a,l]=e;const r=t[a];r&&"string"==typeof l&&(n[r]=l)})),n}(Ne());return a.createElement(t,(0,c.Z)({},n,{style:r,className:(0,l.Z)(n.className,xe,s.k.common.codeBlock)}))}const je={codeBlockContent:"codeBlockContent_biex",codeBlockTitle:"codeBlockTitle_Ktv7",codeBlock:"codeBlock_bY9V",codeBlockStandalone:"codeBlockStandalone_MEMb",codeBlockLines:"codeBlockLines_e6Vv",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_o6Pm",buttonGroup:"buttonGroup__atx"};function Ae(e){let{children:t,className:n}=e;return a.createElement(Oe,{as:"pre",tabIndex:0,className:(0,l.Z)(je.codeBlockStandalone,"thin-scrollbar",n)},a.createElement("code",{className:je.codeBlockLines},t))}const He={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","atrule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]};var Se={Prism:n(7410).Z,theme:He};function Ie(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Pe(){return Pe=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Pe.apply(this,arguments)}var Ue=/\r\n|\r|\n/,Me=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},Ve=function(e,t){var n=e.length;return n>0&&e[n-1]===t?e:e.concat(t)},De=function(e,t){var n=e.plain,a=Object.create(null),l=e.styles.reduce((function(e,n){var a=n.languages,l=n.style;return a&&!a.includes(t)||n.types.forEach((function(t){var n=Pe({},e[t],l);e[t]=n})),e}),a);return l.root=n,l.plain=Pe({},n,{backgroundColor:null}),l};function ze(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&-1===t.indexOf(a)&&(n[a]=e[a]);return n}const Re=function(e){function t(){for(var t=this,n=[],a=arguments.length;a--;)n[a]=arguments[a];e.apply(this,n),Ie(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var n=e.theme?De(e.theme,e.language):void 0;return t.themeDict=n})),Ie(this,"getLineProps",(function(e){var n=e.key,a=e.className,l=e.style,r=Pe({},ze(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),o=t.getThemeDict(t.props);return void 0!==o&&(r.style=o.plain),void 0!==l&&(r.style=void 0!==r.style?Pe({},r.style,l):l),void 0!==n&&(r.key=n),a&&(r.className+=" "+a),r})),Ie(this,"getStyleForToken",(function(e){var n=e.types,a=e.empty,l=n.length,r=t.getThemeDict(t.props);if(void 0!==r){if(1===l&&"plain"===n[0])return a?{display:"inline-block"}:void 0;if(1===l&&!a)return r[n[0]];var o=a?{display:"inline-block"}:{},s=n.map((function(e){return r[e]}));return Object.assign.apply(Object,[o].concat(s))}})),Ie(this,"getTokenProps",(function(e){var n=e.key,a=e.className,l=e.style,r=e.token,o=Pe({},ze(e,["key","className","style","token"]),{className:"token "+r.types.join(" "),children:r.content,style:t.getStyleForToken(r),key:void 0});return void 0!==l&&(o.style=void 0!==o.style?Pe({},o.style,l):l),void 0!==n&&(o.key=n),a&&(o.className+=" "+a),o})),Ie(this,"tokenize",(function(e,t,n,a){var l={code:t,grammar:n,language:a,tokens:[]};e.hooks.run("before-tokenize",l);var r=l.tokens=e.tokenize(l.code,l.grammar,l.language);return e.hooks.run("after-tokenize",l),r}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,n=e.language,a=e.code,l=e.children,r=this.getThemeDict(this.props),o=t.languages[n];return l({tokens:function(e){for(var t=[[]],n=[e],a=[0],l=[e.length],r=0,o=0,s=[],c=[s];o>-1;){for(;(r=a[o]++)<l[o];){var i=void 0,m=t[o],d=n[o][r];if("string"==typeof d?(m=o>0?m:["plain"],i=d):(m=Ve(m,d.type),d.alias&&(m=Ve(m,d.alias)),i=d.content),"string"==typeof i){var u=i.split(Ue),p=u.length;s.push({types:m,content:u[0]});for(var g=1;g<p;g++)Me(s),c.push(s=[]),s.push({types:m,content:u[g]})}else o++,t.push(m),n.push(i),a.push(0),l.push(i.length)}o--,t.pop(),n.pop(),a.pop(),l.pop()}return Me(s),c}(void 0!==o?this.tokenize(t,a,o,n):[a]),className:"prism-code language-"+n,style:void 0!==r?r.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(a.Component),We="codeLine_lJS_",Fe="codeLineNumber_Tfdd",qe="codeLineContent_feaV";function Ge(e){let{line:t,classNames:n,showLineNumbers:r,getLineProps:o,getTokenProps:s}=e;1===t.length&&"\n"===t[0].content&&(t[0].content="");const i=o({line:t,className:(0,l.Z)(n,r&&We)}),m=t.map(((e,t)=>a.createElement("span",(0,c.Z)({key:t},s({token:e,key:t})))));return a.createElement("span",i,r?a.createElement(a.Fragment,null,a.createElement("span",{className:Fe}),a.createElement("span",{className:qe},m)):a.createElement(a.Fragment,null,m,a.createElement("br",null)))}const Je={copyButtonCopied:"copyButtonCopied_obH4",copyButtonIcons:"copyButtonIcons_eSgA",copyButtonIcon:"copyButtonIcon_y97N",copyButtonSuccessIcon:"copyButtonSuccessIcon_LjdS"};function Ye(e){let{code:t,className:n}=e;const[r,o]=(0,a.useState)(!1),s=(0,a.useRef)(void 0),c=(0,a.useCallback)((()=>{!function(e,t){let{target:n=document.body}=void 0===t?{}:t;const a=document.createElement("textarea"),l=document.activeElement;a.value=e,a.setAttribute("readonly",""),a.style.contain="strict",a.style.position="absolute",a.style.left="-9999px",a.style.fontSize="12pt";const r=document.getSelection();let o=!1;r.rangeCount>0&&(o=r.getRangeAt(0)),n.append(a),a.select(),a.selectionStart=0,a.selectionEnd=e.length;let s=!1;try{s=document.execCommand("copy")}catch{}a.remove(),o&&(r.removeAllRanges(),r.addRange(o)),l&&l.focus()}(t),o(!0),s.current=window.setTimeout((()=>{o(!1)}),1e3)}),[t]);return(0,a.useEffect)((()=>()=>window.clearTimeout(s.current)),[]),a.createElement("button",{type:"button","aria-label":r?(0,i.I)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,i.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,i.I)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,l.Z)("clean-btn",n,Je.copyButton,r&&Je.copyButtonCopied),onClick:c},a.createElement("span",{className:Je.copyButtonIcons,"aria-hidden":"true"},a.createElement("svg",{className:Je.copyButtonIcon,viewBox:"0 0 24 24"},a.createElement("path",{d:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"})),a.createElement("svg",{className:Je.copyButtonSuccessIcon,viewBox:"0 0 24 24"},a.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))))}const $e="wordWrapButtonIcon_Bwma",Xe="wordWrapButtonEnabled_EoeP";function Ke(e){let{className:t,onClick:n,isEnabled:r}=e;const o=(0,i.I)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return a.createElement("button",{type:"button",onClick:n,className:(0,l.Z)("clean-btn",t,r&&Xe),"aria-label":o,title:o},a.createElement("svg",{className:$e,viewBox:"0 0 24 24","aria-hidden":"true"},a.createElement("path",{fill:"currentColor",d:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"})))}function Qe(e){var t;let{children:n,className:r="",metastring:o,title:s,showLineNumbers:i,language:m}=e;const{prism:{defaultLanguage:d,magicComments:u}}=(0,V.L)(),p=null!=(t=null!=m?m:function(e){const t=e.split(" ").find((e=>e.startsWith("language-")));return null==t?void 0:t.replace(/language-/,"")}(r))?t:d,g=Ne(),h=function(){const[e,t]=(0,a.useState)(!1),[n,l]=(0,a.useState)(!1),r=(0,a.useRef)(null),o=(0,a.useCallback)((()=>{const n=r.current.querySelector("code");e?n.removeAttribute("style"):n.style.whiteSpace="pre-wrap",t((e=>!e))}),[r,e]),s=(0,a.useCallback)((()=>{const{scrollWidth:e,clientWidth:t}=r.current,n=e>t||r.current.querySelector("code").hasAttribute("style");l(n)}),[r]);return(0,a.useEffect)((()=>{s()}),[e,s]),(0,a.useEffect)((()=>(window.addEventListener("resize",s,{passive:!0}),()=>{window.removeEventListener("resize",s)})),[s]),{codeBlockRef:r,isEnabled:e,isCodeScrollable:n,toggle:o}}(),f=function(e){var t,n;return null!=(t=null==e||null==(n=e.match(_e))?void 0:n.groups.title)?t:""}(o)||s,{lineClassNames:b,code:v}=Be(n,{metastring:o,language:p,magicComments:u}),E=null!=i?i:function(e){return Boolean(null==e?void 0:e.includes("showLineNumbers"))}(o);return a.createElement(Oe,{as:"div",className:(0,l.Z)(r,p&&!r.includes("language-"+p)&&"language-"+p)},f&&a.createElement("div",{className:je.codeBlockTitle},f),a.createElement("div",{className:je.codeBlockContent},a.createElement(Re,(0,c.Z)({},Se,{theme:g,code:v,language:null!=p?p:"text"}),(e=>{let{className:t,tokens:n,getLineProps:r,getTokenProps:o}=e;return a.createElement("pre",{tabIndex:0,ref:h.codeBlockRef,className:(0,l.Z)(t,je.codeBlock,"thin-scrollbar")},a.createElement("code",{className:(0,l.Z)(je.codeBlockLines,E&&je.codeBlockLinesWithNumbering)},n.map(((e,t)=>a.createElement(Ge,{key:t,line:e,getLineProps:r,getTokenProps:o,classNames:b[t],showLineNumbers:E})))))})),a.createElement("div",{className:je.buttonGroup},(h.isEnabled||h.isCodeScrollable)&&a.createElement(Ke,{className:je.codeButton,onClick:()=>h.toggle(),isEnabled:h.isEnabled}),a.createElement(Ye,{className:je.codeButton,code:v}))))}function et(e){let{children:t,...n}=e;const l=(0,ye.Z)(),r=function(e){return a.Children.toArray(e).some((e=>(0,a.isValidElement)(e)))?e:Array.isArray(e)?e.join(""):e}(t),o="string"==typeof r?Qe:Ae;return a.createElement(o,(0,c.Z)({key:String(l)},n),r)}const tt="details_lb9f",nt="isBrowser_bmU9",at="collapsibleContent_i85q";function lt(e){return!!e&&("SUMMARY"===e.tagName||lt(e.parentElement))}function rt(e,t){return!!e&&(e===t||rt(e.parentElement,t))}function ot(e){let{summary:t,children:n,...r}=e;const o=(0,ye.Z)(),s=(0,a.useRef)(null),{collapsed:i,setCollapsed:m}=(0,K.u)({initialState:!r.open}),[d,u]=(0,a.useState)(r.open);return a.createElement("details",(0,c.Z)({},r,{ref:s,open:d,"data-collapsed":i,className:(0,l.Z)(tt,o&&nt,r.className),onMouseDown:e=>{lt(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;lt(t)&&rt(t,s.current)&&(e.preventDefault(),i?(m(!1),u(!0)):m(!0))}}),null!=t?t:a.createElement("summary",null,"Details"),a.createElement(K.z,{lazy:!1,collapsed:i,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{m(e),u(!e)}},a.createElement("div",{className:at},n)))}const st="details_b_Ee";function ct(e){let{...t}=e;return a.createElement(ot,(0,c.Z)({},t,{className:(0,l.Z)("alert alert--info",st,t.className)}))}function it(e){return a.createElement(ce,e)}const mt="containsTaskList_mC6p";const dt="img_ev3q";const ut={head:function(e){const t=a.Children.map(e.children,(e=>a.isValidElement(e)?function(e){var t;if(null!=(t=e.props)&&t.mdxType&&e.props.originalType){const{mdxType:t,originalType:n,...l}=e.props;return a.createElement(e.props.originalType,l)}return e}(e):e));return a.createElement(Ee.Z,e,t)},code:function(e){const t=["a","b","big","i","span","em","strong","sup","sub","small"];return a.Children.toArray(e.children).every((e=>"string"==typeof e&&!e.includes("\n")||(0,a.isValidElement)(e)&&t.includes(e.props.mdxType)))?a.createElement("code",e):a.createElement(et,e)},a:function(e){return a.createElement(m.Z,e)},pre:function(e){var t;return a.createElement(et,(0,a.isValidElement)(e.children)&&"code"===(null==(t=e.children.props)?void 0:t.originalType)?e.children.props:{...e})},details:function(e){const t=a.Children.toArray(e.children),n=t.find((e=>{var t;return a.isValidElement(e)&&"summary"===(null==(t=e.props)?void 0:t.mdxType)})),l=a.createElement(a.Fragment,null,t.filter((e=>e!==n)));return a.createElement(ct,(0,c.Z)({},e,{summary:n}),l)},ul:function(e){return a.createElement("ul",(0,c.Z)({},e,{className:(t=e.className,(0,l.Z)(t,(null==t?void 0:t.includes("contains-task-list"))&&mt))}));var t},img:function(e){return a.createElement("img",(0,c.Z)({loading:"lazy"},e,{className:(t=e.className,(0,l.Z)(t,dt))}));var t},h1:e=>a.createElement(it,(0,c.Z)({as:"h1"},e)),h2:e=>a.createElement(it,(0,c.Z)({as:"h2"},e)),h3:e=>a.createElement(it,(0,c.Z)({as:"h3"},e)),h4:e=>a.createElement(it,(0,c.Z)({as:"h4"},e)),h5:e=>a.createElement(it,(0,c.Z)({as:"h5"},e)),h6:e=>a.createElement(it,(0,c.Z)({as:"h6"},e))};function pt(e){let{children:t}=e;return a.createElement(ve.Zo,{components:ut},t)}const gt="docItemContainer_Adtb",ht="docItemCol_GujU",ft="tocMobile_aoJ5";function bt(e){var t;const{content:n}=e,{metadata:l,frontMatter:o,assets:s}=n,{keywords:c}=o,{description:i,title:m}=l,d=null!=(t=s.image)?t:o.image;return a.createElement(r.d,{title:m,description:i,keywords:c,image:d})}function vt(e){const{content:t}=e,{metadata:n,frontMatter:r}=t,{hide_title:c,hide_table_of_contents:i,toc_min_heading_level:m,toc_max_heading_level:d}=r,{title:p}=n,g=!c&&void 0===t.contentTitle,h=(0,o.i)(),f=!i&&t.toc&&t.toc.length>0,b=f&&("desktop"===h||"ssr"===h);return a.createElement("div",{className:"row"},a.createElement("div",{className:(0,l.Z)("col",!i&&ht)},a.createElement(k,null),a.createElement("div",{className:gt},a.createElement("article",null,a.createElement(be,null),a.createElement(N,null),f&&a.createElement(re,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:d,className:(0,l.Z)(s.k.docs.docTocMobile,ft)}),a.createElement("div",{className:(0,l.Z)(s.k.docs.docMarkdown,"markdown")},g&&a.createElement("header",null,a.createElement(ce,{as:"h1"},p)),a.createElement(pt,null,a.createElement(t,null))),a.createElement(M,e)),a.createElement(u,{previous:n.previous,next:n.next}))),b&&a.createElement("div",{className:"col col--3"},a.createElement(X,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:d,className:s.k.docs.docTocDesktop})))}function Et(e){const t="docs-doc-id-"+e.content.metadata.unversionedId;return a.createElement(r.FG,{className:t},a.createElement(bt,e),a.createElement(vt,e))}},4477:(e,t,n)=>{"use strict";n.d(t,{E:()=>s,q:()=>o});var a=n(7294),l=n(902);const r=a.createContext(null);function o(e){let{children:t,version:n}=e;return a.createElement(r.Provider,{value:n},t)}function s(){const e=(0,a.useContext)(r);if(null===e)throw new l.i6("DocsVersionProvider");return e}},7594:(e,t)=>{function n(e){let t,n=[];for(let a of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(a))n.push(parseInt(a,10));else if(t=a.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,a,l,r]=t;if(a&&r){a=parseInt(a),r=parseInt(r);const e=a<r?1:-1;"-"!==l&&".."!==l&&"\u2025"!==l||(r+=e);for(let t=a;t!==r;t+=e)n.push(t)}}return n}t.default=n,e.exports=n}}]);