export type IArticleFilter = {
    searchTerm: string;
    title?: string;
    authorName?: string;
    categoryId?: string;
};

export const ArticleSearchableFields = [
    "title",
    "authorName"
];

export const ArticleFilterableFields = [
    "title",
    "authorName",
    "categoryId"
];