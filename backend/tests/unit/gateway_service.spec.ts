import { test } from '@japa/runner'
import sinon from 'sinon'
import Gateway from '#models/gateway'
import { GatewayService } from '#services/gateway_service'

test.group('Gateway Service | Unit', (group) => {
  let service: GatewayService

  group.each.setup(() => {
    service = new GatewayService()
    return () => sinon.restore()
  })

  test('toggle deve inverter o status isActive', async ({ assert }) => {
    const fakeGateway = {
      id: 1,
      isActive: true,
      save: sinon.stub().resolves()
    }
    sinon.stub(Gateway, 'findOrFail').resolves(fakeGateway as any)

    await service.toggle(1)
    assert.isFalse(fakeGateway.isActive)

    await service.toggle(1)
    assert.isTrue(fakeGateway.isActive)
    assert.isTrue((fakeGateway.save as any).calledTwice)
  })

  test('updatePriority deve alterar apenas a prioridade', async ({ assert }) => {
    const fakeGateway = {
      id: 1,
      priority: 1,
      save: sinon.stub().resolves()
    }
    sinon.stub(Gateway, 'findOrFail').resolves(fakeGateway as any)

    await service.updatePriority(1, 5)
    assert.equal(fakeGateway.priority, 5)
    assert.isTrue((fakeGateway.save as any).calledOnce)
  })
})
