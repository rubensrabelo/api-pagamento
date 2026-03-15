import factory from '@adonisjs/lucid/factories'
import Transaction from '#models/transaction'
import { TransactionProductFactory } from './transaction_product_factory.ts'

export const TransactionFactory = factory
  .define(Transaction, async ({ faker }) => {
    return {
      clientId: 1,
      amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      gateway: faker.helpers.arrayElement(['Gateway1', 'Gateway2']),
      status: 'SUCCESS',
      cardLastNumbers: '4444',
      externalId: faker.string.uuid(),
    }
  })
  .relation('products', () => TransactionProductFactory)
  .build()
