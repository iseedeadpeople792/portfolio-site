// Анимированные обложки проектов: маленькие SVG-сцены, движение задано в style.css (.sc-*).
const ink = "#1a1020";
const n = (k, f) => Array.from({ length: k }, (_, i) => f(i)).join("");
export const covers = [
  // 0: добивание — полоска здоровья тает, над ней считается число ударов
  `<rect x="90" y="86" width="220" height="22" rx="11" fill="${ink}" opacity=".35"/>
   <rect class="sc-hp" x="90" y="86" width="220" height="22" rx="11" fill="${ink}"/>
   <text class="sc-n" x="200" y="70" text-anchor="middle" font-size="34" font-weight="700" fill="${ink}">3</text>
   <circle class="sc-aim" cx="300" cy="97" r="22" fill="none" stroke="${ink}" stroke-width="3"/>`,
  // 1: статистика — столбцы растут, линия рисуется
  n(5, (i) => `<rect class="sc-bar" style="--i:${i}" x="${80 + i * 52}" y="40" width="30" height="110" rx="8" fill="${ink}" opacity="${0.55 + i * 0.1}"/>`) +
    `<path class="sc-line" d="M80 120 L132 90 L184 104 L236 60 L288 44" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`,
  // 2: запись — слоты времени, один занимается
  n(6, (i) => `<rect class="${i === 3 ? "sc-slot sc-pick" : "sc-slot"}" x="${88 + (i % 3) * 78}" y="${52 + Math.floor(i / 3) * 52}" width="66" height="38" rx="12" fill="${ink}" opacity=".3"/>`) +
    `<path class="sc-tick" d="M154 123 l8 8 16 -18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`,
  // 3: сокращатель — длинная ссылка схлопывается в короткую
  `<rect class="sc-long" x="60" y="82" width="280" height="26" rx="13" fill="${ink}" opacity=".45"/>
   <rect class="sc-short" x="160" y="82" width="80" height="26" rx="13" fill="${ink}"/>`,
  // 4: логи — строки бегут вверх
  `<g class="sc-scroll">${n(16, (i) => `<rect x="70" y="${14 + i * 24}" width="${120 + ((i * 53) % 150)}" height="8" rx="4" fill="${ink}" opacity="${i % 4 === 0 ? 0.9 : 0.4}"/>`)}</g>`,
  // 5: привычки — клетки серии зажигаются по очереди
  n(21, (i) => `<rect class="sc-day" style="--i:${i}" x="${64 + (i % 7) * 40}" y="${24 + Math.floor(i / 7) * 40}" width="30" height="30" rx="9" fill="${ink}"/>`),
];
export const scene = (i) => `<svg class="scene" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${covers[i] ?? ""}</svg>`;
