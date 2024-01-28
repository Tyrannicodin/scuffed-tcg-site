import * as AlertDialog from '@radix-ui/react-alert-dialog'
import css from './sale-modal.module.scss'
import CardList from 'components/card-list'
import {useDispatch, useSelector} from 'react-redux'
import {getCards, getLibrary, getTokens} from 'logic/cards/cards-selectors'
import {Card} from 'common/models/card'
import {PartialCardT} from 'common/types/cards'
import {useState} from 'react'
import NumberFilter from 'components/number-filter'
import CardInfo from 'components/card'

type Props = {
	isOpen: boolean
	setOpen: (arg0: boolean) => void
}

export function SaleModal({isOpen, setOpen}: Props) {
	const dispatch = useDispatch()

	const cardsEqual = (card0: PartialCardT, card1: PartialCardT) => {
		return card0.name === card1.name && card0.rarity === card1.rarity
	}
	const getCardCount = (card: Card) =>
		library.find((row) => cardsEqual(row.card, card))?.copies || 0

	const [currentCard, setCurrentCard] = useState<Card>()
	const [listPrice, setListPrice] = useState<number | ''>(0)
	const [listCopies, setListCopies] = useState<number | ''>(1)

	const library = useSelector(getLibrary)
	const cards = useSelector(getCards).filter((card) => {
		return library.some((row) => cardsEqual(row.card, card))
	})
	cards.sort((card0: Card, card1: Card) => getCardCount(card1) - getCardCount(card0))
	const tokens = useSelector(getTokens)

	const listCard = (card: Card) => {
		setCurrentCard(card)
	}

	const listButtonCreator = (card: Card) => {
		return (
			<button className={css.list_button} onClick={() => listCard(card)}>
				Sell
			</button>
		)
	}

	return (
		<AlertDialog.Root open={isOpen} onOpenChange={(e) => setOpen(!isOpen)}>
			<AlertDialog.Portal container={document.getElementById('root')}>
				<AlertDialog.Overlay className={css.overlay} />
				<AlertDialog.Content className={css.content}>
					<AlertDialog.Title className={css.title}>List a card</AlertDialog.Title>
					<AlertDialog.Description asChild className={css.description}>
						{currentCard ? (
							<div>
								<CardInfo
									card={currentCard}
									copies={getCardCount(currentCard)}
									showDescription={true}
								/>
								<NumberFilter
									name="Price"
									filterValue={listPrice}
									setFilter={setListPrice}
									minValue={-tokens}
									hideX
								/>
								<NumberFilter
									name="Copies"
									filterValue={listCopies}
									setFilter={setListCopies}
									minValue={1}
									maxValue={getCardCount(currentCard)}
									hideX
								/>
							</div>
						) : (
							<div className={css.cardListBox}>
								<CardList
									library={library}
									showDescription={false}
									scroll={false}
									actionButtonCreator={listButtonCreator}
								>
									{cards}
								</CardList>
							</div>
						)}
					</AlertDialog.Description>
					<div className={css.buttons}>
						{currentCard ? (
							<>
								<button
									onClick={() => {
										setCurrentCard(undefined)
										setListCopies(0)
										setListPrice(1)
									}}
								>
									Back
								</button>
								<AlertDialog.Action
									onClick={() => {
										dispatch({
											type: 'CREATE_SALE',
											payload: {
												card: currentCard,
												copies: listCopies,
												price: listPrice,
											},
										})
									}}
								>
									List
								</AlertDialog.Action>
							</>
						) : (
							<AlertDialog.Cancel asChild>
								<button className={css.cancel_button}>Cancel</button>
							</AlertDialog.Cancel>
						)}
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}
