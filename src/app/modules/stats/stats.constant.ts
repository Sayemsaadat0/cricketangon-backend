export type IStatsFilter = {
    searchTerm:string
    authorName?: string,
    title:string
  }

  export const statsSearchableFields = [
    "authorName",'title',
  ]

  export const statsFilterableFields = [
    "searhTerm",
    "name",
    "title"
  ]

  