---
id: index
title: Overview
sidebar_label: Overview
slug: /getting-started
---

# Getting Started

## Overview

Learn how to set up a Linux system to use zoned storage devices.

## Introduction

If you have never used a zoned block device before, this is the chapter that
you should read. 

## null_blk Emulation Setup

The following three-step procedure results in an environment that will allow
you to evaluate ZonedStorage and to investigate its features. This is the
fastest way to get started, and is recommended for first-time readers.

This procedure creates a zoned null block device. It is okay if you do not yet
know what that means. This is the simplest way to try out ZonedStorage.

1. Install a Linux distribution that supports ZonedStorage. Fedora 36 is recommended.
1. [Create a zoned null_blk device](./nullblk.md#creating-a-zoned-null-block-device--simplest-case). "null_blk" is pronounced "null block", and for our purposes in this tutorial, you need to know only that the "null block device" emulates a block device.

# Reference Section

* [Linux Distributions](../distributions/linux.md): Learn about the support
  provided by the pre-compiled binary kernels shipped with various Linux
  distributions.

* [System Prerequisites](prerequisite.md): Learn how to set up a Linux system
  to enable zoned-block-device support.

* [Getting Started with an Emulated Zoned Block Device](nullblk.md): Learn how
  to use the *null_blk* device driver to emulate zoned block devices with
  different zone configurations. 

* [Getting Started with an SMR Disk](smr-disk.md): Learn how to identify SMR
  disks and verify that the host system is operating correctly.

* [Getting Started with an Emulated SMR Disk](smr-emulation.md): Learn how to
  set up and use an emulated SMR disk that is equivalent to a real physical
  device.

* [Getting Started with an Emulated NVMe ZNS Device](zns-emulation.md): Learn
  how to set up and use an emulated NVMe device to provide Zoned Namespaces
  equivalent to those on a real physical device.
