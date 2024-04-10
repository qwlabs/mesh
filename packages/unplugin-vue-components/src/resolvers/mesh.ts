import type {ComponentResolver, SideEffectsInfo} from 'unplugin-vue-components'
import {kebabCase} from 'unplugin-vue-components'

interface IMatcher {
  pattern: RegExp
  styleDir: string
}

const matchComponents: IMatcher[] = [
  {
    pattern: /^WithEmpty/,
    styleDir: 'with-empty',
  },
  {
    pattern: /^ExceptionPage/,
    styleDir: 'exception-page',
  }
]

export interface HDDesignResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'
  /**
   * resolve `@mesh' icons
   *
   * requires package `@mesh/icons-vue`
   *
   * @default false
   */
  resolveIcons?: boolean

  /**
   * @deprecated use `importStyle: 'css'` instead
   */
  importCss?: boolean
  /**
   * @deprecated use `importStyle: 'less'` instead
   */
  importLess?: boolean

  /**
   * use commonjs build default false
   */
  cjs?: boolean

  /**
   * rename package
   *
   * @default '@mesh'
   */
  packageName?: string
}

function getStyleDir(compName: string): string {
  let styleDir
  const total = matchComponents.length
  for (let i = 0; i < total; i++) {
    const matcher = matchComponents[i]
    if (compName.match(matcher.pattern)) {
      styleDir = matcher.styleDir
      break
    }
  }
  if (!styleDir) {
    styleDir = kebabCase(compName)
  }
  return styleDir
}

function getSideEffects(compName: string, options: HDDesignResolverOptions): SideEffectsInfo {
  const {
    importStyle = true,
    importLess = false,
  } = options

  if (!importStyle) {
    return
  }
  const lib = options.cjs ? 'lib' : 'es'
  const packageName = options?.packageName || '@mesh/ui'

  if (importStyle === 'less' || importLess) {
    const styleDir = getStyleDir(compName)
    return `${packageName}/dist/${styleDir}/style`
  } else {
    const styleDir = getStyleDir(compName)
    return `${packageName}/dist/${styleDir}/style/css`
  }
}

const primitiveNames = ['ExceptionPage', 'WithEmpty']
const prefix = 'Hd'

let hdDesignNames: Set<string>

function genAntdNames(primitiveNames: string[]): void {
  hdDesignNames = new Set(primitiveNames.map(name => `${prefix}${name}`))
}

genAntdNames(primitiveNames)

function isHDDesign(compName: string): boolean {
  return hdDesignNames.has(compName)
}

export function HDDesignVueResolver(options: HDDesignResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (options.resolveIcons && name.match(/(Outlined|Filled|TwoTone)$/)) {
        return {
          name,
          from: '@mesh/icons-vue',
        }
      }
      if (isHDDesign(name) && !options?.exclude?.includes(name)) {
        const { cjs = false, packageName = '@mesh/ui' } = options
        const path = `${packageName}/${cjs ? 'lib' : 'es'}`
        return {
          name: name,
          from: path,
          sideEffects: getSideEffects(name, options),
        }
      }
    },
  }
}
