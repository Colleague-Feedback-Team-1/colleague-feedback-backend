import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import EmployeeModel from '../data_models/employee'
import bcrypt from 'bcrypt'
import { isValidEmail, isValidUsername } from '../utils/validators'

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
interface SignUpBody {
  username?: string
  email?: string
  password?: string
  status?: string
}
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  const { username, email, password: passwordRaw, status } = req.body

  try {
    if (!username || !email || !passwordRaw || !status) {
      throw createHttpError(400, 'Parameters missing')
    }

    // Validate email and username formats
    if (!isValidEmail(email)) {
      throw createHttpError(400, 'Invalid email format')
    }

    if (!isValidUsername(username)) {
      throw createHttpError(400, 'Invalid username format')
    }

    // Check if username and email already exist in the database
    const existingUserName = await EmployeeModel.findOne({ username: { $eq: username } }).exec()
    if (existingUserName) {
      throw createHttpError(409, 'Username already taken')
    }

    const existingEmail = await EmployeeModel.findOne({ email: { $eq: email } }).exec()
    if (existingEmail) {
      throw createHttpError(409, 'Email already taken')
    }

    // Hash password and create a new user
    const passwordHashed = await bcrypt.hash(passwordRaw, 10)
    const newUser = await EmployeeModel.create({
      username,
      email,
      password: passwordHashed,
      status,
    })

    // Store session data
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
  const { email, password } = req.body

  try {
    if (!email || !password) {
      throw createHttpError(400, 'Parameters missing')
    }

    // Validate email format
    if (!isValidEmail(email)) {
      throw createHttpError(400, 'Invalid email format')
    }

    // Check if user exists in the database
    const user = await EmployeeModel.findOne({ email: { $eq: email } })
      .select('+password +username')
      .exec()
    if (!user) {
      throw createHttpError(401, 'Invalid credentials')
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid credentials')
    }

    // Store session data
    req.session.userId = user._id
    res.status(200).json(user)
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
