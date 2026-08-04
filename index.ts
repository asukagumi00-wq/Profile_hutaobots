const DEFAULT_AVATAR = '/assets/default-avatar.svg'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  })
}

function htmlEscape(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function number(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function profileDocument(profile) {
  const safe = {
    phone: htmlEscape(profile.phone || ''),
    name: htmlEscape(profile.name || 'User'),
    age: number(profile.age ?? profile.umur, 0),
    bio: String(profile.bio || '').slice(0, 160),
    limit: Math.max(0, number(profile.limit, 0)),
    maxLimit: Math.max(1, number(profile.maxLimit, 20)),
    money: number(profile.money, 0),
    exp: Math.max(0, number(profile.exp, 0)),
    level: Math.max(0, number(profile.level, 0)),
    role: htmlEscape(profile.role || 'Newbie'),
    premium: Boolean(profile.premium),
    regTime: number(profile.regTime, 0),
    totalCommand: Math.max(0, number(profile.totalCommand, 0)),
    lastActive: number(profile.lastActive, Date.now()),
    profilePicture: htmlEscape(profile.profilePicture || DEFAULT_AVATAR),
    updatedAt: htmlEscape(profile.updatedAt || '')
  }

  const serialized = JSON.stringify(safe).replaceAll('<', '\\u003c')

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#120509">
  <meta name="description" content="Profil pengguna Hu Tao Bots">
  <title>${safe.name} • Hu Tao Bots</title>
  <link rel="icon" href="/assets/logo.svg">
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
  <div class="ambient ambient-one"></div>
  <div class="ambient ambient-two"></div>
  <div class="petals" aria-hidden="true"></div>

  <main class="page-shell">
    <header class="hero">
      <a class="brand" href="/" aria-label="Hu Tao Bots">
        <img src="/assets/logo.svg" alt="">
        <div>
          <strong><span>Hu Tao</span> Bots</strong>
          <small>WhatsApp User Profile</small>
        </div>
      </a>

      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img id="profile-picture" class="avatar" src="${safe.profilePicture}" alt="Foto profil WhatsApp">
        <span class="online-dot" title="Tersinkron"></span>
      </div>
    </header>

    <section class="glass identity-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">USER INFORMATION</p>
          <h1>Profil Pengguna</h1>
        </div>
        <span class="sync-badge"><i></i> Tersinkron</span>
      </div>

      <div class="info-grid">
        <article class="info-box">
          <span>Nama</span>
          <strong id="name"></strong>
        </article>
        <article class="info-box">
          <span>Umur</span>
          <strong id="age"></strong>
        </article>
        <article class="info-box">
          <span>Nomor WhatsApp</span>
          <strong id="phone"></strong>
        </article>
        <article class="info-box">
          <span>Terdaftar</span>
          <strong id="registered"></strong>
        </article>
      </div>
    </section>

    <section class="glass">
      <div class="section-heading compact">
        <div>
          <p class="eyebrow">ACCOUNT PROGRESS</p>
          <h2>Statistik</h2>
        </div>
      </div>

      <div class="stat-grid">
        <article class="stat-box">
          <span class="stat-icon">✦</span>
          <div><small>Level</small><strong id="level"></strong></div>
        </article>
        <article class="stat-box">
          <span class="stat-icon">₵</span>
          <div><small>Money</small><strong id="money"></strong></div>
        </article>
        <article class="stat-box">
          <span class="stat-icon">♛</span>
          <div><small>Premium</small><strong id="premium"></strong></div>
        </article>
        <article class="stat-box">
          <span class="stat-icon">◆</span>
          <div><small>Role</small><strong id="role"></strong></div>
        </article>
      </div>

      <div class="progress-block">
        <div class="progress-label"><span>EXP</span><strong id="exp-label"></strong></div>
        <div class="progress-track"><i id="exp-progress"></i></div>
      </div>
      <div class="progress-block">
        <div class="progress-label"><span>Limit</span><strong id="limit-label"></strong></div>
        <div class="progress-track"><i id="limit-progress"></i></div>
      </div>
    </section>

    <section class="glass">
      <div class="section-heading compact">
        <div>
          <p class="eyebrow">ABOUT USER</p>
          <h2>Bio</h2>
        </div>
      </div>
      <div id="bio" class="bio"></div>
    </section>

    <section class="glass">
      <div class="section-heading compact">
        <div>
          <p class="eyebrow">BOT ACTIVITY</p>
          <h2>Aktivitas</h2>
        </div>
      </div>
      <div class="info-grid">
        <article class="info-box">
          <span>Total Command</span>
          <strong id="total-command"></strong>
        </article>
        <article class="info-box">
          <span>Terakhir Aktif</span>
          <strong id="last-active"></strong>
        </article>
      </div>
    </section>

    <footer>
      <span>HanzOwner</span>
      <small>Hu Tao Bots Profile System</small>
    </footer>
  </main>

  <script>window.__PROFILE__=${serialized}</script>
  <script src="/assets/app.js" defer></script>
</body>
</html>`
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/^\/+|\/+$/g, '')

    if (url.pathname === '/api/health') {
      return json({ ok: true, service: 'Hu Tao Bots Profile', time: new Date().toISOString() })
    }

    const apiMatch = url.pathname.match(/^\/api\/profile\/(\d{7,20})\/?$/)
    if (apiMatch && request.method === 'PUT') {
      const auth = request.headers.get('authorization') || ''
      if (!env.PROFILE_API_KEY || auth !== `Bearer ${env.PROFILE_API_KEY}`) {
        return json({ ok: false, error: 'Unauthorized' }, 401)
      }

      let body
      try {
        body = await request.json()
      } catch {
        return json({ ok: false, error: 'Body harus JSON valid' }, 400)
      }

      const phone = apiMatch[1]
      const profile = {
        ...body,
        phone,
        name: String(body.name || 'User').slice(0, 40),
        bio: String(body.bio || '').slice(0, 160),
        updatedAt: new Date().toISOString()
      }

      await env.KV.put(phone, JSON.stringify(profile))
      return json({ ok: true, profileUrl: `${url.origin}/${phone}` })
    }

    if (/^\d{7,20}$/.test(path) && request.method === 'GET') {
      const raw = await env.KV.get(path)
      if (!raw) {
        return env.ASSETS.fetch(new Request(new URL('/404.html', url), request))
      }

      return new Response(profileDocument(JSON.parse(raw)), {
        headers: {
          'content-type': 'text/html; charset=UTF-8',
          'cache-control': 'no-store',
          'x-content-type-options': 'nosniff',
          'referrer-policy': 'no-referrer'
        }
      })
    }

    return env.ASSETS.fetch(request)
  }
}
