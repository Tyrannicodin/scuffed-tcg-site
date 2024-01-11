import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'

import './index.scss'
import store from 'store'
import {App} from './app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
)
