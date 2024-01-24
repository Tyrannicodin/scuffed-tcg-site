import Login from './login'
import css from './app.module.scss'
import {useSelector} from 'react-redux'
import {getAwaitingCode, getUserSecret} from 'logic/session/session-selectors'
import MainMenu from './menu'
import {useState} from 'react'
import CardBrowser from './cards'
import Shop from './shop'
import Import from './import'

export function App() {
	const awaitingCode = useSelector(getAwaitingCode)
	const userSecret = useSelector(getUserSecret)

	const [menuSection, setMenuSection] = useState<'mainMenu' | 'browser' | 'shop' | 'import'>(
		'mainMenu'
	)

	const router = () => {
		if (!awaitingCode && userSecret) {
			if (menuSection === 'browser') {
				return <CardBrowser menuSetter={setMenuSection} />
			}
			if (menuSection === 'shop') {
				return <Shop menuSetter={setMenuSection} />
			}
			if (menuSection === 'import') {
				return <Import menuSetter={setMenuSection} />
			}
			return <MainMenu menuSetter={setMenuSection} />
		}

		return <Login />
	}

	return <main className={css.main}>{router()}</main>
}
