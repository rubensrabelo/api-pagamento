import Client from '#models/client'
import {
  createClientValidator,
  updateClientValidator,
} from '#validators/client_validator'
import ClientTransformer from '#transformers/client_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  async index({ serialize }: HttpContext) {
    const clients = await Client.all()

    return serialize(ClientTransformer.transform(clients))
  }

  async show({ params, serialize }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    return serialize(ClientTransformer.transform(client))
  }

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(createClientValidator)

    const client = await Client.create(data)

    response.status(201)
    return serialize(ClientTransformer.transform(client))
  }

  async update({ params, request, serialize }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    const data = await request.validateUsing(updateClientValidator)

    client.merge(data)
    await client.save()

    return serialize(ClientTransformer.transform(client))
  }

  async destroy({ params, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    await client.delete()

    return response.noContent()
  }
}