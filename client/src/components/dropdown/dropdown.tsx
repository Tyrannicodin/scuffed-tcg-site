import * as Select from '@radix-ui/react-select'
import css from './dropdown.module.scss'
import {useState} from 'react'
import {ExpansionT, HermitTypeT} from 'common/types/cards'

type Group = {group: string; value: Array<string>}

type Options = Array<Group>

type Props = {
	options: Options
	id: string
	defaultValue: string
	action: (option: string, dropdownId: string) => void
}

export function Dropdown({options, id, defaultValue, action}: Props) {
	return (
		<Select.Root onValueChange={(value) => action(value, id)}>
			<Select.Trigger className={css.trigger}>
				<Select.Icon className="SelectIcon">☰ </Select.Icon>
				<Select.Value placeholder={defaultValue} />
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className={css.dropdownBox}>
					<Select.ScrollUpButton className={css.top}>^</Select.ScrollUpButton>
					<Select.Viewport>
						{options.map((group) => {
							return (
								<Select.Group>
									<Select.Label className={css.groupName}>{group.group}</Select.Label>
									{group.value.map((option) => {
										return (
											<Select.Item className={css.menuItem} value={option}>
												<Select.ItemText>{option}</Select.ItemText>
											</Select.Item>
										)
									})}
								</Select.Group>
							)
						})}
					</Select.Viewport>
					<Select.ScrollDownButton className={css.bottom}>^</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	)
}
