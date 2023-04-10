import { RequestHandler } from 'express'
import SectionModel from '../data_models/questions'


export const getAll: RequestHandler = async (req, res, next) => {
    try {
      const questionsAll = await SectionModel.find().exec()
      res.status(200).json(questionsAll)
    } catch (error) {
      next(error)
    }
  }
