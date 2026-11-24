# BASIS PENGETAHUAN: E-Modul DOL Berbantuan Simurelay (kode baku)

Sumber tunggal fakta untuk asisten belajar Kak Relay. Bersumber dari E-Modul DOL versi siswa. Tidak memuat kunci jawaban soal atau LKPD.

## 1. Kode baku komponen dan terminal (IEC 60617)

| Kode | Komponen | Nama di Library Simurelay | Terminal |
| --- | --- | --- | --- |
| L1, L2, L3, N | Sumber 3 fasa dan netral | Power Phase L1 L2 L3 N | - |
| Q2 | MCB 3 fasa, pengaman utama daya (hubung singkat) | MCB 3P | 1-2, 3-4, 5-6 |
| Q1 | MCB 1 fasa, pengaman rangkaian kendali | MCB 1P | 1-2 |
| KM1 | Koil kontaktor | Kontaktor Coil | A1-A2 |
| KM1 | Kontak utama (3 kontak NO) | Kontaktor 3P | 1/L1-2/T1, 3/L2-4/T2, 5/L3-6/T3 |
| KM1 | Kontak bantu NO (pengunci) | Kontak Bantu NO | 13-14 |
| KM1 | Kontak bantu NC (tidak dipakai pada rangkaian baku) | Kontak Bantu NC | 21-22 |
| F1 | TOR 3 kutub (pengaman beban lebih) | Overload Relay 3P | 1/L1-2/T1, 3/L2-4/T2, 5/L3-6/T3 |
| F1 | Kontak NC TOR (seri jalur koil) | Kontak NC Overload Relay | 95-96 |
| F1 | Kontak NO TOR (jalur lampu Trip) | Kontak NO Overload Relay | 97-98 |
| S1 | Emergency Stop, NC, penguncian mekanis | Emergency Button | NC 11-12, NO 13-14 |
| S2 | Push button Stop, NC | Push Button NC | 1-2 |
| S3 | Push button Start, NO | Push Button NO | 3-4 |
| H1 | Lampu Run, hijau | Lampu | X1-X2 |
| H2 | Lampu Emergency, kuning | Lampu | X1-X2 |
| H3 | Lampu Trip, merah | Lampu | X1-X2 |
| M1 | Motor induksi 3 fasa | Motor 3 Fasa | U1, V1, W1 |

Catatan padanan kode lama: S0 = S2 (Stop); "S1 Start" = S3 (Start); lampu "Standby" tidak dipakai (kondisi siaga = semua lampu padam).

## 2. Konsep DOL, komponen, dan proteksi

- **DOL (Direct On Line)** menghubungkan motor induksi 3 fasa langsung ke tegangan jala-jala penuh lewat kontaktor, tanpa pengurangan tegangan (full voltage starting). Arus start sekitar 5-8 kali arus nominal (nilai tipikal), torsi start tinggi, rangkaian paling sederhana.
- **Rangkaian daya** menyalurkan energi 3 fasa: sumber, Q2, kontak utama KM1, F1, M1. **Rangkaian pengendali** bekerja pada tegangan fasa-netral (misalnya 220 V) dan mengatur kapan koil KM1 aktif.
- **Kecepatan sinkron** ns = 120 x f / p. Pada 50 Hz dan 4 kutub, ns = 1.500 rpm. Rotor berputar sedikit lebih lambat dari medan putar (ada slip), sehingga disebut motor asinkron.
- **Q2 (MCB 3P)** melindungi dari hubung singkat (elemen magnetik, seketika) dan arus lebih (elemen termal). **TOR F1** melindungi motor dari beban lebih yang berlangsung lama (bimetal); TOR tidak melindungi hubung singkat karena terlalu lambat. TOR trip untuk overload, MCB memutus hubung singkat.
- **Arus setelan TOR** disetel mendekati arus nominal pada pelat nama motor. Setelah trip, bimetal perlu dingin, lalu TOR di-reset.
- **S2 berjenis NC** agar fail-safe: kawat putus berarti rangkaian mati, bukan menyala tak terkendali.
- **S1 (Emergency Stop)** berjenis NC, bertombol jamur merah, dipasang seri pada jalur koil, terkunci mekanis, baru lepas bila diputar atau ditarik (stop category 0, IEC 60204-1).
- **Tegangan hilang lalu kembali:** koil lepas dan pengunci putus, sehingga motor tidak start sendiri (perlindungan terhadap restart tak disengaja).
- **Sebelum energize:** kabel terpasang benar, TOR disetel, S2 tidak tertekan, tidak ada orang di sekitar bagian berputar. Simulasi tidak memodelkan arus start, panas, getaran, dan keausan kontak; keterampilan tangan tetap dilatih di panel nyata.

