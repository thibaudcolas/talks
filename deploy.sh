#!/bin/bash

cd build
git add -f .
git commit -m "Deploy to gh-pages"
git push -fq "git@github.com/ThibWeb/talks" "master:gh-pages"

