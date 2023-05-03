import { RequestHandler } from 'express'
import QuestionModel, { SectionI } from '../data_models/questions'

// Get all questions
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const questionsAll = await QuestionModel.find().exec()
    res.status(200).json(questionsAll)
  } catch (error) {
    next(error)
  }
}

// Insert questions into the database
export const insertSections: RequestHandler = async (req, res, next) => {
  try {
    const sections: SectionI[] = req.body.sections

    // Insert sections and questions
    const insertedSections = await QuestionModel.insertMany(sections)

    res.status(200).json(insertedSections)
  } catch (error) {
    next(error)
  }
}
