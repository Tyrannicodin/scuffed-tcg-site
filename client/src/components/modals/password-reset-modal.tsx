import * as AlertDialog from '@radix-ui/react-alert-dialog'
import css from './modal.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {getMessage} from 'logic/session/session-selectors'
import {useState} from 'react'
import {getPasswordError, validatePassword} from 'common/util/validation'
import {setMessage} from 'logic/session/session-actions'

type Props = {
	isOpen: boolean
	setOpen: (arg0: boolean) => void
}

export function PasswordResetModal({isOpen, setOpen}: Props) {
	const dispatch = useDispatch()
	const message = useSelector(getMessage)
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const startPasswordReset = () => {
		const passwordValid = validatePassword(newPassword, confirmPassword)
		if (passwordValid === 'success') {
			dispatch({
				type: 'RESET_PASSWORD',
				payload: {
					newPassword,
					confirmPassword,
				},
			})
		} else {
			dispatch(setMessage(getPasswordError(passwordValid)))
		}
	}

	return (
		<AlertDialog.Root open={isOpen} onOpenChange={(e) => setOpen(!isOpen)}>
			<AlertDialog.Portal container={document.getElementById('root')}>
				<AlertDialog.Overlay className={css.overlay} />
				<AlertDialog.Content className={css.content}>
					<AlertDialog.Title className={css.title}>Enter new password</AlertDialog.Title>
					<AlertDialog.Description asChild className={css.description}>
						<div className={css.flex_column}>
							<input
								onChange={(e) => setNewPassword(e.target.value)}
								type="password"
								placeholder="New password"
							/>
							<input
								onChange={(e) => setConfirmPassword(e.target.value)}
								type="password"
								placeholder="Confirm new password"
							/>
							<p id={css.message}>{message}</p>
						</div>
					</AlertDialog.Description>
					<div className={css.buttonContainer}>
						<button onClick={startPasswordReset}>Change password</button>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}
