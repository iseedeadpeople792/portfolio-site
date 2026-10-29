// Обложки проектов: мини-копии интерфейсов самих сайтов, нарисованные в SVG и анимированные в цикле.
// Видимая область зависит от размера карточки (slice), поэтому важное лежит в полосе y = 30..150.
const n = (k, f) => Array.from({ length: k }, (_, i) => f(i)).join("");
const set = new Set();
// Появление элемента на a% цикла: из состояния `from` в обычное, в конце цикла гаснет.
const kf = (a, from = "translateY(6px)") => {
  const name = `r${a}${from.replace(/\W/g, "")}`;
  set.add(`@keyframes ${name}{0%,${a}%{opacity:0;transform:${from}}${a + 6}%,90%{opacity:1;transform:none}97%,100%{opacity:0;transform:none}}`);
  return name;
};
const at = (a, T, from, extra = "") => `style="animation:${kf(a, from)} ${T}s ease-out infinite;${extra}"`;
const MONO = `font-family="JetBrains Mono,ui-monospace,monospace"`;
const L = "transform-origin:left center;";

// 0. Помощник добивания: тёмно-зелёный экран, над крипами тают полоски и меняются числа ударов
const creeps = [[110, "5-11", "#7b2a32"], [200, "4-7", "#6b5a2a"], [290, "2-4", "#7b2a4a"]];
const lasthit = `<rect width="400" height="180" fill="#07120b"/>
  <g class="lh-grid">${n(16, (i) => `<rect y="${i * 12 - 12}" width="400" height="1" fill="#6ef08a" fill-opacity=".08"/>`)}</g>
  <rect x="26" y="8" width="348" height="170" rx="16" fill="#0b1a11" stroke="#6ef08a" stroke-opacity=".2"/>
  ${creeps.map(([x, t, c], i) => `<g style="--i:${i}">
    <ellipse cx="${x}" cy="146" rx="24" ry="5" fill="#000" fill-opacity=".4"/>
    <g class="lh-c"><rect x="${x - 15}" y="106" width="30" height="40" rx="15" fill="${c}"/><circle cx="${x}" cy="98" r="11" fill="${c}"/></g>
    <rect x="${x - 27}" y="70" width="54" height="7" rx="3.5" fill="#1c2e22"/>
    <rect class="lh-f" x="${x - 27}" y="70" width="54" height="7" rx="3.5" fill="#e5535a"/>
    <text class="lh-a" x="${x}" y="62" text-anchor="middle" font-size="11" font-weight="700" ${MONO} fill="#e8f5ec">${t}</text>
    <text class="lh-z" x="${x}" y="62" text-anchor="middle" font-size="11" font-weight="700" ${MONO} fill="#6ef08a">1</text></g>`).join("")}`;

// 1. Dota 2 Статистика: окно приложения с вкладками, плитками и графиком
const T1 = 7;
const tiles = [["29%", 70], ["1.1", 162], ["12", 254]];
const stats = `<rect width="400" height="180" fill="#0a0a11"/>
  <rect x="56" y="8" width="288" height="176" rx="14" fill="#12121b" stroke="#2a2a3a"/>
  ${n(3, (i) => `<circle cx="${70 + i * 10}" cy="22" r="2.6" fill="#3a3a4c"/>`)}
  <rect class="st-tab" x="68" y="32" width="50" height="13" rx="6.5" fill="#8b7bff" fill-opacity=".25" stroke="#8b7bff"/>
  <rect x="76" y="37" width="34" height="3" rx="1.5" fill="#cfc8ff"/>
  ${n(3, (i) => `<rect x="${130 + i * 54}" y="37" width="34" height="3" rx="1.5" fill="#44445a"/>`)}
  ${tiles.map(([v, x], i) => `<g ${at(4 + i * 6, T1)}><rect x="${x}" y="54" width="84" height="38" rx="9" fill="#181824" stroke="#2a2a3a"/>
    <rect x="${x + 9}" y="62" width="26" height="3" rx="1.5" fill="#5a5a72"/>
    <text x="${x + 9}" y="84" font-size="17" font-weight="700" font-family="Unbounded,sans-serif" fill="#fff">${v}</text></g>`).join("")}
  <rect x="70" y="100" width="268" height="52" rx="9" fill="#101019" stroke="#22222f"/>
  <path ${at(30, T1, "none")} d="M78 144 L112 134 L144 138 L176 120 L212 126 L248 110 L284 114 L330 106 V148 H78Z" fill="#8b7bff" fill-opacity=".14"/>
  <path class="st-line" d="M78 144 L112 134 L144 138 L176 120 L212 126 L248 110 L284 114 L330 106" fill="none" stroke="#8b7bff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
  <circle class="st-dot" cx="330" cy="106" r="3.6" fill="#fff"/>`;

