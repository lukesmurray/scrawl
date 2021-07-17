# Scrawl

<img src="./assets/icon.png" width="300px">

A chrome extension which lets you draw on any web page with excalidraw.

## Contributing

To run the extension locally clone the extension to your machine and

1. `yarn install` to install dependencies
2. `yarn start` to run in dev mode with live reloading
3. go to `chrome://extensions/` in your chrome browser.

- Enable developer mode in the top right
- Select load unpacked
- Load the `dist` folder

4. Sometimes you will have to reload the app in `chrome://extensions/` if live reloading is not working

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
