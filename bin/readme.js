#!/usr/bin/env node
// usage: cat exif-attacher-config.json | node bin/readme.js

const stdin = process.openStdin();

let data = "";

stdin.on('data', function(chunk) {
  data += chunk;
});

stdin.on('end', function() {
  console.log(data)
});

