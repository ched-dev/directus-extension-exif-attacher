require('dotenv').config()
const fs = require("fs");
const path = require("path");
const cli = require("inquirer");
const defaultExifFields = require("./exifFields");

// Pull connection info from `.env`
const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!DIRECTUS_URL || !DIRECTUS_ADMIN_EMAIL || !DIRECTUS_ADMIN_PASSWORD) {
  console.error(`---------- ERROR -----------`);
  console.error(`Error: Environment variables not set. See README.md`);
  process.exit(0);
}

const JSON_CONFIG_DEFAULT_FILENAME = "exif-attacher-config.json";
const JSON_CONFIG_DATA_MODELS_PROP = "exif_data_models";

// /**
//  * Configuration for each collection and fields to listen to
//  * You will need to change the `name` to match your Collection name
//  */
// const EXIF_COLLECTIONS = exifDataModels.map((dataModel) => ({
//   ...dataModel,
//   fields: dataModel.fields.map((fieldName) => defaultExifFields.find(exifField => exifField.prop === fieldName))
// }))

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
  JSON_CONFIG_DEFAULT_FILENAME,
  JSON_CONFIG_DATA_MODELS_PROP,
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
  cli.prompt([
    {
      type: "input",
      name: "filepath",
      message: "Where is your JSON configuration file stored?",
      default: `./${env.JSON_CONFIG_DEFAULT_FILENAME}`,
      validate(name) {
        return /\.json$/.test(name) ? true : "Should be a .json file";
      },
    }
  ]).then(({ filepath }) => {
    // save as global
    env.JSON_CONFIG_FILEPATH = path.resolve(process.cwd() + "/" + filepath);
  
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
  }); 
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

module.exports = {
  loadConfigAndRun,
  saveConfigJSON,
  env
}