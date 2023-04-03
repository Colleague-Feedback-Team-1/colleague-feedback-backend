import { Schema, model, InferSchemaType } from 'mongoose'

export interface ToBeReviewedI {
  employeeid: string
  employeeName: string
  employeeEmail: string
  selfReview: boolean
  dateRequested: string
  reviewees: {
    revieweeid: string
    revieweeName: string
    revieweeEmail: string
    role: string
    images: string
    feedbackSubmitted: boolean
  }[]
}

const ToBeReviewed = new Schema<ToBeReviewedI>(
  {
    employeeid: { type: String, required: true },
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    selfReview: { type: Boolean, required: true },
    dateRequested: { type: String, required: true },
    reviewees: [
      {
        revieweeid: String,
        revieweeName: String,
        revieweeEmail: String,
        role: String,
        images: String,
        feedbackSubmitted: Boolean,
      },
    ],
  },
  { timestamps: true, collection:"requests" }
)

type ToBeReviewed = InferSchemaType<typeof ToBeReviewed>

export default model<ToBeReviewed>('ToBeReviewed', ToBeReviewed)