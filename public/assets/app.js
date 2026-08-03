(() => {
  const p = window.__PROFILE__ || {}
  const fmt = new Intl.NumberFormat('id-ID')

  const put = (id, value) => {
    const el = document.getElementById(id)
    if (el) el.textContent = value
  }

  const date = value => {
    const n = Number(value)
    if (!Number.isFinite(n) || !n) return '-'
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(n))
  }

  const ago = value => {
    const diff = Math.max(0, Date.now() - Number(value || 0))
    const minute = Math.floor(diff / 60000)
    if (minute < 1) return 'Baru saja'
    if (minute < 60) return `${minute} menit lalu`
    const hour = Math.floor(minute / 60)
    if (hour < 24) return `${hour} jam lalu`
    return `${Math.floor(hour / 24)} hari lalu`
  }

  put('name', p.name || 'User')
  put('age', `${Number(p.age || 0)} tahun`)
  put('phone', p.phone || '-')
  put('registered', date(p.regTime))
  put('level', fmt.format(Number(p.level || 0)))
  put('money', fmt.format(Number(p.money || 0)))
  put('premium', p.premium ? 'Aktif' : 'Tidak')
  put('role', p.role || 'Newbie')
  put('exp-label', fmt.format(Number(p.exp || 0)))
  put('limit-label', `${fmt.format(Number(p.limit || 0))} / ${fmt.format(Number(p.maxLimit || 20))}`)
  put('total-command', fmt.format(Number(p.totalCommand || 0)))
  put('last-active', ago(p.lastActive))

  const level = Number(p.level || 0)
  const exp = Math.max(0, Number(p.exp || 0))
  const expTarget = Math.max(100, (level + 1) * 1000)
  const expPct = Math.min(100, Math.round((exp % expTarget) / expTarget * 100))
  const limitPct = Math.min(100, Math.round(Number(p.limit || 0) / Math.max(1, Number(p.maxLimit || 20)) * 100))

  requestAnimationFrame(() => {
    document.getElementById('exp-progress').style.width = `${expPct}%`
    document.getElementById('limit-progress').style.width = `${limitPct}%`
  })

  const bio = document.getElementById('bio')
  if (String(p.bio || '').trim()) {
    bio.textContent = p.bio
  } else {
    bio.classList.add('empty')
    bio.innerHTML = 'Belum ada bio.<br>Ketik <code>.addbio &lt;teks&gt;</code> di WhatsApp bot untuk menambahkan bio.'
  }

  const avatar = document.getElementById('profile-picture')
  avatar.addEventListener('error', () => {
    avatar.src = '/assets/default-avatar.svg'
  }, { once: true })
})()
