import Client from '#models/client'
import { CreateClientDTO, UpdateClientDTO } from '../dtos/client_dto.ts'


export default class ClientService {
  async getAll(): Promise<Client[]> {
    return await Client.query().where('is_active', true)
  }

  async getById(id: number): Promise<Client> {
    const client = await Client.findOrFail(id)
    return client
  }

  async create(data: CreateClientDTO): Promise<Client> {
    const client = await Client.create(data)
    return client
  }

  async update(id: number, data: UpdateClientDTO): Promise<Client> {
    const client = await Client.findOrFail(id)
    client.merge(data)
    await client.save()
    return client
  }

  async softDelete(id: number): Promise<void> {
    const client = await this.getById(id)
    client.isActive = false
    await client.save()
  }
}