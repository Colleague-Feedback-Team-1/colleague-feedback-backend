import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import EmployeeModel from '../data_models/employee'
import validator from 'validator'
import mongoose from 'mongoose'

const extractUidFromDn = (dn: string): string | null => {
  const regex = /uid=([^,]+),/;
  const match = regex.exec(dn);
  return match ? match[1] : null;
};

export const getAuthenticatedEmployee: RequestHandler = async (req, res, next) => {
  // Check if userData is available in the session and then access the authenticated user DN
  const authenticatedDn = req.session.userData ? req.session.userData.dn : null;

  try {
    if (!authenticatedDn) {
      throw createHttpError(401, 'User not authenticated');
    }

    const uid = extractUidFromDn(authenticatedDn);

    if (!uid) {
      throw createHttpError(400, 'Invalid DN format');
    }

    const user = await EmployeeModel.findOne({ uid })
      .select('+email +description')
      .exec();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};



export const getEmployeeById: RequestHandler<{ id: string }, unknown, unknown, unknown> = async (
  req,
  res,
  next
) => {
  const employeeid = validator.escape(req.params.id)
  try {
    if (!mongoose.Types.ObjectId.isValid(employeeid)) {
      throw createHttpError(400, `Employee id: ${employeeid} is invalid `)
    }
    const user = await EmployeeModel.findById(employeeid)
      .select('+employeeEmail +companyRole')
      .exec()
    if (!user) {
      throw createHttpError(404, `Employee with id: ${employeeid} not found`)
    }
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const getAllEmployees: RequestHandler = async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find()
    res.status(200).json(employees)
  } catch (error) {
    next(error)
  }
}

// export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
//   req,
//   res,
//   next
// ) => {
//   const { employeeName, employeeEmail, password, companyRole, profilePicture, privileges } =
//     req.body
//   //No validation included as the function will be only used in production
//   try {
//     // Hash password and create a new user
//     const passwordHashed = await bcrypt.hash(password, 10)
//     const newEmployee = await EmployeeModel.create({
//       employeeName: employeeName,
//       employeeEmail: employeeEmail,
//       password: passwordHashed,
//       companyRole: companyRole,
//       profilePicture: profilePicture,
//       privileges: privileges,
//     })

//     // Store session data
//     req.session.userId = newEmployee._id
//     res.status(201).json(newEmployee)
//   } catch (error) {
//     next(error)
//   }
// }

// interface LoginBody {
//   employeeEmail: string
//   password: string
// }
// export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (
//   req,
//   res,
//   next
// ) => {
//   const { employeeEmail, password } = req.body
//   const sanitizedEmail = validator.escape(employeeEmail)
//   const sanitizedPassword = validator.escape(password).trim()

//   try {
//     if (!sanitizedEmail || !sanitizedPassword) {
//       throw createHttpError(400, 'Parameters missing')
//     }

//     if (!isValidEmail(sanitizedEmail)) {
//       throw createHttpError(400, 'Invalid email format')
//     }

//     const user = await EmployeeModel.findOne({ employeeEmail: { $eq: sanitizedEmail } })
//       .select('+password +employeeName')
//       .exec()

//     if (!user) {
//       throw createHttpError(401, 'Invalid credentials')
//     }

//     const passwordMatch = await bcrypt.compare(sanitizedPassword, user.password)
//     if (!passwordMatch) {
//       throw createHttpError(401, 'Invalid credentials')
//     }

//     // Store session data
//     req.session.userId = user._id

//     //Ignore user password
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: _, ...userRes } = user.toObject()

//     res.status(200).json(userRes)
//   } catch (error) {
//     next(error)
//   }
// }

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error)
    } else {
      res.sendStatus(200)
    }
  })
}
