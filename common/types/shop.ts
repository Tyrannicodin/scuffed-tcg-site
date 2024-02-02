import {PartialCardT, PartialPackT} from './cards'

export type ShopT = {
	packs: Array<PartialPackT>
	hermitCards: Array<PartialCardT>
	effectCards: Array<PartialCardT>
}
