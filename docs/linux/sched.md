---
id: sched
title: Write Ordering Control
sidebar_label: Write Ordering Control
---

# Write Ordering Control

Historically, the Linux&reg; kernel block I/O stack (i.e., the block layer and
the SCSI layer) has never guaranteed the exact execution order of block I/O
requests. The exact execution order of block I/O requests cannot be guaranteed
due to the asynchronous nature of the execution in the kernel of block I/O
requests and the necessity of a fine-granularity lock model for the device
request queue (to minimize lock-contention overhead when multiple contexts 
issue I/O requests to a block device at the same time).

A direct result of this design is the inability to give guarantees to a well-
behaving ZBD-compliant application that write commands for a zone will be
delivered in increasing LBA order (matching the zone sequential write
constraint).

To address this problem, the kernel ZBD support adds *zone write locking* to
ensure that write requests are processed in order per zone.

## Zone Write Locking

Zone write locking implements a per-zone write lock to serialize the execution
of write requests that target the same zone. This feature does not guarantee
that write commands are always issued at the location of the zone write
pointer: this is the responsibility of the write I/O issuer. Zone write
locking guarantees only that the order in which write commands are issued
by an application, file system, or device mapper target will be respected by
the block I/O stack. A well-behaved user of zoned block devices will thus
avoid unaligned write command failures.

Zone write locking does not affect read commands in any way. Read requests are
not serialized and processed in exactly the same manner as with regular block
devices.

### Initial Implementation

Zone write locking was first implemented in kernel 4.10 in the SCSI disk
driver (below the block layer), operating on requests already passed to the
device dispatch queue by the block I/O scheduler.

This early implementation relied on the fact that the SCSI layer could delay
issuing any request to the device. By maintaining a bitmap with one bit per
zone, the SCSI disk driver marked a zone as *locked* whenever it saw a write
command. This algorithm is presented here in more detail:

1.  If the next command to be dispatched to the device is not a write command,
    then the command is dispatched immediately.

2.  If the next command to by dispatched is a write command, then the zone
    write lock bit for the target zone of the command is inspected.

    <ol type="a">
    <li>
	If the target zone of the write command is not write locked (i.e., the
	bit is not set), then the zone is locked and the write command issued
	to the device.  Both operations are atomically executed under the
	device request queue spinlock.
    </li>
    <li>
	If the target zone is already locked (i.e., the bit is set), then the
	SCSI disk driver temporarily delays issuing the command to the device
	until the zone write lock is released.
    </li>
    <li>
	When a write command completes, the zone write lock for the target zone
	of the command is released and the dispatch process is resumed. This
	means that if the command at the head of the dispatch queue targets the
	same zone, then the command can be issued (when the write command
	completes) (step 2.a).
    </li>
    </ol>

:::note
Zone write locking that is implemented as shown above also prevents the
unintended reordering of commands by the SAS HBAs or SATA adapters. The *AHCI*
specifications do not define a clear order for issuing commands to devices. As a
result, many chipsets are unable to guarantee the proper order of commands.
:::

Although this implementation provides write-ordering guarantees for the legacy
single-queue block I/O path and is not dependent upon any particular HBA, it
has several limitations:

* **Potential performance degradation** Any write command to any zone results
  in the command dispatch processing being stalled. This prevents all other
  command from being dispatched, including read commands. This can limit
  performance benefits that can be obtained with device-level command
  reordering when operating the device at high queue depth. The extreme case is
  an application issuing a write stream to a zone with asynchronous I/O system
  calls (e.g. `io_submit()`). In this case, the sequential write commands
  would be queued in sequence in the device dispatch queue, resulting in the
  drive being operated at a queue depth of one, one write command at a time.

* **No support for the block multi-queue I/O path** Unlike the legacy single
  queue block I/O interface, the multi-queue block I/O implementation does not
  heavily rely on the device queue spin-lock to process block I/O requests
  issued by the disk users (applications or kernel components). This results in
  potential block I/O request reordering happening before requests are passed
  on to the device dispatch queue and the ineffectiveness of zone write
  locking.

These limitations led to the development of a new implementation of zone write
locking at a higher level in the I/O stack, using the block layer I/O
schedulers.

### Improved Implementation: Block I/O Scheduler

By moving zone write locking implementation higher up in the I/O stack, the
block multi-queue (and SCSI multi-queue) infrastructure can also be supported.
This improvement was added with kernel version 4.16 and the SCSI layer
implementation of zone write locking was removed.

This new implementation of zone write locking relies on the block layer
*deadline* and *mq-deadline* I/O schedulers and also addresses the performance
limitations of the previous implementation. In detail, the new algorithm is as
follows.

:::note
The *deadline* and *mq-deadline* schedulers operate by grouping commands per
type (reads vs writes) and always processsing these two groups of commands
separately, e.g. first issuing many reads, then many writes. This improves
performance by taking advantage of hardware features such as device-level
read-ahead.
:::

