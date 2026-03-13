import User from '#models/user'
import { CreateUserDTO, UserWithTokenDTO } from '../dtos/user_dto.ts'

export default class AccountService {
  async createAccount(data: CreateUserDTO): Promise<UserWithTokenDTO> {
    const user = await User.create(data)

    const token = await User.accessTokens.create(user)

    return {
      user: user,
      token: token.value?.release() ?? '',
    }
  }
}