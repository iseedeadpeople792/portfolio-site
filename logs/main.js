import "../src/base.css";
import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { analyze, LINE } from "./analyze.js";

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Условный лог: адреса из документационных диапазонов, страницы выдуманы.
const IPS = ["203.0.113.7", "198.51.100.23", "192.0.2.44", "203.0.113.99", "198.51.100.5"];
const PATHS = ["/", "/pricing", "/blog/post-1", "/api/login", "/static/app.js", "/contact", "/old-page"];
const AGENTS = ["curl/8.4", "Mozilla/5.0", "Googlebot/2.1"];
function logLine(i, rnd) {
  const r = rnd();
  const status = r < 0.72 ? 200 : r < 0.8 ? 301 : r < 0.92 ? 404 : 500;
  const t = `28/Oct/2026:10:${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")} +0300`;
  const q = rnd() < 0.25 ? "?utm=mail" : "";
  const path = PATHS[Math.floor(rnd() * PATHS.length)];
  return `${IPS[Math.floor(rnd() * IPS.length)]} - - [${t}] "GET ${path}${q} HTTP/1.1" ${status} ${Math.floor(rnd() * 2000)} "-" "${AGENTS[Math.floor(rnd() * AGENTS.length)]}"`;
}
function seeded(seed) { let s = seed; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); }
const sampleLines = (n, seed) => { const rnd = seeded(seed); return Array.from({ length: n }, (_, i) => logLine(i, rnd)); };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function colorize(line) {
  const m = LINE.exec(line);
  if (!m) return `<span class="d">${esc(line)}</span>`;
  const cls = m[3][0] === "5" ? "w5" : m[3][0] === "4" ? "w4" : "ok";
  return esc(line).replace(` ${m[3]} `, ` <span class="${cls}">${m[3]}</span> `);
}

/* ---------- Заставка: терминал печатает команду, льётся лог, потом итог настоящего разбора ---------- */
function heroTerminal(motion) {
  const term = $("#term");
  const lines = sampleLines(34, 7);
  const result = analyze(lines, 3);
  const summary = [
    `Запросов: ${result.total}  4xx: ${result.errors_4xx_pct}%  5xx: ${result.errors_5xx_pct}%`,
    "Топ страниц:", ...result.top_paths.map(([p, n]) => `  ${String(n).padStart(6)}  ${p}`),
    "Топ IP:", ...result.top_ips.map(([p, n]) => `  ${String(n).padStart(6)}  ${p}`),
  ];
  const add = (html, cls = "") => { const d = document.createElement("div"); d.innerHTML = html; if (cls) d.className = cls; term.appendChild(d); while (term.children.length > 40) term.firstChild.remove(); };
  const cmd = "python log_analyzer.py access.log --top 3";

  if (!motion) {
    add(`<span class="cmd">$ ${cmd}</span>`);
    summary.forEach((s) => add(esc(s), /^(Запросов)/.test(s) ? "ok" : ""));
    return;
  }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 0.5 });
  const typed = { n: 0 };
  tl.call(() => { term.innerHTML = ""; add(`<span class="cmd">$ </span>`); })
    .to(typed, { n: cmd.length, duration: 1.1, ease: "none", onUpdate: () => { term.lastChild.innerHTML = `<span class="cmd">$ ${cmd.slice(0, Math.round(typed.n))}</span>`; } })
    .to({}, { duration: 0.4 });
  lines.forEach((l, i) => tl.call(() => add(colorize(l)), null, `>${i === 0 ? 0 : 0.06}`));
  tl.to({}, { duration: 0.5 });
  summary.forEach((s, i) => tl.call(() => add(esc(s), i === 0 ? "ok" : ""), null, ">0.12"));
}

