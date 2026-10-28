import test from "node:test";
import assert from "node:assert/strict";
import { analyze } from "./analyze.js";

// Те же строки и ожидания, что в log-analyzer/test_log_analyzer.py
const SAMPLE = [
  '1.1.1.1 - - [28/Oct/2026:10:00:00 +0300] "GET /index.html?x=1 HTTP/1.1" 200 512 "-" "curl"',
  '1.1.1.1 - - [28/Oct/2026:10:00:01 +0300] "GET /index.html HTTP/1.1" 200 512 "-" "curl"',
  '2.2.2.2 - - [28/Oct/2026:10:00:02 +0300] "GET /missing HTTP/1.1" 404 0 "-" "curl"',
  '3.3.3.3 - - [28/Oct/2026:10:00:03 +0300] "POST /api HTTP/1.1" 500 0 "-" "curl"',
  "это не строка лога",
];

test("счёт, проценты, query-строка отбрасывается", () => {
  const r = analyze(SAMPLE, 2);
  assert.equal(r.total, 4);
  assert.equal(r.errors_4xx_pct, 25);
  assert.equal(r.errors_5xx_pct, 25);
  assert.deepEqual(r.top_paths[0], ["/index.html", 2]);
  assert.deepEqual(r.top_ips[0], ["1.1.1.1", 2]);
  assert.equal(r.top_paths.length, 2);
});

test("пустой ввод", () => {
  assert.equal(analyze([]).total, 0);
  assert.equal(analyze([]).errors_5xx_pct, 0);
});

test("округление как в Python: точная середина идёт к чётному (12.25 даёт 12.2)", () => {
  const mk = (bad, total) => Array.from({ length: total }, (_, i) => `1.1.1.1 - - [d] "GET /a HTTP/1.1" ${i < bad ? 404 : 200} 1 "-" "-"`);
  assert.equal(analyze(mk(49, 400)).errors_4xx_pct, 12.2); // 12.25 в точности
  assert.equal(analyze(mk(1, 3)).errors_4xx_pct, 33.3);
});
