import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '#services/client_service'

import {
  createClientValidator,
  updateClientValidator,
} from '#validators/client_validator'

import ClientTransformer from '#transformers/client_transformer'

export default class ClientsController {
  private clientService = new ClientService()

  async index({ serialize }: HttpContext) {
    const clients = await this.clientService.getAll()

    return serialize(ClientTransformer.transform(clients))
  }

  async show({ params, serialize }: HttpContext) {
    const client = await this.clientService.getById(params.id)

    return serialize(ClientTransformer.transform(client))
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createClientValidator)

    const client = await this.clientService.create(data)

    response.status(201)
    return serialize(ClientTransformer.transform(client))
  }

  async update({ params, request, serialize }: HttpContext) {
    const data = await request.validateUsing(updateClientValidator)

    const client = await this.clientService.update(params.id, data)

    return serialize(ClientTransformer.transform(client))
  }

  async destroy({ params, response }: HttpContext) {
    await this.clientService.softDelete(params.id)

    return response.ok({
      message: 'Client deactivated successfully',
    })
  }
}