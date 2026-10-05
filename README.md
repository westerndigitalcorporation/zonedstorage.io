# zonedstorage.io

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern
static website generator.

## Prerequisites

To build, locally test and deploy to GitHub pages the zonedstorage.io site,
*nodejs* and the *yarn* dependency manager must be installed first.

On Fedora/CentOS systems, run:

```
$ sudo dnf install nodejs yarnpkg
```

On Debian/Ubuntu systems, run:

```
$ sudo apt-get install nodejs npm
$ npm install --global yarn
```

On macOS systems install [Homebrew](https://brew.sh/) and run:

```
$ brew install node
$ npm install --global yarn
```

## Building the site

To build the zonedstorage.io site, run:

```
$ make
```

To test changes locally before deploying, the following command can be used.

```
$ make serve
```

A local http server is run to locally serve the site on http://0.0.0.0:3000.

### Site theme and landing page

The front page is implemented in `src/pages/index.js`, with scoped styles in
`src/css/index.module.css`. It includes an interactive sequential-write zone
model with three selectable zones, guided documentation entry points, and a
copyable Linux emulation example.
Navigation, search, theme switching, and code blocks use Docusaurus components.
The shared `--landing-*` palette, documentation styles, navbar, and footer are
defined in `src/css/custom.css`. The Getting Started overview uses
`src/css/getting-started.module.css`; its routes and content are in
`src/pages/docs/getting-started/index.js`. Footer links and legal text remain
configured in `docusaurus.config.js`. Keep page copy factual: describe
interfaces, constraints, and documented components.

The navbar logo and favicon are generated from `static/img/zs-logo.svg`:

```sh
rsvg-convert --width 200 --height 200 --output static/img/zs-logo.png static/img/zs-logo.svg
magick static/img/zs-logo.svg -background none -define icon:auto-resize=16,32,48,64 static/img/zs-logo.ico
```

For a live preview, run `yarn start --host 0.0.0.0 --no-open`. Check desktop and
mobile layouts in both light and dark mode. In the zone model, select each zone,
fill a zone, and reset it, including keyboard operation. Check documentation
links and code copying. Check the navbar, footer, article, sidebar, TOC,
tables, and Getting Started overview in both themes. Run `yarn build` to check
production rendering and links.

## Deploying

To build and deploy the site to GitHub pages, the following command is provided.

```
$ make deploy GH_USER=<github-user-id>
```

Where *github-user-id* is the GitHub user account ID to gain write access to
the gh-pages branch of the repository.

## Package Dependencies Management

All package dependendies are installed automatically when running `make all`.
To manually perform this operation, the following command is available.

```
$ make dependencies
```

To upgrade all package dependencies to their latest version, run:

```
$ make upgrade
```

## Contributing

Feel free to submit a pull request to contribute changes and improvements. 

We follow the Contributor Covenant Code of Conduct as outline [here](CODE_OF_CONDUCT.md).

## Copying and License

The site source code is released as open source software under the GPL v3 license, see [COPYING](COPYING) and the [LICENSE](LICENSE) files in the project root for the full copying and license texts.