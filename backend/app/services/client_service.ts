import Client from '#models/client'
import { CreateClientDTO, UpdateClientDTO } from '../dtos/client_dto.ts'


export default class ClientService {
  async getAll(): Promise<Client[]> {
    const clients = await Client.all()
    return clients
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

  async delete(id: number): Promise<void> {
    const client = await Client.findOrFail(id)
    await client.delete()
  }
}