import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import NotificationModel, {
  NotificationI,
  notificationTypeEnum,
} from '../data_models/notifications'
import validator from 'validator'
import mongoose from 'mongoose'

export const getAllNotifications: RequestHandler = async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find()
    res.status(200).json(notifications)
  } catch (error) {
    next(error)
  }
}

export const getNotificationsByReceiverId: RequestHandler = async (req, res, next) => {
  const receiverid = validator.escape(req.params.receiverid)
  try {
    if (!mongoose.Types.ObjectId.isValid(receiverid)) {
      throw createHttpError(400, `Employee id: ${receiverid} is invalid `)
    }
    const notifications = await NotificationModel.find({ 'receiver.receiverid': receiverid }).exec()
    if (!notifications) {
      throw createHttpError(404, `Notifications for ${receiverid} not found`)
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
  try {
    const { type, date, sender, receiver, requestid } = req.body

    if (!type || !date || !sender || !receiver) {
      throw createHttpError(400, 'Missing required fields in request body')
    }

    if (!notificationTypeEnum.includes(type)) {
      throw createHttpError(400, `Invalid notification type: ${type}`)
    }

    if (!validator.isDate(date)) {
      throw createHttpError(400, `Invalid date: ${date}`)
    }

    if (
      !Array.isArray(sender) ||
      sender.length === 0 ||
      !sender.every((s) => s.senderid && s.senderName)
    ) {
      throw createHttpError(400, 'Invalid sender format')
    }

    if (
      !Array.isArray(receiver) ||
      receiver.length === 0 ||
      !receiver.every((r) => r.receiverid !== undefined && r.receiverName)
    ) {
      throw createHttpError(400, 'Invalid receiver format')
    }

    const notification: NotificationI = {
      type,
      date,
      sender,
      receiver,
      requestid: requestid || null,
    }

    const result = await NotificationModel.create(notification)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}
