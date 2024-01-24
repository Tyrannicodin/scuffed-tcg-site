import {PartialCardT} from 'common/types/cards'
import css from './sale.module.scss'

type Props = {
	username: string
	card: PartialCardT
	price: number
	timestamp: number
}

const units = [
	{label: 'year', seconds: 31536000},
	{label: 'month', seconds: 2592000},
	{label: 'week', seconds: 604800},
	{label: 'day', seconds: 86400},
	{label: 'hour', seconds: 3600},
	{label: 'minute', seconds: 60},
	{label: 'second', seconds: 1},
]

export function Sale({username, card, price, timestamp}: Props) {
	const relativeTime = (date: string | number | Date) => {
		const time = Math.floor((new Date().valueOf() - new Date(date).valueOf()) / 1000)
		const {interval, unit} = timeDifference(time)
		const suffix = interval === 1 ? '' : 's'
		return `${interval} ${unit}${suffix} ago`
	}

	const timeDifference = (time: number) => {
		for (let {label, seconds} of units) {
			const interval = Math.floor(time / seconds)
			if (interval >= 1) {
				return {
					interval: interval,
					unit: label,
				}
			}
		}
		return {
			interval: 0,
			unit: '',
		}
	}

	return (
		<div className={css.sale}>
			<div className={css.sale_row}>
				<div className={css.sale_name}>
					{card.name} - {card.rarity}
				</div>
				<div className={css.cost}>{price} tokens</div>
			</div>
			<div className={css.sale_row}>
				<div>
					Seller: {username}
					<br />
					Listed {relativeTime(timestamp)}
				</div>
				<button className={css.purchase_button}>Purchase</button>
			</div>
		</div>
	)
}
