import CardList from 'components/card-list'
import {getCards} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser') => void
}

export function CardBrowser({menuSetter}: Props) {
	const dispatch = useDispatch()
	const cards = useSelector(getCards)

	return (
		<>
			<button onClick={() => menuSetter('mainMenu')}>Back</button>
			<CardList cards={cards}></CardList>
			<button
				onClick={() =>
					dispatch({
						type: 'GET_CARDS',
						payload: {
							cardCount: 50,
						},
					})
				}
			>
				Load more cards
			</button>
		</>
	)
}