1.  If the scheduler is processing read commands...

    <ol type="a">
    <li>
	...the first command queued in the list of read commands is allowed to
        proceed and is submitted to the device dispatch queue.
    </li>
    <li>
	If no read commands are available, activate write processing (step 2).
    </li>
    <li>
	If the read-command processing time limit is reached, write-command
	processing (step 2) is activated to avoid write-command starvation.
    </li>
    <li>
	If read commands are still available, restart at step 1.
    </li>
    </ol>

2.  When processing write commands, the list of write commands queued in the
    scheduler is scanned in order starting with the command at the head of the
    LBA ordered list or the first command in the arrival-time ordered list (when
    there is a risk of starving commands).

    <ol type="a">
    <li>
	If the target zone of the first write command is not write locked (zone
	bitmap bit not set), then the zone is locked and the write command is
	issued to the device. Both operations are atomically executed under a
	spinlock maintained by the scheduler.
    </li>
    <li>
	If the target zone is already locked (bit set), the command is skipped
	and the first write command that targets a different zone is searched
	for in the LBA ordered list of write commands. If such a command is
	found, step 2 is executed again.
    </li>
    <li>
	If all queued write commands target locked zones, the scheduler
	operation mode (batch mode) is switched to *read* and step 1 is called.
    </li>
    </ol>

3.  When a write command completes, the zone write lock for the target zone of
    the command is released and the scheduler is activated. Operation is 
    resumed at step 1 or 2 depending on the current batch mode.

From this algorithm, it is clear that the device can now be operated at higher
queue depth and that only sequential writes that target the same zone will be
throttled. All read commands can proceed, always, and write commands that
target different zones do not impact each other.

:::note
This new implementation does not guarantee overall command ordering.  Guarantees
are given only for write commands that target the same zone.  The dispatch order
of write commands that target different zones may be changed by the scheduler.
For any single sequential zone, at any time, there is always at most a single
write command in-flight being executed. Overall disk operation at high queue
depth is possible when there are read accesses and if multiple zones are being
written simultaneously.
:::

## Block I/O Scheduler Configuration

The *deadline* and *mq-deadline* schedulers must be enabled in the kernel
compilation configuration. Refer to the
[Write Ordering Control](/docs/linux/config#write-ordering-control) section for
details.

:::note
The legacy single queue block I/O path was removed from the kernel in version
5.0. As of kernel version 5.0, the *deadline* scheduler cannot be enabled. The
*mq-deadline* scheduler is the only ZBD compliant scheduler.
:::

### Manual Configuration

A system may define a default I/O scheduler other than *deadline* or
*mq-deadline*. The block I/O scheduler for a zoned block device can be checked
with the following command.

```plaintext
# cat /sys/block/sdb/queue/scheduler
[none] mq-deadline kyber bfq
```

If the block I/O scheduler selected is not *deadline* nor *mq-deadline* as in
the example above, the scheduler can be changed with the following command.

```plaintext
# echo mq-deadline > /sys/block/sdb/queue/scheduler
# cat sys/block/sdb/queue/scheduler
[mq-deadline] kyber bfq none
```

*deadline* is an alias for the *mq-deadline* scheduler. The following command
can therefore be used to get the same results in environments that use the
legacy single queue I/O path (kernels 4.16 to 4.20) and environments that use
the block multi-queue infrastructure (the sole possibility as of kernel
version 5.0).

```plaintext
# echo deadline > /sys/block/sdb/queue/scheduler
# cat sys/block/sdb/queue/scheduler
[mq-deadline] kyber bfq none
```

### Automatic Persistent Configuration

Automatically configuring the *deadline* scheduler at system boot time can
also be done using a *udev* rule. The procedure for defining a new *udev* rule
varies slightly between distributions. Refer to your distribution
documentation for details.

``` plaintext
ACTION=="add|change", KERNEL=="sd*[!0-9]", ATTRS{queue/zoned}=="host-managed", ATTR{queue/scheduler}="deadline"
```

This rule sets up the *deadline* scheduler for any host-managed zoned block
device found in the system. A host-aware zoned block disk can accept random
writes and thus tolerate occasional write reordering within a zone sequential
write stream. Nevertheless, write ordering can be maintained for these disks too
by using the *deadline* scheduler. The above *udev* rule modified will
automatically enable this.

``` plaintext
ACTION=="add|change", KERNEL=="sd*[!0-9]", ATTRS{queue/zoned}=="host-aware", ATTR{queue/scheduler}="deadline"
```

The following single rule enables the *deadline* scheduler for any zoned
block device, regardless of the device zone model.

```plaintext
ACTION=="add|change", KERNEL=="sd*[!0-9]", ATTRS{queue/zoned}!="none", ATTR{queue/scheduler}="deadline"
```

