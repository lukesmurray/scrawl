import { restore, serializeAsJSON } from '@excalidraw/excalidraw'
import { ImportedDataState } from '@excalidraw/excalidraw/types/data/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { AppState as ExcalidrawAppState } from '@excalidraw/excalidraw/types/types'

const LOCAL_STORAGE_KEY = 'scrawl'

export function urlBasedLocalStorageKey() {
  return `${LOCAL_STORAGE_KEY}-${urlKey()}`
}

export function urlKey() {
  return `${window.location.toString()}`
}

export function saveToLocalStorage(
  localStorageKey: string,
  elements: readonly ExcalidrawElement[],
  appState: ExcalidrawAppState,
) {
  localStorage.setItem(localStorageKey, serializeAsJSON(elements, appState))
}

export function loadFromLocalStorage(
  localStorageKey: string,
): ImportedDataState {
  const dataState = localStorage.getItem(localStorageKey)

  const restoredDataState = restore(
    dataState === null ? dataState : JSON.parse(dataState),
    undefined,
    undefined,
  )
  // make the background transparent so you can see the page behind the drawing
  restoredDataState.appState.viewBackgroundColor = 'transparent'
  return restoredDataState
}
