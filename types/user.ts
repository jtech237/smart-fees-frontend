interface UserType{
  id: number
  username: string
  email?: string
  name?: string | null
  accessToken: string
  refreshToken: string
  role: string
}

interface UserResponse{
  id: number,
  role: string,
  username: string,
  email: string,
  name: string,
  access: string,
  refresh: string
}

export type { UserType, UserResponse }
