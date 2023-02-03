import React from "react";
import {useLocation} from "@docusaurus/router";
import {
        ZbdSupport, DeviceMapper, FedoraZbdSupport,
        DebianZbdSupport, ArchZBDSupport, CentOSZbdSupport, RHELZbdSupport,
        SLESZbdSupport, OpensuseZbdSupport, UbuntuZbdSupport,
        FedoraDeviceMapper, DebianDeviceMapper, CentOSDeviceMapper,
        RHELDeviceMapper, SLESDeviceMapper, OpensuseDeviceMapper,
        UbuntuDeviceMapper, ArchDeviceMapper
       } from "./TableData.js";

export function KernelTableHeader() {
    // Table header for ZBD Support //
  return (
    <tr>
      <th>Distribution Version</th>
      <th>Kernel Version</th>
      <th>SCSI ZBC and ATA ZAC Support</th>
      <th>NVMe ZNS Support</th>
      <th><a
      href="../getting-started/zbd-emulation#zoned-block-device-emulation-with-null_blk"
      target="_blank">
        <em>null_blk</em> Zone &nbsp; Emulation Support
      </a></th>
      <th><a
      href="../getting-started/zbd-emulation#smr-hard-disk-emulation-with-scsi_debug"
      target="_blank">
        <em>scsi_debug</em> ZBC &nbsp; Emulation &nbsp;Support&nbsp;
      </a></th>
    </tr>
  );
}

export function FileSystemsDeviceMapperTableHeader() {
    // Table header for File Systems and Device Mapper //
  return (
    <>
     <tr>
        <th colSpan="2"></th>
        <th colSpan="4">File Systems</th>
        <th colSpan="4">Device Mapper</th>
     </tr>
     <tr>
        <th rowSpan="4">Distribution Version</th>
        <th rowSpan="4">Kernel Version</th>
        <th rowSpan="4">f2fs</th>
        <th rowSpan="4">zonefs</th>
        <th colSpan="2" rowSpan="3">btrfs</th>
        <th rowSpan="4">linear</th>
        <th rowSpan="4">flakey</th>
        <th rowSpan="4">zoned</th>
        <th rowSpan="4" >crypt</th>
     </tr>
     <tr></tr>
     <tr></tr>
     <tr>
        <th>ZBC/ZAC</th>
        <th>ZNS</th>
        </tr>
    </>
  );
}

export function KernelTabledata() {
    // Table Data for ZBD Support //
    let location = useLocation()
      return(
        ZbdSupport
        .filter(ZbdSupport => ZbdSupport.pathlocation === (location.pathname))
        .map(Data=>
            <tr>
               <td>{Data.distribution}</td>
               <td>{Data.kernel}</td>
               <td className={Data.zbczac === "Yes" ?
                   'background-green' : 'background-red'}>{Data.zbczac}</td>
               <td className={Data.nvmezns === "Yes" ?
                   'background-green' : 'background-red'}>{Data.nvmezns}</td>
               <td className={Data.nullblk === "Yes" ?
                   'background-green' : 'background-red'}>{Data.nullblk}</td>
               <td className={Data.scsidebug === "Yes" ?
                   'background-green' : 'background-red'}>{Data.scsidebug}</td>
             </tr>
         )
    );
}

export function FileSystemDevicMapperTabledata() {
    // Table Data for File Systems and Device Mapper //
    let location = useLocation()
        return(
        DeviceMapper
        .filter(DeviceMapper => DeviceMapper.pathlocation === (location.pathname))
        .map(Data=>
            <tr>
                <td>{Data.distribution}</td>
                <td>{Data.kernel}</td>
                <td className={Data.f2fs === "Yes" ?
                    'background-green' : 'background-red'}>{Data.f2fs}</td>
                <td className={Data.zonefs === "Yes" ?
                    'background-green' : 'background-red'}>{Data.zonefs}</td>
                <td className={Data.zbczac === "Yes" ?
                    'background-green' : 'background-red'}>{Data.zbczac}</td>
                <td className={Data.zns === "Yes" ?
                    'background-green' : 'background-red'}>{Data.zns}</td>
                <td className={Data.linear === "Yes" ?
                    'background-green' : 'background-red'}>{Data.linear}</td>
                <td className={Data.flakey === "Yes" ?
                    'background-green' : 'background-red'}>{Data.flakey}</td>
                <td className={Data.zoned === "Yes" ?
                    'background-green' : 'background-red'}>{Data.zoned}</td>
                <td className={Data.crypt === "Yes" ?
                    'background-green' : 'background-red'}>{Data.crypt}</td>
            </tr>
        )
    );
}
