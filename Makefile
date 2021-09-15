#
# Copyright (c) 2021 Western Digital Corporation or its affiliates.
#
# Note: to manually deploy changes to GitHub pages, run:
# git push -f git@github.com:westerndigitalcorporation/zonedstorage.io.git gh-pages:gh-pages
#

# Use yui-compressor when yuicompressor not available.
ifneq ($(shell which yuicompressor 2> /dev/null),)
YUICOMPRESSOR := yuicompressor
else
ifneq ($(shell which yui-compressor 2> /dev/null),)
YUICOMPRESSOR := yui-compressor
endif
endif

curbranch := $(shell git branch --show-current)
cssdir=cinder/css

all: doc

base.min.css: ${cssdir}/base.css
ifdef YUICOMPRESSOR
	@echo "  Compacting $<"
	@$(YUICOMPRESSOR) $< > ${cssdir}/$@
endif

bootstrap-custom.min.css: ${cssdir}/bootstrap-custom.css
ifdef YUICOMPRESSOR
	@echo "  Compacting $<"
	@$(YUICOMPRESSOR) $< > ${cssdir}/$@
endif

cinder.min.css: ${cssdir}/cinder.css
ifdef YUICOMPRESSOR
	@echo "  Compacting $<"
	@$(YUICOMPRESSOR) $< > ${cssdir}/$@
endif

highlight.min.css: ${cssdir}/highlight.css
ifdef YUICOMPRESSOR
	@echo "  Compacting $<"
	@$(YUICOMPRESSOR) $< > ${cssdir}/$@
endif

css-all: base.min.css bootstrap-custom.min.css cinder.min.css highlight.min.css

doc::
	@echo "Building site files"
	@make -s css-all
	@mkdocs build

serve::
	@echo "Building site files and stating local server"
	@make -s css-all
	@mkdocs serve

clean:
	@echo "Deleting site files"
	@rm -rf site
	@echo "Cleaning stylesheets"
	@rm -f ${cssdir}/*.min.css

deploy::
ifeq ($(curbranch),site)
	@echo "Building and deploying the site files to GitHub pages"
	@make -s css-all
	@mkdocs gh-deploy
else
	@echo "Invalid current branch \"$(curbranch)\"."
	@echo -n "Swith to the \"site\" branch and pull-in changes from"
	@echo "the \"main\" branch to deploy changes."
endif

help:
	@echo "make [all|doc]: Build site files"
	@echo "make serve: Build the site files and serve locally on http://127.0.0.1:8000/"
	@echo "make deploy: Deploy changes to the gh-pages site (from the \"site\" branch)"
