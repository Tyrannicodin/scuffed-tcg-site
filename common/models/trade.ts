import { PartialCardT } from '../types/cards'
import { Uuid, userInfoT } from '../types/user'

type SaleDefs = {
	seller: Uuid
    card: PartialCardT
    price: number
    
}

export class Sale {
	public seller: Uuid
    public card: PartialCardT
    public price: number

	constructor(defs: SaleDefs) {
		this.seller = defs.seller
        this.card = defs.card
        this.price = defs.price
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
