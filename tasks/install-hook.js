#! /usr/bin/env node
require("dotenv").config();

const { exec } = require('child_process');

const DIRECTUS_LOCAL_INSTALL_PATH = process.env.DIRECTUS_LOCAL_INSTALL_PATH
const DIRECTUS_HOOK_PATH = `/extensions/hooks/exif-attacher/index.js`
const DIST_FILE = `./dist/index.js`;

if (!DIRECTUS_LOCAL_INSTALL_PATH) {
  console.error(`---------- ERROR -----------`);
  console.error(`Error: Environment variables not set. See README.md`);
  process.exit(0);
}

const copyCommand = `cp ${DIST_FILE} ${DIRECTUS_LOCAL_INSTALL_PATH}${DIRECTUS_HOOK_PATH}`;

exec(copyCommand, (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
  }
});

// cp ./dist/index.js $DIRECTUS_LOCAL_INSTALL_PATH/extensions/hooks/exif-attacher/index.js