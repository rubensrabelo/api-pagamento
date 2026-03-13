export interface CreateUserDTO {
  fullName: string
  email: string
  password: string
}

export interface LoginUserDTO {
  email: string
  password: string
}

export interface UserWithTokenDTO {
  user: {
    id: number
    fullName: string | null
    email: string
    createdAt: Date
    updatedAt: Date
    initials?: string
  }
  token: string
}

export interface LogoutDTO {
  message: string
}