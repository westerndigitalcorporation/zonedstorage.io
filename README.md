# Zoned Storage.io

This project implements the zonedstorage.io website.

## Requirements

To generate the site HTML content, *mkdocs* and *yuicompressor* must first be
installed.

To install mkdocs, use your favorite distro package management tool.
Installing directly using *pip3* is also possible.

```
sudo pip3 install --upgrade pymdown-extensions
sudo pip3 install --upgrade mkdocs
sudo pip3 install --upgrade mkdocs-pymdownx-material-extras
```

No mkdocs theme needs to be installed as the local custom *cinder* theme is
used. This customized theme is in the sub-directory `cinder`.

The *yuicompressor* utility is generally available as a package of the same name
from most Linux distributions.

## Building and Testing the Site

To build the site HTML files, execute:

```
make
```

To build the site and to test the result using a local server accessible from
http://127.0.0.1:8000, run:

```
make serve
```

## Deploying Updates

To deploy the site to GitHub pages, run:

```
make deploy
```

The user executing this command must have write access to the repository.
Once deployed, the site content can be accessed from
[zonedstorage.io](https://zonedstorage.io/) and
[westerndigitalcorporation.github.io/zonedstorage.io/](https://westerndigitalcorporation.github.io/zonedstorage.io/).
