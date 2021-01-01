import { Context } from 'koa'
import { Schema, ValidationResult } from 'joi'

export function validateBody(schema: Schema) {
  return async function checkBodyMiddleware(
    ctx: Context,
  ): Promise<ValidationResult> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return schema.validateAsync(ctx.request.body)
  }
}
