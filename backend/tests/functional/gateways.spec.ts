import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { GatewayFactory } from '#database/factories/gateway_factory'
import Gateway from '#models/gateway'

test.group('Gateway Controller | Integration', (_group) => {

  test('deve alternar status do gateway quando for ADMIN', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const gateway = await GatewayFactory.merge({ isActive: true }).create()

    const response = await client
      .patch(`/api/v1/gateways/${gateway.id}/toggle`)
      .loginAs(admin)

    response.assertStatus(200)
    
    const updated = await Gateway.findOrFail(gateway.id)
    assert.isFalse(Boolean(updated.isActive))
  })

  test('deve atualizar a prioridade do gateway', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const gateway = await GatewayFactory.merge({ priority: 1 }).create()

    const response = await client
      .patch(`/api/v1/gateways/${gateway.id}/priority`)
      .loginAs(admin)
      .json({ priority: 10 })

    response.assertStatus(200)
    
    const updated = await Gateway.findOrFail(gateway.id)
    assert.equal(updated.priority, 10)
  })

  test('deve barrar acesso de MANAGER (apenas ADMIN permitido)', async ({ client }) => {
    const manager = await UserFactory.merge({ role: 'MANAGER' }).create()
    const gateway = await GatewayFactory.create()

    const response = await client
      .patch(`/api/v1/gateways/${gateway.id}/toggle`)
      .loginAs(manager)

    response.assertStatus(403)
  })

  test('deve retornar 404 para gateway inexistente', async ({ client }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()

    const response = await client
      .patch('/api/v1/gateways/9999/toggle')
      .loginAs(admin)

    response.assertStatus(404)
  })
})
