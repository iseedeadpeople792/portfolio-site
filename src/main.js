import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { projects } from "./projects.js";
import { L, lang, initI18n } from "./i18n.js";
import { scene, coverCss } from "./covers.js";

document.head.append(Object.assign(document.createElement("style"), { textContent: coverCss }));
gsap.registerPlugin(ScrollTrigger, SplitText);
initI18n();

const pad = (n) => String(n).padStart(2, "0");
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Карточки проектов рисуются из данных, чтобы список менялся в одном файле.
$("#track").innerHTML = projects
  .map((p, i) => {
    const e = p.en;
    const tr = (ru, en) => L(ru, en ?? ru);
    const tags = lang === "en" ? e.tags ?? p.tags : p.tags;
    return `
  <article class="card" tabindex="0" role="button" style="--a:${p.colors[0]};--b:${p.colors[1]}">
    <div class="visual"><div class="art"></div>${scene(i)}<span class="no">${pad(i + 1)}</span></div>
    <div class="body">
      <h3>${tr(p.title, e.title)}</h3>
      <p>${tr(p.text, e.text)}</p>
      ${p.link ? `<a class="go" href="${p.link.href}">${tr(p.link.label, p.link.labelEn ?? "Open the project site")}</a>` : `<span class="soon">${L("Исходники пока не опубликованы", "Source not published yet")}</span>`}
      ${p.repo ? `<a class="repo" href="${p.repo}">${L("Исходники на GitHub", "Source on GitHub")}</a>` : ""}
      <div class="tags">${tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <span class="more">${L("Подробнее →", "Details →")}</span>
    </div>
  </article>`;
  })
  .join("");
$("#tot").textContent = pad(projects.length);

// Клик по карточке (не по её ссылкам) открывает окно с обложкой и полным описанием.
const dlg = document.createElement("dialog");
dlg.className = "pj";
document.body.append(dlg);
const open = (card) => {
  dlg.innerHTML = `<button class="x" aria-label="${L("Закрыть", "Close")}">×</button>${card.innerHTML.replace(/<span class="more">.*?<\/span>/, "")}`;
  dlg.style.cssText = card.getAttribute("style");
  dlg.showModal();
};
$("#track").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c && !e.target.closest("a")) open(c); });
$("#track").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches(".card")) open(e.target); });
dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest(".x")) dlg.close(); });

const mm = gsap.matchMedia();

