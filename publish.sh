mv ~/.npmrc ~/.npmrc.tmp
mv ~/.npmrc.mgsong ~/.npmrc
npm publish
mv ~/.npmrc ~/.npmrc.mgsong
mv ~/.npmrc.tmp ~/.npmrc