import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import RequestsModel from '../data_models/request'
import { RequestsI, ReviewerI } from '../data_models/request'
import validator from 'validator'
import mongoose from 'mongoose'

//Get all
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const requestsAll = await RequestsModel.find().exec()
    res.status(200).json(requestsAll)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}
export const getRequestsByEmployeeId: RequestHandler = async (req, res, next) => {
  const employeeid = validator.escape(req.params.employeeid)
  try {
    if (!mongoose.Types.ObjectId.isValid(employeeid)) {
      throw createHttpError(400, `Employee id: ${employeeid} is invalid `)
    }
    const requests = await RequestsModel.findOne({ employeeid }).exec()
    if (!requests) {
      throw createHttpError(404, `Requests of ${employeeid} not found`)
    }
    res.status(200).json(requests)
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error)
  }
}

//Get one request by requestid
export const getRequestByRequestId: RequestHandler = async (req, res, next) => {
  const requestid = validator.escape(req.params.requestid)
  try {
    if (!mongoose.Types.ObjectId.isValid(requestid)) {
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
//Insert a new request
export const insertRequest: RequestHandler<unknown, unknown, RequestsI, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const {
      employeeName,
      employeeEmail,
      assignedManagerid,
      assignedManagerName,
      confirmedByHR,
      selfReview,
      dateRequested,
      reviewers,
    } = req.body
    const sanitizedEmployeeid = validator.escape(req.body.employeeid)
    //Multiple requests?
    const existingRequest = await RequestsModel.findOne({ sanitizedEmployeeid }).exec()
    if (existingRequest) {
      throw createHttpError(
        409,
        `A request with employee id: ${sanitizedEmployeeid} already exists`
      )
    }
    // Validate input data
    if (!validator.isEmail(employeeEmail)) {
      throw createHttpError(400, 'Employee email is not valid')
    }

    // Sanitize input data
    const sanitizedEmployeeName = validator.trim(employeeName)
    const sanitizedEmployeeEmail = validator.normalizeEmail(employeeEmail)
    const sanitizedAssignedManagerName = validator.trim(assignedManagerName)
    const sanitizedDateRequested = validator.toDate(dateRequested)

    const employeeToBeReviewed = RequestsModel.create({
      employeeid: sanitizedEmployeeid,
      employeeName: sanitizedEmployeeName,
      employeeEmail: sanitizedEmployeeEmail,
      assignedManagerid: assignedManagerid,
      assignedManagerName: sanitizedAssignedManagerName,
      confirmedByHR: confirmedByHR,
      selfReview: selfReview,
      dateRequested: sanitizedDateRequested,
      reviewers,
    })
    res.status(200).json(employeeToBeReviewed)
  } catch (error) {
    next(error)
  }
}

//Delete a request
export const deleteRequest: RequestHandler = async (req, res, next) => {
  const requestid = req.params.requestid
  try {
    if (!mongoose.Types.ObjectId.isValid(requestid)) {
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
//Update statuses
export const updateSelfReviewStatus: RequestHandler<
  { requestid: string },
  unknown,
  { selfReview?: boolean; confirmedByHR?: boolean },
  unknown
> = async (req, res, next) => {
  const requestid = validator.escape(req.params.requestid)
  const { selfReview, confirmedByHR } = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(requestid)) {
      throw createHttpError(400, `Request id: ${requestid} is invalid `)
    }
    const request = await RequestsModel.findById(requestid).exec()
    if (!request) {
      throw createHttpError(404, `Request with ${requestid} not found`)
    }

    if (selfReview !== undefined) {
      request.selfReview = selfReview
    }

    if (confirmedByHR !== undefined) {
      request.confirmedByHR = confirmedByHR
    }

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
  const requestid = validator.escape(req.params.requestid)
  const newReviewers = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(requestid)) {
      throw createHttpError(400, `Request id: ${requestid} is invalid`)
    }

    const request = await RequestsModel.findById(requestid).exec()
    if (!request) {
      throw createHttpError(404, `Request with ${requestid} was not found`)
    }

    // Sanitize newReviewers array using validator
    const sanitizedReviewers = newReviewers.map((reviewer) => {
      return {
        reviewerid: validator.escape(reviewer.reviewerid),
        reviewerName: validator.escape(reviewer.reviewerName),
        reviewerEmail: validator.normalizeEmail(reviewer.reviewerEmail),
        role: validator.escape(reviewer.role),
        image: validator.escape(reviewer.image),
        feedbackSubmitted: reviewer.feedbackSubmitted,
      }
    })
    //Duplication check
    const currentReviewers = request.reviewers.map((reviewer) => reviewer.reviewerid)
    const duplicateReviewers = sanitizedReviewers.filter((reviewer) =>
      currentReviewers.includes(reviewer.reviewerid)
    )
    if (duplicateReviewers.length > 0) {
      throw createHttpError(
        400,
        `Duplicate reviewers found with ids: ${duplicateReviewers
          .map((reviewer) => reviewer.reviewerid)
          .join(', ')}`
      )
    }

    const updatedRequest: RequestsI | null = await RequestsModel.findByIdAndUpdate(
      requestid,
      { $push: { reviewers: { $each: sanitizedReviewers } } },
      { new: true }
    ).exec()

    if (updatedRequest) {
      res.status(200).json(updatedRequest)
    }
  } catch (error) {
    next(error)
  }
}
//Update to the feedback status
export const updateFeedbackSubmittedStatus: RequestHandler<
  { requestid: string; reviewerid: string },
  unknown,
  { feedbackSubmitted: boolean },
  unknown
> = async (req, res, next) => {
  const requestid = validator.escape(req.params.requestid)
  const reviewerid = validator.escape(req.params.requestid)

  const { feedbackSubmitted } = req.body

  try {
    if (!mongoose.Types.ObjectId.isValid(requestid)) {
      throw createHttpError(400, `Request id: ${requestid} is invalid`)
    }
    if (!mongoose.Types.ObjectId.isValid(requestid)) {
      throw createHttpError(400, `Reviewer id: ${reviewerid} is invalid`)
    }
    const request = await RequestsModel.findOneAndUpdate(
      { _id: requestid, 'reviewers._id': reviewerid },
      { $set: { 'reviewers.$.feedbackSubmitted': feedbackSubmitted } },
      { new: true }
    ).exec()
    if (!request) {
      throw createHttpError(404, `Request with id ${requestid} was not found`)
    }
    res.status(200).json(request)
  } catch (error) {
    next(error)
  }
}
