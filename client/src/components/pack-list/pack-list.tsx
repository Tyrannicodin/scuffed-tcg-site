import css from './pack-list.module.scss'
import {useEffect} from 'react'
import {PackOptionsT} from 'common/types/cards'
import {PackInfo} from 'components/pack/pack'
import {Pack} from 'common/models/pack'

type Props = {
	children: Pack[]
	discounted: Pack[]
	showDescription: boolean
	onPurchase: ((pack: Pack, options: Array<PackOptionsT>, discounted: boolean) => void) | null
}

export function PackList({children, discounted, showDescription, onPurchase}: Props) {
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
						onPurchase={onPurchase}
						showDescription={showDescription}
						discounted={
							discounted.reduce((acc, curr) => (curr.name === pack.name ? (acc += 1) : acc), 0) +
							(pack.name === 'All Cards Pack' ? 2 : 0)
						}
					/>
				))}
			</ul>
		</div>
	)
}
