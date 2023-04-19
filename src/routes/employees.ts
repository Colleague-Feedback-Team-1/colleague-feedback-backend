import express from 'express'
import * as EmployeeController from '../controllers/employees'
import { createSession } from '../utils/createSession'

const router = express.Router()

router.get('/verify', createSession(), EmployeeController.getAuthenticatedEmployee)
router.get('/all-employees', EmployeeController.getAllEmployees)
router.get('/:id', EmployeeController.getEmployeeById)

//Login function is handled by the LDAP middleware

//Destroys the session and logs the user out
router.post('/logout', EmployeeController.logout)

export default router
