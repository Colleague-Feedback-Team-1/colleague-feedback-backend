import { InferSchemaType, Schema, model } from 'mongoose'

const employeeSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String },
  profilePicture: { type: String },
  status: { type: String, required:true },
})

type Employee = InferSchemaType<typeof employeeSchema>

export default model<Employee>('Employee', employeeSchema)
