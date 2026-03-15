import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/user'
import AuthService from '#services/auth_service'
import UserTransformer from '#transformers/user_transformer'
import { inject } from '@adonisjs/core'

@inject()
export default class AccessTokenController {
  constructor (private authService: AuthService) {}

  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const { user, token } = await this.authService.login({ email, password })

    return serialize({
      user: UserTransformer.transform(user),
      token,
    })
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    return await this.authService.logout(user)
  }
}