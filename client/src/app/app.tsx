import {Login} from './login'
import css from './app.module.scss'
import { useSelector } from 'react-redux'
import { getAwaitingCode, getUserSecret } from 'logic/session/session-selectors'
import { MainMenu } from './menu'

export function App() {
	return <MainMenu />

	const awaitingCode = useSelector(getAwaitingCode)
	const userSecret = useSelector(getUserSecret)
	
	const router = () => {
		if (!awaitingCode && userSecret) {
			return <MainMenu />
		}

		return <Login />
	}

	return <main className={css.main}>{router()}</main>
}
