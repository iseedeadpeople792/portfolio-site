import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { projects } from "./projects.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

const pad = (n) => String(n).padStart(2, "0");
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Карточки проектов рисуются из данных, чтобы список менялся в одном файле.
$("#track").innerHTML = projects
  .map(
    (p, i) => `
  <article class="card" style="--a:${p.colors[0]};--b:${p.colors[1]}">
    <div class="visual"><div class="art"></div><span class="no">${pad(i + 1)}</span></div>
    <div class="body">
      <h3>${p.title}</h3>
      <p>${p.text}</p>
      ${p.link ? `<a class="go" href="${p.link.href}">${p.link.label}</a>` : `<span class="soon">Исходники пока не опубликованы</span>`}
      <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
    </div>
  </article>`
  )
  .join("");
$("#tot").textContent = pad(projects.length);

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
    .from(".scroll-hint, .marquee", { autoAlpha: 0, duration: 0.8 }, "-=0.4");

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
