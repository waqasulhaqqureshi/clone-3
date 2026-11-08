import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 5173)
const HOST = process.env.HOST || '0.0.0.0'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
}

async function isFile (p) {
  try {
    const s = await stat(p)
    return s.isFile() ? s : null
  } catch {
    return null
  }
}

/**
 * Resolve a URL pathname the way the live site does:
 *   /                     -> home.html
 *   /home                 -> home.html
 *   /web-developer        -> web-developer/index.html
 *   /web-developer/       -> web-developer/index.html
 *   /fonts/x.woff2        -> fonts/x.woff2
 */
async function resolve (pathname) {
  const clean = decodeURIComponent(pathname.split('?')[0].split('#')[0])
  const target = path.join(ROOT, path.normalize(clean))
  if (!target.startsWith(ROOT)) return null

  if (clean === '/' || clean === '') return { file: path.join(ROOT, 'home.html'), status: 200 }

  const candidates = [target]
  if (!path.extname(clean)) {
    candidates.push(target + '.html', path.join(target, 'index.html'))
  }
  if (clean.endsWith('/')) candidates.push(path.join(target, 'index.html'))

  for (const candidate of candidates) {
    const s = await isFile(candidate)
    if (s) return { file: candidate, status: 200, size: s.size }
  }

  // directory without trailing slash -> redirect so relative urls keep working
  try {
    const s = await stat(target)
    if (s.isDirectory()) return { redirect: clean + '/' }
  } catch {}

  return null
}

const server = createServer(async (req, res) => {
  const found = await resolve(req.url || '/')

  if (!found) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    res.end(`<!doctype html><meta charset="utf-8"><title>Not found</title>
<body style="font-family:system-ui;background:#E8E4E0;color:#1A1818;display:grid;place-items:center;height:100vh;margin:0">
<div style="text-align:center"><h1 style="font-size:2rem;margin:0 0 .5rem">404</h1>
<p style="color:#857878;margin:0">This page moved. <a href="/home" style="color:#1A1818">Go home</a></p></div>`)
    return
  }

  if (found.redirect) {
    res.writeHead(301, { location: found.redirect })
    res.end()
    return
  }

  const file = found.file
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream'
  const size = (await stat(file)).size
  const range = req.headers.range

  const base = {
    'content-type': type,
    'cache-control': 'no-cache',
    'access-control-allow-origin': '*',
  }

  // byte-range support so the <video> elements can stream and seek
  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range)
    if (match) {
      const start = match[1] ? Number(match[1]) : 0
      const end = match[2] ? Number(match[2]) : size - 1
      if (start >= size || end >= size || start > end) {
        res.writeHead(416, { ...base, 'content-range': `bytes */${size}` })
        res.end()
        return
      }
      res.writeHead(206, {
        ...base,
        'content-range': `bytes ${start}-${end}/${size}`,
        'accept-ranges': 'bytes',
        'content-length': end - start + 1,
      })
      if (req.method === 'HEAD') return res.end()
      createReadStream(file, { start, end }).pipe(res)
      return
    }
  }

  res.writeHead(200, {
    ...base,
    'content-length': size,
    'accept-ranges': 'bytes',
  })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file).pipe(res)
})

server.listen(PORT, HOST, () => {
  console.log(`rishi-thakor clone → http://${HOST}:${PORT}/home`)
})
