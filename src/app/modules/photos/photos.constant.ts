export type IPhotoFilter = {
    searchTerm: string
    category?: string
  }

  export const PhotoSearchableFields = [
 
    "category"
  ]

  export const UserFilterableFields = [
    'searchTerm',
    "category"
  ]