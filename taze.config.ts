import { defineConfig } from 'taze'

export default defineConfig({
  recursive: true,
  exclude: [],
  packageMode: {
    vue: 'minor',
  },
})