// 2. Бот записи: телефон с чатом, сообщения появляются по очереди, вокруг плавают значки
const T2 = 9;
const bots = `<rect width="400" height="180" fill="#ffe9ee"/>
  <circle cx="70" cy="150" r="70" fill="#ffd1c1" fill-opacity=".7"/><circle cx="340" cy="30" r="60" fill="#ffc2d6" fill-opacity=".7"/>
  <rect x="138" y="-14" width="124" height="214" rx="24" fill="#241631"/>
  <rect x="144" y="-8" width="112" height="202" rx="19" fill="#fdf1f4"/>
  <rect x="144" y="2" width="112" height="26" fill="#fff"/><circle cx="158" cy="15" r="6" fill="#ff7aa8"/>
  <rect x="169" y="10" width="34" height="3.5" rx="1.7" fill="#2a1a35"/><rect x="169" y="17" width="20" height="3" rx="1.5" fill="#c9b3bf"/>
  <g ${at(6, T2)}><rect x="150" y="38" width="84" height="26" rx="9" fill="#fff" stroke="#f3d4dc"/><rect x="158" y="46" width="64" height="3.5" rx="1.7" fill="#c9b3bf"/><rect x="158" y="54" width="42" height="3.5" rx="1.7" fill="#c9b3bf"/></g>
  <g ${at(22, T2)}>${n(3, (i) => `<rect x="${150 + i * 36}" y="70" width="32" height="14" rx="6" fill="#fff" stroke="#f3d4dc"/>`)}
    <rect class="bt-pick" x="186" y="70" width="32" height="14" rx="6" fill="#4ea1f3"/></g>
  <g ${at(42, T2)}><rect x="196" y="92" width="54" height="18" rx="9" fill="#4ea1f3"/><rect x="206" y="99" width="34" height="3.5" rx="1.7" fill="#fff"/></g>
  <g ${at(60, T2, "scale(.7)")}><rect x="150" y="116" width="92" height="30" rx="10" fill="#fff" stroke="#f3d4dc"/>
    <circle cx="163" cy="131" r="7" fill="#ff7aa8"/><path d="M159.500 131 l3 3 5-6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="175" y="124" width="56" height="3.5" rx="1.7" fill="#c9b3bf"/><rect x="175" y="133" width="36" height="3.5" rx="1.7" fill="#c9b3bf"/></g>
  <g class="bt-f1"><rect x="82" y="44" width="30" height="30" rx="9" fill="#fff" stroke="#f3d4dc"/><rect x="89" y="52" width="16" height="14" rx="3" fill="none" stroke="#ff7aa8" stroke-width="2.2"/><path d="M89 57h16" stroke="#ff7aa8" stroke-width="2"/></g>
  <g class="bt-f2"><rect x="290" y="62" width="30" height="30" rx="9" fill="#fff" stroke="#f3d4dc"/><path d="M305 69a6 6 0 00-6 6v4l-2 3h16l-2-3v-4a6 6 0 00-6-6z" fill="#ff7aa8"/></g>
  <g class="bt-f3"><rect x="90" y="104" width="30" height="30" rx="9" fill="#fff" stroke="#f3d4dc"/><circle cx="105" cy="119" r="8" fill="none" stroke="#ff7aa8" stroke-width="2.2"/><path d="M105 114v5l3 2" fill="none" stroke="#ff7aa8" stroke-width="2" stroke-linecap="round"/></g>`;

