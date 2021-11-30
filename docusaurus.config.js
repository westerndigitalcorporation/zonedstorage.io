// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Zoned Storage',
  tagline: 'Zoned Storage is a class of storage devices that enables host and storage devices to cooperate to achieve higher storage capacities, increased throughput, and lower latencies. The zoned storage interface is available through the SCSI Zoned Block Commands (ZBC) and Zoned Device ATA Command Set (ZAC) standards for Shingled Magnetic Recording (SMR) hard disks and with the NVMe Zoned Namespaces (ZNS) standard for NVMe Solid State Disks.',
  organizationName: 'westerndigitalcorporation',
  projectName: 'zonedstorage.io',
  url: 'https://zonedstorage.io',
  baseUrl: '/',
  favicon: 'img/zs-logo.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  /**
   * Google analytics plugin is already included with preset-classic
   * so we do not need to add it explicitly.
   * plugins: ['@docusaurus/plugin-google-analytics'],
   */

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./src/components/sidebars.js'),
          /** editUrl: 'https://github.com/westerndigitalcorporation/zonedstorage.io/edit/main/website/', */
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        hideOnScroll: false,
        title: 'Zoned Storage',
        logo: {
          alt: 'Zoned Storage Logo',
          src: 'img/zs-logo.png',
        },
        items: [
          {
            label: 'Documentation',
            position: 'left',
            type: 'doc',
            docId: 'introduction/index',
          },
          {
	    label: 'Community',
	    position: 'left',
	    to: '/docs/community/support',
	  },
          {
            label: 'GitHub',
            position: 'right',
            href: 'https://github.com/westerndigitalcorporation/zonedstorage.io',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction to Zoned Storage',
                to: '/docs/introduction/zoned-storage',
              },
              {
                label: 'Getting Started with Zoned Storage',
                to: '/docs/getting-started/index',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Matrix',
                href: 'https://app.element.io/#/room/#zonedstorage-general:matrix.org',
              },
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/zonedstorage/shared_invite/zt-uyfut5xe-nKajp9YRnEWqiD4X6RkTFw',
              },
              {
                label: 'IRC @ OFTC',
                href: 'https://webchat.oftc.net/?channels=zonedstorage',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub Organization',
                href: 'https://github.com/westerndigitalcorporation',
              },
            ],
          },
        ],
	copyright: `Copyright © ${new Date().getFullYear()} Western Digital
	Corporation or its affiliates. All rights reserved.<br> By using this site, you agree to the <a href="https://www.westerndigital.com/legal/terms-of-use" target="_blank">Terms of Use</a> and <a href="https://www.westerndigital.com/legal/privacy-statement" target="_blank">Privacy Statement</a>.  All example scripts and program snippets on this site are licensed under the <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CCO 1.0 Universal</a> license.<br>This site is built with <a href="https://docusaurus.io/" target="_blank">Docusaurus</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      gtag: {
        trackingID: 'G-0DX1KGD5E4',
      },
    }),
};

module.exports = config;
