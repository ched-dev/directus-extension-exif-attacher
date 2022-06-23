#! /usr/bin/env node
const { exec } = require('child_process');
const { loadConfigAndRun, generateExifDataModelsFile } = require('../src/config');

const buildCommand = `cd node_modules/exif-data-models && npm run install-hook-from-package`;

loadConfigAndRun(async () => {
  await generateExifDataModelsFile();

  console.log('>', buildCommand, `\n`);
  console.log('Building hook...');
  exec(buildCommand, (err, stdout, stderr) => {
    if (err) {
      console.error(`---------- ERROR -----------`);
      console.error(err);
    } else {
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
      console.log(stdout);

      if (stderr.includes('✔ Done')) {
        console.log(`Success!\n`);
        console.log(`Don't forget to restart your Directus.`);
      } else {
        console.error(`---------- ERROR -----------`);
        console.log('ERROR:', stderr);
      }
    }
  });
});
