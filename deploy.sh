#!/bin/bash

cp -R 2014/* build/
rm -rf build/*/node_modules
cp -R root/* build/
cd build
git add -f .
git add -fu .
git commit -m "Deploy to gh-pages"
git push -fq git@github.com:ThibWeb/talks.git "master:gh-pages"

