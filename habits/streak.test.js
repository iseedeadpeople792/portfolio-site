import test from "node:test";
import assert from "node:assert/strict";
import { bestStreak, currentStreak } from "./streak.js";

// Те же проверки, что в habit-tracker/test.mjs
const days = ["2026-10-24", "2026-10-25", "2026-10-26", "2026-10-28"];

test("текущая серия", () => {
  assert.equal(currentStreak(days, "2026-10-28"), 1); // 27-го пропуск
  assert.equal(currentStreak(["2026-10-26", "2026-10-27"], "2026-10-28"), 2); // сегодня ещё не отмечено
  assert.equal(currentStreak(["2026-10-20"], "2026-10-28"), 0); // серия оборвалась
});

test("рекорд", () => {
  assert.equal(bestStreak(days), 3);
  assert.equal(bestStreak([]), 0);
  assert.equal(bestStreak(["2026-10-01", "2026-10-01"]), 1); // дубль даты
});
