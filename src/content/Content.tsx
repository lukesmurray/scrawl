import { loadAppState, subscribeToAppState } from '@/app/chromeStorage'
import Excalidraw from '@excalidraw/excalidraw'
import { ImportedDataState } from '@excalidraw/excalidraw/types/data/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import {
  AppState,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'
import isHotKey from 'is-hotkey'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import browser from 'webextension-polyfill'
import { AppState as ScrawlAppState } from '../app/appState'
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  urlBasedLocalStorageKey,
} from '../app/localStorage'
import { debounce } from '../app/utilities'

/**
 * Timeout used to debounce saving the drawing
 */
const SAVE_TO_LOCAL_STORAGE_TIMEOUT = 300

/**
 * function used to create the local storage key
 * abstracted here to allow for alternative implementations
 */
const LOCAL_STORAGE_KEY_STRATEGY = urlBasedLocalStorageKey

/**
 * Global styles applied to blur the background
 */
const GlobalStyle = createGlobalStyle`
  .excalidraw__canvas {
    backdrop-filter: blur(${(props) => props.theme.blurRadiusPx}px);
  }

  .excalidraw.theme--dark {
    background-color: rgba(0, 0, 0, 0.288);
  }
`

export default function Content() {
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null)
  const [scrawlOverlayVisible, setScrawlOverlayVisible] = useState(false)

  const [localStorageKey, setLocalStorageKey] = useState(
    LOCAL_STORAGE_KEY_STRATEGY(),
  )

  const [initialData, setInitialData] = useState<ImportedDataState>(
    loadFromLocalStorage(localStorageKey),
  )

  // TODO(lukemurray): rename AppState to ScrawlSettings to avoid naming confusion with excalidraw app state
  const [scrawlAppState, setScrawlAppState] = useState<ScrawlAppState | null>(
    null,
  )
  useEffect(() => {
    loadAppState().then((res) => setScrawlAppState(res))
  }, [])
  useEffect(() => {
    // handle changes to extension settings synced from other computers
    return subscribeToAppState((appState) => setScrawlAppState(appState))
  }, [])

  const displayScrawlKeyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (
        scrawlAppState?.displayShortcut &&
        isHotKey(scrawlAppState?.displayShortcut, e)
      ) {
        setScrawlOverlayVisible((scrawlVisible) => !scrawlVisible)
      }
    },
    [scrawlAppState?.displayShortcut],
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
        saveToLocalStorage(localStorageKey, elements, state)
      }, SAVE_TO_LOCAL_STORAGE_TIMEOUT),
    [localStorageKey],
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

  useEffect(() => {
    // handle when the url changes
    const handleHistoryUpdated = () => {
      saveDebounced.flush()
      const newLocalStorageKey = LOCAL_STORAGE_KEY_STRATEGY()
      setLocalStorageKey(newLocalStorageKey)
      setInitialData(loadFromLocalStorage(newLocalStorageKey))
    }

    // handle live changes to extension settings passed from background/popup
    const handleUpdateAppState = (message: any) => {
      setScrawlAppState(message.payload.appState)
    }
    const handleMessage = (message: any) => {
      if (message.action === 'updateAppState') {
        handleUpdateAppState(message)
      }
      if (message.action === 'historyUpdated') {
        handleHistoryUpdated()
      }
    }
    browser.runtime.onMessage.addListener(handleMessage)
    return () => browser.runtime.onMessage.removeListener(handleMessage)
  }, [saveDebounced])

  return (
    <ThemeProvider
      theme={{
        blurRadiusPx: scrawlAppState?.blurRadiusPx ?? 0,
      }}
    >
      <GlobalStyle />
      {scrawlOverlayVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
          }}
        >
          <Excalidraw
            key={localStorageKey}
            ref={excalidrawRef}
            initialData={initialData}
            onChange={(
              elements: readonly ExcalidrawElement[],
              appState: AppState,
            ) => {
              saveDebounced(elements, appState)
            }}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: false,
              },
            }}
          />
        </div>
      )}
      {(window.location.href.endsWith('.pdf') ||
        scrawlAppState?.showToggle) && (
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
              setScrawlOverlayVisible(!scrawlOverlayVisible)
            }}
          >
            {`${scrawlOverlayVisible ? `Hide` : `Show`} Scrawl`}
          </button>
        </div>
      )}
    </ThemeProvider>
  )
}
