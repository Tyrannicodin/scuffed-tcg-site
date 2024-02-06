import * as AlertDialog from '@radix-ui/react-alert-dialog'
import css from './modal.module.scss'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {DeckT} from 'common/types/deck'

type Props = {
	setOpen: boolean
	onClose: (isOpen: boolean) => void
	deck: DeckT
}

export const DeleteModal = ({setOpen, onClose, deck}: Props) => {
	const dispatch = useDispatch()

	const deleteDeck = () => {
		dispatch({
			type: 'DELETE_DECK',
			payload: {
				id: deck.id,
			},
		})
	}

	return (
		<AlertDialog.Root open={setOpen} onOpenChange={(e) => onClose(e)}>
			<AlertDialog.Portal container={document.getElementById('root')}>
				<AlertDialog.Overlay className={css.overlay} />
				<AlertDialog.Content className={css.content}>
					<AlertDialog.Title className={css.title}>Deck Importing</AlertDialog.Title>
					<AlertDialog.Description asChild className={css.description}>
						<span>Are you sure you want to delete "{deck.name}"?</span>
					</AlertDialog.Description>
					<div className={css.buttonContainer}>
						<AlertDialog.Cancel asChild>
							<button onClick={() => deleteDeck()}>Yes</button>
						</AlertDialog.Cancel>
						<AlertDialog.Cancel asChild>
							<button className={css.cancelButton}>No</button>
						</AlertDialog.Cancel>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}
