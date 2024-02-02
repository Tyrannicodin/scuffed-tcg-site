import css from './pack.module.scss'
import classNames from 'classnames'
import {Pack} from 'common/models/pack'
import {getFilters} from 'common/functions/get-filters'
import {PackOptionsT} from 'common/types/cards'
import Dropdown from 'components/dropdown'
import {getCards, getPastPurchases} from 'logic/cards/cards-selectors'
import {useState} from 'react'
import {useSelector} from 'react-redux'

type Props = {
	pack: Pack
	showDescription: boolean
	actionButtonCreator?: (
		pack: Pack,
		options: Array<PackOptionsT>,
		discounted: boolean,
		disabled: boolean
	) => JSX.Element
	discounted: number
}

type DropdownT = {
	dropdownId: string
	option: PackOptionsT
}

export function PackInfo({pack, showDescription, discounted, actionButtonCreator}: Props) {
	const [dropdownSettings, setDropdownSettings] = useState<Array<DropdownT>>([])
	const [finalSettings, setFinalSettings] = useState<Array<PackOptionsT>>([])
	const [disabled, setDisabled] = useState(false)
	const cards = useSelector(getCards)
	const pastPurchases = useSelector(getPastPurchases)

	const amountPurchased = pastPurchases.reduce(
		(acc, curr) => (curr.purchase.name === pack.name ? (acc += 1) : acc),
		0
	)
	const actuallyDiscounted = amountPurchased < discounted && discounted > 0
	const tokenCost = actuallyDiscounted ? Math.floor(pack.tokens / 2) : pack.tokens

	const {expansions, types} = getFilters(cards)

	if (disabled === false && finalSettings.length < pack.maxFilters) setDisabled(true)

	return (
		<div className={css.outer}>
			<div className={classNames(css.card)}>
				<div>
					<b className={css.cardName}>{pack.name}</b>
					<span>
						{' '}
						- {tokenCost} Token
						{tokenCost === 1 ? '' : 's'}
					</span>
				</div>
				<div className={css.rightAligned}></div>
				{actionButtonCreator &&
					actionButtonCreator(pack, finalSettings, actuallyDiscounted, disabled)}
			</div>
			{showDescription && (
				<div className={css.infobox}>
					<div>{pack.description}</div>
					{actuallyDiscounted && (
						<div className={css.discount}>
							{discounted - amountPurchased} discounted pack
							{discounted - amountPurchased !== 1 ? 's' : ''} today!
						</div>
					)}
					{Array(pack.maxFilters)
						.fill('')
						.map((element, index) => (
							<Dropdown
								options={[
									{group: 'Types', value: types},
									{group: 'Expansions', value: expansions},
								]}
								id={'' + index}
								defaultValue={'Select...'}
								action={(option, dropdownId) => {
									const newElement: DropdownT = {
										dropdownId: dropdownId,
										option: {
											value: option,
											type: types.includes(option) ? 'hermitType' : 'expansion',
										},
									}
									const newSettings = dropdownSettings
									newSettings.filter((e) => e.dropdownId === dropdownId)
									newSettings.push(newElement)
									setDropdownSettings(newSettings)
									const otherDropdownSetting = dropdownSettings.findLast(
										(e) => e.dropdownId !== dropdownId
									)

									const newFinalSettings = [newElement.option]
									if (otherDropdownSetting) newFinalSettings.push(otherDropdownSetting.option)
									setFinalSettings(newFinalSettings)
									const roll = cards.filter((card) => pack.filter(card, newFinalSettings))
									if (roll.length === 0) {
										setDisabled(true)
									} else {
										setDisabled(false)
									}
								}}
							/>
						))}
				</div>
			)}
		</div>
	)
}
