import { SchemaDirectiveVisitor } from 'apollo-server'
import { defaultFieldResolver, GraphQLField } from 'graphql'

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<never, never>): void {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (...args) => {
      const [, , ctx] = args
      const { user } = ctx

      if (!user) {
        throw new Error('You must be authenticated to access this resource')
      }

      return resolve.apply(this, args)
    }
  }
}