| Gangguan | Pengaman | Cara kerja |
| --- | --- | --- |
| Hubung singkat | Q2 dan Q1 | Elemen magnetik membuka seketika |
| Beban lebih | F1 (TOR) | Bimetal membengkok, 95-96 membuka, koil mati, motor berhenti |
| Darurat | S1 | Kontak NC membuka dan terkunci, koil mati, KM1 lepas |
| Tegangan hilang lalu kembali | Pengunci KM1 13-14 | Motor tidak start sendiri |

## 3. Pengawatan rangkaian daya (P1-P12)

| Kawat | Dari | Ke |
| --- | --- | --- |
| P1, P2, P3 | L1, L2, L3 sumber | Q2 terminal 1, 3, 5 |
| P4, P5, P6 | Q2 terminal 2, 4, 6 | KM1 kontak utama 1/L1, 3/L2, 5/L3 |
| P7, P8, P9 | KM1 2/T1, 4/T2, 6/T3 | F1 1/L1, 3/L2, 5/L3 |
| P10, P11, P12 | F1 2/T1, 4/T2, 6/T3 | M1 U1, V1, W1 |

Aturan: kawat hanya bisa dibuat dari dot ke dot; jangan menyilangkan urutan L1-L2-L3 (mengubah arah putar motor). Daftar periksa: 12 kawat terpasang, tidak ada yang tersilang atau menggantung, urutan fasa benar, ujung tiap kawat tepat di dot.

## 4. Pengawatan rangkaian pengendali (C1-C17)

Titik acuan: **J** = keluaran Q1, **K** = keluaran F1 95-96, **A** = keluaran S2, **B** = titik temu keluaran S3 dan keluaran pengunci KM1 13-14 (masukan koil A1).

| Kawat | Dari | Ke | Fungsi |
| --- | --- | --- | --- |
| C1 | L1 sumber | Q1 masukan | Fasa masuk MCB kendali |
| C2 | Q1 keluaran (J) | F1 95-96 masukan | TOR pada jalur utama kendali |
| C3 | F1 95-96 keluaran (K) | S1 NC 11-12 masukan | Menuju Emergency |
| C4 | S1 keluaran | S2 masukan | Menuju Stop |
| C5 | S2 keluaran (A) | S3 masukan | Cabang 1: jalur start |
| C6 | S3 keluaran | KM1 13-14 keluaran (B) | Menyatukan cabang paralel |
| C7 | Titik B | Koil KM1 A1 | Menuju koil |
| C8 | Koil KM1 A2 | N | Penutup rangkaian koil |
| C9 | Titik K | S1 NO 13-14 masukan | Jalur lampu Emergency |
| C10 | Titik A | KM1 13-14 masukan | Cabang 2: pengunci, paralel dengan S3 |
| C11 | Titik B | H1 X1 | Lampu Run |
| C12 | H1 X2 | N | Penutup |
| C13 | S1 NO 13-14 keluaran | H2 X1 | Lampu Emergency |
| C14 | H2 X2 | N | Penutup |
| C15 | Titik J | F1 97-98 masukan | Jalur lampu Trip |
| C16 | F1 97-98 keluaran | H3 X1 | Lampu Trip |
| C17 | H3 X2 | N | Penutup |

Kesalahan paling umum: menyambung KM1 13-14 **seri** dengan S3, sehingga motor tidak pernah hidup. Pengunci harus **paralel** dengan S3 dan tersambung **setelah S2** (titik A).

## 5. Logika pengunci (latching) dan lampu indikator

