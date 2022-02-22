---
id: zns
title: Linux Tools for ZNS
sidebar_label: ZNS Tools
---

# ZNS Tools

Zoned namespace support was added to the Linux kernel in version 5.9. The
initial driver release requires the namespace to implement the "Zone Append"
command in order to work with the kernel's block stack.

## nvme-cli

Open source tooling for zns is provided by <a
href="https://github.com/linux-nvme/nvme-cli" target="_blank">nvme-cli</a> in
the current master branch (version 1.12 and later).  We recommend that you use
the latest version. 

The ZNS-specific commands all use the *zns* command line prefix. See more *zns* 
commands by running the *zns help* command:

```plaintext
# nvme zns help
nvme-1.12
usage: nvme zns <command> [<device>] [<args>]

The '<device>' may be either an NVMe character device (ex: /dev/nvme0) or an
nvme block device (ex: /dev/nvme0n1).

Zoned Namespace Command Set

The following are all implemented sub-commands:
  id-ctrl             Retrieve ZNS controller identification
  id-ns               Retrieve ZNS namespace identification
  zone-mgmt-recv      Sends the zone management receive command
  zone-mgmt-send      Sends the zone management send command
  report-zones        Retrieve the Report Zones report
  close-zone          Closes one or more zones
  finish-zone         Finishes one or more zones
  open-zone           Opens one or more zones
  reset-zone          Resets one or more zones
  offline-zone        Offlines one or more zones
  set-zone-desc       Attaches zone descriptor extension data
  zone-append         Writes data and metadata (if applicable), appended to the end of the requested zone
  changed-zone-list   Retrieves the changed zone list log
```

### Identify ZNS Controller

The Zoned Namespace Command Set specification currently defines only one field
in the command set's Identify Controller: the Zone Append Size Limit (ZASL).
The Zone Append Size Limit (ZASL) encodes the maximum command size for a Zone
Append command. The example below returns '5', which corresponds to 128k bytes
(the maximum size that can be appended in this example):

```plaintext
# nvme zns id-ctrl /dev/nvme1n1
NVMe ZNS Identify Controller:
zasl    : 5
```

### Identify ZNS Namespace

Information specific to a Zoned Namespace can be found in this command set's
Identify Namespace.

```plaintext
# nvme zns id-ns /dev/nvme1n1
ZNS Command Set Identify Namespace:
zoc     : 0
ozcs    : 1
mar     : 0xffffffff
mor     : 0xffffffff
rrl     : 0
frl     : 0
lbafe  0: zsze:0x100000 zdes:0 (in use)
```

Find more detailed information with the '-H' (human readable) option:

```plaintext
# nvme zns id-ns /dev/nvme1n1  -H
ZNS Command Set Identify Namespace:
zoc     : 0   Zone Operation Characteristics
  [1:1] : 0     Zone Active Excursions: No
  [0:0] : 0     Variable Zone Capacity: No

ozcs    : 1   Optional Zoned Command Support
  [2:2] : 0x1   Read Across Zone Boundaries: Yes

mar     : 0xffffffff
mor     : 0xffffffff
rrl     : Not Reported
frl     : Not Reported
LBA Format Extension  0 : Zone Size: 0x100000 LBAs - Zone Descriptor Extension Size: 0 bytes (in use)
```

If you want to process the output with another script, you can request a more
computer-friendly json format by using the '-o json' option:

```plaintext
# nvme zns id-ns /dev/nvme1n1  -o json
{
  "zoc" : 0,
  "ozcs" : 1,
  "mar" : 4294967295,
  "mor" : 4294967295,
  "rrl" : 0,
  "frl" : 0,
  "lbafe" : [
    {
      "zsze" : 1048576,
      "zdes" : 0
    }
  ]
}
```

### Reporting Zones

The 'report-zones' command provides information on individual zones, including
their current zone state and write pointer. The following example retreives the
first 10 zone descriptors:

```plaintext
# nvme zns report-zones /dev/nvme1n1 -d 10
nr_zones: 373
SLBA: 0x0        WP: 0x2000     Cap: 0x100000   State: IMP_OPENED   Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x100000   WP: 0x100000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x200000   WP: 0xffffffffffffffff Cap: 0x100000   State: FULL         Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x300000   WP: 0xffffffffffffffff Cap: 0x100000   State: FULL         Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x400000   WP: 0xffffffffffffffff Cap: 0x100000   State: FULL         Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x500000   WP: 0xffffffffffffffff Cap: 0x100000   State: FULL         Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x600000   WP: 0xffffffffffffffff Cap: 0x100000   State: FULL         Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x700000   WP: 0xffffffffffffffff Cap: 0x100000   State: FULL         Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x800000   WP: 0x8c1000   Cap: 0x100000   State: IMP_OPENED   Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x900000   WP: 0x900000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
```

