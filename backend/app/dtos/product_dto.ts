export interface CreateProductDTO {
  name: string
  amount: number
}

export interface UpdateProductDTO {
  name?: string
  amount?: number
}