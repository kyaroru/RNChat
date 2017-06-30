#!/bin/sh
cd ~/documents/Personal/React/RNChat
echo "Pulling from RNChat"
git pull
echo "Bundle RNChat for Release"
npm run bundle-android
echo "Finished bundle RNChat"
