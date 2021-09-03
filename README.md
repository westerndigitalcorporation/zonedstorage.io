# Zoned Storage.io

This project implements the zonedstorage.io website.

## Requirements

To generate the site HTML content, *mkdocs* and *yuicompressor* must first be
installed.

To install mkdocs, use your favorite distro package management tool.
Installing directly using *pip3* is also possible.

```
pip3 install --upgrade pymdown-extensions
pip3 install --upgrade mkdocs
pip3 install --upgrade mkdocs-pymdownx-material-extras
```

No mkdocs theme needs to be installed as the local custom *cinder* theme is
used. This customized theme is in the sub-directory `cinder`.

The *yuicompressor* utility is generally available as a package of the same name
from most Linux distributions.

## Locally Building and Testing the Site

To locally build the site HTML files, execute:

```
make
```

Changes can be tested locally using the following command:

```
make serve
```

This builds the site HTML files and start a local server accessible from
http://127.0.0.1:8000. The local server can be stopped with CTRL-C. This
local server will automatically rebuild the HTML files if markdown files are
modified while it is running.

## Contributions

Contributions should be sent as pull requests against the *main* branch. Please
make sure to locally test your changes using *make serve* before sending a pull
request.

## Publishing Updates

To deploy updates to the GitHub pages site, run:

```
make deploy
```

This command can be executed only against the *site* branch. Updates in the
*main* branch must first be merged in the *site* branch after testing.
The user executing this command must have write access to the zonedstorage.io
repository.

Once deployed, the updated site content can be accessed from
[zonedstorage.io](https://zonedstorage.io/) and
[westerndigitalcorporation.github.io/zonedstorage.io/](https://westerndigitalcorporation.github.io/zonedstorage.io/).
