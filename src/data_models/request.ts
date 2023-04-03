import { Schema, model, InferSchemaType } from 'mongoose'

export interface ReviewerI {
  reviewerid: string
  reviewerName: string
  reviewerEmail: string
  role: string
  image: string
  feedbackSubmitted: boolean
}
export interface RequestsI {
  employeeid: string
  employeeName: string
  employeeEmail: string
  assignedManagerid: string
  assignedManagerName: string
  selfReview: boolean
  dateRequested: string
  reviewers: ReviewerI[]
}
const ReviewerSchema = new Schema<ReviewerI>({
  reviewerid: { type: String, required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  feedbackSubmitted: { type: Boolean, required: true },
})
const Requests = new Schema<RequestsI>(
  {
    employeeid: { type: String, required: true },
    employeeName: { type: String, required: true },
    assignedManagerid: { type: String, required: true },
    assignedManagerName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    selfReview: { type: Boolean, required: true },
    dateRequested: { type: String, required: true },
    reviewers: { type: [ReviewerSchema] },
  },
  { timestamps: true, collection: 'requests' }
)

type Requests = InferSchemaType<typeof Requests>
type ReviewerSchema = InferSchemaType<typeof ReviewerSchema>

export default model<Requests>('Requests', Requests)
