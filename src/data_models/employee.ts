import mongoose, { InferSchemaType, Schema, model } from 'mongoose'

const employeeSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  uid: String,
  displayName: String,
  givenName: String,
  uidNumber: Number,
  gidNumber: Number,
  mail: String,
  description: String,
})
type Employee = InferSchemaType<typeof employeeSchema>

export default model<Employee>('Employee', employeeSchema)
