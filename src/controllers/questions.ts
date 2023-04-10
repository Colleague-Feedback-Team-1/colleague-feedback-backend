import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import SectionModel from '../data_models/questions'
import { SectionI, QuestionI } from '../data_models/questions'
import validator from 'validator'
import mongoose from 'mongoose'

export const getAll: RequestHandler = async (req, res, next) => {
    try {
      const questionsAll = await SectionModel.find().exec()
      res.status(200).json(questionsAll)
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error)
    }
  }
