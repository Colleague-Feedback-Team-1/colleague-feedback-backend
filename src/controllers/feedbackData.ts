import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import feedbackDataModel from '../data_models/feedbackData'
import { AnswerScoreI, AnswerBySectionI, FeedbackDataI } from '../data_models/feedbackData'
import validator from 'validator'
import mongoose from 'mongoose'

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const toBeReviewedAll = await feedbackDataModel.find().lean().exec()
    res.status(200).json(toBeReviewedAll)
  } catch (error) {
    next(error)
  }
}

export const getFeedbackDataByRequestId: RequestHandler<{ requestid: string }> = async (
  req,
  res,
  next
) => {
  const requestId = validator.escape(req.params.requestid)
  try {
    const feedbackData = await feedbackDataModel.findOne({ requestId }).exec()

    res.status(200).json(feedbackData)
  } catch (error) {
    next(error)
  }
}

interface FeedbackRequestI {
  requestid: string
  employeeid: string
  sections: {
    sectionName: string
    questions: {
      question: string
      score?: number
      openFeedback?: string
    }[]
  }[]
}

export const insertFeedbackData: RequestHandler<
  unknown,
  unknown,
  FeedbackRequestI,
  unknown
> = async (req, res, next) => {
  const { body } = req

  if (!body.requestid || !body.employeeid || !body.sections) {
    return next(createHttpError(400, 'Missing required data'))
  }
  const sanitizedRequestid = validator.escape(req.body.requestid)
  const sanitizedEmployeeid = validator.escape(req.body.employeeid)
  const answersBySection: AnswerBySectionI[] = []

  for (const section of body.sections) {
    const scores: number[] = []
    const openFeedback: string[] = []

    for (const question of section.questions) {
      if (question.score !== undefined) {
        scores.push(question.score)
      }
      if (question.openFeedback !== undefined) {
        openFeedback.push(validator.escape(question.openFeedback))
      }
    }

    if (scores.length === 0) {
      return next(createHttpError(400, `Missing scores for section ${section.sectionName}`))
    }

    const averageScore: number = scores.reduce((a, b) => a + b, 0) / scores.length

    const answerScore: AnswerScoreI = {
      average: averageScore,
      openFeedback: openFeedback,
    }

    const existingSectionIndex = answersBySection.findIndex(
      (answerBySection) => answerBySection.sectionName === section.sectionName
    )

    if (existingSectionIndex !== -1) {
      answersBySection[existingSectionIndex].score.push(answerScore)
    } else {
      const answerBySection: AnswerBySectionI = {
        sectionName: section.sectionName,
        score: [answerScore],
      }
      answersBySection.push(answerBySection)
    }
  }

  const newFeedbackData: FeedbackDataI = {
    requestId: sanitizedRequestid,
    employeeId: sanitizedEmployeeid,
    answersBySection: answersBySection,
  }

  try {
    const existingData = await feedbackDataModel.findOne({ requestId: newFeedbackData.requestId })

    if (existingData) {
      existingData.answersBySection.forEach(
        (existingAnswerBySection: { sectionName: string; score: AnswerScoreI[] }) => {
          const newAnswerBySectionIndex = newFeedbackData.answersBySection.findIndex(
            (newAnswerBySection) =>
              newAnswerBySection.sectionName === existingAnswerBySection.sectionName
          )

          if (newAnswerBySectionIndex !== -1) {
            const newAnswerScores = newFeedbackData.answersBySection[newAnswerBySectionIndex].score
            existingAnswerBySection.score.push(...newAnswerScores)
          }
        }
      )

      await existingData.save()
      res.sendStatus(200)
    } else {
      await feedbackDataModel.create(newFeedbackData)
      res.sendStatus(201)
    }
  } catch (error) {
    next(error)
  }
}
