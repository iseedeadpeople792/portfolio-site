import "../src/base.css";
import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { L, initI18n } from "../src/i18n.js";
initI18n();

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

// Ссылка на готовый .exe в «Релизах» GitHub. Пока релиза нет, кнопка скачивания скрыта.
const RELEASE = "https://github.com/iseedeadpeople792/dota2-stats/releases/latest/download/Dota2Stats.exe";

const NS = "http://www.w3.org/2000/svg";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

if (RELEASE) {
  const d = $("#download");
  d.href = RELEASE;
  d.hidden = false;
  $("#repo").className = "btn ghost";
}

const ordinal = (n) => (n % 100 >= 11 && n % 100 <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th");

/* ---------- Графики из условных значений ---------- */
function curve(values, w, h, pad = 14) {
  const lo = Math.min(...values), hi = Math.max(...values);
  const pts = values.map((v, i) => [pad + (i * (w - pad * 2)) / (values.length - 1), h - pad - ((v - lo) / (hi - lo || 1)) * (h - pad * 2)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return { d, last: pts.at(-1), pts };
}

function chart(svg, lines, w, h) {
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.innerHTML = "";
  const mk = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); svg.appendChild(n); return n; };
  for (let i = 1; i < 5; i++) mk("line", { x1: 0, x2: w, y1: (h / 5) * i, y2: (h / 5) * i, stroke: "#232837", "stroke-width": 1 });
  return lines.map((l) => {
    const c = curve(l.values, w, h);
    const path = mk("path", { d: c.d, fill: "none", stroke: l.color, "stroke-width": 3, "stroke-linecap": "round", "vector-effect": "non-scaling-stroke" });
    const dot = mk("circle", { cx: c.last[0], cy: c.last[1], r: 5, fill: l.color, opacity: 0 });
    return { path, dot };
  });
}

const WIN = [48, 51, 47, 52, 55, 53, 58, 56, 60, 57, 62, 59, 64];
const KDA = [2.1, 2.4, 2.0, 2.6, 2.9, 2.5, 3.1, 2.8, 3.3, 3.0, 3.5, 3.2, 3.7];

/* ---------- Окно в заставке ---------- */
function heroWindow(motion) {
  const lines = chart($("#hero-chart"), [{ values: WIN, color: "#8b7bff" }, { values: KDA, color: "#5ce1e6" }], 520, 190);
  const nums = [["#t1", 54, 0], ["#t2", 3.2, 1], ["#t3", 100, 0]];
  nums.forEach(([sel, to, dec]) => { $(sel).textContent = to.toFixed(dec); });
  if (!motion) return lines.forEach(({ dot }) => dot.setAttribute("opacity", 1));
  const tl = gsap.timeline({ delay: 0.4, defaults: { ease: "power3.out" } });
  tl.from(".win", { y: 40, autoAlpha: 0, duration: 0.9 })
    .from(lines.map((l) => l.path), { drawSVG: 0, duration: 1.8, stagger: 0.2, ease: "power2.inOut" }, "-=0.3")
    .to(lines.map((l) => l.dot), { opacity: 1, duration: 0.4 }, "-=0.4");
  nums.forEach(([sel, to, dec], i) => {
    const o = { v: 0 };
    tl.to(o, { v: to, duration: 1.4, onUpdate: () => { $(sel).textContent = o.v.toFixed(dec); } }, 0.6 + i * 0.1);
  });
}

/* ---------- Вкладки: панели окна собираются по очереди ---------- */
function buildPanes() {
  const panes = $("#panes");
  const row = (name, pct) => `<div class="row"><span>${name}</span><i><u data-w="${pct}"></u></i><em>${pct}%</em></div>`;
  panes.innerHTML = `
    <div class="pane"><div class="profile"><span class="av"></span><div><b>${L("Игрок", "Player")}</b><span class="pill">${L("ранг: пример", "rank: sample")}</span></div></div>
      <h4>${L("Герои по винрейту", "Heroes by win rate")}</h4>${row(L("Герой А", "Hero A"), 64)}${row(L("Герой Б", "Hero B"), 57)}${row(L("Герой В", "Hero C"), 52)}${row(L("Герой Г", "Hero D"), 46)}</div>
    <div class="pane"><div class="chips"><span>10</span><span>20</span><span>50</span><span>100</span></div><svg id="pane-chart"></svg></div>
    <div class="pane"><h4>${L("Темп добивания против эталонов", "Last-hit pace against benchmarks")}</h4>
      ${[L("5-я минута", "Minute 5"), L("10-я минута", "Minute 10"), L("15-я минута", "Minute 15")].map((t, i) => `<div class="perc"><div class="t"><span>${t}</span><span data-p="${[62, 48, 71][i]}">0</span></div><div class="rail"><i class="mk"></i></div></div>`).join("")}</div>
    <div class="pane"><h4>${L("Вражеские герои", "Enemy heroes")}</h4><div class="enemies">${"12345".split("").map((n) => `<span>${n}</span>`).join("")}</div>
      <div class="sug"><div><b>${L("Герой А", "Hero A")}</b><span>${L("хорош против большинства выбранных врагов", "good against most of the chosen enemies")}</span></div><div><b>${L("Герой Б", "Hero B")}</b><span>${L("подходит вашему рангу", "fits your rank")}</span></div><div class="bad"><b>${L("Не брать: В", "Avoid: C")}</b><span>${L("слаб против двух из пяти", "weak against two of five")}</span></div></div></div>
    <div class="pane"><h4>${L("Настройки", "Settings")}</h4>
      <div class="field"><small>${L("API-ключ OpenDota (необязательно)", "OpenDota API key (optional)")}</small><div class="in" id="key"></div></div>
      <div class="btns"><span class="p">${L("Сохранить", "Save")}</span><span>${L("Очистить кэш", "Clear cache")}</span><span>${L("Запустить помощник добивания", "Start the last-hit helper")}</span></div></div>`;
  return $$(".pane", panes);
}

function tabsTimeline() {
  const panes = buildPanes();
  const chartLines = chart($("#pane-chart"), [{ values: WIN, color: "#8b7bff" }, { values: KDA, color: "#5ce1e6" }], 520, 200);
  const inner = [];
  const T = (fn) => { const t = gsap.timeline(); fn(t); inner.push(t); return t; };

  T((t) => t.from($$(".row", panes[0]), { autoAlpha: 0, x: -20, stagger: 0.1, duration: 0.3 }, 0)
    .to($$("u", panes[0]), { width: (i, el) => el.dataset.w + "%", stagger: 0.1, duration: 0.5, ease: "power3.out" }, 0.1));
  T((t) => t.fromTo(chartLines.map((l) => l.path), { drawSVG: 0 }, { drawSVG: "100%", duration: 0.8, stagger: 0.15, ease: "power2.inOut" }, 0)
    .to(chartLines.map((l) => l.dot), { opacity: 1, duration: 0.2 }, 0.9));
  T((t) => $$(".perc", panes[2]).forEach((p, i) => {
    const to = Number($("[data-p]", p).dataset.p), o = { v: 0 };
    t.to($(".mk", p), { left: to + "%", duration: 0.6, ease: "power3.out" }, i * 0.12)
      .to(o, { v: to, duration: 0.6, onUpdate: () => { $("[data-p]", p).textContent = L(Math.round(o.v) + "-й процентиль", Math.round(o.v) + ordinal(Math.round(o.v)) + " percentile"); } }, i * 0.12);
  }));
  T((t) => t.from($$(".enemies span", panes[3]), { scale: 0, stagger: 0.07, duration: 0.25, ease: "back.out(2)" }, 0)
    .from($$(".sug div", panes[3]), { autoAlpha: 0, x: 24, stagger: 0.12, duration: 0.3 }, 0.35));
  T((t) => {
    const key = $("#key", panes[4]), o = { n: 0 };
    t.to(o, { n: 12, duration: 0.8, ease: "none", onUpdate: () => { key.textContent = "•".repeat(Math.round(o.n)); } }, 0)
      .from($$(".btns span", panes[4]), { scale: 0.8, autoAlpha: 0, stagger: 0.1, duration: 0.25 }, 0.7);
  });

  const tl = gsap.timeline({ paused: true });
  panes.forEach((p, i) => {
    tl.set(p, { visibility: "visible" }, i)
      .fromTo(p, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.25 }, i);
    if (i < panes.length - 1) tl.to(p, { autoAlpha: 0, y: -12, duration: 0.2 }, i + 0.8);
    tl.add(inner[i], i + 0.2);
  });
  tl.to({}, { duration: 0.2 });
  return { tl, panes, inner };
}

