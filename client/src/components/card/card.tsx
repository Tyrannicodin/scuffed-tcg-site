import {Card} from 'common/models/card'
import {EffectCard} from 'common/models/effect-card'
import {HermitCard} from 'common/models/hermit-card'
import css from './card.module.scss'
import {HermitAttackTypeT, PartialCardT} from 'common/types/cards'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {getPastPurchases} from 'logic/cards/cards-selectors'

const costColors = ['#525252', '#ece9e9', '#fefa4c', '#59e477', '#7ff6fa', '#c188d1']
const effectColors = {
	Attach: '#ffaad4',
	Biome: '#16C100',
	'Single Use': '#f6b26b',
	'Attach/Single Use': '#ff6b6b',
}

type Props = {
	card: Card
	copies: number | undefined
	showDescription: boolean
	onPurchase: ((card: Card) => void) | null
}

export function CardInfo({card, copies, showDescription, onPurchase}: Props) {
	const pastPurchases = useSelector(getPastPurchases)

	const getType = (card: Card) => {
		if (card.type === 'effect') {
			const effectType: 'Attach' | 'Biome' | 'Single Use' | 'Attach/Single Use' =
				(card as EffectCard).category === 'Attachable'
					? 'Attach'
					: ((card as EffectCard).category as 'Biome' | 'Single Use' | 'Attach/Single Use')
			return (
				<b style={{color: effectColors[effectType]}}>
					{' '}
					{card.rarity} {effectType}
				</b>
			)
		} else if (card.type === 'hermit') {
			const hermitType = (card as HermitCard).hermitType
			return (
				<b style={{color: '#' + hermitType.color}}>
					{' '}
					{card.rarity} {hermitType.name}
				</b>
			)
		}
		return ''
	}

	const getAttackDescription = (attack: HermitAttackTypeT) => {
		return (
			<>
				<b>
					{attack.name} - {attack.damage}
				</b>
				<p>{attack.ability}</p>
			</>
		)
	}

	const getDescription = (card: Card) => {
		if (card.type === 'effect') {
			return <p className={css.description}>{(card as EffectCard).description}</p>
		} else if (card.type === 'hermit') {
			return (
				<div className={css.description}>
					{getAttackDescription((card as HermitCard).primaryAttack)}
					{getAttackDescription((card as HermitCard).secondaryAttack)}
				</div>
			)
		} else if (card.type === 'item') {
			return <p>Counts as 2 items.</p>
		}
		return
	}

	const getCopies = (copies: number | undefined) => {
		if (copies) return 'x' + copies
		return 'x0'
	}

	const cardPurchased = () => {
		if (onPurchase === null) return
		onPurchase(card)
	}

	return (
		<div className={css.outer}>
			<div className={classNames(css.card, card.rarity === 'Mythic' ? css.mythic : null)}>
				<div>
					<b className={css.cardName}>{card.name}</b>
					{getType(card)}{' '}
					<span style={{color: '#' + card.expansion.color}} className={css.pack}>
						■ {card.expansion.name} ■{' '}
					</span>
					<span className={css.rank} style={{color: costColors[card.tokens ? card.tokens : 0]}}>
						★ {card.tokens ? card.tokens : 0} Token{card.tokens === 1 ? '' : 's'} ★
					</span>
				</div>
				<div className={css.rightAligned}>{getCopies(copies)}</div>
				{onPurchase && (
					<button
						onClick={() => cardPurchased()}
						disabled={pastPurchases.some(
							(pur) =>
								pur.type === 'card' &&
								pur.purchase.name === card.name &&
								(pur.purchase as PartialCardT).rarity === card.rarity
						)}
						className={(css.rightAligned, css.purchaseButton)}
					>
						Buy
					</button>
				)}
			</div>
			{showDescription && <div className={css.infobox}>{getDescription(card)}</div>}
		</div>
	)
}
