// Static build: the site is already plain HTML/CSS/JS, so "building" is a
// faithful copy of the published files into dist/.
import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'dist')

const SKIP = new Set([
  '.git',
  '.github',
  'dist',
  'node_modules',
  'tools',
  'server.mjs',
  'build.mjs',
  'package.json',
  'package-lock.json',
  'README.md',
  'vercel.json',
  'netlify.toml',
  'goal.webm',
  'situation.avi',
])

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const { readdir } = await import('node:fs/promises')
for (const entry of await readdir(ROOT)) {
  if (SKIP.has(entry)) continue
  await cp(path.join(ROOT, entry), path.join(OUT, entry), { recursive: true })
}

console.log('built → dist/')
