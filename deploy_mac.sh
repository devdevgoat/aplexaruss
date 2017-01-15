#!/bin/bash          
echo Build started
rm -rf dist
mkdir dist
cd dist
mkdir install
cd ..
npm install -g --prefix ./dist/install
rm ./dist/dist.zip
cd ./dist/install/lib/node_modules/aplexaruss/
rm -rf ./node_modules/plex-api
mkdir ./node_modules/plex-api
cp -R ../../../../../customized_modules/plex-api/* ./node_modules/plex-api/
zip -qr ../../../../dist.zip * .env -x "*.p*"
echo files are ready
cd ..
cd ..
cd ..
cd ..
cd ..
echo uploading zip file, please wait...
aws lambda update-function-code --zip-file fileb://dist/dist.zip --function-name alexa-plex
echo upload is done, exiting.
