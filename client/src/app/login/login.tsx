import css from './login.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {useState} from 'react'
import {InputField} from 'components/input-field'
import {getAwaitingCode, getEmail, getMessage} from 'logic/session/session-selectors'
import OtpEntry from 'components/otp-entry'

export function Login() {
	const dispatch = useDispatch()

	const [usernameField, setUsernameField] = useState('')
	const [emailField, setEmailField] = useState('')
	const [passwordField, setPasswordField] = useState('')
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
	} else {
		htmlReturn = (
			<div className={css.container}>
				<InputField id={css.username} type="username" setField={setUsernameField}>
					Username
				</InputField>
				<InputField id={css.email} type="email" setField={setEmailField}>
					Email
				</InputField>
				<InputField id={css.password} type="password" setField={setPasswordField}>
					Password
				</InputField>
				<button id={css.login} onClick={loginAccount}>
					Login
				</button>
				<button id={css.signup} onClick={createAccount}>
					Sign up
				</button>
				{messenger}
			</div>
		)
	}

	return <>{htmlReturn}</>
}
