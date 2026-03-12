import type Client from '#models/client'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ClientTransformer extends BaseTransformer<Client> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'email',
      'createdAt',
      'updatedAt',
    ])
  }
}