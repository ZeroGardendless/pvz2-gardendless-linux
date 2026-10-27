import { f } from "./CloudJson.js";
let ready = null;
async function updatePresence(activity) {
  ready ||= (async () => {
    if (!await f("game_discord_available")) return false;
    await f("plugin:drpc|spawn_thread", { id: "1354392876724785243" });
    return true;
  })().catch(() => false);
  if (!await ready) return false;
  try {
    await f("plugin:drpc|set_activity", { activityJson: JSON.stringify(activity) });
    return true;
  } catch {
    ready = Promise.resolve(false);
    return false;
  }
}
export {
  updatePresence
};
