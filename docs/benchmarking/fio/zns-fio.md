---
id: zns-fio
title: fio Examples for NVMe ZNS Devices
sidebar_label: Examples for NVMe ZNS Devices
---

To avoid additional overhead, the *mq-deadline* scheduler may be disabled for the
following *fio* examples.
This is possible because the write workload uses the *psync* ioengine, which
synchronizes the write commands. In addition each write job operates on a
different sets of zones. Therefore, *mq-deadline* can be avoided, and the zone
write pointers are still advanced in order to comply with the sequential write
constraint.

For read workloads the sequential write constraint is not violated and reads can
be issued out of order without *mq-deadline* being enabled.

*fio* runs that enable *psync*, can emulate a *iodepth* like behavior by using the
*numjobs* parameter in combination with `offset_increment == size`. This results
in *numjobs* asynchronous operations that use a dedicated set of zones, which
demonstrates the parallel performance potential.

Since ZNS devices have a sequential write constraint, only sequential writes are
benchmarked. Benchmarking random writes with *fio* is not trivial because the
writes will eventually end up being sequentially written to the ZNS device,
therefore the results will be influenced by *fio*'s scheduling.

:::note
Before issuing writes on a ZNS drive the zones should be reset by calling:
```
# blkzone reset /dev/nvmeXnX
```
:::

## Sequential writes
Assuming that the drive to be benchmarked has `max_open_zones=14` and more than
112 zones (`= offset_increment * max(numjobs)`), a write workload may be issued
like the following example shows:
```
# fio --ioengine=psync --direct=1 --filename=/dev/nvmeXnX --rw=write \
      --bs=64k --group_reporting --zonemode=zbd --name=seqwrite \
      --offset_increment=8z --size=8z --numjobs=14 --job_max_open_zones=1

seqwrite: (g=0): rw=write, bs=(R) 64.0KiB-64.0KiB, (W) 64.0KiB-64.0KiB, (T) 64.0KiB-64.0KiB, ioengine=psync, iodepth=1
...
fio-3.30
Starting 14 processes
Jobs: 14 (f=14): [W(14)][52.1%][w=2016MiB/s][w=32.3k IOPS][eta 00m:58s]
seqwrite: (groupid=0, jobs=14): err= 0: pid=3106632: Mon Jun 27 17:36:58 2022
  write: IOPS=30.3k, BW=1894MiB/s (1986MB/s)(118GiB/63700msec); 0 zone resets
    clat (usec): min=48, max=39010, avg=459.24, stdev=300.70
     lat (usec): min=48, max=39010, avg=459.94, stdev=300.70
    clat percentiles (usec):
     |  1.00th=[   74],  5.00th=[  105], 10.00th=[  141], 20.00th=[  217],
     | 30.00th=[  289], 40.00th=[  363], 50.00th=[  437], 60.00th=[  506],
     | 70.00th=[  578], 80.00th=[  660], 90.00th=[  775], 95.00th=[  889],
     | 99.00th=[ 1221], 99.50th=[ 1401], 99.90th=[ 2212], 99.95th=[ 2606],
     | 99.99th=[ 8848]
   bw (  MiB/s): min= 1402, max= 2099, per=100.00%, avg=1898.84, stdev=14.55, samples=1769
   iops        : min=22440, max=33592, avg=30381.38, stdev=232.73, samples=1769
  lat (usec)   : 50=0.01%, 100=4.32%, 250=20.21%, 500=34.56%, 750=29.17%
  lat (usec)   : 1000=8.92%
  lat (msec)   : 2=2.67%, 4=0.12%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=0.73%, sys=1.82%, ctx=1930132, majf=0, minf=207
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,1929984,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
  WRITE: bw=1894MiB/s (1986MB/s), 1894MiB/s-1894MiB/s (1986MB/s-1986MB/s), io=118GiB (126GB), run=63700-63700msec

Disk stats (read/write):
  nvme5n1: ios=338/1929371, merge=0/0, ticks=47/870253, in_queue=870301, util=99.89%
```
The parameters *bs* and *numjobs* can be variated to benchmark different
workload patterns.

## Random and sequential reads
Assuming that the drive to be benchmarked has `max_open_zones=14` and more than
140 zones (`= offset_increment * max(numjobs)`), the drive must be prepared with
data to read of the device, like the example shows.
:::note
If the drive is not prepared for the read workload's address range, *fio*
reports wrong performance numbers.
:::

