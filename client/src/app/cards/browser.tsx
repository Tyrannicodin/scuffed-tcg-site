import CardList from 'components/card-list'
import {getCards, getLibrary} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './browser.module.scss'
import {useState} from 'react'
import Dropdown from 'components/dropdown'
import {HermitCard} from 'common/models/hermit-card'
import {getFilters} from 'common/functions/get-filters'

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
		<>
			<main className={css.main}>
				<div className={css.sidebar}>
					<button className={css.backButton} onClick={() => menuSetter('mainMenu')}>
						Back
					</button>
					<div>Filters</div>
					<div>
						<div>Expansion Filter</div>
						<Dropdown
							options={[{group: 'Expansions', value: ['All', ...filterOptions.expansions]}]}
							id={'expansionDropdown'}
							defaultValue={'All'}
							action={(option, dropdownId) => {
								option === 'All' ? setExpansionFilter('') : setExpansionFilter(option)
							}}
						/>
					</div>
					<div>
						<div>Type Filter</div>
						<Dropdown
							options={[{group: 'Types', value: ['All', ...filterOptions.types]}]}
							id={'typeDropdown'}
							defaultValue={'All'}
							action={(option, dropdownId) => {
								option === 'All' ? setTypeFilter('') : setTypeFilter(option)
							}}
						/>
					</div>
					<div>
						<div>Rarity Filter</div>
						<Dropdown
							options={[{group: 'Rarities', value: ['All', ...filterOptions.rarities]}]}
							id={'rarityDropdown'}
							defaultValue={'All'}
							action={(option, dropdownId) => {
								option === 'All' ? setRarityFilter('') : setRarityFilter(option)
							}}
						/>
					</div>
					<div>
						<div>Token Filter</div>
						<Dropdown
							options={[{group: 'Tokens', value: ['All', ...filterOptions.tokens]}]}
							id={'tokenDropdown'}
							defaultValue={'All'}
							action={(option, dropdownId) => {
								option === 'All' ? setTokenFilter('') : setTokenFilter(option)
							}}
						/>
					</div>
					<div>
						<div>Update Filter</div>
						<Dropdown
							options={[{group: 'Updates', value: ['All', ...filterOptions.updates]}]}
							id={'updateDropdown'}
							defaultValue={'All'}
							action={(option, dropdownId) => {
								option === 'All' ? setUpdateFilter('') : setUpdateFilter(option)
							}}
						/>
					</div>
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
