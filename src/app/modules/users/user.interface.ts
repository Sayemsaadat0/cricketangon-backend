export type IUser = {
  id?: number
  name: string
  email: string
  password: string
  role: 'user' | 'admin' | 'super_admin'
  image?: string
  address?: string
}
