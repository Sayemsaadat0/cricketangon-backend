import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import path from 'path'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import router from './app/routes'

const app: Application = express()
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5173/",
      "http://localhost:5174",
      "http://localhost:5174/",
      "http://localhost:3000",
      "http://localhost:3000/",
      "https://cricketangon.com",
      "https://cricketangon.com/",
      "https://cricketangon.com",
      "https://cricketangon.com/",
      "http://cricketangon.com",
      "http://cricketangon.com/",
      "https://cricketangon-client.vercel.app",
      "https://cricketangon-client.vercel.app/",
      "http://cricketangon-client.vercel.app",
      "http://cricketangon-client.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(cookieParser())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/v1/', router)
app.use(globalErrorHandler)

//Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Working Successfully')
})

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})
export default app
