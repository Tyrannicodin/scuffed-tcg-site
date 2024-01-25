import {ReactNode} from 'react'
import css from './flex-section.module.scss'

type Props = {
	children: ReactNode
	width: number
	gap?: string
}

export function Section({children, width, gap = '0'}: Props) {
	return (
		<div style={{width: `${width}%`, gap: gap}} className={css.section}>
			{children}
		</div>
	)
}
