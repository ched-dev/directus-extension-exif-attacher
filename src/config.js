require('dotenv').config()
const fs = require("fs");
const path = require("path");
const defaultExifFields = require("./exifFields");

// Pull connection info from `.env`
const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;
const EXIF_DATA_MODELS_JSON_CONFIG_PATH = process.env.EXIF_DATA_MODELS_JSON_CONFIG_PATH || "./exif-attacher-config.json";
// not user defined
const JSON_CONFIG_DATA_MODELS_PROP = "exif_data_models";
const JSON_BUILD_CONFIG_PATH = path.resolve(__dirname + "/generated-exif-data-models.js");

/**
 * Debugging will `console.log()` extra data
 */
const DEBUG = false

/**
 * Environment values loaded via config
 */
const env = {
  DEBUG,
  DIRECTUS_URL,
  DIRECTUS_ADMIN_EMAIL,
  DIRECTUS_ADMIN_PASSWORD,
  EXIF_DATA_MODELS_JSON_CONFIG_PATH,
  JSON_CONFIG_DATA_MODELS_PROP,
  JSON_BUILD_CONFIG_PATH,
  // remaining vars populated in loadConfigAndRun()
  JSON_CONFIG_FILEPATH: undefined,
  JSON_CONFIG: undefined,
  EXIF_DATA_MODELS: undefined,
  EXIF_DATA_MODEL_NAMES: undefined
}

/**
 * Prompt user for config file, load it, and pass contents to command
 */
async function loadConfigAndRun(runCommand) {
  if (!DIRECTUS_URL || !DIRECTUS_ADMIN_EMAIL || !DIRECTUS_ADMIN_PASSWORD) {
    console.error(`---------- ERROR -----------`);
    console.error(`Error: Environment variables not set. See directus-extension-exif-attacher README.md`);
    process.exit(0);
  }

  if (/\.json$/.test(EXIF_DATA_MODELS_JSON_CONFIG_PATH) === false) {
    console.error(`---------- ERROR -----------`);
    console.error(`Error: \`EXIF_DATA_MODELS_JSON_CONFIG_PATH\` Should be a .json file. See directus-extension-exif-attacher README.md`);
    process.exit(0);
  }

  // save as global
  env.JSON_CONFIG_FILEPATH = path.resolve(process.cwd() + "/" + env.EXIF_DATA_MODELS_JSON_CONFIG_PATH);

  fs.readFile(env.JSON_CONFIG_FILEPATH, async (err, contents) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`---------- ERROR -----------`);
        console.error(`Error: Could not read the JSON file. Confirm the path is correct.`);
        console.log(err);
      }
      else {
        console.error(`---------- ERROR -----------`);
        console.error(err);
      }
      
      process.exit(0);
    }

    try {
      // set as global
      const currentConfig = env.JSON_CONFIG = JSON.parse(contents)

      env.EXIF_DATA_MODELS = currentConfig && currentConfig.hasOwnProperty(env.JSON_CONFIG_DATA_MODELS_PROP) && currentConfig[env.JSON_CONFIG_DATA_MODELS_PROP]

      // TO DO: better schema validation
      if (!Array.isArray(env.EXIF_DATA_MODELS)) {
        console.error(`---------- ERROR -----------`);
        console.error(`Error: JSON config should have an array on \`${env.JSON_CONFIG_DATA_MODELS_PROP}\``);
        process.exit(0);
      }

      env.EXIF_DATA_MODEL_NAMES = env.EXIF_DATA_MODELS.map(model => model.name);

      runCommand()
    } catch (e) {
      console.error(`---------- ERROR -----------`);
      console.error(`Error: Could not read the JSON file. Confirm the path is correct.`);
      console.log(e);
    }
  })
}

/**
 * Save the JSON config to the file
 * @param {json} config JSON object to save to file
 * @returns void
 */
function saveConfigJSON(config) {
  const jsonData = JSON.stringify(config, null, 2);
  return fs.writeFile(env.JSON_CONFIG_FILEPATH, jsonData, (err) => {
    if (err) {
      console.log('ERROR: Could not write config file.');
      return;
    }

    console.log('Updated your JSON config file!');
    env.DEBUG && console.log(config);
  });
}

/**
 * Generates a js file used when we build our hook
 */
function generateExifDataModelsFile() {
  return new Promise((resolve, reject) => {
    const jsData = `// WARNING: This file is auto generated. Do not modify.\nmodule.exports = ${JSON.stringify(env.EXIF_DATA_MODELS, null, 2)}`
    return fs.writeFile(env.JSON_BUILD_CONFIG_PATH, jsData, (err) => {
      if (err) {
        console.log('ERROR: Could not write build config file.');
        reject();
        return;
      }
  
      console.log('Created build file:', env.JSON_BUILD_CONFIG_PATH);
      env.DEBUG && console.log(config);
      resolve()
    });
  })
}

module.exports = {
  loadConfigAndRun,
  saveConfigJSON,
  generateExifDataModelsFile,
  env
}