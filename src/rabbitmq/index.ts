import { Queue } from '../types';
import amqp from 'amqp';


export async function initTopology(): Promise<void> {
  const queues = Object.values(Queue)

  for (queue of queues) {

  }
}

export async function initRabbit(): Promise<void> {
}

export async function sendToQueue(queue: Queue, message: object): Promise<void> {

}
