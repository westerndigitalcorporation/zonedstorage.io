import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../../../css/index.module.css';

function Heading({text}) {
  return <h2 className="Heading">{text}</h2>;
}

function TextColumn({title, link, text}) {
  return (
    <a href={link}>
      <>
        <Heading text={title} />
        <div dangerouslySetInnerHTML={{__html: text}} />
      </>
    </a>
  );
}

function Section({
  element = 'section',
  children,
  className,
  background = 'light',
}) {
  const El = element;
  return <El className={`Section ${className} ${background}`}>{children}</El>;
}

function TwoColumns({columnOne, columnTwo, reverse}) {
  return (
    <div className={`TwoColumns ${reverse ? 'reverse' : ''}`}>
      <div className={`column first ${reverse ? 'right' : 'left'}`}>
        {columnOne}
      </div>
      <div className={`column last ${reverse ? 'left' : 'right'}`}>
        {columnTwo}
      </div>
    </div>
  );
}

function LinuxSystem() {
  return (
    <Section className="HeaderEntry" background="tint">
      <TwoColumns
        reverse
        columnOne={
          <TextColumn
            title="Setting up a Zoned Storage Compatible Linux System"
	    text={`
	      Learn about the support provided by the pre-compiled binary
	      kernels shipped with various Linux distributions.
	    `}
	    link="/docs/distributions/linux"
          />
        }
        columnTwo={<img alt="" src="/img/intro-linux-zbd.png" />}
      />
    </Section>
  );
}

function NullBlk() {
  return (
    <Section className="HeaderEntry" background="light">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Getting Started with an Emulated Zoned Block Device"
	    text={`
	      Learn how to use the <strong>null_blk</strong> device driver to
	      emulate zoned block devices with different zone configurations.
	    `}
	    link="/docs/getting-started/nullblk"
          />
        }
        columnTwo={<img alt="" src="/img/intro-zoned-storage.png" />}
      />
    </Section>
  );
}

function SmrEmu() {
  return (
    <Section className="HeaderEntry" background="tint">
      <TwoColumns
        reverse
        columnOne={
          <TextColumn
            title="Getting Started with an Emulated SMR Disk"
	    text={`
	      Learn how to set up and use an emulated SMR disk that is
	      equivalent to a real physical device.
	    `}
	    link="/docs/getting-started/smr-emulation"
          />
        }
        columnTwo={<img alt="" src="/img/tools-tcmu.png" />}
      />
    </Section>
  );
}

function ZnsEmu() {
  return (
    <Section className="HeaderEntry" background="light">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Getting Started with an Emulated NVMe ZNS Device"
            text={`
	      Learn how to set up and use an emulated NVMe device to provide
	      Zoned Namespaces equivalent to those on a real physical device.
            `}
	    link="/docs/getting-started/zns-emulation"
          />
        }
        columnTwo={<img alt="" src="/img/qemu.png" />}
      />
    </Section>
  );
}

function SmrDisk() {
  return (
    <Section className="HeaderEntry" background="tint">
      <TwoColumns
        reverse
        columnOne={
          <TextColumn
            title="Getting Started with an SMR Disk"
            text={`
	      Learn how to identify SMR disks and verify that the host system
	      is operating correctly.
            `}
	    link="/docs/getting-started/smr-disk"
          />
        }
        columnTwo={<img alt="" src="/img/intro-smr-zones.png" />}
      />
    </Section>
  );
}

function ZnsDevice() {
  return (
    <Section className="HeaderEntry" background="light">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Getting Started with a NVMe ZNS Device"
            text={`
	      Learn how to identify NVMe ZNS devices and verify that the host
	      system is operating correctly.
            `}
	    link="/docs/getting-started/zns-emulation"
          />
        }
        columnTwo={<img alt="" src="/img/intro-zns.png" />}
      />
    </Section>
  );
}

function GettingStartedHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className={clsx('hero hero--dark', styles.HeaderBanner)}>
      <div className="container">
        <h1 className="hero__title">Getting Started with Zoned Storage Devices</h1>
        <p className="hero__subtitle">
          Learn how to set up a Linux system that supports zoned block devices
          so that you can start experimenting with emulated and physical zoned
          storage devices.
	</p>
      </div>
    </div>
  );
}

export default function GetStarted() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      description="Getting Started">
      <Head>
        <title>Getting Started</title>
      </Head>
      <GettingStartedHeader />
      <LinuxSystem />
      <NullBlk />
      <SmrEmu />
      <ZnsEmu />
      <SmrDisk />
      <ZnsDevice />
    </Layout>
  );
}

