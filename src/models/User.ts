import { UserRole } from "./enums"

export interface User {
  id: number
  username: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
