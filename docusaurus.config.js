// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Weaviate Docs',
  tagline: 'Vector Search Engine',
  url: 'https://weaviate-docusaurus.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/weaviate-logo.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'semi-technologies', // Usually your GitHub org/user name.
  projectName: 'weaviate', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
        title: 'Weaviate',
        logo: {
          alt: 'My Site Logo',
          src: 'img/weaviate-logo.svg',
        },
        items: [
          {
            label: 'Docs',
            sidebarId: 'docsSidebar',
            type: 'doc',
            docId: 'index',
            position: 'left',
          },
          {
            label: 'Contributor Guide',
            sidebarId: 'contributorSidebar',
            type: 'doc',
            docId: 'contributor-guide/index',
            // docId: 'contributor-guide/intro',
            position: 'left',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/semi-technologies/weaviate-io',
            label: 'GitHub',
            position: 'right',
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
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/tags/weaviate/',
              },
              {
                label: 'Slack',
                href: 'https://weaviate.slack.com/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/weaviate_io',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/semi-technologies/weaviate-io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Weaviate, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
