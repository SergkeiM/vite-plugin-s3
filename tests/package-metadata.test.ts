import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('package metadata', () => {
  it('declares Vite 8 compatibility in peer dependencies', async () => {
    const packageJsonPath = new URL('../package.json', import.meta.url)
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
      peerDependencies?: Record<string, string>
    }

    expect(packageJson.peerDependencies?.vite).toContain('^8.0.0')
  })
})
