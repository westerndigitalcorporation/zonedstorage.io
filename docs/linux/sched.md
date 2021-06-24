# Write Ordering Control For Zoned Block Devices

Historically, Linux&reg; kernel block I/O stack (block layer and SCSI layer)
has never provided guarantees regarding the exact execution order of block I/O
requests. The main reasons for this are the asynchronous nature of block I/O
request execution in the kernel and a fine granularity lock model for a device
request queue to minimize lock contention overhead when multiple contexts are
issuing I/O requests to a block device.

A direct result of this design is the inability to give guarantees to a well
behaving ZBD compliant application that write commands for a zone will be
delivered in increasing LBA order matching the zone sequential write constraint.

To address this problem, the kernel ZBD support adds *zone write locking* to
ensure that write requests are processed in order per zone.

## Zone Write Locking

As its name indicates, zone write locking implements a per-zone write lock to
serialize the execution of write request targeting the same zone. Considering a
target zone, this feature does not guarantee that write commands will always be
issued at the zone write pointer location. This is the responsibility of the
write I/O issuer. Zone write locking will only guarantee that the order in which
write commands are issued by an application, file system or device mapper target
will be respected by the block I/O stack. A well behaved user of zoned block
devices will thus avoid unaligned write command failures.

Zone write locking does not affect read commands in any way. Read requests are
not serialized and processed in exactly the same manner as with regular block
devices.

### Initial Implementation

The initial implementation of zone write locking in kernel 4.10 was done in the
SCSI disk driver, below the block layer, operating on requests already passed to
the device dispatch queue by the block I/O scheduler.

This early implementation was relying on the fact that the SCSI layer may delay
issuing any request to the device. By maintaining a bitmap with one bit per
zone, the SCSI disk driver marked a zone as *locked* whenever a write command
was seen. In more details, the algorithm is as follows.

1. If the next command to dispatch to the device is not a write command, the
   command is dispatched immediately.

2. If the next command to dispatch is a write command, the zone write lock bit
   for the target zone of the command is inspected.

    1. If the target zone of the write command is not write locked (bit not
       set), then the zone is locked and the write command issued to the device.
       Both operations are atomically executed under the device request queue
       spinlock.

    2. If the target zone is already locked (bit set), the SCSI disk driver
       temporarily delays the command issuing to the device until the zone write
       lock is released.

3. When a write command completes, the zone write lock for the target zone of
   the command is released and the dispatch process resumed. This means that if
   the command at the head of the dispatch queue is targeting the same zone,
   this command can now be issued (step 2.a).

!!! Note
    Zone write locking implemented as shown above also prevents unintended
    command reordering by the SAS HBAs or SATA adapters. The *AHCI*
    specifications are unclear regarding the definition of command issuing order
    to a device and as a result, many chipsets suffer from an inability to
    guarantee the proper command ordering.

While providing write ordering guarantees for the legacy single queue block
I/O path without any dependence on the HBA being used, this implementation
suffered from several limitations.

* **Potential performance degradation** Any write command to any zone result in
  the command dispatch processing to be stalled, preventing the dispatching of
  all other commands, including read commands. This can limit performance
  benefits that can be obtained with device level command reordering when
  operating the device at high queue depth. The extreme case is an application
  issuing a write stream to a zone with asynchronous I/O system calls (e.g.
  `io_submit()`). In this case, the sequential write commands would be queued in
  sequence in the device dispatch queue, resulting in the drive being operated
  at a queue depth of one, one write command at a time.

* **No support for the block multi-queue I/O path** Unlike the legacy single
  queue block I/O interface, the multi-queue block I/O implementation does not
  heavily rely on the device queue spin-lock for processing block I/O requests
  issued by the disk users (applications or kernel components). This results in
  potential block I/O request reordering happening before requests are passed on
  to the device dispatch queue and the ineffectiveness of zone write locking.

These limitations led to a new implementation of zone write locking at a higher
level in the I/O stack, using the block layer I/O schedulers.

### Improved Implementation: Block I/O Scheduler

By moving zone write locking implementation higher up in the I/O stack, the
block multi-queue (and SCSI multi-queue) infrastructure can also be supported.
This improvement was added with kernel version 4.16 and the SCSI layer
implementation of zone write locking removed.

