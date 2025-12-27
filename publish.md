# Publishing ChatDB

This document explains how to publish the ChatDB application using Electron Builder.

## Prerequisites
- Ensure you have a valid GitHub Personal Access Token set as `GH_TOKEN` in your environment.
- Install dependencies:
  ```sh
  npm install
  ```

## Build and Publish
Run the following command to build and publish the application:
```sh
npm run publish
```

## Troubleshooting
If you encounter issues, check:
- The correctness of your `quasar.config.js` and `package.json` settings.
- That `GH_TOKEN` is correctly set.
- The `dist` directory contains the expected build files.
