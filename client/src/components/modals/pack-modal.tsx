import * as AlertDialog from '@radix-ui/react-alert-dialog'
import css from './modal.module.scss'
import CardList from 'components/card-list'
import {useSelector} from 'react-redux'
import {getCards, getLastRollResult, getLibrary} from 'logic/cards/cards-selectors'
import {getFullCardsFromPartial} from 'common/functions/daily-shop'

type Props = {
	setOpen: boolean
	onClose: (isOpen: boolean) => void
}

export const PackModal = ({setOpen, onClose}: Props) => {
	const library = useSelector(getLibrary)
	const cards = useSelector(getCards)
	const lastRolledCards = useSelector(getLastRollResult)

	return (
		<AlertDialog.Root open={setOpen} onOpenChange={(e) => onClose(e)}>
			<AlertDialog.Portal container={document.getElementById('root')}>
				<AlertDialog.Overlay className={css.overlay} />
				<AlertDialog.Content className={css.content}>
					<AlertDialog.Title className={css.title}>Roll results</AlertDialog.Title>
					<AlertDialog.Description asChild className={css.description}>
						<div className={css.cardListBox}>
							<CardList
								children={getFullCardsFromPartial(
									lastRolledCards.map((card) => card.card),
									cards
								)}
								displayStyle={'no-description'}
								library={library}
							/>
						</div>
					</AlertDialog.Description>
					<div className={css.buttonContainer}>
						<AlertDialog.Cancel asChild>
							<button>Confirm</button>
						</AlertDialog.Cancel>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}
