import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import jwt, { Secret } from 'jsonwebtoken'
import config from '../../../config'


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(token, config.jwt_secret as Secret)
    req.user = { user: decoded }
    next()
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid token' })
  }
}

