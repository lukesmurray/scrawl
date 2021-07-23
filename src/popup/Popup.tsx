import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AppState, isAppStateEqual } from '../app/appState'
import { loadAppState } from '../app/chromeStorage'
import { sendMessageToTabs } from '../app/sendMessageToTabs'

const Popup = () => {
  const [savedAppState, setSavedAppState] = useState<AppState | null>(null)
  const [displayShortcut, setDisplayShortcut] = useState<null | string>(null)
  const [showToggle, setShowToggle] = useState<null | boolean>(null)
  const [blurRadiusPx, setBlurRadiusPx] = useState<null | number>(null)

  const newAppState: AppState | null = useMemo(() => {
    if (savedAppState === null) {
      return null
    }
    return {
      displayShortcut: displayShortcut!,
      blurRadiusPx: blurRadiusPx!,
      showToggle: showToggle!,
    }
  }, [blurRadiusPx, displayShortcut, savedAppState, showToggle])

  useEffect(() => {
    const handleAppStateLoaded = (appState: AppState) => {
      setDisplayShortcut(appState.displayShortcut)
      setBlurRadiusPx(appState.blurRadiusPx)
      setShowToggle(appState.showToggle)
      setSavedAppState(appState)
    }

    loadAppState().then((res) => handleAppStateLoaded(res))
  }, [])

  // whenever the app state changes update it so the user can try it out
  useEffect(() => {
    if (newAppState !== null) {
      const message = {
        action: 'updateAppState',
        payload: {
          appState: newAppState,
        },
      }
      sendMessageToTabs(message)
    }
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
            <LabelWrapper htmlFor="show-toggle">Show Toggle</LabelWrapper>
            <input
              type="checkbox"
              checked={showToggle ?? false}
              onChange={(e) => setShowToggle(e.target.checked)}
            ></input>
          </div>
          <div>
            <button
              style={{ marginTop: '1rem' }}
              onClick={() => setSavedAppState(newAppState)}
              disabled={
                !!newAppState && isAppStateEqual(savedAppState, newAppState)
              }
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
