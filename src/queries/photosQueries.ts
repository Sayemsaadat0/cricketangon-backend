export const PhotoQueries = {
    CREATE_PHOTO: `
      INSERT INTO photos (image, category, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `,
  
    GET_PHOTO_BY_ID: `
      SELECT id, image, category, created_at, updated_at FROM photos WHERE id = ?
    `,
  
    UPDATE_PHOTO: `
      UPDATE photos
      SET image = ?, category = ?, updated_at = NOW()
      WHERE id = ?
    `,
  
    DELETE_PHOTO: `
      DELETE FROM photos WHERE id = ?
    `,
  
    GET_ALL_PHOTOS: `
      SELECT id, image, category, created_at, updated_at FROM photos
    `,
  
    FIND_PHOTOS_BY_CATEGORY: `
      SELECT id, image, category, created_at, updated_at FROM photos WHERE category = ?
    `,
  };
  