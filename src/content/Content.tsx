import { loadAppState, subscribeToAppState } from '@/app/chromeStorage'
import Excalidraw from '@excalidraw/excalidraw'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import {
  AppState,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'
import isHotKey from 'is-hotkey'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AppState as ScrawlAppState } from '../app/appState'
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  urlKey,
} from '../app/localStorage'
import { debounce } from '../app/utilities'

const SAVE_TO_LOCAL_STORAGE_TIMEOUT = 300

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
  const [scrawlVisible, setScrawlVisible] = useState(false)

  const [scrawlAppState, setScrawlAppState] = useState<ScrawlAppState | null>(
    null,
  )
  useEffect(() => {
    loadAppState().then((res) => setScrawlAppState(res))
  }, [])
  useEffect(() => {
    return subscribeToAppState((appState) => setScrawlAppState(appState))
  }, [])
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.action === 'updateAppState') {
        setScrawlAppState(message.payload.appState)
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  const displayScrawlKeyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (
        scrawlAppState?.displayShortcut &&
        isHotKey(scrawlAppState?.displayShortcut, e)
      ) {
        setScrawlVisible((scrawlVisible) => !scrawlVisible)
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
  const drawingName = useMemo(() => urlKey(), [])

  return (
    <ThemeProvider
      theme={{
        blurRadiusPx: scrawlAppState?.blurRadiusPx ?? 0,
      }}
    >
      <GlobalStyle />
      {scrawlVisible && (
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
            ref={excalidrawRef}
            initialData={initialData}
            onChange={(
              elements: readonly ExcalidrawElement[],
              appState: AppState,
            ) => {
              saveDebounced(elements, appState)
            }}
            name={drawingName}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: false,
              },
            }}
          />
        </div>
      )}
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
    </ThemeProvider>
  )
}
