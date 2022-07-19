#
# Copyright (c) 2021 Western Digital Corporation or its affiliates.
#
# Note: to manually deploy changes to GitHub pages, run:
# git push -f git@github.com:westerndigitalcorporation/zonedstorage.io.git gh-pages:gh-pages
#

#
# Here, we use yarn instead of npm to build the site etc.
# Check that yarn is installed.
#
ifneq ($(shell which yarn 2> /dev/null),)
YARN := $(shell which yarn)
else
$(error "yarn is not installed")
endif

all: build

upgrade:
	@echo "Upgrading packages"
	@${YARN} upgrade --latest

dependencies:
	@echo "Checking dependencies"
	@${YARN} install

build: dependencies
	@echo "Building site"
	@${YARN} build

serve:
ifeq ($(shell ls -d build 2> /dev/null),)
	@make -s all
endif
	@echo "Stating local server"
	@${YARN} serve --host 0.0.0.0 --port 3000

deploy: build
ifeq ($(GH_USER),)
	$(error "No github user ID specified: use make GH_USER=<your GitHub user> deploy")
else
ifeq ($(shell ls -d build 2> /dev/null),)
	@make -s all
endif
	@GIT_USER=$(GH_USER) USE_SSH=true DEPLOYMENT_BRANCH=gh-pages ${YARN} deploy
endif

clean:
	@echo "Cleaning site"
	@rm -rf build

help:
	@echo "make all"
	@echo "    Build the site"
	@echo "make serve"
	@echo "    Build the site and serve locally on http://0.0.0.0:3000"
	@echo "make deploy GH_USER=<GitHub user>"
	@echo "    Deploy changes to the gh-pages site"
	@echo "make clean"
	@echo "    Delete built site locally"
	@echo "make dependencies"
	@echo "    Install package dependencies (automatic when building)"
	@echo "make upgrade"
	@echo "    Upgrade package dependencies to the latest version"
