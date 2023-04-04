import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import RequestsModel from '../data_models/request'
import { RequestsI, ReviewerI } from '../data_models/request'
import validator from 'validator'
import { isValidEmail, isValidUsername } from '../utils/validators'
import mongoose from 'mongoose'

//needs validation and sanitazation
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const toBeReviewedAll = await RequestsModel.find().exec()
    res.status(200).json(toBeReviewedAll)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}

//Get one employee by an id
export const getRequestById: RequestHandler = async (req, res, next) => {
  const requestid = req.params.requestid
  try {
    if (!mongoose.isValidObjectId(requestid)) {
      throw createHttpError(400, `Request id: ${requestid} is invalid `)
    }
    const request = await RequestsModel.findById(requestid).exec()
    if (!request) {
      throw createHttpError(404, `Request with ${requestid} not found`)
    }
    res.status(200).json(request)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}

//Insert Request
export const insertRequest: RequestHandler<unknown, unknown, RequestsI, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const {
      employeeid,
      employeeName,
      employeeEmail,
      assignedManagerid,
      assignedManagerName,
      selfReview,
      dateRequested,
      reviewers,
    } = req.body

    // Create a new instance of the RequestModel with the extracted data
    const employeeToBeReviewed = RequestsModel.create({
      employeeid: employeeid,
      employeeName: employeeName,
      employeeEmail: employeeEmail,
      assignedManagerid: assignedManagerid,
      assignedManagerName: assignedManagerName,
      selfReview: selfReview,
      dateRequested: dateRequested,
      reviewers,
    })
    res.status(201).json(employeeToBeReviewed)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}

//Delete a request
export const deleteRequest: RequestHandler = async (req, res, next) => {
  const requestid = req.params.requestid
  try {
    if (!mongoose.isValidObjectId(requestid)) {
      throw createHttpError(400, `Employee id: ${requestid} is invalid `)
    }
    const employee = await RequestsModel.findById(requestid).exec()
    if (!employee) {
      throw createHttpError(404, `Employee with ${requestid} not found`)
    }
    await employee.deleteOne()
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

//Update self review status
export const updateSelfReviewStatus: RequestHandler<
  { requestid: string },
  unknown,
  { selfReview: boolean },
  unknown
> = async (req, res, next) => {
  const requestid = req.params.requestid
  const newSelfReview = req.body.selfReview

  try {
    if (!mongoose.isValidObjectId(requestid)) {
      throw createHttpError(400, `Request id: ${requestid} is invalid `)
    }
    const request = await RequestsModel.findById(requestid).exec()
    if (!request) {
      throw createHttpError(404, `Request with ${requestid} not found`)
    }
    request.selfReview = newSelfReview
    const updatedEmployeeData = await request.save()

    res.status(200).json(updatedEmployeeData)
  } catch (error) {
    next(error)
  }
}

//Insert an array of reviweres into a specific request
export const insertReviewers: RequestHandler<
  { requestid: string },
  unknown,
  ReviewerI[],
  unknown
> = async (req, res, next) => {
  const requestid = req.params.requestid
  const newReviewers = req.body
  try {
    if (!mongoose.isValidObjectId(requestid)) {
      throw createHttpError(400, `Request id: ${requestid} is invalid `)
    }
    const request = await RequestsModel.findById(requestid).exec()
    if (!request) {
      throw createHttpError(404, `Request with ${requestid} was not found`)
    }
    const updatedRequest: RequestsI | null = await RequestsModel.findByIdAndUpdate(
      requestid,
      { $push: { reviewers: { $each: newReviewers } } },
      { new: true }
    ).exec()
    if (updatedRequest) {
      res.status(200).json(updatedRequest)
    } else {
      res.status(404).send('Request not found')
    }
  } catch (error) {
    next(error)
  }
}
