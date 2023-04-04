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
    const user = await EmployeeModel.findById(authenticatedUserId).select('+employeeEmail +status').exec()
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
interface SignUpBody {
  employeeName: string
  employeeEmail: string
  password: string
  status: string
}
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  const { employeeName, employeeEmail, password: passwordRaw, status } = req.body
  //Using a validator to sanitize user input
  const sanitizedUsername = validator.escape(employeeName).trim()
  const sanitizedEmail = validator.escape(employeeEmail).trim()
  const sanitizedPassword = validator.escape(passwordRaw).trim()
  const sanitizedStatus = validator.escape(status).trim()

  try {
    if (!sanitizedUsername || !sanitizedEmail || !sanitizedPassword || !sanitizedStatus) {
      throw createHttpError(400, 'Parameters missing')
    }

    if (!isValidEmail(sanitizedEmail)) {
      throw createHttpError(400, 'Invalid employeeEmail format')
    }

    if (!isValidUsername(sanitizedUsername)) {
      throw createHttpError(400, 'Invalid employeeName format')
    }

    // Check if employeeName and employeeEmail already exist in the database
    const existingUserName = await EmployeeModel.findOne({
      employeeName: { $eq: sanitizedUsername },
    }).exec()
    if (existingUserName) {
      throw createHttpError(409, 'Username already taken')
    }

    const existingEmail = await EmployeeModel.findOne({ employeeEmail: { $eq: sanitizedEmail } }).exec()
    if (existingEmail) {
      throw createHttpError(409, 'Email already taken')
    }

    // Hash password and create a new user
    const passwordHashed = await bcrypt.hash(sanitizedPassword, 10)
    const newUser = await EmployeeModel.create({
      employeeName: sanitizedUsername,
      employeeEmail: sanitizedEmail,
      password: passwordHashed,
      status: sanitizedStatus,
    })

    // Store session data
    req.session.userId = newUser._id
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

interface LoginBody {
  employeeEmail: string
  password: string
}
export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (
  req,
  res,
  next
) => {
  const { employeeEmail, password } = req.body
  //Using a validator to sanitize user input
  const sanitizedEmail = validator.escape(employeeEmail).trim()
  const sanitizedPassword = validator.escape(password).trim()

  try {
    if (!sanitizedEmail || !sanitizedPassword) {
      throw createHttpError(400, 'Parameters missing')
    }

    // Validate employeeEmail format
    if (!isValidEmail(sanitizedEmail)) {
      throw createHttpError(400, 'Invalid employeeEmail format')
    }

    // Check if user exists in the database
    const user = await EmployeeModel.findOne({ employeeEmail: { $eq: sanitizedEmail } })
      .select('+password +employeeName')
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
