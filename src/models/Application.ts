import { ApplicationStatus } from "./enums"

export interface Application {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  tourId: number
  userId: number | null
  status: ApplicationStatus
  createdAt: Date
  updatedAt: Date
}