// 3. Сокращатель: длинная ссылка схлопывается в короткую
const T3 = 5;
const shortener = `<rect width="400" height="180" fill="#1b2cff"/>
  <circle cx="330" cy="20" r="80" fill="#fff" fill-opacity=".06"/><circle cx="40" cy="170" r="70" fill="#fff" fill-opacity=".06"/>
  <text class="sh-long" x="46" y="94" font-size="8" ${MONO} fill="#fff">https://example.com/blog/kak-rabotaet-edge/chast-2?utm_source=ne</text>
  <g ${at(44, T3, "scale(.3)")}><rect x="136" y="76" width="128" height="30" rx="15" fill="#d7ff3a"/>
    <text x="200" y="96" text-anchor="middle" font-size="11.500" font-weight="700" ${MONO} fill="#101a00">sho.rt/a7k2</text></g>
  <g ${at(62, T3, "scale(.3)")}><circle cx="286" cy="91" r="10" fill="#fff"/><path d="M281 91 l4 4 7-8" fill="none" stroke="#1b2cff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;

// 4. Анализатор логов: терминал, набирается команда, выводятся строки и растут полоски
const T4 = 8;
const rows = [["requests", "12 480", "#e9dcc0"], ["4xx", "3.1%", "#ffb000"], ["5xx", "0.4%", "#ff6b5e"], ["top", "/index.html", "#8fc7ff"]];
const logs = `<rect width="400" height="180" fill="#0c0a06"/>
  <rect x="40" y="8" width="320" height="176" rx="14" fill="#14110a" stroke="#2e2716"/>
  ${n(3, (i) => `<circle cx="${54 + i * 10}" cy="22" r="2.6" fill="#3a3220"/>`)}
  <text ${at(0, T4, "none")} x="56" y="46" font-size="8.500" ${MONO}><tspan fill="#ffb000">$ </tspan><tspan fill="#8fc7ff">python log_analyzer.py access.log</tspan></text>
  ${rows.map(([k, v, c], i) => `<text ${at(14 + i * 9, T4)} x="56" y="${64 + i * 13}" font-size="8.500" ${MONO}><tspan fill="#7d7458">${k.padEnd(9, " ")}</tspan><tspan fill="${c}" xml:space="preserve">${v}</tspan></text>`).join("")}
  ${[[240, 1], [110, 2], [36, 3]].map(([w, i]) => `<rect x="56" y="${100 + i * 12}" width="${w}" height="7" rx="3.5" fill="#ffb000" ${at(44 + i * 8, T4, "scaleX(0)", L)}/>`).join("")}`;

// 5. Трекер привычек: светлая карточка, клетки серии заполняются по очереди
const habits = `<rect width="400" height="180" fill="#f7f7fb"/>
  <rect x="50" y="8" width="300" height="176" rx="18" fill="#eceef3"/>
  <text x="66" y="48" font-size="25" font-weight="600" font-family="Unbounded,sans-serif" fill="#15151f">11</text>
  <text x="112" y="48" font-size="25" font-weight="600" font-family="Unbounded,sans-serif" fill="#15151f">18</text>
  ${n(14, (c) => n(4, (r) => {
    const k = c >= 12 && (c + r) % 3 !== 0 ? "#ffc83d" : (c * 5 + r * 3) % 7 > 1 ? "#2fd08a" : "#dfe2ea";
    return `<rect x="${70 + c * 17}" y="${62 + r * 17}" width="14" height="14" rx="4" fill="${k}" ${at(c * 4, 8, "scale(.3)")}/>`;
  }))}
  <rect class="hb-now" x="291" y="113" width="14" height="14" rx="4" fill="none" stroke="#15151f" stroke-width="1.6"/>`;

const covers = [lasthit, stats, bots, shortener, logs, habits];
export const coverCss = [...set].join("");
export const scene = (i) => `<svg class="scene" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" font-family="Manrope,system-ui,sans-serif" aria-hidden="true">${covers[i] ?? ""}</svg>`;
