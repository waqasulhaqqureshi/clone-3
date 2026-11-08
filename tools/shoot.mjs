// Screenshot the site from a real browser (runs in the GitHub Actions runner,
// which has Chromium). Keeps the sandbox honest: what this shows is what a
// visitor sees.
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://127.0.0.1:5173'
const PREFIX = process.env.PREFIX || ''
mkdirSync('_shots', { recursive: true })

const report = []
const browser = await chromium.launch()

async function open({ width = 1440, height = 900, dark = false, url = '/home' }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: 'light',
  })
  await context.addInitScript((dark) => {
    try {
      if (dark) localStorage.setItem('rishi-mode', 'dark')
      else localStorage.removeItem('rishi-mode')
    } catch {}
  }, dark)

  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 200)}`) })
  page.on('requestfailed', (r) => errors.push(`404/failed: ${r.url().slice(-70)} ${r.failure()?.errorText || ''}`))
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url().slice(-70)}`) })

  await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForTimeout(2600) // let the intro loader finish
  return { context, page, errors }
}

async function shot(page, name) {
  await page.screenshot({ path: `_shots/${PREFIX}${name}.jpg`, type: 'jpeg', quality: 78 })
  return `_shots/${PREFIX}${name}.jpg`
}

const cases = []

// 1. home, desktop
{
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  const state = await page.evaluate(() => ({
    mode: document.documentElement.dataset.mode || 'light',
    ready: document.body.classList.contains('ready'),
    lite: document.documentElement.classList.contains('lite'),
    navVisible: !!document.querySelector('nav a'),
    hunger: !!document.querySelector('.hunger'),
  }))
  await shot(page, 'home-1440')
  cases.push({ case: 'home 1440', state, errors })
  await context.close()
}

// 2. home, their preview width
{
  const { context, page, errors } = await open({ width: 556, height: 762 })
  await shot(page, 'home-556')
  cases.push({ case: 'home 556', errors, state: await page.evaluate(() => ({ mode: document.documentElement.dataset.mode || 'light' })) })
  await context.close()
}

// 3. home in dark mode
{
  const { context, page, errors } = await open({ width: 1440, height: 900, dark: true })
  await shot(page, 'home-dark-1440')
  cases.push({ case: 'home dark 1440', errors })
  await context.close()
}

// 4. story section, desktop
{
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  await page.evaluate(() => document.getElementById('about').scrollIntoView())
  await page.waitForTimeout(1800)
  const metrics = await page.evaluate(() => {
    const s = document.querySelector('.story')
    const rail = document.querySelector('.story__rail')
    const clock = document.querySelector('.story__clock')
    const stage = document.querySelector('.story__stage')
    const rect = (el) => el ? el.getBoundingClientRect() : null
    return {
      railHeight: rail ? getComputedStyle(rail).height : null,
      railVar: rail ? getComputedStyle(rail).getPropertyValue('--rh') : null,
      stageCols: stage ? getComputedStyle(stage).gridTemplateColumns : null,
      clockPos: clock ? getComputedStyle(clock).position : null,
      storyHeight: s ? Math.round(s.getBoundingClientRect().height) : null,
      clockTop: rect(clock)?.top ?? null,
    }
  })
  await shot(page, 'story-1440')
  cases.push({ case: 'story 1440', metrics, errors })
  await context.close()
}

// 5. story section, their preview width
{
  const { context, page, errors } = await open({ width: 556, height: 762 })
  await page.evaluate(() => document.getElementById('about').scrollIntoView())
  await page.waitForTimeout(1800)
  await shot(page, 'story-556')
  cases.push({ case: 'story 556', errors })
  await context.close()
}

// 6. portrait hover, desktop
{
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  const box = await page.locator('#fig').boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.42)
    await page.waitForTimeout(120)
    for (let i = 0; i < 14; i++) {
      await page.mouse.move(box.x + box.width * (0.25 + i * 0.035), box.y + box.height * (0.3 + (i % 5) * 0.09))
      await page.waitForTimeout(45)
    }
  }
  const canvas = await page.evaluate(() => {
    const c = document.querySelector('#figCanvas')
    if (!c) return { present: false }
    const ctx = c.getContext('2d')
    let alpha = 0
    try {
      const d = ctx.getImageData(0, 0, c.width, c.height).data
      for (let i = 3; i < d.length; i += 4000) alpha += d[i]
    } catch { alpha = -1 }
    return { present: true, w: c.width, h: c.height, visible: getComputedStyle(c).visibility, alpha }
  })
  await shot(page, 'hover-portrait-1440')
  cases.push({ case: 'hover portrait', canvas, hasFig: !!box, errors })
  await context.close()
}

// 7. the doors wall
{
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  await page.evaluate(() => document.getElementById('works').scrollIntoView())
  await page.waitForTimeout(2200)
  await shot(page, 'doors-1440')
  cases.push({ case: 'doors 1440', errors })
  await context.close()
}

// 8. a door page
{
  const { context, page, errors } = await open({ width: 1440, height: 900, url: '/web-developer' })
  await shot(page, 'webdev-1440')
  cases.push({ case: 'web-developer 1440', errors })
  await context.close()
}

// 9. the door page at its canonical url
{
  const { context, page, errors } = await open({ width: 1440, height: 900, url: '/web-developer/' })
  const notFound = errors.filter((e) => e.includes('http 404'))
  await shot(page, 'webdev-canonical-1440')
  cases.push({ case: 'web-developer/ canonical', media404: notFound.length, sample: notFound.slice(0, 5), errors: [] })
  await context.close()
}

// 10. portrait hover on a narrow window (used to be switched off below 1024px)
{
  const { context, page } = await open({ width: 760, height: 900 })
  const box = await page.locator('#fig').boundingBox()
  if (box) {
    for (let i = 0; i < 14; i++) {
      await page.mouse.move(box.x + box.width * (0.25 + i * 0.035), box.y + box.height * (0.3 + (i % 5) * 0.09))
      await page.waitForTimeout(40)
    }
  }
  const canvas = await page.evaluate(() => {
    const c = document.querySelector('#figCanvas')
    if (!c) return { present: false }
    let alpha = 0
    try {
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
      for (let i = 3; i < d.length; i += 4000) alpha += d[i]
    } catch { alpha = -1 }
    return { present: true, w: c.width, h: c.height, alpha }
  })
  await shot(page, 'hover-760')
  cases.push({ case: 'hover 760', canvas, errors: [] })
  await context.close()
}

// 11. a door page with the stored dark preference
{
  const { context, page, errors } = await open({ width: 1440, height: 900, dark: true, url: '/web-developer/' })
  const mode = await page.evaluate(() => document.documentElement.dataset.mode || 'light')
  await shot(page, 'webdev-dark-1440')
  cases.push({ case: 'web-developer dark', mode, errors: [] })
  await context.close()
}

await browser.close()

writeFileSync(`_shots/${PREFIX}report.json`, JSON.stringify(cases, null, 2))
for (const c of cases) {
  console.log(`\n== ${c.case}`)
  if (c.state) console.log('  state:', JSON.stringify(c.state))
  if (c.metrics) console.log('  metrics:', JSON.stringify(c.metrics))
  if (c.canvas) console.log('  canvas:', JSON.stringify(c.canvas))
  for (const e of (c.errors || []).slice(0, 8)) console.log('  !', e)
}
