import { Schema, model, InferSchemaType } from 'mongoose'

export interface ReviewerI {
  reviewerid: string
  reviewerName: string
  reviewerEmail: string
  role: string

  feedbackSubmitted: boolean
}
export interface RequestsI {
  employeeid: string
  employeeName: string
  employeeEmail: string
  assignedManagerid: string
  assignedManagerName: string
  confirmedByHR: boolean
  selfReview: boolean
  dateRequested: string
  reviewers: ReviewerI[]
}
const ReviewerSchema = new Schema<ReviewerI>({
  reviewerid: { type: String, required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  role: { type: String, required: true },
  feedbackSubmitted: { type: Boolean, default: false },
})
const Requests = new Schema<RequestsI>(
  {
    employeeid: { type: String, required: true },
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    assignedManagerid: { type: String },
    assignedManagerName: { type: String },
    confirmedByHR: { type: Boolean, required: true, default: false },
    selfReview: { type: Boolean, required: true, default: false },
    dateRequested: { type: String, required: true },
    reviewers: { type: [ReviewerSchema], default: [] },
  },
  { timestamps: true, collection: 'requests' }
)

type Requests = InferSchemaType<typeof Requests>
type ReviewerSchema = InferSchemaType<typeof ReviewerSchema>

export default model<Requests>('Requests', Requests)
