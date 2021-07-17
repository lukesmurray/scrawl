import { useCallback, useEffect, useState } from 'react'
import { AppState } from '../app/AppState'
import { loadAppState, saveAppState } from '../app/Storage'

const Popup = () => {
  const [appStateLoaded, setAppStateLoaded] = useState(false)
  const [displayShortcut, setDisplayShortcut] = useState<null | string>(null)

  const handleAppStateLoaded = useCallback((appState: AppState) => {
    setDisplayShortcut(appState.displayShortcut)
    setAppStateLoaded(true)
  }, [])

  useEffect(() => {
    loadAppState().then((res) => handleAppStateLoaded(res))
  }, [handleAppStateLoaded])

  const handleSaveAppState = useCallback(() => {
    saveAppState({
      displayShortcut,
    })
  }, [displayShortcut])

  return (
    <div>
      <h2>Scrawl</h2>
      {appStateLoaded === null ? (
        <span>Loading...</span>
      ) : (
        <>
          <label htmlFor="display-keyboard-shorcut">Keyboard Shortcut</label>
          <input
            type="text"
            id="display-keyboard-shorcut"
            value={displayShortcut ?? ''}
            onChange={(e) => setDisplayShortcut(e.target.value)}
          ></input>
          <span>
            use{' '}
            <a href="https://github.com/ianstormtaylor/is-hotkey#readme">
              is-hotkey
            </a>{' '}
            syntax
          </span>
          <button style={{ marginTop: '1rem' }} onClick={handleSaveAppState}>
            Save
          </button>
        </>
      )}
    </div>
  )
}

// make root component exported to meet `isReactRefreshBoundary`
// https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/52cd3a7f2e594fce187d3f1e0c32d201da798376/lib/runtime/RefreshUtils.js#L185
export default Popup
