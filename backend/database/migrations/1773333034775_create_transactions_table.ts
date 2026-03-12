import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('client_id').unsigned().references('id').inTable('clients').notNullable()
      table.string('gateway').notNullable()
      table.string('external_id').nullable()
      table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).defaultTo('PENDING')
      table.integer('amount').notNullable()
      table.string('card_last_numbers', 4).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}