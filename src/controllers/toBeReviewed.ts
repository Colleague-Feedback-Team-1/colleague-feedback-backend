import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import ToBeReviewedModel from '../data_models/toBeReviewed'
import { ToBeReviewedI } from '../data_models/toBeReviewed'
import validator from 'validator'
import { isValidEmail, isValidUsername } from '../utils/validators'
import mongoose from 'mongoose'
//needs validation and sanitazation
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const toBeReviewedAll = await ToBeReviewedModel.find().exec()
    res.status(200).json(toBeReviewedAll)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}

//Get one employee by an id
export const getReviewedEmployeeById: RequestHandler = async (req, res, next) => {
  const requestid = req.params.requestid
  try {
    if (!mongoose.isValidObjectId(requestid)) {
      throw createHttpError(400, `Employee id: ${requestid} is invalid `)
    }
    const employee = await ToBeReviewedModel.findById(requestid).exec()
    if (!employee) {
      throw createHttpError(404, `Employee with ${requestid} not found`)
    }
    res.status(200).json(employee)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}

//Insert an employee
export const insertEmployeeToBeReviewed: RequestHandler<
  unknown,
  unknown,
  ToBeReviewedI,
  unknown
> = async (req, res, next) => {
  try {
    // Extract the employee data from the request body
    const { employeeid, employeeName, employeeEmail, selfReview, dateRequested, reviewees } =
      req.body

    // Create a new instance of the EmployeeToBeReviewed model with the extracted data
    const employeeToBeReviewed = ToBeReviewedModel.create({
      employeeid: employeeid,
      employeeName: employeeName,
      employeeEmail: employeeEmail,
      selfReview: selfReview,
      dateRequested: dateRequested,
      reviewees: reviewees,
    })
    res.status(201).json(employeeToBeReviewed)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}

//Delete an employee
export const deleteEmployeeToBeReviewed: RequestHandler = async (req, res, next) => {
  const requestid = req.params.requestid
  try {
    if (!mongoose.isValidObjectId(requestid)) {
      throw createHttpError(400, `Employee id: ${requestid} is invalid `)
    }
    const employee = await ToBeReviewedModel.findById(requestid).exec()
    if (!employee) {
      throw createHttpError(404, `Employee with ${requestid} not found`)
    }
    await employee.deleteOne()
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

interface UpdateIdParams {
  requestid: string
}
interface UpdateData {
  selfReview: boolean
}
export const updateSelfReviewStatus: RequestHandler<
  UpdateIdParams,
  unknown,
  UpdateData,
  unknown
> = async (req, res, next) => {
  const requestid = req.params.requestid
  const newSelfReview = req.body.selfReview

  try {
    if (!mongoose.isValidObjectId(requestid)) {
      throw createHttpError(400, `Employee id: ${requestid} is invalid `)
    }
    const employee = await ToBeReviewedModel.findById(requestid).exec()
    if (!employee) {
      throw createHttpError(404, `Employee with ${requestid} not found`)
    }
    employee.selfReview = newSelfReview
    const updatedEmployeeData = await employee.save()

    res.status(200).json(updatedEmployeeData)
  } catch (error) {
    next(error)
  }
}
