#! /usr/bin/env node
// require("dotenv").config();

const { exec } = require('child_process');
const { loadConfigAndRun, generateExifDataModelsFile } = require('../src/config');

// const copyCommand = `cp ${DIST_FILE} ${DIRECTUS_LOCAL_INSTALL_PATH}${DIRECTUS_HOOK_PATH}`;
const buildCommand = `cd node_modules/exif-attacher && npm run install-hook-from-package`;

loadConfigAndRun(async () => {
  // copy JSON config for build source
  await generateExifDataModelsFile()

  console.log('>', buildCommand, `\n`)
  console.log('Building hook...')
  exec(buildCommand, (err, stdout, stderr) => {
    if (err) {
      console.error(`---------- ERROR -----------`);
      console.error(err)
    } else {
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
      console.log(stdout)

      if (stderr.includes('✔ Done')) {
        console.log(`Success!\n`)
        console.log(`Don't forget to restart your Directus.`)
      } else {
        console.error(`---------- ERROR -----------`);
        console.log('ERROR:', stderr)
      }
    }
  });
})
