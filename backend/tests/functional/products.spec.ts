import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { ProductFactory } from '#database/factories/product_factory'
import Product from '#models/product'

test.group('Products Full CRUD Test', (_group) => {
  
  test('Deve listar produtos (Index)', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await ProductFactory.createMany(3)

    const response = await client.get('/api/v1/products').loginAs(user)

    response.assertStatus(200)
    const body = response.body() as any
    assert.isArray(body.data)
  })

  test('Deve criar um produto com sucesso (Store)', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const payload = { name: 'Produto Teste', amount: 100 }

    const response = await client
      .post('/api/v1/products')
      .loginAs(admin)
      .json(payload)

    response.assertStatus(201)
    
    const body = response.body() as any
    assert.equal(body.data.name, 'Produto Teste')
  })

  test('Deve atualizar um produto (Update)', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const product = await ProductFactory.create()

    const response = await client
      .put(`/api/v1/products/${product.id}`)
      .loginAs(admin)
      .json({ name: 'Novo Nome' })

    response.assertStatus(200)
    
    const body = response.body() as any
    assert.equal(body.data.name, 'Novo Nome')
  })

  test('Deve desativar um produto (Delete/SoftDelete)', async ({ client, assert }) => {
    const admin = await UserFactory.merge({ role: 'ADMIN' }).create()
    const product = await ProductFactory.create()

    const response = await client
      .delete(`/api/v1/products/${product.id}`)
      .loginAs(admin)

    response.assertStatus(200)

    const updatedProduct = await Product.findOrFail(product.id)
    assert.isFalse(Boolean(updatedProduct.isActive))
  })

  test('Deve barrar usuário sem permissão (Role Check)', async ({ client }) => {
    const commonUser = await UserFactory.merge({ role: 'USER' }).create()
    const payload = { name: 'Hack', amount: 1 }

    const response = await client
      .post('/api/v1/products')
      .loginAs(commonUser)
      .json(payload)

    response.assertStatus(403)
  })
})
