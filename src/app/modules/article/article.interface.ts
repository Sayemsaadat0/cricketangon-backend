export type IArticle = {
  authorName: string
  title: string
  categoryId: number
  image?: string
  description: string
  userId: number
  isApproved?: true | false
}
