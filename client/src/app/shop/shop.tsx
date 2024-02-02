import CardList from 'components/card-list'
import {
	getCards,
	getLibrary,
	getPastPurchases,
	getShop,
	getTokens,
} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './shop.module.scss'
import {useState} from 'react'
import {Card} from 'common/models/card'
import {PACKS} from '../../../../common/packs'
import {Pack} from 'common/models/pack'
import PackList from 'components/pack-list'
import PackModal from 'components/shop-modals'
import {PackOptionsT, PartialCardT} from 'common/types/cards'
import {
	cardSort,
	getFormattedDate,
	getFullCardsFromPartial,
	getFullPackFromPartial,
} from 'common/functions/daily-shop'
import ShopTimer from 'components/shop-timer'
import classNames from 'classnames'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'shop') => void
}

export function Shop({menuSetter}: Props) {
	const currentDate = getFormattedDate()

	const dispatch = useDispatch()

	const cards = useSelector(getCards)
	const library = useSelector(getLibrary)
	const tokens = useSelector(getTokens)
	const pastPurchases = useSelector(getPastPurchases)
	const shop = useSelector(getShop)
	const [showPackModal, setShowPackModal] = useState<boolean>(false)

	const discountedPacks = getFullPackFromPartial(shop.packs)
	const hermitCards = getFullCardsFromPartial(shop.hermitCards, cards)
	const effectCards = getFullCardsFromPartial(shop.effectCards, cards)

	console.log(hermitCards)

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

	const purchaseButtonCreator = (card: Card) => (
		<button
			onClick={() => onCardPurchase(card)}
			disabled={
				card.tokens === null ||
				pastPurchases.some(
					(pur) =>
						pur.type === 'card' &&
						pur.purchase.name === card.name &&
						(pur.purchase as PartialCardT).rarity === card.rarity
				) ||
				tokens < card.tokens
			}
			className={(css.rightAligned, css.purchaseButton)}
		>
			Buy
		</button>
	)

	const packPurchaseButtonCreator = (
		pack: Pack,
		options: Array<PackOptionsT>,
		discounted: boolean
	) => (
		<button
			onClick={() => onPackPurchase(pack, options, discounted)}
			className={(css.rightAligned, css.purchaseButton)}
			disabled={tokens < pack.tokens}
		>
			{discounted ? (
				<span className={classNames(css.discount, css.shadow)}>
					{Math.floor(
						((pack.tokens - (discounted ? Math.floor(pack.tokens / 2) : pack.tokens)) /
							pack.tokens) *
							100
					)}
					% Off!
				</span>
			) : (
				'Buy'
			)}
		</button>
	)

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
							Buy packs! - Your tokens: <b>{tokens}</b> - <ShopTimer />
						</p>
					</div>
					<PackList
						children={PACKS}
						showDescription={true}
						actionButtonCreator={packPurchaseButtonCreator}
						discounted={discountedPacks}
					/>
				</div>
				<div className={css.right}>
					<div className={css.availableHermits}>
						<p>Daily Hermits!</p>
					</div>
					<CardList
						children={hermitCards.sort((a, b) => cardSort(a, b))}
						showDescription={false}
						actionButtonCreator={purchaseButtonCreator}
						library={library}
					/>
					<div className={css.availableEffects}>
						<p>Daily Effects!</p>
					</div>
					<CardList
						children={effectCards.sort((a, b) => cardSort(a, b))}
						showDescription={false}
						actionButtonCreator={purchaseButtonCreator}
						library={library}
					/>
				</div>
			</main>
		</>
	)
}
