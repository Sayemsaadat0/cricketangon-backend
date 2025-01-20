"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleQueries = void 0;
exports.ArticleQueries = {
    CREATE_ARTICLE: `
      INSERT INTO articles (authorName, title, categoryId, image, description,	userId, isApproved, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    GET_ARTICLE_BY_ID: `
      SELECT 
        articles.id,
        articles.authorName,
        articles.title,
        articles.image,
        articles.description,
        articles.userId,
        articles.isApproved,
        articles.created_at,
        articles.updated_at,
        categories.id AS categoryId,
        categories.name AS categoryName,
        categories.image AS categoryImage,
        users.name AS userName,
        users.email AS userEmail,
        users.role AS userRole
      FROM 
        articles
      JOIN 
        categories
      ON 
        articles.categoryId = categories.id
      JOIN 
        users
      ON 
        articles.userId = users.id
      WHERE 
        articles.id = ?
    `,
    UPDATE_ARTICLE: `
      UPDATE articles
      SET 
        authorName = ?, 
        title = ?, 
        categoryId = ?, 
        image = ?, 
        description = ?, 
        isApproved = ?, 
        userId = ?, 
        updated_at = NOW()
      WHERE id = ?
    `,
    DELETE_ARTICLE: `
      DELETE FROM articles WHERE id = ?
    `,
    GET_ALL_ARTICLES: `
      SELECT 
        articles.id,
        articles.authorName,
        articles.title,
        articles.image,
        articles.description,
        articles.userId,
        articles.isApproved,
        articles.created_at,
        articles.updated_at,
        categories.id AS categoryId,
        categories.name AS categoryName,
        categories.image AS categoryImage,
        users.name AS userName,
        users.email AS userEmail,
        users.role AS userRole
      FROM 
        articles
      JOIN 
        categories
      ON 
        articles.categoryId = categories.id
      JOIN 
        users
      ON 
        articles.userId = users.id
    `,
};
