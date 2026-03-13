import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import Client from '#models/client'
import Product from '#models/product'
import { Gateway1 } from '../Gateways/Gateway1.ts'
import { Gateway2 } from '../Gateways/Gateway2.ts'

export type GatewayType = 'gateway1' | 'gateway2'

export interface TransactionProductInput {
  productId: number
  quantity: number
}

export interface TransactionInput {
  clientId: number
  gateway: GatewayType
  cardNumber: string
  cardLastNumbers: string
  cvv: string

  status?: 'PENDING' | 'SUCCESS' | 'FAILED'
  externalId?: string

  products: TransactionProductInput[]
}

export class TransactionService {
  async getAll() {
    return Transaction.query().preload('products')
  }

  async getById(id: number) {
    return Transaction.query().where('id', id).preload('products').firstOrFail()
  }

  async create(data: TransactionInput) {
    const productIds = data.products.map((p) => p.productId)
    const products = await Product.query().whereIn('id', productIds)

    let total = 0
    for (const item of data.products) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`)
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

    const gatewayInstance = data.gateway === 'gateway1' ? new Gateway1() : new Gateway2()

    const client = await Client.findOrFail(data.clientId)

    const result = await gatewayInstance.charge({
      amount: total,
      name: client.name ?? 'Cliente',
      email: client.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    if (result.success) {
      transaction.status = 'SUCCESS'
      transaction.externalId = result.external_id ?? ""
    } else {
      transaction.status = 'FAILED'
    }

    await transaction.save()
    await transaction.refresh()
    await transaction.load('products')

    return transaction
  }

  async update(id: number, data: Partial<TransactionInput>) {
    const transaction = await Transaction.findOrFail(id)
    transaction.merge(data)
    await transaction.save()
    await transaction.load('products')
    return transaction
  }

  async delete(id: number) {
    const transaction = await Transaction.findOrFail(id)
    await transaction.delete()
  }
}