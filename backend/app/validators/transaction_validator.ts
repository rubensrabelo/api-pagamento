import vine from '@vinejs/vine'

export const createTransactionValidator = vine.create(
  vine.object({
    clientId: vine.number(),
    gateway: vine.string(),
    cardLastNumbers: vine.string().fixedLength(4),

    cardNumber: vine.string().minLength(16),
    cvv: vine.string().minLength(3),

    products: vine.array(
      vine.object({
        productId: vine.number(),
        quantity: vine.number().min(1),
      })
    ),
  })
)

export const updateTransactionValidator = vine.create(
  vine.object({
    cardLastNumbers: vine.string().fixedLength(4).optional(),
    status: vine.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
  })
)