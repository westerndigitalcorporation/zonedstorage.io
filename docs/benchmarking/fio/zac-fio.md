---
id: zac-fio
title: ZAC Examples
sidebar_label: ZAC Examples
---

This section provides various examples showing how to use *fio* new *zbd* zone
mode. In all examples, a 15TB ZAC host managed SATA disk is used. The disk zone
size is 256 MiB. The disk has 524 conventional zones starting at offset 0. The
first sequential write required zone of the disk starts at sector 274726912
(512 B sector unit), that is, at the byte offset 140660178944.

### Sequential Write Workload

The following command sequentially writes the first 4 sequential zones of the
disk using the *libaio* I/O engine with a queue depth of 8.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --size=1G \
      --ioengine=libaio --iodepth=8 --rw=write --bs=256K
zbc: (g=0): rw=write, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8
fio-3.13
Starting 1 process
Jobs: 1 (f=1): [W(1)][100.0%][w=239MiB/s][w=955 IOPS][eta 00m:00s]
zbc: (groupid=0, jobs=1): err= 0: pid=4124: Fri May 24 11:49:18 2019
  write: IOPS=938, BW=235MiB/s (246MB/s)(1024MiB/4365msec); 0 zone resets
    slat (nsec): min=5930, max=39068, avg=9729.06, stdev=2048.99
    clat (usec): min=783, max=55846, avg=8511.40, stdev=4079.36
     lat (usec): min=809, max=55854, avg=8521.19, stdev=4079.36
    clat percentiles (usec):
     |  1.00th=[ 3884],  5.00th=[ 7701], 10.00th=[ 8094], 20.00th=[ 8225],
     | 30.00th=[ 8225], 40.00th=[ 8225], 50.00th=[ 8225], 60.00th=[ 8291],
     | 70.00th=[ 8356], 80.00th=[ 8356], 90.00th=[ 8356], 95.00th=[ 8356],
     | 99.00th=[30540], 99.50th=[45351], 99.90th=[55837], 99.95th=[55837],
     | 99.99th=[55837]
   bw (  KiB/s): min=224830, max=249357, per=99.49%, avg=239009.50, stdev=9032.95, samples=8
   iops        : min=  878, max=  974, avg=933.50, stdev=35.36, samples=8
  lat (usec)   : 1000=0.02%
  lat (msec)   : 4=2.91%, 10=95.70%, 20=0.20%, 50=0.78%, 100=0.39%
  cpu          : usr=0.73%, sys=0.64%, ctx=1045, majf=0, minf=11
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=99.8%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,4096,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=8

Run status group 0 (all jobs):
  WRITE: bw=235MiB/s (246MB/s), 235MiB/s-235MiB/s (246MB/s-246MB/s), io=1024MiB (1074MB), run=4365-4365msec

Disk stats (read/write):
  sdd: ios=0/984, merge=0/2943, ticks=0/8365, in_queue=7383, util=24.13%
```

The first four sequential write required zones of the disk are now full.

```plaintext
# zbc_report_zones /dev/sdd
Device /dev/sdd:
    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx
    Zoned block device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    55880 zones from 0, reporting option 0x00
55880 / 55880 zones:
...
one 00524: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 274726912, 524288 sectors, wp 275251200
Zone 00525: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 275251200, 524288 sectors, wp 275775488
Zone 00526: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 275775488, 524288 sectors, wp 276299776
Zone 00527: type 0x2 (Sequential-write-required), cond 0xe (Full), reset recommended 0, non_seq 0, sector 276299776, 524288 sectors, wp 276824064
Zone 00528: type 0x2 (Sequential-write-required), cond 0x1 (Empty), reset recommended 0, non_seq 0, sector 276824064, 524288 sectors, wp 276824064
...
```

With the disk in this state, executing the same command again without the *zbd*
zone mode enabled, *fio* will attempt to write to full zones, resulting in I/O
errors.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 \
      --offset=140660178944 --size=1G \
      --ioengine=libaio --iodepth=8 --rw=write --bs=256K
zbc: (g=0): rw=write, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8
fio-3.13
Starting 1 process
fio: io_u error on file /dev/sdd: Remote I/O error: write offset=140660178944, buflen=262144
fio: pid=4206, err=121/file:io_u.c:1791, func=io_u error, error=Remote I/O error

zbc: (groupid=0, jobs=1): err=121 (file:io_u.c:1791, func=io_u error, error=Remote I/O error): pid=4206: Fri May 24 12:34:27 2019
  cpu          : usr=1.22%, sys=0.00%, ctx=3, majf=0, minf=16
  IO depths    : 1=12.5%, 2=25.0%, 4=50.0%, 8=12.5%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,8,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=8

Run status group 0 (all jobs):

Disk stats (read/write):
  sdd: ios=48/3, merge=0/5, ticks=13/35, in_queue=32, util=5.39%
```

