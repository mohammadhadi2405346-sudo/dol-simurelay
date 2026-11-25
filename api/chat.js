// Fungsi server Vercel: meneruskan percakapan ke Gemini API.
// API key TIDAK ada di kode ini. Key dibaca dari Environment Variable Vercel: GEMINI_API_KEY.
const { SYSTEM, KB } = require("./_kb");

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
// Jika model utama sedang sibuk (503), kuota habis (429), atau tidak ditemukan (404), coba model cadangan berikut.
// Bisa diubah lewat variabel Vercel GEMINI_FALLBACK_MODELS (dipisah koma).
const FALLBACKS = (process.env.GEMINI_FALLBACK_MODELS || "gemini-3.5-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite")
  .split(",").map((m) => m.trim()).filter(Boolean);
const MODELS = [MODEL].concat(FALLBACKS.filter((m) => m !== MODEL));
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/";

const MAX_MESSAGES = 12;      // riwayat terakhir yang dikirim ke model
const MAX_CHARS = 1000;       // panjang maksimal tiap pesan siswa
const RATE_LIMIT = 15;        // permintaan per menit per alamat IP (upaya terbaik)
const hits = new Map();

// Penyaring data pribadi: dijalankan di server SEBELUM teks dikirim ke Gemini.
const PII_PATTERNS = [
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, // email
  /\b\d{16}\b/g,                                      // NIK (16 digit)
  /(?:\+?62|0)[\s-]?8[\d\s-]{8,13}\d/g                // nomor HP Indonesia
];

function scrub(text) {
  let out = text;
  let found = false;
  for (const re of PII_PATTERNS) {
    out = out.replace(re, () => {
      found = true;
      return "[data pribadi dihapus]";
    });
  }
  return { text: out, found };
}

function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some((t) => now - t < 60000)) hits.delete(k);
  return arr.length > RATE_LIMIT;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Metode tidak diizinkan." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server belum dikonfigurasi (GEMINI_API_KEY belum diisi)." });
    return;
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "x").split(",")[0].trim();
  if (limited(ip)) {
    res.status(429).json({ error: "Terlalu banyak pesan dalam waktu singkat. Tunggu sebentar ya." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  const raw = body && Array.isArray(body.messages) ? body.messages : null;
  if (!raw || raw.length === 0) {
    res.status(400).json({ error: "Pesan kosong." });
    return;
  }

  let piiRemoved = false;
  const contents = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m.text !== "string") continue;
    const role = m.role === "model" ? "model" : "user";
    let text = m.text.slice(0, MAX_CHARS);
    if (role === "user") {
      const s = scrub(text);
      text = s.text;
      if (s.found) piiRemoved = true;
    }
    if (text.trim()) contents.push({ role, parts: [{ text }] });
  }
  // Gemini mensyaratkan percakapan diawali dan diakhiri oleh pesan user.
  while (contents.length && contents[0].role !== "user") contents.shift();
  if (!contents.length || contents[contents.length - 1].role !== "user") {
    res.status(400).json({ error: "Format percakapan tidak valid." });
    return;
  }

  const systemText =
    SYSTEM +
    "\n\n# CATATAN SISTEM\nPesan pembuka sudah ditampilkan oleh situs; jangan mengulangnya. Jangan menyebut bahwa kamu membaca 'dokumen pengetahuan'; anggap isinya bagian dari E-Modul.\n\n# BASIS PENGETAHUAN\n" +
    KB;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    // withSystem=true: pakai system_instruction (model Gemini).
    // withSystem=false: aturan bot digabung ke pesan pertama (model Gemma tidak mendukung system_instruction).
    const send = (model, withSystem) => {
      const payload = { generationConfig: { temperature: 0.3, maxOutputTokens: 700 } };
      if (withSystem) {
        payload.system_instruction = { parts: [{ text: systemText }] };
        payload.contents = contents;
      } else {
        payload.contents = contents.map((c, i) =>
          i === 0
            ? { role: c.role, parts: [{ text: "[ATURAN SISTEM, WAJIB DIIKUTI]\n" + systemText + "\n\n[PESAN SISWA]\n" + c.parts[0].text }] }
            : c
        );
      }
      return fetch(`${ENDPOINT}${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    };

    async function tryModel(model) {
      let resp = await send(model, !/gemma/i.test(model));
      let text = "";
      if (!resp.ok) {
        text = await resp.text();
        if (resp.status === 400 && /developer instruction|system instruction/i.test(text)) {
          resp = await send(model, false); // coba ulang tanpa system_instruction
          text = resp.ok ? "" : await resp.text();
        }
      }
      return { resp, text };
    }

    let r, errText = "";
    for (const m of MODELS) {
      ({ resp: r, text: errText } = await tryModel(m));
      if (r.ok) break;
      // Detail kesalahan hanya dicatat di log Vercel, tidak dikirim ke pengunjung.
      console.error("Gemini error", r.status, "model:", m, errText.slice(0, 400));
      const retryable = [404, 429, 500, 502, 503, 504].includes(r.status) ||
        (r.status === 400 && /not supported|not found|not enabled|model/i.test(errText));
      if (!retryable) break;
    }

    if (!r.ok) {
      if (r.status === 429 || r.status === 503) {
        res.status(503).json({ error: "Kak Relay sedang ramai atau kuotanya habis. Coba lagi beberapa menit lagi atau tanyakan ke guru." });
      } else {
        res.status(502).json({ error: "Kak Relay sedang bermasalah. Coba lagi sebentar." });
      }
      return;
    }

    const data = await r.json();
    const cand = data.candidates && data.candidates[0];
    const parts = cand && cand.content && cand.content.parts;
    const reply = parts ? parts.map((p) => p.text || "").join("").trim() : "";

    if (!reply) {
      res.status(200).json({
        reply: "Aku belum bisa menjawab yang itu. Coba tulis ulang pertanyaanmu dengan menyebut kode komponen dan gejalanya ya.",
        piiRemoved
      });
      return;
    }
    res.status(200).json({ reply, piiRemoved });
  } catch (e) {
    console.error("Fungsi chat gagal:", e && e.message);
    res.status(504).json({ error: "Kak Relay terlalu lama menjawab. Coba kirim ulang." });
  } finally {
    clearTimeout(timer);
  }
};
