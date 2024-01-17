import CardList from 'components/card-list'
import {getCards, getLibrary} from 'logic/cards/cards-selectors'
import {useDispatch, useSelector} from 'react-redux'
import css from './shop.module.scss'
import {useState} from 'react'
import {Card} from 'common/models/card'
import {packs} from '../../../../common/packs'
import {Pack} from 'common/models/pack'
import PackList from 'components/pack-list'
import PackModal from 'components/shop-modals'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'shop') => void
}

const cyrb53 = (str: string, seed: number) => {
	let h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i)
		h1 = Math.imul(h1 ^ ch, 2654435761)
		h2 = Math.imul(h2 ^ ch, 1597334677)
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

	return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

const rand = (str: string, seed: number, max: number) => {
	const hash = cyrb53(str, seed)
	return Math.floor((hash / 9007199254740991) * max)
}

type dailyshopDefs = {
	rolledPacks: Array<Pack>
	hermitCards: Array<Card>
	effectCards: Array<Card>
}

function getDailyShop(cards: Array<Card>): dailyshopDefs {
	const hermitCards = cards.filter((card) => card.type === 'hermit')
	const effectCards = cards.filter((card) => card.type === 'effect')

	const chosenPacks: Array<Pack> = []
	const chosenHermitCards: Array<Card> = []
	const chosenEffectCards: Array<Card> = []

	const date = new Date()
	const timeSeed = date.getUTCFullYear() * 1000 + date.getUTCMonth() * 10 + date.getUTCDay()

	for (var i = 0; i < 14; i++) {
		if (i < 7) {
			chosenPacks.push(packs[rand('packs' + i, timeSeed, packs.length)])
		}

		chosenHermitCards.push(hermitCards[rand('hermit' + i, timeSeed, hermitCards.length)])
		chosenEffectCards.push(effectCards[rand('effect' + i, timeSeed, effectCards.length)])
	}

	return {rolledPacks: chosenPacks, hermitCards: chosenHermitCards, effectCards: chosenEffectCards}
}

export function Shop({menuSetter}: Props) {
	const dispatch = useDispatch()

	const cards = useSelector(getCards)
	const library = useSelector(getLibrary)
	const {rolledPacks, hermitCards, effectCards} = getDailyShop(cards)
	const [showPackModal, setShowPackModal] = useState<boolean>(false)

	const onCardPurchase = (card: Card) => {
		dispatch({
			type: 'CARDS_ROLLED',
			payload: {
				cards: [card],
			},
		})
		setShowPackModal(true)
	}

	const onPackPurchase = (pack: Pack) => {
		const results = pack.roll(cards)
		dispatch({
			type: 'CARDS_ROLLED',
			payload: {
				cards: results,
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
						<p>Buy packs!</p>
					</div>
					<PackList
						children={packs}
						showDescription={true}
						onPurchase={onPackPurchase}
						discounted={[]}
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
