import {Card} from 'common/models/card'
import {EffectCard} from 'common/models/effect-card'
import {HermitCard} from 'common/models/hermit-card'
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
}

export function CardInfo({card, copies}: Props) {
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

	return (
		<div className={css.outer}>
			<div className={classNames(css.card, card.rarity === 'Mythic' ? css.mythic : null)}>
				<div>
					<b className={css.cardName}>{card.name}</b>
					{getType(card)}{' '}
					<span style={{color: '#' + card.expansion.color}} className={css.pack}>
						■ {card.expansion.name} (Update {card.update}) ■{' '}
					</span>
					<span className={css.rank} style={{color: costColors[card.tokens ? card.tokens : 0]}}>
						★ {card.tokens ? card.tokens : 0} Tokens ★
					</span>
				</div>
				<div className={css.rightAligned}>{getCopies(copies)}</div>
			</div>
			<div className={css.infobox}>{getDescription(card)}</div>
		</div>
	)
}
