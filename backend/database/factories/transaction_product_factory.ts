import factory from '@adonisjs/lucid/factories'
import TransactionProduct from '#models/transaction_product'

export const TransactionProductFactory = factory
  .define(TransactionProduct, async ({ faker }) => {
    return {
      productId: 1,
      quantity: faker.number.int({ min: 1, max: 5 }),
    }
  })
  .build()
