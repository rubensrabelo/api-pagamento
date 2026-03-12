export interface IGateway {
  charge(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }): Promise<{ success: boolean; external_id?: string; message?: string }>

  refund(external_id: string): Promise<{ success: boolean; message?: string }>
}