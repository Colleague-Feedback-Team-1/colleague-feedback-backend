import { InferSchemaType, Schema, model } from 'mongoose'

const employeeSchema = new Schema({
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
