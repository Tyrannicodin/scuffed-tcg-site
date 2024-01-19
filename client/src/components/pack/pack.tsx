import css from './pack.module.scss'
import classNames from 'classnames'
import {HermitCard} from 'common/models/hermit-card'
import {Pack} from 'common/models/pack'
import {ExpansionT, HermitTypeT, PackOptionsT} from 'common/types/cards'
import Dropdown from 'components/dropdown'
import {getCards} from 'logic/cards/cards-selectors'
import {useState} from 'react'
import {useSelector} from 'react-redux'

type Props = {
	pack: Pack
	showDescription: boolean
	onPurchase: ((pack: Pack, options: Array<PackOptionsT>) => void) | null
}

type DropdownT = {
	dropdownId: string
	option: PackOptionsT
}

export function PackInfo({pack, showDescription, onPurchase}: Props) {
	const [dropdownSettings, setDropdownSettings] = useState<Array<DropdownT>>([])
	const cards = useSelector(getCards)

	const expansions: Set<string> = new Set([])
	const types: Set<string> = new Set([])

	cards.forEach((card) => {
		expansions.add(card.expansion.name)
		if (card.type === 'hermit') {
			types.add((card as HermitCard).hermitType.name)
		}
	})

	//disable some options (maybe this code should be changed later)
	types.delete('Everything')
	types.delete('BDubs')
	types.delete('Miner/Farm')
	expansions.delete('Item Card')

	const packPurchased = () => {
		if (onPurchase === null) return

		const settings: Array<DropdownT> = []
		dropdownSettings.reverse().forEach((setting) => {
			if (settings.some((e) => e.dropdownId === setting.dropdownId)) return
			settings.push(setting)
		})
		dropdownSettings.reverse()

		onPurchase(
			pack,
			settings.map((dropdown) => dropdown.option)
		)
	}

	return (
		<div className={css.outer}>
			<div className={classNames(css.card)}>
				<div>
					<b className={css.cardName}>{pack.name}</b>
					<span>
						{' '}
						- {pack.tokens ? pack.tokens : 0} Token{pack.tokens === 1 ? '' : 's'}
					</span>
				</div>
				<div className={css.rightAligned}></div>
				{Array(pack.maxFilters)
					.fill('')
					.map((element, index) => (
						<Dropdown
							options={[
								{group: 'Types', value: [...types]},
								{group: 'Expansions', value: [...expansions]},
							]}
							id={'' + index}
							action={(option, dropdownId) => {
								const newElement: DropdownT = {
									dropdownId: dropdownId,
									option: {
										value: option,
										type: types.has(option) ? 'hermitType' : 'expansion',
									},
								}
								const newSettings = dropdownSettings
								newSettings.filter((e) => e.dropdownId === dropdownId)
								newSettings.push(newElement)
								setDropdownSettings(newSettings)
							}}
						/>
					))}
				{onPurchase && (
					<button
						onClick={() => packPurchased()}
						className={(css.rightAligned, css.purchaseButton)}
					>
						Buy
					</button>
				)}
			</div>
			{showDescription && <div className={css.infobox}>{pack.description}</div>}
		</div>
	)
}
