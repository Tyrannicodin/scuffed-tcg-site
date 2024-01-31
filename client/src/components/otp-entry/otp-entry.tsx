import {useRef, useState, KeyboardEvent, MutableRefObject} from 'react'
import css from './otp-entry.module.scss'
import {useDispatch} from 'react-redux'

type Props = {
	children: string
}

export function OtpEntry({children}: Props) {
	const digits = Number.parseInt(children)
	const [otp, setOtp] = useState(new Array(digits).fill(''))
	const otpBoxReference: MutableRefObject<HTMLInputElement[] | null[]> = useRef([])
	const dispatch = useDispatch()

	function handleChange(value: string, index: number) {
		let newArr = [...otp]
		newArr[index] = value
		setOtp(newArr)

		if (newArr.filter((value) => value).length === digits) {
			dispatch({
				type: 'CODE_SUBMIT',
				payload: newArr.join(''),
			})
		}

		if (value && index < digits - 1) {
			const newTarget = otpBoxReference.current[index + 1]
			if (!newTarget) return
			newTarget.focus()
		}
	}

	function handleBackspaceAndEnter(e: KeyboardEvent<HTMLInputElement>, index: number) {
		const nextTarget = otpBoxReference.current[index + 1]
		const previousTarget = otpBoxReference.current[index - 1]
		if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value && previousTarget) {
			previousTarget.focus()
		}
		if (e.key === 'Enter' && (e.target as HTMLInputElement).value && nextTarget) {
			nextTarget.focus()
		}
	}

	return (
		<div className={css.otpDiv}>
			{otp.map((digit, index) => (
				<input
					key={index}
					value={digit}
					maxLength={1}
					onChange={(e) => handleChange(e.target.value, index)}
					onKeyDown={(e) => handleBackspaceAndEnter(e, index)}
					ref={(reference) => (otpBoxReference.current[index] = reference)}
					className={css.otpInput}
				/>
			))}
		</div>
	)
}
