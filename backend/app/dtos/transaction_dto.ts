export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

export interface TransactionProductDTO {
  productId: number
  quantity: number
}

export interface CreateTransactionDTO {
  clientId: number
  gateway: 'Gateway1' | 'Gateway2' | string
  cardNumber: string
  cvv: string
  cardLastNumbers?: string
  products: TransactionProductDTO[]
}

export interface UpdateTransactionDTO {
  status?: TransactionStatus
  cardLastNumbers?: string
}