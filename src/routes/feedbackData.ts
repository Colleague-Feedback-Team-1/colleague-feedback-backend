import express from 'express'
import * as feedbackDataController from '../controllers/feedbackData'

const router = express.Router()

//get all feedback data
router.get('/', feedbackDataController.getAll)
//insert feedback data 
router.post('/insert-feedback', feedbackDataController.insertFeedbackData)
//update feedback data 
router.patch('/insert-feedback', feedbackDataController.insertFeedbackData)
export default router
