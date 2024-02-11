import {useDispatch, useSelector} from 'react-redux'
import css from './import.module.scss'
import {useState} from 'react'
import {getCards} from 'logic/cards/cards-selectors'
import {PartialCardT, PartialCardWithCopiesT, RarityT} from 'common/types/cards'
import CardList from 'components/card-list'

type Props = {
	menuSetter: (arg0: 'mainMenu' | 'import') => void
}

export function Import({menuSetter}: Props) {
	const dispatch = useDispatch()
	const cards = useSelector(getCards)
	const [importedCards, setImportedCards] = useState<Array<PartialCardWithCopiesT>>([])
	const [tokens, setTokens] = useState(0)

	cards.sort((a, b) => {
		return a.name.localeCompare(b.name)
	})

	const onFileSelected = async (files: FileList | null) => {
		if (!files) return
		if (files.length !== 1) return

		const file = files[0]

		const fileContents = await file.text()

		const rows: Array<PartialCardWithCopiesT> = []

		const cleanFileContents = fileContents.replaceAll('\r', '')

		cleanFileContents.split('\n').forEach((row) => {
			const splitRow = row.split(',')
			if (splitRow.length < 2) return
			if (!splitRow[2]) splitRow[2] === '1'
			if (!cards.some((card) => card.name === splitRow[0] && card.rarity === splitRow[1])) return

			const cardsInList = rows.some((card) => {
				if (card.card.name === splitRow[0] && card.card.rarity === splitRow[1]) {
					card.copies += Number(splitRow[2]) ? Number(splitRow[2]) : 1
					return true
				}
			})

			if (cardsInList) return

			const partialCard: PartialCardWithCopiesT = {
				card: {
					name: splitRow[0],
					rarity: splitRow[1] as RarityT,
				},
				copies: Number(splitRow[2]) ? Number(splitRow[2]) : 1,
			}
			rows.push(partialCard)
		})

		setImportedCards(rows)
	}

	const onCardsImported = () => {
		const cardsFormatted: Array<PartialCardT> = []

		importedCards.forEach((card) => {
			for (var i = 0; i < card.copies; i++) {
				cardsFormatted.push(card.card)
			}
		})

		setImportedCards([])

		dispatch({
			type: 'CARDS_ROLLED',
			payload: {
				cards: cardsFormatted,
				metadata: {
					type: 'import',
					purchase: {name: Math.random.toString()},
					date: 1,
				},
				cost: 0,
			},
		})
	}

	const onTokensAdded = (tokens: number) => {
		dispatch({
			type: 'CARDS_ROLLED',
			payload: {
				cards: [],
				metadata: {
					type: 'import',
					purchase: {name: Math.random.toString()},
					date: 1,
				},
				cost: tokens * -1,
			},
		})
	}

	return (
		<>
			<main className={css.main}>
				<div className={css.returnArea}>
					<button className={css.backButton} onClick={() => menuSetter('mainMenu')}>
						Back
					</button>
				</div>
				<div className={css.importInstructions}>
					<b>How to import cards</b>
					<p>
						First, on your spreadsheet, make sure that the first column is the name of the card, and
						the second column is the rarity of the card. You can also include the number of copies
						in the third column, but this is optional. Besides for that, the order of the rest of
						the columns does not matter.
					</p>
					<p>
						Next, you need to export your sheet as a CSV file. If you're storing your cards on
						google sheets, go to{' '}
						<span className={css.code}>Files → Download → Comma Seperated Values</span> and click.
						This should download the correct file.
					</p>
					<p>
						All you need to do after that is click this button and choose the CSV file you just
						exported:{' '}
						<input
							type="file"
							id="file-input"
							className={css.fileBrowser}
							onChange={(e) => onFileSelected(e.target.files)}
						/>
					</p>
				</div>
				<div className={css.bottom}>
					<div className={css.cardListContainerContainer}>
						<div className={css.cardListContainer}>
							<CardList
								children={cards.filter((card) => {
									return importedCards.some(
										(row) => row.card.name === card.name && row.card.rarity === card.rarity
									)
								})}
								library={importedCards}
								displayStyle={'no-description'}
							/>
						</div>
					</div>
					<div className={css.leftArea}>
						If the imported cards look correct, click this button to import your library into your
						account. <button onClick={() => onCardsImported()}>Import!</button>
						<div>
							<input onChange={(e) => setTokens(Number(e.target.value))}></input>
							<button onClick={(e) => onTokensAdded(tokens)}>Add tokens!</button>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}
