import { Card } from "common/models/card"
import css from './card-list.module.scss'
import { CardInfo } from "components/card/card"

type Props = {
    children: Card[]
}

export function CardList({children}: Props) {
    return <div className={css.outerContainer}>
        <ul className={css.cardList}>
            {children.map((card) => <CardInfo card={card} />)}
        </ul>
    </div>
}