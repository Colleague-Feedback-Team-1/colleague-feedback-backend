import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import feedbackDataModel from '../data_models/feedbackData'
import { AnswerScoreI, AnswerBySectionI, FeedbackDataI } from '../data_models/feedbackData'
import validator from 'validator'
import mongoose from 'mongoose'


export const getAll: RequestHandler = async (req, res, next) => {
    try {
      const toBeReviewedAll = await feedbackDataModel.find().exec()
      res.status(200).json(toBeReviewedAll)
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error)
    }
  }