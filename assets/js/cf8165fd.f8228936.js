"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[186],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return k}});var s=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,s,r=function(e,t){if(null==e)return{};var n,s,r={},a=Object.keys(e);for(s=0;s<a.length;s++)n=a[s],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(s=0;s<a.length;s++)n=a[s],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=s.createContext({}),d=function(e){var t=s.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=d(e.components);return s.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},p=s.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=d(n),k=r,m=p["".concat(l,".").concat(k)]||p[k]||u[k]||a;return n?s.createElement(m,o(o({ref:t},c),{},{components:n})):s.createElement(m,o({ref:t},c))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=p;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var d=2;d<a;d++)o[d]=n[d];return s.createElement.apply(null,o)}return s.createElement.apply(null,n)}p.displayName="MDXCreateElement"},2564:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return d},toc:function(){return c},default:function(){return p}});var s=n(7462),r=n(3366),a=(n(7294),n(3905)),o=["components"],i={id:"blktests",title:"Kernel Block Layer Tests",sidebar_label:"Kernel Block Layer Tests"},l="Kernel Block Layer Tests",d={unversionedId:"tests/blktests",id:"tests/blktests",title:"Kernel Block Layer Tests",description:"blktests is a test suite for Linux;reg; kernel storage stack, that is, the",source:"@site/docs/tests/blktests.md",sourceDirName:"tests",slug:"/tests/blktests",permalink:"/docs/tests/blktests",tags:[],version:"current",frontMatter:{id:"blktests",title:"Kernel Block Layer Tests",sidebar_label:"Kernel Block Layer Tests"},sidebar:"docs",previous:{title:"ZBC/ZAC Compliance Tests",permalink:"/docs/tests/zbc-tests"},next:{title:"Linux Distributions",permalink:"/docs/distributions/linux"}},c=[{value:"Overview",id:"overview",children:[],level:2},{value:"Configuration",id:"configuration",children:[],level:2},{value:"Execution",id:"execution",children:[{value:"Full Run",id:"full-run",children:[],level:3},{value:"Quick Run",id:"quick-run",children:[],level:3}],level:2}],u={toc:c};function p(e){var t=e.components,n=(0,r.Z)(e,o);return(0,a.kt)("wrapper",(0,s.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"kernel-block-layer-tests"},"Kernel Block Layer Tests"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"blktests")," is a test suite for Linux;reg; kernel storage stack, that is, the\nblock I/O layer as well as underlying device specific layers (SCSI, NVMe, SRP,\netc). ",(0,a.kt)("em",{parentName:"p"},"blktests")," is heavily inspired by the ",(0,a.kt)("em",{parentName:"p"},"xfstests")," framework for testing\nfile systems."),(0,a.kt)("p",null,"Recent contributions to ",(0,a.kt)("em",{parentName:"p"},"blktests")," added zoned block device tests support."),(0,a.kt)("p",null,"The ",(0,a.kt)("em",{parentName:"p"},"blktests")," project is hosted on\n",(0,a.kt)("a",{parentName:"p",href:"https://github.com/osandov/blktests"},"GitHub"),"."),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"blktests")," organizes test cases into groups. The test groups currently available\nare as shown in the table below."),(0,a.kt)("center",null,(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Group name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"block")),(0,a.kt)("td",{parentName:"tr",align:"left"},"Block layer generic tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"loop")),(0,a.kt)("td",{parentName:"tr",align:"left"},"Loopback device tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"meta")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("em",{parentName:"td"},"blktests")," self tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"nbd")),(0,a.kt)("td",{parentName:"tr",align:"left"},"Network block device driver tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"nvme")),(0,a.kt)("td",{parentName:"tr",align:"left"},"NVMe driver tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"nvmeof-mp")),(0,a.kt)("td",{parentName:"tr",align:"left"},"NVME-over-fabrics multipath tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"scsi")),(0,a.kt)("td",{parentName:"tr",align:"left"},"SCSI layer tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"srp")),(0,a.kt)("td",{parentName:"tr",align:"left"},"SCSI RDMA Protocol driver tests")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("strong",{parentName:"td"},"zbd")),(0,a.kt)("td",{parentName:"tr",align:"left"},"Zoned block device tests"))))),(0,a.kt)("p",null,"The test groups supporting zoned block devices are ",(0,a.kt)("em",{parentName:"p"},"block")," and ",(0,a.kt)("em",{parentName:"p"},"zbd"),".\n",(0,a.kt)("a",{parentName:"p",href:"/docs/tools/util-linux#blkzone"},(0,a.kt)("em",{parentName:"a"},"blkzone"))," and ",(0,a.kt)("a",{parentName:"p",href:"/docs/benchmarking/benchmark"},(0,a.kt)("em",{parentName:"a"},"fio")),"\nversion 3.9 or higher must be installed for executing these test groups."),(0,a.kt)("h2",{id:"configuration"},"Configuration"),(0,a.kt)("p",null,"Detailed generic information on how to configure and run ",(0,a.kt)("em",{parentName:"p"},"blktests")," is\nprovided ",(0,a.kt)("a",{href:"https://github.com/osandov/blktests/blob/master/Documentation/running-tests.md",target:"_blank"},"here"),"."),(0,a.kt)("p",null,"For executing tests against a physical zoned block device (e.g. a ZBC/ZAC disk),\nthe following ",(0,a.kt)("inlineCode",{parentName:"p"},"config")," file should be prepared and copied to the ",(0,a.kt)("em",{parentName:"p"},"blktests"),"\ninstallation directory. Tests can also be executed directly from the source\ndirectory if the ",(0,a.kt)("inlineCode",{parentName:"p"},"config")," file is copied in that location."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Tests target device list\nTEST_DEVS=(/dev/sdd)\n\n# Enable zoned block device mode for the block group genertic tests \nRUN_ZONED_TESTS=1\n")),(0,a.kt)("p",null,"With this configuration, all tests relevant to zoned block devices will be\nexecuted. The execution duration can be several 10s of minutes depending on the\ntarget device and host system. To Shorten execution, the options ",(0,a.kt)("inlineCode",{parentName:"p"},"TIMEOUT")," and\n",(0,a.kt)("inlineCode",{parentName:"p"},"QUICK_RUN")," can be added to the configuration."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Tests target device list\nTEST_DEVS=(/dev/sdd)\n\n# Enable zoned block device mode for the block group genertic tests\nRUN_ZONED_TESTS=1\n\n# Speed up execution (weaker tests)\nQUICK_RUN=1\nTIMEOUT=30\n")),(0,a.kt)("p",null,"Of note is that the block layer generic tests of the ",(0,a.kt)("em",{parentName:"p"},"block")," group also include\ntest cases executed against a logical device (",(0,a.kt)("em",{parentName:"p"},"null_blk")," block device). These\ntests are executed twice, once with the ",(0,a.kt)("em",{parentName:"p"},"null_blk")," device configured as a\nregular block device and a second time with the ",(0,a.kt)("em",{parentName:"p"},"null_blk")," device configured as\na zoned block device. To reduce the test cases execution to only the physical\ndevice specified in the configuration file, the ",(0,a.kt)("inlineCode",{parentName:"p"},"DEVICE_ONLY")," option can be set."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Tests target device list\nTEST_DEVS=(/dev/sdd)\n\n# Enable zoned block device mode for the block group genertic tests\nRUN_ZONED_TESTS=1\n\n# Speed up execution (weaker tests)\nQUICK_RUN=1\nTIMEOUT=30\n\n# Exercise only the devices in TEST_DEVS\nDEVICE_ONLY=1\n")),(0,a.kt)("h2",{id:"execution"},"Execution"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"blktests")," execution is done using the ",(0,a.kt)("inlineCode",{parentName:"p"},"check")," script present in the top level\ndirectory. This script optionally takes as argument a list of test groups or\ntest cases to execute. Bu default, without any argument, all test groups will be\nexecuted."),(0,a.kt)("p",null,"For zoned block device tests, executing the test cases of the ",(0,a.kt)("em",{parentName:"p"},"block")," and ",(0,a.kt)("em",{parentName:"p"},"zbd"),"\ntest groups is sufficient."),(0,a.kt)("p",null,"As discussed in the ",(0,a.kt)("a",{parentName:"p",href:"#configuration"},"configuration")," section above, several\noptions can speedup the execution of ",(0,a.kt)("em",{parentName:"p"},"blktests"),". Such quick runs are indeed\nfaster but at the cost of weaker testing compared to full runs."),(0,a.kt)("h3",{id:"full-run"},"Full Run"),(0,a.kt)("p",null,"The following command executes all test cases relevant to zoned block devices\nwith the device specified in the ",(0,a.kt)("inlineCode",{parentName:"p"},"config")," configuration file as target. In this\nexample, no options are added."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-plaintext"},"# ./check block zbd\nblock/001 (stress device hotplugging)                        [passed]\n    runtime  120.013s  ...  123.440s\nblock/002 (remove a device while running blktrace)           [passed]\n    runtime  0.741s  ...  0.761s\nblock/003 => sdd (run various discard sizes)                 [not run]\n    /dev/sdd is a zoned block device\nblock/004 => sdd (run lots of flushes)                       [passed]\n    runtime     98.876s  ...  82.665s\n    write iops  170      ...  203\nblock/005 => sdd (switch schedulers while doing IO)          [passed]\n    read iops  1415    ...  791\n    runtime    6.765s  ...  11.242s\nblock/006 (run null-blk in blocking mode)                    [passed]\n    read iops  154220   ...  152356\n    runtime    19.158s  ...  19.229s\nblock/006 (zoned) (run null-blk in blocking mode)            [passed]\n    read iops  150692   ...  146826\n    runtime    19.128s  ...  19.720s\nblock/007 => sdd (test classic and hybrid IO polling)        [not run]\n    /dev/sdd is a zoned block device\nblock/008 (do IO while hotplugging CPUs)                     [not run]\n    CPU hotplugging is not supported\nblock/009 (check page-cache coherency after BLKDISCARD)      [passed]\n    runtime  0.827s  ...  0.868s\nblock/010 (run I/O on null_blk with shared and non-shared tags) [passed]\n    Individual tags read iops  254661    ...  253371\n    Shared tags read iops      174876    ...  174933\n    runtime                    695.714s  ...  715.579s\nblock/010 (zoned) (run I/O on null_blk with shared and non-shared tags) [passed]\n    Individual tags read iops  253356    ...  252487\n    Shared tags read iops      174871    ...  174780\n    runtime                    667.479s  ...  652.577s\nblock/011 => sdd (disable PCI device while doing I/O)        [passed]\n    runtime  8.293s  ...  17.760s\nblock/012 => sdd (check that a read-only block device fails writes) [not run]\n    /dev/sdd is a zoned block device\nblock/013 => sdd (try BLKRRPART on a mounted device)         [not run]\n    /dev/sdd is a zoned block device\nblock/014 (run null-blk with blk-mq and timeout injection configured) [not run]\n    null_blk module does not have parameter timeout\nblock/015 (run null-blk on different schedulers with requeue injection configured) [not run]\n    null_blk module does not have parameter requeue\nblock/016 (send a signal to a process waiting on a frozen queue) [passed]\n    runtime  8.055s  ...  8.055s\nblock/016 (zoned) (send a signal to a process waiting on a frozen queue) [passed]\n    runtime  8.055s  ...  8.055s\nblock/017 (do I/O and check the inflight counter)            [passed]\n    runtime  1.691s  ...  1.675s\nblock/017 (zoned) (do I/O and check the inflight counter)    [passed]\n    runtime  1.690s  ...  1.692s\nblock/018 (do I/O and check iostats times)                   [passed]\n    runtime  5.075s  ...  5.077s\nblock/019 => sdd (break PCI link device while doing I/O)     [not run]\n    /dev/sdd is a zoned block device\nblock/020 (run null-blk on different schedulers with only one hardware tag) [passed]\n    runtime  43.139s  ...  43.191s\nblock/020 (zoned) (run null-blk on different schedulers with only one hardware tag) [passed]\n    runtime  43.120s  ...  43.206s\nblock/021 (read/write nr_requests on null-blk with different schedulers) [passed]\n    runtime  1.396s  ...  1.393s\nblock/021 (zoned) (read/write nr_requests on null-blk with different schedulers) [passed]\n    runtime  1.399s  ...  1.419s\nblock/023 (do I/O on all null_blk queue modes)               [passed]\n    runtime  0.276s  ...  0.280s\nblock/023 (zoned) (do I/O on all null_blk queue modes)       [passed]\n    runtime  0.279s  ...  0.302s\nblock/024 (do I/O faster than a jiffy and check iostats times) [passed]\n    runtime  4.902s  ...  4.904s\nblock/025 (do a huge discard with 4k sector size)            [passed]\n    runtime  8.869s  ...  8.921s\nblock/027 (stress device hotplugging with running fio jobs and different schedulers) [not run]\n    no support for io cgroup controller; if it is enabled, you may need to boot with cgroup_no_v1=io\nblock/028 (do I/O on scsi_debug with DIF/DIX enabled)        [passed]\n    runtime  19.924s  ...  19.942s\nzbd/001 => sdd (sysfs and ioctl)                             [passed]\n    runtime    ...  0.706s\nzbd/002 => sdd (report zone)                                 [passed]\n    runtime    ...  6.534s\nzbd/003 => sdd (reset sequential required zones)             [passed]\n    runtime    ...  13.324s\nzbd/004 => sdd (write split across sequential zones)         [passed]\n    runtime    ...  17.019s\nzbd/005 => sdd (write command ordering)                      [passed]\n    runtime       ...  178.335s\n    write io      ...  7196672\n    write iops    ...  933\nzbd/006 => sdd (revalidate)                                  [passed]\n    runtime       ...  61.028s\n    write io      ...  1805004\n    write iops    ...  15041\n")),(0,a.kt)("p",null,"The output of some tests is ",(0,a.kt)("em",{parentName:"p"},"[not run]"),". This is not a failure. This only\nindicates that the target device specified in the configuration file does not\nsupport the feature being tested. For example, in the above run, test case\n",(0,a.kt)("em",{parentName:"p"},"block/003")," is not executed against the specified host managed disk because the\ndisk does not support the ",(0,a.kt)("em",{parentName:"p"},"discard")," command."),(0,a.kt)("h3",{id:"quick-run"},"Quick Run"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"blkltests")," execution can be accelerated using the ",(0,a.kt)("inlineCode",{parentName:"p"},"TIMEOUT"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"QUICK_RUN")," and\n",(0,a.kt)("inlineCode",{parentName:"p"},"DEVICE_ONLY")," configuration options."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Tests target device list\nTEST_DEVS=(/dev/sdd)\n\n# Enable zoned block device mode for the block group genertic tests\nRUN_ZONED_TESTS=1\n\n# Speed up execution (weaker tests)\nQUICK_RUN=1\nTIMEOUT=30\n\n# Exercise only the devices in TEST_DEVS\nDEVICE_ONLY=1\n")),(0,a.kt)("p",null,"Running only the ",(0,a.kt)("em",{parentName:"p"},"block")," and ",(0,a.kt)("em",{parentName:"p"},"zbd")," test groups with the above configuration\ngives the following results."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-plaintext"},"# ./check block zbd\nblock/003 => sdd (run various discard sizes)                 [not run]\n    /dev/sdd is a zoned block device\nblock/004 => sdd (run lots of flushes)                       [passed]\n    runtime     913.097s  ...  33.714s\n    write iops            ...  239\nblock/005 => sdd (switch schedulers while doing IO)          [passed]\n    read iops  2975     ...  3573\n    runtime    22.510s  ...  19.194s\nblock/007 => sdd (test classic and hybrid IO polling)        [not run]\n    /dev/sdd is a zoned block device\nblock/008 => sdd (do IO while hotplugging CPUs)              [not run]\n    /dev/sdd is a zoned block device\nblock/011 => sdd (disable PCI device while doing I/O)        [passed]\n    runtime    ...  30.322s\nblock/012 => sdd (check that a read-only block device fails writes) [not run]\n    /dev/sdd is a zoned block device\nblock/013 => sdd (try BLKRRPART on a mounted device)         [not run]\n    /dev/sdd is a zoned block device\nblock/019 => sdd (break PCI link device while doing I/O)     [not run]\n    /dev/sdd is a zoned block device\nzbd/001 => sdd (sysfs and ioctl)                             [passed]\n    runtime  1.328s  ...  0.521s\nzbd/003 => sdd (reset sequential required zones)             [passed]\n    runtime  9.591s  ...  11.008s\nzbd/004 => sdd (write split across sequential zones)         [passed]\n    runtime  11.772s  ...  11.743s\nzbd/005 => sdd (write command ordering)                      [passed]\n    runtime     59.688s  ...  167.521s\n    write io    7201536  ...  7113472\n    write iops  933      ...  921\nzbd/006 => sdd (revalidate)                                  [passed]\n    runtime     7.063s  ...  39.464s\n    write io            ...  2097152\n    write iops          ...  48971\n")))}p.isMDXComponent=!0}}]);