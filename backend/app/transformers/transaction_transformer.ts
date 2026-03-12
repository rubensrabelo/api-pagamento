import type Transaction from '#models/transaction'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class TransactionTransformer extends BaseTransformer<Transaction> {
  toObject() {
    const obj = this.pick(this.resource, [
      'id',
      'clientId',
      'gateway',
      'externalId',
      'status',
      'amount',
      'cardLastNumbers',
      'createdAt',
      'updatedAt',
    ])

    return {
      ...obj,
      products: this.resource.products?.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
      })),
    }
  }
}