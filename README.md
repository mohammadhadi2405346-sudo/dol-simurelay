# DOL Simurelay: Belajar Mandiri (Situs "Satu Akses")

Situs statis (HTML, CSS, JavaScript; tanpa build) yang menyatukan E-Modul DOL, 8 video tutorial, tautan aplikasi Simurelay, dan chatbot asisten belajar "Kak Relay".

## Struktur

```
index.html            halaman tunggal, 6 bagian (hash routing)
assets/config.js      SEMUA pengaturan (tautan, video, nama bot) ada di sini
assets/app.js         logika navigasi, video, chatbot
assets/style.css      tampilan (mendukung mode gelap, responsif HP)
modul/                taruh PDF E-Modul di sini
vercel.json           pengaturan header Vercel
```

## Cara pakai

1. Salin PDF E-Modul **versi siswa** (tanpa kunci jawaban) ke `modul/E-Modul-DOL-Simurelay.pdf`.
2. Edit `assets/config.js`:
   - `botEmbed` / `botLink`: alamat chatbot dari platform pilihan.
   - `playStore` / `microsoftStore`: ganti dengan tautan resmi aplikasi.
   - `formUji`, `kontakGuru`: formulir uji coba dan kontak guru.
   - `video`: periksa 8 ID YouTube dengan PDF asli.
3. Uji lokal (opsional): `npx serve .` lalu buka alamat yang tampil.

## Unggah ke GitHub

```bash
git init
git add .
git commit -m "Situs Satu Akses DOL Simurelay"
git branch -M main
git remote add origin https://github.com/USERNAME/dol-simurelay.git
git push -u origin main
```

## Deploy di Vercel

1. Masuk ke vercel.com dengan akun GitHub, klik **Add New → Project**, pilih repositori ini.
2. **Framework Preset: Other**. Kosongkan Build Command dan Output Directory.
3. Klik **Deploy**. Alamat publik (mis. `dol-simurelay.vercel.app`) adalah tautan produk yang dikumpulkan.
4. Setiap `git push` berikutnya otomatis memperbarui situs.

## Catatan penting

- **Kunci jawaban:** jangan taruh kunci PG, pedoman skor uraian, atau hasil skenario uji LKPD di repositori publik atau PDF modul siswa.
- **Chatbot:** Custom Gem (Gemini) tidak bisa disematkan; pakai `botLink`. Chatbase, Mizou, SchoolAI, atau MagicSchool umumnya menyediakan kode sematan atau tautan berbagi. Jika iframe tampil kosong, platform memblokir sematan: pakai `botLink`.
- **PDF besar:** jika modul di atas ±50 MB atau tidak tampil di HP, unggah ke Google Drive, atur "Siapa saja yang memiliki link: Pelihat", lalu isi `modulPdf` dengan tautan berakhiran `/preview`.
- **Privasi:** situs tidak memakai login, cookie pelacak, atau analitik. Video memakai domain `youtube-nocookie.com`.
