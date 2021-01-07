require('dotenv').config()
import { Signale } from 'signale'
import { initRabbit } from './rabbitmq'

const signale = new Signale({ scope: 'workers' })

initRabbit()
  .then(() => {
    signale.success(`🐇 Ready to consume that dope`)
  })
  .catch((error) => {
    signale.error(`❌ Could not init workers`)
    signale.error(error)
  })
