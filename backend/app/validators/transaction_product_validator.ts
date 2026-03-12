import vine from '@vinejs/vine'

export const transactionProductValidator = vine.create({
  transactionId: vine.number(),
  productId: vine.number(),
  quantity: vine.number().min(1),
})