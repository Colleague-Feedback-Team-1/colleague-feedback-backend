import express from 'express'
import * as RequestsController from '../controllers/requests'

const router = express.Router()

//get all requests
router.get('/', RequestsController.getAll)

//get all unconfirmed requests (confirmedByHR = false)
router.get('/to-confirm', RequestsController.getUnconfirmedRequests)

//Add a new endpoint that gets all requests by employeeId (employeeid)
router.get('/by-employeeid/:employeeid', RequestsController.getRequestsByEmployeeId)

//get a request entry by id (requestid)
router.get('/by-requestid/:requestid', RequestsController.getRequestByRequestId)

//get requests by reviewer id (reviewerid)
router.get('/as-reviewer/:reviewerid', RequestsController.getRequestsByReviewerId)

//add a request entry to the database
router.post('/insert-request', RequestsController.insertRequest)

//update either selfReview field / confirmedByHR field or both of an employee document id (employeeid)
router.patch('/update-status/:requestid', RequestsController.updateSelfReviewStatus)

//Update manager and confirmed fields of a request document id (requestid)
router.patch('/update-manager/:requestid', RequestsController.updateAssignedManagerAndConfirmed)

//insert reviewers into a request (works with a single Reviewer Object it just needs to be inside of an array)
router.patch('/insert-reviewers/:requestid', RequestsController.insertReviewers)

//updates the feedback submitted status based on request document id and reviewer document id
router.patch(
  '/update-status/:requestid/:reviewerid',
  RequestsController.updateFeedbackSubmittedStatus
)

//delete a single request entry by document id
router.delete('/delete/:requestid', RequestsController.deleteRequest)

export default router
