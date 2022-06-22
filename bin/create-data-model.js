#! /usr/bin/env node
// usage: cat exif-attacher-config.json | node bin/create-data-model.js

const createDataModel = require('../src/data-model-generator')
const stdin = process.openStdin();

let data = "";

stdin.on('data', function(chunk) {
  data += chunk;
});

stdin.on('end', function() {
  try {
    const jsonConfig = JSON.parse(data)
    createDataModel(jsonConfig)
  } catch (e) {
    console.log('=== ERROR ===', `\n`, e.message)
  }
});

