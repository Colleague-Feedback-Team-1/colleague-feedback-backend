import express from 'express'
import * as toBeReviewedController from '../controllers/toBeReviewed'

const router = express.Router()

//get all
router.get('/', toBeReviewedController.getAll)

//get an employee entry by id
router.get('/:requestid', toBeReviewedController.getReviewedEmployeeById)

//add an employee
router.post('add-request', toBeReviewedController.insertEmployeeToBeReviewed)

//update self review filed of an employee
router.patch('/update-status/:requestid', toBeReviewedController.updateSelfReviewStatus)

//delete a single employee entry by id
router.delete('/:requestid', toBeReviewedController.deleteEmployeeToBeReviewed)
export default router
