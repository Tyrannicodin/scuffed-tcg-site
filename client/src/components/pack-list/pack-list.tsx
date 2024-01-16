import css from './pack-list.module.scss'
import {SyntheticEvent, useEffect} from 'react'
import {PartialCardWithCopiesT} from 'common/types/cards'
import {PackInfo} from 'components/pack/pack'
import {Pack} from 'common/models/pack'

type Props = {
	children: Pack[]
	discounted: PartialCardWithCopiesT[]
	showDescription: boolean
	purchasable: boolean
}

export function PackList({children, discounted, showDescription, purchasable}: Props) {
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
						purchasable={purchasable}
						showDescription={showDescription}
					/>
				))}
			</ul>
		</div>
	)
}
