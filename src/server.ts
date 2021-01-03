import * as signale from 'signale'
import { initRabbit } from './rabbitmq'
import { initRedis } from './redis'
import { initAlgolia } from './algolia'
import { initApollo } from './apollo'

Promise.all([initApollo(), initRabbit(), initRedis(), initAlgolia()])
  .then(([server]) => {
    server.listen().then(({ url }) => {
      signale.success(`🚀  Server ready at ${url}`)
    })
  })
  .catch((error) => {
    signale.error(error)
    signale.error(`Could not init server`)
  })
