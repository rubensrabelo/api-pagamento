import { ProductSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Product extends ProductSchema {
    @column({
        columnName: 'is_active',
        prepare: (value: boolean) => (value ? 1 : 0),
        consume: (value: number) => Boolean(value),
    })
    declare isActive: boolean
}
