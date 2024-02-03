import {Card} from 'common/models/card'
import css from './card-list.module.scss'
import {CardInfo} from 'components/card/card'
import {PartialCardWithCopiesT} from 'common/types/cards'

type Props = {
	children: Card[]
	library: PartialCardWithCopiesT[]
	displayStyle: 'full' | 'no-description' | 'mini'
	scroll?: boolean
	onClick?: (card: Card, key: number) => void
	actionButtonCreator?: (card: Card) => JSX.Element
}

export function CardList({
	children,
	library,
	displayStyle,
	onClick,
	actionButtonCreator,
	scroll = true,
}: Props) {
	return (
		<div className={css.outerContainer} style={{overflowY: scroll ? 'scroll' : 'hidden'}}>
			<ul className={css.cardList}>
				{children.map((card, index) => (
					<CardInfo
						onClick={onClick}
						key={index}
						id={index}
						card={card}
						copies={
							library.find(
								(thisCard) =>
									thisCard.card.name === card.name && thisCard.card.rarity === card.rarity
							)?.copies
						}
						actionButtonCreator={actionButtonCreator}
						displayStyle={displayStyle}
					/>
				))}
			</ul>
		</div>
	)
}
