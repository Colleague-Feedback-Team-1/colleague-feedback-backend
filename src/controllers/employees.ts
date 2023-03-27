import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import EmployeeModel from '../data_models/employee'
import bcrypt from 'bcrypt'

export const getAuthenticatedEmployee: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId
  try {
    if (!authenticatedUserId) {
      throw createHttpError(401, 'User not authenticated')
    }
    const user = await EmployeeModel.findById(authenticatedUserId).select('+email +status').exec()
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
interface SingUpBody {
  username?: string
  email?: string
  password?: string,
  status?:string
}
export const signUp: RequestHandler<unknown, unknown, SingUpBody, unknown> = async (
  req,
  res,
  next
) => {
  const username = req.body.username
  const email = req.body.email
  const passwordRaw = req.body.password
  const status = req.body.status

  try {
    if (!username || !email || !passwordRaw || !status) {
      throw createHttpError(400, 'Parameters missing')
    }
    const existingUserName = await EmployeeModel.findOne({ username: username }).exec()
    if (existingUserName) {
      throw createHttpError(409, 'Username already taken')
    }
    const existingEmail = await EmployeeModel.findOne({ email: email }).exec()
    if (existingEmail) {
      throw createHttpError(409, 'Email already taken')
    }

    //Hashing password and creating an entry
    const passwordHashed = await bcrypt.hash(passwordRaw, 10)
    const newUser = await EmployeeModel.create({
      username: username,
      email: email,
      password: passwordHashed,
      status:status
    })

    //Storing session data
    req.session.userId = newUser._id
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

interface LoginBody {
  email?: string
  password?: string
}
export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (
  req,
  res,
  next
) => {
  const email = req.body.email
  const password = req.body.password

  try {
    if (!email || !password) {
      throw createHttpError(400, 'Parameters missing')
    }
    const user = await EmployeeModel.findOne({ email:email }).select('+password +username').exec()
    if (!user) {
      throw createHttpError(401, 'Invalid credentials')
    }
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid credentials')
    }

    req.session.userId = user._id
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error)
    } else {
      res.sendStatus(200)
    }
  })
}
