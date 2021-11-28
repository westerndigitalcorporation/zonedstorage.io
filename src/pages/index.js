import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../css/index.module.css';

function HeaderHero() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.HeaderBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <div className="row">
	    <div className={clsx('col col--6')}>
              <Link
                className="button button--secondary button--lg margin-bottom--md"
                to="/docs/introduction">
                Learn more about Zoned Storage devices
              </Link>
            </div>
	    <div className={clsx('col col--6')}>
	      <Link
                className="button button--secondary button--lg margin-bottom--md"
                to="/docs/linux">
                Learn more about Linux&reg; software support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function QuickStart() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className={clsx('hero hero--secondary', styles.QuickStart)}>
      <div className="container">
        <h1 className="hero__title">Quick Start Guide</h1>
        <p className="hero__subtitle">
	  Learn how to set up a Linux system that supports zoned block devices
	  so that you can start experimenting with physical and emulated zoned
	  storage devices.
	</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started">
            Get Started &raquo;
          </Link>
        </div>
      </div>
    </div>
  );
}

const FeatureList1 = [
  {
    title: 'Linux Kernel Support',
    bcolor: 'button--secondary',
    link: "/docs/linux/overview",
    description: (
      <>
	Linux kernel supports zoned storage devices through various I/O paths
	with different access characteristics, such as raw device access, file
	systems and device mapper targets.
      </>
    ),
  },
  {
    title: 'Applications',
    bcolor: 'button--secondary',
    link: "/docs/applications",
    description: (
      <>
	Learn about applications providing direct support for zoned block
	devices and the benefits obtained from using zoned storage hadrware.
      </>
    ),
  },
  {
    title: 'Tools and Libraries',
    bcolor: 'button--secondary',
    link: "/docs/tools",
    description: (
      <>
	Various open source tools, utilities and libraries now include zoned
	storage support, greatly facilitating system management and application
	development.
      </>
    ),
  },
];

const FeatureList2 = [
  {
    title: 'Linux Distributions',
    bcolor: 'button--primary',
    link: "/docs/distributions/linux",
    description: (
      <>
	Many Linux distributions today ship with a Linux kernel including zoned
	block device support and a varying range of additional features. See
	here a summary of the current support status.
      </>
    ),
  },
  {
    title: 'Benchmarking',
    bcolor: 'button--primary',
    link: "/docs/benchmarking/benchmark",
    description: (
      <>
	Learn how to measure performance with zoned storage compliant workloads
	using the industry standard Flexible I/O tester (fio) application.
      </>
    ),
  },
  {
    title: 'System Compliance Tests',
    bcolor: 'button--primary',
    link: "/docs/tests",
    description: (
      <>
	Learn how to verify a system readiness for zoned storage devices and
	test hadrware components compliance to standards with automated test
	suites.
      </>
    ),
  },
];

function FeatureEntry({title, description, link, bcolor}) {
  return (
    <div className={clsx('col col--4')}>
        <div className="text--center padding-horiz--md">
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--lg button--block margin-bottom--lg', `${bcolor}`)}
              to={link}>
              <b>{title}</b>
            </Link>
          </div>
          <p align="justify">{description}</p>
        </div>
    </div>
  );
}

function Features1() {
  return (
    <section className={styles.Features1}>
      <div className="container">
        <div className="row">
          {FeatureList1.map((props, idx) => (
            <FeatureEntry key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Features2() {
  return (
    <section className={styles.Features2}>
      <div className="container">
        <div className="row">
          {FeatureList2.map((props, idx) => (
            <FeatureEntry key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Zoned Storage Documentation and Resources">
      <Head>
        <title>Zoned Storage</title>
      </Head>
      <HeaderHero />
      <main>
        <QuickStart />
        <Features1 />
        <Features2 />
      </main>
    </Layout>
  );
}
