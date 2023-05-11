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
  senderid: string
  senderName: string
}
export type Receiver = {
  receiverid: string | null
  receiverName: string
}
export interface NotificationI {
  date: string
  type: NotificationType
  sender: Sender[]
  receiver: Receiver[]
  requestid: string | null
}

export const notificationTypeEnum = [
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
  senderid: { type: String, required: true },
  senderName: { type: String, required: true },
})

const receiverSchema = new Schema({
  receiverid: { type: String, default: null },
  receiverName: { type: String, required: true },
})

const notificationSchema = new Schema({
  date: { type: String, required: true },
  type: { type: String, required: true, enum: notificationTypeEnum },
  sender: { type: [senderSchema], required: true },
  receiver: { type: [receiverSchema], required: true },
  requestid: { type: String, default: null },
})

type Notification = InferSchemaType<typeof notificationSchema>

export default model<Notification>('notifications', notificationSchema)
