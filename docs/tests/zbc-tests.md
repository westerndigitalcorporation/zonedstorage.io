# ZBC/ZAC Compliance Tests

Developers may face many problems with an application development if the system
being used has non-compliant components, either software or hardware.

The typical problems that can be faced may be due to a SAS HBA not fully
compatible with the ZBC and ZAC standards (e.g. The HBA has a defective
translation layer implementation) or the kernel version includes a bug resulting
for instance in write commands not being translated correctly or an invalid
command failure processing.

Many of these problems can be identified early by executing
[*libzbc*](../projects/libzbc.md) conformance test suite.

## *libzbc* Conformance Test Suite

*libzbc* implements a test suite primarily aiming at checking that a disk
fully conforms to the definition and constraints of the ZAC and ZBC standards.
*libzbc* test suite works equally well with physical disks (SAS and SATA) as
well as emulated disks created with [*tcmu-runner*](../projects/tcmu-runner.md).

Information on how to compile and install *libzbc* with the test suite
enabled can be found [here](../projects/libzbc.md).

In this chapter, the following disk configuration is used throughout the
examples shown.

```plaintext
# lsscsi -g
[2:0:0:0]    disk    ATA      INTEL SSDSC2CT18 335u  /dev/sda   /dev/sg0
[5:0:0:0]    zbc     ATA      HGST HSH721415AL T220  /dev/sdb   /dev/sg1
[10:0:2:0]   zbc     HGST     HSH721414AL52M0  a220  /dev/sdc   /dev/sg2
[10:0:3:0]   zbc     ATA      HGST HSH721415AL T220  /dev/sdd   /dev/sg3
```

*/dev/sdb* is a SATA disk connected to an AHCI controller (SATA port),
*/dev/sdc* is a SAS disk connected to a SAS HBA and */dev/sdc* is a SATA disk
connected to the same SAS HBA.

## Checking Serial ATA Disks

To check a SATA ZAC disk correct operation and conformance to the ZAC standard,
*libzbc* test suite must be executed using the "--ata" option.

!!!note
    *libzbc* test suite must be executed against the disk SCSI generic node file
    (e.g. */dev/sg* path) to enable the full range of direct SCSI or ATA command
    execution without any interference from the kernel block I/O stack. *libzbc*
    test suite will not run if the disk block device file (*/dev/sd*) is
    specified.

Using the AHCI connected SATA disk */dev/sdb*, which corresponds to the SCSI
generic node file */dev/sg1*, the execution of the 107 test cases of *libzbc*
test suite result in the following output.