With the *zbd* zone mode enabled, the same command executed again with the zones
full succeeds.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --size=1G \
      --ioengine=libaio --iodepth=8 --rw=write --bs=256K
zbc: (g=0): rw=write, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8
fio-3.13
Starting 1 process
Jobs: 1 (f=1): [W(1)][100.0%][w=243MiB/s][w=973 IOPS][eta 00m:00s]
zbc: (groupid=0, jobs=1): err= 0: pid=4220: Fri May 24 12:37:29 2019
  write: IOPS=949, BW=237MiB/s (249MB/s)(1024MiB/4316msec); 4 zone resets
    slat (nsec): min=5937, max=40055, avg=9651.92, stdev=2104.34
    clat (usec): min=795, max=36562, avg=8243.26, stdev=2031.55
     lat (usec): min=818, max=36571, avg=8252.96, stdev=2031.50
    clat percentiles (usec):
     |  1.00th=[ 3884],  5.00th=[ 7701], 10.00th=[ 8160], 20.00th=[ 8225],
     | 30.00th=[ 8225], 40.00th=[ 8225], 50.00th=[ 8225], 60.00th=[ 8291],
     | 70.00th=[ 8291], 80.00th=[ 8356], 90.00th=[ 8356], 95.00th=[ 8356],
     | 99.00th=[10159], 99.50th=[27919], 99.90th=[33817], 99.95th=[36439],
     | 99.99th=[36439]
   bw (  KiB/s): min=234538, max=249357, per=99.93%, avg=242777.88, stdev=5032.30, samples=8
   iops        : min=  916, max=  974, avg=948.25, stdev=19.70, samples=8
  lat (usec)   : 1000=0.02%
  lat (msec)   : 2=0.07%, 4=2.78%, 10=96.02%, 20=0.51%, 50=0.59%
  cpu          : usr=1.27%, sys=0.67%, ctx=1051, majf=0, minf=12
  IO depths    : 1=0.1%, 2=0.2%, 4=0.4%, 8=99.3%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,4096,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=8

Run status group 0 (all jobs):
  WRITE: bw=237MiB/s (249MB/s), 237MiB/s-237MiB/s (249MB/s-249MB/s), io=1024MiB (1074MB), run=4316-4316msec

Disk stats (read/write):
  sdd: ios=4/998, merge=0/2985, ticks=81/8205, in_queue=7286, util=24.38%
