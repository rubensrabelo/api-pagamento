import { ClientSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Client extends ClientSchema {
    @column({
        columnName: 'is_active',
        prepare: (value: boolean) => (value ? 1 : 0),
        consume: (value: number) => Boolean(value),
    })
    declare isActive: boolean
}