### Write prepare
```
# fio --ioengine=psync --direct=1 --filename=/dev/nvmeXnX --rw=write --bs=128k \
      --group_reporting --zonemode=zbd --name=writeprepare \
      --offset_increment=10z --size=10z --numjobs=14 --job_max_open_zones=1

writeprepare: (g=0): rw=write, bs=(R) 128KiB-128KiB, (W) 128KiB-128KiB, (T) 128KiB-128KiB, ioengine=psync, iodepth=1
...
fio-3.30
Starting 14 processes
Jobs: 14 (f=14): [W(14)][52.2%][w=1989MiB/s][w=15.9k IOPS][eta 01m:15s]
writeprepare: (groupid=0, jobs=14): err= 0: pid=3106687: Mon Jun 27 17:38:25 2022
  write: IOPS=14.6k, BW=1831MiB/s (1920MB/s)(147GiB/82360msec); 0 zone resets
    clat (usec): min=76, max=59281, avg=952.30, stdev=554.79
     lat (usec): min=77, max=59282, avg=953.70, stdev=554.80
    clat percentiles (usec):
     |  1.00th=[  143],  5.00th=[  221], 10.00th=[  306], 20.00th=[  461],
     | 30.00th=[  611], 40.00th=[  766], 50.00th=[  914], 60.00th=[ 1057],
     | 70.00th=[ 1205], 80.00th=[ 1385], 90.00th=[ 1614], 95.00th=[ 1827],
     | 99.00th=[ 2343], 99.50th=[ 2638], 99.90th=[ 3720], 99.95th=[ 4228],
     | 99.99th=[13173]
   bw (  MiB/s): min= 1376, max= 2077, per=100.00%, avg=1831.70, stdev=12.39, samples=2296
   iops        : min=11008, max=16622, avg=14653.59, stdev=99.13, samples=2296
  lat (usec)   : 100=0.05%, 250=6.70%, 500=15.75%, 750=16.64%, 1000=16.83%
  lat (msec)   : 2=41.23%, 4=2.74%, 10=0.05%, 20=0.02%, 50=0.01%
  lat (msec)   : 100=0.01%
  cpu          : usr=0.51%, sys=1.03%, ctx=1206314, majf=0, minf=176
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,1206240,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
  WRITE: bw=1831MiB/s (1920MB/s), 1831MiB/s-1831MiB/s (1920MB/s-1920MB/s), io=147GiB (158GB), run=82360-82360msec

Disk stats (read/write):
  nvme5n1: ios=48/1202694, merge=0/0, ticks=8/1134109, in_queue=1134117, util=99.92%
```

### Sequential read
```
# fio --ioengine=psync --direct=1 --filename=/dev/nvmeXnX --rw=read \
      --offset_increment=4z --size=4z --group_reporting --zonemode=zbd \
      --bs=128k --name=seqread --numjobs=32 --time_based=1 --runtime=10

seqread: (g=0): rw=read, bs=(R) 128KiB-128KiB, (W) 128KiB-128KiB, (T) 128KiB-128KiB, ioengine=psync, iodepth=1
...
fio-3.30
Starting 32 processes
Jobs: 32 (f=32): [R(32)][100.0%][r=3005MiB/s][r=24.0k IOPS][eta 00m:00s]
seqread: (groupid=0, jobs=32): err= 0: pid=3112621: Mon Jun 27 17:38:36 2022
  read: IOPS=23.9k, BW=2992MiB/s (3138MB/s)(29.2GiB/10003msec)
    clat (usec): min=364, max=10454, avg=1335.16, stdev=750.14
     lat (usec): min=364, max=10454, avg=1335.31, stdev=750.14
    clat percentiles (usec):
     |  1.00th=[  502],  5.00th=[  594], 10.00th=[  668], 20.00th=[  775],
     | 30.00th=[  889], 40.00th=[ 1004], 50.00th=[ 1123], 60.00th=[ 1270],
     | 70.00th=[ 1467], 80.00th=[ 1762], 90.00th=[ 2278], 95.00th=[ 2802],
     | 99.00th=[ 4113], 99.50th=[ 4752], 99.90th=[ 6194], 99.95th=[ 6849],
     | 99.99th=[ 8291]
   bw (  MiB/s): min= 2809, max= 3168, per=100.00%, avg=2994.44, stdev= 2.84, samples=608
   iops        : min=22479, max=25343, avg=23954.79, stdev=22.68, samples=608
  lat (usec)   : 500=0.94%, 750=16.55%, 1000=22.41%
  lat (msec)   : 2=45.83%, 4=13.16%, 10=1.12%, 20=0.01%
  cpu          : usr=0.20%, sys=0.87%, ctx=239539, majf=0, minf=1493
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=239452,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=2992MiB/s (3138MB/s), 2992MiB/s-2992MiB/s (3138MB/s-3138MB/s), io=29.2GiB (31.4GB), run=10003-10003msec

Disk stats (read/write):
  nvme5n1: ios=235947/0, merge=0/0, ticks=312373/0, in_queue=312373, util=98.94%
```
The parameters *bs* and *numjobs* can be variated to benchmark different
workload patterns. On read workloads the parameter *numjobs* may exceed the
*max_open_zones* limit since a zone does not need to be opened for reads.

