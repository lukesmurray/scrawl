import 'mv3-hot-reload/content'
import ReactDOM from 'react-dom'
// eslint-disable-next-line node/no-unpublished-import
import 'tailwindcss/tailwind.css'

import Content from './Content'

const container = document.createElement('div')
document.documentElement.prepend(container)

ReactDOM.render(<Content />, container)
