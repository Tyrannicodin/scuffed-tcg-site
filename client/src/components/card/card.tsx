import {Card} from 'common/models/card'
import {EffectCard} from 'common/models/effect-card'
import {HermitCard} from 'common/models/hermit-card'
import {ItemCard} from 'common/models/item-card'
import css from './card.module.scss'
import {HermitAttackTypeT} from 'common/types/cards'
import classNames from 'classnames'

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
	displayStyle: 'full' | 'no-description' | 'mini'
	id: number
	validInDeck?: boolean
	onClick?: (card: Card, key: number) => void
	actionButtonCreator?: (card: Card) => JSX.Element
}

export function CardInfo({
	card,
	copies,
	displayStyle,
	id,
	validInDeck,
	onClick,
	actionButtonCreator,
}: Props) {
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
					{attack.name} - {attack.damage} (
					{attack.cost.map((cost, index) => {
						if (index < attack.cost.length - 1) {
							return cost + ', '
						}
						return cost
					})}
					)
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
					<div>
						<b>{(card as HermitCard).health} HP</b>
					</div>
					{getAttackDescription((card as HermitCard).primaryAttack)}
					{getAttackDescription((card as HermitCard).secondaryAttack)}
				</div>
			)
		} else if (card.type === 'item') {
			if (card.name.includes('x2'))
				return <p>Counts as 2 {(card as ItemCard).hermitType.name} items.</p>
			return <p>Counts as a {(card as ItemCard).hermitType.name} item.</p>
		}
		return
	}

	const getCopies = (copies: number | undefined) => {
		if (copies) return 'x' + copies
		return 'x0'
	}

	if (displayStyle === 'mini') {
		return (
			<div className={css.outer}>
				<div
					className={classNames(css.card, css.smallFont, validInDeck ? null : css.invalid)}
					onClick={() => onClick && onClick(card, id)}
				>
					<div>
						<span className={css.rank} style={{color: costColors[card.tokens ? card.tokens : 0]}}>
							{card.tokens}★
						</span>{' '}
						<span>{card.name}</span>
						{getType(card)}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={css.outer}>
			<div
				className={classNames(css.card, card.rarity === 'Mythic' ? css.mythic : null)}
				onClick={() => onClick && onClick(card, id)}
			>
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
				{actionButtonCreator && actionButtonCreator(card)}
			</div>
			{displayStyle === 'full' && <div className={css.infobox}>{getDescription(card)}</div>}
		</div>
	)
}
