# Scrawl

**Check it out on the [chrome web store](https://chrome.google.com/webstore/detail/scrawl/egoccpljknghnoighgpjahfekpcnifma)**

<img src="./assets/icon.png" width="300px">

A chrome extension which lets you draw on any web page with excalidraw. ([Video Demo](https://twitter.com/lukesmurray/status/1416173606640443392))


## Local Installation

**The extension is pending review from the Chrome Store.** In the meantime you can run the extension locally by following these steps:

1. `git clone` the repository to your local machine and `cd` into the directory.
2. `yarn install` to install dependencies
3. `yarn start` to run in dev mode with live reloading
4. go to `chrome://extensions/` in your chrome browser.
   - Enable developer mode in the top right
   - Select load unpacked
   - Load the `dist` folder
5. Go to `http://google.com/blank` and press the keyboard shortcut `cmd/ctrl + shift + e` to enable the extension.

## Settings

You can change the extension settings by clicking on the Scrawl icon ![](./dist/images/icon16.png) in the browser toolbar.

## Contributing

Follow the instructions from Local Installation.
Sometimes you will have to reload the app in `chrome://extensions/` if live reloading is not working

### Project Structure

- src/\*: Various parts of the app
- dist: Chrome Extension directory
- dist/js: Generated JavaScript files
- dist/excalidraw-\*: Generated excalidraw assets

### Changes

- Had to build excalidraw without sourcemaps so I can use it in a chrome
  extension in dev mode. Chrome extensions don't allow `eval` of strings as a
  security policy.
  - [excalidraw build](https://github.com/lukesmurray/excalidraw/tree/luke/no-eval-source-map)
