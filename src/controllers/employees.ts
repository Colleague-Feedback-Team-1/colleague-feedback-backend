import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import EmployeeModel from '../data_models/employee'
import validator from 'validator'
import mongoose from 'mongoose'

//Regex expression to extract uid from dn string
const extractUidFromDn = (dn: string): string | null => {
  const regex = /uid=([^,]+),/
  const match = regex.exec(dn)
  return match ? match[1] : null
}
// Get authenticated employee
export const getAuthenticatedEmployee: RequestHandler = async (req, res, next) => {
  // Check if userData is available in the session and then access the authenticated user DN
  const authenticatedDn = req.session.userData ? req.session.userData.dn : null

  try {
    if (!authenticatedDn) {
      throw createHttpError(401, 'User not authenticated')
    }

    const uid = extractUidFromDn(authenticatedDn)

    if (!uid) {
      throw createHttpError(400, 'Invalid DN format')
    }

    const user = await EmployeeModel.findOne({ uid }).select('+email +description').exec()

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// Get employee by id
export const getEmployeeById: RequestHandler<{ id: string }, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const employeeid = validator.escape(req.params.id)
  try {
    if (!mongoose.Types.ObjectId.isValid(employeeid)) {
      throw createHttpError(400, `Employee id: ${employeeid} is invalid `)
    }
    const user = await EmployeeModel.findById(employeeid)
      .select('+employeeEmail +companyRole')
      .exec()
    if (!user) {
      throw createHttpError(404, `Employee with id: ${employeeid} not found`)
    }
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
// Get all employees
export const getAllEmployees: RequestHandler = async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find()
    res.status(200).json(employees)
  } catch (error) {
    next(error)
  }
}
// Logout employee by destroying session
export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error)
    } else {
      res.sendStatus(200)
    }
  })
}
