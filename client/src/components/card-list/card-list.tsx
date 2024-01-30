import {Card} from 'common/models/card'
import css from './card-list.module.scss'
import {CardInfo} from 'components/card/card'
import {PartialCardWithCopiesT} from 'common/types/cards'

type Props = {
	children: Card[]
	library: PartialCardWithCopiesT[]
	showDescription: boolean
	scroll?: boolean
	actionButtonCreator?: (card: Card) => JSX.Element
}

export function CardList({
	children,
	library,
	showDescription,
	actionButtonCreator,
	scroll = true,
}: Props) {
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
						actionButtonCreator={actionButtonCreator}
						showDescription={showDescription}
					/>
				))}
			</ul>
		</div>
	)
}
