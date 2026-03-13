import type { HttpContext } from '@adonisjs/core/http'

import ProfileService from '#services/profile_service.ts'
import UserTransformer from '#transformers/user_transformer'

export default class ProfileController {
  private profileService = new ProfileService()

  async show({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const profile = await this.profileService.getProfile(user)

    return serialize(UserTransformer.transform(profile))
  }
}