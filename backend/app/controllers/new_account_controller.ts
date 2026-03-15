import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator } from '#validators/user'
import AccountService from '#services/account_service'
import UserTransformer from '#transformers/user_transformer'
import { inject } from '@adonisjs/core'

@inject()
export default class NewAccountController {
  constructor(private accountService: AccountService) {}

  async store({ request, response, serialize }: HttpContext) {
    const data = await request.validateUsing(signupValidator)

    const { user, token } = await this.accountService.createAccount({
      fullName: data.fullName ?? '',
      email: data.email,
      role: data.role,
      password: data.password,
    })

    response.status(201)
    return serialize({
      user: UserTransformer.transform(user),
      token,
    })
  }
}