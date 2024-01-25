import Login from './login'
import css from './app.module.scss'
import {useSelector} from 'react-redux'
import {getAwaitingCode, getUserSecret} from 'logic/session/session-selectors'
import MainMenu from './menu'
import {useState} from 'react'
import CardBrowser from './cards'
import Shop from './shop'
import Import from './import'
import Trading from './trading'

export function App() {
	const awaitingCode = useSelector(getAwaitingCode)
	const userSecret = useSelector(getUserSecret)

	const [menuSection, setMenuSection] = useState<
		'mainMenu' | 'browser' | 'shop' | 'trading' | 'import'
	>('mainMenu')

	const router = () => {
		if (!awaitingCode && userSecret) {
			switch (menuSection) {
				case 'browser':
					return <CardBrowser menuSetter={setMenuSection} />
				case 'shop':
					return <Shop menuSetter={setMenuSection} />
				case 'trading':
					return <Trading menuSetter={setMenuSection} />
				case 'import':
					return <Import menuSetter={setMenuSection} />
				default:
					return <MainMenu menuSetter={setMenuSection} />
			}
		}

		return <Login />
	}

	return <main className={css.main}>{router()}</main>
}
