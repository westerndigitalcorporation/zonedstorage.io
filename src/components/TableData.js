/*
 * The data that is used to populate the distribution tables
 - When adding data make sure to specify the path location
 *
 */

export const FedoraZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "43",
            kernel: "6.17",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "44",
            kernel: "6.19",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/fedora"
        },
        {
            distribution: "45",
            kernel: "7.2",
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
            distribution: "Bookworm",
            kernel: "6.1",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/debian"
        },
        {
            distribution: "Trixie",
            kernel: "6.12",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/debian"
        }
];

export const ArchZBDSupport = [
        {
            distribution: "Arch",
            kernel: "6.1 +",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/arch"
        }
];

export const CentOSZbdSupport = [
        /* Data for the ZBD Support Table*/
        {
            distribution: "Stream 9",
            kernel: "5.14",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream 10",
            kernel: "6.12",
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
            distribution: "8",
            kernel: "4.18.0-80",
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
         },
         {
            distribution: "10",
            kernel: "6.12.0-55",
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
            distribution: "15.7",
            kernel: "6.4",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "16.0",
            kernel: "6.12",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "16.1",
            kernel: "6.12",
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
            distribution: "16.0 (Leap)",
            kernel: "6.12",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/opensuse"
         },
         {
            distribution: "16.1 (Leap)",
            kernel: "6.12",
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
            distribution: "22.04 LTS",
            kernel: "5.15",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "24.04 LTS",
            kernel: "6.8",
            zbczac: "Yes",
            nvmezns: "Yes",
            nullblk: "Yes",
            scsidebug: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "26.04 LTS",
            kernel: "7.0",
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
        ...UbuntuZbdSupport,
        ...ArchZBDSupport
];

export const FedoraDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "43",
            kernel: "6.17",
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
            distribution: "44",
            kernel: "6.19",
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
            distribution: "45",
            kernel: "7.2",
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


export const ArchDeviceMapper = [
        {
            distribution: "Arch",
            kernel: "6.1 + ",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/arch"
        }
];

export const DebianDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
        {
            distribution: "Bookworm",
            kernel: "6.1",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/debian"
        },
        {
            distribution: "Trixie",
            kernel: "6.12",
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
            distribution: "Stream 9",
            kernel: "5.14",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/centos"
        },
        {
            distribution: "Stream 10",
            kernel: "6.12",
            f2fs:"No",
            zonefs: "No",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/centos"
        }
];

export const RHELDeviceMapper = [
        /* Data for the File Systems and Device Mapper Table*/
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
            distribution: "9",
            kernel: "5.14.0-70",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
            linear: "Yes",
            flakey: "Yes",
            zoned: "No",
            crypt: "Yes",
            pathlocation:"/docs/distributions/rhel"
        },
        {
            distribution: "10",
            kernel: "6.12.0-55",
            f2fs:"No",
            zonefs: "No",
            zbczac: "No",
            zns: "No",
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
            distribution: "15.7",
            kernel: "6.4",
            f2fs:"No",
            zonefs: "No",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "16.0",
            kernel: "6.12",
            f2fs:"No",
            zonefs: "No",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/sles"
        },
        {
            distribution: "16.1",
            kernel: "6.12",
            f2fs:"No",
            zonefs: "No",
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
            distribution: "16.0 (Leap)",
            kernel: "6.12",
            f2fs:"No",
            zonefs: "No",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/opensuse"
        },
        {
            distribution: "16.1 (Leap)",
            kernel: "6.12",
            f2fs:"No",
            zonefs: "No",
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
            distribution: "22.04 LTS",
            kernel: "5.15",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "24.04 LTS",
            kernel: "6.8",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
            crypt: "Yes",
            pathlocation:"/docs/distributions/ubuntu"
        },
        {
            distribution: "26.04 LTS",
            kernel: "7.0",
            f2fs:"Yes",
            zonefs: "Yes",
            zbczac: "Yes",
            zns: "Yes",
            linear: "Yes",
            flakey: "Yes",
            zoned: "Yes",
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
        ...UbuntuDeviceMapper,
        ...ArchDeviceMapper
];