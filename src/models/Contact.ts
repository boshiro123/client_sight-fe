import { AgeGroup, Gender } from "./enums"

export interface Contact {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  ageGroup: AgeGroup
  gender: Gender
  preferredTourType: string | null
  discountPercent: number
  additionalInfo: string | null
  isClient: boolean
  userId: number | null
  createdAt: Date
  updatedAt: Date
}
