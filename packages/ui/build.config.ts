import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: 'src',
      outDir: 'dist/lib',
      format: 'cjs',
      ext: 'js',
      declaration: true,
    },
    {
      builder: 'mkdist',
      input: 'src',
      outDir: 'dist/es',
      format: 'esm',
      ext: 'js',
      declaration: true,
    },
  ],
  failOnWarn: false,
  externals: [
    'vue',
    '@unocss/preset-mini/theme',
  ],
})