```

Note that *fio* output in this case indicates the number of zones that were
reset prior to writing.

### Sequential Read Workload

With the disk previous state preserved (with the first four sequential write
zones full), the previous command can be changed to read operations targeting
the written zones.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --size=1G \
      --ioengine=libaio --iodepth=8 --rw=read --bs=256K
zbc: (g=0): rw=read, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8
fio-3.13
Starting 1 process
Jobs: 1 (f=1): [R(1)][100.0%][r=243MiB/s][r=970 IOPS][eta 00m:00s]
zbc: (groupid=0, jobs=1): err= 0: pid=4236: Fri May 24 12:40:18 2019
  read: IOPS=951, BW=238MiB/s (249MB/s)(1024MiB/4304msec)
    slat (usec): min=5, max=148, avg= 6.62, stdev= 5.68
    clat (usec): min=976, max=39536, avg=8394.44, stdev=1933.57
     lat (usec): min=1125, max=39543, avg=8401.12, stdev=1934.43
    clat percentiles (usec):
     |  1.00th=[ 6390],  5.00th=[ 6718], 10.00th=[ 6915], 20.00th=[ 7439],
     | 30.00th=[ 8094], 40.00th=[ 8291], 50.00th=[ 8356], 60.00th=[ 8356],
     | 70.00th=[ 8356], 80.00th=[ 8356], 90.00th=[ 9765], 95.00th=[10290],
     | 99.00th=[14615], 99.50th=[25560], 99.90th=[29492], 99.95th=[39584],
     | 99.99th=[39584]
   bw (  KiB/s): min=223808, max=249868, per=99.57%, avg=242586.38, stdev=8265.29, samples=8
   iops        : min=  874, max=  976, avg=947.50, stdev=32.35, samples=8
  lat (usec)   : 1000=0.02%
  lat (msec)   : 2=0.05%, 4=0.05%, 10=92.53%, 20=6.81%, 50=0.54%
  cpu          : usr=0.40%, sys=0.72%, ctx=4113, majf=0, minf=522
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=99.8%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4096,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=8

Run status group 0 (all jobs):
   READ: bw=238MiB/s (249MB/s), 238MiB/s-238MiB/s (249MB/s-249MB/s), io=1024MiB (1074MB), run=4304-4304msec

Disk stats (read/write):
  sdd: ios=4031/0, merge=0/0, ticks=33836/0, in_queue=29809, util=57.74%
```

If the zones are reset before executing this command, no read I/O will be
executed as *fio* will be enable to find zones with written sectors.

```plaintext
# blkzone reset -o 274726912 -l 2097152 /dev/sdd
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --size=1G \
      --ioengine=libaio --iodepth=8 --rw=read --bs=256K
zbc: (g=0): rw=read, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8
fio-3.13
Starting 1 process


Run status group 0 (all jobs):

Disk stats (read/write):
  sdd: ios=0/0, merge=0/0, ticks=0/0, in_queue=0, util=0.00%
```

Forcing the execution of read I/Os targeting empty zones can be done using the
`--read_beyond_wp` option.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --size=1G --read_beyond_wp=1 \
      --ioengine=libaio --iodepth=8 --rw=read --bs=256K
zbc: (g=0): rw=read, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=8
fio-3.13
Starting 1 process
Jobs: 1 (f=1): [R(1)][-.-%][r=353MiB/s][r=1412 IOPS][eta 00m:00s]
zbc: (groupid=0, jobs=1): err= 0: pid=4322: Fri May 24 12:46:32 2019
  read: IOPS=1411, BW=353MiB/s (370MB/s)(1024MiB/2901msec)
    slat (usec): min=5, max=147, avg= 6.50, stdev= 5.72
    clat (usec): min=1978, max=8845, avg=5654.86, stdev=112.79
     lat (usec): min=2126, max=8851, avg=5661.41, stdev=111.86
    clat percentiles (usec):
     |  1.00th=[ 5604],  5.00th=[ 5604], 10.00th=[ 5604], 20.00th=[ 5669],
     | 30.00th=[ 5669], 40.00th=[ 5669], 50.00th=[ 5669], 60.00th=[ 5669],
     | 70.00th=[ 5669], 80.00th=[ 5669], 90.00th=[ 5669], 95.00th=[ 5735],
     | 99.00th=[ 5735], 99.50th=[ 5800], 99.90th=[ 7177], 99.95th=[ 7963],
     | 99.99th=[ 8848]
   bw (  KiB/s): min=360239, max=361261, per=99.81%, avg=360750.00, stdev=361.33, samples=5
   iops        : min= 1407, max= 1411, avg=1409.00, stdev= 1.41, samples=5
  lat (msec)   : 2=0.02%, 10=99.98%
  cpu          : usr=0.24%, sys=1.34%, ctx=4108, majf=0, minf=522
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=99.8%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.1%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4096,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=8

Run status group 0 (all jobs):
   READ: bw=353MiB/s (370MB/s), 353MiB/s-353MiB/s (370MB/s-370MB/s), io=1024MiB (1074MB), run=2901-2901msec

Disk stats (read/write):
  sdd: ios=3869/0, merge=0/0, ticks=21868/0, in_queue=18002, util=81.20%