```plaintext
# cd libzbc/test
# ./zbc_test.sh --ata /dev/sg1
Executing section 00 - command completion tests...
    00.010: REPORT_ZONES command completion...                                            [Passed]
    00.011: REPORT_ZONES (partial bit) command completion...                              [Passed]
    00.012: REPORT_ZONES (reporting option 0x10) command completion...                    [Passed]
    00.013: REPORT_ZONES (reporting option 0x11) command completion...                    [Passed]
    00.014: REPORT_ZONES (reporting option 0x3F) command completion...                    [Passed]
    00.020: OPEN_ZONE command completion...                                               [Passed]
    00.030: CLOSE_ZONE command completion...                                              [Passed]
    00.040: FINISH_ZONE command completion...                                             [Passed]
    00.050: RESET_WRITE_PTR command completion...                                         [Passed]
    00.060: WRITE command completion...                                                   [Passed]
    00.070: READ command completion...                                                    [Passed]
Executing section 01 - sense key, sense code tests...
    01.010: REPORT_ZONES logical block out of range...                                    [Passed]
    01.011: REPORT_ZONES invalid reporting option...                                      [Passed]
    01.020: OPEN_ZONE invalid zone start lba...                                           [Passed]
    01.021: OPEN_ZONE insufficient zone resources...                                      [Passed]
    01.022: OPEN_ZONE insufficient zone resources (ALL bit set)...                        [Passed]
    01.023: OPEN_ZONE conventional zone...                                                [Passed]
    01.024: OPEN zone LBA at End of Medium...                                             [Passed]
    01.030: CLOSE_ZONE invalid zone start lba...                                          [Passed]
    01.031: CLOSE_ZONE conventional zone...                                               [Passed]
    01.032: CLOSE zone LBA at End of Medium...                                            [Passed]
    01.040: FINISH_ZONE invalid zone start lba...                                         [Passed]
    01.041: FINISH_ZONE conventional zone...                                              [Passed]
    01.042: FINISH zone LBA at End of Medium...                                           [Passed]
    01.050: RESET_WRITE_PTR invalid zone start lba...                                     [Passed]
    01.051: RESET_WRITE_PTR conventional zone...                                          [Passed]
    01.052: RESET zone LBA at End of Medium...                                            [Passed]
    01.060: READ access sequential zone LBAs after write pointer...                       [Passed]
    01.061: READ sequential zones boundary violation...                                   [Passed]
    01.062: READ conventional/sequential zones boundary violation...                      [Passed]
    01.063: READ across write-pointer zones (FULL->FULL)...                               [Passed]
    01.064: READ access write pointer zone LBAs starting after write pointer...           [Passed]
    01.070: WRITE unaligned write in sequential zone...                                   [Passed]
    01.071: WRITE sequential zone boundary violation...                                   [Passed]
    01.072: WRITE insufficient zone resources...                                          [Passed]
    01.073: WRITE full zone...                                                            [Passed]
    01.074: WRITE physical sector unaligned write to sequential zone...                   [Passed]
    01.075: WRITE unaligned ending below write pointer...                                 [Passed]
    01.076: WRITE unaligned crossing write pointer...                                     [Passed]
    01.077: WRITE across zone-type spaces (cross-type boundary violation)...              [Passed]
    01.080: READ cross-zone FULL->IOPENL and ending above Write Pointer...                [Passed]
    01.081: READ cross-zone FULL->IOPENL and ending below Write Pointer...                [Passed]
    01.082: READ cross-zone IOPENH->FULL starting below Write Pointer...                  [Passed]
    01.083: READ cross-zone IOPENL->FULL starting above Write Pointer...                  [Passed]
    01.090: WRITE cross-zone FULL->IOPENL and ending above Write Pointer...               [Passed]
    01.091: WRITE cross-zone FULL->IOPENL and ending below Write Pointer...               [Passed]
    01.092: WRITE cross-zone IOPENH->FULL starting below Write Pointer...                 [Passed]
    01.093: WRITE cross-zone IOPENL->FULL starting above Write Pointer...                 [Passed]
    01.094: WRITE cross-zone FULL->EMPTY...                                               [Passed]
    01.095: WRITE cross-zone EMPTY->EMPTY starting above Write Pointer...                 [Passed]
Executing section 02 - zone state machine tests...
    02.001: OPEN_ZONE empty to explicit open...                                           [Passed]
    02.002: CLOSE_ZONE empty to empty...                                                  [Passed]
    02.003: FINISH_ZONE empty to full...                                                  [Passed]
    02.004: RESET_WRITE_PTR empty to empty...                                             [Passed]
    02.005: OPEN_ZONE implicit open to explicit open...                                   [Passed]
    02.006: CLOSE_ZONE implicit open to closed...                                         [Passed]
    02.007: FINISH_ZONE implicit open to full...                                          [Passed]
    02.008: RESET_WRITE_PTR implicit open to empty...                                     [Passed]
    02.009: OPEN_ZONE empty to explicit open to explicit open...                          [Passed]
    02.010: CLOSE_ZONE empty to explicit open to empty...                                 [Passed]
    02.011: FINISH_ZONE empty to explicit open to full...                                 [Passed]
    02.012: RESET_WRITE_PTR empty to explicit open to empty...                            [Passed]
    02.013: OPEN_ZONE implicit open to explicit open to explicit open...                  [Passed]
    02.014: CLOSE_ZONE implicit open to explicit open to closed...                        [Passed]
    02.015: FINISH_ZONE implicit open to explicit open to full...                         [Passed]
    02.016: RESET_WRITE_PTR implicit open to explicit open to empty...                    [Passed]
    02.017: OPEN_ZONE closed to explicit open...                                          [Passed]
    02.018: CLOSE_ZONE closed to closed...                                                [Passed]
    02.019: FINISH_ZONE closed to full...                                                 [Passed]
    02.020: RESET_WRITE_PTR closed to empty...                                            [Passed]
    02.021: OPEN_ZONE full to full...                                                     [Passed]
    02.022: CLOSE_ZONE full to full...                                                    [Passed]
    02.023: FINISH_ZONE full to full...                                                   [Passed]
    02.024: RESET_WRITE_PTR full to empty...                                              [Passed]
    02.025: OPEN_ZONE empty to empty (ALL bit set)...                                     [Passed]
    02.026: CLOSE_ZONE empty to empty (ALL bit set)...                                    [Passed]
    02.027: FINISH_ZONE empty to empty (ALL bit set)...                                   [Passed]
    02.028: RESET_WRITE_PTR empty to empty (ALL bit set)...                               [Passed]
    02.029: OPEN_ZONE implicit open to implicit open (ALL bit set)...                     [Passed]
    02.030: CLOSE_ZONE implicit open to close (ALL bit set)...                            [Passed]
    02.031: FINISH_ZONE implicit open to full (ALL bit set)...                            [Passed]
    02.032: RESET_WRITE_PTR implicit open to empty (ALL bit set)...                       [Passed]
    02.033: OPEN_ZONE empty to explicit open to explicit open (ALL bit set)...            [Passed]
    02.034: CLOSE_ZONE empty to explicit open to empty (ALL bit set)...                   [Passed]
    02.035: FINISH_ZONE empty to explicit open to full (ALL bit set)...                   [Passed]
    02.036: RESET_WRITE_PTR empty to explicit open to empty (ALL bit set)...              [Passed]
    02.037: OPEN_ZONE implicit open to explicit open to explicit_open (ALL bit set)...    [Passed]
    02.038: CLOSE_ZONE implicit open to explicit open to closed (ALL bit set)...          [Passed]
    02.039: FINISH_ZONE implicit open to explicit open to full (ALL bit set)...           [Passed]
    02.040: RESET_WRITE_PTR implicit open to explicit open to empty (ALL bit set)...      [Passed]
    02.041: OPEN_ZONE closed to explicit open (ALL bit set)...                            [Passed]
    02.042: CLOSE_ZONE closed to closed (ALL bit set)...                                  [Passed]
    02.043: FINISH_ZONE closed to full (ALL bit set)...                                   [Passed]
    02.044: RESET_WRITE_PTR closed to empty test (ALL bit set)...                         [Passed]
    02.045: OPEN_ZONE full to full (ALL bit set)...                                       [Passed]
    02.046: CLOSE_ZONE full to full (ALL bit set)...                                      [Passed]
    02.047: FINISH_ZONE full to full (ALL bit set)...                                     [Passed]
    02.048: RESET_WRITE_PTR full to empty (ALL bit set)...                                [Passed]
    02.070: WRITE empty to implicit open...                                               [Passed]
    02.071: WRITE empty to full...                                                        [Passed]
    02.072: WRITE implicit open to implicit open...                                       [Passed]
    02.073: WRITE implicit open to full...                                                [Passed]
    02.074: WRITE closed to implicit open...                                              [Passed]
    02.075: WRITE closed to full...                                                       [Passed]
    02.076: WRITE explicit open to explicit open...                                       [Passed]
    02.077: WRITE explicit open to full...                                                [Passed]
    02.078: WRITE full to full...                                                         [Passed]
```

