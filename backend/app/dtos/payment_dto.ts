export interface PaymentChargeDTO {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
  expirationMonth?: string
  expirationYear?: string
  gateway?: 'Gateway1' | 'Gateway2'
}

export interface PaymentResultDTO {
  success: boolean
  external_id?: string
  message?: string
  gatewayName?: string
}

export interface RefundResultDTO {
  success: boolean
  message?: string
  refundedAt?: Date
  gatewayName?: string
}