import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../../../css/getting-started.module.css';

const guides = [
  {
    title: 'Set up a Linux system',
    href: '/docs/getting-started/linux',
    description:
      'Check kernel support for zoned block devices and install the utilities needed to inspect and manage them.',
    image: 'linux-zbd-overview.png',
    imageAlt:
      'Linux user-space utilities and file systems connect through the kernel zoned block interface to storage devices.',
  },
  {
    title: 'Emulate a zoned block device',
    href: '/docs/getting-started/zbd-emulation',
    description:
      'Create zoned devices for development and testing without physical hardware, using Linux drivers or device emulators.',
    image: 'intro-zoned-storage.png',
    imageAlt:
      'Diagram of a zoned device showing zones, the sequential write pointer, and zone reset.',
  },
  {
    title: 'Work with an SMR hard disk',
    href: '/docs/getting-started/smr-disk',
    description:
      'Identify host-aware and host-managed SMR disks, and check how the host detects and reports their zones.',
    image: 'intro-smr-zones.png',
    imageAlt:
      'Conventional hard disk tracks compared with overlapping tracks on an SMR disk.',
  },
  {
    title: 'Use an NVMe ZNS device',
    href: '/docs/getting-started/zns-device',
    description:
      'Configure a QEMU-emulated NVMe zoned namespace and inspect its zones from a Linux guest.',
    image: 'intro-zns.png',
    imageAlt:
      'Conventional SSD flash management compared with application-directed zones on a ZNS SSD.',
  },
];

export default function GetStarted() {
  const imageBaseUrl = useBaseUrl('/img/');

  return (
    <Layout
      title="Getting Started with Zoned Storage"
      description="Guides to setting up Linux and working with emulated, SMR, and NVMe ZNS zoned storage devices.">
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.intro}>
            <h1>Getting Started with Zoned Storage</h1>
            <p className={styles.summary}>
              Prepare a Linux system for zoned block devices, then choose an
              emulated device, an SMR hard disk, or an NVMe zoned namespace to
              work with.
            </p>
          </header>

          <section className={styles.guides} aria-labelledby="getting-started-guides">
            <div className={styles.sectionHeading}>
              <h2 id="getting-started-guides">Guides</h2>
              <p>Choose the device or setup you need to configure.</p>
            </div>
            <div className={styles.grid}>
              {guides.map(({title, href, description, image, imageAlt}) => (
                <Link className={styles.card} key={href} to={href}>
                  <div className={styles.imageFrame}>
                    <img src={`${imageBaseUrl}${image}`} alt={imageAlt} loading="lazy" />
                  </div>
                  <div className={styles.cardBody}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span className={styles.cardAction} aria-hidden="true">
                      Read guide <span>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}

