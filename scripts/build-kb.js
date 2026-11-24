// Menggabungkan kb/system-prompt.txt dan kb/basis-pengetahuan.md menjadi api/_kb.js
// Jalankan setiap kali isi folder kb/ diubah:  node scripts/build-kb.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const system = fs.readFileSync(path.join(root, "kb", "system-prompt.txt"), "utf8");
const kb = fs.readFileSync(path.join(root, "kb", "basis-pengetahuan.md"), "utf8");

const out =
  "// BERKAS HASIL GENERATE. Jangan diedit langsung; ubah folder kb/ lalu jalankan: node scripts/build-kb.js\n" +
  "module.exports = " +
  JSON.stringify({ SYSTEM: system, KB: kb }, null, 2) +
  ";\n";

fs.writeFileSync(path.join(root, "api", "_kb.js"), out);
console.log("api/_kb.js dibuat:", system.length, "karakter prompt,", kb.length, "karakter pengetahuan");
