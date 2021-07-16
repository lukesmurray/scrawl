import Excalidraw from '@excalidraw/excalidraw'
import { ImportedDataState } from '@excalidraw/excalidraw/types/data/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import {
  AppState,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const SAVE_TO_LOCAL_STORAGE_TIMEOUT = 300
const LOCAL_STORAGE_KEY = 'scrawl'

export default function Content() {
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null)

  const [scrawlVisible, setScrawlVisible] = useState(false)

  const displayScrawlKeyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'S' && e.shiftKey) {
        setScrawlVisible(!scrawlVisible)
      }
    },
    [scrawlVisible],
  )

  useEffect(() => {
    window.addEventListener('keydown', displayScrawlKeyHandler, false)
    return () => {
      window.removeEventListener('keydown', displayScrawlKeyHandler, false)
    }
  }, [displayScrawlKeyHandler])

  const saveDebounced = useMemo(
    () =>
      debounce((elements: readonly ExcalidrawElement[], state: AppState) => {
        saveToLocalStorage(elements, state)
      }, SAVE_TO_LOCAL_STORAGE_TIMEOUT),
    [],
  )

  const onBlur = useCallback(() => {
    saveDebounced.flush()
  }, [saveDebounced])

  useEffect(() => {
    window.addEventListener('unload', onBlur, false)
    window.addEventListener('blur', onBlur, false)
    return () => {
      window.removeEventListener('unload', onBlur, false)
      window.removeEventListener('blur', onBlur, false)
    }
  }, [onBlur])

  const initialData = useMemo(() => loadFromLocalStorage(), [])

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          display: scrawlVisible ? undefined : 'none',
        }}
      >
        <Excalidraw
          ref={excalidrawRef}
          initialData={initialData}
          onChange={(
            elements: readonly ExcalidrawElement[],
            appState: AppState,
          ) => {
            saveDebounced(elements, appState)
          }}
          name={useMemo(() => urlKey(), [])}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
            },
          }}
        />
      </div>
      {window.location.href.endsWith('.pdf') && (
        <div
          style={{
            position: 'fixed',
            right: '3rem',
            bottom: '1rem',
            zIndex: 10000,
          }}
        >
          <button
            onClick={() => {
              setScrawlVisible(!scrawlVisible)
            }}
          >
            {`${scrawlVisible ? `Hide` : `Show`} Scrawl`}
          </button>
        </div>
      )}
    </>
  )
}

function localStorageKey() {
  return `${LOCAL_STORAGE_KEY}-${urlKey()}`
}

function urlKey() {
  return `${window.location.toString()}`
}

function localStorageElementsKey() {
  return `${localStorageKey()}-elements`
}

function localStorageAppStateKey() {
  return `${localStorageKey()}-appState`
}

function saveToLocalStorage(
  elements: readonly ExcalidrawElement[],
  appState: AppState,
) {
  localStorage.setItem(
    localStorageElementsKey(),
    // JSON.stringify(clearElementsForLocalStorage(elements)),
    JSON.stringify(elements),
  )
  localStorage.setItem(
    localStorageAppStateKey(),
    // JSON.stringify(clearAppStateForLocalStorage(appState)),
    JSON.stringify(appState),
  )
}

function loadFromLocalStorage(): ImportedDataState {
  const localElements = localStorage.getItem(localStorageElementsKey())

  // const localAppState = localStorage.getItem(localStorageAppStateKey())

  return {
    elements: localElements !== null ? JSON.parse(localElements) : null,
    appState: { viewBackgroundColor: 'transparent' },
  }
}

export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  timeout: number,
) => {
  let handle = 0
  let lastArgs: T | null = null
  const ret = (...args: T) => {
    lastArgs = args
    clearTimeout(handle)
    handle = window.setTimeout(() => {
      lastArgs = null
      fn(...args)
    }, timeout)
  }
  ret.flush = () => {
    clearTimeout(handle)
    if (lastArgs) {
      const _lastArgs = lastArgs
      lastArgs = null
      fn(..._lastArgs)
    }
  }
  ret.cancel = () => {
    lastArgs = null
    clearTimeout(handle)
  }
  return ret
}
