import type { App, Plugin } from '@vue/runtime-core'
import {INSTALLED_KEY} from "./keys";

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: any) => {
    // @ts-ignore
    if (app[INSTALLED_KEY]) {
      return
    }
    // @ts-ignore
    app[INSTALLED_KEY] = true

    components.forEach((c) => app.use(c))

    // if (options) provideGlobalConfig(options, app, true)
  }

  return {
    install,
  }
}