### Random read
```
# fio --ioengine=io_uring --direct=1 --filename=/dev/nvmeXnX --rw=randread \
      --size=128z --zonemode=zbd --bs=128k --name=randread --iodepth=32

randread: (g=0): rw=randread, bs=(R) 128KiB-128KiB, (W) 128KiB-128KiB, (T) 128KiB-128KiB, ioengine=io_uring, iodepth=32
fio-3.30
Starting 1 process
Jobs: 1 (f=1): [r(1)][100.0%][r=2986MiB/s][r=23.9k IOPS][eta 00m:00s]
randread: (groupid=0, jobs=1): err= 0: pid=3112688: Mon Jun 27 17:40:03 2022
  read: IOPS=24.0k, BW=2997MiB/s (3143MB/s)(256GiB/87459msec)
    slat (usec): min=5, max=484, avg= 8.21, stdev= 1.50
    clat (usec): min=334, max=15331, avg=1325.34, stdev=779.62
     lat (usec): min=341, max=15339, avg=1333.69, stdev=779.61
    clat percentiles (usec):
     |  1.00th=[  486],  5.00th=[  578], 10.00th=[  652], 20.00th=[  766],
     | 30.00th=[  873], 40.00th=[  988], 50.00th=[ 1106], 60.00th=[ 1254],
     | 70.00th=[ 1450], 80.00th=[ 1729], 90.00th=[ 2245], 95.00th=[ 2802],
     | 99.00th=[ 4293], 99.50th=[ 5014], 99.90th=[ 6783], 99.95th=[ 7504],
     | 99.99th=[ 9503]
   bw (  MiB/s): min= 2950, max= 3028, per=100.00%, avg=2999.17, stdev=12.81, samples=174
   iops        : min=23600, max=24224, avg=23993.36, stdev=102.51, samples=174
  lat (usec)   : 500=1.36%, 750=17.40%, 1000=22.59%
  lat (msec)   : 2=44.71%, 4=12.62%, 10=1.32%, 20=0.01%
  cpu          : usr=3.43%, sys=24.06%, ctx=1522042, majf=0, minf=1035
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=0.1%, 16=0.1%, 32=100.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.1%, 64=0.0%, >=64=0.0%
     issued rwts: total=2097152,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=32

Run status group 0 (all jobs):
   READ: bw=2997MiB/s (3143MB/s), 2997MiB/s-2997MiB/s (3143MB/s-3143MB/s), io=256GiB (275GB), run=87459-87459msec

Disk stats (read/write):
  nvme5n1: ios=2095001/0, merge=0/0, ticks=2778262/0, in_queue=2778262, util=99.95%
```
The parameters *bs* and `iodepth` can be variated to benchmark different
workload patterns.

