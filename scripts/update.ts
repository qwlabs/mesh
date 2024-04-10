import {updatePackageJSON} from "../internal";

async function run() {
  await Promise.all([
    updatePackageJSON(),
  ])
}

run()