- Persamaan koil: **KM1 = F1(95-96) AND S1 AND S2 AND (S3 OR KM1(13-14))**. Koil aktif bila semua pengaman tertutup (F1 tidak trip, S1 dan S2 tidak ditekan) dan salah satu jalur ada: S3 ditekan atau KM1 sudah aktif.
- Urutan: S3 ditekan, koil aktif, kontak utama menutup, motor berputar, kontak 13-14 menutup; S3 dilepas, koil tetap aktif lewat 13-14 (rangkaian "mengingat"); S2 ditekan, jalur koil terputus, KM1 lepas, 13-14 membuka, pengunci hilang.
- Pengunci dipasang **setelah S2** agar S2 memutus jalur S3 maupun jalur pengunci. Bila dipasang sebelum S2, tombol stop tidak bisa mematikan motor.
- Tanpa pengunci, motor hidup hanya selama S3 ditekan. Dengan pengunci seri S3, motor tidak pernah hidup.
- **Aturan lampu:** H1 (Run, hijau) menyala saat koil KM1 aktif; H2 (Emergency, kuning) menyala saat S1 ditekan; H3 (Trip, merah) menyala saat F1 trip (97-98 menutup). Kondisi siaga: semua lampu padam.

## 6. Alur trip TOR

1. Arus motor melebihi setelan F1 terus-menerus, bimetal memanas dan melengkung.
2. Kontak F1 95-96 (NC) membuka dan 97-98 (NO) menutup.
3. Karena 95-96 berada di jalur utama kendali (sebelum S1, S2, dan koil), koil KM1 kehilangan arus.
4. KM1 lepas: kontak utama membuka, motor berhenti; kontak pengunci 13-14 ikut membuka, sehingga pengunci hilang.
5. H1 padam (koil mati), H2 tetap padam (S1 tidak ditekan), dan 97-98 yang menutup menyalakan H3 (Trip).
6. Selama TOR belum di-reset, menekan S3 tidak menghidupkan motor (95-96 masih terbuka) dan H3 tetap menyala. Setelah bimetal dingin dan TOR di-reset: 95-96 menutup, 97-98 membuka, H3 padam; motor baru hidup setelah S3 ditekan lagi karena pengunci sudah putus (disengaja demi keselamatan).
7. Sebelum menekan start kembali, cari penyebab trip: beban mekanis macet, tegangan rendah, kehilangan fasa, atau setelan TOR terlalu rendah.

## 7. Skenario uji simulasi (urutan perilaku normal)

1. Q1 dan Q2 ON, tidak menekan apa pun: motor diam, H1, H2, H3 padam.
2. Tekan S3: KM1 aktif, motor berputar, H1 menyala.
3. Lepas S3: motor tetap berputar, H1 tetap menyala (pengunci).
4. Tekan S2: motor berhenti, H1 padam.
5. Tekan S3 lalu S1: motor berhenti seketika, S1 terkunci, H2 menyala, H1 padam.
6. Reset S1 lalu tekan S3: H2 padam, motor berputar, H1 menyala.
7. Picu TOR trip saat motor berputar: motor berhenti, H3 menyala, H1 padam.
8. Setelah trip, tekan S3: motor tidak hidup, H3 tetap menyala.
9. Reset F1 lalu tekan S3: H3 padam, motor berputar, H1 menyala.

## 8. Pengoperasian Simurelay (Android dan Windows)

- **Pemasangan:** Android 6.0 atau lebih baru, memori kosong minimal 100 MB, unduh dari Google Play Store (pengembang: Mordia Studio); di laptop lewat Microsoft Store (Windows 7/8/10/11). Internet hanya perlu saat mengunduh.
- **Proyek baru:** HP: ketuk ikon kertas bertanda tambah (+) di pojok kanan atas; laptop: Menu, lalu New Project. Layar kerja: toolbar di atas, menu komponen di bawah (geser untuk melihat semua).
- **Library:** Input (Push Button NO dan NC, Selector Switch, Emergency Button), Output (Motor 3 Fasa, Lampu), Kontak (Kontaktor Coil, Kontaktor 3P, kontak bantu, Overload Relay 3P, MCB 1P dan 3P), Sumber daya (Power Phase L1 L2 L3 N). Timer dan Motor Star-Delta tidak dipakai untuk DOL.
- **Toolbar:** Library, Play (jalankan atau hentikan simulasi), Values (parameter, label, warna), View (grid, zoom), Hold (kunci posisi), Delete (hapus komponen atau kawat), Front dan Back (lapisan), Rotate (putar), Capture (ambil gambar), More Options (mode Dark atau Light).
- **Menyambung kawat:** perbesar tampilan, ketuk dot pertama, ketuk dot kedua. Bila kawat tidak muncul, ketukan meleset dari dot. Kawat keliru dihapus dengan Delete lalu disambung ulang. Aktifkan Hold setelah komponen terpasang agar tidak bergeser.
- **Values:** pilih komponen, ketuk Values; isi kolom komentar untuk label (misalnya S3 START); pilih Color dengan panah kiri atau kanan untuk warna lampu. Kontak bantu KM1 13-14 harus mengacu ke koil KM1 melalui Values.
- **Penyimpanan:** Menu, Save As, nama file jelas (misalnya DOL_NamaSiswa_Kelas); simpan versi bertahap (v1 daya, v2 kendali, v3 final); Capture untuk dokumentasi.
- **Keterbatasan:** cara memicu dan mereset trip TOR dapat berbeda antar versi aplikasi; ikuti petunjuk yang tampil di aplikasi atau tanyakan guru.

