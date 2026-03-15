import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { ClientFactory } from '#database/factories/client_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { TransactionFactory } from '#database/factories/transaction_factory'
import { GatewayFactory } from '#database/factories/gateway_factory'
import { PaymentService } from '#services/payment_service'
import sinon from 'sinon'

test.group('Transactions Controller | Integration', (group) => {
  group.each.setup(() => {
    return () => sinon.restore()
  })

  test('deve criar transação com sucesso para ADMIN', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const customer = await ClientFactory.create()
    const product = await ProductFactory.merge({ amount: 100 }).create()
    await GatewayFactory.merge({ name: 'Gateway1', isActive: true }).create()

    sinon.stub(PaymentService.prototype, 'charge').resolves({
      success: true,
      external_id: 'api_ref_test',
      gatewayName: 'Gateway1'
    })

    const payload = {
      clientId: customer.id,
      gateway: 'gateway1',
      cardNumber: '1234123412341234',
      cardLastNumbers: '1234',
      cvv: '123',
      products: [{ productId: product.id, quantity: 2 }]
    }

    const response = await client
      .post('/api/v1/transactions')
      .loginAs(admin)
      .json(payload as any)

    response.assertStatus(201)
    const body = response.body() as any
    const status = body.data?.status || body.status
    assert.equal(status, 'SUCCESS')
  })

  test('deve realizar estorno (refund) com sucesso', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const customer = await ClientFactory.create()
    
    await GatewayFactory.merge({ name: 'Gateway1', isActive: true }).create()
    const transaction = await TransactionFactory.merge({ 
      clientId: customer.id, 
      externalId: 'ext_999',
      status: 'SUCCESS'
    }).create()

    sinon.stub(PaymentService.prototype, 'refund').resolves({
      success: true,
      gatewayName: 'Gateway1'
    })

    const response = await client
      .post(`/api/v1/transactions/${transaction.id}/refund`)
      .loginAs(admin)

    response.assertStatus(200)
    const body = response.body() as any
    const status = body.data?.status || body.status
    assert.equal(status, 'REFUNDED')
  })

  test('usuário sem permissão (MANAGER) não deve estornar transação', async ({ client }) => {
    const manager = await UserFactory.merge({ role: 'MANAGER' }).create()
    const response = await client
      .post('/api/v1/transactions/1/refund')
      .loginAs(manager)

    response.assertStatus(403)
  })
})
