(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var PAGES = ["beranda", "belajar", "video", "praktik", "kakrelay", "evaluasi"];

  /* ---------- Navigasi satu halaman (hash routing) ---------- */
  function show() {
    var id = (location.hash || "#beranda").slice(1);
    if (PAGES.indexOf(id) < 0) id = "beranda";
    $$("section.page").forEach(function (el) { el.classList.toggle("active", el.id === "p-" + id); });
    $$("nav a").forEach(function (a) {
      if (a.dataset.page === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    $("#fab").style.display = id === "kakrelay" ? "none" : "";
    $("#nav").classList.remove("open");
    $("#menuBtn").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    if (id === "video") renderVideos();
    var t = { beranda: "", belajar: "E-Modul", video: "Video", praktik: "Praktik", kakrelay: "Tanya Kak Relay", evaluasi: "Evaluasi & Privasi" }[id];
    document.title = (t ? t + " · " : "") + (S.judul || "DOL Simurelay");
  }
  window.addEventListener("hashchange", show);

  $("#menuBtn").addEventListener("click", function () {
    var open = $("#nav").classList.toggle("open");
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Tema ---------- */
  try {
    var saved = localStorage.getItem("tema");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}
  $("#themeBtn").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("tema", next); } catch (e) {}
  });

  /* ---------- E-Modul ---------- */
  function setLink(sel, url, emptyText) {
    var el = $(sel);
    if (!el) return;
    if (url) { el.href = url; el.removeAttribute("aria-disabled"); }
    else { el.href = "#"; el.setAttribute("aria-disabled", "true"); if (emptyText) el.title = emptyText; }
  }
  (function modul() {
    var box = $("#modulViewer");
    var src = S.modulFlipbookEmbed || S.modulPdf;
    setLink("#modulDownload", S.modulPdf, "Isi modulPdf di assets/config.js");
    if (!src) { box.innerHTML = '<div class="notice">Berkas modul belum dipasang.</div>'; return; }
    var f = document.createElement("iframe");
    f.className = "viewer";
    f.title = "E-Modul DOL Simurelay";
    f.loading = "lazy";
    f.src = src;
    box.appendChild(f);
    var fb = document.createElement("p");
    fb.style.color = "var(--muted)";
    fb.style.fontSize = "14px";
    fb.innerHTML = 'Modul tidak tampil di HP? <a href="' + (S.modulPdf || src) + '" target="_blank" rel="noopener">Buka di tab baru</a>.';
    box.appendChild(fb);
  })();

  /* ---------- Video (muat saat diklik agar ringan) ---------- */
  var videoDone = false;
  function renderVideos() {
    if (videoDone) return;
    videoDone = true;
    var list = $("#videoList");
    (S.video || []).forEach(function (v, i) {
      var card = document.createElement("div");
      card.className = "video";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "thumb";
      btn.setAttribute("aria-label", "Putar: " + v.judul);
      btn.innerHTML = '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg"><span aria-hidden="true">▶</span>';
      btn.addEventListener("click", function () {
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + v.id + "?autoplay=1&rel=0";
        f.title = v.judul;
        f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        f.allowFullscreen = true;
        btn.replaceWith(f);
      });
      var meta = document.createElement("div");
      meta.className = "meta";
      meta.innerHTML = "<small></small><div></div>";
      meta.firstChild.textContent = (i + 1) + ". " + v.bab;
      meta.lastChild.textContent = v.judul;
      card.appendChild(btn);
      card.appendChild(meta);
      list.appendChild(card);
    });
  }

  /* ---------- Praktik ---------- */
  setLink("#playStore", S.playStore);
  setLink("#msStore", S.microsoftStore);

  /* ---------- Chatbot ---------- */
  var OPENING = "Halo, aku Kak Relay, pendamping belajar DOL kamu. Aku tidak memberi jawaban langsung, tapi aku akan menuntunmu menemukannya sendiri. Jangan kirim data pribadi ya. Kamu lagi di bagian mana: teori, merangkai di Simurelay, atau rangkaianmu belum jalan?";

  /* ---------- Penampil teks bot (format sederhana, aman: tanpa innerHTML) ---------- */
  function inlineFmt(parent, s) {
    var re = /(\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\s][^*\n]*\*|`[^`\n]+`)/g, last = 0, m, el, t;
    while ((m = re.exec(s))) {
      if (m.index > last) parent.appendChild(document.createTextNode(s.slice(last, m.index)));
      t = m[0];
      if (t.indexOf("**") === 0 || t.indexOf("__") === 0) { el = document.createElement("strong"); el.textContent = t.slice(2, -2); }
      else if (t.charAt(0) === "`") { el = document.createElement("code"); el.textContent = t.slice(1, -1); }
      else { el = document.createElement("em"); el.textContent = t.slice(1, -1); }
      parent.appendChild(el);
      last = m.index + t.length;
    }
    if (last < s.length) parent.appendChild(document.createTextNode(s.slice(last)));
  }
  function richText(box, text) {
    box.classList.add("rich");
    var list = null, para = null;
    text.replace(/\r/g, "").split("\n").forEach(function (ln) {
      var b = ln.match(/^\s*[-*•]\s+(.+)$/), n = ln.match(/^\s*\d+[.)]\s+(.+)$/);
      if (b || n) {
        var tag = n ? "OL" : "UL";
        if (!list || list.tagName !== tag) { list = document.createElement(tag); box.appendChild(list); }
        var li = document.createElement("li");
        inlineFmt(li, (n || b)[1]);
        list.appendChild(li);
        para = null;
        return;
      }
      list = null;
      if (!ln.trim()) { para = null; return; }
      if (!para) { para = document.createElement("p"); box.appendChild(para); }
      else para.appendChild(document.createElement("br"));
      inlineFmt(para, ln.trim());
    });
  }

  function chatUI(box, api, nama) {
    var history = [];
    box.innerHTML =
      '<div class="chat" role="region" aria-label="Percakapan dengan ' + nama + '">' +
      '<div class="chat-log" id="chatLog" aria-live="polite"></div>' +
      '<form class="chat-form" id="chatForm" autocomplete="off">' +
      '<textarea id="chatInput" rows="2" maxlength="1000" placeholder="Ceritakan gejala atau pertanyaanmu. Jangan kirim data pribadi." aria-label="Pesan"></textarea>' +
      '<div class="chat-actions"><button type="button" class="btn ghost" id="chatClear">Hapus percakapan</button>' +
      '<button type="submit" class="btn" id="chatSend">Kirim</button></div>' +
      "</form></div>";
    var log = $("#chatLog", box), form = $("#chatForm", box), input = $("#chatInput", box), send = $("#chatSend", box);

    function add(role, text, cls) {
      var d = document.createElement("div");
      d.className = "msg " + (role === "user" ? "me" : "bot") + (cls ? " " + cls : "");
      if (role !== "user" && !cls) richText(d, text); else d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }
    var CHIPS = ["Apa fungsi pengunci (kontak 13-14)?", "Motorku hanya hidup kalau S3 kutahan", "Kapan lampu H3 menyala?"];
    function reset() {
      history = [];
      log.innerHTML = "";
      add("model", OPENING);
      var row = document.createElement("div");
      row.className = "chips";
      CHIPS.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "chip"; b.textContent = c;
        b.addEventListener("click", function () { row.remove(); input.value = c; form.requestSubmit(); });
        row.appendChild(b);
      });
      log.appendChild(row);
    }
    reset();

    $("#chatClear", box).addEventListener("click", reset);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text || send.disabled) return;
      input.value = "";
      add("user", text);
      history.push({ role: "user", text: text });
      send.disabled = true;
      var wait = add("model", "", "typing");
      wait.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="wait-txt">Kak Relay sedang menyusun jawaban</span>';
      var slow = setTimeout(function () {
        var t = wait.querySelector(".wait-txt");
        if (t) t.textContent = "Masih menyusun jawaban, biasanya 5 sampai 15 detik. Mohon tunggu";
      }, 8000);

      fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; });
        })
        .then(function (x) {
          clearTimeout(slow);
          wait.remove();
          if (!x.ok || !x.j.reply) {
            history.pop();
            add("model", (x.j && x.j.error) || "Terjadi gangguan. Coba kirim ulang.", "err");
            return;
          }
          history.push({ role: "model", text: x.j.reply });
          add("model", x.j.reply);
          if (x.j.piiRemoved) add("model", "Catatan: aku menghapus data pribadi dari pesanmu. Cukup kirim kode komponen dan gejalanya ya.", "err");
        })
        .catch(function () {
          clearTimeout(slow);
          wait.remove();
          history.pop();
          add("model", "Tidak ada koneksi ke Kak Relay. Periksa internetmu lalu coba lagi.", "err");
        })
        .then(function () { send.disabled = false; input.focus(); });
    });
  }

  (function bot() {
    var box = $("#chatBox");
    var nama = S.botNama || "Kak Relay";
    if (S.botApi) {
      chatUI(box, S.botApi, nama);
    } else if (S.botEmbed) {
      var f = document.createElement("iframe");
      f.src = S.botEmbed;
      f.title = "Chatbot " + nama;
      f.loading = "lazy";
      box.appendChild(f);
      if (S.botLink) {
        var p = document.createElement("p");
        p.style.cssText = "margin:0;padding:10px 14px;border-top:1px solid var(--line);font-size:14px";
        p.innerHTML = 'Chat tidak tampil? <a target="_blank" rel="noopener" href="' + S.botLink + '">Buka ' + nama + ' di tab baru</a>.';
        box.appendChild(p);
      }
    } else if (S.botLink) {
      box.innerHTML = '<div class="chat-empty"><h3>Siap membantu</h3><p style="color:var(--muted)">Chatbot dibuka di tab baru. Setelah selesai, kembali ke halaman ini.</p><a class="btn" target="_blank" rel="noopener" href="' + S.botLink + '">Buka ' + nama + '</a></div>';
    } else {
      box.innerHTML = '<div class="chat-empty"><h3>Chatbot belum dipasang</h3><p style="color:var(--muted)">Isi <code>botEmbed</code> atau <code>botLink</code> pada <code>assets/config.js</code>.</p></div>';
    }
  })();

  /* ---------- Evaluasi ---------- */
  setLink("#formUji", S.formUji, "Isi formUji di assets/config.js");
  if (S.kontakGuru) $("#kontakGuru").textContent = S.kontakGuru;

  show();
})();
