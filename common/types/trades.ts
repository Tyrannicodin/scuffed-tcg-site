import { Sale } from "../models/trade"

export type saleCreationResultT = {
    result: 'success' | 'failure'
    sale?: Sale
}

export type getSaleResultT = {
    sales: Sale[]
}