import {rarityT} from 'common/types/cards'
import css from './card.module.scss'

type Props = {
    name: string,
    rarity: rarityT
}

export function CardInfo({name, rarity}: Props) {
    return <div className={css.outer}><b>{name}</b></div>
}