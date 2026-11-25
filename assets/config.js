/*
  KONFIGURASI SITUS — cukup edit berkas ini, tidak perlu menyentuh HTML.
  Setelah diubah: commit ke GitHub, Vercel akan deploy otomatis.
*/
window.SITE = {
  judul: "DOL Simurelay: Belajar Mandiri",
  botNama: "Kak Relay",

  // 1) E-Modul: taruh berkas PDF di folder /modul lalu samakan namanya di sini.
  //    Atau isi dengan tautan Google Drive berformat .../preview
  modulPdf: "modul/E-Modul-DOL-Simurelay.pdf",
  // Alternatif tampilan flipbook (mis. tautan sematan Canva / Heyzine). Kosongkan jika tidak dipakai.
  modulFlipbookEmbed: "",

  // 2) Chatbot. Prioritas: botApi > botEmbed > botLink
  //    botApi   = fungsi server milik situs ini (Gemini API). Isi "/api/chat". API key disimpan di Vercel, BUKAN di sini.
  //    botEmbed = alamat yang boleh disematkan (iframe) oleh platform (Chatbase/Mizou/SchoolAI dll.)
  //    botLink  = tautan berbagi (dibuka di tab baru). Wajib untuk Custom Gem (tidak bisa disematkan).
  botApi: "/api/chat",
  botEmbed: "",
  botLink: "",

  // 3) Aplikasi Simurelay. Ganti dengan tautan resmi masing-masing toko.
  playStore: "https://play.google.com/store/search?q=simurelay&c=apps",
  microsoftStore: "https://apps.microsoft.com/search?query=simurelay",

  // 4) Formulir uji coba / evaluasi (Google Form). Kosongkan jika belum ada.
  formUji: "https://docs.google.com/forms/d/e/1FAIpQLSehVcPUohbaf0_2yw1EraI8I5xruKMEYlEJ90JPJsuPy74z5g/viewform",
  kontakGuru: "", // mis. alamat email sekolah/dosen pengampu (bukan data pribadi siswa)

  // 5) Video YouTube — periksa ulang ID dengan PDF asli sebelum publikasi.
  video: [
    { bab: "Bab III", judul: "Instalasi Simurelay (HP dan laptop)", id: "cYf2m4ZUkSE" },
    { bab: "Bab III", judul: "Membuat proyek baru dan mengenal layar kerja", id: "CckBmCjTaQg" },
    { bab: "Bab IV 4.1", judul: "Mengenal tampilan, Tools Menu, Toolbar, Library", id: "ZkuI61Iwa1g" },
    { bab: "Bab IV 4.2", judul: "Merangkai rangkaian daya DOL dan menyambung kawat", id: "Slr6be9denM" },
    { bab: "Bab IV 4.3", judul: "Merangkai rangkaian pengendali dan pengunci", id: "PyuoUoBpW90" },
    { bab: "Bab IV 4.4", judul: "Mengatur Values, label, warna lampu, menyimpan", id: "5oelRTBSnBk" },
    { bab: "Bab IV 4.5", judul: "Menguji simulasi DOL termasuk kondisi trip", id: "VTBmUikMJlk" },
    { bab: "Bab V", judul: "Troubleshooting rangkaian DOL", id: "xfnANiqWEAA" }
  ]
};
