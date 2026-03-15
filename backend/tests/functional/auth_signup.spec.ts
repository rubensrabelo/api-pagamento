import { test } from '@japa/runner'
import User from '#models/user'
import { faker } from '@faker-js/faker'

test.group('Auth Signup | Integration', (_group) => {

  test('deve registrar um novo usuário com sucesso via API', async ({ client, assert }) => {
    const email = faker.internet.email().toLowerCase()
    
    const payload = {
      fullName: 'Usuario Teste',
      email: email,
      password: 'Password123!',
      passwordConfirmation: 'Password123!',
      role: 'ADMIN'
    }

    const response = await client
      .post('/api/v1/auth/signup')
      .json(payload as any)

    if (response.status() === 422) {
      console.log('ERRO DE VALIDAÇÃO:', JSON.stringify(response.body(), null, 2))
    }

    response.assertStatus(201)

    const body = response.body() as any
    
    const token = body.token || body.data?.token
    const userEmail = body.user?.email || body.user?.data?.email || body.data?.user?.email

    assert.exists(token, 'O token não foi encontrado no retorno')
    assert.equal(userEmail, email, 'O email retornado não confere')

    const userInDb = await User.findByOrFail('email', email)
    assert.equal(userInDb.fullName, payload.fullName)
  })

  test('deve falhar ao tentar registrar com email já existente', async ({ client }) => {
    const emailRepetido = faker.internet.email().toLowerCase()
    
    const payload = {
      fullName: 'User Repetido',
      email: emailRepetido,
      password: 'Password123!',
      passwordConfirmation: 'Password123!',
      role: 'USER'
    }
    
    await client.post('/api/v1/auth/signup').json(payload as any)

    const response = await client.post('/api/v1/auth/signup').json(payload as any)

    response.assertStatus(422)
  })

  test('deve barrar registro com senhas que não coincidem', async ({ client }) => {
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'John Doe',
      email: faker.internet.email(),
      password: 'Password123!',
      passwordConfirmation: 'SENHA_DIFERENTE',
      role: 'ADMIN'
    } as any)

    response.assertStatus(422)
  })

  test('deve barrar registro com dados inválidos', async ({ client }) => {
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'John',
      email: 'email-invalido',
      password: '123',
      passwordConfirmation: '123',
      role: 'ADMIN'
    } as any)

    response.assertStatus(422)
  })
})
