import { f } from "./CloudJson.js";
import "../GameBootstrap.js";
import "./CloudSelection.js";
import "../mods/GameConfiguration.js";
import "./CloudEnvironment.js";
var t;
async function reportCloudStartup(n2, r = f) {
  t &&= (await r(`cloud_startup_result`, { token: t, success: n2 }), null);
}
export {
  reportCloudStartup
};
