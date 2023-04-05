import express from 'express'
import * as QuestionsController from '../controllers/questions'

const router = express.Router()

//get all 
router.get("/", QuestionsController.getAll )