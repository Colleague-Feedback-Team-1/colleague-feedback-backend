import express from 'express'
import * as notificationController from '../controllers/notifications'


const router = express.Router()

router.get('/', notificationController.getAllNotifications)
router.post("/insert-notification", notificationController.insertNotification)


export default router
