import css from './menu.module.scss'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'browser' | 'shop' | 'trading' | 'import') => void
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
					<button className={css.maxWidth}>Vouchers</button>
				</div>
				<button>Log Out</button>
			</div>
		</div>
	)
}
