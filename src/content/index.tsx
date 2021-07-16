import 'mv3-hot-reload/content'
import ReactDOM from 'react-dom'
import Content from './Content'
import './content.css'

const container = document.createElement('div')
document.documentElement.prepend(container)

ReactDOM.render(<Content />, container)
