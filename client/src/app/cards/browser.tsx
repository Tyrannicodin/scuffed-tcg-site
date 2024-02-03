import CardList from 'components/card-list'
import {getCards, getDecks, getLibrary} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './browser.module.scss'
import {useState} from 'react'
import {HermitCard} from 'common/models/hermit-card'
import {getFilters} from 'common/functions/get-filters'
import Section from 'components/flex-section'
import TextFilter from 'components/text-filter'
import DeckList from 'components/deck-list'
import {DeckT} from 'common/types/deck'
import {getFullCardsFromPartial} from 'common/functions/daily-shop'
import {Card} from 'common/models/card'
import {ImportModal} from 'components/modals'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser') => void
}

export function CardBrowser({menuSetter}: Props) {
	const dispatch = useDispatch()
	const cards = useSelector(getCards)
	const library = useSelector(getLibrary)
	const decks = useSelector(getDecks).map((deck) => {
		const newDeck: DeckT = {
			name: deck.name,
			id: deck.id,
			cards: getFullCardsFromPartial(deck.cards, cards),
		}
		return newDeck
	})
	const [expansionFilter, setExpansionFilter] = useState('')
	const [rarityFilter, setRarityFilter] = useState('')
	const [typeFilter, setTypeFilter] = useState('')
	const [tokenFilter, setTokenFilter] = useState('')
	const [updateFilter, setUpdateFilter] = useState('')
	const [currentDeck, setCurrentDeck] = useState<DeckT | null>(null)

	const filterOptions = getFilters(cards)

	const [filter, setFilter] = useState<string>('')
	const [showOnlyOwned, setShowOnlyOwned] = useState<boolean>(false)

	const [showImportModal, setShowImportModal] = useState<boolean>(false)

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

	const onDeckCreate = () => {
		dispatch({
			type: 'CREATE_DECK',
			payload: {
				name: 'New Deck',
			},
		})
		return null
	}

	const onDeckSave = () => {
		if (!currentDeck) return
		dispatch({
			type: 'MODIFY_DECK',
			payload: {
				name: currentDeck.name,
				deck_code: currentDeck.id,
				cards: currentDeck.cards,
			},
		})
		setCurrentDeck(null)
	}

	const onDeckImport = () => {
		setShowImportModal(true)
	}

	const onDeckSelect = (deck: DeckT) => {
		setCurrentDeck(deck)
	}

	const onCardClick = (card: Card, key: number) => {
		if (!currentDeck) return
		const newDeck: DeckT = {
			name: currentDeck.name,
			id: currentDeck.id,
			cards: [...currentDeck.cards, card],
		}
		setCurrentDeck(newDeck)
	}

	const onDeckCardClick = (card: Card, key: number) => {
		if (!currentDeck) return
		currentDeck.cards.splice(key, 1)
		const newDeck: DeckT = {
			name: currentDeck.name,
			id: currentDeck.id,
			cards: currentDeck.cards,
		}
		setCurrentDeck(newDeck)
	}

	return (
		<>
			<ImportModal setOpen={showImportModal} onClose={() => setShowImportModal(!showImportModal)} />
			<main className={css.main}>
				<Section width={15}>
					<button className={css.backButton} onClick={() => menuSetter('mainMenu')}>
						Back
					</button>
					<div>Filters</div>
					<TextFilter
						name="Expansion"
						filterOptions={filterOptions.expansions}
						defaultFilter=""
						setFilter={setExpansionFilter}
					/>
					<TextFilter
						name="Type"
						filterOptions={filterOptions.types}
						defaultFilter=""
						setFilter={setTypeFilter}
					/>
					<TextFilter
						name="Rarity"
						filterOptions={filterOptions.rarities}
						defaultFilter=""
						setFilter={setRarityFilter}
					/>
					<TextFilter
						name="Token"
						filterOptions={filterOptions.tokens}
						defaultFilter=""
						setFilter={setTokenFilter}
					/>
					<TextFilter
						name="Update"
						filterOptions={filterOptions.updates}
						defaultFilter=""
						setFilter={setUpdateFilter}
					/>
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
						displayStyle={'full'}
						library={library}
						onClick={onCardClick}
					/>
				</Section>
				<Section width={25}>
					{currentDeck === null ? (
						<DeckList
							children={decks}
							onDeckCreate={onDeckCreate}
							onDeckImport={onDeckImport}
							onDeckSelect={onDeckSelect}
						/>
					) : (
						<div className={css.deckBuilder}>
							<button onClick={() => setCurrentDeck(null)}>Back</button>
							<input
								className={css.searchBar}
								value={currentDeck.name}
								onChange={(e) => {
									const newDeck: DeckT = {
										name: e.target.value,
										id: currentDeck.id,
										cards: currentDeck.cards,
									}
									setCurrentDeck(newDeck)
								}}
							></input>
							<div>
								<span>{currentDeck.cards.length}/42 Cards</span>
							</div>
							<div className={css.deckBuilderCards}>
								<CardList
									children={currentDeck ? getFullCardsFromPartial(currentDeck.cards, cards) : []}
									displayStyle={'mini'}
									library={library}
									onClick={onDeckCardClick}
								/>
							</div>
							<button onClick={() => onDeckSave()}>Save</button>
						</div>
					)}
				</Section>
			</main>
		</>
	)
}
