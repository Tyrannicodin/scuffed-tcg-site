import * as AlertDialog from "@radix-ui/react-alert-dialog";
import css from './sale-modal.module.scss'
import CardList from "components/card-list";
import { useSelector } from "react-redux";
import { getCards, getLibrary } from "logic/cards/cards-selectors";
import CardInfo from "components/card";
import { Card } from "common/models/card";
import { PartialCardT } from "common/types/cards";

type Props = {
    isOpen: boolean
	setOpen: (arg0: boolean) => void
}

export function SaleModal({isOpen, setOpen}: Props) {
	const cardsEqual = (card0:PartialCardT, card1:PartialCardT) => {return card0.name === card1.name && card0.rarity === card1.rarity}
	const getCardCount = (card:Card) => library.find((row) => cardsEqual(row.card, card))?.copies || 0

	const library = useSelector(getLibrary)
	const cards = useSelector(getCards).filter((card) => {
		return library.some((row) => cardsEqual(row.card, card))
	})
	cards.sort((card0:Card, card1:Card) => getCardCount(card1)-getCardCount(card0))

    return <AlertDialog.Root open={isOpen} onOpenChange={(e) => setOpen(!isOpen)}>
			<AlertDialog.Portal container={document.getElementById('root')}>
				<AlertDialog.Overlay className={css.overlay} />
				<AlertDialog.Content className={css.content}>
					<AlertDialog.Title className={css.title}>List a card</AlertDialog.Title>
					<AlertDialog.Description asChild className={css.description}>
						<div className={css.cardListBox}>
							<CardList library={library} showDescription={false} onPurchase={null} scroll={false}>{cards}</CardList>
						</div>
					</AlertDialog.Description>
					<div className={css.buttons}>
						<AlertDialog.Cancel asChild>
							<button>Confirm</button>
						</AlertDialog.Cancel>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
}