import express from 'express'
import * as RequestsController from '../controllers/requests'

const router = express.Router()

//get all
router.get('/', RequestsController.getAll)

//get an employee entry by id
router.get('/:requestid', RequestsController.getRequestById)

//add an employee
router.post('/add-request', RequestsController.insertRequest)

//update self review filed of an employee
router.patch('/update-status/:requestid', RequestsController.updateSelfReviewStatus)

//delete a single employee entry by id
router.delete('/:requestid', RequestsController.deleteRequest)
export default router
