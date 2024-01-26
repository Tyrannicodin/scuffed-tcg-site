import css from './number-filter.module.scss'

type Props = {
	name:string
	filterValue: number | ''
	setFilter: (arg0: number | '') => void
}

export function NumberFilter({name, filterValue, setFilter}: Props) {
    return <div>
		{name}
		<div className={css.number_input}>
			<input onChange={(e) => setFilter(parseInt(e.target.value))} value={filterValue} type="number" />
			<button onClick={() => {
				setFilter('')
			}}>X</button>
		</div>
	</div>
}