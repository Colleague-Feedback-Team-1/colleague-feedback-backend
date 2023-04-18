import { InferSchemaType, Schema, model } from 'mongoose'

// export interface SignUpBody {
//   employeeName?: string
//   employeeEmail?: string
//   password: string
//   companyRole?: string
//   profilePicture?: string
//   privileges: 'Admin' | 'User' | 'Manager'
// }

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
