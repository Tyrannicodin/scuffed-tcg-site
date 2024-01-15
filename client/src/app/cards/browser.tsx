import CardList from 'components/card-list'
import {getCards} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './browser.module.scss'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser') => void
}

export function CardBrowser({menuSetter}: Props) {
	const dispatch = useDispatch()
	const cards = useSelector(getCards)

	return (
		<>
			<div className={css.header}>
				<button onClick={() => menuSetter('mainMenu')}>Back</button>
			</div>
			<main className={css.main}>
				<div className={css.cardListContainer}>
					<CardList>{cards}</CardList>
				</div>
				<div className={css.deckBrowser}>

				</div>
			</main>
		</>
	)
}