/* ---------- Анатомия строки: поля подсвечиваются по очереди ---------- */
function anatomy() {
  const q = (s) => $(s);
  const all = $$("#logline .f");
  const dim = $$("#logline .f.dim");
  const chips = { ip: q("#c-ip"), path: q("#c-path"), cls: q("#c-class") };
  const tl = gsap.timeline({ paused: true });
  const lit = (sel, color) => ({ backgroundColor: color + "33", color });
  // шаг 1: всё видно
  tl.fromTo(all, { opacity: 0.25 }, { opacity: 1, stagger: 0.04, duration: 0.3 }, 0)
    // шаг 2: IP
    .to(all, { opacity: 0.3, duration: 0.2 }, 1)
    .to(q("#logline .ip"), { opacity: 1, ...lit("", "#6ec6ff"), duration: 0.25 }, 1.05)
    .to(chips.ip, { opacity: 1, color: "#6ec6ff", duration: 0.25 }, 1.2)
    // шаг 3: путь
    .to(q("#logline .ip"), { opacity: 0.35, backgroundColor: "transparent", duration: 0.2 }, 2)
    .to(q("#logline .path"), { opacity: 1, ...lit("", "#ffb000"), duration: 0.25 }, 2.05)
    .to(q("#logline .query"), { opacity: 0.8, textDecoration: "line-through", color: "#8a7440", duration: 0.25 }, 2.1)
    .to(chips.path, { opacity: 1, color: "#ffb000", duration: 0.25 }, 2.2)
    // шаг 4: статус
    .to(q("#logline .path"), { opacity: 0.35, backgroundColor: "transparent", duration: 0.2 }, 3)
    .to(q("#logline .status"), { opacity: 1, ...lit("", "#ff5f4a"), duration: 0.25 }, 3.05)
    .to(chips.cls, { opacity: 1, color: "#ff5f4a", duration: 0.25 }, 3.2)
    // шаг 5: остальное гаснет
    .to(dim, { opacity: 0.12, duration: 0.3 }, 4)
    .to({}, { duration: 0.5 }, 4);
  return tl;
}

/* ---------- Интерактивный разбор ---------- */
function analyzer(motion) {
  const log = $("#log");
  log.value = [...sampleLines(18, 3), "это не строка лога"].join("\n");
  const fill = (el, v) => (motion ? gsap.to(el, { width: v + "%", duration: 0.5, ease: "power3.out", overwrite: true }) : gsap.set(el, { width: v + "%" }));
  const list = (ul, rows, max) => {
    ul.innerHTML = rows.map(([k, n]) => `<li><span>${esc(k)}</span><b>${n}</b><i><u data-w="${max ? Math.round((n / max) * 100) : 0}"></u></i></li>`).join("");
    $$("u", ul).forEach((u) => fill(u, u.dataset.w));
  };
  function render() {
    const lines = log.value.split("\n").filter((l) => l.trim());
    const r = analyze(lines, Number($("#top").value));
    const o = { v: Number($("#r-total").textContent) || 0 };
    if (motion) gsap.to(o, { v: r.total, duration: 0.4, onUpdate: () => { $("#r-total").textContent = Math.round(o.v); } }); else $("#r-total").textContent = r.total;
    $("#r-4").textContent = r.errors_4xx_pct + "%";
    $("#r-5").textContent = r.errors_5xx_pct + "%";
    fill("#b-4", r.errors_4xx_pct);
    fill("#b-5", r.errors_5xx_pct);
    list($("#t-paths"), r.top_paths, r.top_paths[0]?.[1]);
    list($("#t-ips"), r.top_ips, r.top_ips[0]?.[1]);
    const bad = lines.length - r.total;
    $("#skip").textContent = bad ? `Не распознано и пропущено строк: ${bad}` : "";
  }
  $("#run").addEventListener("click", render);
  $("#top").addEventListener("change", render);
  log.addEventListener("input", render);
  render();
}

/* ---------- Сборка ---------- */
const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
  const { motion, wide } = ctx.conditions;
  heroTerminal(motion);
  analyzer(motion);
  const tl = anatomy();
  const steps = $$("#steps li");
  const mark = (p) => { const i = Math.min(4, Math.floor(p * tl.duration() * 0.999)); steps.forEach((li, k) => li.classList.toggle("on", k === i)); };

  if (!motion) { tl.progress(1); steps.forEach((li) => li.classList.add("on")); gsap.set("#chips span", { opacity: 1 }); return; }

  gsap.to(".bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  gsap.from(".hero-text > *", { autoAlpha: 0, y: 28, stagger: 0.1, duration: 0.8, ease: "power3.out" });
  gsap.from(".cols > div", { autoAlpha: 0, y: 36, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".cols", start: "top 80%" } });

  if (wide) {
    ScrollTrigger.create({ trigger: ".anat-pin", pin: true, start: "top top", end: "+=2600", scrub: 0.8, animation: tl, onUpdate: (s) => mark(s.progress) });
    mark(0);
  } else {
    steps.forEach((li) => li.classList.add("on"));
    tl.repeat(-1).repeatDelay(1.2).play();
  }
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
