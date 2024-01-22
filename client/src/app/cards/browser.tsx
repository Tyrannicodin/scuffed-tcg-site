import CardList from 'components/card-list'
import {getCards, getLibrary} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './browser.module.scss'
import {useState} from 'react'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser') => void
}

export function CardBrowser({menuSetter}: Props) {
	const dispatch = useDispatch()
	const cards = useSelector(getCards)
	const library = useSelector(getLibrary)

	console.log(library)

	const [filter, setFilter] = useState<string>('')
	const [showOnlyOwned, setShowOnlyOwned] = useState<boolean>(false)

	cards.sort((a, b) => {
		return a.name.localeCompare(b.name)
	})

	const filteredCards = cards.filter((card) => {
		if (filter !== '' && !card.name.toLowerCase().includes(filter.toLowerCase())) return false
		if (
			showOnlyOwned &&
			!library.some((row) => row.card.name === card.name && row.card.rarity === card.rarity)
		)
			return false
		return true
	})

	return (
		<>
			<main className={css.main}>
				<div className={css.sidebar}>
					<button className={css.backButton} onClick={() => menuSetter('mainMenu')}>
						Back
					</button>
					<div>Filters</div>
					<div>Expansion</div>
					<div>Update</div>
					<div>Type</div>
					<div>Rarity</div>
					<div>Token Cost</div>
					<div>
						Show only my cards{' '}
						<input type="checkbox" onChange={(e) => setShowOnlyOwned(e.target.checked)}></input>
					</div>
				</div>
				<div className={css.cardListContainer}>
					<input
						className={css.searchBar}
						value={filter}
						placeholder="Search cards..."
						onChange={(e) => setFilter(e.target.value)}
					></input>
					<CardList
						children={filteredCards}
						showDescription={true}
						onPurchase={null}
						library={library}
					/>
				</div>
				<div className={css.deckBrowser}>
					<div>Future place of the deck builder</div>
				</div>
			</main>
		</>
	)
}
