#
# Copyright (c) 2021 Western Digital Corporation or its affiliates.
#
# Note: to manually deploy the built site to GitHub pages, run:
# git push -f git@github.com:westerndigitalcorporation/zonedstorage.io.git gh-pages:gh-pages
#

cssdir=cinder/css

all: doc

base.min.css: ${cssdir}/base.css
	@echo "  Compacting $<"
	@yuicompressor $< > ${cssdir}/$@

bootstrap-custom.min.css: ${cssdir}/bootstrap-custom.css
	@echo "  Compacting $<"
	@yuicompressor $< > ${cssdir}/$@

cinder.min.css: ${cssdir}/cinder.css
	@echo "  Compacting $<"
	@yuicompressor $< > ${cssdir}/$@

highlight.min.css: ${cssdir}/highlight.css
	@echo "  Compacting $<"
	@yuicompressor $< > ${cssdir}/$@

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
	@echo "Building and deploying site files to GitHub pages"
	@make -s css-all
	@mkdocs gh-deploy

help:
	@echo "make [all|doc]: Build site files"
	@echo "make serve: Build the site files and serve locally on http://127.0.0.1:8000/"
	@echo "make deploy: Deploy site files to gh-pages"