/* ---------- Сборка страницы ---------- */
const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
  const { motion, wide } = ctx.conditions;
  heroWindow(motion);
  const { tl, panes, inner } = tabsTimeline();
  const items = $$("#tablist li");
  const mock = $$("#mocktabs b");
  const mark = (p) => {
    const i = Math.min(4, Math.floor(p * 5 * 0.995));
    items.forEach((li, k) => li.classList.toggle("on", k === i));
    mock.forEach((b, k) => b.classList.toggle("on", k === i));
    const chips = $$(".chips span");
    chips.forEach((c, k) => c.classList.toggle("on", i === 1 && k <= Math.min(3, Math.floor((p * 5 - 1) * 4.4))));
  };

  const countUp = () => $$(".nums b").forEach((b) => {
    const o = { v: 0 }, to = Number(b.dataset.to);
    if (!motion) { b.textContent = to; return; }
    gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".nums", start: "top 85%", once: true }, onUpdate: () => { b.textContent = Math.round(o.v); } });
  });
  countUp();

  if (!motion) {
    // Без анимации: все вкладки подряд, уже заполненные.
    $("#panes").classList.add("flow");
    panes.forEach((p) => gsap.set(p, { autoAlpha: 1, y: 0, position: "static" }));
    inner.forEach((t) => t.progress(1));
    items.forEach((li) => li.classList.add("on"));
    return;
  }

  gsap.to(".bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  gsap.from(".hero-text > *", { autoAlpha: 0, y: 28, stagger: 0.1, duration: 0.8, ease: "power3.out" });
  gsap.from(".cols > div", { autoAlpha: 0, y: 36, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".built", start: "top 72%" } });

  if (wide) {
    ScrollTrigger.create({
      trigger: ".tabs-pin", pin: true, start: "top top", end: "+=3200", scrub: 0.8, animation: tl,
      onUpdate: (self) => mark(self.progress),
    });
    mark(0);
  } else {
    items.forEach((li) => li.classList.add("on"));
    tl.repeat(-1).repeatDelay(1).play();
    tl.eventCallback("onUpdate", () => mark(tl.progress()));
  }
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
