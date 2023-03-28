import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import EmployeeModel from '../data_models/employee'
import bcrypt from 'bcrypt'
import validator from 'validator'
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
  username: string
  email: string
  password: string
  status: string
}
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  const { username, email, password: passwordRaw, status } = req.body
  const sanitizedUsername = validator.escape(username).trim()
  const sanitizedEmail = validator.escape(email).trim()
  const sanitizedPassword = validator.escape(passwordRaw).trim()
  const sanitizedStatus = validator.escape(status).trim()

  try {
    if (!sanitizedUsername || !sanitizedEmail || !sanitizedPassword || !sanitizedStatus) {
      throw createHttpError(400, 'Parameters missing')
    }

    if (!isValidEmail(sanitizedEmail)) {
      throw createHttpError(400, 'Invalid email format');
    }

    if (!isValidUsername(sanitizedUsername)) {
      throw createHttpError(400, 'Invalid username format');
    }

    // Check if username and email already exist in the database
    const existingUserName = await EmployeeModel.findOne({ username: { $eq: sanitizedUsername } }).exec();
    if (existingUserName) {
      throw createHttpError(409, 'Username already taken');
    }

    const existingEmail = await EmployeeModel.findOne({ email: { $eq: sanitizedEmail } }).exec();
    if (existingEmail) {
      throw createHttpError(409, 'Email already taken');
    }

    // Hash password and create a new user
    const passwordHashed = await bcrypt.hash(sanitizedPassword, 10);
    const newUser = await EmployeeModel.create({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: passwordHashed,
      status: sanitizedStatus,
    });
     
    // Store session data
    req.session.userId = newUser._id
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

interface LoginBody {
  email: string
  password: string
}
export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (
  req,
  res,
  next
) => {
  const { email, password } = req.body
  const sanitizedEmail = validator.escape(email).trim()
  const sanitizedPassword = validator.escape(password).trim()

  try {
    if (!sanitizedEmail || !sanitizedPassword) {
      throw createHttpError(400, 'Parameters missing')
    }

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      throw createHttpError(400, 'Invalid email format')
    }

    // Check if user exists in the database
    const user = await EmployeeModel.findOne({ email: { $eq: sanitizedEmail } })
      .select('+password +username')
      .exec()
    if (!user) {
      throw createHttpError(401, 'Invalid credentials')
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(sanitizedPassword, user.password)
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
