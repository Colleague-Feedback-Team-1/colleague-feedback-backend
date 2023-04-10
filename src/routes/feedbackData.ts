import express from 'express'
import * as feedbackDataController from '../controllers/feedbackData'

const router = express.Router()

//get all feedback data
router.get('/', feedbackDataController.getAll)
//insert feedback data OR update feedback data
router.post('/insert-feedback', feedbackDataController.insertFeedbackData)
router.patch('/insert-feedback/:requestid', feedbackDataController.updateFeedbackData)

//find data by request id
router.get('/:requestid', feedbackDataController.getFeedbackDataByRequestId)
export default router
