import { test } from '@japa/runner'
import sinon from 'sinon'
import ProfileService from '#services/profile_service.ts'

test.group('Profile Service | Unit', (group) => {
  let service: ProfileService

  group.each.setup(() => {
    service = new ProfileService()
    return () => sinon.restore()
  })

  test('updateProfile deve mesclar dados e salvar o usuário', async ({ assert }) => {
    const fakeUser = {
      merge: sinon.stub().returnsThis(),
      save: sinon.stub().resolves()
    }
    const data = { fullName: 'Novo Nome' }

    await service.updateProfile(fakeUser as any, data)

    assert.isTrue(fakeUser.merge.calledWith(data))
    assert.isTrue(fakeUser.save.calledOnce)
  })

  test('deactivateProfile deve definir isActive como false e salvar', async ({ assert }) => {
    const fakeUser = {
      isActive: true,
      save: sinon.stub().resolves()
    }

    await service.deactivateProfile(fakeUser as any)

    assert.isFalse(fakeUser.isActive)
    assert.isTrue(fakeUser.save.calledOnce)
  })
})
