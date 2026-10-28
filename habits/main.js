import "../src/base.css";
import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bestStreak, currentStreak } from "./streak.js";
import { L, initI18n } from "../src/i18n.js";
initI18n();

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DAY = 86400000;
const TODAY = new Date().toISOString().slice(0, 10); // streak.js считает по UTC, поэтому и «сегодня» берём по UTC
const dayAt = (offset) => new Date(Date.parse(TODAY + "T00:00:00Z") + offset * DAY).toISOString().slice(0, 10);
const COLORS = { off: "#323847", mint: "#2fd18b", sun: "#ffc83d", tomato: "#ff5a36", soft: "#dde1e9" };

// Индексы непрерывных отрезков: нужны, чтобы подсветить, какие клетки дают серию.
function runs(pattern) {
  const out = [];
  let start = null;
  pattern.forEach((v, i) => {
    if (v && start === null) start = i;
    if ((!v || i === pattern.length - 1) && start !== null) { out.push([start, v ? i : i - 1]); start = null; }
  });
  return out;
}

/* ---------- Заставка: календарь заполняется, серия считается настоящей функцией ---------- */
function heroBoard(motion) {
  const heat = $("#heat");
  const N = 112;
  let seed = 11;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const filled = Array.from({ length: N }, (_, i) => {
    const off = i - (N - 1); // 0 = сегодня
    if (off === 0) return false; // сегодня ещё не отмечено
    if (off >= -11) return true; // серия из 11 дней до вчера
    if (off === -12) return false;
    if (off <= -20 && off >= -34) return true; // рекордная серия из 15 дней
    return rnd() < 0.55;
  });
  const dates = filled.map((f, i) => (f ? dayAt(i - (N - 1)) : null)).filter(Boolean);
  const cur = currentStreak(dates, TODAY);
  const best = bestStreak(dates);
  const curRange = [N - 1 - cur, N - 2]; // клетки текущей серии: последние cur дней до вчера

  heat.innerHTML = "";
  const cells = filled.map((f, i) => {
    const c = document.createElement("i");
    c.className = "cell" + (i === N - 1 ? " today" : "");
    heat.appendChild(c);
    return { c, f, inCur: i >= curRange[0] && i <= curRange[1] };
  });
  const paint = () => cells.forEach(({ c, f, inCur }) => { c.style.background = f ? (inCur ? COLORS.sun : COLORS.mint) : COLORS.soft; });
  const set = () => { $("#h-cur").textContent = cur; $("#h-best").textContent = best; };
  if (!motion) { paint(); set(); return; }

  gsap.set(cells.map((x) => x.c), { background: COLORS.soft });
  const o = { cur: 0, best: 0 };
  const tl = gsap.timeline({ delay: 0.5 });
  tl.to(cells.map((x) => x.c), {
    duration: 0.01, background: (i) => (cells[i].f ? (cells[i].inCur ? COLORS.sun : COLORS.mint) : COLORS.soft),
    stagger: { each: 0.012, grid: [16, 7], axis: "x", from: "start" },
  })
    .to(o, { cur, best, duration: 1.6, ease: "power2.out", delay: -1.2, onUpdate: () => { $("#h-cur").textContent = Math.round(o.cur); $("#h-best").textContent = Math.round(o.best); } }, 0.5)
    .to(cells[N - 1].c, { scale: 1.25, repeat: -1, yoyo: true, duration: 0.7, ease: "sine.inOut" }, 2);
}

/* ---------- Правила: пять сценариев по 14 дней, счёт считают настоящие функции ---------- */
function rulesTimeline() {
  const row = $("#row14");
  row.innerHTML = "";
  const cells = Array.from({ length: 14 }, (_, i) => { const c = document.createElement("i"); c.className = "cell" + (i === 13 ? " today" : ""); row.appendChild(c); return c; });
  const patterns = [
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
  ];
  const info = patterns.map((p, k) => {
    const dates = [];
    p.forEach((v, i) => { if (v) dates.push(dayAt(i - 13)); });
    if (k === 4) dates.push(dayAt(3 - 13)); // повтор даты: считается один раз
    const cur = currentStreak(dates, TODAY), best = bestStreak(dates);
    const end = p[13] ? 13 : 12;
    const curSet = new Set(Array.from({ length: cur }, (_, j) => end - j));
    const bestRun = runs(p).find(([a, b]) => b - a + 1 === best) ?? [-1, -1];
    return { p, cur, best, curSet, bestRun };
  });
  const ring = (k, i) => {
    const { curSet, bestRun } = info[k];
    const a = curSet.has(i) ? COLORS.sun : "rgba(255,200,61,0)";
    const b = i >= bestRun[0] && i <= bestRun[1] ? COLORS.tomato : "rgba(255,90,54,0)";
    return `inset 0 0 0 3px ${a}, 0 0 0 2px ${b}`;
  };
  gsap.set(cells, { background: COLORS.off, boxShadow: "inset 0 0 0 3px rgba(255,200,61,0), 0 0 0 2px rgba(255,90,54,0)" });
  const s = { cur: 0, best: 0 };
  const draw = () => { $("#s-cur").textContent = Math.round(s.cur); $("#s-best").textContent = Math.round(s.best); };
  const tl = gsap.timeline({ paused: true });
  info.forEach((d, k) => {
    tl.to(cells, { background: (i) => (d.p[i] ? COLORS.mint : COLORS.off), boxShadow: (i) => ring(k, i), duration: 0.5, stagger: 0.03 }, k)
      .to(s, { cur: d.cur, best: d.best, duration: 0.5, onUpdate: draw }, k);
  });
  tl.to("#dup", { opacity: 1, duration: 0.3 }, 4.2).to({}, { duration: 0.5 }, 4.3);
  return tl;
}

