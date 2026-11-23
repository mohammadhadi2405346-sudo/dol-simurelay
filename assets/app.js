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
  (function bot() {
    var box = $("#chatBox");
    var nama = S.botNama || "Kak Relay";
    if (S.botEmbed) {
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
