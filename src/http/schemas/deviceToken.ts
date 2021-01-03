import * as Joi from 'joi'

export const DeviceTokenSchema = Joi.object({
  os: Joi.string(),
  token: Joi.string().token().required(),
})
