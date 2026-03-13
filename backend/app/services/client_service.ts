import Client from '#models/client'

export default class ClientService {
  async getAll() {
    return Client.all()
  }

  async getById(id: number) {
    return Client.findOrFail(id)
  }

  async create(data: any) {
    return Client.create(data)
  }

  async update(id: number, data: any) {
    const client = await Client.findOrFail(id)

    client.merge(data)
    await client.save()

    return client
  }

  async delete(id: number) {
    const client = await Client.findOrFail(id)

    await client.delete()
  }
}