import { Schema, model, InferSchemaType } from 'mongoose'

export interface AnswerScoreI {
  average: number
  openFeedback: string[]
}

export interface AnswerBySectionI {
  sectionName: string
  score: AnswerScoreI[]
}

export interface FeedbackDataI {
  requestId: string
  employeeId: string
  answersBySection: AnswerBySectionI[]
}

const answerScoreSchema: Schema = new Schema({
  average: { type: Number, required: true },
  openFeedback: { type: [String], required: true },
})

const answerBySectionSchema: Schema = new Schema({
  sectionName: { type: String, required: true },
  score: { type: [answerScoreSchema], required: true },
})

const feedbackData: Schema = new Schema({
  requestId: { type: String, required: true },
  employeeId: { type: String, required: true },
  answersBySection: { type: [answerBySectionSchema], required: true },
})

type feedbackData = InferSchemaType<typeof feedbackData>

export default model<feedbackData>('feedbackData', feedbackData)
