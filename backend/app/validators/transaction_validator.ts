import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
  vine.object({
    clientId: vine.number(),
    gateway: vine.string(),
    amount: vine.number(),
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

export const updateTransactionValidator = vine.compile(
  vine.object({
    status: vine.enum(['PENDING', 'SUCCESS', 'FAILED']),
  })
)