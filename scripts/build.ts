import assert from 'assert'
import { execSync as exec } from 'child_process'
import consola from 'consola'
import {buildDistPackageJson} from "../internal";
import { version } from '../package.json'


assert(process.cwd() !== __dirname)

async function build() {
  consola.info('Clean up')
  exec('pnpm run clean', { stdio: 'inherit' })

  consola.info('Fix types')
  exec('pnpm run types:fix', { stdio: 'inherit' })

  consola.info('Build packages')
  exec(`pnpm -r --filter=./packages/* run build`, { stdio: 'inherit' })

  await buildDistPackageJson(version)
}

async function cli() {
  try {
    await build()
  }
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export {
  build,
}

if (require.main === module) {
  cli()
}
