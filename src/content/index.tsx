// define-excalidraw-assets has to be the first line
import './define-excalidraw-assets'
import ReactDOM from 'react-dom'
import Content from './Content'
import './content.css'

const container = document.createElement('div')
document.documentElement.prepend(container)

ReactDOM.render(<Content />, container)
