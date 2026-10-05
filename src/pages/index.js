import React, {useState} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Link from '@docusaurus/Link';
import styles from '../css/index.module.css';

const iconPaths = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  book: 'M12 5v15M3 4h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z',
  terminal: 'M4 4h16v16H4ZM7 8l3 3-3 3m6 1h4',
  layers: 'm12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  chip: 'M6 6h12v12H6Zm3 3h6v6H9ZM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4',
  drive: 'M5 4h14l3 11v5H2v-5Zm-3 11h20M6 17.5h.01M10 17.5h.01',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
  gauge: 'M4.2 18a9 9 0 1 1 15.6 0ZM12 14l5-6M5 11h2m10 0h2M12 5v2',
  reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
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

const zoneBlocks = [0, 1, 2, 3, 4, 5, 6, 7];

const fireworkAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const fireworkBursts = [
  {x: '8%', y: '12vh', delay: '0s', size: '14vw', launchX: '18vw', tilt: '-12deg',
    light: '#006e73', dark: '#9de8dc'},
  {x: '76%', y: '25vh', delay: '0.22s', size: '16vw', launchX: '-21vw', tilt: '18deg',
    light: '#995300', dark: '#ffe39c'},
  {x: '42%', y: '52vh', delay: '0.48s', size: '15vw', launchX: '13vw', tilt: '-15deg',
    light: '#244cbd', dark: '#b0caff'},
  {x: '92%', y: '10vh', delay: '0.73s', size: '14vw', launchX: '-16vw', tilt: '11deg',
    light: '#a8236e', dark: '#ffbce9'},
  {x: '19%', y: '69vh', delay: '1s', size: '17vw', launchX: '15vw', tilt: '-26deg',
    light: '#ac3528', dark: '#ffb1a5'},
  {x: '59%', y: '15vh', delay: '1.22s', size: '15vw', launchX: '-14vw', tilt: '9deg',
    light: '#0b617e', dark: '#8edfff'},
  {x: '86%', y: '72vh', delay: '1.46s', size: '16vw', launchX: '-12vw', tilt: '22deg',
    light: '#5c399c', dark: '#c7bcff'},
  {x: '32%', y: '33vh', delay: '1.72s', size: '17vw', launchX: '15vw', tilt: '-15deg',
    light: '#995300', dark: '#ffe39c'},
  {x: '55%', y: '78vh', delay: '1.98s', size: '18vw', launchX: '-10vw', tilt: '20deg',
    light: '#006e73', dark: '#9de8dc'},
  {x: '6%', y: '88vh', delay: '2.15s', size: '15vw', launchX: '5vw', tilt: '-12deg',
    light: '#a8236e', dark: '#ffbce9'},
  {x: '95%', y: '89vh', delay: '2.35s', size: '16vw', launchX: '-5vw', tilt: '12deg',
    light: '#995300', dark: '#ffe39c'},
  {x: '48%', y: '7vh', delay: '2.5s', size: '17vw', launchX: '22vw', tilt: '-16deg',
    light: '#ac3528', dark: '#ffb1a5'},
];

function ZoneOption({index, written, selected, onSelect}) {
  const state = written === 0 ? 'Empty' : written === zoneBlocks.length ? 'Full' : 'Open';

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
        </span>
        <span className={styles.zoneState}>
          {state}
          <span className={styles.visuallyHidden}>
            , {written} of {zoneBlocks.length} blocks written
          </span>
        </span>
      </span>
      <span className={styles.zoneTrack} aria-hidden="true">
        {zoneBlocks.map((block) => (
          <span
            key={block}
            className={clsx(
              styles.zoneBlock,
              block < written && styles.zoneWritten,
              selected && block === written && styles.zoneNext,
            )}
          />
        ))}
      </span>
    </label>
  );
}

