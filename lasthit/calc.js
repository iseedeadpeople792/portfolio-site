// Расчёт добивания: тот же, что в dota-lasthit/lasthit/calc.py (формула брони Dota 2).
export const ARMOR_FACTOR = 0.06;

export const physicalMultiplier = (armor) => 1 - (ARMOR_FACTOR * armor) / (1 + ARMOR_FACTOR * Math.abs(armor));

// hits: ударов даже при минимальном уроне; one: добивает минимальный урон; maybe: добивает только высокий.
export function evaluate(hp, dmgMin, dmgMax, armor = 0) {
  if (hp <= 0) return { hits: 0, one: true, maybe: true };
  const mult = physicalMultiplier(armor);
  const low = dmgMin * mult;
  const high = dmgMax * mult;
  if (low <= 0) throw new Error("damage must be positive");
  return { hits: Math.ceil(hp / low), one: hp <= low, maybe: hp <= high };
}

// Полоска показывает долю здоровья, а тип крипа неизвестен: считаем для обоих и сводим в один вердикт.
// state: "green" только если добивание гарантировано для обоих; "amber" если возможно при высоком уроне.
export function combine(frac, dmgMin, dmgMax, types) {
  const rows = types.map((t) => evaluate(frac * t.hp, dmgMin, dmgMax, t.armor));
  const hits = rows.map((r) => r.hits);
  const lo = Math.min(...hits);
  const hi = Math.max(...hits);
  const state = rows.every((r) => r.one) ? "green" : rows.some((r) => r.maybe) ? "amber" : "red";
  return { rows, lo, hi, range: lo === hi ? String(lo) : `${lo}–${hi}`, state };
}
