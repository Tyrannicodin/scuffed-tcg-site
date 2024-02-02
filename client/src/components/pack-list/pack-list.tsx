import css from './pack-list.module.scss'
import {useEffect} from 'react'
import {PackOptionsT} from 'common/types/cards'
import {PackInfo} from 'components/pack/pack'
import {Pack} from 'common/models/pack'

type Props = {
	children: Pack[]
	discounted: Pack[]
	showDescription: boolean
	actionButtonCreator?: (
		pack: Pack,
		options: Array<PackOptionsT>,
		discounted: boolean,
		disabled: boolean
	) => JSX.Element
}

export function PackList({children, discounted, showDescription, actionButtonCreator}: Props) {
	const handleScroll = () => {
		const scrollpos = window.scrollY
		console.log(scrollpos)
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, {passive: true})

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<div className={css.outerContainer}>
			<ul onScrollCapture={handleScroll} className={css.cardList}>
				{children.map((pack, index) => (
					<PackInfo
						key={index}
						pack={pack}
						actionButtonCreator={actionButtonCreator}
						showDescription={showDescription}
						discounted={discounted.reduce(
							(acc, curr) => (curr.name === pack.name ? (acc += 1) : acc),
							0
						)}
					/>
				))}
			</ul>
		</div>
	)
}