```

:::note
The higher IOPS performance observed with this test compared to the previous one
(i.e. IOPS=1411 vs. IOPS=951) results from the disk not physically executing any
media access as there is no data to read (no written sectors). The disks returns
a fill pattern as data without seeking to the sectors specified by the read
commands.
:::

### Random Read and Write Workloads

The following command randomly write sequential write zones of the disk using 4
jobs, each job operating at a queue depth of 4 (overall queue depth of 16 for
the disk). The run time is set to 30 seconds.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --numjobs=4 --group_reporting=1 --runtime=30 \
      --ioengine=libaio --iodepth=4 --rw=randwrite --bs=256K
zbc: (g=0): rw=randwrite, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=4
...
fio-3.13
Starting 4 processes
Jobs: 4 (f=4): [w(4)][100.0%][w=33.0MiB/s][w=132 IOPS][eta 00m:00s]
zbc: (groupid=0, jobs=4): err= 0: pid=4425: Fri May 24 12:58:43 2019
  write: IOPS=160, BW=40.2MiB/s (42.2MB/s)(1209MiB/30064msec); 0 zone resets
    slat (nsec): min=7815, max=75710, avg=12304.05, stdev=3091.33
    clat (usec): min=1410, max=221285, avg=98856.71, stdev=29971.24
     lat (usec): min=1435, max=221295, avg=98869.07, stdev=29970.46
    clat percentiles (msec):
     |  1.00th=[   12],  5.00th=[   24], 10.00th=[   75], 20.00th=[   84],
     | 30.00th=[   89], 40.00th=[   94], 50.00th=[   99], 60.00th=[  105],
     | 70.00th=[  110], 80.00th=[  117], 90.00th=[  128], 95.00th=[  138],
     | 99.00th=[  194], 99.50th=[  203], 99.90th=[  218], 99.95th=[  220],
     | 99.99th=[  222]
   bw (  KiB/s): min=27092, max=138608, per=99.80%, avg=41096.13, stdev=3423.45, samples=240
   iops        : min=  103, max=  540, avg=159.05, stdev=13.38, samples=240
  lat (msec)   : 2=0.02%, 4=0.06%, 10=0.43%, 20=3.74%, 50=1.26%
  lat (msec)   : 100=47.27%, 250=47.21%
  cpu          : usr=0.09%, sys=0.15%, ctx=84537, majf=0, minf=261
  IO depths    : 1=0.1%, 2=0.2%, 4=99.8%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,4836,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=4

Run status group 0 (all jobs):
  WRITE: bw=40.2MiB/s (42.2MB/s), 40.2MiB/s-40.2MiB/s (42.2MB/s-42.2MB/s), io=1209MiB (1268MB), run=30064-30064msec

Disk stats (read/write):
  sdd: ios=0/4807, merge=0/0, ticks=0/474905, in_queue=470163, util=9.89%
```

*zbc_report_zones* can be used to explore the state of the disk at the end of
this workload execution.

```plaintext
# zbc_report_zones -ro full -n /dev/sdd
Device /dev/sdd:
    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx
    Zoned block device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    0 zone from 0, reporting option 0x05
# zbc_report_zones -ro closed -n /dev/sdd
Device /dev/sdd:
    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx
    Zoned block device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    4498 zones from 0, reporting option 0x04
# zbc_report_zones -ro imp_open -n /dev/sdd
Device /dev/sdd:
    Vendor ID: ATA xxxx xxxxxxxxxxx xxxx
    Zoned block device interface, Host-managed zone model
    29297213440 512-bytes sectors
    3662151680 logical blocks of 4096 B
    3662151680 physical blocks of 4096 B
    15000.173 GB capacity
    Read commands are unrestricted
    Maximum number of open sequential write required zones: 128
    128 zones from 0, reporting option 0x02
```

This indicates that 4498+128=4626 zones were written to, with none of the
sequential write zones fully written (no full zone). Switching the operation
mode to read, the sectors written in this last run can be randomly read.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \                
      --offset=140660178944 --numjobs=4 --group_reporting=1 --runtime=30 \      
      --ioengine=libaio --iodepth=4 --rw=randread --bs=256K
