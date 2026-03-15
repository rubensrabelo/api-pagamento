import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'

test.group('Auth Access | Integration', (_group) => {

  test('deve fazer login com sucesso e receber um token', async ({ client, assert }) => {
    const password = 'Password123!'
    const user = await UserFactory.merge({ password, isActive: true }).create()

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: user.email, password })

    response.assertStatus(200)
    
    const body = response.body() as any
    const token = body.token || body.data?.token
    
    assert.exists(token, 'Token de acesso não retornado no login')
  })

  test('deve falhar ao tentar logar com senha errada', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: user.email, password: 'wrong_password' })

    response.assertStatus(400)
  })

  test('deve fazer logout e invalidar o token', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client
      .post('/api/v1/auth/logout')
      .loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().message, 'Logged out successfully')
  })

  test('não deve permitir logout sem estar autenticado', async ({ client }) => {
    const response = await client.post('/api/v1/auth/logout')
    response.assertStatus(401)
  })
})
