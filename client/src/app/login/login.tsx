import {TextInput} from 'components/text-input'
import css from './login.module.scss'
import {useDispatch} from 'react-redux'
import {useState} from 'react'

export function Login() {
	const dispatch = useDispatch()

	const [usernameField, setUsernameField] = useState('')
	const [passwordField, setPasswordField] = useState('')

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
				password: passwordField,
			},
		})
	}

	return (
		<div className={css.container}>
			<input
				id={css.username}
				type="username"
				placeholder="Username"
				onChange={(e) => setUsernameField(e.target.value)}
			/>
			<input
				id={css.password}
				type="password"
				placeholder="Password"
				onChange={(e) => setPasswordField(e.target.value)}
			/>
			<button id={css.login} onClick={loginAccount}>
				Login
			</button>
			<button id={css.signup} onClick={createAccount}>
				Sign up
			</button>
		</div>
	)
}
