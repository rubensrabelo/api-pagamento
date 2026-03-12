import vine from '@vinejs/vine'

export const createProductValidator = vine.create({
  name: vine.string().minLength(3).maxLength(100),

  amount: vine.number().positive(),
})