More ZNS benchmarking examples and scripts can be found in the
[ZBDBench](https://github.com/westerndigitalcorporation/zbdbench) repository.
After satisfying the prerequisites of ZBDBench, the benchmarks above are
executed when calling:
```
# python3 ./run.py -d /dev/nvmeXnX -b fio_zone_throughput_avg_lat --none-scheduler
```

## Read random while writing sequentially
The following job file shows an example for a mixed workload with 30% of writes
and 70% of reads. It expects the first 32 zones to be prepared (see [Write
prepare](#write-prepare)) as the reads are issued in this range.
The writer is offset by 256 zones, thus the drive to be benchmarked needs to have
then 264 zones  (`= write_offset + write_size`).

`zbd-read-while-write.fio`:
```
[global]
bs=32k
direct=1
zonemode=zbd
name=readwhilewriting
time_based
runtime=30
numjobs=1

[write]
ioengine=psync
rw=write
iodepth=1
offset=256z
offset_increment=8z
size=8z
flow=-3

[randread]
ioengine=io_uring
rw=randread
iodepth=32
size=32z
offset=0
flow=7
```

```
# fio --filename=/dev/nvmeXnX <path_to>/zbd-read-while-write.fio

write: (g=0): rw=write, bs=(R) 32.0KiB-32.0KiB, (W) 32.0KiB-32.0KiB, (T) 32.0KiB-32.0KiB, ioengine=psync, iodepth=1
randread: (g=0): rw=randread, bs=(R) 32.0KiB-32.0KiB, (W) 32.0KiB-32.0KiB, (T) 32.0KiB-32.0KiB, ioengine=io_uring, iodepth=32
fio-3.30
Starting 2 processes
Jobs: 2 (f=2): [W(1),r(1)][100.0%][r=2298MiB/s,w=649MiB/s][r=73.5k,w=20.8k IOPS][eta 00m:00s]
write: (groupid=0, jobs=1): err= 0: pid=3112730: Mon Jun 27 17:40:34 2022
  write: IOPS=20.8k, BW=649MiB/s (680MB/s)(19.0GiB/30001msec); 11 zone resets
    clat (usec): min=33, max=1683, avg=47.09, stdev= 9.93
     lat (usec): min=33, max=1683, avg=47.29, stdev= 9.93
    clat percentiles (usec):
     |  1.00th=[   36],  5.00th=[   37], 10.00th=[   38], 20.00th=[   40],
     | 30.00th=[   42], 40.00th=[   43], 50.00th=[   45], 60.00th=[   48],
     | 70.00th=[   50], 80.00th=[   53], 90.00th=[   59], 95.00th=[   65],
     | 99.00th=[   82], 99.50th=[   90], 99.90th=[  106], 99.95th=[  115],
     | 99.99th=[  135]
   bw (  KiB/s): min=643328, max=675904, per=100.00%, avg=664946.98, stdev=7630.42, samples=59
   iops        : min=20104, max=21122, avg=20779.59, stdev=238.47, samples=59
  lat (usec)   : 50=70.82%, 100=29.00%, 250=0.18%, 500=0.01%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=4.05%, sys=9.33%, ctx=622712, majf=0, minf=16
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,622686,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randread: (groupid=0, jobs=1): err= 0: pid=3112731: Mon Jun 27 17:40:34 2022
  read: IOPS=72.1k, BW=2253MiB/s (2362MB/s)(66.0GiB/30001msec)
    slat (nsec): min=2726, max=97205, avg=5255.51, stdev=2232.08
    clat (usec): min=119, max=4994, avg=437.72, stdev=227.73
     lat (usec): min=130, max=5000, avg=443.08, stdev=227.72
    clat percentiles (usec):
     |  1.00th=[  186],  5.00th=[  206], 10.00th=[  225], 20.00th=[  262],
     | 30.00th=[  297], 40.00th=[  334], 50.00th=[  379], 60.00th=[  424],
     | 70.00th=[  486], 80.00th=[  570], 90.00th=[  725], 95.00th=[  881],
     | 99.00th=[ 1270], 99.50th=[ 1434], 99.90th=[ 1795], 99.95th=[ 1975],
     | 99.99th=[ 2343]
   bw (  MiB/s): min= 2167, max= 2331, per=100.00%, avg=2252.80, stdev=49.04, samples=59
   iops        : min=69358, max=74616, avg=72089.53, stdev=1569.23, samples=59
  lat (usec)   : 250=16.97%, 500=54.94%, 750=19.13%, 1000=5.90%
  lat (msec)   : 2=3.01%, 4=0.04%, 10=0.01%
  cpu          : usr=10.51%, sys=44.28%, ctx=947024, majf=0, minf=270
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=0.1%, 16=0.1%, 32=100.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.1%, 64=0.0%, >=64=0.0%
     issued rwts: total=2162550,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=32

Run status group 0 (all jobs):
   READ: bw=2253MiB/s (2362MB/s), 2253MiB/s-2253MiB/s (2362MB/s-2362MB/s), io=66.0GiB (70.9GB), run=30001-30001msec
  WRITE: bw=649MiB/s (680MB/s), 649MiB/s-649MiB/s (680MB/s-680MB/s), io=19.0GiB (20.4GB), run=30001-30001msec

Disk stats (read/write):
  nvme5n1: ios=2152981/620234, merge=0/0, ticks=934882/26574, in_queue=961456, util=99.74%
```

The parameters *bs*, *flow* and *numjobs* can be variated to benchmark different
workload patterns.

