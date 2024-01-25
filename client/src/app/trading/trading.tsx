import {Sale} from 'common/models/trade'
import {RarityT} from 'common/types/cards'
import Section from 'components/flex-section'
import SaleComponent from 'components/sale'
import {getSales} from 'logic/cards/cards-selectors'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import css from './trading.module.scss'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'trading') => void
}

export function Trading({menuSetter}: Props) {
	const dispatch = useDispatch()
	const sales = useSelector(getSales)

	const [search, setSearch] = useState('')
	const [rarity, setRarity] = useState<RarityT | 'All'>('All')
	const [minCost, setMinCost] = useState<number | ''>('')
	const [maxCost, setMaxCost] = useState<number | ''>('')

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
		if (minCost && sale.price < minCost) return false
		if (maxCost && sale.price > maxCost) return false
		return true
	}

	const loadSales = () => {
		dispatch({
			type: 'GET_TRADES',
			payload: {},
		})
	}

	return (
		<main>
			<Section width={15}>
				<button onClick={() => menuSetter('mainMenu')}>Back</button>{' '}
				<button onClick={loadSales}>Reload sales</button>
			</Section>
			<Section width={85} gap={'2vh'}>
				<input
					className={css.search_bar}
					value={search}
					placeholder="Search cards..."
					onChange={(e) => setSearch(e.target.value)}
				/>
				{sales
					.filter((sale) => meetsFilter(sale))
					.map((sale) => (
						<SaleComponent
							username={sale.seller}
							card={sale.card}
							price={sale.price}
							timestamp={sale.timestamp}
						/>
					))}
			</Section>
		</main>
	)
}
