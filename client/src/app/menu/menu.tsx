import css from './menu.module.scss'
import { sendMsg } from 'logic/socket/socket-saga'

type Props = {
	menuSetter: (
		arg0: 'mainMenu' | 'browser' | 'shop' | 'trading' | 'import' | 'userSettings'
	) => void
}

export function MainMenu({menuSetter}: Props) {
	return (
		<div>
			<div className={css.buttonMenu}>
				<button onClick={() => menuSetter('browser')}>Card Browser</button>
				<button onClick={() => menuSetter('shop')}>Shop</button>
				<button onClick={() => menuSetter('trading')}>Trading Hub</button>
				<div className={css.horizontalButtons}>
					<button onClick={() => menuSetter('import')} className={css.maxWidth}>
						Import Cards
					</button>
					<button className={css.maxWidth} onClick={() => menuSetter('userSettings')}>
						User settings
					</button>
				</div>
				<button onClick={() => {sendMsg({type: 'LOGOUT'})}}>Log Out</button>
			</div>
		</div>
	)
}
