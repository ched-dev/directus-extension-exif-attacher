#! /usr/bin/env node
const { loadConfigAndRun } = require('../src/config')
const { createDataModel } = require('../src/data-model-generator')

loadConfigAndRun(async (jsonConfig) => {
  await createDataModel(jsonConfig)
})
