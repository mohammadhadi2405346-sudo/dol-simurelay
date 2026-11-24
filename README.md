# DOL Simurelay: Belajar Mandiri (Situs "Satu Akses")

Situs statis (HTML, CSS, JavaScript; tanpa build) yang menyatukan E-Modul DOL, 8 video tutorial, tautan aplikasi Simurelay, dan chatbot asisten belajar "Kak Relay".

## Struktur

```
index.html            halaman tunggal, 6 bagian (hash routing)
api/chat.js           fungsi server Vercel: meneruskan chat ke Gemini API (key dari env var)
api/_kb.js            hasil generate dari folder kb/ (jangan diedit langsung)
kb/                   system-prompt.txt dan basis-pengetahuan.md (sumber isi bot)
scripts/build-kb.js   membuat ulang api/_kb.js: node scripts/build-kb.js
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

## Chatbot Gemini API (tertanam di situs)

API key **tidak boleh** ditulis di berkas mana pun di repositori ini. Key disimpan di Vercel.

1. Buat key di https://aistudio.google.com (menu **Get API key**). Jangan dibagikan.
2. Di Vercel: **Project → Settings → Environment Variables**, tambahkan:
   - `GEMINI_API_KEY` = key Anda (centang Production, Preview, dan Development)
   - `GEMINI_MODEL` (opsional) = id model, mis. `gemini-2.5-flash`. Lihat daftar model terbaru di AI Studio.
3. **Deployments → Redeploy** (perubahan variabel baru berlaku setelah deploy ulang).
4. Mengubah perilaku bot: edit `kb/system-prompt.txt` atau `kb/basis-pengetahuan.md`, jalankan `node scripts/build-kb.js`, lalu commit `api/_kb.js`.
5. Jika key terlanjur bocor: hapus key di AI Studio, buat yang baru, perbarui di Vercel.

Pengaman bawaan: data pribadi (nomor HP, NIK, email) dihapus di server sebelum dikirim ke Gemini; pembatas 15 pesan per menit per alamat; riwayat percakapan hanya di memori browser dan hilang saat halaman ditutup.

Catatan privasi: pada paket gratis Gemini API, isi percakapan dapat dipakai Google untuk meningkatkan produknya (cek halaman harga resmi). Karena itu jangan memasukkan data siswa, dan sebutkan hal ini di refleksi etika.
