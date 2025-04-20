import { Season } from "./enums"

export interface Tour {
  id: number
  name: string
  description: string
  country: string
  season: Season
  type: string
  imagePath: string | null
  filePath: string | null
  startDate: Date
  endDate: Date
  duration: number
  totalSlots: number
  availableSlots: number
  isRegistrationClosed: boolean
  createdAt: Date
  updatedAt: Date
}
