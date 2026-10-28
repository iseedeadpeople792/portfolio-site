import "../src/base.css";
import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ALPHABET, makeCode, validUrl } from "./code.js";
import { L, lang, initI18n } from "../src/i18n.js";
initI18n();

gsap.registerPlugin(ScrollTrigger, SplitText);

const NS = "http://www.w3.org/2000/svg";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LIME = "#d4ff3a", PINK = "#ff9bd0", MUTED = "#c3ccff";
const HOST = L("ваш-хост", "your-host");

function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
}
const txt = (s, attrs, parent) => { const t = el("text", { "font-family": "JetBrains Mono, monospace", ...attrs }, parent); t.textContent = s; return t; };

/* ---------- Заставка: длинная ссылка схлопывается в короткую ---------- */
function heroMorph(motion) {
  const LONG = "https://example.com/blog/kak-rabotaet-edge-hosting/chast-2?utm_source=newsletter&utm_campaign=autumn";
  const longEl = $("#long"), shortEl = $("#short");
  longEl.textContent = LONG;
  const final = `${HOST}/${makeCode()}`;
  if (!motion) { longEl.style.opacity = 0.35; shortEl.textContent = final; return; }

  const split = SplitText.create(longEl, { type: "chars", charsClass: "ch" });
  const typed = { n: 0 };
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4, delay: 0.4, defaults: { ease: "power2.inOut" } });
  tl.set(split.chars, { width: "auto", autoAlpha: 0 })
    .call(() => { shortEl.textContent = ""; typed.n = 0; })
    .to(split.chars, { autoAlpha: 1, stagger: 0.012, duration: 0.01 })
    .to({}, { duration: 0.9 })
    .to(split.chars, { width: 0, autoAlpha: 0, stagger: { each: 0.014, from: "random" }, duration: 0.45 })
    .to(typed, {
      n: final.length, duration: 0.9, ease: "none",
      onStart: () => { shortEl.textContent = ""; },
      onUpdate: () => { shortEl.textContent = final.slice(0, Math.round(typed.n)); },
    }, "-=0.2")
    .to({}, { duration: 2 })
    .to(shortEl, { autoAlpha: 0, duration: 0.3 })
    .set(shortEl, { autoAlpha: 1 });
}

