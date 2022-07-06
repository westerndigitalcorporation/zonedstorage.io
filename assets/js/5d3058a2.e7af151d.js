"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[4638],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>u});var i=t(7294);function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,i,s=function(e,n){if(null==e)return{};var t,i,s={},a=Object.keys(e);for(i=0;i<a.length;i++)t=a[i],n.indexOf(t)>=0||(s[t]=e[t]);return s}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)t=a[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var d=i.createContext({}),l=function(e){var n=i.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},c=function(e){var n=l(e.components);return i.createElement(d.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},p=i.forwardRef((function(e,n){var t=e.components,s=e.mdxType,a=e.originalType,d=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=l(t),u=s,h=p["".concat(d,".").concat(u)]||p[u]||m[u]||a;return t?i.createElement(h,r(r({ref:n},c),{},{components:t})):i.createElement(h,r({ref:n},c))}));function u(e,n){var t=arguments,s=n&&n.mdxType;if("string"==typeof e||s){var a=t.length,r=new Array(a);r[0]=p;var o={};for(var d in n)hasOwnProperty.call(n,d)&&(o[d]=n[d]);o.originalType=e,o.mdxType="string"==typeof e?e:s,r[1]=o;for(var l=2;l<a;l++)r[l]=t[l];return i.createElement.apply(null,r)}return i.createElement.apply(null,t)}p.displayName="MDXCreateElement"},4188:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>m,frontMatter:()=>a,metadata:()=>o,toc:()=>l});var i=t(7462),s=(t(7294),t(3905));const a={id:"smr-fio",title:"fio Examples for SMR hard-disks",sidebar_label:"Examples for SMR hard-disks"},r=void 0,o={unversionedId:"benchmarking/fio/smr-fio",id:"benchmarking/fio/smr-fio",title:"fio Examples for SMR hard-disks",description:"This section provides various examples showing how to use fio new zbd zone",source:"@site/docs/benchmarking/fio/smr-fio.md",sourceDirName:"benchmarking/fio",slug:"/benchmarking/fio/smr-fio",permalink:"/docs/benchmarking/fio/smr-fio",draft:!1,tags:[],version:"current",frontMatter:{id:"smr-fio",title:"fio Examples for SMR hard-disks",sidebar_label:"Examples for SMR hard-disks"},sidebar:"docs",previous:{title:"Overview",permalink:"/docs/benchmarking/fio/overview"},next:{title:"Examples for NVMe ZNS Devices",permalink:"/docs/benchmarking/fio/zns-fio"}},d={},l=[{value:"Sequential Write Workload",id:"sequential-write-workload",level:3},{value:"Sequential Read Workload",id:"sequential-read-workload",level:3},{value:"Random Read and Write Workloads",id:"random-read-and-write-workloads",level:3},{value:"Direct Access <em>sg</em> I/O Engine",id:"direct-access-sg-io-engine",level:2},{value:"Zone Write Streams",id:"zone-write-streams",level:2}],c={toc:l};function m(e){let{components:n,...t}=e;return(0,s.kt)("wrapper",(0,i.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"This section provides various examples showing how to use ",(0,s.kt)("em",{parentName:"p"},"fio")," new ",(0,s.kt)("em",{parentName:"p"},"zbd")," zone\nmode. In all examples, a 15TB SMR host managed SATA disk is used. The disk zone\nsize is 256 MiB. The disk has 524 conventional zones starting at offset 0. The\nfirst sequential write required zone of the disk starts at sector 274726912\n(512 B sector unit), that is, at the byte offset 140660178944."),(0,s.kt)("h3",{id:"sequential-write-workload"},"Sequential Write Workload"),(0,s.kt)("p",null,"The following command sequentially writes the first 4 sequential zones of the\ndisk using the ",(0,s.kt)("em",{parentName:"p"},"libaio")," I/O engine with a queue depth of 8."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --size=1G \\\n      --ioengine=libaio --iodepth=8 --rw=write --bs=256K\nzbc: (g=0): rw=write, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8\nfio-3.13\nStarting 1 process\nJobs: 1 (f=1): [W(1)][100.0%][w=239MiB/s][w=955 IOPS][eta 00m:00s]\nzbc: (groupid=0, jobs=1): err= 0: pid=4124: Fri May 24 11:49:18 2019\n  write: IOPS=938, BW=235MiB/s (246MB/s)(1024MiB/4365msec); 0 zone resets\n    slat (nsec): min=5930, max=39068, avg=9729.06, stdev=2048.99\n    clat (usec): min=783, max=55846, avg=8511.40, stdev=4079.36\n     lat (usec): min=809, max=55854, avg=8521.19, stdev=4079.36\n    clat percentiles (usec):\n     |  1.00th=[ 3884],  5.00th=[ 7701], 10.00th=[ 8094], 20.00th=[ 8225],\n     | 30.00th=[ 8225], 40.00th=[ 8225], 50.00th=[ 8225], 60.00th=[ 8291],\n     | 70.00th=[ 8356], 80.00th=[ 8356], 90.00th=[ 8356], 95.00th=[ 8356],\n     | 99.00th=[30540], 99.50th=[45351], 99.90th=[55837], 99.95th=[55837],\n     | 99.99th=[55837]\n   bw (  KiB/s): min=224830, max=249357, per=99.49%, avg=239009.50, stdev=9032.95, samples=8\n   iops        : min=  878, max=  974, avg=933.50, stdev=35.36, samples=8\n  lat (usec)   : 1000=0.02%\n  lat (msec)   : 4=2.91%, 10=95.70%, 20=0.20%, 50=0.78%, 100=0.39%\n  cpu          : usr=0.73%, sys=0.64%, ctx=1045, majf=0, minf=11\n  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=99.8%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=0,4096,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=8\n\nRun status group 0 (all jobs):\n  WRITE: bw=235MiB/s (246MB/s), 235MiB/s-235MiB/s (246MB/s-246MB/s), io=1024MiB (1074MB), run=4365-4365msec\n\nDisk stats (read/write):\n  sdd: ios=0/984, merge=0/2943, ticks=0/8365, in_queue=7383, util=24.13%\n")),(0,s.kt)("p",null,"The first four sequential write required zones of the disk are now full."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# zbc_report_zones /dev/sdd\nDevice /dev/sdd:\n    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx\n    Zoned block device interface, Host-managed zone model\n    29297213440 512-bytes sectors\n    3662151680 logical blocks of 4096 B\n    3662151680 physical blocks of 4096 B\n    15000.173 GB capacity\n    Read commands are unrestricted\n    Maximum number of open sequential write required zones: 128\n    55880 zones from 0, reporting option 0x00\n55880 / 55880 zones:\n...\none 00524: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 275251200\nZone 00525: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 275251200, 524288 sectors, wp 275775488\nZone 00526: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 275775488, 524288 sectors, wp 276299776\nZone 00527: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 276299776, 524288 sectors, wp 276824064\nZone 00528: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 276824064, 524288 sectors, wp 276824064\n...\n")),(0,s.kt)("p",null,"With the disk in this state, executing the same command again without the ",(0,s.kt)("em",{parentName:"p"},"zbd"),"\nzone mode enabled, ",(0,s.kt)("em",{parentName:"p"},"fio")," will attempt to write to full zones, resulting in I/O\nerrors."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 \\\n      --offset=140660178944 --size=1G \\\n      --ioengine=libaio --iodepth=8 --rw=write --bs=256K\nzbc: (g=0): rw=write, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8\nfio-3.13\nStarting 1 process\nfio: io_u error on file /dev/sdd: Remote I/O error: write offset=140660178944, buflen=262144\nfio: pid=4206, err=121/file:io_u.c:1791, func=io_u error, error=Remote I/O error\n\nzbc: (groupid=0, jobs=1): err=121 (file:io_u.c:1791, func=io_u error, error=Remote I/O error): pid=4206: Fri May 24 12:34:27 2019\n  cpu          : usr=1.22%, sys=0.00%, ctx=3, majf=0, minf=16\n  IO depths    : 1=12.5%, 2=25.0%, 4=50.0%, 8=12.5%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=0,8,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=8\n\nRun status group 0 (all jobs):\n\nDisk stats (read/write):\n  sdd: ios=48/3, merge=0/5, ticks=13/35, in_queue=32, util=5.39%\n")),(0,s.kt)("p",null,"With the ",(0,s.kt)("em",{parentName:"p"},"zbd")," zone mode enabled, the same command executed again with the zones\nfull succeeds."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --size=1G \\\n      --ioengine=libaio --iodepth=8 --rw=write --bs=256K\nzbc: (g=0): rw=write, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8\nfio-3.13\nStarting 1 process\nJobs: 1 (f=1): [W(1)][100.0%][w=243MiB/s][w=973 IOPS][eta 00m:00s]\nzbc: (groupid=0, jobs=1): err= 0: pid=4220: Fri May 24 12:37:29 2019\n  write: IOPS=949, BW=237MiB/s (249MB/s)(1024MiB/4316msec); 4 zone resets\n    slat (nsec): min=5937, max=40055, avg=9651.92, stdev=2104.34\n    clat (usec): min=795, max=36562, avg=8243.26, stdev=2031.55\n     lat (usec): min=818, max=36571, avg=8252.96, stdev=2031.50\n    clat percentiles (usec):\n     |  1.00th=[ 3884],  5.00th=[ 7701], 10.00th=[ 8160], 20.00th=[ 8225],\n     | 30.00th=[ 8225], 40.00th=[ 8225], 50.00th=[ 8225], 60.00th=[ 8291],\n     | 70.00th=[ 8291], 80.00th=[ 8356], 90.00th=[ 8356], 95.00th=[ 8356],\n     | 99.00th=[10159], 99.50th=[27919], 99.90th=[33817], 99.95th=[36439],\n     | 99.99th=[36439]\n   bw (  KiB/s): min=234538, max=249357, per=99.93%, avg=242777.88, stdev=5032.30, samples=8\n   iops        : min=  916, max=  974, avg=948.25, stdev=19.70, samples=8\n  lat (usec)   : 1000=0.02%\n  lat (msec)   : 2=0.07%, 4=2.78%, 10=96.02%, 20=0.51%, 50=0.59%\n  cpu          : usr=1.27%, sys=0.67%, ctx=1051, majf=0, minf=12\n  IO depths    : 1=0.1%, 2=0.2%, 4=0.4%, 8=99.3%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=0,4096,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=8\n\nRun status group 0 (all jobs):\n  WRITE: bw=237MiB/s (249MB/s), 237MiB/s-237MiB/s (249MB/s-249MB/s), io=1024MiB (1074MB), run=4316-4316msec\n\nDisk stats (read/write):\n  sdd: ios=4/998, merge=0/2985, ticks=81/8205, in_queue=7286, util=24.38%\n")),(0,s.kt)("p",null,"Note that ",(0,s.kt)("em",{parentName:"p"},"fio")," output in this case indicates the number of zones that were\nreset prior to writing."),(0,s.kt)("h3",{id:"sequential-read-workload"},"Sequential Read Workload"),(0,s.kt)("p",null,"With the disk previous state preserved (with the first four sequential write\nzones full), the previous command can be changed to read operations targeting\nthe written zones."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --size=1G \\\n      --ioengine=libaio --iodepth=8 --rw=read --bs=256K\nzbc: (g=0): rw=read, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8\nfio-3.13\nStarting 1 process\nJobs: 1 (f=1): [R(1)][100.0%][r=243MiB/s][r=970 IOPS][eta 00m:00s]\nzbc: (groupid=0, jobs=1): err= 0: pid=4236: Fri May 24 12:40:18 2019\n  read: IOPS=951, BW=238MiB/s (249MB/s)(1024MiB/4304msec)\n    slat (usec): min=5, max=148, avg= 6.62, stdev= 5.68\n    clat (usec): min=976, max=39536, avg=8394.44, stdev=1933.57\n     lat (usec): min=1125, max=39543, avg=8401.12, stdev=1934.43\n    clat percentiles (usec):\n     |  1.00th=[ 6390],  5.00th=[ 6718], 10.00th=[ 6915], 20.00th=[ 7439],\n     | 30.00th=[ 8094], 40.00th=[ 8291], 50.00th=[ 8356], 60.00th=[ 8356],\n     | 70.00th=[ 8356], 80.00th=[ 8356], 90.00th=[ 9765], 95.00th=[10290],\n     | 99.00th=[14615], 99.50th=[25560], 99.90th=[29492], 99.95th=[39584],\n     | 99.99th=[39584]\n   bw (  KiB/s): min=223808, max=249868, per=99.57%, avg=242586.38, stdev=8265.29, samples=8\n   iops        : min=  874, max=  976, avg=947.50, stdev=32.35, samples=8\n  lat (usec)   : 1000=0.02%\n  lat (msec)   : 2=0.05%, 4=0.05%, 10=92.53%, 20=6.81%, 50=0.54%\n  cpu          : usr=0.40%, sys=0.72%, ctx=4113, majf=0, minf=522\n  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=99.8%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=4096,0,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=8\n\nRun status group 0 (all jobs):\n   READ: bw=238MiB/s (249MB/s), 238MiB/s-238MiB/s (249MB/s-249MB/s), io=1024MiB (1074MB), run=4304-4304msec\n\nDisk stats (read/write):\n  sdd: ios=4031/0, merge=0/0, ticks=33836/0, in_queue=29809, util=57.74%\n")),(0,s.kt)("p",null,"If the zones are reset before executing this command, no read I/O will be\nexecuted as ",(0,s.kt)("em",{parentName:"p"},"fio")," will be enable to find zones with written sectors."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone reset -o 274726912 -l 2097152 /dev/sdd\n# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --size=1G \\\n      --ioengine=libaio --iodepth=8 --rw=read --bs=256K\nzbc: (g=0): rw=read, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8\nfio-3.13\nStarting 1 process\n\n\nRun status group 0 (all jobs):\n\nDisk stats (read/write):\n  sdd: ios=0/0, merge=0/0, ticks=0/0, in_queue=0, util=0.00%\n")),(0,s.kt)("p",null,"Forcing the execution of read I/Os targeting empty zones can be done using the\n",(0,s.kt)("inlineCode",{parentName:"p"},"--read_beyond_wp")," option."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --size=1G --read_beyond_wp=1 \\\n      --ioengine=libaio --iodepth=8 --rw=read --bs=256K\nzbc: (g=0): rw=read, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8\nfio-3.13\nStarting 1 process\nJobs: 1 (f=1): [R(1)][-.-%][r=353MiB/s][r=1412 IOPS][eta 00m:00s]\nzbc: (groupid=0, jobs=1): err= 0: pid=4322: Fri May 24 12:46:32 2019\n  read: IOPS=1411, BW=353MiB/s (370MB/s)(1024MiB/2901msec)\n    slat (usec): min=5, max=147, avg= 6.50, stdev= 5.72\n    clat (usec): min=1978, max=8845, avg=5654.86, stdev=112.79\n     lat (usec): min=2126, max=8851, avg=5661.41, stdev=111.86\n    clat percentiles (usec):\n     |  1.00th=[ 5604],  5.00th=[ 5604], 10.00th=[ 5604], 20.00th=[ 5669],\n     | 30.00th=[ 5669], 40.00th=[ 5669], 50.00th=[ 5669], 60.00th=[ 5669],\n     | 70.00th=[ 5669], 80.00th=[ 5669], 90.00th=[ 5669], 95.00th=[ 5735],\n     | 99.00th=[ 5735], 99.50th=[ 5800], 99.90th=[ 7177], 99.95th=[ 7963],\n     | 99.99th=[ 8848]\n   bw (  KiB/s): min=360239, max=361261, per=99.81%, avg=360750.00, stdev=361.33, samples=5\n   iops        : min= 1407, max= 1411, avg=1409.00, stdev= 1.41, samples=5\n  lat (msec)   : 2=0.02%, 10=99.98%\n  cpu          : usr=0.24%, sys=1.34%, ctx=4108, majf=0, minf=522\n  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=99.8%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=4096,0,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=8\n\nRun status group 0 (all jobs):\n   READ: bw=353MiB/s (370MB/s), 353MiB/s-353MiB/s (370MB/s-370MB/s), io=1024MiB (1074MB), run=2901-2901msec\n\nDisk stats (read/write):\n  sdd: ios=3869/0, merge=0/0, ticks=21868/0, in_queue=18002, util=81.20%\n")),(0,s.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"The higher IOPS performance observed with this test compared to the previous one\n(i.e. IOPS=1411 vs. IOPS=951) results from the disk not physically executing any\nmedia access as there is no data to read (no written sectors). The disks returns\na fill pattern as data without seeking to the sectors specified by the read\ncommands."))),(0,s.kt)("h3",{id:"random-read-and-write-workloads"},"Random Read and Write Workloads"),(0,s.kt)("p",null,"The following command randomly write sequential write zones of the disk using 4\njobs, each job operating at a queue depth of 4 (overall queue depth of 16 for\nthe disk). The run time is set to 30 seconds."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --numjobs=4 --group_reporting=1 --runtime=30 \\\n      --ioengine=libaio --iodepth=4 --rw=randwrite --bs=256K\nzbc: (g=0): rw=randwrite, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=4\n...\nfio-3.13\nStarting 4 processes\nJobs: 4 (f=4): [w(4)][100.0%][w=33.0MiB/s][w=132 IOPS][eta 00m:00s]\nzbc: (groupid=0, jobs=4): err= 0: pid=4425: Fri May 24 12:58:43 2019\n  write: IOPS=160, BW=40.2MiB/s (42.2MB/s)(1209MiB/30064msec); 0 zone resets\n    slat (nsec): min=7815, max=75710, avg=12304.05, stdev=3091.33\n    clat (usec): min=1410, max=221285, avg=98856.71, stdev=29971.24\n     lat (usec): min=1435, max=221295, avg=98869.07, stdev=29970.46\n    clat percentiles (msec):\n     |  1.00th=[   12],  5.00th=[   24], 10.00th=[   75], 20.00th=[   84],\n     | 30.00th=[   89], 40.00th=[   94], 50.00th=[   99], 60.00th=[  105],\n     | 70.00th=[  110], 80.00th=[  117], 90.00th=[  128], 95.00th=[  138],\n     | 99.00th=[  194], 99.50th=[  203], 99.90th=[  218], 99.95th=[  220],\n     | 99.99th=[  222]\n   bw (  KiB/s): min=27092, max=138608, per=99.80%, avg=41096.13, stdev=3423.45, samples=240\n   iops        : min=  103, max=  540, avg=159.05, stdev=13.38, samples=240\n  lat (msec)   : 2=0.02%, 4=0.06%, 10=0.43%, 20=3.74%, 50=1.26%\n  lat (msec)   : 100=47.27%, 250=47.21%\n  cpu          : usr=0.09%, sys=0.15%, ctx=84537, majf=0, minf=261\n  IO depths    : 1=0.1%, 2=0.2%, 4=99.8%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=0,4836,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=4\n\nRun status group 0 (all jobs):\n  WRITE: bw=40.2MiB/s (42.2MB/s), 40.2MiB/s-40.2MiB/s (42.2MB/s-42.2MB/s), io=1209MiB (1268MB), run=30064-30064msec\n\nDisk stats (read/write):\n  sdd: ios=0/4807, merge=0/0, ticks=0/474905, in_queue=470163, util=9.89%\n")),(0,s.kt)("p",null,(0,s.kt)("em",{parentName:"p"},"zbc_report_zones")," can be used to explore the state of the disk at the end of\nthis workload execution."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# zbc_report_zones -ro full -n /dev/sdd\nDevice /dev/sdd:\n    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx\n    Zoned block device interface, Host-managed zone model\n    29297213440 512-bytes sectors\n    3662151680 logical blocks of 4096 B\n    3662151680 physical blocks of 4096 B\n    15000.173 GB capacity\n    Read commands are unrestricted\n    Maximum number of open sequential write required zones: 128\n    0 zone from 0, reporting option 0x05\n# zbc_report_zones -ro closed -n /dev/sdd\nDevice /dev/sdd:\n    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx\n    Zoned block device interface, Host-managed zone model\n    29297213440 512-bytes sectors\n    3662151680 logical blocks of 4096 B\n    3662151680 physical blocks of 4096 B\n    15000.173 GB capacity\n    Read commands are unrestricted\n    Maximum number of open sequential write required zones: 128\n    4498 zones from 0, reporting option 0x04\n# zbc_report_zones -ro imp_open -n /dev/sdd\nDevice /dev/sdd:\n    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx\n    Zoned block device interface, Host-managed zone model\n    29297213440 512-bytes sectors\n    3662151680 logical blocks of 4096 B\n    3662151680 physical blocks of 4096 B\n    15000.173 GB capacity\n    Read commands are unrestricted\n    Maximum number of open sequential write required zones: 128\n    128 zones from 0, reporting option 0x02\n")),(0,s.kt)("p",null,"This indicates that 4498+128=4626 zones were written to, with none of the\nsequential write zones fully written (no full zone). Switching the operation\nmode to read, the sectors written in this last run can be randomly read."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\                \n      --offset=140660178944 --numjobs=4 --group_reporting=1 --runtime=30 \\      \n      --ioengine=libaio --iodepth=4 --rw=randread --bs=256K\n...\nfio-3.13\nStarting 4 processes\nJobs: 4 (f=4): [r(4)][0.0%][r=31.0MiB/s][r=124 IOPS][eta 23d:02h:02m:24s]\nzbc: (groupid=0, jobs=4): err= 0: pid=4494: Fri May 24 13:24:08 2019\n  read: IOPS=118, BW=29.7MiB/s (31.1MB/s)(894MiB/30156msec)\n    slat (usec): min=6, max=183, avg= 7.86, stdev= 8.75\n    clat (usec): min=1252, max=1537.8k, avg=133931.63, stdev=123584.49\n     lat (usec): min=1260, max=1537.8k, avg=133939.56, stdev=123584.42\n    clat percentiles (msec):\n     |  1.00th=[    8],  5.00th=[   16], 10.00th=[   20], 20.00th=[   35],\n     | 30.00th=[   53], 40.00th=[   72], 50.00th=[   96], 60.00th=[  127],\n     | 70.00th=[  169], 80.00th=[  218], 90.00th=[  296], 95.00th=[  368],\n     | 99.00th=[  558], 99.50th=[  625], 99.90th=[  869], 99.95th=[  919],\n     | 99.99th=[ 1536]\n   bw (  KiB/s): min=15855, max=50152, per=100.00%, avg=30364.05, stdev=1762.17, samples=240\n   iops        : min=   60, max=  195, avg=117.22, stdev= 6.92, samples=240\n  lat (msec)   : 2=0.22%, 4=0.06%, 10=1.40%, 20=8.44%, 50=18.26%\n  lat (msec)   : 100=23.15%, 250=33.30%, 500=13.47%, 750=1.51%, 1000=0.17%\n  cpu          : usr=0.06%, sys=0.12%, ctx=82815, majf=0, minf=1281\n  IO depths    : 1=0.1%, 2=0.2%, 4=99.7%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=3577,0,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=4\n\nRun status group 0 (all jobs):\n   READ: bw=29.7MiB/s (31.1MB/s), 29.7MiB/s-29.7MiB/s (31.1MB/s-31.1MB/s), io=894MiB (938MB), run=30156-30156msec\n\nDisk stats (read/write):\n  sdd: ios=3565/0, merge=0/0, ticks=475774/0, in_queue=472274, util=11.93%\n")),(0,s.kt)("p",null,"Resetting all sequential write zones of the disk and executing again the random\nread workload leads to similar results as for the previous ",(0,s.kt)("a",{parentName:"p",href:"#sequential-read-workload"},"sequential read\nworkload")," case, that is, no read I/O is executed."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# blkzone reset -o 274726912 /dev/sdd\n# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --numjobs=4 --group_reporting=1 --runtime=30 \\\n      --ioengine=libaio --iodepth=4 --rw=randread --bs=256K\n...\nfio-3.13\nStarting 4 processes\n\n\nRun status group 0 (all jobs):\n\nDisk stats (read/write):\n  sdd: ios=0/0, merge=0/0, ticks=0/0, in_queue=0, util=0.00%\n")),(0,s.kt)("p",null,"Changing the range to be read to include the conventional zones of the disk\nwill result in read I/Os being executed."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=0 --size=140660178944 --numjobs=4 --group_reporting=1 \\\n      --runtime=30 --ioengine=libaio --iodepth=4 --rw=randread --bs=256K\nzbc: (g=0): rw=randread, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=4\n...\nfio-3.13\nStarting 4 processes\nJobs: 4 (f=4): [r(4)][100.0%][r=58.0MiB/s][r=232 IOPS][eta 00m:00s]\nzbc: (groupid=0, jobs=4): err= 0: pid=4570: Fri May 24 13:35:15 2019\n  read: IOPS=215, BW=53.8MiB/s (56.4MB/s)(1617MiB/30079msec)\n    slat (usec): min=6, max=143, avg= 7.29, stdev= 6.22\n    clat (usec): min=1065, max=959229, avg=74313.80, stdev=83291.27\n     lat (usec): min=1072, max=959237, avg=74321.15, stdev=83291.39\n    clat percentiles (msec):\n     |  1.00th=[    8],  5.00th=[    9], 10.00th=[   12], 20.00th=[   17],\n     | 30.00th=[   24], 40.00th=[   34], 50.00th=[   47], 60.00th=[   62],\n     | 70.00th=[   82], 80.00th=[  113], 90.00th=[  174], 95.00th=[  239],\n     | 99.00th=[  409], 99.50th=[  472], 99.90th=[  634], 99.95th=[  651],\n     | 99.99th=[  961]\n   bw (  KiB/s): min=27136, max=81920, per=99.97%, avg=55030.83, stdev=2685.56, samples=240\n   iops        : min=  106, max=  320, avg=214.10, stdev=10.53, samples=240\n  lat (msec)   : 2=0.02%, 10=8.23%, 20=16.22%, 50=28.40%, 100=23.61%\n  lat (msec)   : 250=19.08%, 500=4.07%, 750=0.36%, 1000=0.03%\n  cpu          : usr=0.02%, sys=0.07%, ctx=6483, majf=0, minf=1070\n  IO depths    : 1=0.1%, 2=0.1%, 4=99.8%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=6468,0,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=4\n\nRun status group 0 (all jobs):\n   READ: bw=53.8MiB/s (56.4MB/s), 53.8MiB/s-53.8MiB/s (56.4MB/s-56.4MB/s), io=1617MiB (1696MB), run=30079-30079msec\n\nDisk stats (read/write):\n  sdd: ios=6452/0, merge=0/0, ticks=479006/0, in_queue=472619, util=21.62%\n")),(0,s.kt)("h2",{id:"direct-access-sg-io-engine"},"Direct Access ",(0,s.kt)("em",{parentName:"h2"},"sg")," I/O Engine"),(0,s.kt)("p",null,"The SCSI generic direct access interface can also be used with the ",(0,s.kt)("em",{parentName:"p"},"zbd")," zone\nmode, as long as the block device file (",(0,s.kt)("em",{parentName:"p"},"/dev/sdX"),") is used to specify the disk.\nThe ",(0,s.kt)("em",{parentName:"p"},"zbd")," zone mode will not be enabled if the SCSI generic node file\n(",(0,s.kt)("em",{parentName:"p"},"/dev/sgY"),") is used to specify the disk."),(0,s.kt)("p",null,"The example below illustrates the use of the ",(0,s.kt)("em",{parentName:"p"},"sg")," I/O engine with 8 jobs\nexecuting a 64KB random write workload to sequential write zones."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \\\n      --offset=140660178944 --size=1G --numjobs=8 --group_reporting=1 \\\n      --ioengine=sg --rw=randwrite --bs=64K\n...\nfio-3.13\nStarting 8 processes\nzbc: (groupid=0, jobs=8): err= 0: pid=4792: Fri May 24 14:18:52 2019\n  write: IOPS=2007, BW=125MiB/s (132MB/s)(8192MiB/65278msec); 32 zone resets\n    clat (usec): min=148, max=327494, avg=1589.26, stdev=4060.13\n     lat (usec): min=149, max=327497, avg=1590.55, stdev=4060.13\n    clat percentiles (usec):\n     |  1.00th=[   848],  5.00th=[   988], 10.00th=[  1090], 20.00th=[  1172],\n     | 30.00th=[  1221], 40.00th=[  1287], 50.00th=[  1369], 60.00th=[  1434],\n     | 70.00th=[  1500], 80.00th=[  1631], 90.00th=[  2180], 95.00th=[  2638],\n     | 99.00th=[  3064], 99.50th=[  3392], 99.90th=[ 24773], 99.95th=[ 77071],\n     | 99.99th=[291505]\n   bw (  KiB/s): min=39001, max=178678, per=100.00%, avg=131457.71, stdev=3143.56, samples=1015\n   iops        : min=  606, max= 2791, avg=2052.81, stdev=49.16, samples=1015\n  lat (usec)   : 250=0.07%, 500=0.12%, 750=0.38%, 1000=4.89%\n  lat (msec)   : 2=81.56%, 4=12.76%, 10=0.05%, 20=0.06%, 50=0.05%\n  lat (msec)   : 100=0.03%, 250=0.02%, 500=0.01%\n  cpu          : usr=0.14%, sys=0.20%, ctx=251460, majf=0, minf=139\n  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=0,131072,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=1\n\nRun status group 0 (all jobs):\n  WRITE: bw=125MiB/s (132MB/s), 125MiB/s-125MiB/s (132MB/s-132MB/s), io=8192MiB (8590MB), run=65278-65278msec\n\nDisk stats (read/write):\n  sdd: ios=278/0, merge=0/0, ticks=1953/0, in_queue=1677, util=0.39%\n")),(0,s.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"SCSI generic direct access bypasses the block layer I/O scheduler. For zoned\nblock devices, this means that the ",(0,s.kt)("em",{parentName:"p"},"deadline")," I/O scheduler zone write locking\nis enable to provide write command ordering guarantees.  However, the ",(0,s.kt)("em",{parentName:"p"},"zbd")," mode\nensures mutual exclusion between jobs for write access to the same zone. Such\nsynchronization is in essence identical to zone write locking and execute all\nwrite commands without any error."))),(0,s.kt)("h2",{id:"zone-write-streams"},"Zone Write Streams"),(0,s.kt)("p",null,"A typical zoned block device compliant application will write zones sequentially\nuntil the zone is full, then switch to another zone and continue writing.\nMultiple threads may be operating in this manner, with each thread operating on\na different zone."),(0,s.kt)("p",null,"Such typical behavior can be emulated using the option ",(0,s.kt)("inlineCode",{parentName:"p"},"--rw_sequencer"),"\ntogether with a number of I/O operations specified at the end of the\n",(0,s.kt)("inlineCode",{parentName:"p"},"--rw=randwrite")," argument. Below is an example script of 4 jobs sequentially\nwriting zones up to full using 512KB write operations (that is, 512 I/Os per\n256 MB zone). The zones being written are chosen randomly within disjoint zone\nranges for each job. This is controlled with the ",(0,s.kt)("inlineCode",{parentName:"p"},"offset"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"size")," and ",(0,s.kt)("inlineCode",{parentName:"p"},"rw"),"\narguments. The script file ",(0,s.kt)("inlineCode",{parentName:"p"},"streams.fio")," achieving such workload is shown below."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"#\n# streams.fio: 4 write streams\n#\n\n[global]\nioengine=psync\ndirect=1\nthread=1\nbs=512K\ncontinue_on_error=none\nfilename=/dev/sdd\ngroup_reporting=1\nzonemode=zbd\n\n[stream1]\noffset=140660178944\nsize=3714878275584\nrw=randwrite:512\nrw_sequencer=sequential\nio_size=2G\n\n[stream2]\noffset=3855538454528\nsize=3714878275584\nrw=randwrite:512\nrw_sequencer=sequential\nio_size=2G\n\n[stream3]\noffset=7570416730112\nsize=3714878275584\nrw=randwrite:512\nrw_sequencer=sequential\nio_size=2G\n\n[stream4]\noffset=11285295005696\nsize=3714878275584\nrw=randwrite:512\nrw_sequencer=sequential\nio_size=2G\n")),(0,s.kt)("p",null,"The result for this script execution is shown below."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-plaintext"},"# fio streams.fio\nstream1: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1\nstream2: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1\nstream3: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1\nstream4: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1\nfio-3.13\nStarting 4 threads\nJobs: 1 (f=1): [_(3),w(1)][98.3%][w=159MiB/s][w=318 IOPS][eta 00m:01s]\nstream1: (groupid=0, jobs=4): err= 0: pid=5161: Fri May 24 15:01:21 2019\n  write: IOPS=285, BW=143MiB/s (150MB/s)(8192MiB/57362msec); 0 zone resets\n    clat (usec): min=992, max=5788.2k, avg=12731.27, stdev=95315.03\n     lat (usec): min=996, max=5788.2k, avg=12742.01, stdev=95315.03\n    clat percentiles (usec):\n     |  1.00th=[   1106],  5.00th=[   2024], 10.00th=[   2114],\n     | 20.00th=[   2278], 30.00th=[   2769], 40.00th=[   3687],\n     | 50.00th=[   3884], 60.00th=[   4047], 70.00th=[   4228],\n     | 80.00th=[   4817], 90.00th=[   5342], 95.00th=[  50594],\n     | 99.00th=[ 196084], 99.50th=[ 258999], 99.90th=[ 876610],\n     | 99.95th=[2071987], 99.99th=[4731175]\n   bw (  KiB/s): min= 9211, max=840925, per=100.00%, avg=185793.45, stdev=44491.80, samples=352\n   iops        : min=   17, max= 1642, avg=361.42, stdev=86.97, samples=352\n  lat (usec)   : 1000=0.23%\n  lat (msec)   : 2=1.95%, 4=54.69%, 10=37.05%, 20=0.15%, 50=0.90%\n  lat (msec)   : 100=2.34%, 250=2.16%, 500=0.42%, 750=0.01%, 1000=0.01%\n  lat (msec)   : 2000=0.04%, >=2000=0.06%\n  cpu          : usr=0.15%, sys=0.12%, ctx=16505, majf=0, minf=0\n  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%\n     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%\n     issued rwts: total=0,16384,0,0 short=0,0,0,0 dropped=0,0,0,0\n     latency   : target=0, window=0, percentile=100.00%, depth=1\n\nRun status group 0 (all jobs):\n  WRITE: bw=143MiB/s (150MB/s), 143MiB/s-143MiB/s (150MB/s-150MB/s), io=8192MiB (8590MB), run=57362-57362msec\n\nDisk stats (read/write):\n  sdd: ios=144/16333, merge=0/0, ticks=573/208225, in_queue=192356, util=28.64%\n")))}m.isMDXComponent=!0}}]);