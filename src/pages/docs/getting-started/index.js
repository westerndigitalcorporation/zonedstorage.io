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

function TwoColumns({columnOne, columnTwo}) {
  return (
    <div className={`TwoColumns`}>
      <div className={`column first left`}>
        {columnOne}
      </div>
      <div className={`column last right`}>
        {columnTwo}
      </div>
    </div>
  );
}

function LinuxSystem() {
  return (
    <Section className="HeaderEntry" background="tint">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Setting up a Zoned Storage Compatible Linux System"
	    text={`
	      Linux distributions are built from a Linux kernel and a
	      collection of system and user applications. 
	      <br/><br/>
	      <strong>Learn how to modify a Linux distribution to 
	      improve zoned block device support.</strong>
	    `}
	    link="/docs/getting-started/linux"
          />
        }
        columnTwo={<img alt="" src="/img/intro-linux-zbd.png" />}
      />
    </Section>
  );
}

function ZonedDevEmulation() {
  return (
    <Section className="HeaderEntry" background="light">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Getting Started with an Emulated Zoned Block Device"
	    text={`
	      An emulated device makes it possible to design applications for
	      ZonedStorage without the expense of a complex hardware setup.
	      Choose the zone configuration that emulates your device type (for
	      example, one zone configuration emulates SMR hard disks and
	      another emulates NVMe ZNS SSDs).
	      <br/><br/>
	      <strong>Learn how to create emulated zoned block devices.</strong>
	    `}
	    link="/docs/getting-started/zbd-emulation"
          />
        }
        columnTwo={<img alt="" src="/img/intro-zoned-storage.png" />}
      />
    </Section>
  );
}

function SmrDisk() {
  return (
    <Section className="HeaderEntry" background="tint">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Getting Started with an SMR Hard Disk"
            text={`
	      Host managed SMR hard disks have a different device type than
	      regular hard disks do. Host managed SMR hard disks need a
	      compatible host-bus-adapter (HBA) is to connect to hosts.
	      <br/><br/>
	      <strong>Learn how to identify SMR hard disks and verify
	      that the host system is operating correctly.</strong>
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
	      <strong>Learn how to identify NVMe ZNS devices</strong> and
	      verify that the host system is operating correctly.
            `}
	    link="/docs/getting-started/zns-device"
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
      <ZonedDevEmulation />
      <SmrDisk />
      <ZnsDevice />
    </Layout>
  );
}

