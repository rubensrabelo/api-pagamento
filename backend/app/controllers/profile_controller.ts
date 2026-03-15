import type { HttpContext } from '@adonisjs/core/http'

import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator } from '#validators/user'
import ProfileService from '#services/profile_service.ts'

export default class ProfileController {
  private profileService = new ProfileService()

  async show({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const profile = await this.profileService.getProfile(user)

    return serialize(UserTransformer.transform(profile))
  }

  async update({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const data = await request.validateUsing(updateProfileValidator)

    const profile = await this.profileService.updateProfile(user, data)

    return serialize(UserTransformer.transform(profile))
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await this.profileService.deactivateProfile(user)

    return response.ok({
      message: 'User deactivated successfully',
    })
  }
}