import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import notesRoutes from './routes/notes'
import userRoutes from './routes/employees'
import morgan from 'morgan'
import createHttpError, { isHttpError } from 'http-errors'
import session from 'express-session'
import env from './utils/validateEnv'
import MongoStore from 'connect-mongo'

const app = express()

app.use(morgan('dev'))

app.use(express.json())

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

app.use('/api/employees', userRoutes)
app.use('/api/notes', notesRoutes)

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
