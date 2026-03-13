import Product from '#models/product'
import { CreateProductDTO } from '../dtos/product_dto.ts'

export default class ProductService {
  async getAll(): Promise<Product[]> {
    const products = await Product.all()
    return products
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const product = await Product.create(data)
    return product
  }
}