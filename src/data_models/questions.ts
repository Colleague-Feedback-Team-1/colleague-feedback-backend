import { Schema, model, InferSchemaType } from 'mongoose'

export interface QuestionI {
  question: string
  isFreeForm: boolean
}
export interface SectionI {
  sectionName: string
  questions: QuestionI[]
}
const QuestionSchema = new Schema<QuestionI>({
  question: { type: String, required: true },
  isFreeForm: { type: Boolean, required: true },
})

const Section= new Schema<SectionI>({
  sectionName: { type: String, required: true },
  questions: { type: [QuestionSchema] },
})

type Question = InferSchemaType<typeof Section>

export default model<Question>("Question", Section)
