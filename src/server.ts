require('dotenv').config()
import { Signale } from 'signale'
import { initRabbit } from './rabbitmq'
import { initRedis } from './redis'
import { initAlgolia } from './algolia'
import { initApollo } from './apollo'

const signale = new Signale({ scope: 'http' })

Promise.all([initApollo(), initRabbit(), initRedis(), initAlgolia()])
  .then(([server]) => {
    server.listen(process.env.PORT).then(({ url }) => {
      signale.success(`🚀  Server ready at ${url}`)
    })
  })
  .catch((error) => {
    signale.error(`❌ Could not init server`)
    signale.error(error)
  })
