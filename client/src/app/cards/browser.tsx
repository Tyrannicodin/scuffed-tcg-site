import CardList from 'components/card-list'
import {getCards, getLibrary} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './browser.module.scss'
import {useState} from 'react'
import Dropdown from 'components/dropdown'
import {HermitCard} from 'common/models/hermit-card'
import {getFilters} from 'common/functions/get-filters'
import Section from 'components/flex-section'
import Filter from 'components/filter'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser') => void
}

export function CardBrowser({menuSetter}: Props) {
	const dispatch = useDispatch()
	const cards = useSelector(getCards)
	const library = useSelector(getLibrary)
	const [expansionFilter, setExpansionFilter] = useState('')
	const [rarityFilter, setRarityFilter] = useState('')
	const [typeFilter, setTypeFilter] = useState('')
	const [tokenFilter, setTokenFilter] = useState('')
	const [updateFilter, setUpdateFilter] = useState('')

	const filterOptions = getFilters(cards)

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
		) {
			return false
		}
		if (expansionFilter && card.expansion.name !== expansionFilter) return false
		if (
			typeFilter &&
			(card.type !== 'hermit' || (card as HermitCard).hermitType.name !== typeFilter)
		) {
			return false
		}
		if (rarityFilter && card.rarity !== rarityFilter) return false
		if (tokenFilter && card.tokens?.toString() !== tokenFilter) return false
		if (updateFilter && card.update.toString() !== updateFilter) return false

		return true
	})

	return (
		<main className={css.main}>
			<Section width={15}>
				<button className={css.backButton} onClick={() => menuSetter('mainMenu')}>
					Back
				</button>
				<div>Filters</div>
				<Filter name='Expansion' filterOptions={filterOptions.expansions} defaultFilter='' setFilter={setExpansionFilter} />
				<Filter name='Type' filterOptions={filterOptions.types} defaultFilter='' setFilter={setTypeFilter} />
				<Filter name='Rarity' filterOptions={filterOptions.rarities} defaultFilter='' setFilter={setRarityFilter} />
				<Filter name='Token' filterOptions={filterOptions.tokens} defaultFilter='' setFilter={setTokenFilter} />
				<Filter name='Update' filterOptions={filterOptions.updates} defaultFilter='' setFilter={setUpdateFilter} />
				<div>
					Show only my cards{' '}
					<input type="checkbox" onChange={(e) => setShowOnlyOwned(e.target.checked)}></input>
				</div>
			</Section>
			<Section width={60}>
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
			</Section>
			<Section width={25}>
				<div>Future place of the deck builder</div>
			</Section>
		</main>
	)
}
