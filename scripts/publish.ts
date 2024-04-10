import path from 'path'
import { execSync } from 'child_process'
import consola from 'consola'
import {loadPackages} from "../internal";
import { version } from '../package.json'

execSync('npm run build', { stdio: 'inherit' })

let command = `npm publish --access public --//registry.npmjs.org/:_authToken=AUTH_TOKEN`

if (version.includes('beta')) {
  command += ' --tag beta'
}

for (const name of loadPackages()) {

  execSync(command, { stdio: 'inherit', cwd: path.join('packages', name, 'dist') })
  consola.success(`Published @mesh/${name}`)
}
