import apn from 'apn'
import { Signale } from 'signale'
import { Queue, NotificationEmitter, NotificationType } from '../types'
import { sendToQueue } from '../rabbitmq'
import { apnProvider } from '../apn'
import { APN_APP_ID } from '../env'
import chalk from 'chalk'

export const queue = Queue.ApnDispatcher
const signale = new Signale({ scope: 'apn' })

export async function sendNotification(
  notificationEmitter: NotificationEmitter,
): Promise<void> {
  await sendToQueue(queue, notificationEmitter)
}

export async function work({
  devicesIds,
  notification: { title, body, expiry, type = NotificationType.Alert },
}: NotificationEmitter): Promise<void> {
  const notification = new apn.Notification({
    expiry,
    alert: {
      title,
      body,
    },
    pushType: type,
    topic: APN_APP_ID,
    payload: {
      sender: 'node-apn',
    },
  })

  const response = await apnProvider.send(notification, devicesIds)

  if (response.failed) {
    signale.fatal(
      chalk`{magenta Failed to deliver notification:} \n${JSON.stringify(
        { devicesIds, title, body, type },
        null,
        2,
      )}`,
    )
  }
}
