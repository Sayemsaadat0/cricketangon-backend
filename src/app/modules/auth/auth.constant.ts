import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import jwt, { Secret } from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send email')
  }
}




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

