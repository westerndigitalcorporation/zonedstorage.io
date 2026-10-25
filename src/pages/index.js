import React, {useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Fireworks from '../components/Fireworks';
import styles from '../css/index.module.css';

const iconPaths = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  book: 'M12 5v15M3 4h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z',
  terminal: 'M4 4h16v16H4ZM7 8l3 3-3 3m6 1h4',
  layers: 'm12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  chip: 'M6 6h12v12H6Zm3 3h6v6H9ZM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4',
  drive: 'M5 4h14l3 11v5H2v-5Zm-3 11h20M6 17.5h.01M10 17.5h.01',
  hdd: 'M5 4h14l3 11v5H2v-5Zm-3 11h20M6 17.5h.01M10 17.5h.01',
  storage: 'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
  gauge: 'M4.2 18a9 9 0 1 1 15.6 0ZM12 14l5-6M5 11h2m10 0h2M12 5v2',
  fastForward: 'M3 6v12l8-6Zm9 0v12l8-6Z',
  fastReverse: 'M21 6v12l-8-6Zm-9 0v12l-8-6Z',
  play: 'M7 5v14l11-7Z',
};

function Icon({name, className}) {
  return (
    <svg
      className={clsx(styles.icon, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false">
      <path d={iconPaths[name]} />
    </svg>
  );
}

// Blocks per zone; each block is one logical block (LBA).
const ZONE_BLOCKS = 8;

function ZoneOption({index, written, finished, selected, onSelect}) {
  const full = finished || written === ZONE_BLOCKS;
  const state = full ? 'Full' : written === 0 ? 'Empty' : 'Open';
  const firstLba = index * ZONE_BLOCKS;

  return (
    <label className={clsx(styles.zoneOption, selected && styles.selectedZone)}>
      <span className={styles.zoneHeading}>
        <span className={styles.zoneName}>
          <input
            type="radio"
            name="target-zone"
            className={styles.zoneRadio}
            checked={selected}
            onChange={() => onSelect(index)}
          />
          Zone 0{index}
          <span className={styles.zoneLba}>
            LBA {firstLba}–{firstLba + ZONE_BLOCKS - 1}
          </span>
        </span>
        <span className={styles.zoneState}>
          {state}
          <span className={styles.visuallyHidden}>
            , {written} of {ZONE_BLOCKS} blocks written
          </span>
        </span>
      </span>
      <span className={styles.zoneTrack} aria-hidden="true">
        <span className={clsx(styles.zoneBar, finished && styles.finishedBar)}>
          <span className={styles.zoneFill} style={{'--wp': written}} />
        </span>
        {/* A full zone has no valid write pointer. */}
        {!full && (
          <span className={styles.writePointer} style={{'--wp': written}}>
            <span className={styles.pointerLabel}>Write pointer</span>
          </span>
        )}
      </span>
    </label>
  );
}

function ZoneSimulation() {
  const [zones, setZones] = useState([8, 3, 0]);
  // Zones transitioned to Full by Finish Zone, possibly with unwritten blocks.
  const [finished, setFinished] = useState([false, false, false]);
  const [selected, setSelected] = useState(1);
  const written = zones[selected];
  const isFull = (index) => finished[index] || zones[index] === ZONE_BLOCKS;
  const full = isFull(selected);
  const allFull = zones.every((_, index) => isFull(index));
  const label = `Zone 0${selected}`;

  // Selects the next zone after the selected one that can still be written.
  function selectNextOpen() {
    for (let offset = 1; offset < zones.length; offset++) {
      const next = (selected + offset) % zones.length;
      if (!isFull(next)) {
        setSelected(next);
        return;
      }
    }
  }

  function writeBlock() {
    const nextZones = zones.slice();
    nextZones[selected] = written + 1;
    setZones(nextZones);
    if (nextZones[selected] === ZONE_BLOCKS) selectNextOpen();
  }

  function finishZone() {
    setFinished((current) => current.map((value, index) => value || index === selected));
    selectNextOpen();
  }

  function resetZone() {
    setZones((current) => current.map((value, index) => (index === selected ? 0 : value)));
    setFinished((current) => current.map((value, index) => value && index !== selected));
  }

  return (
    <figure className={styles.zoneModel} aria-labelledby="zone-model-caption">
      <div className={styles.modelHeader}>
        <span>Zoned block device</span>
        <span className={styles.modelBadge}>Interactive model</span>
      </div>
      <div className={styles.modelBody}>
        {allFull && (
          <BrowserOnly>{() => <Fireworks className={styles.fireworks} />}</BrowserOnly>
        )}
        <fieldset id="zone-model" className={styles.zones}>
          <legend className={styles.visuallyHidden}>Target zone</legend>
          {zones.map((value, index) => (
            <ZoneOption
              key={index}
              index={index}
              written={value}
              finished={finished[index]}
              selected={index === selected}
              onSelect={setSelected}
            />
          ))}
        </fieldset>
        <div className={styles.modelLegend} aria-hidden="true">
          <span><i className={styles.legendWritten} />Written</span>
          <span><i className={styles.legendPointer} />Write pointer</span>
          <span><i className={styles.legendEmpty} />Available</span>
          <span><i className={styles.legendFinished} />Finished</span>
        </div>
        <div className={styles.modelActions}>
          <button
            type="button"
            className={styles.writeButton}
            onClick={writeBlock}
            disabled={full}
            aria-controls="zone-model">
            Write Data <Icon name="play" />
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={finishZone}
            disabled={full}
            aria-controls="zone-model">
            Finish Zone <Icon name="fastForward" />
          </button>
          <button
            type="button"
            className={clsx(styles.resetButton, styles.alignEnd)}
            onClick={resetZone}
            disabled={written === 0 && !finished[selected]}
            aria-controls="zone-model">
            <Icon name="fastReverse" /> Reset zone
          </button>
        </div>
        <p className={styles.modelStatus} role="status" aria-live="polite" aria-atomic="true">
          {allFull
            ? 'All three zones are full. Reset a zone to write again.'
            : full
              ? `${label} is full. A reset is required before further writes.`
              : `${label}: ${written}/${ZONE_BLOCKS} blocks written. Next write → LBA ${selected * ZONE_BLOCKS + written}.`}
        </p>
      </div>
      <figcaption id="zone-model-caption" className={styles.modelCaption}>
        Illustration of sequential-write-required zones. Writes to the selected zone
        advance its write pointer; finishing a zone makes it full without writing the
        remaining blocks; a reset discards its data.
      </figcaption>
    </figure>
  );
}

function ZonedStorage() {
  return (
    <header className={styles.hero}>
      <div className={clsx(styles.container, styles.heroGrid)}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>Zoned Storage</h1>
          <p className={styles.heroDescription}>
            Zoned Storage is an open source, standards-based initiative to enable data
            centers to scale efficiently for the zettabyte storage capacity era. There
            are two technologies behind Zoned Storage, Shingled Magnetic Recording (SMR)
            in ATA/SCSI HDDs and Zoned Namespaces (ZNS) in NVMe SSDs.
          </p>
          <div className={styles.heroActions}>
            <Link className={clsx(styles.button, styles.primaryButton)} to="/docs/introduction/zoned-storage">
              <Icon name="book" /> Overview <Icon name="arrow" />
            </Link>
            <Link className={clsx(styles.button, styles.secondaryButton)} to="/docs/introduction">
              <Icon name="storage" /> Device Models <Icon name="arrow" />
            </Link>
          </div>
          <p className={styles.heroNote}>Host-managed SMR HDDs, NVMe ZNS SSDs, and Emulated Devices.</p>
        </div>
        <ZoneSimulation />
      </div>
      <div className={clsx(styles.container, styles.technologies)}>
        <p className={styles.technologyIntro}>Storage Interfaces<strong>SCSI ZBC, ATA ZAC, NVMe ZNS, and Emulated Devices</strong></p>
        <Link className={styles.technologyLink} to="/docs/introduction/smr">
          <Icon name="hdd" className={styles.technologyIcon} />
          <span><strong>Host-managed SMR HDDs</strong><span>Shingled Magnetic Recording</span></span>
          <Icon name="arrow" className={styles.linkArrow} />
        </Link>
        <Link className={styles.technologyLink} to="/docs/introduction/zns">
          <Icon name="chip" className={styles.technologyIcon} />
          <span><strong>NVMe ZNS SSDs</strong><span>Zoned Namespaces</span></span>
          <Icon name="arrow" className={styles.linkArrow} />
        </Link>
      </div>
    </header>
  );
}

function GettingStarted() {
  return (
    <header className={styles.hero}>
      <div className={clsx(styles.container, styles.heroGrid)}>
	<div className={styles.modelHeader}>
          <span>Linux Ecosystem</span>
	  <div className={styles.imageFrame}>
            <img src={'/img/linux-zbd-overview.png'} alt={'Linux user-space utilities and file systems connect through the kernel zoned block interface to storage devices.'} loading="lazy" />
          </div>
        </div>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>Getting Started</h1>
          <p className={styles.heroDescription}>
	    Zoned storage devices require a compatible Linux kernel providing
	    sequential write control and zone management. Learn how to set up a
	    zoned storage enable system and how to start using zoned storage
	    devices.
          </p>
          <div className={styles.heroActions}>
            <Link className={clsx(styles.button, styles.primaryButton)} to="/docs/getting-started/">
              <Icon name="book" /> Linux Setup <Icon name="arrow" />
            </Link>
            <Link className={clsx(styles.button, styles.secondaryButton)} to="/docs/getting-started/zbd-emulation">
              <Icon name="storage" /> Emulated Devices <Icon name="arrow" />
            </Link>
          </div>
          <p className={styles.heroNote}>Linux kernel, Linux distributions and zoned storage device setup.</p>
        </div>
      </div>
    </header>
  );
}

const resources = [
  {
    icon: 'chip',
    title: 'Linux kernel',
    description: 'Kernel support, block device APIs, configuration, and I/O scheduling.',
    link: '/docs/linux/overview',
  },
  {
    icon: 'layers',
    title: 'File systems',
    description: 'Zoned storage support in XFS, Btrfs, F2FS, and the zonefs interface.',
    link: '/docs/filesystems',
  },
  {
    icon: 'terminal',
    title: 'Tools and libraries',
    description: 'Device management utilities and the libzbd, libzbc, and libnvme APIs.',
    link: '/docs/tools',
  },
  {
    icon: 'code',
    title: 'Applications',
    description: 'Percona Server with MyRocks, RocksDB with Zenfs, and the Zonar file system viewer.',
    link: '/docs/applications',
  },
  {
    icon: 'gauge',
    title: 'Benchmarking',
    description: 'fio configuration and workloads for SMR and NVMe ZNS devices.',
    link: '/docs/benchmarking/fio/overview',
  },
  {
    icon: 'drive',
    title: 'Device mapper',
    description: 'Zoned device support in dm-linear, dm-crypt, and dm-zoned.',
    link: '/docs/device-mapper',
  },
];

function Documentation() {
  return (
    <section className={clsx(styles.container, styles.section)} aria-labelledby="docs-heading">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Reference</p>
          <h2 id="docs-heading">Linux zoned storage support</h2>
          <p className={styles.sectionDescription}>Linux kernel interfaces and userspace components.</p>
        </div>
        <Link className={styles.textLink} to="/docs/introduction">
          Documentation overview <Icon name="arrow" />
        </Link>
      </div>
      <div className={styles.resourceGrid}>
        {resources.map((resource) => (
          <Link className={styles.resourceCard} to={resource.link} key={resource.link}>
            <div className={styles.resourceHeading}>
              <Icon name={resource.icon} className={styles.resourceIcon} />
              <h3>{resource.title}</h3>
              <Icon name="arrow" className={styles.linkArrow} />
            </div>
            <p>{resource.description}</p>
          </Link>
        ))}
      </div>
      <div className={styles.resourceExtras}>
        <span>Additional references</span>
        <Link to="/docs/distributions/overview">Linux distributions <Icon name="arrow" /></Link>
        <Link to="/docs/tests">System compliance tests <Icon name="arrow" /></Link>
        <Link to="/docs/faq">Frequently asked questions <Icon name="arrow" /></Link>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className={clsx(styles.container, styles.community)} aria-labelledby="community-heading">
      <div>
        <p className={styles.eyebrow}>Community</p>
        <h2 id="community-heading">Support and contributions</h2>
        <p>Technical discussion is available on Matrix and IRC. Documentation changes are submitted through GitHub pull requests.</p>
      </div>
      <div className={styles.communityActions}>
        <Link className={clsx(styles.button, styles.primaryButton)} to="/docs/community/support">
          Discussion channels <Icon name="arrow" />
        </Link>
        <Link
          className={styles.textLink}
          to="https://github.com/westerndigitalcorporation/zonedstorage.io">
          Documentation repository <Icon name="code" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Zoned storage documentation"
      description="Technical documentation for host-managed SMR HDDs, NVMe Zoned Namespaces, Linux kernel support, file systems, tools, and applications.">
      <main className={styles.page}>
        <ZonedStorage />
        <GettingStarted />
        <Documentation />
        <Community />
      </main>
    </Layout>
  );
}
