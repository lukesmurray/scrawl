import { loadAppState, subscribeToAppState } from '@/app/Storage'
import Excalidraw, { restore, serializeAsJSON } from '@excalidraw/excalidraw'
import { ImportedDataState } from '@excalidraw/excalidraw/types/data/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import {
  AppState,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'
import isHotKey from 'is-hotkey'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState as ScrawlAppState } from '../app/AppState'
import { debounce } from '../app/utilities'

const SAVE_TO_LOCAL_STORAGE_TIMEOUT = 300
const LOCAL_STORAGE_KEY = 'scrawl'

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
    <>
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
    </>
  )
}

function localStorageKey() {
  return `${LOCAL_STORAGE_KEY}-${urlKey()}`
}

function urlKey() {
  return `${window.location.toString()}`
}

function saveToLocalStorage(
  elements: readonly ExcalidrawElement[],
  appState: AppState,
) {
  localStorage.setItem(localStorageKey(), serializeAsJSON(elements, appState))
}

function loadFromLocalStorage(): ImportedDataState {
  const dataState = localStorage.getItem(localStorageKey())

  const restoredDataState = restore(
    dataState === null ? dataState : JSON.parse(dataState),
    undefined,
    undefined,
  )
  // make the background transparent so you can see the page behind the drawing
  restoredDataState.appState.viewBackgroundColor = 'transparent'
  return restoredDataState
}
