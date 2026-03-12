import vine from '@vinejs/vine'

export const createTransactionValidator = vine.create({
  clientId: vine.number(),
  gateway: vine.string(),
  amount: vine.number(),
  cardLastNumbers: vine.string().minLength(4).maxLength(4).nullable(),
  products: vine.array(
    vine.object({
      productId: vine.number(),
      quantity: vine.number().min(1),
    })
  ),
})

export const updateTransactionValidator = vine.create({
  status: vine.enum(['PENDING', 'SUCCESS', 'FAILED']),
})