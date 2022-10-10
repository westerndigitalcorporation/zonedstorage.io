// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Zoned Storage',
  tagline: 'Zoned Storage is an open source, standards-based initiative to enable data centers to scale efficiently for the zettabyte storage capacity era. There are two technologies behind Zoned Storage, Shingled Magnetic Recording (SMR) in ATA/SCSI HDDs and Zoned Namespaces (ZNS) in NVMe SSDs.',
  organizationName: 'westerndigitalcorporation',
  projectName: 'zonedstorage.io',
  url: 'https://zonedstorage.io',
  baseUrl: '/',
  trailingSlash: false,
  favicon: 'img/zs-logo.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  plugins: [
    /**
     * Google analytics plugin is already included with preset-classic
     * so we do not need to add it explicitly.
     * ['@docusaurus/plugin-google-analytics'],
    */

    ['@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-0DX1KGD5E4',
      }
    ],

    [require.resolve('@cmfcmf/docusaurus-search-local'), {
      /** whether to index docs pages */
      indexDocs: true,

      /**
       * Whether to also index the titles of the parent categories in the
       * sidebar of a doc page:
       * 0 disables this feature.
       * 1 indexes the direct parent category in the sidebar of a doc page
       * 2 indexes up to two nested parent categories of a doc page
       * 3...
       *
       * Do _not_ use Infinity, the value must be a JSON-serializable integer.
       */
      indexDocSidebarParentCategories: 0,

      /** whether to index blog pages */
      indexBlog: false,
      /** blogRouteBasePath: '/blog', */

      /** whether to index static pages (/404.html is never indexed) */
      indexPages: false,

      /** language of your documentation */
      language: "en",

      /**
       * Setting this to "none" will prevent the default CSS to be included. The default CSS
       * comes from autocomplete-theme-classic, which you can read more about here:
       * https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-theme-classic/
       */
      style: undefined,

      /** lunr.js-specific settings */
      lunr: {
	/**
	 * When indexing your documents, their content is split into "tokens".
	 * Text entered into the search box is also tokenized.  This setting
	 * configures the separator used to determine where to split the text into
	 * tokens.  By default, it splits the text at whitespace and dashes.
	 * Note: Does not work for "ja" and "th" languages, since these use a
	 * different tokenizer.
	 */
        tokenizerSeparator: /[\s\-]+/
      }
    }]
  ],

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
                to: '/docs/getting-started/',
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
    }),
};

module.exports = config;
