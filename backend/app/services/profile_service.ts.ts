import User from '#models/user'
import { UpdateProfileDTO } from '../dtos/user_dto.ts'

export default class ProfileService {
  async getProfile(user: User): Promise<User> {
    return user
  }

  async updateProfile(user: User, data: UpdateProfileDTO): Promise<User> {
    user.merge(data)

    await user.save()

    return user
  }
}