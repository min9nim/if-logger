
#!/bin/sh

yarn test
if [ $? -ne 0 ]; then
  echo "test failed"
  exit 1
fi
rm -r dist
yarn build
if [ $? -ne 0 ]; then
  echo "build failed"
  exit 1
fi
mv ~/.npmrc ~/.npmrc.tmp
mv ~/.npmrc.mgsong ~/.npmrc
npm publish
mv ~/.npmrc ~/.npmrc.mgsong
mv ~/.npmrc.tmp ~/.npmrc