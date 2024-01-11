import css from './text-input.module.scss'

type Props = {
	children: string
	id: string
}

export function TextInput({children, id = ''}: Props) {
	return <input id={id} className={css.textInput} placeholder={children} />
}
