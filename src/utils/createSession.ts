import MongoStore from 'connect-mongo'
import session from 'express-session'
import 'dotenv/config'
import env from './validateEnv'


export function createSession() {
    return session({
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
  }