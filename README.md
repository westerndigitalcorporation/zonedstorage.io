# zonedstorage.io

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern
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

## Deploying

To build and deploy the site to GitHub pages, the following command is provided.

```
$ make deploy GH_USER=<gtihub-user-id>
```

Where *gtihub-user-id* is the GitHub user account ID to gain write access to
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