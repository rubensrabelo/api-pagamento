import Product from '#models/product'
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product_dto.ts'

export default class ProductService {
  async getAll(): Promise<Product[]> {
    return await Product.all()
  }

  async getById(id: number): Promise<Product> {
    return await Product.findOrFail(id)
  }

  async create(data: CreateProductDTO): Promise<Product> {
    return await Product.create(data)
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    const product = await Product.findOrFail(id)

    product.merge(data)

    await product.save()

    return product
  }

  async delete(id: number): Promise<void> {
    const product = await Product.findOrFail(id)

    await product.delete()
  }
}