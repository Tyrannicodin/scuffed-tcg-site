import css from './number-filter.module.scss'

type Props = {
	name: string
	filterValue: number | ''
	setFilter: (arg0: number | '') => void
	minValue?: number | undefined
	maxValue?: number | undefined
	hideX?: boolean | undefined
}

export function NumberFilter({name, filterValue, setFilter, minValue, maxValue, hideX}: Props) {
	return (
		<div>
			{name}
			<div className={css.number_input}>
				<input
					onChange={(e) => setFilter(parseInt(e.target.value))}
					value={filterValue}
					type="number"
					min={minValue}
					max={maxValue}
				/>
				{!hideX ? (
					<button
						onClick={() => {
							setFilter('')
						}}
					>
						X
					</button>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}
