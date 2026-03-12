import { TransactionProductSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.ts'

export default class TransactionProduct extends TransactionProductSchema {
    @belongsTo(() => Transaction)
    declare transaction: BelongsTo<typeof Transaction>
}