### Resetting a Zone

To reset the write pointer and return a zone to the EMPTY state, use the
'zone-reset' command. The following example resets all zones (the '-a'
option means "all zones") (WARNING: this effectively deletes the zone's data).

```plaintext
# nvme zns reset-zone /dev/nvme1n1 -a
zns-reset-zone: Success, action:4 zone:0 nsid:1
```

'report-zones' now shows that all the zones have been reset to the empty state:

```plaintext
# nvme zns report-zones /dev/nvme1n1 -d 10
nr_zones: 373
SLBA: 0x0        WP: 0x0        Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x100000   WP: 0x100000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x200000   WP: 0x200000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x300000   WP: 0x300000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x400000   WP: 0x400000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x500000   WP: 0x500000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x600000   WP: 0x600000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x700000   WP: 0x700000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x800000   WP: 0x800000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x900000   WP: 0x900000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
```

### Opening a Zone

Explicitly opening a zone makes it ready for immediate write access and
consumes an Open Resource. Run this command to open the first zone:

```plaintext
# nvme zns open-zone /dev/nvme1n1
zns-open-zone: Success, action:3 zone:0 nsid:1
```

Verify its current state:

```plaintext
# nvme zns report-zones /dev/nvme1n1 -d 2
nr_zones: 373
SLBA: 0x0        WP: 0x0        Cap: 0x100000   State: EXP_OPENED   Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x100000   WP: 0x100000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
```

### Closing a Zone

Closing the zone releases the open resource and can be done on both explicitly
open zones and implicitly open zones. Run this command to close the first zone:

```plaintext
# nvme zns close-zone /dev/nvme1n1
zns-close-zone: Success, action:1 zone:0 nsid:1
```

Verify its current state:

```plaintext
# nvme zns report-zones /dev/nvme1n1 -d 2
nr_zones: 373
SLBA: 0x0        WP: 0x0        Cap: 0x100000   State: CLOSED       Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x100000   WP: 0x100000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
```

### Finishing a Zone

Finishing a zone sets its state to 'full'. Run this command to finish the first
zone:

```plaintext
# nvme zns finish-zone /dev/nvme1n1
zns-finish-zone: Success, action:2 zone:0 nsid:1
```

Verify its current state:

```plaintext
# nvme zns report-zones /dev/nvme1n1 -d 2
nr_zones: 373
SLBA: 0x0        WP: 0xffffffffffffffff Cap: 0x100000   State: FULL         Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x100000   WP: 0x100000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
```

### Offlining a Zone

Offlining a zone makes the zone inaccessible. The data on the offlined zone
will no longer be accessible, and writes to the zone will not be possible until
the zone is reset. Run this command to offline the first zone:

```plaintext
# nvme zns offline-zone /dev/nvme1n1
zns-offline-zone: Success, action:5 zone:0 nsid:1
```

Verify its current state:

```plaintext
# nvme zns report-zones /dev/nvme1n1 -d 2
nr_zones: 373
SLBA: 0x0        WP: 0          Cap: 0x100000   State: OFFLINE      Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x100000   WP: 0x100000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
```

### Zone Append

You can append data to specific zones. In this method, you specify only which zone to append data to. The device returns the LBA where it stored the data. Below are some examples:

Append "hello world" to the first zone block (512 bytes in this example):

```plaintext
# echo "hello world" | nvme zns zone-append /dev/nvme1n1 -z 512
Success appended data to LBA 0
```

Read the data back from LBA 0 to verify that it saved our data:

```plaintext
# nvme read /dev/nvme1n1 -z 512
hello world
read: Success
```

Append more data and verify its contents:

```plaintext
# echo "goodbye world" | nvme zns zone-append /dev/nvme1n1 -z 512
Success appended data to LBA 1

# nvme read /dev/nvme1n1 -z 512 -s 1
goodbye world
read: Success
```

Because two blocks have been appended to zone 0, we can check the current
"report-zones" output to verify the current write pointer: 

```plaintext
# nvme zns report-zones /dev/nvme1n1 -d 2
nr_zones: 373
SLBA: 0x0        WP: 0x2        Cap: 0x100000   State: IMP_OPENED   Type: SEQWRITE_REQ   Attrs: 0x0
SLBA: 0x100000   WP: 0x100000   Cap: 0x100000   State: EMPTY        Type: SEQWRITE_REQ   Attrs: 0x0
```
