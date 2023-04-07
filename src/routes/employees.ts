import express from 'express'
import * as EmployeeController from '../controllers/employees'

const router = express.Router()

router.get('/', EmployeeController.getAuthenticatedEmployee)
router.post('/signup', EmployeeController.signUp)
router.post('/login', EmployeeController.login)
router.post('/logout', EmployeeController.logout)

export default router
