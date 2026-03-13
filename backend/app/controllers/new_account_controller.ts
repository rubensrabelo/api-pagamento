import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator } from '#validators/user'
import AccountService from '#services/account_service'
import UserTransformer from '#transformers/user_transformer'

export default class NewAccountController {
  private accountService = new AccountService()

  async store({ request, response, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const { user, token } = await this.accountService.createAccount(
      fullName ?? "",
      email,
      password
    )

    response.status(201)

    return serialize({
      user: UserTransformer.transform(user),
      token,
    })
  }
}