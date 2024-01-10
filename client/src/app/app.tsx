import {useDispatch} from 'react-redux'
import {Login} from './login'
import css from './app.module.scss'

export function App() {
	useDispatch()

	const router = () => {
		return <Login />
	}

	return <main className={css.main}>{router()}</main>
}
