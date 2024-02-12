import {Sale} from 'common/models/trade'
import Section from 'components/flex-section'
import SaleComponent from 'components/sale'
import {getCards, getSales} from 'logic/cards/cards-selectors'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import css from './trading.module.scss'
import TextFilter from 'components/text-filter'
import {getFilters} from 'common/functions/get-filters'
import NumberFilter from 'components/number-filter'
import {SaleModal} from 'components/modals'
import {getUser} from 'logic/session/session-selectors'
import VersionLabel from 'components/version-label'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'trading') => void
}

export function Trading({menuSetter}: Props) {
	const dispatch = useDispatch()
	const user = useSelector(getUser)
	const sales = useSelector(getSales)
	const cards = useSelector(getCards)
	const filterOptions = getFilters(cards)

	const [search, setSearch] = useState('')
	const [rarity, setRarity] = useState<string>('All')
	const [minCost, setMinCost] = useState<number | ''>('')
	const [maxCost, setMaxCost] = useState<number | ''>('')
	const [listModalOpen, setListModalOpen] = useState(false)

	const caseInsensitiveIncludes = (name: string, search: string) =>
		name.toLowerCase().includes(search.toLowerCase())

	const meetsFilter = (sale: Sale) => {
		if (
			search !== '' &&
			!caseInsensitiveIncludes(sale.card.name, search) &&
			!caseInsensitiveIncludes(sale.seller, search)
		)
			return false
		if (rarity !== 'All' && sale.card.rarity !== rarity) return false
		if (minCost !== '' && sale.price < minCost) return false
		if (maxCost !== '' && sale.price > maxCost) return false
		return true
	}

	const loadSales = () => {
		dispatch({
			type: 'GET_TRADES',
			payload: {},
		})
	}

	const buySale = (sale: Sale) => {
		dispatch({
			type: 'PURCHASE_SALE',
			payload: {sale},
		})
	}

	return (
		<main>
			<SaleModal setOpen={setListModalOpen} isOpen={listModalOpen} />
			<Section width={15}>
				<button onClick={() => menuSetter('mainMenu')}>Back</button>{' '}
				<button onClick={() => setListModalOpen(true)}>List card</button>
				<button onClick={loadSales}>Reload sales</button>
				<TextFilter
					name="Rarity"
					filterOptions={filterOptions.rarities}
					defaultFilter="All"
					setFilter={setRarity}
				/>
				<NumberFilter name="Minimum cost" filterValue={minCost} setFilter={setMinCost} />
				<NumberFilter name="Maximum cost" filterValue={maxCost} setFilter={setMaxCost} />
			</Section>
			<Section width={85} gap={'2vh'}>
				<input
					className={css.search_bar}
					value={search}
					placeholder="Search cards..."
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className={css.salesContainer}>
					{sales
						.filter((sale) => meetsFilter(sale))
						.map((sale, id) => (
							<SaleComponent
								key={id}
								username={sale.seller}
								card={sale.card}
								price={sale.price}
								copies={sale.copies}
								timestamp={sale.timestamp}
								onPurchase={() => buySale(sale)}
								viewedByOwner={sale.seller === user?.username}
							/>
						))}
				</div>
			</Section>
		</main>
	)
}
