import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { ClientFactory } from '#database/factories/client_factory'
import Client from '#models/client'
import { faker } from '@faker-js/faker'

test.group('Clients Controller | Integration', (_group) => {

  test('deve listar clientes para ADMIN ou MANAGER', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    await ClientFactory.createMany(2)

    const response = await client.get('/api/v1/clients').loginAs(admin)

    response.assertStatus(200)
    const body = response.body() as any
    assert.isArray(body.data || body)
  })

  test('deve criar um cliente com sucesso (Store)', async ({ client, assert }) => {
    const manager = await UserFactory.merge({ role: 'MANAGER' }).create()
    
    const payload = { 
      name: faker.company.name(), 
      email: faker.internet.email().toLowerCase() 
    }

    const response = await client
      .post('/api/v1/clients')
      .loginAs(manager)
      .json(payload as any)

    if (response.status() === 422) {
      console.log('ERRO CLIENT STORE:', response.body())
    }

    response.assertStatus(201)
    const body = response.body() as any
    const clientName = body.data?.name || body.name
    assert.equal(clientName, payload.name)
  })

  test('deve barrar criação de cliente por usuário comum', async ({ client }) => {
    const user = await UserFactory.merge({ role: 'USER' }).create()
    
    const response = await client
      .post('/api/v1/clients')
      .loginAs(user)
      .json({ name: 'Hack', email: faker.internet.email() } as any)

    response.assertStatus(403)
  })

  test('deve desativar cliente (softDelete) apenas se for ADMIN', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const targetClient = await ClientFactory.create()

    const response = await client
      .delete(`/api/v1/clients/${targetClient.id}`)
      .loginAs(admin)

    response.assertStatus(200)
    
    const updated = await Client.findOrFail(targetClient.id)
    assert.isFalse(Boolean(updated.isActive))
  })

  test('MANAGER não deve ter permissão para deletar (destroy)', async ({ client }) => {
    const manager = await UserFactory.merge({ role: 'MANAGER' }).create()
    const targetClient = await ClientFactory.create()

    const response = await client
      .delete(`/api/v1/clients/${targetClient.id}`)
      .loginAs(manager)

    response.assertStatus(403)
  })
})
