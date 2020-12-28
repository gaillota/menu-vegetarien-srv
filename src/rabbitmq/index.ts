import * as amqp from 'amqplib'
import { CLOUDAMQP_URL } from '../env'
import * as globCb from 'glob'
import * as path from 'path'
import * as util from 'util'
import { Queue } from '../types'
import { Signale } from 'signale'
import * as chalk from 'chalk'

const signale = new Signale({ scope: 'rabbit' })

const glob = util.promisify(globCb)

let channel = null

async function initTopology(): Promise<void> {
  if (!channel) {
    throw new Error('Call initRabbit first')
  }

  for (const queue of Object.values(Queue)) {
    await channel.assertQueue(queue, { durable: true })
  }
}

export async function initRabbit(): Promise<void> {
  if (channel) {
    return Promise.resolve()
  }

  const conn = await amqp.connect(CLOUDAMQP_URL)
  channel = await conn.createChannel()

  await initTopology()

  const workerPaths = await glob('/*.js', {
    root: path.join(__dirname, '../workers'),
  })
  const workers = workerPaths.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const worker = require(p)

    const workerShortName = p.match(/\/(workers\/[^/]+\.js$)/)[1]

    if (!worker.queue) {
      throw new Error(
        chalk`Missing export {yellow queue} in worker {yellow ${workerShortName}}`,
      )
    }

    if (!worker.work) {
      throw new Error(
        chalk`Missing export {yellow work} in worker {yellow ${workerShortName}}`,
      )
    }

    return worker
  })

  for (const worker of workers) {
    await channel.consume(worker.queue, async (message) => {
      signale.await(
        chalk`Handling message from queue {yellow ${worker.queue}}...`,
      )
      try {
        const content = message.content.toString()
        const parsed = JSON.parse(content)

        await worker.work(parsed)

        await channel.ack(message)

        signale.success(
          chalk`Handled message from queue {yellow ${worker.queue}}, message is acked`,
        )
      } catch (error) {
        signale.error(error)
        signale.error(
          chalk`Error while handling message from queue {yellow ${worker.queue}}, message is nacked`,
        )

        return channel.nack(message, false, false)
      }
    })
  }
}

export async function sendToQueue(
  queue: Queue,
  message: unknown,
): Promise<void> {
  if (!channel) {
    throw new Error('Call initRabbit first')
  }

  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  })
}
