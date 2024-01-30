import css from './login.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {useState} from 'react'
import InputField from 'components/input-field'
import {getAwaitingCode, getEmail, getMessage} from 'logic/session/session-selectors'
import OtpEntry from 'components/otp-entry'

export function Login() {
	const dispatch = useDispatch()

	const [usernameField, setUsernameField] = useState('')
	const [emailField, setEmailField] = useState('')
	const [passwordField, setPasswordField] = useState('')
	const [confirmPasswordField, setConfirmPasswordField] = useState('')
	const [page, setPage] = useState<'login' | 'signup' | 'forgot'>('login')
	const message = useSelector(getMessage)
	const getCode = useSelector(getAwaitingCode)
	const email = useSelector(getEmail)

	const loginAccount = () => {
		dispatch({
			type: 'LOGIN',
			payload: {
				username: usernameField,
				password: passwordField,
			},
		})
	}
	const createAccount = () => {
		dispatch({
			type: 'SIGNUP',
			payload: {
				username: usernameField,
				email: emailField,
				password: passwordField,
				confirmPassword: confirmPasswordField,
			},
		})
	}

	const messenger = <p id={css.message}>{message}</p>

	let htmlReturn: JSX.Element
	if (getCode) {
		htmlReturn = (
			<div className={css.flexAlign}>
				<h3>OTP sent to {email}</h3>
				<OtpEntry>6</OtpEntry>
				{messenger}
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
				<button className={css.uiItem} onClick={loginAccount}>
					Login
				</button>
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
				<InputField type="email" setField={setEmailField}>
					Email
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
