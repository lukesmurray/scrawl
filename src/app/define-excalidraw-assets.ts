/* eslint-disable @typescript-eslint/no-extra-semi */

// make excalidraw use the extension's local assets instead of reaching out to unpkg
;(window as any)['EXCALIDRAW_ASSET_PATH'] = chrome.runtime.getURL('')
