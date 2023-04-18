import 'dotenv/config'
import env from './utils/validateEnv'
import express, { NextFunction, Request, Response } from 'express'
import userRoutes from './routes/employees'
import RequestRoutes from './routes/requests'
import QuestionsRoutes from './routes/questions'
import FeedbackDataRoutes from './routes/feedbackData'
import morgan from 'morgan'
import cors from 'cors'
import createHttpError, { isHttpError } from 'http-errors'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const app = express()
const options = {
  origin: `http://localhost:3000`,
}

app.use(morgan('dev'))

app.use(express.json())
app.use(cors(options))

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    //if user stays, maxAge will be refreshed
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
)
// middleware to restrict access to authenticated users only
// const restrictAccessMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   if (req.session.userId) {
//     next()
//   } else {
//     // user is not authenticated, redirect to login page or return an error message
//     return res.status(401).json({ error: 'Unauthorized access, redirect to login' })
//   }
// }

app.use('/api/employees', userRoutes)
//requests endpoint
app.use('/api/review-requests', RequestRoutes)
//questions endpoint
app.use('/api/questions', QuestionsRoutes)
//feedbackData endpoint
app.use('/api/feedback-data', FeedbackDataRoutes)

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'))
})

// Error handler for all routes
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
