"use strict";(self.webpackChunkzonedstorage_io=self.webpackChunkzonedstorage_io||[]).push([[592],{3980:(e,n,t)=>{t.r(n),t.d(n,{No:()=>h,Yes:()=>c,assets:()=>a,contentTitle:()=>o,default:()=>x,frontMatter:()=>r,metadata:()=>l,toc:()=>d});var s=t(7624),i=t(4552);const r={id:"zonefs",title:"ZoneFS",sidebar_label:"zonefs"},o="zonefs File System",l={id:"filesystems/zonefs",title:"ZoneFS",description:"zonefs is a very simple file system that exposes each of the zones of a zoned",source:"@site/docs/filesystems/zonefs.md",sourceDirName:"filesystems",slug:"/filesystems/zonefs",permalink:"/docs/filesystems/zonefs",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"zonefs",title:"ZoneFS",sidebar_label:"zonefs"},sidebar:"docs",previous:{title:"f2fs",permalink:"/docs/filesystems/f2fs"},next:{title:"Overview",permalink:"/docs/applications"}},a={},d=[{value:"Usage",id:"usage",level:2},{value:"Architectural Overview",id:"architectural-overview",level:2},{value:"On-Disk Metadata",id:"on-disk-metadata",level:3},{value:"Zone Type Sub-Directories",id:"zone-type-sub-directories",level:3},{value:"Zone files",id:"zone-files",level:3},{value:"Conventional Zone Files",id:"conventional-zone-files",level:4},{value:"Sequential zone files",id:"sequential-zone-files",level:4},{value:"Format options",id:"format-options",level:3},{value:"IO error handling",id:"io-error-handling",level:3},{value:"Mount options",id:"mount-options",level:3},{value:"User Space Tools",id:"user-space-tools",level:3}];function c(){const e={span:"span",...(0,i.M)()};return(0,s.jsx)(e.span,{style:{color:"#00ff00"},children:"yes"})}function h(){const e={span:"span",...(0,i.M)()};return(0,s.jsx)(e.span,{style:{color:"#ff0000"},children:"no"})}function f(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"zonefs-file-system",children:"zonefs File System"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zonefs"})," is a very simple file system that exposes each of the zones of a zoned\nblock device as a file."]}),"\n",(0,s.jsx)(n.admonition,{title:"System Requirements",type:"note",children:(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Linux kernel version 5.6 or later."}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"mkzonefs"})," to format zoned block devices for use with ",(0,s.jsx)(n.em,{children:"zonefs"}),".\nThis tool is available on ",(0,s.jsx)("a",{href:"https://github.com/westerndigitalcorporation/zonefs-tools",target:"_blank",children:"GitHub"}),"."]}),"\n"]})}),"\n",(0,s.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,s.jsx)(n.p,{children:"The following list of commands formats a 15TB host-managed SMR HDD with 256 MB\nzones (with the conventional zones aggregation feature enabled):"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# mkzonefs -o aggr_cnv /dev/sdX\n# mount -t zonefs /dev/sdX /mnt\n# ls -l /mnt/\ntotal 0\ndr-xr-xr-x 2 root root     1 Nov 25 13:23 cnv\ndr-xr-xr-x 2 root root 55356 Nov 25 13:23 seq\n"})}),"\n",(0,s.jsx)(n.p,{children:"The size of the zone files' sub-directories indicates the number of files\nthat exist for each type of zone. In this example, there is only one\nconventional zone file (all conventional zones are aggregated under a single\nfile):"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# ls -l /mnt/cnv\ntotal 137101312\n-rw-r----- 1 root root 140391743488 Nov 25 13:23 0\n"})}),"\n",(0,s.jsx)(n.p,{children:"This aggregated conventional zone file can be used as a regular file:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# mkfs.ext4 /mnt/cnv/0\n# mount -o loop /mnt/cnv/0 /data\n"})}),"\n",(0,s.jsx)(n.p,{children:'The "seq" sub-directory, which groups files for sequential write zones, has\n55356 zones in this example:'}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# ls -lv /mnt/seq\ntotal 14511243264\n-rw-r----- 1 root root 0 Nov 25 13:23 0\n-rw-r----- 1 root root 0 Nov 25 13:23 1\n-rw-r----- 1 root root 0 Nov 25 13:23 2\n...\n-rw-r----- 1 root root 0 Nov 25 13:23 55354\n-rw-r----- 1 root root 0 Nov 25 13:23 55355\n"})}),"\n",(0,s.jsx)(n.p,{children:"For sequential write zone files, the file size changes as data is appended at\nthe end of the file. This is similar to the behavior of any regular file\nsystem:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# dd if=/dev/zero of=/mnt/seq/0 bs=4096 count=1 conv=notrunc oflag=direct\n1+0 records in\n1+0 records out\n4096 bytes (4.1 kB, 4.0 KiB) copied, 0.00044121 s, 9.3 MB/s\n\n# ls -l /mnt/seq/0\n-rw-r----- 1 root root 4096 Nov 25 13:23 /mnt/seq/0\n"})}),"\n",(0,s.jsx)(n.p,{children:"The written file can be truncated to the zone size, which prevents any further\nwrite operations:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# truncate -s 268435456 /mnt/seq/0\n# ls -l /mnt/seq/0\n-rw-r----- 1 root root 268435456 Nov 25 13:49 /mnt/seq/0\n"})}),"\n",(0,s.jsx)(n.p,{children:"Truncation to 0 size allows freeing the file zone storage space and restarts\nappend-writes to the file:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# truncate -s 0 /mnt/seq/0\n# ls -l /mnt/seq/0\n-rw-r----- 1 root root 0 Nov 25 13:49 /mnt/seq/0\n"})}),"\n",(0,s.jsx)(n.p,{children:"Since files are statically mapped to zones on the disk, the number of blocks of\na file as reported by stat() and fstat() indicates the size of the file zone:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-plaintext",children:"# stat /mnt/seq/0\nFile: /mnt/seq/0\nSize: 0         \tBlocks: 524288     IO Block: 4096   regular empty file\nDevice: 870h/2160d\tInode: 50431       Links: 1\nAccess: (0640/-rw-r-----)  Uid: (    0/    root)   Gid: (    0/    root)\nAccess: 2019-11-25 13:23:57.048971997 +0900\nModify: 2019-11-25 13:52:25.553805765 +0900\nChange: 2019-11-25 13:52:25.553805765 +0900\nBirth: -\n"})}),"\n",(0,s.jsx)(n.p,{children:'The number of blocks of the file ("Blocks") in units of 512B blocks gives the\nmaximum file size of 524288 * 512 B = 256 MB, which corresponds to the device\nzone size in this example. Note that the "IO block" field always indicates the\nminimum I/O size for writes and that it corresponds to the device\'s physical\nsector size.'}),"\n",(0,s.jsx)(n.h2,{id:"architectural-overview",children:"Architectural Overview"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zonefs"})," does not hide from the user the sequential write constraints of zoned\nblock devices. In this, it is unlike a regular POSIX-compliant file system\nwith native zoned-block device support (e.g. ",(0,s.jsx)(n.a,{href:"/docs/filesystems/f2fs",children:(0,s.jsx)(n.em,{children:"f2fs"})}),').\nFiles that represent sequential write zones on the device must be written\nsequentially, starting from the end of the file (these are "append only"\nwrites).']}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zonefs"})," is therefore more similar to a raw-block-device-access interface than\nit is to a full-featured POSIX file system. The goal of ",(0,s.jsx)(n.em,{children:"zonefs"}),' is to\nsimplify the implementation of zoned block device support in applications, and\nit aims to do this by replacing raw block device file accesses with the richer\nregular-file API (which avoids relying on the possibly more obscure and\ndeveloper-unfriendly direct block device file ioctls). One example of this\napproach is the implementation of LSM (log-structured merge) tree structures\n(such as used in RocksDB and LevelDB) on zoned block devices: SSTables are\nstored in a zone file in a way that is similar to the way a regular file\nsystem works rather than as a range of sectors of the entire disk. The\nintroduction of the higher-level construct "one file is one zone" can reduce\nthe number of changes needed in the application, and also introduces support\nfor different application programming languages.']}),"\n",(0,s.jsx)(n.p,{children:"The files that represent zones are grouped by zone type, and those zone types\nthemselves are represented by sub-directories. This file structure is built\nentirely using zone information that is provided by the device and therefore\ndoes not require any complex on-disk metadata structure."}),"\n",(0,s.jsx)(n.h3,{id:"on-disk-metadata",children:"On-Disk Metadata"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zonefs"})," on-disk metadata is composed only of an immutable super block which\npersistently stores a magic number and optional feature flags and values. On\nmount, ",(0,s.jsx)(n.em,{children:"zonefs"})," uses the block layer API function ",(0,s.jsx)(n.code,{children:"blkdev_report_zones()"})," to\nobtain the device zone configuration and populates the mount point with a\nstatic file tree that is based solely on this information. File sizes come\nfrom the device zone type and the write-pointer position, both of which are\nmanaged by the device itself. ",(0,s.jsx)(n.em,{children:"zonefs"})," operates only based on information\nfrom the device. ",(0,s.jsx)(n.em,{children:"zonefs"})," does not have any metadata of its own."]}),"\n",(0,s.jsxs)(n.p,{children:["The super block is always written on disk at sector 0. The first zone of the\ndevice that stores the super block is never exposed as a zone file by\n",(0,s.jsx)(n.em,{children:"zonefs"}),". If the zone that contains the super block is a sequential zone, the\n",(0,s.jsx)(n.code,{children:"mkzonefs"}),' format tool always "finishes" the zone (that is, it transitions the\nzone to a full state to make it read-only, preventing any data write).']}),"\n",(0,s.jsx)(n.h3,{id:"zone-type-sub-directories",children:"Zone Type Sub-Directories"}),"\n",(0,s.jsx)(n.p,{children:"Files that represent zones of the same type are grouped together under the same\nsub-directory, which is automatically created on mount."}),"\n",(0,s.jsxs)(n.p,{children:['For conventional zones, the sub-directory "cnv" is used. This directory is\ncreated only if the device has usable conventional zones. If the device has\nonly a single conventional zone at sector 0, the zone will not be exposed as a\nfile (because it will be used to store the ',(0,s.jsx)(n.em,{children:"zonefs"}),' super block). For such\ndevices, the "cnv" sub-directory will not be created.']}),"\n",(0,s.jsx)(n.p,{children:'For sequential write zones, the sub-directory "seq" is used.'}),"\n",(0,s.jsxs)(n.p,{children:["These two directories are the only directories that exist in ",(0,s.jsx)(n.em,{children:"zonefs"}),'. Users\ncannot create other directories and can neither rename nor delete the "cnv"\nand "seq" sub-directories.']}),"\n",(0,s.jsxs)(n.p,{children:["The size of the directories indicates the number of files that exist under\nthe directory. This size is indicated by the ",(0,s.jsx)(n.code,{children:"st_size"})," field of ",(0,s.jsx)(n.code,{children:"struct stat"}),", which is obtained with the ",(0,s.jsx)(n.code,{children:"stat()"})," or ",(0,s.jsx)(n.code,{children:"fstat()"})," system calls."]}),"\n",(0,s.jsx)(n.h3,{id:"zone-files",children:"Zone files"}),"\n",(0,s.jsx)(n.p,{children:'Zone files are named using the number of the zone they represent within the\nset of zones of a particular type. Both the "cnv" and "seq" directories\ncontain files named "0", "1", "2", ... The file numbers also represent\nincreasing zone start sector on the device.'}),"\n",(0,s.jsxs)(n.p,{children:["No read- and write-operations to zone files are allowed beyond the file\nmaximum size (that is, beyond the zone size). Any access that exceeds the zone\nsize fails with the ",(0,s.jsx)(n.code,{children:"-EFBIG"})," error."]}),"\n",(0,s.jsx)(n.p,{children:"Creating, deleting, renaming and modifying any attribute of files is not\nallowed."}),"\n",(0,s.jsxs)(n.p,{children:["The number of blocks of a file as reported by ",(0,s.jsx)(n.code,{children:"stat()"})," and ",(0,s.jsx)(n.code,{children:"fstat()"})," indicates\nthe size of the file zone (in other words, the maximum file size)."]}),"\n",(0,s.jsx)(n.h4,{id:"conventional-zone-files",children:"Conventional Zone Files"}),"\n",(0,s.jsx)(n.p,{children:"The size of conventional zone files is fixed to the size of the zone that they\nrepresent. Conventional zone files cannot be truncated."}),"\n",(0,s.jsx)(n.p,{children:"These files can be randomly read and written using any type of I/O operation:\nbuffered I/Os, direct I/Os, memory mapped I/Os (mmap), etc. There are no I/O\nconstraints for these files beyond the file size limit mentioned above."}),"\n",(0,s.jsx)(n.h4,{id:"sequential-zone-files",children:"Sequential zone files"}),"\n",(0,s.jsx)(n.p,{children:'The size of sequential zone files that are grouped in the "seq" sub-directory\nrepresents the file\'s zone-write-pointer position relative to the zone start\nsector.'}),"\n",(0,s.jsxs)(n.p,{children:['Sequential zone files can be written only sequentially, starting from the file\nend (that is, write operations can be only "append writes"). ',(0,s.jsx)(n.code,{children:"zonefs"})," makes no\nattempt to accept random writes and will fail any write request that has a\nstart offset that does not correspond to the end of the file, or to the end of\nthe last write issued and still in-flight (for asynchronous I/O operations)."]}),"\n",(0,s.jsxs)(n.p,{children:["Because dirty page writeback by the page cache does not guarantee a sequential\nwrite pattern, ",(0,s.jsx)(n.em,{children:"zonefs"})," prevents buffered writes and writeable shared mappings\non sequential files. Only direct I/O writes are accepted for these files.\n",(0,s.jsx)(n.em,{children:"zonefs"})," relies on the sequential delivery of write I/O requests to the device\nimplemented by the block layer elevator (See\n",(0,s.jsx)(n.a,{href:"/docs/linux/sched",children:"Write Command Ordering"}),")."]}),"\n",(0,s.jsx)(n.p,{children:"There are no restrictions on the type of I/O used for read operations in\nsequential zone files. Buffered I/Os, direct I/Os and shared read mappings are\nall accepted."}),"\n",(0,s.jsx)(n.p,{children:"Truncating sequential zone files is allowed only down to 0, in which case, the\nzone is reset to rewind the file zone write pointer position to the start of\nthe zone, or up to the zone size, in which case the file's zone is transitioned\nto the FULL state (finish zone operation)."}),"\n",(0,s.jsx)(n.h3,{id:"format-options",children:"Format options"}),"\n",(0,s.jsxs)(n.p,{children:["Several optional features of ",(0,s.jsx)(n.em,{children:"zonefs"})," can be enabled at format time."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:'Conventional zone aggregation: ranges of contiguous conventional zones can\nbe aggregated into a single larger file instead of the default "one file per\nzone".'}),"\n",(0,s.jsx)(n.li,{children:"File ownership: By default, the owner UID and GID of zone files is 0 (root)\nbut can be changed to any valid UID/GID."}),"\n",(0,s.jsx)(n.li,{children:"File access permissions: the default access permissions (640) can be changed."}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"io-error-handling",children:"IO error handling"}),"\n",(0,s.jsx)(n.p,{children:"Zoned block devices can fail I/O requests for reasons similar to the reasons\nthat regular block devices fail I/O requests, e.g. if there are bad sectors.\nBut the standards that govern the behavior of zoned block devices also define\nadditional conditions (in addition to these known I/O failure patterns) that\ncan result in I/O errors."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"A zone may transition to the read-only condition:\nAlthough the data that is already written in the zone is still readable, the\nzone can no longer be written. No user action on the zone (zone management\ncommand or read/write access) can change the zone condition back to a\nnormal read/write state. While the reasons for the device to transition a\nzone to read-only state are not defined by the standards, a typical cause\nfor such transition would be a defective write head on an HDD (all zones\nunder this head are changed to read-only)."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:'A zone may transition to the offline condition:\nAn offline zone can be neither read nor written. No user action can\ntransition an offline zone back to an operational "good state". Similar to\nzone read-only transitions, the reasons that a drive transitions a zone\nto the offline condition are undefined. A typical cause is (for example) a\ndefective read-write head on an HDD that causes all zones on the platter\nunder the broken head to be inaccessible.'}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Unaligned write errors:\nThese errors result from the device receiving a write request that has a\nstart sector that does not correspond to the write-pointer position of the\ntarget zone. Although ",(0,s.jsx)(n.em,{children:"zonefs"})," enforces sequential file write for\nsequential zones, unaligned write errors can still happen in the case of a\npartial failure of a very large direct I/O operation that is split into\nmultiple BIOs/requests or asynchronous I/O operations. If one of the write\nrequests within the set of sequential write requests that is issued to the\ndevice fails, all write requests that are queued after it will become\nunaligned and fail."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Delayed write errors:\nAs with regular block devices, if the device-side write cache is enabled,\nwrite errors can occur in ranges of previously-completed writes when the\ndevice write cache is flushed, e.g. on ",(0,s.jsx)(n.code,{children:"fsync()"}),".  As in cases of immediate\nunaligned write errors, delayed write errors can propagate through a stream\nof cached sequential data for a zone, which can cause all data after the\nsector that caused the error to be dropped."]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["All I/O errors detected by ",(0,s.jsx)(n.em,{children:"zonefs"})," are reported to the user with an error code\nreturned for the system call that triggered or detected the error. The recovery\nactions taken by ",(0,s.jsx)(n.em,{children:"zonefs"})," in response to I/O errors depend on the I/O type\n(read vs write) and on the reason for the error (bad sector, unaligned writes or\nzone condition change)."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["For read I/O errors, ",(0,s.jsx)(n.em,{children:"zonefs"})," takes recovery action action only if the file\nzone is still in good condition and there is no inconsistency between the\nfile inode size and its zone write pointer position. If a problem is\ndetected, I/O error recovery is executed (see below table)."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["For write I/O errors, ",(0,s.jsx)(n.em,{children:"zonefs"})," I/O error recovery is always executed."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:['A zone condition change to "read-only" or "offline" also always triggers\n',(0,s.jsx)(n.em,{children:"zonefs"})," I/O error recovery."]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zonefs"})," minimal I/O error recovery can change a file's size and its file\naccess permissions."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["File size changes:\nImmediate or delayed write errors in a sequential zone file can cause the\nfile inode size to be inconsistent with the amount of data successfully\nwritten in the file zone. For example, the partial failure of a multi-BIO\nlarge write operation will cause the zone write pointer to advance partially,\neven though the entire write operation is reported as failed to the user.\nIn such cases, the file inode size must be advanced to reflect the zone write\npointer change and eventually allow the user to restart writing at the end of\nthe file.\nA file size may also be reduced to reflect a delayed write error detected on\nfsync(): in this case, the amount of data effectively written in the zone may\nbe less than originally indicated by the file inode size. After any such I/O\nerror, ",(0,s.jsx)(n.em,{children:"zonefs"})," always fixes the file inode size to reflect the amount of\ndata persistently stored in the file zone."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Access permission changes:\nA zone condition change to read-only is indicated with a change in the file\naccess permissions, rendering the file read-only. This disables changes to\nthe file attributes and data modification. For offline zones, all permissions\n(read and write) of the file are disabled."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Further action taken by ",(0,s.jsx)(n.em,{children:"zonefs"}),' I/O error recovery can be controlled by the\nuser with the "errors=xxx" mount option. The table below summarizes the result\nof ',(0,s.jsx)(n.em,{children:"zonefs"})," I/O error processing, depending on the mount option and on the zone\nconditions."]}),"\n",(0,s.jsx)("center",{children:(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{style:{textAlign:"center"},children:'"errors=xxx" mount option'}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Device zone condition"}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"File size"}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"File read"}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"File write"}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Device read"}),(0,s.jsx)(n.th,{style:{textAlign:"center"},children:"Device write"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"remount-ro"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"good"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"fixed"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"remount-ro"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"read-only"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"as is"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"remount-ro"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"offline"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"0"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"zone-ro"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"good"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"fixed"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"zone-ro"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"read-only"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"as is"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"zone-ro"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"offline"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"0"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"zone-offline"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"good"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"0"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"zone-offline"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"read-only"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"0"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"zone-offline"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"offline"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"0"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"repair"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"good"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"fixed"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"repair"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"read-only"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"as is"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(c,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"repair"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"offline"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:"0"}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})}),(0,s.jsx)(n.td,{style:{textAlign:"center"},children:(0,s.jsx)(h,{})})]})]})]})}),"\n",(0,s.jsx)(n.p,{children:"Further notes:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:'The "errors=remount-ro" mount option is the default behavior of zonefs I/O\nerror processing if no errors mount option is specified.'}),"\n",(0,s.jsx)(n.li,{children:'With the "errors=remount-ro" mount option, the change of file access\npermissions to "read-only" applies to all files. The file system is remounted\nread-only.'}),"\n",(0,s.jsx)(n.li,{children:"Access permission and file-size changes caused by the device transitioning\nzones to the offline condition are permanent. Remounting or reformatting the\ndevice with mkfs.zonefs (mkzonefs) will not change offline zone files back\nto a good state."}),"\n",(0,s.jsx)(n.li,{children:"All file access permission changes to read-only that are due to the device\ntransitioning zones to the read-only condition are permanent. Remounting or\nreformatting the device will not re-enable file write access."}),"\n",(0,s.jsx)(n.li,{children:'File access permission changes implied by the "remount-ro", "zone-ro" and\n"zone-offline" mount options are temporary for zones in a good condition.\nUnmounting and remounting the file system restores the previous default\n(format time values) access rights to the files affected.'}),"\n",(0,s.jsx)(n.li,{children:'The repair mount option triggers only the minimal set of I/O error recovery\nactions (that is, file size fixes for zones in a good condition). Zones\nthat are indicated as "read-only" or "offline" by the device still imply\nchanges to the zone file access permissions as noted in the table above.'}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"mount-options",children:"Mount options"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zonefs"}),' defines the "errors=',(0,s.jsx)(n.em,{children:"behavior"}),'" mount option to allow the user to\nspecify zonefs behavior in response to I/O errors, inode size inconsistencies\nor zone condition changes. The defined behaviors are as follows.']}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"remount-ro (default)"}),"\n",(0,s.jsx)(n.li,{children:"zone-ro"}),"\n",(0,s.jsx)(n.li,{children:"zone-offline"}),"\n",(0,s.jsx)(n.li,{children:"repair"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["The run-time I/O error actions defined for each behavior are detailed in\n",(0,s.jsx)(n.a,{href:"/docs/filesystems/zonefs#io-error-handling",children:(0,s.jsx)(n.em,{children:"IO error handling"})}),". Mount-time I/O errors\ncause the mount operation to fail."]}),"\n",(0,s.jsxs)(n.p,{children:["Read-only zones are handled differently at mount time than they are at\nrun time. If a read-only zone is found at mount time, the zone is always\ntreated in the same manner as offline zones (that is, all accesses are\ndisabled and the zone file size set to 0). This is necessary, because the write\npointer of read-only zones is defined as invalid by the ZBC and ZAC standards\n(which makes it impossible to discover the amount of data that has been\nwritten to the zone). In the case of a read-only zone that is discovered at\nrun-time, as indicated in ",(0,s.jsx)(n.a,{href:"/docs/filesystems/zonefs#io-error-handling",children:(0,s.jsx)(n.em,{children:"IO error\nhandling"})}),", the size of the zone file is left\nunchanged from its last updated value."]}),"\n",(0,s.jsx)(n.h3,{id:"user-space-tools",children:"User Space Tools"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"mkzonefs"})," tool is used to format zoned block devices for use with ",(0,s.jsx)(n.em,{children:"zonefs"}),".\nThis tool is available on ",(0,s.jsx)("a",{href:"https://github.com/westerndigitalcorporation/zonefs-tools",target:"_blank",children:"GitHub"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.em,{children:"zonefs-tools"})," also includes a test suite that can be run against any zoned\nblock device, including\n",(0,s.jsxs)(n.a,{href:"/docs/getting-started/zbd-emulation",children:[(0,s.jsx)(n.em,{children:"nullblk"})," block device created with zoned\nmode"]}),"."]})]})}function x(e={}){const{wrapper:n}={...(0,i.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(f,{...e})}):f(e)}},4552:(e,n,t)=>{t.d(n,{I:()=>l,M:()=>o});var s=t(1504);const i={},r=s.createContext(i);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);