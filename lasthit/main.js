import "../src/base.css";
import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { combine } from "./calc.js";

gsap.registerPlugin(ScrollTrigger);

const NS = "http://www.w3.org/2000/svg";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const COLORS = { green: "#7df08a", amber: "#ffc857", red: "#e05a5a" };
const TYPES = [{ hp: 550, armor: 2 }, { hp: 300, armor: 0 }]; // допущения по умолчанию из README

function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
}
const txt = (s, attrs, parent) => { const t = el("text", attrs, parent); t.textContent = s; return t; };

// Крип: тень, тело и голова. Простые фигуры, без картинок.
function creep(parent, x, y, tint) {
  const g = el("g", {}, parent);
  el("ellipse", { cx: x, cy: y + 62, rx: 46, ry: 9, fill: "rgba(0,0,0,.35)" }, g);
  el("rect", { x: x - 30, y: y, width: 60, height: 62, rx: 22, fill: tint }, g);
  el("circle", { cx: x, cy: y - 12, r: 20, fill: tint }, g);
  el("circle", { cx: x - 7, cy: y - 14, r: 3, fill: "#0a140f" }, g);
  el("circle", { cx: x + 7, cy: y - 14, r: 3, fill: "#0a140f" }, g);
  return g;
}

// Полоска здоровья с числом ударов над ней. paint(frac) пересчитывает всё по настоящей формуле.
function healthBar(parent, x, y, dmg) {
  const g = el("g", {}, parent);
  const label = txt("", { x: x + 55, y: y - 8, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 17, "font-weight": 700, fill: COLORS.red }, g);
  el("rect", { x, y, width: 110, height: 14, rx: 3, fill: "#06100a", stroke: "#2c4634", "stroke-width": 2 }, g);
  const fill = el("rect", { x: x + 3, y: y + 3, width: 104, height: 8, rx: 2, fill: COLORS.red }, g);
  const api = {
    g, label, fill, frac: 1, shown: null,
    paint(f) {
      api.frac = f;
      const v = combine(Math.max(f, 0.0001), dmg[0], dmg[1], TYPES);
      fill.setAttribute("width", Math.max(0, 104 * f).toFixed(1));
      fill.setAttribute("fill", COLORS[v.state]);
      label.setAttribute("fill", COLORS[v.state]);
      label.textContent = f <= 0.001 ? "" : v.range;
    },
  };
  api.paint(1);
  return api;
}

/* ---------- Заставка: три крипа теряют здоровье, подсказки пересчитываются ---------- */
function heroScene(motion) {
  const svg = $("#hero-scene");
  el("rect", { width: 720, height: 420, fill: "#0a140f" }, svg);
  for (let i = 0; i < 12; i++) el("line", { x1: 0, x2: 720, y1: 250 + i * 18, y2: 250 + i * 18, stroke: "rgba(125,240,138,.05)" }, svg);
  const defs = [
    { x: 150, y: 190, tint: "#5b2a2a", from: 0.9, dur: 5.2, steps: 5 },
    { x: 360, y: 205, tint: "#4a3a22", from: 0.55, dur: 3.4, steps: 3 },
    { x: 570, y: 185, tint: "#5b2a2a", from: 0.3, dur: 2.2, steps: 2 },
  ];
  const dmg = [54, 60];
  const items = defs.map((d) => {
    const body = creep(svg, d.x, d.y, d.tint);
    const bar = healthBar(svg, d.x - 55, d.y - 78, dmg);
    const hit = txt("", { x: d.x, y: d.y - 40, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 15, fill: "#fff", opacity: 0 }, svg);
    return { ...d, body, bar, hit };
  });
  txt("Условная сцена: так выглядит подсказка в игре", { x: 20, y: 400, "font-family": "JetBrains Mono, monospace", "font-size": 12, fill: "#5f7766" }, svg);

  items.forEach((c, i) => {
    c.bar.paint(c.from);
    if (!motion) return;
    const state = { f: c.from, last: c.from };
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1, delay: 0.6 + i * 0.5 });
    tl.fromTo(state, { f: c.from }, {
      f: 0, duration: c.dur, ease: `steps(${c.steps})`,
      onUpdate() {
        c.bar.paint(state.f);
        if (Math.abs(state.f - state.last) > 0.001) {
          state.last = state.f;
          c.hit.textContent = "−" + (54 + Math.round(Math.random() * 6));
          gsap.fromTo(c.hit, { opacity: 1, y: 0 }, { opacity: 0, y: -22, duration: 0.7, overwrite: true });
          gsap.fromTo(c.body, { x: 0 }, { x: 3, duration: 0.05, yoyo: true, repeat: 3 });
        }
      },
    })
      .to(c.body, { opacity: 0.15, duration: 0.4 })
      .set(state, { f: c.from, last: c.from })
      .call(() => c.bar.paint(c.from))
      .to(c.body, { opacity: 1, duration: 0.4 });
  });
}

