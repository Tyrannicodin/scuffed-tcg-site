import Dropdown from 'components/dropdown'

type Props = {
	name: string
	filterOptions: string[]
	defaultFilter: string
	setFilter: (arg0: string) => void
}

export function TextFilter({name, filterOptions, defaultFilter, setFilter}: Props) {
	return (
		<div>
			<div>{name}</div>
			<Dropdown
				key={0}
				options={[{group: name, value: ['All', ...filterOptions]}]}
				id={`${name.toLowerCase()}Dropdown`}
				defaultValue={'All'}
				action={(option, dropdownId) => {
					option === 'All' ? setFilter(defaultFilter) : setFilter(option)
				}}
			/>
		</div>
	)
}
