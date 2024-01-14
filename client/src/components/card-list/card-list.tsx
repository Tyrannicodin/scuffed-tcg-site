import {Card} from 'common/models/card'
import css from './card-list.module.scss'
import {CardInfo} from 'components/card/card'
import { SyntheticEvent, useEffect } from 'react'

type Props = {
	cards: Card[]
}

export function CardList({cards}: Props) {
	const handleScroll = () => {
		const scrollpos = window.scrollY
		console.log(scrollpos)
	}

	useEffect(() => {
	    window.addEventListener('scroll', handleScroll, { passive: true });
	
	    return () => {
	        window.removeEventListener('scroll', handleScroll);
	    };
	}, []);

	return (
		<div className={css.outerContainer}>
			<ul onScrollCapture={handleScroll} className={css.cardList}>
				{cards.map((card, index) => (
					<CardInfo key={index} card={card} />
				))}
			</ul>
		</div>
	)
}