/* ---------- Рабочий мини-трекер ---------- */
function tracker(motion) {
  const KEY = "habits-demo-v1";
  let habits;
  try { habits = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { habits = null; }
  if (!Array.isArray(habits)) habits = [{ name: L("Зарядка", "Workout"), dates: [dayAt(-2), dayAt(-1)] }];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(habits)); } catch { /* хранилище недоступно: работаем без сохранения */ } };

  function render() {
    const list = $("#list");
    list.replaceChildren(...habits.map((h, hi) => {
      const box = document.createElement("div");
      box.className = "habit";
      const cur = currentStreak(h.dates, TODAY), best = bestStreak(h.dates);
      box.innerHTML = `<div class="habit-top"><b></b><span class="st">${L("серия", "streak")} <em class="c">${cur}</em> · ${L("рекорд", "record")} <em class="b">${best}</em></span><button type="button" aria-label="${L("Удалить привычку", "Delete habit")}" title="${L("Удалить", "Delete")}">✕</button></div><div class="days"></div>`;
      $("b", box).textContent = h.name;
      $("button", box).onclick = () => { habits.splice(hi, 1); save(); render(); };
      const days = $(".days", box);
      for (let i = 13; i >= 0; i--) {
        const d = dayAt(-i);
        const on = h.dates.includes(d);
        const b = document.createElement("button");
        b.type = "button";
        b.className = (on ? "on " : "") + (i === 0 ? "today" : "");
        b.title = d;
        b.setAttribute("aria-pressed", on);
        b.setAttribute("aria-label", d + (on ? L(", отмечено", ", done") : L(", не отмечено", ", not done")));
        b.onclick = () => { h.dates = on ? h.dates.filter((x) => x !== d) : [...h.dates, d]; save(); render(); bump(hi); };
        days.appendChild(b);
      }
      return box;
    }));
  }
  function bump(hi) {
    if (!motion) return;
    const box = $$("#list .habit")[hi];
    if (box) gsap.fromTo($$("em", box), { scale: 1.5 }, { scale: 1, duration: 0.45, ease: "back.out(3)" });
  }
  $("#form").addEventListener("submit", () => {
    const input = $("#name");
    const name = input.value.trim();
    if (!name) return;
    habits.push({ name, dates: [] });
    input.value = "";
    save(); render();
    if (motion) gsap.from($$("#list .habit").at(-1), { autoAlpha: 0, y: 18, duration: 0.4 });
  });
  render();
}

/* ---------- Сборка ---------- */
const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
  const { motion, wide } = ctx.conditions;
  heroBoard(motion);
  tracker(motion);
  const tl = rulesTimeline();
  const steps = $$("#steps li");
  const mark = (p) => { const i = Math.min(4, Math.floor(p * tl.duration() * 0.999)); steps.forEach((li, k) => li.classList.toggle("on", k === i)); };

  if (!motion) { tl.progress(1); steps.forEach((li) => li.classList.add("on")); gsap.set("#dup", { opacity: 1 }); return; }

  gsap.to(".bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  gsap.from(".hero-text > *", { autoAlpha: 0, y: 28, stagger: 0.1, duration: 0.8, ease: "power3.out" });
  gsap.from(".cols > div", { autoAlpha: 0, y: 36, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".cols", start: "top 80%" } });

  if (wide) {
    ScrollTrigger.create({ trigger: ".rules-pin", pin: true, start: "top top", end: "+=2800", scrub: 0.8, animation: tl, onUpdate: (s) => mark(s.progress) });
    mark(0);
  } else {
    steps.forEach((li) => li.classList.add("on"));
    tl.repeat(-1).repeatDelay(1.2).play();
  }
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
