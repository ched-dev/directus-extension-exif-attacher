const defaultExifFields = require("./exifFields");

const JSON_CONFIG_FILENAME = "exif-attacher-config.json";
const DATA_MODELS_CONFIG_PROP = "exif_data_models";

const currentConfig = require("../exif-attacher-config.json");
const exifDataModels = currentConfig && currentConfig.hasOwnProperty(DATA_MODELS_CONFIG_PROP) && currentConfig[DATA_MODELS_CONFIG_PROP];

/**
 * Configuration for each collection and fields to listen to
 * You will need to change the `name` to match your Collection name
 */
const EXIF_COLLECTIONS = exifDataModels.map((dataModel) => ({
  ...dataModel,
  fields: dataModel.fields.map((fieldName) => defaultExifFields.find(exifField => exifField.prop === fieldName))
}))

/**
 * Debugging will `console.log()` data
 */
const DEBUG = true


module.exports = {
  DEBUG,
  JSON_CONFIG_FILENAME,
  DATA_MODELS_CONFIG_PROP,
  EXIF_COLLECTIONS,
  currentConfig,
  exifDataModels
}