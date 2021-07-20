export interface AppState {
  displayShortcut: string | null
  blurRadiusPx: number | null
}

export const defaultAppState: AppState = {
  displayShortcut: 'mod+shift+e',
  blurRadiusPx: 3,
}

export const isAppStateEqual = (a: AppState, b: AppState) => {
  return (
    a.displayShortcut === b.displayShortcut && a.blurRadiusPx === b.blurRadiusPx
  )
}
