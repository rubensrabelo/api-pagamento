import User from '#models/user'
import { DateTime } from 'luxon'
import { CreateUserDTO, UserWithTokenDTO } from '../dtos/user_dto.ts'

export default class AccountService {
  async createAccount(data: CreateUserDTO): Promise<UserWithTokenDTO> {
    const user = await User.create(data)

    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        createdAt: (user.createdAt as DateTime).toJSDate(),
        updatedAt: (user.updatedAt as DateTime).toJSDate(),
        initials: user.initials ?? undefined,
      },
      token: token.value?.release() ?? '',
    }
  }
}