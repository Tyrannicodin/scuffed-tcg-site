import css from './pack.module.scss'
import classNames from 'classnames'
import {Pack} from 'common/models/pack'

type Props = {
	pack: Pack
	showDescription: boolean
	purchasable: boolean
}

export function PackInfo({pack, showDescription, purchasable}: Props) {
	return (
		<div className={css.outer}>
			<div className={classNames(css.card)}>
				<div>
					<b className={css.cardName}>{pack.name}</b>
					<span>
						{' '}
						- {pack.tokens ? pack.tokens : 0} Token{pack.tokens === 1 ? '' : 's'}
					</span>
				</div>
				<div className={css.rightAligned}></div>
				{purchasable && <button className={(css.rightAligned, css.purchaseButton)}>Buy</button>}
			</div>
			{showDescription && <div className={css.infobox}>{pack.description}</div>}
		</div>
	)
}
