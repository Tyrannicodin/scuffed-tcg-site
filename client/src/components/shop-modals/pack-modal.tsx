import * as AlertDialog from '@radix-ui/react-alert-dialog'
import css from './modal.module.scss'

type Props = {
	setOpen: boolean
	onClose: (isOpen: boolean) => void
}

export const PackModal = ({setOpen, onClose}: Props) => {
	console.log('packModal')
	return (
		<AlertDialog.Root open={setOpen} onOpenChange={(e) => onClose(e)}>
			<AlertDialog.Portal container={document.getElementById('modal')}>
				<AlertDialog.Overlay className={css.AlertDialogOverlay} />
				<AlertDialog.Content className={css.AlertDialogContent}>
					<AlertDialog.Title className={css.AlertDialogTitle}>
						Modal title
						<AlertDialog.Cancel asChild>
							<button className={css.xClose}>
								<img src="/images/CloseX.svg" alt="close" />
							</button>
						</AlertDialog.Cancel>
					</AlertDialog.Title>
					<AlertDialog.Description asChild className={css.AlertDialogDescription}>
						<div>The sussiest sus</div>
					</AlertDialog.Description>
					<div className={css.buttonContainer}>
						<button>Among Us</button>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}