/* ---------- Схема: запрос идёт от клиента через воркер в KV и обратно ---------- */
function stageTimeline() {
  const svg = $("#stage");
  el("rect", { width: 860, height: 460, fill: "#0a1c9c" }, svg);
  const node = (x, y, label, sub) => {
    const g = el("g", {}, svg);
    el("rect", { x, y, width: 150, height: 78, rx: 14, fill: "#0f27cc", stroke: "rgba(255,255,255,.3)", "stroke-width": 2 }, g);
    txt(label, { x: x + 75, y: y + 36, "text-anchor": "middle", "font-size": 17, "font-weight": 700, fill: "#fff" }, g);
    txt(sub, { x: x + 75, y: y + 58, "text-anchor": "middle", "font-size": 12, fill: MUTED }, g);
    return g;
  };
  node(40, 120, L("Клиент", "Client"), L("curl, браузер", "curl, browser"));
  node(355, 120, L("Воркер", "Worker"), "Cloudflare Workers");
  node(670, 120, "KV", "LINKS");
  const lines = [[190, 159, 355, 159], [505, 159, 670, 159]].map(([x1, y1, x2, y2]) => el("line", { x1, y1, x2, y2, stroke: "rgba(255,255,255,.28)", "stroke-width": 2, "stroke-dasharray": "5 6" }, svg));

  // подписи над линиями и над узлами
  const labels = ["POST /api", L("проверка", "validation"), "makeCode()", "put", L("GET /код → 302", "GET /code → 302")].map((t, i) => txt(t, { x: [270, 430, 430, 590, 430][i], y: [140, 100, 100, 140, 100][i], "text-anchor": "middle", "font-size": 13, fill: LIME, opacity: 0 }, svg));

  // проверка ссылок, прогон настоящей validUrl
  const tests = ["https://example.com", "javascript:alert(1)", "file:///etc/passwd"];
  const rows = tests.map((s, i) => {
    const ok = validUrl(s);
    const g = el("g", { opacity: 0 }, svg);
    txt(s, { x: 300, y: 250 + i * 30, "font-size": 14, fill: "#fff" }, g);
    txt(ok ? L("принята", "accepted") : L("отклонена", "rejected"), { x: 520, y: 250 + i * 30, "font-size": 14, "font-weight": 700, fill: ok ? LIME : PINK }, g);
    return g;
  });

  // барабаны кода
  const final = makeCode();
  const reels = Array.from({ length: 6 }, (_, i) => {
    el("rect", { x: 318 + i * 38, y: 250, width: 32, height: 44, rx: 8, fill: "#0f27cc", stroke: "rgba(255,255,255,.3)" }, svg).setAttribute("opacity", 0);
    return txt("?", { x: 334 + i * 38, y: 280, "text-anchor": "middle", "font-size": 24, "font-weight": 700, fill: LIME, opacity: 0 }, svg);
  });
  const reelBoxes = $$("rect", svg).filter((r) => r.getAttribute("y") === "250");
  const collide = txt(L("код занят: берём другой (до 5 попыток)", "code taken: pick another (up to 5 attempts)"), { x: 430, y: 330, "text-anchor": "middle", "font-size": 13, fill: PINK, opacity: 0 }, svg);

  // запись в KV
  const kvRow = txt("", { x: 745, y: 232, "text-anchor": "middle", "font-size": 13, fill: LIME, opacity: 0 }, svg);
  const kvVal = txt("→ https://example.com", { x: 745, y: 254, "text-anchor": "middle", "font-size": 11, fill: MUTED, opacity: 0 }, svg);
  kvRow.textContent = final;

  // пакет запроса и ответ 302
  const packet = el("circle", { cx: 115, cy: 159, r: 9, fill: LIME, opacity: 0 }, svg);
  const redirect = txt("302 → example.com", { x: 115, y: 380, "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: LIME, opacity: 0 }, svg);
  const back = el("path", { d: "M745 200 C745 400 115 400 115 200", fill: "none", stroke: LIME, "stroke-width": 2, "stroke-dasharray": "6 6", opacity: 0 }, svg);

  const tl = gsap.timeline({ paused: true });
  const spin = { t: 0 };
  // шаг 1
  tl.to(packet, { opacity: 1, duration: 0.1 }, 0).to(labels[0], { opacity: 1, duration: 0.2 }, 0)
    .to(packet, { attr: { cx: 430 }, duration: 0.8, ease: "power2.inOut" }, 0.1)
    // шаг 2
    .to(labels[1], { opacity: 1, duration: 0.2 }, 1)
    .to(rows, { opacity: 1, stagger: 0.2, duration: 0.25 }, 1.1)
    .to(rows, { opacity: 0, duration: 0.2 }, 1.85)
    // шаг 3
    .to(labels[1], { opacity: 0, duration: 0.2 }, 2)
    .to(labels[2], { opacity: 1, duration: 0.2 }, 2.05)
    .to([...reelBoxes, ...reels], { opacity: 1, duration: 0.2 }, 2)
    .to(spin, {
      t: 1, duration: 0.8, ease: "none",
      onUpdate: () => reels.forEach((r, i) => {
        const done = spin.t > 0.45 + i * 0.09;
        r.textContent = done ? final[i] : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }),
    }, 2.1)
    .to(collide, { opacity: 1, duration: 0.2 }, 2.7).to(collide, { opacity: 0, duration: 0.2 }, 2.95)
    // шаг 4
    .to(labels[3], { opacity: 1, duration: 0.2 }, 3)
    .to(packet, { attr: { cx: 745 }, duration: 0.7, ease: "power2.inOut" }, 3)
    .to([kvRow, kvVal], { opacity: 1, stagger: 0.1, duration: 0.3 }, 3.6)
    .to([...reelBoxes, ...reels, labels[1], labels[2], labels[3], labels[0]], { opacity: 0, duration: 0.3 }, 3.8)
    // шаг 5
    .to(labels[4], { opacity: 1, duration: 0.2 }, 4)
    .to(packet, { attr: { cx: 115, cy: 159 }, duration: 0.01 }, 4)
    .to(packet, { attr: { cx: 430 }, duration: 0.4, ease: "none" }, 4.05)
    .to(packet, { attr: { cx: 745 }, duration: 0.4, ease: "none" }, 4.45)
    .to(back, { opacity: 0.6, duration: 0.2 }, 4.85)
    .to(redirect, { opacity: 1, duration: 0.3 }, 5.0)
    .to(packet, { attr: { cx: 115, cy: 159 }, duration: 0.5, ease: "power2.inOut" }, 4.85)
    .to({}, { duration: 0.5 });
  return tl;
}

/* ---------- Демонстрация ---------- */
function demo(motion) {
  const created = new Map();
  const msg = $("#msg"), out = $("#out"), codeEl = $("#code"), resp = $("#resp");
  let current = null;
  $("#form").addEventListener("submit", () => {
    const url = $("#url").value.trim();
    resp.textContent = "";
    if (!validUrl(url)) { out.hidden = true; msg.textContent = L("400: нужна ссылка http(s)", "400: an http(s) link is required"); return; }
    let code;
    for (let i = 0; i < 5; i++) { const c = makeCode(); if (!created.has(c)) { code = c; break; } } // как в воркере: при коллизии берём другой
    created.set(code, url);
    current = code;
    msg.textContent = L("201: ссылка создана (в этой демонстрации нигде не сохраняется)", "201: link created (not saved anywhere in this demo)");
    out.hidden = false;
    const full = `https://${HOST}/${code}`;
    if (!motion) { codeEl.textContent = full; return; }
    const o = { n: 0 };
    gsap.fromTo(o, { n: 0 }, { n: 1, duration: 0.7, ease: "none", onUpdate: () => {
      const k = Math.floor(o.n * code.length);
      codeEl.textContent = `https://${HOST}/` + code.slice(0, k) + [...code.slice(k)].map(() => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
    }, onComplete: () => { codeEl.textContent = full; } });
  });
  $("#open").addEventListener("click", () => {
    if (!current) return;
    resp.textContent = `HTTP/1.1 302 Found\nLocation: ${created.get(current)}`;
  });
}

/* ---------- Сборка ---------- */
const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
  const { motion, wide } = ctx.conditions;
  heroMorph(motion);
  demo(motion);
  const tl = stageTimeline();
  const steps = $$("#steps li");
  const mark = (p) => { const i = Math.min(4, Math.floor(p * tl.duration() * 0.999)); steps.forEach((li, k) => li.classList.toggle("on", k === i)); };

  $$(".nums b").forEach((b) => {
    const to = Number(b.dataset.to), suffix = (lang === "en" ? b.dataset.suffixEn : b.dataset.suffix) ?? b.dataset.suffix ?? "", o = { v: 0 };
    if (!motion) { b.textContent = to + suffix; return; }
    gsap.to(o, { v: to, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: ".nums", start: "top 85%", once: true }, onUpdate: () => { b.textContent = Math.round(o.v) + suffix; } });
  });

  if (!motion) { tl.progress(1); steps.forEach((li) => li.classList.add("on")); return; }

  gsap.to(".bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  gsap.from(".hero > *:not(.morph)", { autoAlpha: 0, y: 28, stagger: 0.1, duration: 0.8, ease: "power3.out" });
  gsap.from(".cols > div", { autoAlpha: 0, y: 36, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".cols", start: "top 80%" } });

  if (wide) {
    ScrollTrigger.create({ trigger: ".flow-pin", pin: true, start: "top top", end: "+=2800", scrub: 0.8, animation: tl, onUpdate: (s) => mark(s.progress) });
    mark(0);
  } else {
    steps.forEach((li) => li.classList.add("on"));
    tl.repeat(-1).repeatDelay(1.2).play();
  }
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
