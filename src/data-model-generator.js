require("dotenv").config();

const { build } = require("../directus-schema-builder");
const cli = require("inquirer");

/**
 * Turn on debugging options for testing locally
 */
const DEBUGGING = {
  logging: false,
  appendTimestampToDataModel: false
};

// Pull connection info from `.env`
const baseURL = process.env.DIRECTUS_URL;
const email = process.env.DIRECTUS_ADMIN_EMAIL;
const password = process.env.DIRECTUS_ADMIN_PASSWORD;

const EXIF_FIELDS = [
  {
    name: "image",
    required: true,
    buildSchema: (dataModel, field, settings) => dataModel.image(settings.imageFieldName)
  },
  {
    name: "exif_divider",
    required: true,
    buildSchema: (dataModel, field) => {
      return dataModel.field(field.name, "alias", {}, {
        special: ["alias", "no-data"]
      }).interface("presentation-divider", {
        title: "$t:EXIF Fields (Read Only)",
        marginTop: true,
        inlineTitle: true
      }).translation("en-US", "EXIF Fields (Read Only)")
    }
  },
  {
    name: "date_taken",
    buildSchema: (dataModel, field) => dataModel.datetime(field.name).interface("datetime").readonly().width("half")
  },
  {
    name: "camera_make",
    buildSchema: (dataModel, field) => dataModel.string(field.name).interface("input").readonly().width("half")
  },
  {
    name: "camera_model",
    buildSchema: (dataModel, field) => dataModel.string(field.name).interface("input").readonly().width("half")
  },
  {
    name: "iso",
    buildSchema: (dataModel, field) => dataModel.integer(field.name).interface("input").readonly().width("half")
  },
  {
    name: "exposure",
    buildSchema: (dataModel, field) => dataModel.float(field.name).interface("input").readonly().width("half")
  },
  {
    name: "exposure_formatted",
    buildSchema: (dataModel, field) => dataModel.string(field.name).interface("input").readonly().width("half")
  },
  {
    name: "aperture",
    buildSchema: (dataModel, field) => dataModel.float(field.name).interface("input").readonly().width("half")
  },
  {
    name: "focal_length",
    buildSchema: (dataModel, field) => dataModel.float(field.name).interface("input").readonly().width("half")
  },
  {
    name: "focal_length_in_35mm",
    buildSchema: (dataModel, field) => dataModel.float(field.name).interface("input").readonly().width("half")
  },
  {
    name: "lens_make",
    buildSchema: (dataModel, field) => dataModel.string(field.name).interface("input").readonly().width("half")
  },
  {
    name: "lens_model",
    buildSchema: (dataModel, field) => dataModel.string(field.name).interface("input").readonly().width("half")
  },
  {
    name: "gps",
    buildSchema: (dataModel, field) => dataModel.geometryPoint(field.name).interface("map").readonly()
  }
];

if (!baseURL || !email || !password) {
  console.error(`---------- ERROR -----------`);
  console.error(`Error: Environment variables not set. See README.md`);
  process.exit(0);
}

cli.prompt([
  {
    type: "confirm",
    name: "isNew",
    message: "This tool will create a new Data Model with EXIF data fields. Do you wish to continue?",
    default: true
  }
]).then(config => {
  if (config.isNew) {
    exifCreate();
  }
  else {
    console.log('Exiting with no changes made.')
  }
});

async function exifCreate() {
  const { name } = await cli.prompt([
    {
      type: "input",
      name: "name",
      message: "What do you want to name the new Data Model? (Ex: media_library, mediaLibrary)",
      default: "media_library",
      validate(name) {
        return /^[a-zA-Z0-9_]+$/.test(name) ? true : "Alpha-numeric and underscores only";
      },
    }
  ]);

  const { fields } = await cli.prompt([
    {
      type: "checkbox",
      message: "Which fields do you want to include?",
      name: "fields",
      loop: false,
      choices: EXIF_FIELDS.map(field => ({
        ...field,
        checked: true,
        disabled: field.required ? "required" : undefined
      })),
      validate(fields) {
        if (fields.length < 1) {
          return "You must choose at least one topping.";
        }

        return true;
      },
    }
  ]);

  const { imageFieldName } = await cli.prompt([
    {
      type: "input",
      name: "imageFieldName",
      message: "What do you want to name the image field?",
      default: "image",
      validate(name) {
        return /^[a-zA-Z0-9_]+$/.test(name) ? true : "Alpha-numeric and underscores only";
      },
    }
  ]);

  const settings = {
    name: name + (DEBUGGING.appendTimestampToDataModel ? "_" + Date.now() : ""),
    fields,
    imageFieldName
  };

  try {
    await runSchema(settings);

    console.log(`Successfully created \`${settings.name}\` Data Model!`);
    DEBUGGING.logging && console.log(settings);
  } catch (e) {
    console.error(`---------- ERROR -----------`);
    
    if (e.response && e.response.status === 401) {
      console.error(`Error: Authentication values denied.`);
      console.info(`Please double check you have environment variables set correctly.`);
      return;
    }

    console.error(`Error creating \`${settings.name}\` Data Model:`);
    console.error(`>`, e.message);
  }
}

// TO DO
async function exifAttach() {
  console.log("Sorry, not supported yet!");
}

function runSchema(settings) {
  const model = build((builder) => {
    console.log("Creating Data Model:", settings.name);
    const media = builder.collection(settings.name).accountability("all");
    media.icon("image_search");
    // standard fields
    console.log("Adding standard field: id (uuid)");
    media.primary_key("id", "uuid").interface("input").hidden().readonly();
    console.log("Adding standard field: date_created");
    media.date_created("date_created").hidden().readonly().width("half");
    console.log("Adding standard field: user_created");
    media.user_created("user_created").hidden().readonly().width("half");
    console.log("Adding standard field: date_updated");
    media.date_updated("date_updated").hidden().readonly().width("half");
    console.log("Adding standard field: user_updated");
    media.user_updated("user_updated").hidden().readonly().width("half");
    // custom fields
    EXIF_FIELDS.map(field => {
      // skip disabled fields (unless it is required)
      if (!field.required && !settings.fields.includes(field.name)) {
        return;
      }

      if (field.buildSchema && typeof field.buildSchema === "function") {
        console.log("Adding EXIF field:", field.name);
        field.buildSchema(media, field, settings);
      }
    });
    
    // Example of a filler divider field
    // media.field("exif_divider_inline", "alias", {}, {
    //   width: "half",
    //   special: ["alias", "no-data"]
    // }).interface("presentation-divider", {
    //   marginTop: false
    // });
  });

  return model.fetch(baseURL, email, password).then(({ collections, relations }) => {
    if (DEBUGGING.logging) {
      console.log("DEBUG: collections", JSON.stringify(collections, null, 2));
      console.log("DEBUG: relations", JSON.stringify(relations, null, 2));
    }

    if (collections && collections.errors) {
      collections.errors.map(err => {
        throw new Error(err.message);
      });
    }
    if (relations && relations.length) {
      relations.map(relation => {
        if (relation.errors) {
          relation.errors.map(err => {
            throw new Error(err.message);
          });
        }
      });
    }
  });
};
