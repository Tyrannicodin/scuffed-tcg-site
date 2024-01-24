import Section from 'components/flex-section'
import Sale from 'components/sale'
import {getSales} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import socket from 'socket'
import store from 'store'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'trading') => void
}

export function Trading({menuSetter}: Props) {
	const dispatch = useDispatch()
	const sales = useSelector(getSales)

	const log = () => {
		dispatch({
			type: 'GET_TRADES',
			payload: {},
		})
	}

	return (
		<main>
			<Section width={15}>
				<button onClick={() => menuSetter('mainMenu')}>back</button>
			</Section>
			<Section width={85}>
				{sales.map((sale) => (
					<Sale username={sale.seller} card={sale.card} price={sale.price} timestamp={0}></Sale>
				))}
			</Section>
			<button onClick={log}>Do something</button>
		</main>
	)
}
