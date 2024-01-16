import {Card} from 'common/models/card'
import css from './card-list.module.scss'
import {CardInfo} from 'components/card/card'
import {SyntheticEvent, useEffect} from 'react'
import {PartialCardWithCopiesT} from 'common/types/cards'

type Props = {
	children: Card[]
	library: PartialCardWithCopiesT[]
}

export function CardList({children, library}: Props) {
	const handleScroll = () => {
		const scrollpos = window.scrollY
		console.log(scrollpos)
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, {passive: true})

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<div className={css.outerContainer}>
			<ul onScrollCapture={handleScroll} className={css.cardList}>
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
					/>
				))}
			</ul>
		</div>
	)
}
