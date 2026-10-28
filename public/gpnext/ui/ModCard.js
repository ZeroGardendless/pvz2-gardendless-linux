function createModCardLoader(describe) {
  const cache = /* @__PURE__ */ new Map(), queue = [];
  let active = 0;
  function pump() {
    while (active < 2 && queue.length) {
      const { id, resolve } = queue.shift();
      active++;
      Promise.resolve().then(() => describe(id)).then(resolve, () => resolve(null)).finally(() => {
        active--;
        pump();
      });
    }
  }
  return function load(record, artwork, info) {
    const key = `${record.id}:${record.contentDigest}`;
    if (!cache.has(key)) cache.set(key, new Promise((resolve) => {
      queue.push({ id: record.id, resolve });
      pump();
    }));
    cache.get(key).then((details) => {
      if (!details || !info.isConnected) return;
      if (details.thumbnailUrl) {
        const image = document.createElement("img");
        image.src = details.thumbnailUrl;
        image.alt = `${details.name} logo`;
        image.decoding = "async";
        image.onerror = () => {
          artwork.replaceChildren();
          artwork.textContent = "PK";
          artwork.classList.add("gp-pack-thumb-fallback");
        };
        artwork.classList.remove("gp-pack-thumb-fallback");
        artwork.replaceChildren(image);
      }
      const badges = document.createElement("div");
      badges.className = "gp-pack-badge-row";
      for (const [text, tone] of [[`v${details.version || record.version}`, "info"], ...(details.capabilities || []).map((kind) => [kind.toUpperCase(), kind === "js" ? "warning" : "success"])]) {
        const badge = document.createElement("span");
        badge.className = `gp-badge gp-badge-${tone}`;
        badge.textContent = text;
        badges.append(badge);
      }
      info.append(badges);
      for (const text of [details.author, details.description]) if (text) {
        const line = document.createElement("div");
        line.className = "gp-text-muted";
        line.textContent = text;
        info.append(line);
      }
    });
  };
}
export {
  createModCardLoader
};
