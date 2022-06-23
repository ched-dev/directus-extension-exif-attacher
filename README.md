# Directus.io EXIF Metadata Attacher Hook

This is a [Hook](https://docs.directus.io/extensions/hooks/) for [Directus.io](https://directus.io) to attach EXIF information from an uploaded image directly to your Data Model.

We built this extension [live on stream](https://www.twitch.tv/videos/1411653279) at [twitch.tv/ched_dev](https://twitch.tv/ched_dev).

## Configurable Options

Configuration is stored in `src/config.ts`.

- [x] Support a single Data Model
- [x] Support multiple Data Models
- [x] Support changing of fields to copy, manipulate data

Default EXIF Fields:
```
dateTaken: DateTime;
cameraMake: string;
cameraModel: string;
iso: Integer;
exposure: Float;
exposureFormatted: string;
aperture: Float;
focalLength: Float;
focalLengthIn35mm: Float;
lensMake: string;
lensModel: string;
gps: Point;
```

**NOTE:**  
EXIF information will be updated automatically anytime you **create** or **update** the image on the Data Model. Note it only updates when you **save**, not when you select the image.

## Setup in your Directus installation

A few steps are needed to setup this hook.

### Requirements

- Directus 9.4+ (or later?) locally installed
- node 16+ & npm 8+
- MacOS or Linux (CLI commands need to be fixed for Windows)

_Note: Only tested on Directus 9.4.3_

### One time setup

> Coming Soon: `init` command to run these steps for you

**Step 1**  
Add the following in your `package.json devDependencies` and run `npm install` again:

```js
"exif-data-models": "ched-dev/directus-extension-exif-attacher"
```

**Step 2**  
Create a file in the root of your Directus install `exif-data-models-config.json` with an empty object `{}`.

```sh
cp node_modules/exif-data-models/exif-data-models-config.json exif-data-models-config.json
```

**Step 3**  
Add the following environment variables to your `.env` values with the login information for a user with permissions to create a Data Model. This information is used to automatically create the Data Models for you.

```sh
DIRECTUS_URL=http://localhost:8055/
DIRECTUS_ADMIN_EMAIL=cheddevdev@gmail.com
DIRECTUS_ADMIN_PASSWORD=password
```

**WARNING:**  
These environment variables do not need to be added to your production server. They are only required in the local development environment. DO NOT CHECK THEM IN TO SOURCE CONTROL.

### Create a Data Model with EXIF fields

> Before running this command, your Directus instance needs to be up and running. This step connects to the API to create data models.

We have created a simple command line tool to create the data model for you in your Directus installation. After setting up the environment variables, you can this command to create a new Data Model:

```
npx exif-data-models create
```

You will be prompted for all the required information.

The command will regenerate the hook in your extensions folder. You should track the config and hook files in your source as they are required to run with your Directus instance.

Any time you create a new Data Model through this command, you will need to restart your Directus instance.

```sh
npm start
```

Output should be similar to:

```
> directus-project@1.0.0 start
> directus start

exif-data-models hooks loaded: [ 'media_library' ]
19:26:44 ✨ Loaded extensions: exif-data-models
19:26:44 ✨ Server started at http://localhost:8055
```


## License

This project is licensed under the [MIT License](LICENSE) and is free for you to fork, use, or change.