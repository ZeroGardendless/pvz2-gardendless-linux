import { r as e, t } from "../vendor/ModuleHelpers.js";
var n = t(((e2, t2) => {
  t2.exports = class {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(e3) {
      let t3 = this.map.get(e3);
      if (t3 !== void 0) return this.map.delete(e3), this.map.set(e3, t3), t3;
    }
    delete(e3) {
      return this.map.delete(e3);
    }
    set(e3, t3) {
      if (!this.delete(e3) && t3 !== void 0) {
        if (this.map.size >= this.max) {
          let e4 = this.map.keys().next().value;
          this.delete(e4);
        }
        this.map.set(e3, t3);
      }
      return this;
    }
  };
})), r = t(((e2, t2) => {
  var n2 = Object.freeze({ loose: true }), r2 = Object.freeze({});
  t2.exports = (e3) => e3 ? typeof e3 == `object` ? e3 : n2 : r2;
})), i = t(((e2, t2) => {
  var n2 = `2.0.0`, r2 = 256;
  t2.exports = { MAX_LENGTH: r2, MAX_SAFE_COMPONENT_LENGTH: 16, MAX_SAFE_BUILD_LENGTH: r2 - 6, MAX_SAFE_INTEGER: 2 ** 53 - 1 || 9007199254740991, RELEASE_TYPES: [`major`, `premajor`, `minor`, `preminor`, `patch`, `prepatch`, `prerelease`], SEMVER_SPEC_VERSION: n2, FLAG_INCLUDE_PRERELEASE: 1, FLAG_LOOSE: 2 };
})), a = t(((e2, t2) => {
  t2.exports = typeof process == `object` && {}.NODE_DEBUG && /\bsemver\b/i.test({}.NODE_DEBUG) ? (...e3) => console.error(`SEMVER`, ...e3) : () => {
  };
})), o = t(((e2, t2) => {
  var { MAX_SAFE_COMPONENT_LENGTH: n2, MAX_SAFE_BUILD_LENGTH: r2, MAX_LENGTH: o2 } = i(), s2 = a();
  e2 = t2.exports = {};
  var c2 = e2.re = [], l2 = e2.safeRe = [], u2 = e2.src = [], d2 = e2.safeSrc = [], f2 = e2.t = {}, p2 = 0, m2 = `[a-zA-Z0-9-]`, h2 = [[`\\s`, 1], [`\\d`, o2], [m2, r2]], g2 = (e3) => {
    for (let [t3, n3] of h2) e3 = e3.split(`${t3}*`).join(`${t3}{0,${n3}}`).split(`${t3}+`).join(`${t3}{1,${n3}}`);
    return e3;
  }, _2 = (e3, t3, n3) => {
    let r3 = g2(t3), i2 = p2++;
    s2(e3, i2, t3), f2[e3] = i2, u2[i2] = t3, d2[i2] = r3, c2[i2] = new RegExp(t3, n3 ? `g` : void 0), l2[i2] = new RegExp(r3, n3 ? `g` : void 0);
  };
  _2(`NUMERICIDENTIFIER`, `0|[1-9]\\d*`), _2(`NUMERICIDENTIFIERLOOSE`, `\\d+`), _2(`NONNUMERICIDENTIFIER`, `\\d*[a-zA-Z-]${m2}*`), _2(`MAINVERSION`, `(${u2[f2.NUMERICIDENTIFIER]})\\.(${u2[f2.NUMERICIDENTIFIER]})\\.(${u2[f2.NUMERICIDENTIFIER]})`), _2(`MAINVERSIONLOOSE`, `(${u2[f2.NUMERICIDENTIFIERLOOSE]})\\.(${u2[f2.NUMERICIDENTIFIERLOOSE]})\\.(${u2[f2.NUMERICIDENTIFIERLOOSE]})`), _2(`PRERELEASEIDENTIFIER`, `(?:${u2[f2.NONNUMERICIDENTIFIER]}|${u2[f2.NUMERICIDENTIFIER]})`), _2(`PRERELEASEIDENTIFIERLOOSE`, `(?:${u2[f2.NONNUMERICIDENTIFIER]}|${u2[f2.NUMERICIDENTIFIERLOOSE]})`), _2(`PRERELEASE`, `(?:-(${u2[f2.PRERELEASEIDENTIFIER]}(?:\\.${u2[f2.PRERELEASEIDENTIFIER]})*))`), _2(`PRERELEASELOOSE`, `(?:-?(${u2[f2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${u2[f2.PRERELEASEIDENTIFIERLOOSE]})*))`), _2(`BUILDIDENTIFIER`, `${m2}+`), _2(`BUILD`, `(?:\\+(${u2[f2.BUILDIDENTIFIER]}(?:\\.${u2[f2.BUILDIDENTIFIER]})*))`), _2(`FULLPLAIN`, `v?${u2[f2.MAINVERSION]}${u2[f2.PRERELEASE]}?${u2[f2.BUILD]}?`), _2(`FULL`, `^${u2[f2.FULLPLAIN]}$`), _2(`LOOSEPLAIN`, `[v=\\s]*${u2[f2.MAINVERSIONLOOSE]}${u2[f2.PRERELEASELOOSE]}?${u2[f2.BUILD]}?`), _2(`LOOSE`, `^${u2[f2.LOOSEPLAIN]}$`), _2(`GTLT`, `((?:<|>)?=?)`), _2(`XRANGEIDENTIFIERLOOSE`, `${u2[f2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _2(`XRANGEIDENTIFIER`, `${u2[f2.NUMERICIDENTIFIER]}|x|X|\\*`), _2(`XRANGEPLAIN`, `[v=\\s]*(${u2[f2.XRANGEIDENTIFIER]})(?:\\.(${u2[f2.XRANGEIDENTIFIER]})(?:\\.(${u2[f2.XRANGEIDENTIFIER]})(?:${u2[f2.PRERELEASE]})?${u2[f2.BUILD]}?)?)?`), _2(`XRANGEPLAINLOOSE`, `[v=\\s]*(${u2[f2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u2[f2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u2[f2.XRANGEIDENTIFIERLOOSE]})(?:${u2[f2.PRERELEASELOOSE]})?${u2[f2.BUILD]}?)?)?`), _2(`XRANGE`, `^${u2[f2.GTLT]}\\s*${u2[f2.XRANGEPLAIN]}$`), _2(`XRANGELOOSE`, `^${u2[f2.GTLT]}\\s*${u2[f2.XRANGEPLAINLOOSE]}$`), _2(`COERCEPLAIN`, `(^|[^\\d])(\\d{1,${n2}})(?:\\.(\\d{1,${n2}}))?(?:\\.(\\d{1,${n2}}))?`), _2(`COERCE`, `${u2[f2.COERCEPLAIN]}(?:$|[^\\d])`), _2(`COERCEFULL`, u2[f2.COERCEPLAIN] + `(?:${u2[f2.PRERELEASE]})?(?:${u2[f2.BUILD]})?(?:$|[^\\d])`), _2(`COERCERTL`, u2[f2.COERCE], true), _2(`COERCERTLFULL`, u2[f2.COERCEFULL], true), _2(`LONETILDE`, `(?:~>?)`), _2(`TILDETRIM`, `(\\s*)${u2[f2.LONETILDE]}\\s+`, true), e2.tildeTrimReplace = `$1~`, _2(`TILDE`, `^${u2[f2.LONETILDE]}${u2[f2.XRANGEPLAIN]}$`), _2(`TILDELOOSE`, `^${u2[f2.LONETILDE]}${u2[f2.XRANGEPLAINLOOSE]}$`), _2(`LONECARET`, `(?:\\^)`), _2(`CARETTRIM`, `(\\s*)${u2[f2.LONECARET]}\\s+`, true), e2.caretTrimReplace = `$1^`, _2(`CARET`, `^${u2[f2.LONECARET]}${u2[f2.XRANGEPLAIN]}$`), _2(`CARETLOOSE`, `^${u2[f2.LONECARET]}${u2[f2.XRANGEPLAINLOOSE]}$`), _2(`COMPARATORLOOSE`, `^${u2[f2.GTLT]}\\s*(${u2[f2.LOOSEPLAIN]})$|^$`), _2(`COMPARATOR`, `^${u2[f2.GTLT]}\\s*(${u2[f2.FULLPLAIN]})$|^$`), _2(`COMPARATORTRIM`, `(\\s*)${u2[f2.GTLT]}\\s*(${u2[f2.LOOSEPLAIN]}|${u2[f2.XRANGEPLAIN]})`, true), e2.comparatorTrimReplace = `$1$2$3`, _2(`HYPHENRANGE`, `^\\s*(${u2[f2.XRANGEPLAIN]})\\s+-\\s+(${u2[f2.XRANGEPLAIN]})\\s*$`), _2(`HYPHENRANGELOOSE`, `^\\s*(${u2[f2.XRANGEPLAINLOOSE]})\\s+-\\s+(${u2[f2.XRANGEPLAINLOOSE]})\\s*$`), _2(`STAR`, `(<|>)?=?\\s*\\*`), _2(`GTE0`, `^\\s*>=\\s*0\\.0\\.0\\s*$`), _2(`GTE0PRE`, `^\\s*>=\\s*0\\.0\\.0-0\\s*$`);
})), s = t(((e2, t2) => {
  var n2 = /^[0-9]+$/, r2 = (e3, t3) => {
    if (typeof e3 == `number` && typeof t3 == `number`) return e3 === t3 ? 0 : e3 < t3 ? -1 : 1;
    let r3 = n2.test(e3), i2 = n2.test(t3);
    return r3 && i2 && (e3 = +e3, t3 = +t3), e3 === t3 ? 0 : r3 && !i2 ? -1 : i2 && !r3 ? 1 : e3 < t3 ? -1 : 1;
  };
  t2.exports = { compareIdentifiers: r2, rcompareIdentifiers: (e3, t3) => r2(t3, e3) };
})), c = t(((e2, t2) => {
  var n2 = a(), { MAX_LENGTH: c2, MAX_SAFE_INTEGER: l2 } = i(), { safeRe: u2, t: d2 } = o(), f2 = r(), { compareIdentifiers: p2 } = s(), m2 = (e3, t3) => {
    let n3 = t3.split(`.`);
    if (n3.length > e3.length) return false;
    for (let t4 = 0; t4 < n3.length; t4++) if (p2(e3[t4], n3[t4]) !== 0) return false;
    return true;
  };
  t2.exports = class e3 {
    constructor(t3, r2) {
      if (r2 = f2(r2), t3 instanceof e3) {
        if (t3.loose === !!r2.loose && t3.includePrerelease === !!r2.includePrerelease) return t3;
        t3 = t3.version;
      } else if (typeof t3 != `string`) throw TypeError(`Invalid version. Must be a string. Got type "${typeof t3}".`);
      if (t3.length > c2) throw TypeError(`version is longer than ${c2} characters`);
      n2(`SemVer`, t3, r2), this.options = r2, this.loose = !!r2.loose, this.includePrerelease = !!r2.includePrerelease;
      let i2 = t3.trim().match(r2.loose ? u2[d2.LOOSE] : u2[d2.FULL]);
      if (!i2) throw TypeError(`Invalid Version: ${t3}`);
      if (this.raw = t3, this.major = +i2[1], this.minor = +i2[2], this.patch = +i2[3], this.major > l2 || this.major < 0) throw TypeError(`Invalid major version`);
      if (this.minor > l2 || this.minor < 0) throw TypeError(`Invalid minor version`);
      if (this.patch > l2 || this.patch < 0) throw TypeError(`Invalid patch version`);
      i2[4] ? this.prerelease = i2[4].split(`.`).map((e4) => {
        if (/^[0-9]+$/.test(e4)) {
          let t4 = +e4;
          if (t4 >= 0 && t4 < l2) return t4;
        }
        return e4;
      }) : this.prerelease = [], this.build = i2[5] ? i2[5].split(`.`) : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(`.`)}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(t3) {
      if (n2(`SemVer.compare`, this.version, this.options, t3), !(t3 instanceof e3)) {
        if (typeof t3 == `string` && t3 === this.version) return 0;
        t3 = new e3(t3, this.options);
      }
      return t3.version === this.version ? 0 : this.compareMain(t3) || this.comparePre(t3);
    }
    compareMain(t3) {
      return t3 instanceof e3 || (t3 = new e3(t3, this.options)), this.major < t3.major ? -1 : this.major > t3.major ? 1 : this.minor < t3.minor ? -1 : this.minor > t3.minor ? 1 : this.patch < t3.patch ? -1 : +(this.patch > t3.patch);
    }
    comparePre(t3) {
      if (t3 instanceof e3 || (t3 = new e3(t3, this.options)), this.prerelease.length && !t3.prerelease.length) return -1;
      if (!this.prerelease.length && t3.prerelease.length) return 1;
      if (!this.prerelease.length && !t3.prerelease.length) return 0;
      let r2 = 0;
      do {
        let e4 = this.prerelease[r2], i2 = t3.prerelease[r2];
        if (n2(`prerelease compare`, r2, e4, i2), e4 === void 0 && i2 === void 0) return 0;
        if (i2 === void 0) return 1;
        if (e4 === void 0) return -1;
        if (e4 === i2) continue;
        return p2(e4, i2);
      } while (++r2);
    }
    compareBuild(t3) {
      t3 instanceof e3 || (t3 = new e3(t3, this.options));
      let r2 = 0;
      do {
        let e4 = this.build[r2], i2 = t3.build[r2];
        if (n2(`build compare`, r2, e4, i2), e4 === void 0 && i2 === void 0) return 0;
        if (i2 === void 0) return 1;
        if (e4 === void 0) return -1;
        if (e4 === i2) continue;
        return p2(e4, i2);
      } while (++r2);
    }
    inc(e4, t3, n3) {
      if (e4.startsWith(`pre`)) {
        if (!t3 && n3 === false) throw Error(`invalid increment argument: identifier is empty`);
        if (t3) {
          let e5 = `-${t3}`.match(this.options.loose ? u2[d2.PRERELEASELOOSE] : u2[d2.PRERELEASE]);
          if (!e5 || e5[1] !== t3) throw Error(`invalid identifier: ${t3}`);
        }
      }
      switch (e4) {
        case `premajor`:
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc(`pre`, t3, n3);
          break;
        case `preminor`:
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc(`pre`, t3, n3);
          break;
        case `prepatch`:
          this.prerelease.length = 0, this.inc(`patch`, t3, n3), this.inc(`pre`, t3, n3);
          break;
        case `prerelease`:
          this.prerelease.length === 0 && this.inc(`patch`, t3, n3), this.inc(`pre`, t3, n3);
          break;
        case `release`:
          if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case `major`:
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case `minor`:
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case `patch`:
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        case `pre`: {
          let e5 = +!!Number(n3);
          if (this.prerelease.length === 0) this.prerelease = [e5];
          else {
            let r2 = this.prerelease.length;
            for (; --r2 >= 0; ) typeof this.prerelease[r2] == `number` && (this.prerelease[r2]++, r2 = -2);
            if (r2 === -1) {
              if (t3 === this.prerelease.join(`.`) && n3 === false) throw Error(`invalid increment argument: identifier already exists`);
              this.prerelease.push(e5);
            }
          }
          if (t3) {
            let r2 = [t3, e5];
            if (n3 === false && (r2 = [t3]), m2(this.prerelease, t3)) {
              let e6 = this.prerelease[t3.split(`.`).length];
              isNaN(e6) && (this.prerelease = r2);
            } else this.prerelease = r2;
          }
          break;
        }
        default:
          throw Error(`invalid increment argument: ${e4}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(`.`)}`), this;
    }
  };
})), l = t(((e2, t2) => {
  var n2 = c();
  t2.exports = (e3, t3, r2) => new n2(e3, r2).compare(new n2(t3, r2));
})), u = t(((e2, t2) => {
  var n2 = l();
  t2.exports = (e3, t3, r2) => n2(e3, t3, r2) === 0;
})), d = t(((e2, t2) => {
  var n2 = l();
  t2.exports = (e3, t3, r2) => n2(e3, t3, r2) !== 0;
})), f = t(((e2, t2) => {
  var n2 = l();
  t2.exports = (e3, t3, r2) => n2(e3, t3, r2) > 0;
})), p = t(((e2, t2) => {
  var n2 = l();
  t2.exports = (e3, t3, r2) => n2(e3, t3, r2) >= 0;
})), m = t(((e2, t2) => {
  var n2 = l();
  t2.exports = (e3, t3, r2) => n2(e3, t3, r2) < 0;
})), h = t(((e2, t2) => {
  var n2 = l();
  t2.exports = (e3, t3, r2) => n2(e3, t3, r2) <= 0;
})), g = t(((e2, t2) => {
  var n2 = u(), r2 = d(), i2 = f(), a2 = p(), o2 = m(), s2 = h();
  t2.exports = (e3, t3, c2, l2) => {
    switch (t3) {
      case `===`:
        return typeof e3 == `object` && (e3 = e3.version), typeof c2 == `object` && (c2 = c2.version), e3 === c2;
      case `!==`:
        return typeof e3 == `object` && (e3 = e3.version), typeof c2 == `object` && (c2 = c2.version), e3 !== c2;
      case ``:
      case `=`:
      case `==`:
        return n2(e3, c2, l2);
      case `!=`:
        return r2(e3, c2, l2);
      case `>`:
        return i2(e3, c2, l2);
      case `>=`:
        return a2(e3, c2, l2);
      case `<`:
        return o2(e3, c2, l2);
      case `<=`:
        return s2(e3, c2, l2);
      default:
        throw TypeError(`Invalid operator: ${t3}`);
    }
  };
})), _ = t(((e2, t2) => {
  var n2 = Symbol(`SemVer ANY`);
  t2.exports = class e3 {
    static get ANY() {
      return n2;
    }
    constructor(t3, r2) {
      if (r2 = i2(r2), t3 instanceof e3) {
        if (t3.loose === !!r2.loose) return t3;
        t3 = t3.value;
      }
      t3 = t3.trim().split(/\s+/).join(` `), d2(`comparator`, t3, r2), this.options = r2, this.loose = !!r2.loose, this.parse(t3), this.semver === n2 ? this.value = `` : this.value = this.operator + this.semver.version, d2(`comp`, this);
    }
    parse(e4) {
      let t3 = this.options.loose ? s2[l2.COMPARATORLOOSE] : s2[l2.COMPARATOR], r2 = e4.match(t3);
      if (!r2) throw TypeError(`Invalid comparator: ${e4}`);
      this.operator = r2[1] === void 0 ? `` : r2[1], this.operator === `=` && (this.operator = ``), r2[2] ? this.semver = new f2(r2[2], this.options.loose) : this.semver = n2;
    }
    toString() {
      return this.value;
    }
    test(e4) {
      if (d2(`Comparator.test`, e4, this.options.loose), this.semver === n2 || e4 === n2) return true;
      if (typeof e4 == `string`) try {
        e4 = new f2(e4, this.options);
      } catch {
        return false;
      }
      return u2(e4, this.operator, this.semver, this.options);
    }
    intersects(t3, n3) {
      if (!(t3 instanceof e3)) throw TypeError(`a Comparator is required`);
      return this.operator === `` ? this.value === `` ? true : new p2(t3.value, n3).test(this.value) : t3.operator === `` ? t3.value === `` ? true : new p2(this.value, n3).test(t3.semver) : (n3 = i2(n3), n3.includePrerelease && (this.value === `<0.0.0-0` || t3.value === `<0.0.0-0`) || !n3.includePrerelease && (this.value.startsWith(`<0.0.0`) || t3.value.startsWith(`<0.0.0`)) ? false : !!(this.operator.startsWith(`>`) && t3.operator.startsWith(`>`) || this.operator.startsWith(`<`) && t3.operator.startsWith(`<`) || this.semver.version === t3.semver.version && this.operator.includes(`=`) && t3.operator.includes(`=`) || u2(this.semver, `<`, t3.semver, n3) && this.operator.startsWith(`>`) && t3.operator.startsWith(`<`) || u2(this.semver, `>`, t3.semver, n3) && this.operator.startsWith(`<`) && t3.operator.startsWith(`>`)));
    }
  };
  var i2 = r(), { safeRe: s2, t: l2 } = o(), u2 = g(), d2 = a(), f2 = c(), p2 = v();
})), v = t(((e2, t2) => {
  var s2 = /\s+/g;
  t2.exports = class e3 {
    constructor(t3, n2) {
      if (n2 = u2(n2), t3 instanceof e3) return t3.loose === !!n2.loose && t3.includePrerelease === !!n2.includePrerelease ? t3 : new e3(t3.raw, n2);
      if (t3 instanceof d2) return this.raw = t3.value, this.set = [[t3]], this.formatted = void 0, this;
      if (this.options = n2, this.loose = !!n2.loose, this.includePrerelease = !!n2.includePrerelease, this.raw = t3.trim().replace(s2, ` `), this.set = this.raw.split(`||`).map((e4) => this.parseRange(e4.trim())).filter((e4) => e4.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        let e4 = this.set[0];
        if (this.set = this.set.filter((e5) => !w2(e5[0])), this.set.length === 0) this.set = [e4];
        else if (this.set.length > 1) {
          for (let e5 of this.set) if (e5.length === 1 && T2(e5[0])) {
            this.set = [e5];
            break;
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = ``;
        for (let e4 = 0; e4 < this.set.length; e4++) {
          e4 > 0 && (this.formatted += `||`);
          let t3 = this.set[e4];
          for (let e5 = 0; e5 < t3.length; e5++) e5 > 0 && (this.formatted += ` `), this.formatted += t3[e5].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(e4) {
      e4 = e4.replace(C2, ``);
      let t3 = ((this.options.includePrerelease && x2) | (this.options.loose && S2)) + `:` + e4, n2 = l2.get(t3);
      if (n2) return n2;
      let r2 = this.options.loose, i2 = r2 ? m2[g2.HYPHENRANGELOOSE] : m2[g2.HYPHENRANGE];
      e4 = e4.replace(i2, R(this.options.includePrerelease)), f2(`hyphen replace`, e4), e4 = e4.replace(m2[g2.COMPARATORTRIM], v2), f2(`comparator trim`, e4), e4 = e4.replace(m2[g2.TILDETRIM], y2), f2(`tilde trim`, e4), e4 = e4.replace(m2[g2.CARETTRIM], b2), f2(`caret trim`, e4);
      let a2 = e4.split(` `).map((e5) => D2(e5, this.options)).join(` `).split(/\s+/).map((e5) => L(e5, this.options));
      r2 && (a2 = a2.filter((e5) => (f2(`loose invalid filter`, e5, this.options), !!e5.match(m2[g2.COMPARATORLOOSE])))), f2(`range list`, a2);
      let o2 = /* @__PURE__ */ new Map(), s3 = a2.map((e5) => new d2(e5, this.options));
      for (let e5 of s3) {
        if (w2(e5)) return [e5];
        o2.set(e5.value, e5);
      }
      o2.size > 1 && o2.has(``) && o2.delete(``);
      let c2 = [...o2.values()];
      return l2.set(t3, c2), c2;
    }
    intersects(t3, n2) {
      if (!(t3 instanceof e3)) throw TypeError(`a Range is required`);
      return this.set.some((e4) => E2(e4, n2) && t3.set.some((t4) => E2(t4, n2) && e4.every((e5) => t4.every((t5) => e5.intersects(t5, n2)))));
    }
    test(e4) {
      if (!e4) return false;
      if (typeof e4 == `string`) try {
        e4 = new p2(e4, this.options);
      } catch {
        return false;
      }
      for (let t3 = 0; t3 < this.set.length; t3++) if (z(this.set[t3], e4, this.options)) return true;
      return false;
    }
  };
  var l2 = new (n())(), u2 = r(), d2 = _(), f2 = a(), p2 = c(), { safeRe: m2, src: h2, t: g2, comparatorTrimReplace: v2, tildeTrimReplace: y2, caretTrimReplace: b2 } = o(), { FLAG_INCLUDE_PRERELEASE: x2, FLAG_LOOSE: S2 } = i(), C2 = new RegExp(h2[g2.BUILD], `g`), w2 = (e3) => e3.value === `<0.0.0-0`, T2 = (e3) => e3.value === ``, E2 = (e3, t3) => {
    let n2 = true, r2 = e3.slice(), i2 = r2.pop();
    for (; n2 && r2.length; ) n2 = r2.every((e4) => i2.intersects(e4, t3)), i2 = r2.pop();
    return n2;
  }, D2 = (e3, t3) => (e3 = e3.replace(m2[g2.BUILD], ``), f2(`comp`, e3, t3), e3 = M(e3, t3), f2(`caret`, e3), e3 = A(e3, t3), f2(`tildes`, e3), e3 = P(e3, t3), f2(`xrange`, e3), e3 = I(e3, t3), f2(`stars`, e3), e3), O2 = (e3) => !e3 || e3.toLowerCase() === `x` || e3 === `*`, k2 = (e3, t3, n2) => O2(e3) && !O2(t3) || O2(t3) && n2 && !O2(n2), A = (e3, t3) => e3.trim().split(/\s+/).map((e4) => j(e4, t3)).join(` `), j = (e3, t3) => {
    let n2 = t3.loose ? m2[g2.TILDELOOSE] : m2[g2.TILDE], r2 = t3.includePrerelease ? `-0` : ``;
    return e3.replace(n2, (t4, n3, i2, a2, o2) => {
      f2(`tilde`, e3, t4, n3, i2, a2, o2);
      let s3;
      return O2(n3) ? s3 = `` : O2(i2) ? s3 = `>=${n3}.0.0${r2} <${+n3 + 1}.0.0-0` : O2(a2) ? s3 = `>=${n3}.${i2}.0${r2} <${n3}.${+i2 + 1}.0-0` : o2 ? (f2(`replaceTilde pr`, o2), s3 = `>=${n3}.${i2}.${a2}-${o2} <${n3}.${+i2 + 1}.0-0`) : s3 = `>=${n3}.${i2}.${a2} <${n3}.${+i2 + 1}.0-0`, f2(`tilde return`, s3), s3;
    });
  }, M = (e3, t3) => e3.trim().split(/\s+/).map((e4) => N(e4, t3)).join(` `), N = (e3, t3) => {
    f2(`caret`, e3, t3);
    let n2 = t3.loose ? m2[g2.CARETLOOSE] : m2[g2.CARET], r2 = t3.includePrerelease ? `-0` : ``;
    return e3.replace(n2, (t4, n3, i2, a2, o2) => {
      f2(`caret`, e3, t4, n3, i2, a2, o2);
      let s3;
      return O2(n3) ? s3 = `` : O2(i2) ? s3 = `>=${n3}.0.0${r2} <${+n3 + 1}.0.0-0` : O2(a2) ? s3 = n3 === `0` ? `>=${n3}.${i2}.0${r2} <${n3}.${+i2 + 1}.0-0` : `>=${n3}.${i2}.0${r2} <${+n3 + 1}.0.0-0` : o2 ? (f2(`replaceCaret pr`, o2), s3 = n3 === `0` ? i2 === `0` ? `>=${n3}.${i2}.${a2}-${o2} <${n3}.${i2}.${+a2 + 1}-0` : `>=${n3}.${i2}.${a2}-${o2} <${n3}.${+i2 + 1}.0-0` : `>=${n3}.${i2}.${a2}-${o2} <${+n3 + 1}.0.0-0`) : (f2(`no pr`), s3 = n3 === `0` ? i2 === `0` ? `>=${n3}.${i2}.${a2} <${n3}.${i2}.${+a2 + 1}-0` : `>=${n3}.${i2}.${a2} <${n3}.${+i2 + 1}.0-0` : `>=${n3}.${i2}.${a2} <${+n3 + 1}.0.0-0`), f2(`caret return`, s3), s3;
    });
  }, P = (e3, t3) => (f2(`replaceXRanges`, e3, t3), e3.split(/\s+/).map((e4) => F(e4, t3)).join(` `)), F = (e3, t3) => {
    e3 = e3.trim();
    let n2 = t3.loose ? m2[g2.XRANGELOOSE] : m2[g2.XRANGE];
    return e3.replace(n2, (n3, r2, i2, a2, o2, s3) => {
      if (f2(`xRange`, e3, n3, r2, i2, a2, o2, s3), k2(i2, a2, o2)) return e3;
      let c2 = O2(i2), l3 = c2 || O2(a2), u3 = l3 || O2(o2), d3 = u3;
      return r2 === `=` && d3 && (r2 = ``), s3 = t3.includePrerelease ? `-0` : ``, c2 ? n3 = r2 === `>` || r2 === `<` ? `<0.0.0-0` : `*` : r2 && d3 ? (l3 && (a2 = 0), o2 = 0, r2 === `>` ? (r2 = `>=`, l3 ? (i2 = +i2 + 1, a2 = 0, o2 = 0) : (a2 = +a2 + 1, o2 = 0)) : r2 === `<=` && (r2 = `<`, l3 ? i2 = +i2 + 1 : a2 = +a2 + 1), r2 === `<` && (s3 = `-0`), n3 = `${r2 + i2}.${a2}.${o2}${s3}`) : l3 ? n3 = `>=${i2}.0.0${s3} <${+i2 + 1}.0.0-0` : u3 && (n3 = `>=${i2}.${a2}.0${s3} <${i2}.${+a2 + 1}.0-0`), f2(`xRange return`, n3), n3;
    });
  }, I = (e3, t3) => (f2(`replaceStars`, e3, t3), e3.trim().replace(m2[g2.STAR], ``)), L = (e3, t3) => (f2(`replaceGTE0`, e3, t3), e3.trim().replace(m2[t3.includePrerelease ? g2.GTE0PRE : g2.GTE0], ``)), R = (e3) => (t3, n2, r2, i2, a2, o2, s3, c2, l3, u3, d3, f3) => (n2 = O2(r2) ? `` : O2(i2) ? `>=${r2}.0.0${e3 ? `-0` : ``}` : O2(a2) ? `>=${r2}.${i2}.0${e3 ? `-0` : ``}` : o2 ? `>=${n2}` : `>=${n2}${e3 ? `-0` : ``}`, c2 = O2(l3) ? `` : O2(u3) ? `<${+l3 + 1}.0.0-0` : O2(d3) ? `<${l3}.${+u3 + 1}.0-0` : f3 ? `<=${l3}.${u3}.${d3}-${f3}` : e3 ? `<${l3}.${u3}.${+d3 + 1}-0` : `<=${c2}`, `${n2} ${c2}`.trim()), z = (e3, t3, n2) => {
    for (let n3 = 0; n3 < e3.length; n3++) if (!e3[n3].test(t3)) return false;
    if (t3.prerelease.length && !n2.includePrerelease) {
      for (let n3 = 0; n3 < e3.length; n3++) if (f2(e3[n3].semver), e3[n3].semver !== d2.ANY && e3[n3].semver.prerelease.length > 0) {
        let r2 = e3[n3].semver;
        if (r2.major === t3.major && r2.minor === t3.minor && r2.patch === t3.patch) return true;
      }
      return false;
    }
    return true;
  };
})), y = t(((e2, t2) => {
  var n2 = c();
  t2.exports = (e3, t3, r2 = false) => {
    if (e3 instanceof n2) return e3;
    try {
      return new n2(e3, t3);
    } catch (e4) {
      if (!r2) return null;
      throw e4;
    }
  };
})), b = t(((e2, t2) => {
  var n2 = y();
  t2.exports = (e3, t3) => {
    let r2 = n2(e3, t3);
    return r2 ? r2.version : null;
  };
})), x = e(v(), 1), S = e(b(), 1);
function C(e2) {
  let t2 = String(e2 || ``).trim().replace(/^v/i, ``).split(`+`, 1)[0], n2 = t2.indexOf(`-`), r2 = n2 === -1 ? t2 : t2.slice(0, n2), i2 = n2 === -1 ? `` : t2.slice(n2 + 1), a2 = r2.split(`.`).map((e3) => {
    let t3 = e3.match(/^\d+/);
    return t3 ? Number(t3[0]) : 0;
  });
  return { parts: [a2[0] || 0, a2[1] || 0, a2[2] || 0], prerelease: i2 };
}
function w(e2, t2) {
  let n2 = C(e2), r2 = C(t2);
  for (let e3 = 0; e3 < 3; e3++) if (n2.parts[e3] !== r2.parts[e3]) return n2.parts[e3] < r2.parts[e3] ? -1 : 1;
  if (n2.prerelease === r2.prerelease) return 0;
  if (!n2.prerelease) return 1;
  if (!r2.prerelease) return -1;
  let i2 = n2.prerelease.split(`.`), a2 = r2.prerelease.split(`.`);
  for (let e3 = 0; e3 < Math.max(i2.length, a2.length); e3++) {
    if (e3 === i2.length) return -1;
    if (e3 === a2.length) return 1;
    let t3 = i2[e3], n3 = a2[e3];
    if (t3 === n3) continue;
    let r3 = /^\d+$/.test(t3), o2 = /^\d+$/.test(n3);
    return r3 && o2 ? BigInt(t3) < BigInt(n3) ? -1 : 1 : r3 === o2 ? t3 < n3 ? -1 : 1 : r3 ? -1 : 1;
  }
  return 0;
}
function T(e2, t2 = {}) {
  let n2 = String(t2.min || ``).trim(), r2 = String(t2.max || ``).trim();
  return n2 && w(e2, n2) < 0 ? { ok: false, reason: `Requires GP-Next ${n2} or newer` } : r2 && w(e2, r2) > 0 ? { ok: false, reason: `Requires GP-Next ${r2} or older` } : { ok: true, reason: `` };
}
function E(e2 = {}) {
  let t2 = (e3) => typeof e3 == `string` ? e3.trim() : JSON.stringify(e3);
  return Object.hasOwn(e2, `gpNextVersion`) ? t2(e2.gpNextVersion) ?? `undefined` : [[`>=`, e2.minGpNextVersion], [`<=`, e2.maxGpNextVersion]].filter(([, e3]) => e3 !== void 0 && e3 !== ``).map(([e3, n2]) => e3 + t2(n2)).join(` `);
}
function D(e2) {
  if (/^\d+\.\d+\.\*$/.test(e2) || /^\d+\.\*$/.test(e2)) return e2;
  let t2 = /^\d+(?:\.\d+)?$/.test(e2) ? e2 + `.0`.repeat(3 - e2.split(`.`).length) : e2;
  if (!(0, S.default)(t2)) throw Error(`Invalid version`);
  return t2;
}
function O(e2) {
  if (typeof e2 != `string` || !e2.trim()) throw Error(`Expected a non-empty version range`);
  return e2.split(`||`).map((e3) => {
    if (e3.split(`,`).some((e4) => !e4.trim())) throw Error(`Empty version clause`);
    let t2 = [];
    return { range: new x.default(e3.replaceAll(`,`, ` `).replace(/(^|\s)(==|!=|~=)\s*([^\s]+)/g, (e4, n2, r2, i2) => {
      if (r2 === `~=`) {
        let e5 = i2.match(/^(\d+)\.(\d+)(?:\.(\d+)(?:-[\da-zA-Z.-]+)?)?$/);
        if (!e5) throw Error(`Invalid compatible-release version`);
        return `${n2}>=${D(i2)} <${e5[3] === void 0 ? `${Number(e5[1]) + 1}.0.0-0` : `${e5[1]}.${Number(e5[2]) + 1}.0-0`}`;
      }
      let a2 = D(i2);
      return r2 === `==` ? n2 + a2 : (t2.push(new x.default(a2, { includePrerelease: true })), n2);
    })), excluded: t2 };
  });
}
function k(e2, t2 = {}) {
  let n2 = E(t2);
  try {
    if (Object.hasOwn(t2, `gpNextVersion`)) return { ok: O(t2.gpNextVersion).some(({ range: t3, excluded: n3 }) => t3.test(e2) && !n3.some((t4) => t4.test(e2))), requirement: n2, invalid: false };
    for (let e3 of [t2.minGpNextVersion, t2.maxGpNextVersion]) if (!(e3 === void 0 || e3 === ``) && (typeof e3 != `string` || (D(e3.trim().replace(/^v/i, ``)), e3.includes(`*`)))) throw Error(`Invalid version bound`);
    return { ok: T(e2, { min: t2.minGpNextVersion, max: t2.maxGpNextVersion }).ok, requirement: n2, invalid: false };
  } catch {
    return { ok: false, requirement: n2, invalid: true };
  }
}
export {
  w as n,
  E as r,
  k as t
};
