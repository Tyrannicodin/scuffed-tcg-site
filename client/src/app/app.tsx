import Login from './login'
import css from './app.module.scss'
import {useSelector} from 'react-redux'
import {getMessage, getShowOtp, getUser} from 'logic/session/session-selectors'
import MainMenu from './menu'
import {useState} from 'react'
import CardBrowser from './cards'
import Shop from './shop'
import Import from './import'
import Trading from './trading'
import OtpEntry from 'components/otp-entry'

export function App() {
	const showOtp = useSelector(getShowOtp)
	const user = useSelector(getUser)
	const message = useSelector(getMessage)

	const [menuSection, setMenuSection] = useState<
		'mainMenu' | 'browser' | 'shop' | 'trading' | 'import'
	>('mainMenu')

	const router = () => {
		if (showOtp) {
			return <>
				<h3 className={css.text_info}>Enter OTP</h3>
				<OtpEntry>6</OtpEntry>
				<p id={css.message}>{message}</p>
			</>
		}
		if (user?.authed && user?.secret) {
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
