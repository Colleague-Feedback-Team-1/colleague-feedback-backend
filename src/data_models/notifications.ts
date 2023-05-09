import { Schema, model, InferSchemaType } from 'mongoose'

export type NotificationType =
  | 'confirmed-by-admin'
  | 'denied-by-admin'
  | 'create-new-request'
  | 'ask-for-feedback'
  | 'remind-give-feedback'
  | 'remind-create-request'
  | 'remind-self-review'
  | 'feedback-submitted'

export type Sender = {
  employeeid: string
  employeeName: string
}
export type Receiver = {
  employeeid: string
  employeeName: string
}
export interface NotificationI {
  date: string
  unread: boolean
  type: NotificationType
  sender: Sender[]
  receiver: Receiver[]
  requestid: string
}

const notificationTypeEnum = [
  'confirmed-by-admin',
  'denied-by-admin',
  'create-new-request',
  'ask-for-feedback',
  'remind-give-feedback',
  'remind-create-request',
  'remind-self-review',
  'feedback-submitted',
]

const senderSchema = new Schema({
  employeeid: { type: String, required: true },
  employeeName: { type: String, required: true },
})

const receiverSchema = new Schema({
  employeeid: { type: String, required: true },
  employeeName: { type: String, required: true },
})

const notificationSchema = new Schema({
  date: { type: String, required: true },
  unread: { type: Boolean, required: true },
  type: { type: String, required: true, enum: notificationTypeEnum },
  sender: { type: [senderSchema], required: true },
  receiver: { type: [receiverSchema], required: true },
  requestid: { type: String, required: true },
})


type Notification = InferSchemaType<typeof notificationSchema>

export default model<Notification>('notifications', notificationSchema)