import { test } from '@japa/runner'
import sinon from 'sinon'
import Gateway from '#models/gateway'
import { PaymentService } from '#services/payment_service'
import { Gateway1 } from '../../app/gateways/Gateway1.ts'
import { Gateway2 } from '../../app/gateways/Gateway2.ts'

test.group('Payment Service | Unit', (group) => {
  let service: PaymentService

  group.each.setup(() => {
    service = new PaymentService()
    return () => sinon.restore()
  })

  test('deve tentar o segundo gateway se o primeiro falhar (Fallback)', async ({ assert }) => {
    const fakeGateways = [
      { name: 'Gateway1', priority: 2, isActive: true },
      { name: 'Gateway2', priority: 1, isActive: true },
    ]
    const queryMock = {
      where: sinon.stub().returnsThis(),
      orderBy: sinon.stub().returnsThis(),
      then: (resolve: any) => resolve(fakeGateways)
    }
    sinon.stub(Gateway, 'query').returns(queryMock as any)

    const g1Stub = sinon.stub(Gateway1.prototype, 'charge').resolves({ 
      success: false, 
      message: 'Failed', 
      gatewayName: 'Gateway1' 
    } as any)
    
    const g2Stub = sinon.stub(Gateway2.prototype, 'charge').resolves({ 
      success: true, 
      external_id: '123', 
      gatewayName: 'Gateway2' 
    } as any)

    const payload = { amount: 100, name: 'Rubens', email: 'a@a.com', cardNumber: '123', cvv: '111' }
    const result = await service.charge(payload)

    assert.isTrue(result.success)
    assert.equal(result.gatewayName, 'Gateway2')
    assert.isTrue(g1Stub.calledOnce)
    assert.isTrue(g2Stub.calledOnce)
  })

  test('deve retornar falha se todos os gateways falharem', async ({ assert }) => {
    sinon.stub(Gateway, 'query').returns({
      where: sinon.stub().returnsThis(),
      orderBy: sinon.stub().returnsThis(),
      then: (resolve: any) => resolve([{ name: 'Gateway1', isActive: true }])
    } as any)

    sinon.stub(Gateway1.prototype, 'charge').resolves({ 
      success: false, 
      message: 'Error', 
      gatewayName: 'Gateway1' 
    } as any)

    const result = await service.charge({ amount: 10, name: 'X', email: 'x@x.com', cardNumber: '0', cvv: '0' })
    
    assert.isFalse(result.success)
    assert.equal(result.message, 'All gateways failed')
  })
})
