import {ReactNode} from 'react'
import css from './flex-section.module.scss'

type Props = {
	children: ReactNode
	width: number
}

export function Section({children, width}: Props) {
	return (
		<div style={{width: `${width}%`}} className={css.section}>
			{children}
		</div>
	)
}
