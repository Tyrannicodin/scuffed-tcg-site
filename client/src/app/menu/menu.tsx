import CardInfo from 'components/card'
import {Card} from 'common/models/card'
import css from './menu.module.scss'
import {CardList} from 'components/card-list/card-list'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser') => void
}

export function MainMenu({menuSetter}: Props) {
	return <button onClick={() => menuSetter('browser')}>Card Browser</button>
}
