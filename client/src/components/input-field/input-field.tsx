import css from './input-field.module.scss'

type Props = {
	children: string
	type: string
	setField: (arg0: string) => void
}

export function InputField({children, type, setField}: Props) {
	return (
		<input className={css.inputBox} type={type} placeholder={children} onChange={(e) => setField(e.target.value)} />
	)
}
