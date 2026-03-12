import Product from '#models/product'
import { createProductValidator } from '#validators/product_validator'
import ProductTransformer from '#transformers/product_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ serialize }: HttpContext) {
    const products = await Product.all()

    return serialize(ProductTransformer.transform(products))
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)

    const product = await Product.create(data)

    response.status(201)
    return serialize(ProductTransformer.transform(product))
  }
}
