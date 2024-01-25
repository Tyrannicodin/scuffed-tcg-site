import { PartialCardT } from '../types/cards'
import { Uuid, userInfoT } from '../types/user'

type SaleDefs = {
    id: Uuid
	seller: Uuid
    card: PartialCardT
    price: number
    timestamp: number
}

export class Sale {
    public id: Uuid
	public seller: Uuid
    public card: PartialCardT
    public price: number
    public timestamp: number

	constructor(defs: SaleDefs) {
        this.id = defs.id
		this.seller = defs.seller
        this.card = defs.card
        this.price = defs.price
        this.timestamp = defs.timestamp
    }
}

type TradeDefs = {
    sender: userInfoT
    description: string
}

export class Trade {
    public sender: userInfoT
    public description: string

    constructor(defs: TradeDefs) {
        this.sender = defs.sender
        this.description = defs.description
    }
}
