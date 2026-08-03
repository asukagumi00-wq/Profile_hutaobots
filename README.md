# Hu Tao Bots — Full Cloudflare Worker

Project lengkap Cloudflare Worker + static assets.

## Struktur

```text
src/worker.js
public/index.html
public/404.html
public/assets/style.css
public/assets/app.js
public/assets/hutao-vibe.svg
public/assets/logo.svg
public/assets/default-avatar.svg
wrangler.toml
package.json
```

## Deploy dengan Wrangler

1. Install Node.js.
2. Buka terminal di folder ini.
3. Jalankan:

```bash
npm install
npx wrangler login
npx wrangler kv namespace create USER_PROFILES
```

Salin ID KV yang muncul, lalu masukkan ke `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "USER_PROFILES"
id = "ID_KV_KAMU"
```

Buat secret yang sama dengan ENV bot:

```bash
npx wrangler secret put PROFILE_API_KEY
```

Masukkan kunci rahasia panjang, lalu deploy:

```bash
npm run deploy
```

## ENV di bot Pterodactyl

```env
CF_PROFILE_URL=https://loginbotshutao.bothanz.workers.dev
CF_PROFILE_API_KEY=KUNCI_YANG_SAMA
```

## Deploy lewat Dashboard Cloudflare

Kalau tidak memakai Wrangler:

1. Buat Worker.
2. Upload project memakai Git repository atau Wrangler.
3. Buat KV namespace.
4. Tambahkan binding `USER_PROFILES`.
5. Tambahkan secret `PROFILE_API_KEY`.
6. Deploy ulang.

Untuk project banyak file dan static assets, Wrangler atau Git deployment lebih stabil daripada menempel satu file lewat editor dashboard.

## Endpoint

```text
PUT /api/profile/:nomor
GET /:nomor
GET /api/health
```

Contoh profil:

```text
https://loginbotshutao.bothanz.workers.dev/6283159118481
```

Background memakai aset SVG orisinal bernuansa merah, kupu-kupu, kabut, dan lentera agar terasa seperti tema Hu Tao tanpa bergantung pada hotlink gambar luar.
