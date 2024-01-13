import {useState} from 'react'
import css from './nav.module.scss'

type ItemProps = {
	element: string
	hoveredItem: string
	setHoveredItem: (element: string) => void
}

function NavItem({element, hoveredItem, setHoveredItem}: ItemProps) {
	return (
		<li
			className={hoveredItem !== element ? css.navButton : css.navButtonHovered}
			onMouseEnter={() => setHoveredItem(element)}
			onMouseLeave={() => setHoveredItem('')}
			onMouseUp={() => {}}
		>
			{element}
		</li>
	)
}

type Props = {
	default_elements: Array<string>
	unauthorised: Array<string>
	authorised: Array<string>
}

export function NavBar({
	default_elements: defaultElements,
	unauthorised,
	authorised,
}: Props) {
	const [isHovered, setListHovered] = useState(false)
	const [hoveredItem, setHoveredItem] = useState('')

	return (
		<ul
			onMouseEnter={() => setListHovered(true)}
			onMouseLeave={() => setListHovered(false)}
			style={{width: isHovered ? '20%' : '5%'}}
			className={css.navList}
		>
			{defaultElements.map((element) => (
				<NavItem element={element} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />
			))}
		</ul>
	)
}
