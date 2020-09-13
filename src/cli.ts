require('dotenv').config()
import * as globCb from 'glob'
import * as path from 'path'
import * as util from 'util'
import * as chalk from 'chalk'
import { Signale } from 'signale'
import { program } from 'commander'
import { initRabbit } from './rabbitmq'
import { initRedis } from './redis'
import { initAlgolia } from './algolia'

const signale = new Signale({ scope: 'scripts' })

const glob = util.promisify(globCb)

async function init() {
  const scriptPaths = await glob('/*.js', {
    root: path.join(__dirname, './scripts'),
  })
  const scripts = scriptPaths.map((path) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const script = require(path)

    const scriptShortName = path.match(/\/(scripts\/([^/]+)\.js$)/)[2]

    script.name = scriptShortName

    if (!script.main) {
      throw new Error(
        chalk`Missing export {yellow main} function in script {yellow ${scriptShortName}}`,
      )
    }

    if (!script.description) {
      signale.warn(
        chalk`Missing {yellow description} for script {yellow ${scriptShortName}}`,
      )
    }

    return script
  })

  for (const script of scripts) {
    program
      .command(script.name)
      .description(script.description)
      .action(async () => {
        await Promise.all([initRabbit(), initRedis(), initAlgolia()])
        await script.main()
      })
  }

  return program.parseAsync(process.argv)
}

init()
