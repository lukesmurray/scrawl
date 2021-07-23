export interface AppState {
  displayShortcut: string
  blurRadiusPx: number
  showToggle: boolean
}

export const defaultAppState: AppState = {
  displayShortcut: 'mod+shift+e',
  blurRadiusPx: 3,
  showToggle: false,
}

export const isAppStateEqual = (a: AppState, b: AppState) => {
  // TODO(lukemurray): replace with deep equals
  return (
    a.displayShortcut === b.displayShortcut &&
    a.blurRadiusPx === b.blurRadiusPx &&
    a.showToggle === b.showToggle
  )
}
