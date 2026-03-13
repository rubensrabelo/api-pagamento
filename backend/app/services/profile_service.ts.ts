import User from '#models/user'

export default class ProfileService {
  async getProfile(user: User) {
    return user
  }
}