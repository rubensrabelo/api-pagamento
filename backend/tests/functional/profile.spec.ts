import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'

test.group('Profile Controller | Integration', (_group) => {

  test('deve retornar o perfil do usuário logado', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client
      .get('/api/v1/account')
      .loginAs(user)

    response.assertStatus(200)
    const body = response.body() as any
    const email = body.user?.email || body.user?.data?.email || body.data?.email || body.email
    
    assert.equal(email, user.email)
  })

  test('deve atualizar o nome do perfil logado', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const payload = { fullName: 'Nome Atualizado' }

    const response = await client
      .put('/api/v1/account')
      .loginAs(user)
      .json(payload as any)

    response.assertStatus(200)
    
    await user.refresh()
    assert.equal(user.fullName, 'Nome Atualizado')
  })

  test('deve desativar a própria conta (destroy)', async ({ client, assert }) => {
    const user = await UserFactory.merge({ isActive: true }).create()

    const response = await client
      .delete('/api/v1/account')
      .loginAs(user)

    response.assertStatus(200)
    
    const body = response.body() as any
    assert.equal(body.message, 'User deactivated successfully')
    
    await user.refresh()
    assert.isFalse(Boolean(user.isActive))
  })

  test('não deve permitir acesso sem token', async ({ client }) => {
    const response = await client.get('/api/v1/account')
    response.assertStatus(401)
  })
})
