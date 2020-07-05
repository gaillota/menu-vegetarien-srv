import * as https from 'http'
import * as signale from 'signale'
import { initHttp } from './http'
import { initRabbit } from './rabbitmq'
import { initRedis } from './redis'
import { initAlgolia } from './algolia'

Promise.all([initHttp(), initRabbit(), initRedis(), initAlgolia()])
  .then(([app]) => {
    https.createServer(app.callback()).listen(process.env.PORT || 3000, () => {
      signale.success(
        `🚀  Server ready at http://localhost:${process.env.PORT || 3000}`,
      )
    })
  })
  .catch((error) => {
    signale.error(error)
    signale.error(`Could not init server`)
  })
