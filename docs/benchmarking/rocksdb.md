---
id: rocksdb
title: Benchmarking RocksDB - ZenFS
sidebar_label: RocksDB - ZenFS
---

> ZenFS is a file system plugin that utilizes
> [RocksDB](https://github.com/facebook/rocksdb)'s FileSystem interface to place
> files into zones on a raw zoned block device.
>
> -- <cite>[ZenFS](https://github.com/westerndigitalcorporation/zenfs)</cite>

To setup ZenFS on a NVMe ZNS device, follow the instructions
[here](https://github.com/westerndigitalcorporation/zenfs#getting-started).

Basic `db_bench` performance testing can be done by following the instructions
[here](https://github.com/westerndigitalcorporation/zenfs#performance-testing).

The performance results in section 5.2 of the paper [ZNS: Avoiding the Block Interface Tax for Flash-based SSDs](https://www.pdl.cmu.edu/PDL-FTP/Storage/USENIX_ATC_2021_ZNS.pdf)
can be replicated by using the 
[ZBDBench](https://github.com/westerndigitalcorporation/zbdbench) benchmark
collection.

The following command will replicate the performance tests shown in the paper.

```plaintext
# python3 ./run.py -d /dev/nvmeXnX -b zns_atc_paper_eval
```

:::note
The results hown in section 5.2 of the paper were obtained using a 2TB NVMe ZNS
device. ZNS devices with different capacities have different maximum
performance.
:::
