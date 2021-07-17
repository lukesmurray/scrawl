export interface AppState {
  displayShortcut: string | null
}

export const defaultAppState: AppState = {
  displayShortcut: 'mod+shift+e',
}
