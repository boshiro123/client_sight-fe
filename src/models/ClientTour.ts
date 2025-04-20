export interface ClientTour {
  id: number
  contactId: number
  tourId: number
  applicationId: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
