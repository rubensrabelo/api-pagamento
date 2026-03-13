import Product from '#models/product'

export default class ProductService {
  async getAll() {
    return Product.all()
  }

  async create(data: any) {
    const product = await Product.create(data)

    return product
  }
}