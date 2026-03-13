import User from '#models/user'

export default class AuthService {
  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return {
      user,
      token: token.value!.release(),
    }
  }

  async logout(user: User) {
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return {
      message: 'Logged out successfully',
    }
  }
}