...
fio-3.13
Starting 4 processes
Jobs: 4 (f=4): [r(4)][0.0%][r=31.0MiB/s][r=124 IOPS][eta 23d:02h:02m:24s]
zbc: (groupid=0, jobs=4): err= 0: pid=4494: Fri May 24 13:24:08 2019
  read: IOPS=118, BW=29.7MiB/s (31.1MB/s)(894MiB/30156msec)
    slat (usec): min=6, max=183, avg= 7.86, stdev= 8.75
    clat (usec): min=1252, max=1537.8k, avg=133931.63, stdev=123584.49
     lat (usec): min=1260, max=1537.8k, avg=133939.56, stdev=123584.42
    clat percentiles (msec):
     |  1.00th=[    8],  5.00th=[   16], 10.00th=[   20], 20.00th=[   35],
     | 30.00th=[   53], 40.00th=[   72], 50.00th=[   96], 60.00th=[  127],
     | 70.00th=[  169], 80.00th=[  218], 90.00th=[  296], 95.00th=[  368],
     | 99.00th=[  558], 99.50th=[  625], 99.90th=[  869], 99.95th=[  919],
     | 99.99th=[ 1536]
   bw (  KiB/s): min=15855, max=50152, per=100.00%, avg=30364.05, stdev=1762.17, samples=240
   iops        : min=   60, max=  195, avg=117.22, stdev= 6.92, samples=240
  lat (msec)   : 2=0.22%, 4=0.06%, 10=1.40%, 20=8.44%, 50=18.26%
  lat (msec)   : 100=23.15%, 250=33.30%, 500=13.47%, 750=1.51%, 1000=0.17%
  cpu          : usr=0.06%, sys=0.12%, ctx=82815, majf=0, minf=1281
  IO depths    : 1=0.1%, 2=0.2%, 4=99.7%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3577,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=4

Run status group 0 (all jobs):
   READ: bw=29.7MiB/s (31.1MB/s), 29.7MiB/s-29.7MiB/s (31.1MB/s-31.1MB/s), io=894MiB (938MB), run=30156-30156msec

Disk stats (read/write):
  sdd: ios=3565/0, merge=0/0, ticks=475774/0, in_queue=472274, util=11.93%
```

Resetting all sequential write zones of the disk and executing again the random
read workload leads to similar results as for the previous [sequential read
workload](#sequential-read-workload) case, that is, no read I/O is executed.

```plaintext
# blkzone reset -o 274726912 /dev/sdd
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --numjobs=4 --group_reporting=1 --runtime=30 \
      --ioengine=libaio --iodepth=4 --rw=randread --bs=256K
...
fio-3.13
Starting 4 processes


Run status group 0 (all jobs):

Disk stats (read/write):
  sdd: ios=0/0, merge=0/0, ticks=0/0, in_queue=0, util=0.00%
