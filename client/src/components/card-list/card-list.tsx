import {Card} from 'common/models/card'
import css from './card-list.module.scss'
import {CardInfo} from 'components/card/card'
import {SyntheticEvent, useEffect} from 'react'
import {PartialCardWithCopiesT} from 'common/types/cards'

type Props = {
	children: Card[]
	library: PartialCardWithCopiesT[]
	showDescription: boolean
	scroll?: boolean
	actionButton?: JSX.Element
	onPurchase: ((card: Card) => void) | null
}

export function CardList({children, library, showDescription, actionButton, scroll=true, onPurchase}: Props) {

	return (
		<div className={css.outerContainer} style={{overflowY: scroll ? 'scroll' : 'hidden'}}>
			<ul className={css.cardList}>
				{children.map((card, index) => (
					<CardInfo
						key={index}
						card={card}
						copies={
							library.find(
								(thisCard) =>
									thisCard.card.name === card.name && thisCard.card.rarity === card.rarity
							)?.copies
						}
						onPurchase={onPurchase}
						showDescription={showDescription}
					/>
				))}
			</ul>
		</div>
	)
}
