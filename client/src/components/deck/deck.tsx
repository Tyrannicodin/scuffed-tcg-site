import {DeckT} from 'common/types/deck'
import css from './deck.module.scss'
import classNames from 'classnames'

type Props = {
	deck: DeckT
	onDeckSelect: (deck: DeckT) => void
}

export function DeckInfo({deck, onDeckSelect}: Props) {
	return (
		<div className={css.outer} onClick={() => onDeckSelect(deck)}>
			<div className={classNames(css.card)}>
				<p>{deck.name}</p>
			</div>
		</div>
	)
}