```

Changing the range to be read to include the conventional zones of the disk
will result in read I/Os being executed.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=0 --size=140660178944 --numjobs=4 --group_reporting=1 \
      --runtime=30 --ioengine=libaio --iodepth=4 --rw=randread --bs=256K
zbc: (g=0): rw=randread, bs=(R) 256KiB-256KiB, (W) 256KiB-256KiB, (T) 256KiB-256KiB, ioengine=libaio, iodepth=4
...
fio-3.13
Starting 4 processes
Jobs: 4 (f=4): [r(4)][100.0%][r=58.0MiB/s][r=232 IOPS][eta 00m:00s]
zbc: (groupid=0, jobs=4): err= 0: pid=4570: Fri May 24 13:35:15 2019
  read: IOPS=215, BW=53.8MiB/s (56.4MB/s)(1617MiB/30079msec)
    slat (usec): min=6, max=143, avg= 7.29, stdev= 6.22
    clat (usec): min=1065, max=959229, avg=74313.80, stdev=83291.27
     lat (usec): min=1072, max=959237, avg=74321.15, stdev=83291.39
    clat percentiles (msec):
     |  1.00th=[    8],  5.00th=[    9], 10.00th=[   12], 20.00th=[   17],
     | 30.00th=[   24], 40.00th=[   34], 50.00th=[   47], 60.00th=[   62],
     | 70.00th=[   82], 80.00th=[  113], 90.00th=[  174], 95.00th=[  239],
     | 99.00th=[  409], 99.50th=[  472], 99.90th=[  634], 99.95th=[  651],
     | 99.99th=[  961]
   bw (  KiB/s): min=27136, max=81920, per=99.97%, avg=55030.83, stdev=2685.56, samples=240
   iops        : min=  106, max=  320, avg=214.10, stdev=10.53, samples=240
  lat (msec)   : 2=0.02%, 10=8.23%, 20=16.22%, 50=28.40%, 100=23.61%
  lat (msec)   : 250=19.08%, 500=4.07%, 750=0.36%, 1000=0.03%
  cpu          : usr=0.02%, sys=0.07%, ctx=6483, majf=0, minf=1070
  IO depths    : 1=0.1%, 2=0.1%, 4=99.8%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=6468,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=4

Run status group 0 (all jobs):
   READ: bw=53.8MiB/s (56.4MB/s), 53.8MiB/s-53.8MiB/s (56.4MB/s-56.4MB/s), io=1617MiB (1696MB), run=30079-30079msec

Disk stats (read/write):
  sdd: ios=6452/0, merge=0/0, ticks=479006/0, in_queue=472619, util=21.62%
```

## Direct Access *sg* I/O Engine

The SCSI generic direct access interface can also be used with the *zbd* zone
mode, as long as the block device file (*/dev/sdX*) is used to specify the disk.
The *zbd* zone mode will not be enabled if the SCSI generic node file
(*/dev/sgY*) is used to specify the disk.

The example below illustrates the use of the *sg* I/O engine with 8 jobs
executing a 64KB random write workload to sequential write zones.

```plaintext
# fio --name=zbc --filename=/dev/sdd --direct=1 --zonemode=zbd \
      --offset=140660178944 --size=1G --numjobs=8 --group_reporting=1 \
      --ioengine=sg --rw=randwrite --bs=64K
...
fio-3.13
Starting 8 processes
zbc: (groupid=0, jobs=8): err= 0: pid=4792: Fri May 24 14:18:52 2019
  write: IOPS=2007, BW=125MiB/s (132MB/s)(8192MiB/65278msec); 32 zone resets
    clat (usec): min=148, max=327494, avg=1589.26, stdev=4060.13
     lat (usec): min=149, max=327497, avg=1590.55, stdev=4060.13
    clat percentiles (usec):
     |  1.00th=[   848],  5.00th=[   988], 10.00th=[  1090], 20.00th=[  1172],
     | 30.00th=[  1221], 40.00th=[  1287], 50.00th=[  1369], 60.00th=[  1434],
     | 70.00th=[  1500], 80.00th=[  1631], 90.00th=[  2180], 95.00th=[  2638],
     | 99.00th=[  3064], 99.50th=[  3392], 99.90th=[ 24773], 99.95th=[ 77071],
     | 99.99th=[291505]
   bw (  KiB/s): min=39001, max=178678, per=100.00%, avg=131457.71, stdev=3143.56, samples=1015
   iops        : min=  606, max= 2791, avg=2052.81, stdev=49.16, samples=1015
  lat (usec)   : 250=0.07%, 500=0.12%, 750=0.38%, 1000=4.89%
  lat (msec)   : 2=81.56%, 4=12.76%, 10=0.05%, 20=0.06%, 50=0.05%
  lat (msec)   : 100=0.03%, 250=0.02%, 500=0.01%
  cpu          : usr=0.14%, sys=0.20%, ctx=251460, majf=0, minf=139
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,131072,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
  WRITE: bw=125MiB/s (132MB/s), 125MiB/s-125MiB/s (132MB/s-132MB/s), io=8192MiB (8590MB), run=65278-65278msec

Disk stats (read/write):
  sdd: ios=278/0, merge=0/0, ticks=1953/0, in_queue=1677, util=0.39%
```