## 9. Metode dan tabel troubleshooting (untuk penalaran bot; disampaikan bertahap, JANGAN dibacakan langsung ke siswa)

Metode enam langkah: amati gejala; tentukan bagian bermasalah (daya, kendali, indikator); telusuri dari sumber ke beban dan cari titik pertama yang tidak bertegangan; periksa tiga sumber kesalahan (sambungan kawat, jenis komponen NC atau NO, pengaturan Values); perbaiki satu hal lalu uji dengan Play; verifikasi dengan skenario uji lengkap dan catat penyebabnya.

| Gejala | Kemungkinan penyebab | Arah pemeriksaan (tingkat petunjuk 4-5) |
| --- | --- | --- |
| S3 ditekan, tidak ada lampu menyala, motor diam | Q1 atau Q2 OFF; C1-C2 belum tersambung; sumber belum terpasang | Status Q1 dan Q2; jalur L1 ke Q1 lalu ke F1 |
| S3 ditekan, H1 tidak menyala, motor diam | S3 tidak tersambung ke koil; S1 atau S2 salah jenis (NO) atau S1 masih tertekan; koil A2 tidak ke N; F1 dalam keadaan trip | Telusuri K, S1, S2, S3, koil, N; pastikan S1 dan S2 NC |
| Motor hidup hanya saat S3 ditekan | KM1 13-14 tidak terpasang, dipasang seri, atau Values tidak mengacu ke KM1 | Hubungan 13-14 terhadap S3; Values kontak |
| Motor hidup sendiri tanpa S3 | S3 bertipe NC; kontak 13-14 bertipe NC | Jenis komponen di Library |
| Motor tidak bisa dimatikan dengan S2 | Pengunci tersambung sebelum S2; S2 bertipe NO | Pindahkan percabangan pengunci ke titik A |
| H1 menyala (koil hidup) tetapi motor diam | Q2 OFF; kawat daya P1-P12 terlewat; kontak utama bukan milik KM1 | Periksa sambungan daya satu per satu |
| Motor tampak hanya mendapat dua fasa | Satu kawat daya tidak tersambung atau ke dot yang salah | Tiga jalur L1, L2, L3 |
| H3 menyala sejak awal | Kontak TOR NO terpasang sebagai NC; TOR sudah trip | Jenis kontak; reset TOR |
| Setelah trip dan reset, motor tidak hidup | Perilaku normal: pengunci sudah putus | Tekan S3 lagi |
| Motor tetap hidup saat S1 ditekan | S1 bertipe NO atau pada jalur salah | S1 NC seri pada jalur koil |
| Warna lampu tidak sesuai | Warna belum disetel | Lampu, Values, Color |
| Komponen tidak bisa digeser | Hold aktif | Matikan Hold, geser, aktifkan lagi |
| Kawat tidak muncul saat mengetuk dua dot | Ketukan meleset; tampilan terlalu kecil | Perbesar tampilan |
| File proyek tidak bisa dibuka | File rusak atau format tidak cocok | Coba file lain atau cadangan Save As |

## 10. Batas basis pengetahuan

- Dibahas: DOL satu arah putar dengan push button dan pengunci, simbol IEC 60617, proteksi, Simurelay, troubleshooting, LKPD, soal.
- Tidak dibahas (tolak dengan sopan dan sarankan bertanya ke guru): forward-reverse, bintang-segitiga (star-delta), kendali berurutan, perhitungan rinci pemilihan kabel dan pengaman, instalasi pada panel fisik, PUIL secara rinci.