The same execution procedure can be applied to the SATA disk */dev/sdd*
connected to the SAS HBA. This disk has the SCSI generic node file */dev/sg3*.

```plaintext
# cd libzbc/test
# ./zbc_test.sh --ata /dev/sg3
Executing section 00 - command completion tests...
    00.010: REPORT_ZONES command completion...                            [Passed]
    00.011: REPORT_ZONES (partial bit) command completion...              [Passed]
    00.012: REPORT_ZONES (reporting option 0x10) command completion...    [Passed]
[...]
    00.070: READ command completion...                                    [Passed]
Executing section 01 - sense key, sense code tests...
    01.010: REPORT_ZONES logical block out of range...                    [Passed]
[...]
    01.095: WRITE cross-zone EMPTY->EMPTY starting above Write Pointer... [Passed]
Executing section 02 - zone state machine tests...
    02.001: OPEN_ZONE empty to explicit open...                           [Passed]
[...]
    02.077: WRITE explicit open to full...                                [Passed]
    02.078: WRITE full to full...                                         [Passed]
```

If a test case fails, an error message similar to the example below is shown
and the test suite stops execution.

```plaintext
# cd libzbc/test
# ./zbc_test.sh --ata XXX
Executing section 00 - command completion tests...
    00.010: REPORT_ZONES command completion...                            [Passed]
    00.011: REPORT_ZONES (partial bit) command completion...              [Passed]
[...]
    01.095: WRITE cross-zone EMPTY->EMPTY starting above Write Pointer... [Passed]
Executing section 02 - zone state machine tests...
[...]
    02.078: WRITE full to full...                                         [Failed]
    => Expected Illegal-request / Invalid-field-in-cdb
       Got Illegal-request / Unaligned-write-command
#
```

