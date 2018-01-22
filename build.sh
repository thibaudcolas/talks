#!/bin/bash

echo "Starting build"

rm -rf build/*
cp -R src/* build/
rm -rf build/*/node_modules
rm -rf build/*/demo
