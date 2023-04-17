import express from 'express'
import * as RequestsController from '../controllers/requests'

const router = express.Router()

//get all
router.get('/', RequestsController.getAll)

//get all unconfirmed requests
router.get('/to-confirm', RequestsController.getUnconfirmedRequests)

//Add a new endpoint that gets all requests by employeeId
router.get('/by-employeeid/:employeeid', RequestsController.getRequestsByEmployeeId)

//get a request entry by id
router.get('/by-requestid/:requestid', RequestsController.getRequestByRequestId)

//add a request
router.post('/insert-request', RequestsController.insertRequest)

//update either selfReview field / confirmedByHR field or both of an employee document id
router.patch('/update-status/:requestid', RequestsController.updateSelfReviewStatus)

//delete a single request entry by document id
router.delete('/delete/:requestid', RequestsController.deleteRequest)

//insert reviewers into a request (works with a single Reviewer Object it just needs to be inside of an array)
router.patch('/insert-reviewers/:requestid', RequestsController.insertReviewers)

//updates the feedback submitted status based on request document id and reviewer document id
router.patch(
  '/update-status/:requestid/:reviewerid',
  RequestsController.updateFeedbackSubmittedStatus
)

export default router
