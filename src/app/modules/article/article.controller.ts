import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { ArticleService } from './article.service'

const createArticle = catchAsync(async (req: Request, res: Response) => {
  const article = req.body
  const file = req.file
  const result = await ArticleService.createArticle(article, file)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Article created successfully',
    success: true,
    data: result,
  })
})

const getAllArticles = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query
  const paginationOptions = req.query
  const articles = await ArticleService.getAllArticles(
    filters as any,
    paginationOptions as any
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Articles retrieved successfully',
    success: true,
    data: articles,
  })
})

const getArticleById = catchAsync(async (req: Request, res: Response) => {
  const articleId = Number(req.params.id)
  const article = await ArticleService.getArticleById(articleId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Article retrieved successfully',
    success: true,
    data: article,
  })
})

const updateArticle = catchAsync(async (req: Request, res: Response) => {
  const articleId = Number(req.params.id)
  const articleUpdates = req.body
  const file = req.file
  const updatedArticle = await ArticleService.updateArticle(
    articleId,
    articleUpdates,
    file
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Article updated successfully',
    success: true,
    data: updatedArticle,
  })
})

const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  const articleId = Number(req.params.id)
  const deletedArticle = await ArticleService.deleteArticle(articleId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Article deleted successfully',
    success: true,
    data: deletedArticle,
  })
})

export const ArticleController = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
}
