/* ===========================================================================
   sw.js — offline support.

   The app tells the patient, on screen, that it works with no internet. This
   file is what makes that sentence true. It caches the shell, the posters and
   the OCR assets on first visit and serves them from the cache afterwards.

   It caches GET requests for this origin only. It never touches /api/submit:
   a usage count is worth nothing once stale, and caching it would mean writing
   it to disk, which the privacy copy says does not happen.
   ========================================================================= */

const VERSION = 'pjhtpn-v1'
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => {}))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  /* Cache first for the things that never change within a build: posters,
     icons, hashed build assets, OCR data. */
  const immutable = /\/(posters|icons|assets|ocr)\//.test(url.pathname)

  if (immutable) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)) }
        return res
      }).catch(() => hit))
    )
    return
  }

  /* Network first for the document, so a redeploy is picked up, with the
     cache as the fallback when there is no connection. */
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)) }
      return res
    }).catch(() => caches.match(req).then(hit => hit || caches.match('/index.html')))
  )
})
