import {Card} from 'common/models/card'
import {EffectCard} from 'common/models/effect-card'
import {HermitCard} from 'common/models/hermit-card'
import css from './card.module.scss'
import { HermitAttackTypeT } from 'common/types/cards'

const costColors = [
    "#525252",
    "#ece9e9",
    "#fefa4c",
    "#59e477",
    "#7ff6fa",
    "#c188d1",
]

type Props = {
    card: Card,
}

export function CardInfo({card}: Props) {
    const getType = (card: Card) => {
        if (card.type === 'effect') {
            return (card as EffectCard).category === 'Attachable' ? 'Attach': (card as EffectCard).category
        } else if (card.type === 'hermit') {
            return (card as HermitCard).hermitType
        }
        return ''
    }

    const getAttackDescription = (attack: HermitAttackTypeT) => {
        if (attack.ability) {
            return <><b>{attack.name}</b><p>{attack.ability}</p></>
        }
        return ''
    }
    
    const getDescription = (card: Card) => {
        if (card.type === 'effect') {
            return (card as EffectCard).description
        } else if (card.type === 'hermit') {
            return <div>
                {getAttackDescription((card as HermitCard).primaryAttack)}
                {getAttackDescription((card as HermitCard).secondaryAttack)}
            </div>
        }
        return ''
    }

    return <div className={css.outer}>
        <b className={css.cardName}>{card.name}</b>
        <b> {getType(card) as string}</b>
        <p className={css.pack}>■ {card.expansion.name} (Update {card.update}) ■</p>
        <p className={css.rank} style={{color: costColors[card.tokens ? card.tokens : 0]}}>★ {card.tokens ? card.tokens : 0} Tokens ★</p>
        <p className={css.description}>{getDescription(card)}</p>
    </div>
}