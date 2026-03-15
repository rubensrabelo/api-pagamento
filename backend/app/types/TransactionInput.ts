import { GatewayType } from "./GatewayType.ts"

export interface TransactionInput {
  clientId: number
  gateway: GatewayType
  cardNumber: string
  cardLastNumbers: string
  cvv: string
  products: {
    productId: number
    quantity: number
  }[]
}