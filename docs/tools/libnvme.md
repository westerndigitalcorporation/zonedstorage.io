---
id: libnvme
title: libnvme User Library
sidebar_label: libnvme User Library
---

# libnvme User Library

*libnvme* is an open source user library providing defintions and functions for
interacting with nvme devices. While nvme-cli provides convenient ways for a
user to interact with nvme devices from the shell, libnvme provides similiar
access for other programs.

## Overview

*libnvme* provides functions for discoverying and managing all nvme devices in
a linux environment. When the NVMe ZNS specification was ratified, libnvme
incorporated defintions for all the types and commands that specification
provides.

The library can be used to construct nvme passthrough commands and dispatch
these through the Linux nvme driver. For commands that return data, the library
provides structures and enumerations to help decode the payloads.

## Library Functions

All of the ZNS functions provided by *libnvme* are prefixed with the
"nvme_zns_" name.  The following are the admin commands defined from the ZNS
specifcation.

<center>

| Function | Description |
| :------- | :---------- |
| nvme_zns_identify_ns() | Retrieves the nvme_zns_id_ns structure |
| nvme_zns_identify_ctrl() | Retrieves the nvme_zns_id_ctrl structure |
| nvme_zns_get_log_changed_zones() | Retrieves the nvme_zns_changed_zone_log structure |

</center>

In addition to admin commands, ZNS also defines new IO commands, and *libnvme*
provides the following APIs to send them:

<center>

| Function | Description |
| :------- | :---------- |
| nvme_zns_append() | Append data to a zone |
| nvme_zns_mgmt_send() | Requests an action on one or all zones |
| nvme_zns_mgmt_recv() | Returns data containing information about zones |

</center>

The types of actions that the nvme_zns_mgmt_send() can be done are defined as follows:

<center>

| Action | Description |
| :----- | :---------- |
| NVME_ZNS_ZSA_CLOSE | Sets the zone state to Close |
| NVME_ZNS_ZSA_FINISH | Sets the zone state to Full |
| NVME_ZNS_ZSA_OPEN | Sets the zone state to Open |
| NVME_ZNS_ZSA_RESET | Sets the zone state to Empty |
| NVME_ZNS_ZSA_OFFLINE | Sets the zone state to Offline  |
| NVME_ZNS_ZSA_SET_DESC_EXT | Sets the zone descriptor extention data, if available |

</center>

## Library Types

ZNS created new constant types and structures. The following are the structures
provided by *libnvme* from the ZNS specification:

<center>

| Structure | Description |
| :-------- | :---------- |
| nvme_zns_id_ns | ZNS specific Namespace Identification, returned from nvme_zns_identify_ns() |
| nvme_zns_id_ctrl | ZNS specific Controller Identification, returned from nvme_zns_identify_ctrl() |
| nvme_zns_changed_zone_log | Log page that indicaties if a zone descriptor has changed for one or more zones, returned from nvme_zns_get_log_changed_zones() |
| nvme_zone_report | Provides the structure returned from a ZNS Report Zones command, returned from nvme_zns_mgmt_recv() |

</center>

## Additional Documentation

*libnvme* provides more detailed documentation in html and man pages for all
functions and types.
