import httpStatus from 'http-status'
import { RowDataPacket } from 'mysql2'
import {connection} from '../../../config/db'
import ApiError from '../../../errors/ApiError'
import { ArticleQueries } from '../../../queries/articleQueries'
import { IArticle } from './article.interface'

const createArticle = (article: IArticle): Promise<Partial<IArticle>> => {
  console.log('log article', article)
  const {
    authorName,
    title,
    categoryId,
    image,
    isApproved,
    description,
    userId,
  } = article
  return new Promise((resolve, reject) => {
    connection.query(
      ArticleQueries.CREATE_ARTICLE,
      [authorName, title, categoryId, image, description, userId, isApproved],
      (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error creating article',
              err.stack
            )
          )
        }
        console.log(results)
        const newArticle = {
          authorName,
          title,
          categoryId,
          image,
          description,
          userId,
        }
        resolve(newArticle)
      }
    )
  })
}

const getAllArticles = (): Promise<IArticle[]> => {
  return new Promise((resolve, reject) => {
    connection.query(ArticleQueries.GET_ALL_ARTICLES, (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving articles',
            err.stack
          )
        )
      }

      const rows = results as RowDataPacket[]
      if (rows.length === 0) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'No articles found'))
      }

      const articles = rows.map(row => {
        return {
          id: row.id as number,
          authorName: row.authorName as string,
          title: row.title as string,
          categoryId: row.categoryId as number,
          image: row.image as string,
          description: row.description as string,
          userId: row.userId as number,
          created_at: row.created_at as string,
          updated_at: row.updated_at as string,
          userEmail: row.userEmail as string,
          userRole: row.userRole as string,
        }
      })
      resolve(articles)
    })
  })
}

const getArticleById = (id: number): Promise<IArticle | null> => {
  return new Promise((resolve, reject) => {
    connection.query(ArticleQueries.GET_ARTICLE_BY_ID, [id], (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving article',
            err.stack
          )
        )
      }

      const rows = results as RowDataPacket[]
      const article = rows.length > 0 ? (rows[0] as IArticle) : null

      if (!article) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'Article not found'))
      }

      resolve(article)
    })
  })
}

const updateArticle = (
  id: number,
  articleUpdates: Partial<IArticle>
): Promise<IArticle> => {
  const { authorName, title, categoryId, image, description, userId } =
    articleUpdates
  return new Promise((resolve, reject) => {
    connection.query(
      ArticleQueries.UPDATE_ARTICLE,
      [authorName, title, categoryId, image, description, userId, id],
      (err, results) => {
        if (err) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error updating article',
              err.stack
            )
          )
        }

        const { affectedRows } = results as RowDataPacket
        if (affectedRows === 0) {
          return reject(new ApiError(httpStatus.NOT_FOUND, 'Article not found'))
        }

        resolve({
          authorName: authorName as string,
          title: title as string,
          categoryId: categoryId as number,
          image: image as string,
          description: description as string,
          userId: userId as number,
        })
      }
    )
  })
}

const deleteArticle = (id: number): Promise<IArticle> => {
  return new Promise((resolve, reject) => {
    connection.query(ArticleQueries.GET_ARTICLE_BY_ID, [id], (err, results) => {
      if (err) {
        return reject(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving article before deletion',
            err.stack
          )
        )
      }

      const rows = results as RowDataPacket[]
      const article = rows.length > 0 ? (rows[0] as IArticle) : null

      if (!article) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'Article not found'))
      }

      connection.query(ArticleQueries.DELETE_ARTICLE, [id], deleteErr => {
        if (deleteErr) {
          return reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Error deleting article',
              deleteErr.stack
            )
          )
        }
        resolve(article)
      })
    })
  })
}

export const ArticleModel = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
}
