import vine from '@vinejs/vine'

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  FINANCE = 'FINANCE',
  USER = 'USER',
}

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)
const role = () => vine.enum(Object.values(UserRole) as [string, ...string[]])

export const signupValidator = vine.create(
  vine.object({
    fullName: vine.string().nullable(),
    email: email().unique({ table: 'users', column: 'email' }),
    password: password(),
    passwordConfirmation: password().sameAs('password'),
    role: role(),
  })
)

export const loginValidator = vine.create(
  vine.object({
    email: email(),
    password: vine.string(),
  })
)

export const updateProfileValidator = vine.create(
  vine.object({
    fullName: vine.string().trim().minLength(2).optional(),
    email: vine.string().email().optional(),
    role: role().optional(),
  })
)