import 'styled-components'

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme {
    blurRadiusPx: number
  }
}
