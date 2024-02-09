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
		<div className={css.outerContainer}>
			<ul className={css.cardList}>
				{children.map((card, index) => {
					const copies = library.find(
						(thisCard) => thisCard.card.name === card.name && thisCard.card.rarity === card.rarity
					)?.copies
					const previousInDeck = children.slice(0, index).reduce((sum, thisCard) => {
						return (sum += thisCard.name === card.name && thisCard.rarity === card.rarity ? 1 : 0)
					}, 0)
					const valid =
						(copies && previousInDeck >= copies) ||
						(previousInDeck >= 3 && card.type !== 'item') ||
						(previousInDeck >= 1 && card.rarity === 'Mythic')
							? false
							: true
					return (
						<CardInfo
							onClick={onClick}
							key={index}
							id={index}
							card={card}
							validInDeck={valid}
							copies={copies}
							actionButtonCreator={actionButtonCreator}
							displayStyle={displayStyle}
						/>
					)
				})}
			</ul>
		</div>
	)
}
