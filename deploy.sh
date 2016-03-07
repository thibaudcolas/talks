#!/bin/bash

echo "Starting build"

rm -rf build/*
cp -R src/* build/
rm -rf build/*/node_modules
rm -rf build/*/demo
cd build

echo "Finished copying files"

git add -f .
git add -fu .
git commit -m "Deploy to gh-pages"

echo "Starting push"

git push -fq git@github.com:ThibWeb/talks.git "master:gh-pages"

echo "Build finished"
