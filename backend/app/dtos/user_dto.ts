import User from "#models/user"
import { RoleUserType } from "../types/RoleUserType.ts"

export interface CreateUserDTO {
  fullName: string
  email: string
  role: RoleUserType
  password: string
}

export interface UpdateProfileDTO {
  fullName?: string
  email?: string
  role?: RoleUserType
}

export interface LoginUserDTO {
  email: string
  password: string
}

export interface UserWithTokenDTO {
  user: User,
  token: string
}

export interface UserProfileDTO {
  id: number
  fullName: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
  initials?: string
}

export interface UserProfileResponseDTO {
  data: UserProfileDTO
}

export interface LogoutDTO {
  message: string
}

