type Props = {
	id: string
	children: string
	type: string
	setField: (arg0: string) => void
}

export function InputField({id, children, type, setField}: Props) {
	return (
		<input id={id} type={type} placeholder={children} onChange={(e) => setField(e.target.value)} />
	)
}
