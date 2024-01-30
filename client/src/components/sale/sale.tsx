import {PartialCardT} from 'common/types/cards'
import css from './sale.module.scss'
import ReactTimeago from 'react-timeago'

type Props = {
	username: string
	card: PartialCardT
	price: number
	copies: number
	timestamp: number
}

export function SaleComponent({username, card, price, copies, timestamp}: Props) {
	return (
		<div className={css.sale}>
			<div className={css.sale_row}>
				<div className={css.sale_name}>
					{card.name} - {card.rarity} x{copies}
				</div>
				<div className={css.cost}>{price} tokens</div>
			</div>
			<div className={css.sale_row}>
				<div>
					Seller: {username}
					<br />
					Listed <ReactTimeago date={timestamp * 1000} />
				</div>
				<button className={css.purchase_button}>Purchase</button>
			</div>
		</div>
	)
}
