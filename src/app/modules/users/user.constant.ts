export type IUserFilter = {
    searchTerm: string
    email?: string
  }

  export const UserSearchableFields = [
    "id",
    "name",
    "email",
    "role",
    "address"
  ]

  export const UserFilterableFields = [
    'searchTerm',
    "id",
    "name",
    "email",
    "role",
    "address"
  ]