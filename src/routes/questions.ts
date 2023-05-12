import express from 'express'
import * as QuestionsController from '../controllers/questions'

const router = express.Router()

//get all questions
router.get('/', QuestionsController.getAll)
//insert questions into the database
router.post('/insert-questions', QuestionsController.insertSections)

export default router
