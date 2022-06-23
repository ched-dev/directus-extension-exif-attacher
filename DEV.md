# Setup for local development

First, clone the repo to your local machine as a sibling folder (parent of your Directus folder):

```sh
git clone https://github.com/ched-dev/directus-extension-exif-attacher
```

Install the dependencies:

```sh
npm install
```

Build the extension to generate the latest output:

```sh
npm run build
```

Finally, to load the extension into your Directus project, we'll set up a symlink. Run the following commands: (adjust your folder names as needed)

```sh
cd ../directus-project/extensions/hooks/
ln -s ../../../directus-extension-exif-attacher/dist/ exif-data-models
```

To confirm the extension was installed correctly, you should be able to run your Directus project successfully:

```sh
# from hooks/ directory
cd ../../
npm run start
```

Output similar to:

```
> directus-project@1.0.0 start
> directus start

17:43:34 ✨ Loaded extensions: exif-data-models
17:43:34 ✨ Server started at http://localhost:8055
```

Please note, any time you re-build your extension, you will need to restart your local Directus project to load the latest extension changes. You can actively develop and rebuild the extension with the watch command:

```sh
npm run watch
```