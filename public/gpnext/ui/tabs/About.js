import { a, n as documentationUrl } from "../Translations.js";
import { n as toast } from "../Toast.js";
import { F } from "../../mods/FileLoader.js";
import { t } from "../../core/ClientEdition.js";
import { n as openUrl } from "../../platform/Opener.js";
const styles = `
  .gp-about { display: grid; gap: 14px; min-width: 0; padding: 2px; }
  .gp-about-hero { display: flex; align-items: center; gap: 18px; min-width: 0; padding: 18px; border: 1px solid rgba(var(--gp-accent-rgb,74,158,255),.24); border-radius: 14px; background: linear-gradient(125deg,rgba(var(--gp-accent-rgb,74,158,255),.15),rgba(15,23,42,.7) 68%); }
  .gp-about-logo { width: 68px; height: 68px; flex: 0 0 68px; object-fit: contain; border-radius: 15px; box-shadow: 0 8px 28px rgba(0,0,0,.24); }
  .gp-about-hero-copy { min-width: 0; }
  .gp-about h1 { margin: 0 0 5px; color: #f8fafc; font: 700 21px/1.2 var(--gp-font-game); letter-spacing: .2px; }
  .gp-about p { margin: 0; color: #aab7ca; font-size: 13px; line-height: 1.55; }
  .gp-about-meta, .gp-about-features { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
  .gp-about-meta-card, .gp-about-feature { min-width: 0; padding: 13px 14px; border: 1px solid var(--gp-ui-border,rgba(148,163,184,.16)); border-radius: 11px; background: var(--gp-ui-surface,rgba(15,23,42,.58)); }
  .gp-about-meta-card span, .gp-about-feature h2 { display: block; margin: 0 0 7px; color: #90a0b7; font-size: 11px; font-weight: 650; letter-spacing: .07em; text-transform: uppercase; }
  .gp-about-meta-card strong { display: block; overflow-wrap: anywhere; color: #eaf1fb; font-size: 15px; font-weight: 650; }
  .gp-about-feature h2 { color: #dbeafe; font-size: 13px; letter-spacing: 0; text-transform: none; }
  .gp-about-note { padding: 12px 14px; border-left: 3px solid rgba(var(--gp-accent-rgb,74,158,255),.65); border-radius: 0 9px 9px 0; background: rgba(var(--gp-accent-rgb,74,158,255),.07); }
  .gp-about-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  @media(max-width:560px) { .gp-about-meta,.gp-about-features { grid-template-columns: minmax(0,1fr); } .gp-about-hero { gap: 12px; padding: 14px; } .gp-about-logo { width: 54px; height: 54px; flex-basis: 54px; } }
  @media(max-width:360px) { .gp-about-hero { align-items: flex-start; flex-direction: column; } }
`;
function makeCard(className, title, content) {
  const card = document.createElement("section");
  card.className = className;
  const heading = document.createElement(className === "gp-about-feature" ? "h2" : "span");
  heading.textContent = title;
  card.appendChild(heading);
  if (className === "gp-about-feature") {
    const description = document.createElement("p");
    description.textContent = content;
    card.appendChild(description);
  } else {
    const value = document.createElement("strong");
    value.textContent = content;
    card.appendChild(value);
  }
  return card;
}
async function render(container) {
  container.replaceChildren();
  const style = document.createElement("style");
  style.textContent = styles;
  container.appendChild(style);
  const page = document.createElement("div");
  page.className = "gp-about";
  const hero = document.createElement("header");
  hero.className = "gp-about-hero";
  const logo = document.createElement("img");
  logo.className = "gp-about-logo";
  logo.src = "/assets/gpnicon.png";
  logo.alt = "";
  const heroCopy = document.createElement("div");
  heroCopy.className = "gp-about-hero-copy";
  const title = document.createElement("h1");
  title.textContent = a("about.title");
  const intro = document.createElement("p");
  intro.textContent = a("about.overview");
  heroCopy.append(title, intro);
  hero.append(logo, heroCopy);
  page.appendChild(hero);
  const meta = document.createElement("div");
  meta.className = "gp-about-meta";
  meta.append(
    makeCard("gp-about-meta-card", a("about.patcherVersion"), `v${F}`),
    makeCard("gp-about-meta-card", a("about.clientEdition"), a(`about.clientEdition.${t}`))
  );
  page.appendChild(meta);
  const features = document.createElement("div");
  features.className = "gp-about-features";
  features.append(
    makeCard("gp-about-feature", a("tab.patcher"), a("about.feature.patches")),
    makeCard("gp-about-feature", a("tab.data"), a("about.feature.data")),
    makeCard("gp-about-feature", a("sections.tools"), a("about.feature.tools")),
    makeCard("gp-about-feature", a("tab.performance"), a("about.feature.performance"))
  );
  page.appendChild(features);
  const note = document.createElement("p");
  note.className = "gp-about-note";
  note.textContent = a("about.runtimeNotice");
  page.appendChild(note);
  const actions = document.createElement("div");
  actions.className = "gp-about-actions";
  const guide = document.createElement("button");
  guide.type = "button";
  guide.className = "gp-btn";
  guide.textContent = a("guide.docs");
  guide.addEventListener("click", async () => {
    try {
      await openUrl(documentationUrl("guide/mod"));
    } catch (error) {
      toast(String(error), "error");
    }
  });
  actions.appendChild(guide);
  page.appendChild(actions);
  container.appendChild(page);
}
export {
  render
};
