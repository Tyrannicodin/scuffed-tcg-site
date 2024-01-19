import css from './pack-list.module.scss'
import {SyntheticEvent, useEffect} from 'react'
import {PackOptionsT, PartialCardWithCopiesT, PartialPackT} from 'common/types/cards'
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
						discounted={discounted.some((disc) => disc.name === pack.name)}
					/>
				))}
			</ul>
		</div>
	)
}