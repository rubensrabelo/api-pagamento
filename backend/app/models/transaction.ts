import { TransactionSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import TransactionProduct from './transaction_product.ts'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Transaction extends TransactionSchema {
    @hasMany(() => TransactionProduct, {
        foreignKey: 'transactionId',
    })
    declare products: HasMany<typeof TransactionProduct>
}