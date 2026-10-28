// Тот же разбор, что в log-analyzer/log_analyzer.py (формат combined, nginx и Apache).
export const LINE = /^(\S+) \S+ \S+ \[[^\]]+\] "(?:\S+) (\S+)[^"]*" (\d{3}) /;

/** Выдаёт [ip, путь без query, статус]; битые строки пропускаются. */
export function* parse(lines) {
  for (const line of lines) {
    const m = LINE.exec(line);
    if (m) yield [m[1], m[2].split("?")[0], Number(m[3])];
  }
}

const topN = (counter, n) => [...counter].sort((a, b) => b[1] - a[1]).slice(0, n); // сортировка устойчивая, как Counter.most_common

// round(x, 1) в Python при точной середине округляет к чётному; Math.round() и toFixed() округлили бы вверх.
function round1(x) {
  const t = x * 10;
  const f = Math.floor(t);
  return (t - f === 0.5 ? (f % 2 === 0 ? f : f + 1) : Math.round(t)) / 10;
}

export function analyze(lines, top = 5) {
  const paths = new Map(), ips = new Map(), classes = new Map();
  let total = 0;
  const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);
  for (const [ip, path, status] of parse(lines)) {
    total++;
    bump(paths, path);
    bump(ips, ip);
    bump(classes, Math.floor(status / 100));
  }
  const pct = (n) => (total ? round1((100 * (n ?? 0)) / total) : 0);
  return {
    total,
    errors_4xx_pct: pct(classes.get(4)),
    errors_5xx_pct: pct(classes.get(5)),
    top_paths: topN(paths, top),
    top_ips: topN(ips, top),
  };
}
