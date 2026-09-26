import { createUuid } from "../../core/Uuid.js";
import { l, n as button, i } from "../Components.js";
import { a, n as documentationUrl } from "../Translations.js";
import { n as openUrl } from "../../platform/Opener.js";
const history = [];
function renderUuidGenerator(container) {
  const value = document.createElement("input");
  value.className = "gp-input gp-text-mono";
  value.readOnly = true;
  value.setAttribute("aria-label", "Generated UUID");
  value.style.cssText = "width:100%;box-sizing:border-box;min-width:0;";
  const status = i("Use this UUID in your datapack\u2019s pack.json.");
  status.setAttribute("role", "status");
  const list = document.createElement("select");
  list.className = "gp-select";
  list.setAttribute("aria-label", "Recent UUIDs in this session");
  const showHistory = () => {
    list.replaceChildren(...history.map((uuid) => {
      const option = document.createElement("option");
      option.value = option.textContent = uuid;
      return option;
    }));
    value.value = history[0] || "";
  };
  const generate = () => {
    try {
      history.unshift(createUuid());
      history.splice(10);
      showHistory();
      status.textContent = "Generated a new UUID. Previous IDs remain in the session history.";
    } catch (error) {
      status.textContent = error.message;
    }
  };
  const actions = document.createElement("div");
  actions.className = "gp-inline-actions";
  actions.append(button(a("guide.uuidGenerate"), generate), button("Copy UUID", async () => {
    try {
      await navigator.clipboard.writeText(value.value);
      status.textContent = "UUID copied.";
    } catch {
      value.focus();
      value.select();
      status.textContent = "Copy was unavailable. The UUID is selected for manual copying.";
    }
  }), button(a("guide.docs"), async () => {
    try {
      await openUrl(documentationUrl("guide/mod"));
    } catch (error) {
      status.textContent = error.message;
    }
  }));
  list.addEventListener("change", () => {
    value.value = list.value;
  });
  if (!history.length) generate();
  else showHistory();
  container.append(l(a("guide.uuidSectionTitle"), [value, actions, list, status]));
}
export {
  renderUuidGenerator
};
