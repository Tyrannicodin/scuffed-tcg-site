import CardInfo from "components/card";
import { Card } from "common/models/card";
import css from './menu.module.scss'
import { CardList } from "components/card-list/card-list";

export function MainMenu() {
    const cards: Card[] = []
    return <CardList>{cards}</CardList>
}