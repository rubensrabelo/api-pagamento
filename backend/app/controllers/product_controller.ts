import type { HttpContext } from '@adonisjs/core/http'
import ProductService from '#services/product_service'
import {
  createProductValidator,
  updateProductValidator,
} from '#validators/product_validator'
import ProductTransformer from '#transformers/product_transformer'

export default class ProductsController {
  private productService = new ProductService()

  async index({ serialize }: HttpContext) {
    const products = await this.productService.getAll()

    return serialize(ProductTransformer.transform(products))
  }

  async show({ params, serialize }: HttpContext) {
    const product = await this.productService.getById(params.id)

    return serialize(ProductTransformer.transform(product))
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)

    const product = await this.productService.create(data)

    response.status(201)

    return serialize(ProductTransformer.transform(product))
  }

  async update({ params, request, serialize }: HttpContext) {
    const data = await request.validateUsing(updateProductValidator)

    const product = await this.productService.update(params.id, data)

    return serialize(ProductTransformer.transform(product))
  }

  async destroy({ params, response }: HttpContext) {
    await this.productService.softDelete(params.id)

    return response.ok({
      message: 'Product deactivated successfully',
    })
  }
}