import { Sale } from "../models/trade"

export type genericSaleResultT = {
    result: 'success' | 'failure'
    sale?: Sale
}

export type getSaleResultT = {
    sales: Sale[]
}