import { Schema, model, InferSchemaType } from 'mongoose'

interface RevieweeI {
  revieweeid: number
  revieweeName: string
  revieweeEmail: string
  role: string
  images: string
  feedbackSubmitted: boolean
}

interface ToBeReviewedI {
  employeeid: number
  employeeName: string
  employeeEmail: string
  selfReview: boolean
  dateRequested: string
  reviewees: RevieweeI[]
}

const RevieweeSchema = new Schema<RevieweeI>({
  revieweeid: { type: Number, required: true },
  revieweeName: { type: String, required: true },
  revieweeEmail: { type: String, required: true },
  role: { type: String, required: true },
  images: { type: String, required: true },
  feedbackSubmitted: { type: Boolean, required: true },
})

const ToBeReviewed = new Schema<ToBeReviewedI>(
  {
    employeeid: { type: Number, required: true },
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    selfReview: { type: Boolean, required: true },
    dateRequested: { type: String, required: true },
    reviewees: { type: [RevieweeSchema], required: true },
  },
  { timestamps: true }
)


type ToBeReviewed = InferSchemaType<typeof ToBeReviewed>;

export default model<ToBeReviewed>('ToBeReviewed', ToBeReviewed)


// const toBeReviewed = new Schema({
//     title: { type: String, required: true },
//     text: { type: String },
// }, { timestamps: true });

// type toBeReviewed = InferSchemaType<typeof toBeReviewed>;

// export default model<toBeReviewed>("toBeReviewed", toBeReviewed);
