import CardInfo from "components/card";
import css from './menu.module.scss'

export function MainMenu() {
    return <div className={css.outerContainer}>
        <ul className={css.cardList}>
            <CardInfo name="Tyrannicodin" rarity={'Common'}/>
        </ul>
    </div>
}