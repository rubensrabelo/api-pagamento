import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import TransactionTransformer from '#transformers/transaction_transformer'
import { createTransactionValidator, updateTransactionValidator } from '#validators/transaction_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { Gateway1 } from '../Gateways/Gateway1.ts'
import { Gateway2 } from '../Gateways/Gateway2.ts'
import Client from '#models/client'
import Product from '#models/product'

export default class TransactionsController {
  async index({ serialize }: HttpContext) {
    const transactions = await Transaction.query().preload('products')
    return serialize(TransactionTransformer.transform(transactions))
  }

  async show({ params, serialize }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('products')
      .firstOrFail()

    return serialize(TransactionTransformer.transform(transaction))
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createTransactionValidator)

    const productIds = data.products.map((p) => p.productId)
    const products = await Product.query().whereIn('id', productIds)

    let total = 0

    for (const item of data.products) {
      const product = products.find((p) => p.id === item.productId)

      if (!product) {
        return response.badRequest({
          message: 'Produto não encontrado',
        })
      }

      total += product.amount * item.quantity
    }

    const transaction = await Transaction.create({
      clientId: data.clientId,
      gateway: data.gateway,
      amount: total,
      cardLastNumbers: data.cardLastNumbers,
      status: 'PENDING',
    })

    for (const item of data.products) {
      await TransactionProduct.create({
        transactionId: transaction.id,
        productId: item.productId,
        quantity: item.quantity,
      })
    }

    let gateway

    if (data.gateway === 'gateway1') {
      gateway = new Gateway1()
    } else {
      gateway = new Gateway2()
    }

    const client = await Client.findOrFail(data.clientId)

    const result = await gateway.charge({
      amount: total,
      name: client.name!,
      email: client.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    if (result.success) {
      transaction.status = 'SUCCESS'
      transaction.externalId = result.external_id!
    } else {
      transaction.status = 'FAILED'
    }

    await transaction.save()

    await transaction.refresh()
    await transaction.load('products')

    response.status(201)

    return serialize(TransactionTransformer.transform(transaction))
  }

  async update({ params, request, serialize }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)

    const data = await request.validateUsing(updateTransactionValidator)

    transaction.merge(data)
    await transaction.save()
    await transaction.load('products')

    return serialize(TransactionTransformer.transform(transaction))
  }

  async destroy({ params }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)
    await transaction.delete()

    return { success: true }
  }
}