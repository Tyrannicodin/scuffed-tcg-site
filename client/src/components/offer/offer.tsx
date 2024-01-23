import css from './offer.module.scss'

type Props = {
	children: string
}

export function Offer({children}: Props) {
	return <div className={css.offer}>{children}</div>
}
