import NavBar from 'components/nav/nav'
import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<NavBar default_elements={['Hello', 'Test']} unauthorised={[]} authorised={[]}></NavBar>
	</React.StrictMode>
)
