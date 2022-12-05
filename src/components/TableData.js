/*
 * The data that is used to populate the distribution tables
 - When adding data make sure to specify the path location
 *
 */

export const FedoraZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "34",
            kernel: "5.11",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "35",
            kernel: "5.14",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "36",
            kernel: "5.17",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "37",
            kernel: "6.0",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/fedora"
        }
];

export const DebianZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "Stretch",
            kernel: "4.9",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/debian"
        },
        {
            distribution: "Buster",
            kernel: "4.19",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/debian"
        },
        {
            distribution: "Bullseye",
            kernel: "5.10",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/debian"
        }
];

export const CentOSZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "7",
            kernel: "3.10",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "7 + elrepro",
            kernel: "5.18",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "8",
            kernel: "4.18",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "8 + elrepro",
            kernel: "5.18",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream 8",
            kernel: "5.13",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream8+elrepro",
            kernel: "5.18",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream 9",
            kernel: "5.14",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/centos"
        }
];

export const RHELZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "7",
            kernel: "3.10.0-123",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.1",
            kernel: "3.10.0-229",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.2",
            kernel: "3.10.0-327",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.3",
            kernel: "3.10.0-514",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.4",
            kernel: "3.10.0-693",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.5",
            kernel: "3.10.0-862",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.6",
            kernel: "3.10.0-957",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.7",
            kernel: "3.10.0-1062",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.8",
            kernel: "3.10.0-1127",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "7.9",
            kernel: "3.10.0-1160",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "8",
            kernel: "4.18.0-80",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "8.1",
            kernel: "4.18.0-147",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "8.2",
            kernel: "4.18.0-193",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "8.3",
            kernel: "4.18.0-240",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/rhel"
         },
         {
            distribution: "9",
            kernel: "5.14.0-70",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/rhel"
         }
];

export const SLESZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "11.3",
            kernel: "3.0.76",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "11.4",
            kernel: "3.0.101",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.0",
            kernel: "3.12",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.1",
            kernel: "3.12",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.2",
            kernel: "4.4",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.3",
            kernel: "4.4",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.4",
            kernel: "4.12",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15",
            kernel: "4.12",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.1",
            kernel: "4.12.14",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.2",
            kernel: "5.3.18",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.3",
            kernel: "5.3.18",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.4",
            kernel: "5.14.21",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        }
];

export const OpensuseZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "15.0 (Leap)",
            kernel: "4.12",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/opensuse"
         },
         {
            distribution: "15.1 (Leap)",
            kernel: "4.12",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/opensuse"
         },
         {
            distribution: "15.2 (Leap)",
            kernel: "5.3",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/opensuse"
         },
         {
            distribution: "15.3 (Leap)",
            kernel: "5.3",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/opensuse"
         },
                  {
            distribution: "15.4 (Leap)",
            kernel: "5.14.21",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/opensuse"
         },
         {
            distribution: "Tumbleweed",
            kernel: "Latest Stable 5.9 +",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/opensuse"
         }
];

export const UbuntuZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "12.04 LTS",
            kernel: "3.2",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "14.04 LTS",
            kernel: "3.13",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "16.04 LTS",
            kernel: "4.4",
            zbczac: "No",
            nvmezns: "No",
            nullblk: "No",
            scsidebug: "No",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "18.04 LTS",
            kernel: "4.15",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "20.04 LTS",
            kernel: "5.4",
            zbczac: "Yes",
            nvmezns: "No",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "22.04 LTS",
            kernel: "5.17",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        }
];

export const ZbdSupport = [
        /* Consolidates all ZBD Support Data*/
        ...FedoraZbdSupport,
        ...DebianZbdSupport,
        ...CentOSZbdSupport,
        ...RHELZbdSupport,
        ...SLESZbdSupport,
        ...OpensuseZbdSupport,
        ...UbuntuZbdSupport
];

export const FedoraDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "34",
            kernel: "5.11",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "No",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "35",
            kernel: "5.14",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "36",
            kernel: "5.14",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "37",
            kernel: "6.0",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/fedora"
        }
];

export const DebianDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "Stretch",
            kernel: "4.9",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/debian"
        },
        {
            distribution: "Buster",
            kernel: "4.19",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/debian"
        },
        {
            distribution: "Bullseye",
            kernel: "5.10",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
             pathlocation:"/docs/distributions/debian"
        }
];

export const CentOSDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "7",
            kernel: "3.10",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "7 + elrepro",
            kernel: "5.18",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes", zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "8",
            kernel: "4.18",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "8 + elrepro",
            kernel: "5.18",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream 8",
            kernel: "5.13",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream8+elrepro",
            kernel: "5.18",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream 9",
            kernel: "5.14",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/centos"
        }
];

export const RHELDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "7",
            kernel: "3.10.0-123",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.1",
            kernel: "3.10.0-229",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.2",
            kernel: "3.10.0-327",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No", zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.3",
            kernel: "3.10.0-514",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.4",
            kernel: "3.10.0-693",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.5",
            kernel: "3.10.0-862",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.6",
            kernel: "3.10.0-957",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.7",
            kernel: "3.10.0-1062",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.8",
            kernel: "3.10.0-1127",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "7.9",
            kernel: "3.10.0-1160",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "8",
            kernel: "4.18.0-80",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "8.1",
            kernel: "4.18.0-147",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "8.2",
            kernel: "4.18.0-193",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "8.3",
            kernel: "4.18.0-240",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "9",
            kernel: "5.14.0-70",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/rhel"
            }
];

export const SLESDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "11.3",
            kernel: "3.0.76",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "11.4",
            kernel: "3.0.101",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.0",
            kernel: "3.12",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.1",
            kernel: "3.12",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.2",
            kernel: "4.4",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.3",
            kernel: "4.4",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
             zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "12.4",
            kernel: "4.12",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15",
            kernel: "4.12",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
             pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.1",
            kernel: "4.12.14",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.2",
            kernel: "5.3.18",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.3",
            kernel: "5.3.18",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "15.4",
            kernel: "5.14.21",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/sles"
        }
];

export const OpensuseDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "15.0 (Leap)",
            kernel: "4.12",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "No",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/opensuse"
        },
        {
            distribution: "15.1 (Leap)",
            kernel: "4.12",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "No",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/opensuse"
        },
        {
            distribution: "15.2 (Leap)",
            kernel: "5.3",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/opensuse"
        },
        {
            distribution: "15.3 (Leap)",
            kernel: "5.3",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
             pathlocation:"/docs/distributions/opensuse"
        },
        {
            distribution: "15.4 (Leap)",
            kernel: "5.14.21",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
             pathlocation:"/docs/distributions/opensuse"
        },
        {
            distribution: "Tumbleweed",
            kernel: "Latest Stable 5.9 +",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/opensuse"
        }
];

export const UbuntuDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "12.04 LTS",
            kernel: "3.2",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "14.04 LTS",
            kernel: "3.13",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "16.04 LTS",
            kernel: "4.4",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "No",
            flakey: "No",
            zoned: "No",
            crypt: "No",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "18.04 LTS",
            kernel: "4.15",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "20.04 LTS",
            kernel: "5.4",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "22.04 LTS",
            kernel: "5.17",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        }
];

export const DeviceMapper = [
        /* Consolidates all DeviceMapper Data*/
        ...FedoraDeviceMapper,
        ...DebianDeviceMapper,
        ...CentOSDeviceMapper,
        ...RHELDeviceMapper,
        ...SLESDeviceMapper,
        ...OpensuseDeviceMapper,
        ...UbuntuDeviceMapper
];
