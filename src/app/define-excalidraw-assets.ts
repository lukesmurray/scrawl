/* eslint-disable @typescript-eslint/no-extra-semi */
import browser from 'webextension-polyfill'
;(window as any)['EXCALIDRAW_ASSET_PATH'] = browser.runtime.getURL('')
