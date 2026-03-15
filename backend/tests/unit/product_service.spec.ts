import { test } from '@japa/runner'
import sinon from 'sinon'
import Product from '#models/product'
import ProductService from '#services/product_service'

test.group('Product Service | Unit', (group) => {
  let service: ProductService

  group.each.setup(() => {
    service = new ProductService()
    return () => sinon.restore()
  })

  test('deve retornar apenas produtos ativos', async ({ assert }) => {
    const fakeProducts = [{ id: 1, name: 'P1', isActive: true }]
    
    const queryMock = {
      where: sinon.stub().returnsThis(),
      then: (resolve: any) => resolve(fakeProducts)
    }
    
    sinon.stub(Product, 'query').returns(queryMock as any)

    const result = await service.getAll()
    
    assert.deepEqual(result, fakeProducts)
    assert.isTrue((queryMock.where as any).calledWith('is_active', true))
  })

  test('deve atualizar um produto com sucesso', async ({ assert }) => {
    const fakeProduct = {
      id: 1,
      merge: sinon.stub().returnsThis(),
      save: sinon.stub().resolves()
    }
    
    sinon.stub(Product, 'findOrFail').resolves(fakeProduct as any)

    const updateData = { name: 'Novo Nome' }
    const result = await service.update(1, updateData)

    assert.isTrue(fakeProduct.merge.calledWith(updateData))
    assert.isTrue(fakeProduct.save.calledOnce)
    assert.equal(result, fakeProduct as any)
  })

  test('deve desativar um produto (softDelete)', async ({ assert }) => {
    const fakeProduct = {
      id: 1,
      isActive: true,
      save: sinon.stub().resolves()
    }
    
    sinon.stub(Product, 'findOrFail').resolves(fakeProduct as any)

    await service.softDelete(1)

    assert.isFalse(fakeProduct.isActive)
    assert.isTrue(fakeProduct.save.calledOnce)
  })
})
