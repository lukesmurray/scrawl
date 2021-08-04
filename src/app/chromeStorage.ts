import browser from 'webextension-polyfill'
import { AppState, defaultAppState } from './appState'

const APP_STATE_KEY = 'SCRAWL_APP_STATE'

/**
 * Asynchronously saves the app state
 */
export function saveAppState(appState: AppState): Promise<void> {
  return browser.storage.sync.set({ [APP_STATE_KEY]: appState })
}

/**
 * Asynchronously loads the app state
 */
export function loadAppState(): Promise<AppState> {
  return browser.storage.sync.get([APP_STATE_KEY]).then((result) => {
    return { ...defaultAppState, ...(result[APP_STATE_KEY] ?? {}) }
  })
}

/**
 * Subscribe to changes in the app state.
 * Pass a function which is called whenever the app state changes.
 * Returns a function which cleans up the subscription.
 */
export function subscribeToAppState(
  cb: (appState: AppState) => void,
): () => void {
  const onChangeHandler = (changes: any, namespace: any) => {
    if (namespace === 'sync' && APP_STATE_KEY in changes) {
      const appStateChange = changes[APP_STATE_KEY]
      const newAppState = appStateChange.newValue
      cb(newAppState)
    }
  }

  browser.storage.onChanged.addListener(onChangeHandler)
  return () => {
    browser.storage.onChanged.removeListener(onChangeHandler)
  }
}