function ZoneModel() {
  const [zones, setZones] = useState([8, 3, 0]);
  const [selected, setSelected] = useState(1);
  const written = zones[selected];
  const full = written === zoneBlocks.length;
  const allFull = full && zones.every((value) => value === zoneBlocks.length);
  const label = `Zone 0${selected}`;

  function writeBlock() {
    setZones((current) =>
      current.map((value, index) =>
        index === selected ? Math.min(value + 1, zoneBlocks.length) : value,
      ),
    );
  }

  function resetZone() {
    setZones((current) => current.map((value, index) => (index === selected ? 0 : value)));
  }

  return (
    <figure className={styles.zoneModel} aria-labelledby="zone-model-caption">
      <div className={styles.modelHeader}>
        <span>Zoned block device</span>
        <span className={styles.modelBadge}>Interactive model</span>
      </div>
      <div className={styles.modelBody}>
        {allFull && createPortal(
          <div className={styles.fireworks} aria-hidden="true">
            {fireworkBursts.map(({x, y, delay, size, launchX, tilt, light, dark}, index) => (
              <span
                key={index}
                className={styles.firework}
                style={{
                  '--x': x, '--y': y, '--delay': delay, '--size': size,
                  '--launch-x': launchX, '--tilt': tilt,
                  '--light-color': light, '--dark-color': dark,
                }}>
                {fireworkAngles.map((angle) => (
                  <span
                    key={angle}
                    className={styles.spark}
                    style={{'--angle': `${angle}deg`}}
                  />
                ))}
              </span>
            ))}
          </div>,
          document.body,
        )}
        <fieldset id="zone-model" className={styles.zones}>
          <legend className={styles.visuallyHidden}>Target zone</legend>
          {zones.map((value, index) => (
            <ZoneOption
              key={index}
              index={index}
              written={value}
              selected={index === selected}
              onSelect={setSelected}
            />
          ))}
        </fieldset>
        <div className={styles.modelLegend} aria-hidden="true">
          <span><i className={styles.legendWritten} />Written</span>
          <span><i className={styles.legendNext} />Next write</span>
          <span><i className={styles.legendEmpty} />Available</span>
        </div>
        <div className={styles.modelActions}>
          <button
            type="button"
            className={styles.writeButton}
            onClick={writeBlock}
            disabled={full}
            aria-controls="zone-model">
            Write a block <Icon name="arrow" />
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={resetZone}
            disabled={written === 0}
            aria-controls="zone-model">
            <Icon name="reset" /> Reset zone
          </button>
        </div>
        <p className={styles.modelStatus} role="status" aria-live="polite" aria-atomic="true">
          {allFull
            ? 'All three zones are full. Reset a zone to write again.'
            : full
              ? `${label} is full. A reset is required before further writes.`
              : `${label}: ${written}/${zoneBlocks.length} blocks written. Next write → block ${written + 1}.`}
        </p>
      </div>
      <figcaption id="zone-model-caption" className={styles.modelCaption}>
        Illustration of sequential-write-required zones. Writes to the selected zone
        advance its write pointer; a reset discards its data.
      </figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={clsx(styles.container, styles.heroGrid)}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>Zoned Storage</h1>
          <p className={styles.heroDescription}>
            Zoned block devices divide their address space into zones. In
            sequential-write-required zones, data is written at the write pointer.
            A zone reset discards the data and returns the write pointer to the start.
          </p>
          <div className={styles.heroActions}>
            <Link className={clsx(styles.button, styles.primaryButton)} to="/docs/getting-started">
              Setup guides <Icon name="arrow" />
            </Link>
            <Link className={clsx(styles.button, styles.secondaryButton)} to="/docs/introduction">
              <Icon name="book" /> Device overview
            </Link>
          </div>
          <p className={styles.heroNote}>Host-managed SMR HDDs, NVMe ZNS SSDs, and Linux software support.</p>
        </div>
        <ZoneModel />
      </div>
      <div className={clsx(styles.container, styles.technologies)}>
        <p className={styles.technologyIntro}>Storage interfaces<strong>SCSI ZBC, ATA ZAC, NVMe ZNS</strong></p>
        <Link className={styles.technologyLink} to="/docs/introduction/smr">
          <Icon name="drive" className={styles.technologyIcon} />
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

const learningPaths = [
  {
    number: '01',
    icon: 'book',
    title: 'Zoned device model',
    description: 'Zone types, sequential write constraints, write pointers, capacities, and zone management commands.',
    link: '/docs/introduction/zoned-storage',
    action: 'Device model reference',
  },
  {
    number: '02',
    icon: 'terminal',
    title: 'Linux setup',
    description: 'Kernel requirements and setup procedures for physical and emulated zoned block devices.',
    link: '/docs/getting-started',
    action: 'Setup guides',
  },
  {
    number: '03',
    icon: 'layers',
    title: 'Linux I/O interfaces',
    description: 'Direct device access, zoned file systems, and device mapper support for zoned block devices.',
    link: '/docs/introduction/linux-ecosystem',
    action: 'Linux support overview',
  },
];

function LearningPaths() {
  return (
    <section className={clsx(styles.container, styles.section)} aria-labelledby="start-heading">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Introduction</p>
          <h2 id="start-heading">Device model and system setup</h2>
          <p className={styles.sectionDescription}>Host-managed devices require software that handles sequential writes and zone management.</p>
        </div>
      </div>
      <div className={styles.pathGrid}>
        {learningPaths.map((path) => (
          <Link className={styles.pathCard} to={path.link} key={path.number}>
            <div className={styles.pathCardTop}>
              <span className={styles.pathIcon}><Icon name={path.icon} /></span>
              <span className={styles.pathNumber} aria-hidden="true">{path.number}</span>
            </div>
            <h3>{path.title}</h3>
            <p>{path.description}</p>
            <span className={styles.cardAction}>{path.action}<Icon name="arrow" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const emulationCommands = `# Emulate a zoned device
sudo modprobe null_blk \\
  nr_devices=1 zoned=1

# Inspect its zones
sudo blkzone report \\
  /dev/nullb0`;

function QuickStart() {
  return (
    <section className={clsx(styles.container, styles.quickStart)} aria-labelledby="quick-start-heading">
      <div>
        <p className={styles.eyebrow}>Linux / null_blk</p>
        <h2 id="quick-start-heading">Zoned device emulation</h2>
        <p className={styles.sectionDescription}>
          The Linux <code>null_blk</code> driver emulates zoned block devices.
          The <code>blkzone report</code> command lists zone descriptors, including
          zone states and write pointer positions.
        </p>
        <Link className={styles.textLink} to="/docs/getting-started/zbd-emulation">
          Emulation guide <Icon name="arrow" />
        </Link>
      </div>
      <div className={styles.commandPanel}>
        <CodeBlock language="bash" title="Linux / null_blk" className={styles.commandBlock}>
          {emulationCommands}
        </CodeBlock>
        <p className={styles.commandNote}>
          Requires root access and a kernel with zoned <code>null_blk</code> support.
          This basic example reports zones; it does not retain written data.
        </p>
      </div>
    </section>
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
        <Hero />
        <LearningPaths />
        <QuickStart />
        <Documentation />
        <Community />
      </main>
    </Layout>
  );
}
