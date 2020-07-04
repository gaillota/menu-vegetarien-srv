import { sendToQueue } from "../rabbitmq";
import { Queue } from "../types";

export const queue = Queue.RecipeParser

export async function parseRecipe(slug: string): Promise<void> {
  await sendToQueue(queue, slug)
}

export async function work(slug: string): Promise<void> {
  console.log(slug)
}
