import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)

export const createClientValidator = vine.create({
  name: vine.string().nullable(),
  email: email().unique({ table: 'clients', column: 'email' }),
})

export const updateClientValidator = vine.create({
  name: vine.string().nullable(),
  email: email(),
})