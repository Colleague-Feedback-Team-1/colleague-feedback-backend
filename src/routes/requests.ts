import express from 'express'
import * as RequestsController from '../controllers/requests'

const router = express.Router()

//get all
router.get('/', RequestsController.getAll)

//get a request entry by id
router.get('/:requestid', RequestsController.getRequestById)

//add a request
router.post('/add-request', RequestsController.insertRequest)

//update self review field of an employee
router.patch('/update-status/:requestid', RequestsController.updateSelfReviewStatus)

//delete a single request entry by id
router.delete('/:requestid', RequestsController.deleteRequest)

//insert reviewers into a request
router.patch("/insert-reviewers/:requestid", RequestsController.insertReviewers)


export default router
