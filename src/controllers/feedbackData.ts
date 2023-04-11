import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import feedbackDataModel from '../data_models/feedbackData'
import { AnswerScoreI, AnswerBySectionI, FeedbackDataI } from '../data_models/feedbackData'
import validator from 'validator'

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
  const { requestid, employeeid, sections } = req.body
  if (!validator.isAlphanumeric(requestid) || !validator.isAlphanumeric(employeeid)) {
    return res.status(400).send('Invalid input data')
  }
  const sanitizedRequestId = validator.escape(requestid)
  const sanitizedEmployeeId = validator.escape(employeeid)
  for (const section of sections) {
    // Validate sectionName field
    if (!validator.whitelist(section.sectionName, 'a-zA-Z0-9\\s')) {
      res.status(400).send('Invalid sectionName')
      return
    }
    for (const question of section.questions) {
      // Validate question field
      if (
        question.score !== undefined &&
        (!validator.isInt(String(question.score), { min: 1, max: 5 }) || isNaN(question.score))
      ) {
        res.status(400).send('Invalid score')
        return
      }
      if (
        question.openFeedback !== undefined &&
        !validator.whitelist(question.openFeedback, 'a-zA-Z0-9\\s')
      ) {
        res.status(400).send('Invalid open feedback')
        return
      }
    }
  }

  const answersBySection: AnswerBySectionI[] = []

  // Calculate average scores for each section
  for (const section of sections) {
    const scores: number[] = []
    const openFeedback: string[] = []

    for (const question of section.questions) {
      if (question.score !== undefined) {
        scores.push(question.score)
      }
      if (question.openFeedback !== undefined) {
        openFeedback.push(question.openFeedback)
      }
    }

    const averageScore: number = scores.reduce((a, b) => a + b, 0) / scores.length

    const answerScore: AnswerScoreI = {
      average: averageScore,
      openFeedback: openFeedback,
    }

    // Store scores by section name
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

  // Check if feedback data with the given requestId already exists
  const existingFeedbackData = await feedbackDataModel.findOne({ requestId: sanitizedRequestId })

  if (existingFeedbackData) {
    res.status(409).send('Feedback data with this requestid already exists')
    return
  }

  // Create new feedback data
  const newFeedbackData: FeedbackDataI = {
    requestId: sanitizedRequestId,
    employeeId: sanitizedEmployeeId,
    answersBySection: answersBySection,
  }

  try {
    await feedbackDataModel.create(newFeedbackData)
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
}

//Update feedback data
export const updateFeedbackData: RequestHandler<
  unknown,
  unknown,
  FeedbackRequestI,
  unknown
> = async (req, res, next) => {
    const { requestid, employeeid, sections } = req.body
    if (!validator.isAlphanumeric(requestid) || !validator.isAlphanumeric(employeeid)) {
      return res.status(400).send('Invalid input data')
    }
    const sanitizedRequestId = validator.escape(requestid)
    const sanitizedEmployeeId = validator.escape(employeeid)
    for (const section of sections) {
      // Validate sectionName field
      if (!validator.whitelist(section.sectionName, 'a-zA-Z0-9\\s')) {
        res.status(400).send('Invalid sectionName')
        return
      }
      for (const question of section.questions) {
        // Validate question field
        if (
          question.score !== undefined &&
          (!validator.isInt(String(question.score), { min: 1, max: 5 }) || isNaN(question.score))
        ) {
          res.status(400).send('Invalid score')
          return
        }
        if (
          question.openFeedback !== undefined &&
          !validator.whitelist(question.openFeedback, 'a-zA-Z0-9\\s')
        ) {
          res.status(400).send('Invalid open feedback')
          return
        }
      }
    }
  const answersBySection: AnswerBySectionI[] = []

  // Check if the request contains data
  if (!sections || sections.length === 0) {
    return res.sendStatus(400)
  }

  // Loop through each section in the request
  sections.forEach((section) => {
    const { questions } = section
    const scores: number[] = []
    const openFeedback: string[] = []

    // Loop through each question in the section
    questions.forEach((question) => {
      if (question.score !== undefined) {
        scores.push(question.score)
      }
      if (question.openFeedback !== undefined) {
        openFeedback.push(question.openFeedback)
      }
    })

    // Calculate the average score for the section
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length

    // Create an AnswerScoreI object for the section
    const answerScore: AnswerScoreI = {
      average: averageScore,
      openFeedback: openFeedback,
    }

    // Check if the section already exists in answersBySection array
    const existingSectionIndex = answersBySection.findIndex(
      (answerBySection) => answerBySection.sectionName === section.sectionName
    )

    if (existingSectionIndex !== -1) {
      // Add the AnswerScore object to the existing section
      answersBySection[existingSectionIndex].score.push(answerScore)
    } else {
      // Create a new AnswerBySection object for the section
      const answerBySection: AnswerBySectionI = {
        sectionName: section.sectionName,
        score: [answerScore],
      }
      answersBySection.push(answerBySection)
    }
  })

  // Create a new FeedbackData object
  const newFeedbackData: FeedbackDataI = {
    requestId: sanitizedRequestId,
    employeeId: sanitizedEmployeeId,
    answersBySection: answersBySection,
  }

  try {
    // Find the existing feedback data by requestId
    const existingData = await feedbackDataModel.findOne({ requestId: newFeedbackData.requestId })

    if (!existingData) {
      throw createHttpError(404, 'Feedback data not found')
    }

    // Merge the new feedback data with the existing data
    newFeedbackData.answersBySection.forEach((newSection) => {
      const { sectionName, score } = newSection
      const existingSection = existingData.answersBySection.find(
        (existingSection: { sectionName: string }) => existingSection.sectionName === sectionName
      )

      if (existingSection) {
        // Add the scores from the new section to the existing section
        existingSection.score.push(...score)
      } else {
        // Add the new section data to the existing data
        existingData.answersBySection.push(newSection)
      }
    })

    // Save the updated feedback data
    await existingData.save()
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
