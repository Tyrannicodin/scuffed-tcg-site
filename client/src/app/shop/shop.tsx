import CardList from 'components/card-list'
import {getCards, getLibrary, getTokens} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './shop.module.scss'
import {useState} from 'react'
import {Card} from 'common/models/card'
import {packs} from '../../../../common/packs'
import {Pack} from 'common/models/pack'
import PackList from 'components/pack-list'
import PackModal from 'components/shop-modals'
import {PackOptionsT} from 'common/types/cards'
import {getFormattedDate, getDailyShop} from 'common/functions/daily-shop'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'shop') => void
}

export function Shop({menuSetter}: Props) {
	const currentDate = getFormattedDate()

	const dispatch = useDispatch()

	const cards = useSelector(getCards)
	const library = useSelector(getLibrary)
	const tokens = useSelector(getTokens)
	const {rolledPacks, hermitCards, effectCards} = getDailyShop(cards)
	const [showPackModal, setShowPackModal] = useState<boolean>(false)

	const onCardPurchase = (card: Card) => {
		dispatch({
			type: 'CARDS_ROLLED',
			payload: {
				cards: [card],
				metadata: {
					type: 'card',
					purchase: card,
					date: currentDate,
				},
				cost: card.tokens,
			},
		})
		setShowPackModal(true)
	}

	const onPackPurchase = (pack: Pack, options: Array<PackOptionsT>, discounted: boolean) => {
		const results = pack.roll(cards, options)
		dispatch({
			type: 'CARDS_ROLLED',
			payload: {
				cards: results,
				metadata: {
					type: 'pack',
					purchase: {name: pack.name},
					date: currentDate,
				},
				cost: discounted ? Math.floor(pack.tokens / 2) : pack.tokens,
			},
		})
		setShowPackModal(true)
	}

	return (
		<>
			<PackModal setOpen={showPackModal} onClose={() => setShowPackModal(!showPackModal)} />
			<main className={css.main}>
				<div className={css.left}>
					<div className={css.returnArea}>
						<button className={css.backButton} onClick={() => menuSetter('mainMenu')}>
							Back
						</button>
					</div>
					<div className={css.packs}>
						<p>
							Buy packs! - Your tokens: <b>{tokens}</b>
						</p>
					</div>
					<PackList
						children={packs}
						showDescription={true}
						onPurchase={onPackPurchase}
						discounted={rolledPacks}
					/>
				</div>
				<div className={css.right}>
					<div className={css.availableHermits}>
						<p>Daily Hermits!</p>
					</div>
					<CardList
						children={hermitCards}
						showDescription={false}
						onPurchase={onCardPurchase}
						library={library}
					/>
					<div className={css.availableEffects}>
						<p>Daily Effects!</p>
					</div>
					<CardList
						children={effectCards}
						showDescription={false}
						onPurchase={onCardPurchase}
						library={library}
					/>
				</div>
			</main>
		</>
	)
}
