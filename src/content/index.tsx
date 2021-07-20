// define-excalidraw-assets has to be imported before Content
import ReactDOM from 'react-dom'
import '../app/define-excalidraw-assets'
import Content from './Content'

const container = document.createElement('div')
document.documentElement.prepend(container)

ReactDOM.render(<Content />, container)
