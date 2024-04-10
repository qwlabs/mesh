import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx";
import {join, resolve} from 'path'
import VueMacros from 'unplugin-vue-macros/vite'
import {defineConfig} from "vite";

const pkgRootPath = resolve(__dirname)
const outputESPath = resolve(__dirname, 'es')
const outputLibPath = resolve(__dirname, 'lib')


export default defineConfig({
  build: {
    target: 'modules',
    //打包文件目录
    // outDir: "es",
    //压缩
    // minify: true,
    //css分离
    //cssCodeSplit: true,
    rollupOptions: {
      //忽略打包vue文件
      external: [
        'vue',
        'vue-types',
        '@mesh/vue'
      ],
      input: [join(pkgRootPath, 'src/index.ts')],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          exports: 'named',
          dir: outputESPath,
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: outputLibPath,
        }
      ],
    },
    lib: {
      entry: resolve(pkgRootPath, 'src/index.ts'),
      // name: 'ui',
      // formats: ['es', 'cjs'],
    }
  },
  plugins: [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: false,
        }),
        vueJsx: vueJsx(),
      },
    })
  ],
})
