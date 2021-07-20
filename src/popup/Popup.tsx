import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AppState, isAppStateEqual } from '../app/AppState'
import { loadAppState } from '../app/Storage'

const Popup = () => {
  const [savedAppState, setSavedAppState] = useState<AppState | null>(null)
  const [displayShortcut, setDisplayShortcut] = useState<null | string>(null)
  const [blurRadiusPx, setBlurRadiusPx] = useState<null | number>(null)

  const newAppState = useMemo(
    () => ({
      displayShortcut,
      blurRadiusPx,
    }),
    [blurRadiusPx, displayShortcut],
  )

  useEffect(() => {
    const handleAppStateLoaded = (appState: AppState) => {
      setDisplayShortcut(appState.displayShortcut)
      setBlurRadiusPx(appState.blurRadiusPx)
      setSavedAppState(appState)
    }

    loadAppState().then((res) => handleAppStateLoaded(res))
  }, [])

  // whenever the app state changes update it so the user can try it out
  useEffect(() => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id!, {
          action: 'updateAppState',
          payload: {
            appState: newAppState,
          },
        })
      })
    })
  }, [newAppState])

  return (
    <div>
      <h2>Scrawl</h2>
      {savedAppState === null ? (
        <span>Loading...</span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <div>
            <LabelWrapper htmlFor="display-keyboard-shorcut">
              Keyboard Shortcut
            </LabelWrapper>
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
          </div>
          <div>
            <LabelWrapper htmlFor="blur-radius">
              Blur Radius ({blurRadiusPx}px)
            </LabelWrapper>
            <input
              type="range"
              id="blur-radius"
              min="0"
              max="10"
              step=".1"
              value={blurRadiusPx ?? 0}
              onChange={(e) => setBlurRadiusPx(Number(e.target.value))}
            ></input>
          </div>
          <div>
            <button
              style={{ marginTop: '1rem' }}
              onClick={() => setSavedAppState(newAppState)}
              disabled={isAppStateEqual(savedAppState, newAppState)}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const LabelWrapper = styled.label`
  font-size: 1rem;
`

// make root component exported to meet `isReactRefreshBoundary`
// https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/52cd3a7f2e594fce187d3f1e0c32d201da798376/lib/runtime/RefreshUtils.js#L185
export default Popup
