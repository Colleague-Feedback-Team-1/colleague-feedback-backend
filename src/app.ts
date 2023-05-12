import 'dotenv/config'
import { createSession } from './utils/createSession';
import express, { NextFunction, Request, Response } from 'express'
import userRoutes from './routes/employees'
import RequestRoutes from './routes/requests'
import QuestionsRoutes from './routes/questions'
import FeedbackDataRoutes from './routes/feedbackData'
import notificationRoutes from './routes/notifications'
import morgan from 'morgan'
import cors from 'cors'
import createHttpError, { isHttpError } from 'http-errors'


const app = express()
const options = {
  credentials: true, 
}
app.use(createSession());

app.use(morgan('dev'))

app.use(express.json())
app.use(cors(options))

app.use('/api/employees', userRoutes)
//requests endpoint
app.use('/api/review-requests', RequestRoutes)
//questions endpoint
app.use('/api/questions', QuestionsRoutes)
//feedbackData endpoint
app.use('/api/feedback-data', FeedbackDataRoutes)
//notifications endpoint
app.use('/api/notifications', notificationRoutes)

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'))
})

// Error handler for all routes (including 404 and 500)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let errorMessage = 'An unknown error occurred'
  let statusCode = 500
  if (isHttpError(error)) {
    statusCode = error.status
    errorMessage = error.message
  }
  res.status(statusCode).json({ error: errorMessage })
})

export default app
