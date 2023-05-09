import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import NotificationModel, { NotificationI } from '../data_models/notifications'
import validator from 'validator'
import mongoose from 'mongoose'

export const getAllNotifications: RequestHandler = async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find()
    res.status(200).json({ notifications })
  } catch (error) {
    next(error)
  }
}

export const getNotificationsByEmployeeId: RequestHandler = async (req, res, next) => {
  const employeeid = validator.escape(req.params.employeeid)
  try {
    if (!mongoose.Types.ObjectId.isValid(employeeid)) {
      throw createHttpError(400, `Employee id: ${employeeid} is invalid `)
    }
    const notifications = await NotificationModel.find({ 'receiver.employeeid': employeeid }).exec()
    if (!notifications) {
      throw createHttpError(404, `Notifications for ${employeeid} not found`)
    }
    res.status(200).json(notifications)
  } catch (error) {
    next(error)
  }
}

export const insertNotification: RequestHandler<unknown, unknown, NotificationI, unknown> = async (
  req,
  res,
  next
) => {
  const notificationData: NotificationI = req.body
  try {
    const newNotification = await NotificationModel.create(notificationData)
    res.status(201).json(newNotification)
  } catch (error) {
    next(error)
  }
}
