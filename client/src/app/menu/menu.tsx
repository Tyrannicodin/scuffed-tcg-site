import CardInfo from 'components/card'
import {Card} from 'common/models/card'
import css from './menu.module.scss'
import {CardList} from 'components/card-list/card-list'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser' | 'shop' | 'trading') => void
}

export function MainMenu({menuSetter}: Props) {
	return (
		<div>
			<div className={css.buttonMenu}>
				<button onClick={() => menuSetter('browser')}>Card Browser</button>
				<button onClick={() => menuSetter('shop')}>Shop</button>
				<button onClick={() => menuSetter('trading')}>Trading Hub</button>
				<div className={css.horizontalButtons}>
					<button className={css.maxWidth}>Import Cards</button>
					<button className={css.maxWidth}>User Settings</button>
				</div>
				<button>Log Out</button>
			</div>
		</div>
	)
}