/* ---------- Пять шагов: сцена кадра, на которую по очереди накладываются слои ---------- */
function stageTimeline() {
  const svg = $("#stage");
  const defs = el("defs", {}, svg);
  const glow = el("filter", { id: "glow", x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs);
  el("feGaussianBlur", { stdDeviation: 3 }, glow);

  el("rect", { width: 800, height: 450, fill: "#0a140f" }, svg);
  el("rect", { width: 800, height: 34, fill: "#07100b" }, svg);
  el("rect", { y: 392, width: 800, height: 58, fill: "#07100b" }, svg);
  txt("Кадр игры", { x: 16, y: 22, "font-family": "JetBrains Mono, monospace", "font-size": 13, fill: "#5f7766" }, svg);
  el("rect", { x: 60, y: 402, width: 150, height: 38, rx: 6, fill: "#0e1a13", stroke: "#2c4634" }, svg);
  const dmgText = txt("0", { x: 135, y: 429, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 22, "font-weight": 700, fill: "#e8f5ea" }, svg);
  txt("урон", { x: 70, y: 398, "font-family": "JetBrains Mono, monospace", "font-size": 11, fill: "#5f7766" }, svg);

  const dmg = [57, 63];
  const spots = [{ x: 220, y: 215, tint: "#5b2a2a", f: 0.78 }, { x: 410, y: 235, tint: "#4a3a22", f: 0.42 }, { x: 600, y: 210, tint: "#5b2a2a", f: 0.07 }];
  const bars = spots.map((s) => { creep(svg, s.x, s.y, s.tint); const b = healthBar(svg, s.x - 55, s.y - 78, dmg); b.paint(s.f); b.label.setAttribute("opacity", 0); return b; });

  // слой 1: рамка захвата
  const L1 = el("g", { opacity: 0 }, svg);
  const brackets = [[16, 52, 16, 16, 52, 16], [784, 52, 784, 16, 748, 16], [16, 384, 16, 420, 52, 420], [784, 384, 784, 420, 748, 420]].map((p) =>
    el("polyline", { points: p.join(" "), fill: "none", stroke: COLORS.green, "stroke-width": 3, "stroke-linecap": "round" }, L1));
  txt("захват окна", { x: 400, y: 22, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 13, fill: COLORS.green }, L1);

  // слой 2: линия сканирования и найденные полоски
  const L2 = el("g", { opacity: 0 }, svg);
  const scan = el("rect", { x: 0, y: 34, width: 800, height: 3, fill: COLORS.amber, filter: "url(#glow)" }, L2);
  const boxes = spots.map((s) => el("rect", { x: s.x - 62, y: s.y - 86, width: 124, height: 30, rx: 4, fill: "none", stroke: COLORS.amber, "stroke-width": 2, "stroke-dasharray": "6 4", opacity: 0 }, L2));

  // слой 3: чтение урона
  const L3 = el("g", { opacity: 0 }, svg);
  el("rect", { x: 52, y: 394, width: 166, height: 54, rx: 8, fill: "none", stroke: COLORS.green, "stroke-width": 2, "stroke-dasharray": "6 4" }, L3);
  txt("OCR", { x: 226, y: 436, "font-family": "JetBrains Mono, monospace", "font-size": 13, fill: COLORS.green }, L3);

  // слой 4: сопровождение
  const L4 = el("g", { opacity: 0 }, svg);
  const trails = spots.map((s, i) => {
    const t = el("polyline", { points: `${s.x - 55},${s.y - 66} ${s.x - 48},${s.y - 72} ${s.x - 51},${s.y - 78}`, fill: "none", stroke: COLORS.amber, "stroke-width": 2, "stroke-dasharray": "3 4" }, L4);
    txt("#" + (i + 1), { x: s.x - 55, y: s.y - 100, "font-family": "JetBrains Mono, monospace", "font-size": 12, fill: COLORS.amber }, L4);
    return t;
  });

  // слой 5: оверлей подсказок
  const L5 = el("g", { opacity: 0 }, svg);
  txt("оверлей поверх игры", { x: 560, y: 426, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 13, fill: COLORS.green }, L5);

  const tl = gsap.timeline({ paused: true });
  const num = { v: 0 };
  // шаг 1
  tl.to(L1, { opacity: 1, duration: 0.5 }, 0)
    .from(brackets, { scale: 1.06, transformOrigin: "50% 50%", duration: 0.8, ease: "power3.out" }, 0)
    // шаг 2
    .to(L2, { opacity: 1, duration: 0.2 }, 1)
    .fromTo(scan, { y: 34 }, { y: 392, duration: 0.85, ease: "none" }, 1.05)
    .to(boxes, { opacity: 1, stagger: 0.12, duration: 0.2 }, 1.35)
    .to(scan, { opacity: 0, duration: 0.2 }, 1.9)
    // шаг 3
    .to(L3, { opacity: 1, duration: 0.3 }, 2)
    .to(num, { v: 63, duration: 0.9, ease: "power2.out", onUpdate: () => { dmgText.textContent = Math.round(num.v); } }, 2.1)
    // шаг 4
    .to(L4, { opacity: 1, duration: 0.3 }, 3)
    .to(trails, { attr: { points: (i) => `${spots[i].x - 55},${spots[i].y - 78} ${spots[i].x - 55},${spots[i].y - 78} ${spots[i].x - 55},${spots[i].y - 78}` }, stagger: 0.1, duration: 0.6 }, 3.1)
    // шаг 5
    .to(L5, { opacity: 1, duration: 0.3 }, 4)
    .to(bars.map((b) => b.label), { attr: { opacity: 1 }, stagger: 0.15, duration: 0.3 }, 4.1)
    .to({}, { duration: 0.6 }, 4.4);
  return tl;
}

/* ---------- Калькулятор ---------- */
function calculator() {
  const q = (id) => document.getElementById(id);
  const num = (id) => Number(q(id).value);
  const yes = (r) => (r.one ? "да" : r.maybe ? "только при высоком уроне" : "нет");
  function render() {
    let [lo, hi] = [num("dmin"), num("dmax")];
    if (lo > hi) [lo, hi] = [hi, lo];
    const f = num("frac") / 100;
    q("o-frac").textContent = Math.round(f * 100) + "%";
    const types = [{ hp: num("mhp"), armor: num("marm") }, { hp: num("rhp"), armor: num("rarm") }];
    if (!(lo > 0) || types.some((t) => !(t.hp > 0) || Number.isNaN(t.armor))) {
      q("explain").textContent = "Укажите положительный урон и здоровье крипов.";
      return;
    }
    const v = combine(f, lo, hi, types);
    q("meter").style.width = f * 100 + "%";
    q("meter").style.background = COLORS[v.state];
    const word = v.hi === 1 ? "удар" : v.hi >= 2 && v.hi <= 4 ? "удара" : "ударов";
    q("verdict").textContent = v.range + " " + word;
    q("explain").textContent = {
      green: "Один удар добьёт любого крипа: полоска станет зелёной.",
      amber: "Добить одним ударом можно, но не гарантировано для обоих типов: полоска не зелёная.",
      red: "Одним ударом не добить. Подсказка покажет число ударов.",
    }[v.state];
    [["m", 0], ["r", 1]].forEach(([k, i]) => {
      q(k + "-hp").textContent = Math.round(f * types[i].hp);
      q(k + "-hits").textContent = v.rows[i].hits;
      q(k + "-one").textContent = yes(v.rows[i]);
    });
  }
  $("#form").addEventListener("input", render);
  render();
}

/* ---------- Сборка страницы ---------- */
calculator();

const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
  const { motion, wide } = ctx.conditions;
  heroScene(motion);
  const tl = stageTimeline();
  const steps = $$("#steps li");
  const mark = (p) => { const i = Math.min(4, Math.floor(p * 5 * 0.999)); steps.forEach((li, k) => li.classList.toggle("on", k === i)); };

  if (!motion) { tl.progress(1); steps.forEach((li) => li.classList.add("on")); return; }

  gsap.to(".bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  gsap.from(".hero-text > *", { autoAlpha: 0, y: 28, stagger: 0.1, duration: 0.8, ease: "power3.out" });

  if (wide) {
    ScrollTrigger.create({
      trigger: ".how-pin", pin: true, start: "top top", end: "+=2600", scrub: 0.8, animation: tl,
      onUpdate: (self) => mark(self.progress),
    });
    mark(0);
  } else {
    // На узких экранах схема просто проигрывается по кругу.
    steps.forEach((li) => li.classList.add("on"));
    tl.repeat(-1).repeatDelay(1.2).play();
  }
  gsap.from(".cols > div", { autoAlpha: 0, y: 36, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".facts", start: "top 72%" } });
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
