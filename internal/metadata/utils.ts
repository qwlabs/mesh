import fg from "fast-glob";
import path from "path";
import {DIR_PACKAGES} from "./constant";

export const loadPackages = (): string[] => {
  return fg.sync(`*/src/index.ts`, {cwd: DIR_PACKAGES})
    .map(i => i.split('/')[0])
    .filter(i => !i.startsWith('_'))
}

export const pathFor = (...paths: string[]): string => {
  return path.resolve(process.cwd(), ...paths)
}
