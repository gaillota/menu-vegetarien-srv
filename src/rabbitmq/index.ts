import * as amqp from 'amqplib';
import { CLOUDAMQP_URL } from '../env';
import * as globCb from 'glob';
import * as path from 'path';
import * as util from 'util';
import { Queue } from '../types';

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
  const conn = await amqp.connect(CLOUDAMQP_URL)
  channel = await conn.createChannel()

  await initTopology()

  const workerPaths = await glob('/*.js', { root: path.join(__dirname, '../workers') })
  const workers = workerPaths.map(require)

  for (const worker of workers) {
    await channel.consume(worker.queue, async(message) => {
      try {
        const content = message.content.toString()
        const parsed = JSON.parse(content)

        await worker.work(parsed)

        await channel.ack(message)
      } catch (error) {
        return channel.nack(message, false, false)
      }
    })
  }
}

export async function sendToQueue(queue: Queue, message: object): Promise<void> {
  if (!channel) {
    throw new Error('Call initRabbit first')
  }

  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true, })
}
