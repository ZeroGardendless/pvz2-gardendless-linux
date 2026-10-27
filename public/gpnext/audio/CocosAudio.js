async function installCocosAudio(cc, host = window) {
  const audio = host.__gdAudio;
  if (!audio || !cc.assetManager?.downloader) return false;
  audio.bindGame(cc.game, cc.Game.EVENT_PAUSE, cc.Game.EVENT_RESUME);
  const downloader = cc.assetManager.downloader;
  const original = downloader._downloaders?.[".wav"];
  if (typeof original !== "function") throw new Error("Cocos audio downloader is unavailable");
  const bytes = new Uint8Array(46);
  const data = new DataView(bytes.buffer);
  const text = (at, value) => [...value].forEach((c, i) => {
    bytes[at + i] = c.charCodeAt(0);
  });
  text(0, "RIFF");
  data.setUint32(4, 38, true);
  text(8, "WAVEfmt ");
  data.setUint32(16, 16, true);
  data.setUint16(20, 1, true);
  data.setUint16(22, 1, true);
  data.setUint32(24, 8e3, true);
  data.setUint32(28, 16e3, true);
  data.setUint16(32, 2, true);
  data.setUint16(34, 16, true);
  text(36, "data");
  data.setUint32(40, 2, true);
  const url = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
  try {
    const metadata = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Cocos audio metadata probe timed out")), 8e3);
      original(url, { audioLoadMode: cc.AudioClip.AudioType.DOM_AUDIO }, (error, result) => {
        clearTimeout(timer);
        if (error) reject(error);
        else resolve(result);
      });
    });
    const Player = metadata.player.constructor;
    metadata.player.destroy();
    if (typeof Player.load !== "function" || typeof Player.loadOneShotAudio !== "function") throw new Error("Cocos audio factory changed");
    Player.load = async (source, options) => new Player(await audio.load(source, options));
    Player.loadNative = (source, options) => audio.loadNative(source, options);
    Player.loadOneShotAudio = (source, volume, options) => audio.loadOneShotAudio(source, volume, options);
    return true;
  } finally {
    URL.revokeObjectURL(url);
  }
}
export {
  installCocosAudio
};
