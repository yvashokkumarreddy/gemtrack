import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

const RELOAD_KEY = 'gemtrack_chunk_reload'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

async function importWithRetry<M>(importer: () => Promise<M>, retries: number): Promise<M> {
  for (let attempt = 0; ; attempt++) {
    try {
      const module = await importer()
      sessionStorage.removeItem(RELOAD_KEY)
      return module
    } catch (error) {
      if (attempt >= retries) throw error
      await wait(400 * (attempt + 1))
    }
  }
}

// React.lazy for named exports, with protection against a failed download.
//
// After a new deploy, the old JavaScript files are gone, so a user with the
// app already open gets an error the first time they open a lazy page.
// We retry, and if it still fails we reload once to pick up the new version.
export function lazyRetry<K extends string>(
  importer: () => Promise<Record<K, ComponentType>>,
  exportName: K,
  retries = 2
): LazyExoticComponent<ComponentType> {
  return lazy(async () => {
    try {
      const module = await importWithRetry(importer, retries)
      return { default: module[exportName] }
    } catch (error) {
      // Reload only once, otherwise a real outage would reload forever
      if (sessionStorage.getItem(RELOAD_KEY) !== '1') {
        sessionStorage.setItem(RELOAD_KEY, '1')
        window.location.reload()
        return new Promise<never>(() => {}) // stay on the loader while reloading
      }
      throw error
    }
  })
}
