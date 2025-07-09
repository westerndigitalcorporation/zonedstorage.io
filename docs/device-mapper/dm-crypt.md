---
id: dm-crypt
title: dm-crypt
sidebar_label: dm-crypt
---

# dm-crypt

The *dm-crypt* target implements encryption and decryption of data written to
and read from a block device, using the kernel crypto API.

## Zoned Block Device Restrictions

The same zone alignment restrictions that apply to the
[*dm-linear*](/docs/device-mapper/dm-linear) target also apply to *dm-crypt*.

In addition, when using a zoned block device, *dm-crypt* can only be used with
the *plain* mode. LUKS format is not supported. This means that the key used for
encryption and decryption must be provided by the user when initializing the
*dm-crypt* device. This key is not securely and permanently stored on the zoned
block device.

## Example

*dm-crypt* detailed documentation and usage examples can be found in the kernel
source code documentation file <a href="https://github.com/torvalds/linux/blob/master/Documentation/admin-guide/device-mapper/dm-crypt.rst"
target="_blank">Documentation/admin-guide/device-mapper/dm-crypt.rst</a>.

The script below shows a simple example for setting up *dm-crypt* on top of an
SMR hard-disk using the *cryptsetup* utility. With this script, since the file
containing the encryption key is stored unencrypted and will be lost if the
system is rebooted, **this example should not be used in a production system**.

```bash
#!/bin/bash

if [ $# != 1 ]; then
        echo "Usage: $0 <device>"
        exit 1
fi

dev="$(realpath "$1")"
dname="$(basename "${dev}")"
keyfile="/tmp/dm-crypt-${dname}-keyfile"


if [ ! -e ${keyfile} ]; then
        # Generate a key file (4096-bits key)
        dd if=/dev/random of="${keyfile}" bs=1 count=512 > /dev/null 2>&1
fi

cryptsetup open --type plain \
        --cipher null --key-size 512 --key-file "${keyfile}" \
        "${dev}" "crypt-${dname}"

ls -aFl /dev/mapper | grep crypt
```

Running this scripts creates a device mapper zoned block device.

```plaintext
# dm-crypt-setup.sh /dev/sdb
lrwxrwxrwx.  1 root root       7 Jul  9 18:40 crypt-sdb -> ../dm-0

# blkzone report /dev/dm-0
  start: 0x000000000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000080000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000100000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
  start: 0x000180000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 0(nw) [type: 1(CONVENTIONAL)]
...
  start: 0xda4680000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0xda4700000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
  start: 0xda4780000, len 0x080000, cap 0x080000, wptr 0x000000 reset:0 non-seq:0, zcond: 1(em) [type: 2(SEQ_WRITE_REQUIRED)]
```
