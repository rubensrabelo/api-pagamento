import { test } from '@japa/runner'
import sinon from 'sinon'
import Client from '#models/client'
import ClientService from '#services/client_service'

test.group('Client Service | Unit', (group) => {
  let service: ClientService

  group.each.setup(() => {
    service = new ClientService()
    return () => sinon.restore()
  })

  test('getAll retorna apenas clientes ativos', async ({ assert }) => {
    const fakeClients = [{ id: 1, name: 'Cliente A', isActive: true }]
    const queryMock = {
      where: sinon.stub().returnsThis(),
      then: (resolve: any) => resolve(fakeClients)
    }
    sinon.stub(Client, 'query').returns(queryMock as any)

    const result = await service.getAll()
    assert.deepEqual(result, fakeClients)
  })

  test('update deve mesclar dados e salvar', async ({ assert }) => {
    const fakeClient = {
      id: 1,
      merge: sinon.stub().returnsThis(),
      save: sinon.stub().resolves()
    }
    sinon.stub(Client, 'findOrFail').resolves(fakeClient as any)

    const data = { name: 'Novo Nome' }
    await service.update(1, data)

    assert.isTrue(fakeClient.merge.calledWith(data))
    assert.isTrue(fakeClient.save.calledOnce)
  })
})