:::note
SCSI generic direct access bypasses the block layer I/O scheduler. For zoned
block devices, this means that the *deadline* I/O scheduler zone write locking
is enable to provide write command ordering guarantees.  However, the *zbd* mode
ensures mutual exclusion between jobs for write access to the same zone. Such
synchronization is in essence identical to zone write locking and execute all
write commands without any error.
:::

## Zone Write Streams

A typical zoned block device compliant application will write zones sequentially
until the zone is full, then switch to another zone and continue writing.
Multiple threads may be operating in this manner, with each thread operating on
a different zone.

Such typical behavior can be emulated using the option `--rw_sequencer`
together with a number of I/O operations specified at the end of the
`--rw=randwrite` argument. Below is an example script of 4 jobs sequentially
writing zones up to full using 512KB write operations (that is, 512 I/Os per
256 MB zone). The zones being written are chosen randomly within disjoint zone
ranges for each job. This is controlled with the `offset`, `size` and `rw`
arguments. The script file `streams.fio` achieving such workload is shown below.

```plaintext
#
# streams.fio: 4 write streams
#

[global]
ioengine=psync
direct=1
thread=1
bs=512K
continue_on_error=none
filename=/dev/sdd
group_reporting=1
zonemode=zbd

[stream1]
offset=140660178944
size=3714878275584
rw=randwrite:512
rw_sequencer=sequential
io_size=2G

[stream2]
offset=3855538454528
size=3714878275584
rw=randwrite:512
rw_sequencer=sequential
io_size=2G

[stream3]
offset=7570416730112
size=3714878275584
rw=randwrite:512
rw_sequencer=sequential
io_size=2G

[stream4]
offset=11285295005696
size=3714878275584
rw=randwrite:512
rw_sequencer=sequential
io_size=2G
```

The result for this script execution is shown below.

```plaintext
# fio streams.fio
stream1: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1
stream2: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1
stream3: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1
stream4: (g=0): rw=randwrite, bs=(R) 512KiB-512KiB, (W) 512KiB-512KiB, (T) 512KiB-512KiB, ioengine=psync, iodepth=1
fio-3.13
Starting 4 threads
Jobs: 1 (f=1): [_(3),w(1)][98.3%][w=159MiB/s][w=318 IOPS][eta 00m:01s]
stream1: (groupid=0, jobs=4): err= 0: pid=5161: Fri May 24 15:01:21 2019
  write: IOPS=285, BW=143MiB/s (150MB/s)(8192MiB/57362msec); 0 zone resets
    clat (usec): min=992, max=5788.2k, avg=12731.27, stdev=95315.03
     lat (usec): min=996, max=5788.2k, avg=12742.01, stdev=95315.03
    clat percentiles (usec):
     |  1.00th=[   1106],  5.00th=[   2024], 10.00th=[   2114],
     | 20.00th=[   2278], 30.00th=[   2769], 40.00th=[   3687],
     | 50.00th=[   3884], 60.00th=[   4047], 70.00th=[   4228],
     | 80.00th=[   4817], 90.00th=[   5342], 95.00th=[  50594],
     | 99.00th=[ 196084], 99.50th=[ 258999], 99.90th=[ 876610],
     | 99.95th=[2071987], 99.99th=[4731175]
   bw (  KiB/s): min= 9211, max=840925, per=100.00%, avg=185793.45, stdev=44491.80, samples=352
   iops        : min=   17, max= 1642, avg=361.42, stdev=86.97, samples=352
  lat (usec)   : 1000=0.23%
  lat (msec)   : 2=1.95%, 4=54.69%, 10=37.05%, 20=0.15%, 50=0.90%
  lat (msec)   : 100=2.34%, 250=2.16%, 500=0.42%, 750=0.01%, 1000=0.01%
  lat (msec)   : 2000=0.04%, >=2000=0.06%
  cpu          : usr=0.15%, sys=0.12%, ctx=16505, majf=0, minf=0
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,16384,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
  WRITE: bw=143MiB/s (150MB/s), 143MiB/s-143MiB/s (150MB/s-150MB/s), io=8192MiB (8590MB), run=57362-57362msec

Disk stats (read/write):
  sdd: ios=144/16333, merge=0/0, ticks=573/208225, in_queue=192356, util=28.64%
```
