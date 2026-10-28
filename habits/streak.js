// Подсчёт серий привычки по списку дат выполнения (строки ГГГГ-ММ-ДД).
const DAY = 86400000;
const toUtc = (s) => Date.parse(s + "T00:00:00Z");

/** Текущая серия: подряд идущие дни, заканчивающиеся сегодня или вчера. */
export function currentStreak(dates, today) {
  const set = new Set(dates);
  let day = toUtc(today);
  if (!set.has(today)) day -= DAY; // сегодня ещё можно отметить, серия не обрывается
  let n = 0;
  while (set.has(new Date(day).toISOString().slice(0, 10))) {
    n++;
    day -= DAY;
  }
  return n;
}

/** Самая длинная серия за всё время. */
export function bestStreak(dates) {
  const days = [...new Set(dates)].map(toUtc).sort((a, b) => a - b);
  let best = 0, run = 0;
  days.forEach((d, i) => {
    run = i && d - days[i - 1] === DAY ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}
