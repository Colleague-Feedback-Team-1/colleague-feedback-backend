import { InferSchemaType, Schema, model } from 'mongoose'

export interface SignUpBody {
  employeeName?: string
  employeeEmail?: string
  password: string
  companyRole?: string
  profilePicture?: string
  privileges: 'Admin' | 'User' | 'Manager'
}

const employeeSchema = new Schema({
  employeeName: { type: String, required: true },
  employeeEmail: { type: String, required: true, unique:true },
  password: { type: String, required: true, select: false },
  companyRole: { type: String, required: true},
  profilePicture: { type: String },
  privileges: {
    type: String,
    enum: ['Admin', 'User', 'Manager'],
    required: true,
  },
})
type Employee = InferSchemaType<typeof employeeSchema>

export default model<Employee>('Employee', employeeSchema)
