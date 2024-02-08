import * as AlertDialog from '@radix-ui/react-alert-dialog'
import css from './modal.module.scss'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getUser} from 'logic/session/session-selectors'

type Props = {
	setOpen: boolean
	onClose: (isOpen: boolean) => void
}

export const ImportModal = ({setOpen, onClose}: Props) => {
	const dispatch = useDispatch()
	const [code, setCode] = useState('')

	const importDeck = () => {
		dispatch({
			type: 'IMPORT_DECK',
			payload: {
				id: code.toLowerCase(),
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
						<div>
							<div>
								To import a deck, all you need to do is supply the deck code of another scuffed
								deck. You cannot import decks from the HC TCG website. This will not override decks
								if you import a deck with the same name of one you already have.
							</div>
							<div>
								<input
									placeholder={'Deck code...'}
									value={code}
									onChange={(e) => setCode(e.target.value)}
									className={css.importBar}
								></input>
							</div>
						</div>
					</AlertDialog.Description>
					<div className={css.buttonContainer}>
						<AlertDialog.Cancel asChild>
							<button onClick={() => importDeck()}>Confirm</button>
						</AlertDialog.Cancel>
						<AlertDialog.Cancel asChild>
							<button className={css.cancelButton}>Cancel</button>
						</AlertDialog.Cancel>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}
