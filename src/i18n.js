import "./lang.css";
// RU по умолчанию лежит в разметке; EN берётся из data-en* и из L(ru, en) в скриптах.
const KEY = "lang";
const RU_LIKE = ["ru", "uk", "be", "kk"];

function detect() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "ru" || saved === "en") return saved;
  } catch {}
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "ru" || q === "en") return q;
  const first = (navigator.languages && navigator.languages[0]) || navigator.language || "ru";
  return RU_LIKE.includes(first.slice(0, 2).toLowerCase()) ? "ru" : "en";
}

export const lang = detect();
export const L = (ru, en) => (lang === "en" ? en : ru);

export function setLang(next) {
  try { localStorage.setItem(KEY, next); } catch {}
  const u = new URL(location.href);
  u.searchParams.delete("lang");
  location.href = u.href; // перезагрузка: проще, чем перерисовывать все анимации
}

const ATTRS = ["aria-label", "content", "placeholder", "title", "alt"];

export function applyI18n() {
  document.documentElement.lang = lang;
  if (lang !== "en") return;
  document.querySelectorAll("[data-en]").forEach((el) => { el.textContent = el.dataset.en; });
  for (const a of ATTRS) {
    document.querySelectorAll(`[data-en-${a}]`).forEach((el) => el.setAttribute(a, el.getAttribute(`data-en-${a}`)));
  }
}

export function mountSwitcher() {
  const box = document.createElement("div");
  box.className = "lang";
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", L("Язык", "Language"));
  for (const code of ["ru", "en"]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = code.toUpperCase();
    b.setAttribute("aria-pressed", String(code === lang));
    b.addEventListener("click", () => code !== lang && setLang(code));
    box.append(b);
  }
  const slot = document.querySelector("[data-lang-slot]");
  if (slot) slot.append(box);
  else { box.classList.add("lang-fixed"); document.body.append(box); }
}

export function initI18n() {
  applyI18n();
  mountSwitcher();
}
