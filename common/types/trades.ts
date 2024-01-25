import { Sale } from "../models/trade"

export type saleCreationResultT = {
    result: 'success' | 'failure'
}

export type getSaleResultT = {
    sales: Sale[]
}