var e = { version: `0.1.0`, apiBase: `https://cloud-save.pvzge.com`, apiBackend: `https://api-cloud-save.pvzge.com`, _k: [`eUNFVTNtNGRZTjV6SEw4WDlkQTFk`, `ODFDVjV4YWR3TTA=`], _s: [121, 67, 69, 85], _storageKeys: { settings: `PvZ2_Settings`, playerProps: `PvZ2_PlayerProperties`, token: `cloud_save_token`, email: `cloud_save_email`, state: `cloud_save_state` }, authToken: null, userEmail: null, _currentLoginState: null, _loginWindow: null, _windowClosedAt: null, async init() {
  return console.log(`[Cloud Saver] PvZ2 Cloud Save Patcher v` + this.version), this.authToken = localStorage.getItem(this._storageKeys.token), this.userEmail = localStorage.getItem(this._storageKeys.email), this.authToken ? (console.log(`[Cloud Saver] Logged in: ` + this.userEmail), await this._verifyToken() ? console.log(`[Cloud Saver] Token valid`) : (console.warn(`[Cloud Saver] Token expired or invalid, please login again`), this.logout())) : console.log(`[Cloud Saver] Not logged in, use cloudSaver.login() to login`), console.log(`[Cloud Saver] Run cloudSaver.help() for help | Run cloudSaver.helpCN() for Chinese help`), true;
}, help() {
  console.log(`[Cloud Saver v${this.version} - Commands]
Authentication:
  login()    - Login to cloud service
  logout()   - Logout and clear credentials
  status()   - View login and save status
Save Operations:
  upload()   - Upload current save to cloud
  download() - Download cloud save (with comparison)
  compare()  - Compare saves and show manual instructions
Advanced:
  uploadWithBackup()   - Upload with cloud backup
  downloadWithBackup() - Download with local backup
  showLocal()  - Show local save info
  showCloud()  - Show cloud save info
Server: ${this.apiBase} | Help(Simplified Chinese): cloudSaver.helpCN()`);
}, helpCN() {
  console.log(`[\u4E91\u5B58\u6863 v${this.version} - \u547D\u4EE4\u5217\u8868]
\u767B\u5F55\u4E0E\u8D26\u6237:
  login()    - \u767B\u5F55\u5230\u4E91\u5B58\u6863\u670D\u52A1
  logout()   - \u767B\u51FA\u5E76\u6E05\u9664\u51ED\u8BC1
  status()   - \u67E5\u770B\u767B\u5F55\u548C\u5B58\u6863\u72B6\u6001
\u5B58\u6863\u64CD\u4F5C:
  upload()   - \u4E0A\u4F20\u5F53\u524D\u5B58\u6863\u5230\u4E91\u7AEF
  download() - \u4E0B\u8F7D\u4E91\u7AEF\u5B58\u6863\uFF08\u542B\u5BF9\u6BD4\uFF09
  compare()  - \u5BF9\u6BD4\u5B58\u6863\u5E76\u663E\u793A\u624B\u52A8\u64CD\u4F5C\u6307\u4EE4
\u9AD8\u7EA7\u64CD\u4F5C:
  uploadWithBackup()   - \u4E0A\u4F20\u524D\u5907\u4EFD
  downloadWithBackup() - \u4E0B\u8F7D\u524D\u5907\u4EFD
  showLocal()  - \u663E\u793A\u672C\u5730\u5B58\u6863\u4FE1\u606F
  showCloud()  - \u663E\u793A\u4E91\u7AEF\u5B58\u6863\u4FE1\u606F
\u670D\u52A1\u5668: ${this.apiBase} | \u82F1\u6587\u5E2E\u52A9: cloudSaver.help()`);
}, async login() {
  try {
    this._currentLoginState && (console.log(`[Cloud Saver] Canceling previous login attempt...`), this._currentLoginState = null, this._loginWindow && !this._loginWindow.closed && this._loginWindow.close()), console.log(`[Cloud Saver] Starting login process...`);
    let e2 = this._generateUUID();
    this._currentLoginState = e2, localStorage.setItem(this._storageKeys.state, e2);
    let t = Math.floor(Date.now() / 1e3).toString(), n = `state=${e2}&timestamp=${t}`, r = this._getKey();
    if (!r) throw Error(`Failed to derive encryption key`);
    let i = await this._computeHmacSha256(n, r);
    console.log(`[Cloud Saver] Generated OAuth params:`), console.log(`  State: ` + e2), console.log(`  Timestamp: ` + t), console.log(`  Signature: ` + i.substring(0, 16) + `...`);
    let a = (screen.width - 600) / 2, o = (screen.height - 700) / 2;
    this._loginWindow = window.open(`${this.apiBase}/oauth/login?state=${e2}&timestamp=${t}&signature=${i}`, `Cloud Save Login`, `width=600,height=700,left=${a},top=${o}`), console.log(`[Cloud Saver] Login window opened, please complete login in browser`), console.log(`[Cloud Saver] Waiting for login completion...`);
    let s = await this._pollLoginStatus(e2);
    return this.authToken = s.token, this.userEmail = s.email, localStorage.setItem(this._storageKeys.token, s.token), localStorage.setItem(this._storageKeys.email, s.email), localStorage.removeItem(this._storageKeys.state), this._currentLoginState = null, this._loginWindow = null, this._windowClosedAt = null, console.log(`[Cloud Saver] Login successful!`), console.log(`[Cloud Saver] Email: ` + s.email), console.log(`[Cloud Saver] Subscription: ` + (s.isSubscriber ? `Subscribed` : `Not subscribed`)), s;
  } catch (e2) {
    throw console.error(`[Cloud Saver] Login failed:`, e2.message), this._currentLoginState = null, this._loginWindow = null, this._windowClosedAt = null, e2;
  }
}, logout() {
  this.authToken = null, this.userEmail = null, localStorage.removeItem(this._storageKeys.token), localStorage.removeItem(this._storageKeys.email), localStorage.removeItem(this._storageKeys.state), console.log(`[Cloud Saver] Logged out`);
}, async status() {
  if (console.log(`[Cloud Save Status]`), this.authToken) console.log(`Login: ` + this.userEmail + ` (` + (await this._verifyToken() ? `Valid` : `Expired`) + `)`);
  else {
    console.log(`Login: Not logged in - Use cloudSaver.login()`);
    return;
  }
  console.log(`Local Save:`);
  let e2 = this._getLocalData();
  e2 ? this._printSummary(this._getSaveSummary(e2), `  `) : console.log(`  Not found`), console.log(`Cloud Save:`);
  try {
    await this.showCloud() || console.log(`  Not found`);
  } catch (e3) {
    console.log(`  Failed: ` + e3.message);
  }
}, async upload() {
  if (this._checkLogin()) try {
    console.log(`[Cloud Saver] Reading local save...`);
    let e2 = this._getLocalData();
    if (!e2) {
      console.error(`[Cloud Saver] [X] Local save data not found`);
      return;
    }
    let t = this._getSaveSummary(e2);
    console.log(`[Cloud Saver] Local save summary:`), this._printSummary(t, `  `), console.log(`[Cloud Saver] Encrypting data...`);
    let n = await this._encrypt(e2);
    console.log(`[Cloud Saver] Uploading to cloud...`);
    let r = await fetch(`${this.apiBackend}/api/save`, { method: `POST`, headers: { "Content-Type": `application/json`, Authorization: `Bearer ${this.authToken}` }, body: JSON.stringify({ encrypted_data: n }) }), i = await r.json();
    if (!r.ok) throw Error(i.error || `Upload failed`);
    return console.log(`[Cloud Saver] [OK] Upload successful!`), console.log(`[Cloud Saver] Upload time: ` + new Date(i.timestamp * 1e3).toLocaleString()), i;
  } catch (e2) {
    throw console.error(`[Cloud Saver] [X] Upload failed:`, e2.message), e2;
  }
}, async download(e2 = false) {
  if (this._checkLogin()) try {
    console.log(`[Cloud Saver] Downloading save from cloud...`);
    let t = await fetch(`${this.apiBackend}/api/load`, { headers: { Authorization: `Bearer ${this.authToken}` } }), n = await t.json();
    if (!t.ok) {
      if (t.status === 404) return console.log(`[Cloud Saver] [-] No cloud save found`), null;
      throw Error(n.error || `Download failed`);
    }
    console.log(`[Cloud Saver] Decrypting data...`);
    let r = await this._decrypt(n.encrypted_data), i = this._getSaveSummary(r);
    if (console.log(`[Cloud Saver] Cloud save summary:`), this._printSummary(i, `  `), !e2) {
      let e3 = this._getLocalData();
      if (e3) {
        console.log(`[Cloud Saver] Local save exists, comparing...`);
        let t2 = this._compareData(e3, r);
        if (this._printComparison(t2), t2.recommendation !== `download`) return console.log(`[Cloud Saver] [!] Cloud save may not have more progress than local`), console.log(`[Cloud Saver] Force download: cloudSaver.download(true) | Compare: cloudSaver.compare()`), { cloudData: r, comparison: t2, downloaded: false };
        console.log(`[Cloud Saver] Cloud save is recommended, proceeding to download...`);
      }
    }
    console.log(`[Cloud Saver] Saving to local storage...`), this._saveLocalData(r), console.log(`[Cloud Saver] [OK] Download successful! Save updated`), console.log(`[Cloud Saver] [!] Auto-refreshing page to load new save...`);
    for (let e3 = 3; e3 > 0; e3--) console.log(`[Cloud Saver] Refreshing in ${e3}...`), await new Promise((e4) => setTimeout(e4, 1e3));
    return console.log(`[Cloud Saver] Refreshing now...`), location.reload(), r;
  } catch (e3) {
    throw console.error(`[Cloud Saver] [X] Download failed:`, e3.message), e3;
  }
}, async compare() {
  if (this._checkLogin()) try {
    console.log(`[Cloud Saver] Comparing local and cloud saves...`);
    let e2 = this._getLocalData();
    if (!e2) {
      console.error(`[Cloud Saver] [X] Local save not found`);
      return;
    }
    let t = await fetch(`${this.apiBackend}/api/load`, { headers: { Authorization: `Bearer ${this.authToken}` } });
    if (t.status === 404) return console.log(`[Cloud Saver] [-] No cloud save found`), console.log(`[Cloud Saver] To upload: cloudSaver.upload()`), { cloudExists: false };
    let n = await t.json();
    if (!t.ok) throw Error(n.error || `Failed to fetch cloud save`);
    let r = await this._decrypt(n.encrypted_data), i = this._compareData(e2, r);
    return console.log(`[Save Comparison]`), this._printComparison(i), console.log(`
[Manual Actions]`), console.log(`  Upload local:   cloudSaver.upload()`), console.log(`  Download cloud: cloudSaver.download(true)`), console.log(`  View local:     cloudSaver.showLocal()`), console.log(`  View cloud:     cloudSaver.showCloud()`), console.log(`
[!] Review comparison above and choose action manually`), i;
  } catch (e2) {
    throw console.error(`[Cloud Saver] [X] Comparison failed:`, e2.message), e2;
  }
}, showLocal() {
  let e2 = this._getLocalData();
  if (!e2) return console.log(`[Cloud Saver] Local save not found`), null;
  console.log(`[Local Save]`);
  let t = this._getSaveSummary(e2);
  return this._printSummary(t, ``), t;
}, async showCloud() {
  if (!this._checkLogin()) return null;
  try {
    let e2 = await fetch(`${this.apiBackend}/api/meta`, { headers: { Authorization: `Bearer ${this.authToken}` } });
    if (e2.status === 404) return null;
    let t = await e2.json();
    if (!e2.ok) throw Error(t.error);
    return console.log(`  ` + new Date(t.timestamp * 1e3).toLocaleString() + ` | v` + (t.version || `?`)), t;
  } catch (e2) {
    return console.error(`[Cloud Saver] [X] Failed to fetch cloud info:`, e2.message), null;
  }
}, async uploadWithBackup() {
  console.log(`[Cloud Saver] [*] Backing up cloud save...`);
  try {
    let e2 = await fetch(`${this.apiBackend}/api/load`, { headers: { Authorization: `Bearer ${this.authToken}` } });
    if (e2.ok) {
      let t = await e2.json(), n = `cloud_save_backup_` + Date.now();
      localStorage.setItem(n, JSON.stringify(t.encrypted_data)), console.log(`[Cloud Saver] [OK] Backup saved to: ` + n);
    }
  } catch (e2) {
    console.warn(`[Cloud Saver] [!] Backup failed, continuing upload:`, e2.message);
  }
  return await this.upload();
}, async downloadWithBackup() {
  console.log(`[Cloud Saver] [*] Backing up local save...`);
  let e2 = this._getLocalData();
  if (e2) {
    let t = `local_save_backup_` + Date.now();
    localStorage.setItem(t, JSON.stringify(e2)), console.log(`[Cloud Saver] [OK] Backup saved to: ` + t);
  }
  return await this.download(true);
}, _getKey() {
  try {
    let e2 = atob(this._k[0]), t = atob(this._k[1]), n = String.fromCharCode(...this._s);
    if (e2.substring(0, 4) !== n) throw Error(`Key integrity check failed`);
    return e2 + t;
  } catch {
    return console.error(`[Cloud Saver] Key derivation failed`), null;
  }
}, _checkLogin() {
  return this.authToken ? true : (console.error(`[Cloud Saver] [X] Not logged in, please run: cloudSaver.login()`), false);
}, async _verifyToken() {
  if (!this.authToken) return false;
  try {
    let e2 = await fetch(`${this.apiBackend}/api/meta`, { headers: { Authorization: `Bearer ${this.authToken}` } });
    return e2.ok || e2.status === 404;
  } catch {
    return false;
  }
}, async _pollLoginStatus(e2, t = 60) {
  for (let n = 0; n < t; n++) {
    if (await new Promise((e3) => setTimeout(e3, 2e3)), this._currentLoginState !== e2) throw console.log(`[Cloud Saver] Login polling canceled (new login started)`), Error(`Login canceled`);
    try {
      let t3 = await (await fetch(`${this.apiBackend}/api/auth/check-login?state=${e2}&_=${Date.now()}`, { cache: `no-store` })).json();
      if (t3.status === `completed` && t3.token) return console.log(`[Cloud Saver] Login completed! You can close the login window now.`), { email: t3.email, token: t3.token, isSubscriber: t3.isSubscriber };
      if (t3.status === `expired`) throw Error(`Login session expired`);
    } catch (e3) {
      if (e3.message === `Login session expired`) throw e3;
    }
    let t2 = false;
    try {
      t2 = this._loginWindow && this._loginWindow.closed;
    } catch {
      t2 = false;
    }
    if (t2) {
      if (this._windowClosedAt || (this._windowClosedAt = Date.now(), console.warn(`[Cloud Saver] [!] Login window closed`)), Date.now() - this._windowClosedAt > 1e4) throw console.warn(`[Cloud Saver] [!] Login stopped (window closed for too long)`), this._currentLoginState = null, this._loginWindow = null, this._windowClosedAt = null, Error(`Login window closed`);
    } else this._windowClosedAt && (this._windowClosedAt = null, console.log(`[Cloud Saver] Login window reopened, continuing...`));
  }
  throw Error(`Login timeout (2 minutes)`);
}, _generateUUID() {
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(e2) {
    let t = Math.random() * 16 | 0;
    return (e2 === `x` ? t : t & 3 | 8).toString(16);
  });
}, async _computeHmacSha256(e2, t) {
  try {
    let n = new TextEncoder(), r = n.encode(t), i = n.encode(e2), a = await crypto.subtle.importKey(`raw`, r, { name: `HMAC`, hash: `SHA-256` }, false, [`sign`]), o = await crypto.subtle.sign(`HMAC`, a, i);
    return Array.from(new Uint8Array(o)).map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
  } catch (e3) {
    throw console.error(`[Cloud Saver] Failed to compute HMAC-SHA256:`, e3), Error(`Failed to generate signature`);
  }
}, _getLocalData() {
  let e2 = localStorage.getItem(this._storageKeys.settings), t = localStorage.getItem(this._storageKeys.playerProps);
  if (!e2 || !t) return null;
  try {
    return { settings: JSON.parse(e2), playerProperties: JSON.parse(t), syncTime: Date.now() };
  } catch (e3) {
    return console.error(`[Cloud Saver] Failed to parse local data:`, e3), null;
  }
}, _saveLocalData(e2) {
  localStorage.setItem(this._storageKeys.settings, JSON.stringify(e2.settings)), localStorage.setItem(this._storageKeys.playerProps, JSON.stringify(e2.playerProperties));
}, _getSaveSummary(e2) {
  let t = e2.playerProperties, n = e2.settings;
  if (!Array.isArray(t) || t.length === 0) return { valid: false, error: `Invalid save data` };
  let r = t.map((e3, t2) => {
    let n2 = 0;
    return e3.plantProps && typeof e3.plantProps == `object` && (n2 = Object.values(e3.plantProps).filter((e4) => e4 && e4.progress > 0).length), { index: t2, name: e3.name || `Unnamed`, version: e3.version || `Unknown`, saveTime: e3.time || Date.now(), saveTimeStr: new Date(e3.time || Date.now()).toLocaleString(), coin: e3.coin || 0, gem: e3.gem || 0, sprout: e3.sprout || 0, worldKey: e3.worldkey || 0, difficulty: e3.difficulty || 0, unlockedPlants: n2, totalZombies: Object.keys(e3.zombieProps || {}).length, totalWorlds: (e3.worldProgress || []).length };
  }), i = r[0];
  return { valid: true, playerCount: r.length, players: r, playerName: i.name, version: i.version, saveTime: i.saveTime, saveTimeStr: i.saveTimeStr, coin: i.coin, gem: i.gem, sprout: i.sprout, worldKey: i.worldKey, difficulty: i.difficulty, unlockedPlants: i.unlockedPlants, language: n?.Language || 0, musicVolume: n?.MusicVolume || 1, playerIndex: n?.PlayerIndex || 0, rawData: e2 };
}, _compareData(e2, t) {
  let n = this._getSaveSummary(e2), r = this._getSaveSummary(t);
  if (!n.valid || !r.valid) return { valid: false, error: `Invalid save data` };
  let i = n.saveTime - r.saveTime, a = Math.abs(i) / 1e3 / 60, o = { time: { local: n.saveTimeStr, cloud: r.saveTimeStr, diff: i, newer: i > 0 ? `local` : i < 0 ? `cloud` : `same` }, playerCount: { local: n.playerCount, cloud: r.playerCount, diff: n.playerCount - r.playerCount }, coin: { local: n.coin, cloud: r.coin, diff: n.coin - r.coin }, gem: { local: n.gem, cloud: r.gem, diff: n.gem - r.gem }, plants: { local: n.unlockedPlants, cloud: r.unlockedPlants, diff: n.unlockedPlants - r.unlockedPlants }, versions: { local: n.players.map((e3) => e3.version), cloud: r.players.map((e3) => e3.version), localVersions: n.players.map((e3, t2) => `P${t2 + 1}:${e3.version}`).join(` `), cloudVersions: r.players.map((e3, t2) => `P${t2 + 1}:${e3.version}`).join(` `), allSame: n.players.every((e3, t2) => r.players[t2]?.version === e3.version) } }, s = `none`, c = o.coin.diff * 0.01 + o.gem.diff * 1 + o.plants.diff * 50;
  return s = Math.abs(c) < 10 ? o.playerCount.diff > 0 ? `upload` : o.playerCount.diff < 0 ? `download` : `none` : c > 0 ? `upload` : `download`, { valid: true, local: n, cloud: r, differences: o, recommendation: s, timeDiffMinutes: a };
}, _printSummary(e2, t = ``) {
  if (!e2.valid) {
    console.log(t + (e2.error || `Invalid save`));
    return;
  }
  console.log(t + `Players: ` + e2.playerCount), e2.players.forEach((e3, n) => {
    console.log(t + `  [P${n + 1}] ${e3.name} | v${e3.version} | ${e3.saveTimeStr}`), console.log(t + `      Coins:${e3.coin.toLocaleString()} Gems:${e3.gem.toLocaleString()} Plants:${e3.unlockedPlants} World:${e3.worldKey} Diff:${e3.difficulty}`);
  });
}, _printComparison(e2) {
  if (!e2.valid) {
    console.log(`[X] ` + (e2.error || `Comparison failed`));
    return;
  }
  let { local: t, cloud: n, differences: r } = e2, i = r.time.newer === `local` ? `Local newer` : r.time.newer === `cloud` ? `Cloud newer` : `Same`;
  console.log(`Time: ` + i + ` (` + Math.abs(e2.timeDiffMinutes).toFixed(0) + `min diff) [Note: Time is for reference only]`), console.log(`  Local: ` + r.time.local), console.log(`  Cloud: ` + r.time.cloud), this._printDiff(`Players`, r.playerCount), this._printDiff(`Coins`, r.coin), this._printDiff(`Gems`, r.gem), this._printDiff(`Plants(Unlocked)`, r.plants), console.log(`Versions: L:[` + r.versions.localVersions + `] C:[` + r.versions.cloudVersions + `]` + (r.versions.allSame ? `` : ` [!Different]`));
}, _printDiff(e2, t) {
  let n = t.diff > 0 ? `+` : ``, r = t.diff > 0 ? `[+]` : t.diff < 0 ? `[-]` : `[=]`;
  console.log(`  ${e2}:  Local ${t.local.toLocaleString()}  |  Cloud ${t.cloud.toLocaleString()}  ${r} (${n}${t.diff})`);
}, async _encrypt(e2) {
  let t = { ...e2, owner_email: this.userEmail }, n = new TextEncoder(), r = n.encode(JSON.stringify(t)), i = crypto.getRandomValues(new Uint8Array(16)), a = atob(this._k[0]) + atob(this._k[1]), o = n.encode(a.padEnd(32, `0`).slice(0, 32)), s = await crypto.subtle.importKey(`raw`, o, { name: `AES-GCM` }, false, [`encrypt`]), c = await crypto.subtle.encrypt({ name: `AES-GCM`, iv: i }, s, r);
  return { encrypted: this._arrayBufferToHex(c.slice(0, c.byteLength - 16)), iv: this._arrayBufferToHex(i), authTag: this._arrayBufferToHex(c.slice(-16)) };
}, async _decrypt(e2) {
  let t = new TextEncoder(), n = new TextDecoder(), r = atob(this._k[0]) + atob(this._k[1]), i = t.encode(r.padEnd(32, `0`).slice(0, 32)), a = await crypto.subtle.importKey(`raw`, i, { name: `AES-GCM` }, false, [`decrypt`]), o = this._hexToArrayBuffer(e2.encrypted), s = this._hexToArrayBuffer(e2.authTag), c = new Uint8Array(o.byteLength + s.byteLength);
  c.set(new Uint8Array(o), 0), c.set(new Uint8Array(s), o.byteLength);
  let l = await crypto.subtle.decrypt({ name: `AES-GCM`, iv: this._hexToArrayBuffer(e2.iv) }, a, c);
  return JSON.parse(n.decode(l));
}, _arrayBufferToHex(e2) {
  return Array.from(new Uint8Array(e2)).map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
}, _hexToArrayBuffer(e2) {
  let t = new Uint8Array(e2.length / 2);
  for (let n = 0; n < e2.length; n += 2) t[n / 2] = parseInt(e2.substr(n, 2), 16);
  return t.buffer;
} };
export {
  e as default
};