// Анимации включаются только тем, кто не просил убрать движение; остальным страница отдаётся готовой.
mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
  const { motion, wide } = ctx.conditions;
  if (!motion) return;

  // Полоса прогресса чтения страницы.
  gsap.to(".bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });

  // 1. Заставка: буквы имени поднимаются из-под маски.
  const lines = $$(".name .line").map((l) => SplitText.create(l, { type: "chars" }));
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(".hello", { autoAlpha: 0, y: 16, duration: 0.6 })
    .from(lines.flatMap((s) => s.chars), { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.035 }, "<0.1")
    .from(".role", { autoAlpha: 0, y: 24, duration: 0.8 }, "-=0.5")
    .from(".nav", { autoAlpha: 0, y: -20, duration: 0.7 }, "<")
    .from(".scroll-hint", { autoAlpha: 0, duration: 0.8 }, "-=0.4");


  // Графика героя: орбиты вращаются, стикеры вылетают, покачиваются и тянутся за курсором.
  gsap.to(".hero-art .o1", { rotation: 360, svgOrigin: "300 300", duration: 90, repeat: -1, ease: "none" });
  gsap.to(".hero-art .o2", { rotation: -360, svgOrigin: "300 300", duration: 120, repeat: -1, ease: "none" });
  gsap.to(".hero-art .o3", { rotation: 360, svgOrigin: "300 300", duration: 70, repeat: -1, ease: "none" });
  const fico = $$(".fico");
  fico.forEach((el, i) => {
    gsap.from(el, { scale: 0, rotate: i % 2 ? 40 : -40, duration: 0.9, delay: 1.5 + i * 0.18, ease: "back.out(2.2)" });
    gsap.to(el, { y: i % 2 ? 16 : -16, rotate: i % 2 ? 5 : -5, duration: 2.8 + i * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.2 + i * 0.2 });
  });
  if (matchMedia("(pointer: fine)").matches) {
    const qx = fico.map((el) => gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }));
    const move2 = (e) => { const nx = e.clientX / innerWidth - 0.5; fico.forEach((_, i) => qx[i](nx * (i % 2 ? -34 : 34) * (1 + i * 0.3))); };
    addEventListener("pointermove", move2);
    ctx.add(() => removeEventListener("pointermove", move2));
  }

  // Иконки услуг оживают при появлении и дальше играют по кругу.
  const svcIn = (art) => ({ trigger: art, start: "top 85%" });
  $$(".svc-grid article").forEach((art, i) => {
    const st = { scrollTrigger: svcIn(art) };
    if (i === 0) {
      gsap.to($(".ant", art), { scale: 1.8, transformOrigin: "50% 50%", duration: 0.5, yoyo: true, repeat: -1, repeatDelay: 0.8, ease: "sine.inOut", ...st });
      gsap.to($$(".eye", art), { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.12, yoyo: true, repeat: -1, repeatDelay: 2.2, ...st });
    } else if (i === 1) {
      gsap.to($(".cur", art), { opacity: 0, duration: 0.01, repeat: -1, repeatDelay: 0.5, yoyo: true, ease: "none", ...st });
      gsap.fromTo($(".pr", art), { x: -4 }, { x: 0, duration: 0.7, repeat: -1, repeatDelay: 1, ease: "back.out(3)", ...st });
    } else if (i === 2) {
      gsap.fromTo($$(".lay", art), { opacity: 0.2 }, { opacity: 1, duration: 0.5, stagger: 0.25, repeat: -1, yoyo: true, repeatDelay: 0.6, ease: "sine.inOut", ...st });
    } else {
      gsap.fromTo($$(".wl", art), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.7, stagger: 0.18, repeat: -1, repeatDelay: 1.4, ease: "power3.out", ...st });
    }
  });

  // Финал: самолётик пролетает по пунктиру.
  if (wide) {
    const trail = $("#ctrail"), pl = $("#cpl"), len = trail.getTotalLength(), fly = { u: 0 };
    const place = () => { const a = trail.getPointAtLength(fly.u * len), b = trail.getPointAtLength(Math.min(len, fly.u * len + 2)); gsap.set(pl, { x: a.x, y: a.y, rotation: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI }); };
    gsap.set(pl, { opacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: ".contact", start: "top 65%", once: true } })
      .to(pl, { opacity: 1, duration: 0.2 })
      .to(fly, { u: 1, duration: 2.8, ease: "power2.inOut", onUpdate: place }, 0)
      .from(".c-plane .trail", { opacity: 0, duration: 1 }, 0);
  }

  // Светящееся пятно догоняет курсор.
  if (matchMedia("(pointer: fine)").matches) {
    const orb = $(".orb");
    gsap.set(orb, { x: innerWidth * 0.68, y: innerHeight * 0.4 });
    gsap.to(orb, { opacity: 1, duration: 2, delay: 0.6 });
    const ox = gsap.quickTo(orb, "x", { duration: 0.9, ease: "power3" });
    const oy = gsap.quickTo(orb, "y", { duration: 0.9, ease: "power3" });
    const move = (e) => { ox(e.clientX); oy(e.clientY); };
    addEventListener("pointermove", move);
    ctx.add(() => removeEventListener("pointermove", move));
  }

  // 2. Текст проявляется по словам вместе с прокруткой.
  const words = SplitText.create("#statement", { type: "words", wordsClass: "w" }).words;
  gsap.fromTo(words, { opacity: 0.16 }, {
    opacity: 1, stagger: 0.08, ease: "none",
    scrollTrigger: { trigger: "#statement", start: "top 78%", end: "bottom 52%", scrub: true },
  });

  if (wide) {
    // 3. Проекты: секция закрепляется, вертикальная прокрутка двигает ленту карточек вбок.
    const track = $("#track");
    const cards = $$(".card");
    const dist = () => track.scrollWidth - innerWidth;
    const slide = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".h-panel", pin: true, start: "top top", end: () => "+=" + dist(),
        scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => { $("#cur").textContent = pad(Math.round(self.progress * (cards.length - 1)) + 1); },
      },
    });
    cards.forEach((card) => {
      gsap.fromTo($(".art", card), { xPercent: -9 }, {
        xPercent: 9, ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
      });
      gsap.fromTo(card, { opacity: 0.4, scale: 0.94 }, {
        opacity: 1, scale: 1, ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 92%", end: "left 55%", scrub: true },
      });
    });

    // 4. Процесс: линия дорисовывается, шаги загораются по очереди.
    const steps = $$(".p-steps li");
    gsap.set(steps, { opacity: 0.18, x: 28 });
    gsap.set(".p-line i", { scaleY: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".p-panel", pin: true, start: "top top", end: "+=2200", scrub: 1,
        onUpdate: (self) => steps.forEach((li, i) => li.classList.toggle("on", self.progress >= (i + 0.35) / steps.length)),
      },
    });
    tl.to(".p-line i", { scaleY: 1, ease: "none", duration: steps.length }, 0);
    steps.forEach((li, i) => tl.to(li, { opacity: 1, x: 0, duration: 0.7 }, i));
  } else {
    // На узких экранах карточки просто появляются по очереди.
    gsap.set(".card, .p-steps li", { autoAlpha: 0, y: 36 });
    ScrollTrigger.batch(".card, .p-steps li", {
      start: "top 90%", once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" }),
    });
    $$(".p-steps li").forEach((li) => li.classList.add("on"));
  }

  // 5. Контакты: заголовок выезжает, кнопка притягивается к курсору.
  gsap.from(".c-lead", { autoAlpha: 0, y: 48, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".contact", start: "top 70%" } });
  const magnet = $(".magnet");
  const label = magnet.firstElementChild;
  if (matchMedia("(pointer: fine)").matches) {
    const q = (el, p, d) => gsap.quickTo(el, p, { duration: d, ease: "power3" });
    const [mx, my, lx, ly] = [q(magnet, "x", 0.6), q(magnet, "y", 0.6), q(label, "x", 0.5), q(label, "y", 0.5)];
    magnet.addEventListener("pointermove", (e) => {
      const r = magnet.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      mx(dx * 0.35); my(dy * 0.35); lx(dx * 0.2); ly(dy * 0.2);
    });
    magnet.addEventListener("pointerleave", () => { mx(0); my(0); lx(0); ly(0); });
  }
});

// Когда шрифты загрузились, размеры блоков меняются: пересчитываем позиции прокрутки.
document.fonts.ready.then(() => ScrollTrigger.refresh());
