import { AppState, defaultAppState } from './appState'

const APP_STATE_KEY = 'SCRAWL_APP_STATE'

/**
 * Asynchronously saves the app state
 */
export function saveAppState(appState: AppState): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [APP_STATE_KEY]: appState }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      } else {
        return resolve()
      }
    })
  })
}

/**
 * Asynchronously loads the app state
 */
export function loadAppState(): Promise<AppState> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([APP_STATE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      } else {
        return resolve({ ...defaultAppState, ...(result[APP_STATE_KEY] ?? {}) })
      }
    })
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

  chrome.storage.onChanged.addListener(onChangeHandler)
  return () => {
    chrome.storage.onChanged.removeListener(onChangeHandler)
  }
}
