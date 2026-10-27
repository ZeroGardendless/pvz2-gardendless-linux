var e = /* @__PURE__ */ new Set([`ShiftLeft`, `ShiftRight`, `ControlLeft`, `ControlRight`, `AltLeft`, `AltRight`, `MetaLeft`, `MetaRight`]), t = /* @__PURE__ */ new Set([`Shift`, `Control`, `Ctrl`, `Alt`, `Meta`]), n = { Escape: `Escape`, Esc: `Escape`, Enter: `Enter`, Tab: `Tab`, Space: `Space`, " ": `Space`, Backspace: `Backspace`, Delete: `Delete`, Insert: `Insert`, Home: `Home`, End: `End`, PageUp: `PageUp`, "Page Up": `PageUp`, PageDown: `PageDown`, "Page Down": `PageDown`, ArrowLeft: `ArrowLeft`, Left: `ArrowLeft`, ArrowRight: `ArrowRight`, Right: `ArrowRight`, ArrowUp: `ArrowUp`, Up: `ArrowUp`, ArrowDown: `ArrowDown`, Down: `ArrowDown`, Backquote: `Backquote`, "`": `Backquote`, Minus: `Minus`, "-": `Minus`, Equal: `Equal`, "=": `Equal`, BracketLeft: `BracketLeft`, "[": `BracketLeft`, BracketRight: `BracketRight`, "]": `BracketRight`, Backslash: `Backslash`, "\\": `Backslash`, Semicolon: `Semicolon`, ";": `Semicolon`, Quote: `Quote`, "'": `Quote`, Comma: `Comma`, ",": `Comma`, Period: `Period`, ".": `Period`, Slash: `Slash`, "/": `Slash` }, r = { Escape: `Esc`, Enter: `Enter`, Tab: `Tab`, Space: `Space`, Backspace: `Backspace`, Delete: `Delete`, Insert: `Insert`, Home: `Home`, End: `End`, PageUp: `Page Up`, PageDown: `Page Down`, ArrowLeft: `Left`, ArrowRight: `Right`, ArrowUp: `Up`, ArrowDown: `Down`, Backquote: "`", Minus: `-`, Equal: `=`, BracketLeft: `[`, BracketRight: `]`, Backslash: `\\`, Semicolon: `;`, Quote: `'`, Comma: `,`, Period: `.`, Slash: `/` }, i = Object.freeze({ key: `F9`, code: `F9`, ctrl: false, alt: false, shift: false, meta: false });
function a(e2) {
  return e2 === true;
}
function o(n2, r2) {
  return e.has(n2) || t.has(r2);
}
function s(e2) {
  if (typeof e2 != `string`) return ``;
  let t2 = e2.trim();
  return t2 ? n[t2] ? n[t2] : /^F\d{1,2}$/i.test(t2) ? t2.toUpperCase() : /^[a-z]$/i.test(t2) ? `Key${t2.toUpperCase()}` : /^\d$/.test(t2) ? `Digit${t2}` : `` : ``;
}
function c(e2, t2 = ``) {
  if (typeof e2 == `string` && e2) {
    if (r[e2]) return r[e2];
    if (/^Key[A-Z]$/.test(e2)) return e2.slice(3);
    if (/^Digit\d$/.test(e2)) return e2.slice(5);
    if (/^Numpad\d$/.test(e2)) return `Num ${e2.slice(6)}`;
    if (/^F\d{1,2}$/.test(e2)) return e2;
  }
  let n2 = typeof t2 == `string` ? t2.trim() : ``;
  return n2 ? n2 === ` ` ? `Space` : n2.length === 1 ? n2.toUpperCase() : n2 === `Escape` ? `Esc` : n2.startsWith(`Arrow`) ? n2.slice(5) : n2 : ``;
}
function l(e2, t2) {
  return (typeof e2 == `string` ? e2.trim() : ``) || s(t2);
}
function u(e2, t2 = i) {
  let n2 = e2 && typeof e2 == `object` ? e2 : {}, r2 = t2 && typeof t2 == `object` ? t2 : i, u2 = l(n2.code, n2.key), d2 = c(u2, n2.key);
  return !d2 || o(u2, d2) ? { ...r2 } : { key: d2, code: u2 || s(d2), ctrl: a(n2.ctrl), alt: a(n2.alt), shift: a(n2.shift), meta: a(n2.meta) };
}
function d(e2) {
  let t2 = u(e2), n2 = [];
  return t2.ctrl && n2.push(`Ctrl`), t2.alt && n2.push(`Alt`), t2.shift && n2.push(`Shift`), t2.meta && n2.push(`Win`), n2.push(t2.key), n2.join(`+`);
}
function f(e2) {
  if (!e2) return null;
  let t2 = l(e2.code, e2.key), n2 = c(t2, e2.key);
  return !n2 || o(t2, n2) ? null : u({ key: n2, code: t2, ctrl: e2.ctrlKey, alt: e2.altKey, shift: e2.shiftKey, meta: e2.metaKey });
}
function p(e2, t2) {
  if (!t2 || t2.repeat) return false;
  let n2 = u(e2);
  if (!!t2.ctrlKey !== n2.ctrl || !!t2.altKey !== n2.alt || !!t2.shiftKey !== n2.shift || !!t2.metaKey !== n2.meta) return false;
  let r2 = l(t2.code, t2.key);
  return r2 && n2.code ? r2 === n2.code : c(``, t2.key) === n2.key;
}
function m(e2) {
  let t2 = u(e2);
  return t2.ctrl || t2.alt || t2.meta;
}
var h = Object.freeze({ sunLock: `cheats.lockSun`, coinLock: `cheats.lockCoins`, gemLock: `cheats.lockGems`, sproutLock: `cheats.lockSeeds`, ticketLock: `cheats.lockTickets`, worldkeyLock: `cheats.lockWorldKeys`, freePlant: `cheats.freePlant`, noCooldown: `cheats.noCooldown`, freePF: `cheats.freePF`, invincible: `cheats.invincible`, autoCollect: `cheats.autoCollect`, speed: `cheats.gameSpeed`, addSun: `cheats.addSun` });
function g(e2) {
  let t2 = {};
  for (let n2 of Object.keys(h)) {
    let r2 = e2?.[n2];
    if (!r2 || typeof r2 != `object`) continue;
    let i2 = u(r2, {});
    i2.key && i2.code && (t2[n2] = i2);
  }
  return t2;
}
function _(e2, t2) {
  return !e2 || !t2 ? false : p(e2, { code: t2.code, key: t2.key, ctrlKey: t2.ctrl, altKey: t2.alt, shiftKey: t2.shift, metaKey: t2.meta });
}
function v(e2, t2, n2) {
  return n2 !== `overlay` && _(e2, t2.overlayHotkey) ? `overlay` : Object.keys(h).find((r2) => r2 !== n2 && _(e2, t2.trainerHotkeys?.[r2])) || null;
}
function y(e2, t2, n2) {
  if (e2.defaultPrevented || e2.repeat || e2.isComposing || e2.keyCode === 229 || e2.target?.closest?.(`input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-gp-hotkey-recorder="true"]`)) return false;
  let r2 = Object.keys(h).find((n3) => t2[n3] && p(t2[n3], e2));
  return !r2 || !n2(r2) ? false : (e2.preventDefault(), e2.stopImmediatePropagation(), true);
}
function b(e2, t2, n2) {
  return e2.code === `Escape` ? true : e2.keyCode > 0 && Object.values(t2 || {}).some((t3) => n2?.[t3] === e2.keyCode);
}
export {
  v as a,
  f as c,
  u as d,
  g as i,
  m as l,
  y as n,
  i as o,
  b as r,
  d as s,
  h as t,
  p as u
};
