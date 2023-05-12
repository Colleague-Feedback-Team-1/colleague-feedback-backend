import express from 'express'
import * as EmployeeController from '../controllers/employees'
import { createSession } from '../utils/createSession'

const router = express.Router()

// Gets the currently authenticated employee
router.get('/verify', createSession(), EmployeeController.getAuthenticatedEmployee)
// Gets all employees
router.get('/all-employees', EmployeeController.getAllEmployees)
// Gets an employee by id
router.get('/:id', EmployeeController.getEmployeeById)
//Destroys the session and logs the user out
router.post('/logout', EmployeeController.logout)

export default router