A test case failure is a strong indicator that the disk may not be fully
compliant with the ZAC specifications. Most failures can generally be confirmed
using a bus analyzer to obtain a command trace for the failing test sequence.
Other root cause for any test failure are always a possibility.

## Checking SAS Disks

Testing physical SAS disks as well as *tcmu-runner* emulated SCSI disks do not
require the *--ata* option. Using the SAS disk */dev/sg2*, the test suite output
is the same as with SATA disks if all tests pass.

```plaintext
# cd libzbc/test
# ./zbc_test.sh /dev/sg2
Executing section 00 - command completion tests...
    00.010: REPORT_ZONES command completion...                         [Passed]
    00.011: REPORT_ZONES (partial bit) command completion...           [Passed]
    00.012: REPORT_ZONES (reporting option 0x10) command completion... [Passed]
    00.013: REPORT_ZONES (reporting option 0x11) command completion... [Passed]
    00.014: REPORT_ZONES (reporting option 0x3F) command completion... [Passed]
    00.020: OPEN_ZONE command completion...                            [Passed]
[...]
    02.077: WRITE explicit open to full...                             [Passed]
    02.078: WRITE full to full...                                      [Passed]
```

## Checking the Kernel SCSI-To-ATA Translation Layer

When *libzbc* test suite is executed with the "--ata" option, ATA commands are
sent directly to the disk using the SCSI generic driver passthrough facility.
These ATA commands are directly embedded into the ATA16 SCSI passthrough
command, allowing to completely bypass the kernel SCSI to ATA translation layer
implemented by the kernel *libata* component.

Executing *libzbc* test suite against a SATA disk connected to a SATA port (e.g.
An AHCI adapter port) will result in the test suite issuing only SCSI commands
that will be translated by the kernel *libata* before sending as ATA commands to
the disk. That is, the kernel SAT can be exercised.

```plaintext
# cd libzbc/test
# ./zbc_test.sh /dev/sg1
Executing section 00 - command completion tests...
    00.010: REPORT_ZONES command completion...                         [Passed]
    00.011: REPORT_ZONES (partial bit) command completion...           [Passed]
    00.012: REPORT_ZONES (reporting option 0x10) command completion... [Passed]
[...]
    02.077: WRITE explicit open to full...                             [Passed]
    02.078: WRITE full to full...                                      [Passed]
```

If all tests pass, then the kernel SAT layer can be considered as correct. On
the other hand, if some tests fails while all tests pass with the *--ata* option
used, then the kernel SAT implementation becomes a candidate as the root cause
for the failure. This analysis is summarized in the table below.

<center>
![sata-on-ahci](../assets/img/tests-zbc-kernel.png "Probable failure root cause with SATA disks on AHCI ports")
<br>*Probable failure root cause with SATA disks on AHCI ports*</br>
</center>

## Checking the HBA SCSI-TO-ATA Translation Layer

Similarly to the previous case, executing *libzbc* test suite without the
*--ata* option against a SATA disk connected to a SAS HBA will exercise the HBA
SCSI to ATA command translation by removing the use of the ATA16 passthrough
command.

```plaintext
# cd libzbc/test
# ./zbc_test.sh /dev/sg3
Executing section 00 - command completion tests...
    00.010: REPORT_ZONES command completion...                         [Passed]
    00.011: REPORT_ZONES (partial bit) command completion...           [Passed]
    00.012: REPORT_ZONES (reporting option 0x10) command completion... [Passed]
[...]
    02.077: WRITE explicit open to full...                             [Passed]
    02.078: WRITE full to full...                                      [Passed]
```

Again comparing the result of the test suite execution for the two cases (with
and without the "--ata" option) gives hints on the root cause of eventual test
failures. The table below indicates the possible failure root cause when the
test suite reports errors.

<center>
![sata-on-sas](../assets/img/tests-zbc-hba.png "Probable failure root cause with SATA disks on SAS HBA")
<br>*Probable failure root cause with SATA disks on SAS HBA*</br>
</center>

