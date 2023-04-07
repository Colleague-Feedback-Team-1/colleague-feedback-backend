import express from 'express'
import * as feedbackDataController from '../controllers/feedbackData'

const router = express.Router()

router.get('/', feedbackDataController.getAll)

export default router
