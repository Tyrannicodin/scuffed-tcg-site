import {DeckT} from 'common/types/deck'
import css from './deck-list.module.scss'
import {DeckInfo} from 'components/deck/deck'

type Props = {
	children: DeckT[]
	onDeckSelect: (deck: DeckT) => void
	onDeckCreate: () => void
	onDeckImport: () => void
}

export function DeckList({children, onDeckCreate, onDeckImport, onDeckSelect}: Props) {
	return (
		<div className={css.deckListSection}>
			<div>My Decks</div>
			<div className={css.outerContainer} style={{overflowY: 'scroll'}}>
				<ul className={css.deckList}>
					{children.map((deck, index) => (
						<DeckInfo key={index} deck={deck} onDeckSelect={onDeckSelect} />
					))}
				</ul>
			</div>
			<div className={css.utilityButtons}>
				<button onClick={() => onDeckCreate()}>New deck</button>
				<button onClick={() => onDeckImport()}>Import deck</button>
			</div>
		</div>
	)
}
