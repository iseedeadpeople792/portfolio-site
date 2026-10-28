import test from "node:test";
import assert from "node:assert/strict";
import { ALPHABET, COMBINATIONS, makeCode, validUrl } from "./code.js";

test("код: длина, алфавит без похожих символов", () => {
  assert.equal(makeCode(8).length, 8);
  assert.match(makeCode(), /^[a-km-zA-HJ-NP-Z2-9]{6}$/);
  for (const bad of "0O1lI") assert.ok(!ALPHABET.includes(bad));
});

test("сочетаний: 56 символов в шести позициях", () => {
  assert.equal(ALPHABET.length, 56);
  assert.equal(COMBINATIONS, 30840979456);
});

test("принимаются только http и https", () => {
  assert.ok(validUrl("https://example.com/a?b=1"));
  assert.ok(validUrl("http://example.com"));
  for (const bad of ["javascript:alert(1)", "file:///etc/passwd", "не ссылка", ""]) assert.ok(!validUrl(bad), bad);
});
