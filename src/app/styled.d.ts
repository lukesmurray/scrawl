import 'styled-components'

// theme for styled components used to set global theme props
declare module 'styled-components' {
  export interface DefaultTheme {
    blurRadiusPx: number
  }
}
