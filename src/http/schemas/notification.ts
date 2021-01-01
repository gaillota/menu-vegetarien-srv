import * as Joi from 'joi'

export const NotificationSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string(),
  expiry: Joi.number(),
  type: Joi.valid('alert', 'background'),
})
