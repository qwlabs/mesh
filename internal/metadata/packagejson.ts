import fg from 'fast-glob'
import fs from "fs-extra";
import path, {join} from "path";
import {loadPackages, pathFor} from "./utils";

const FILES_COPY_ROOT: string[] = [
  // 'LICENSE',
]

const FILES_COPY_LOCAL = [
  'README.md',
  'index.json',
]

export const updatePackageJSON = async (): Promise<void> => {
  const rootPackageJSON = await fs.readJSON('package.json')
  const packagesDir = pathFor('packages')
  for (const name of loadPackages()) {
    const packageDir = join(packagesDir, name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)
    packageJSON.name = `@mesh/${name}`
    packageJSON.version = rootPackageJSON.version
    packageJSON.author = 'qwlabs'
    packageJSON.homepage = `https://github.com/qwlabs/mesh/-/blob/${name}/README.md`
    packageJSON.repository = {
      type: 'git',
      url: 'git@github.com:qwlabs/mesh.git',
      directory: `packages/${name}`,
    }
    packageJSON.publishConfig = {
      "registry": "https://registry.npmjs.org/"
    }
    await fs.writeJSON(packageJSONPath, packageJSON, {spaces: 2})
  }
}

export const buildDistPackageJson = async (version: string): Promise<void> => {
  for (const name of loadPackages()) {
    const packageRoot = pathFor('packages', name)
    const packageDist = path.resolve(packageRoot, 'dist')

    for (const file of FILES_COPY_ROOT) {
      await fs.copyFile(pathFor(file), path.join(packageDist, file))
    }

    const files = await fg(FILES_COPY_LOCAL, {cwd: packageRoot})
    for (const file of files) {
      await fs.copyFile(path.join(packageRoot, file), path.join(packageDist, file))
    }

    const packageJSON = await fs.readJSON(path.join(packageRoot, 'package.json'))
    for (const key of Object.keys(packageJSON.dependencies || {})) {
      if (key.startsWith('@mesh/')) {
        packageJSON.dependencies[key] = version
      }
    }
    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, {spaces: 2})
  }
}