This new implementation of zone write locking relies on the block layer I/O
*deadline* and *mq-deadline* I/O scheduler and addresses also the performance
limitations of the previous implementation. In details, the new algorithm is as
follows.

!!! Note
    The *deadline* and *mq-deadline* schedulers operate by grouping commands per
    type (reads vs writes) and always process these two groups of commands
    separately, e.g. first issuing many reads, then many writes. This allows for
    an increased performance by benefiting from hardware features such as device
    level read-ahead.

1. If the scheduler is processing read commands...

    1. ...the first command queued in the list of read commands is allowed to
       proceed and submitted to the device dispatch queue.
    2. When no read commands are available, activate write processing (step 2).
    3. If read command processing time limit is reached, write command
       processing (step 2) is activated to avoid write command starvation.
    4. If read commands are still available, restart at step 1.

2. When processing write commands, the list of write commands queued in the
   scheduler is scanned in order, starting with the command at the head of the
   LBA ordered list, or the first command in the arrival time ordered list (when
   there is a risk of starving commands).

    1. If the target zone of the first write command is not write locked (zone
       bitmap bit not set), then the zone is locked and the write command issued
       to the device. Both operations are atomically executed under a spinlock
       maintained by the scheduler.
    2. If the target zone is already locked (bit set), the command is skipped
       and the first write command targetting a different zone is searched for
       in the queue write command. If a command is found, step 2 is executed
       again.
    3. If all queued write commands are targeting locked zones, the scheduler
       operation mode (batch mode) is switched to *read* and step 1 called.

3. When a write command completes, the zone write lock for the target zone of
   the command is released and the scheduler is activated, resuming operation
   at step 1 or 2 depending on the current batch mode.

From this algorithm, it is clear that the device can now be operated at higher
queue depth and that only sequential writes targeting the same zone will be
throttled. All read commands can proceed, always, and write commands targeting
different zones are not impacting each other.

!!! Note
    This new implementation does not guarantee overall command ordering.
    Guarantees are given only for write commands targetting the same zone. The
    dispatch order of write commands targetting different zones may be changed
    by the scheduler. For any single sequential zone, at any time, there is
    always at most a single write command in-flight being executed. Overall disk
    operation at high queue depth is possible in the presence of read accesses
    and if multiple zones are being written simultaneously.

## Block I/O Scheduler Configuration

The *deadline* and *mq-deadline* schedulers need to be enabled in the kernel
compilation configuration. Refer to the
[Write Ordering Control](config.md#write-ordering-control) section for details.

!!! Note
    The legacy single queue block I/O path was removed from the kernel with
    version 5.0. Starting with the version, the *deadline* scheduler cannot be
    enabled. The *mq-deadline* scheduler is the only ZBD compliant scheduler.

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

*deadline* is also an alias name for the *mq-deadline* scheduler. The
following command can thus be used with equal results in environements using
the legacy single queue I/O path (kernels 4.16 to 4.20) as well as using the
block multi-queue infrastructure (sole possibility starting with kernel
version 5.0.

```plaintext
# echo deadline > /sys/block/sdb/queue/scheduler
# cat sys/block/sdb/queue/scheduler
[mq-deadline] kyber bfq none
```

### Automatic Persistent Configuration

Automatically configuring the *deadline* scheduler at system boot time can also
be done using a *udev* rule. The procedure to follow to define a new *udev*
rule slightly varies between distributions. Refer to your distribution
documentation for details.

``` plaintext
ACTION=="add|change", KERNEL=="sd*[!0-9]", ATTRS{queue/zoned}=="host-managed", ATTR{queue/scheduler}="deadline"
```

This rule will setup the *deadline* scheduler for any host-managed zoned block
device found in the system. Host aware zoned block disk can accept random
writes and thus tolerate occasional write reordering within a zone sequential
write stream. Nevertheless, write ordering can be maintained for these disks too
by using the *deadline* scheduler. The above *udev* rule modified will
automatically enable this.

``` plaintext
ACTION=="add|change", KERNEL=="sd*[!0-9]", ATTRS{queue/zoned}=="host-aware", ATTR{queue/scheduler}="deadline"
```

The following single rule will enable the *deadline* scheduler for any zoned
block device, regardless of the device zone model.

```plaintext
ACTION=="add|change", KERNEL=="sd*[!0-9]", ATTRS{queue/zoned}!="none", ATTR{queue/scheduler}="deadline"
```

