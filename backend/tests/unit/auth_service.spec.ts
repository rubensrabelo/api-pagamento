import { test } from '@japa/runner'
import sinon from 'sinon'
import User from '#models/user'
import AuthService from '#services/auth_service'
import { DateTime } from 'luxon'

test.group('Auth Service | Unit', (group) => {
  let service: AuthService

  group.each.setup(() => {
    service = new AuthService()
    return () => sinon.restore()
  })

  test('deve realizar login e retornar token para usuário ativo', async ({ assert }) => {
    const credentials = { email: 'test@example.com', password: 'password123' }
    
    const fakeUser = {
      id: 1,
      fullName: 'Test User',
      email: credentials.email,
      role: 'ADMIN',
      isActive: true,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      initials: 'TU'
    }

    sinon.stub(User, 'verifyCredentials').resolves(fakeUser as any)

    const fakeTokenValue = { release: () => 'secret_token' }
    sinon.stub(User, 'accessTokens' as any).value({
      create: sinon.stub().resolves({ value: fakeTokenValue })
    })

    const result = await service.login(credentials)

    assert.equal(result.token, 'secret_token')
    assert.equal(result.user.email, credentials.email)
  })

  test('deve lançar exceção se o usuário estiver inativo', async ({ assert }) => {
    const fakeUser = { isActive: false }
    sinon.stub(User, 'verifyCredentials').resolves(fakeUser as any)

    await assert.rejects(async () => {
      await service.login({ email: 'test@example.com', password: '123' })
    })
  })
})
