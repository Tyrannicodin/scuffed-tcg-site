import Offer from 'components/offer'
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
		<div>
			<Offer>username: card offering 1 token</Offer>
			<button onClick={log}>Do something</button>
			<button onClick={() => menuSetter('mainMenu')}>back</button>
		</div>
	)
}
