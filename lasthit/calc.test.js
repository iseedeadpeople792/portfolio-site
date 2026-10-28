import test from "node:test";
import assert from "node:assert/strict";
import { combine, evaluate, physicalMultiplier } from "./calc.js";

test("множитель брони: 0 даёт 1, броня 2 снижает урон на 10,7%", () => {
  assert.equal(physicalMultiplier(0), 1);
  assert.ok(Math.abs(physicalMultiplier(2) - (1 - 0.12 / 1.12)) < 1e-12);
  assert.ok(physicalMultiplier(-5) > 1); // отрицательная броня усиливает урон
});

test("число ударов и вердикты", () => {
  assert.deepEqual(evaluate(100, 54, 60, 0), { hits: 2, one: false, maybe: false });
  assert.deepEqual(evaluate(54, 54, 60, 0), { hits: 1, one: true, maybe: true });
  assert.deepEqual(evaluate(58, 54, 60, 0), { hits: 2, one: false, maybe: true }); // только высокий урон
  assert.deepEqual(evaluate(0, 54, 60, 0), { hits: 0, one: true, maybe: true });
  assert.throws(() => evaluate(10, 0, 0, 0));
});

const TYPES = [{ hp: 550, armor: 2 }, { hp: 300, armor: 0 }];

test("зелёным только если гарантировано для обоих типов", () => {
  assert.equal(combine(0.05, 54, 60, TYPES).state, "green"); // 27 и 15 здоровья
  assert.equal(combine(0.1, 54, 60, TYPES).state, "amber"); // дальний гарантированно, ближний (55 здоровья с бронёй) нет: не зелёный
  assert.equal(combine(0.3, 54, 60, TYPES).state, "red"); // ни один тип не добить одним ударом
  assert.equal(combine(0.2, 54, 60, TYPES).range, "2–3");
});
