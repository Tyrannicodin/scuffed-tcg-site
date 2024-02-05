import css from './login.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {useState} from 'react'
import InputField from 'components/input-field'
import {getMessage, getTokenSecret} from 'logic/session/session-selectors'
import * as Toggle from '@radix-ui/react-toggle'
import AuthDisplay from 'components/auth-display'
import {sendMsg} from 'logic/socket/socket-saga'

export function Login() {
	const dispatch = useDispatch()

	const [usernameField, setUsernameField] = useState('')
	const [passwordField, setPasswordField] = useState('')
	const [confirmPasswordField, setConfirmPasswordField] = useState('')
	const [persistLogin, setPersistLogin] = useState(false)
	const [page, setPage] = useState<'login' | 'signup' | 'forgot'>('login')
	const message = useSelector(getMessage)
	const secretUrl = useSelector(getTokenSecret)

	const loginAccount = () => {
		dispatch({
			type: 'LOGIN',
			payload: {
				username: usernameField,
				password: passwordField,
				persistLogin,
			},
		})
	}
	const createAccount = () => {
		dispatch({
			type: 'SIGNUP',
			payload: {
				username: usernameField,
				password: passwordField,
				confirmPassword: confirmPasswordField,
			},
		})
	}

	const messenger = <p id={css.message}>{message}</p>

	let htmlReturn: JSX.Element
	if (secretUrl) {
		htmlReturn = (
			<div className={css.flexAlign}>
				<h3>Scan to add to your authenticator app</h3>
				<AuthDisplay />
				<button
					className={css.verify_button}
					onClick={() => sendMsg({type: 'CODE_READY', payload: {}})}
				>
					Verify account
				</button>
			</div>
		)
	} else if (page === 'login') {
		htmlReturn = (
			<div className={css.container}>
				<InputField type="username" setField={setUsernameField}>
					Username
				</InputField>
				<InputField type="password" setField={setPasswordField}>
					Password
				</InputField>
				<div className={css.two_button_container}>
					<button className={css.login_button} onClick={loginAccount}>
						Login
					</button>
					<Toggle.Root
						className={css.toggle_button}
						pressed={persistLogin}
						onPressedChange={setPersistLogin}
					>
						<p>Save login</p>{' '}
						<p className={css.google_symbol}>
							{persistLogin ? 'select_check_box' : 'check_box_outline_blank'}
						</p>
					</Toggle.Root>
				</div>
				<button className={css.uiItem} onClick={() => setPage('signup')}>
					Sign up
				</button>
				{message === '' ? (
					<div id={css.message}>
						<a onClick={() => setPage('forgot')}>Forgot your password?</a>
					</div>
				) : (
					messenger
				)}
			</div>
		)
	} else if (page === 'signup') {
		htmlReturn = (
			<div className={css.container}>
				<InputField type="username" setField={setUsernameField}>
					Username
				</InputField>
				<InputField type="password" setField={setPasswordField}>
					Password
				</InputField>
				<InputField type="password" setField={setConfirmPasswordField}>
					Re-Type password
				</InputField>
				<button className={css.uiItem} onClick={createAccount}>
					Sign up
				</button>
				{message === '' ? (
					<p id={css.message}>
						Returning user? <a onClick={() => setPage('login')}>Log in</a>
					</p>
				) : (
					messenger
				)}
			</div>
		)
	} else if (page === 'forgot') {
		htmlReturn = (
			<div className={css.container}>
				<InputField type="username" setField={setUsernameField}>
					Username
				</InputField>
				<button className={css.uiItem} onClick={loginAccount}>
					Send password reset request
				</button>
				{message === '' ? (
					<div id={css.message}>
						<p>
							Remembered your password? <a onClick={() => setPage('login')}>Log in</a>
						</p>
						<p>
							New? <a onClick={() => setPage('signup')}>Sign up</a>
						</p>
					</div>
				) : (
					messenger
				)}
			</div>
		)
	} else {
		htmlReturn = (
			<div className={css.container}>
				<p>I have no idea how we got here...</p>
				<button onClick={() => setPage('login')}>Go to Login</button>
				{messenger}
			</div>
		)
	}

	return <>{htmlReturn}</>
}
