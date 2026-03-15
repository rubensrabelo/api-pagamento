import { test } from '@japa/runner'
import sinon from 'sinon'
import User from '#models/user'
import AccountService from '#services/account_service'

test.group('Account Service | Unit', (group) => {
  let service: AccountService

  group.each.setup(() => {
    service = new AccountService()
    return () => sinon.restore()
  })

  test('deve criar conta e retornar token', async ({ assert }) => {
    const userData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'secretPassword',
      role: 'ADMIN' as any
    }

    const fakeUser = { ...userData, id: 1 }
    
    sinon.stub(User, 'create').resolves(fakeUser as any)

    const fakeTokenValue = { release: () => 'fake_secret_token' }
    const tokenMock = { value: fakeTokenValue }
    
    sinon.stub(User, 'accessTokens' as any).value({
      create: sinon.stub().resolves(tokenMock)
    })

    const result = await service.createAccount(userData)

    assert.equal(result.user.id, 1)
    assert.equal(result.token, 'fake_secret_token')
    assert.isTrue((User.create as any).calledOnceWith(userData))
  })
})
