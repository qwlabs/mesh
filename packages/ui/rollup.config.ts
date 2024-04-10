// import * as path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import {loadRollupInput} from '@mesh/internal';
import VueMacros from 'unplugin-vue-macros/rollup'
// import { nodeResolve } from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

import {RollupOptions} from "rollup";

const configs: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: {
      format: 'esm',
      preserveModules: true,
      dir: 'es'
    },
    plugins: [
      VueMacros({
        setupComponent: true,
        setupSFC: true,
        plugins: {
          vue: vue({
            isProduction: false,
          }),
          vueJsx: vueJsx(),
        },
      }),
      // nodeResolve({
      //   extensions: ['.mjs', '.js', '.json', '.ts'],
      // }),
      // commonjs(),
      esbuild({
        sourceMap: true,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    treeshake: false,
  }
];


export default configs;
