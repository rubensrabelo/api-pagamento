import factory from '@adonisjs/lucid/factories'
import Gateway from '#models/gateway'

export const GatewayFactory = factory
  .define(Gateway, async ({ faker }) => {
    return {
      name: faker.finance.transactionType(),
      isActive: true,
      priority: faker.number.int({ min: 1, max: 10 }),
    }
  })
  .build()
