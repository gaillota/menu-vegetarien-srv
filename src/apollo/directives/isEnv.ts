import { SchemaDirectiveVisitor } from 'apollo-server'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { ENV } from '../../env'

export default class IsEnvDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<never, never>): void {
    const { envName } = this.args
    const { resolve = defaultFieldResolver } = field

    field.resolve = async function (...args) {
      if (ENV !== envName) {
        throw new Error(`Method only allowed in ${envName}`)
      }

      return resolve.apply(this, args)
    }
  }
}
