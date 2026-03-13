import User from '#models/user'
import { DateTime } from 'luxon'
import { LoginUserDTO, LogoutDTO, UserWithTokenDTO } from '../dtos/user_dto.ts'

export default class AuthService {
  async login(data: LoginUserDTO): Promise<UserWithTokenDTO> {
    const user = await User.verifyCredentials(
      data.email, data.password
    )

    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role ?? '',
        createdAt: (user.createdAt as DateTime).toJSDate(),
        updatedAt: (user.updatedAt as DateTime).toJSDate(),
        initials: user.initials ?? undefined,
      },
      token: token.value?.release() ?? '',
    }
  }

  async logout(user: User): Promise<LogoutDTO> {
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return {
      message: 'Logged out successfully',
    }
  }
}