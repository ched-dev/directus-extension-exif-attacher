# Directus.io EXIF Metadata Attacher Hook

This is a [Hook](https://docs.directus.io/extensions/hooks/) for [Directus.io](https://directus.io) to attach EXIF information from an uploaded image directly to your Data Model.

We built this extension [live on stream](https://www.twitch.tv/videos/1411653279) at [twitch.tv/ched_dev](https://twitch.tv/ched_dev).

## Configurable Options

- [x] Support a single Data Model
- [x] Support multiple Data Models
- [x] Support changing of fields to copy, manipulate data

Default EXIF Fields:
```
dateTaken: DateTime;
cameraMake: string;
cameraModel: string;
iso: number;
exposure: number;
aperture: number;
focalLength: number;
focalLengthIn35mm: number;
lensMake: string;
lensModel: string;
// coming soon
gps: Point;
```

## Setup in your Directus installation

A few steps are needed to setup this hook.

- Create the fields on the Data Model(s) you want to add EXIF data
  - _NOTE: looking into automating this_
- Configure the settings in `src/config.ts`
- Build the extension with `npm run build`
- Copy the content of `dist/index.js` to your Directus project at `extensions/hooks/exif-attacher.js`
- Restart your Directus application

EXIF information should be updated automatically anytime you **create** or **update** the image on the Data Model. Note it only updates when you **save**, not when you select the image.

## Setup for local development

First, clone the repo to your local machine as a sibling folder (parent of your Directus folder):

```sh
git clone https://github.com/ched-dev/directus-extension-exif-attacher
```

Install the dependencies:

```sh
npm install
```

Set up a symlink to have your build loaded into your Directus project. From the parent of your Directus project and extension build, run:

```sh
ln -s directus-project/extensions/hooks/exif-attacher directus-extension-exif-attacher
```

Build the extension, or do a watch build from within the `directus-extension-exif-attacher` folder:

```sh
npm run build
# or to watch for changes
npm run watch
```

Any time you re-build, you will need to restart your local Directus project to load the latest extension changes.

## License

This project is licensed under the [MIT License](LICENSE) and is free for you to fork, use, or change.