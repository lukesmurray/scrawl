G# Chrome Extension TypeScript Starter

![build](https://github.com/chibat/chrome-extension-typescript-starter/workflows/build/badge.svg)

Chrome Extension, TypeScript and Visual Studio Code

## Prerequisites

- [node + npm](https://nodejs.org/) (Current Version)

## Option

- [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

- TypeScript
- Webpack
- React
- Jest
- Example Code
  - Chrome Storage
  - Options Version 2
  - content script
  - count up badge number
  - background

## Project Structure

- src/typescript: TypeScript source files
- src/assets: static files
- dist: Chrome Extension directory
- dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Import as Visual Studio Code project

...

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Test

`npx jest` or `npm run test`

## Changes

- Had to build excalidraw without sourcemaps so I can use it in a chrome extension
  - [excalidraw build](https://github.com/lukesmurray/excalidraw/tree/luke/no-eval-source-map)
- Had to remove the endings from `mv3-hot-reload`
- The entire app is in the `content` directory in `src`
- The excalidraw assets are in the `dist` directory
- would like to save `appState` in local storage but we're missing `clear...localStorage` calls from excalidraw
- the manifest content-scripts now matches `<all-urls>`
- to run the extension run `yarn run dev:script` and load the `dist` directory
