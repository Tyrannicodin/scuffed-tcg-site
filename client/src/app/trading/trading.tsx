import Offer from "components/offer"
import { useDispatch } from "react-redux"

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'trading') => void
}

export function Trading({menuSetter}: Props) {
	const dispatch = useDispatch()

	dispatch({
		type: 'GET_TRADES',
		payload: {}
	})
	return <div><Offer>username: card offering 1 token</Offer><button onClick={()=>menuSetter('mainMenu')}>back</button></div>
}
