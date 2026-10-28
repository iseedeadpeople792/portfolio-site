// Логика из url-shortener-worker/worker.js: алфавит без похожих символов, проверка http(s).
export const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // без 0/O и 1/l/I
export const CODE_LEN = 6;
export const COMBINATIONS = ALPHABET.length ** CODE_LEN;

export function makeCode(len = CODE_LEN, rand = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n) {
  return Array.from({ length: len }, () => ALPHABET[rand(ALPHABET.length)]).join("");
}

/** Только http(s): иначе возможны javascript: и file: ссылки. */
export function validUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
