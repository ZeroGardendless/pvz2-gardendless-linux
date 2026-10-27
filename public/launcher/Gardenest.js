import {invoke, escapeHtml as esc} from "./Store.js";
import {icon} from "./Icons.js";
import {installedOrigins} from "./Gpnext.js";

export const catalog = {query: "", kind: "mod", page: 1, result: null, origins: {}, loading: false, error: ""};
let request = 0;
const latest = project => project.matchedVersion || project.latestDownloadableVersion;
export function versionFor(project) { return latest(project)?.id; }
export function gardenestMarkup() {
  return `<section class="panel nest-browser"><div class="section-heading"><div><h2>Discover mods</h2><p class="muted">Install and update directly into the selected profile.</p></div><button class="button secondary" data-action="nest-refresh">${icon("refresh")}Refresh</button></div>
    <form id="nest-search-form" class="nest-search"><label class="package-search">${icon("search")}<input id="nest-search" type="search" value="${esc(catalog.query)}" placeholder="Search Gardenest" aria-label="Search Gardenest"></label><label class="nest-type">Type<select id="nest-type"><option value="mod" ${catalog.kind === "mod" ? "selected" : ""}>Mods</option><option value="datapack" ${catalog.kind === "datapack" ? "selected" : ""}>Datapacks</option></select></label><button class="button primary" type="submit">Search</button></form>
    <div id="nest-results" aria-live="polite">${resultsMarkup()}</div></section>`;
}
function resultsMarkup() {
  if (catalog.loading) return `<div class="nest-loading" role="status"><span class="loading-ring"></span>Fetching creations…</div>`;
  if (catalog.error) return `<div class="notice warning"><p>${esc(catalog.error)}</p><button class="button secondary" data-action="nest-refresh">Try again</button></div>`;
  const projects = catalog.result?.projects || [];
  if (!projects.length) return `<div class="empty-state">${icon("leaf")}<h3>${catalog.result ? "No matching creations" : "Browse Gardenest"}</h3><p>${catalog.result ? "Try another search or switch the type." : "Search for a mod or load the latest updates."}</p></div>`;
  return `<div class="nest-grid">${projects.map((project, index) => {
    const version = latest(project), origin = catalog.origins[project.metadata?.packUuid];
    const current = origin?.versionId === version?.id;
    return `<article class="nest-card"><div class="nest-card-heading"><span class="nest-art">${icon("puzzle")}</span><div><h3>${esc(project.title)}</h3><p class="muted">${esc(project.ownerName || project.ownerUsername || "Community")}</p></div><span class="badge">${esc(version?.version || project.metadata?.version || "")}</span></div><p class="nest-summary">${esc(project.summary || "No description provided.")}</p><div class="package-tags">${project.metadata?.containsScripts ? '<span class="badge">JavaScript</span>' : ''}<span class="badge">${esc(project.stats?.downloadCount || 0)} downloads</span>${current ? '<span class="badge green">Up to date</span>' : origin ? '<span class="badge">Update available</span>' : ''}</div><div class="card-actions"><button class="button ${current ? "secondary" : "primary"}" data-action="nest-install" data-index="${index}" ${!version?.id || current ? "disabled" : ""}>${icon(origin ? "refresh" : "download")}${current ? "Installed" : origin ? "Review update" : "Review & install"}</button><button class="button quiet" data-action="website-tool" data-url="https://nest.pvzge.com/projects/${esc(project.publicId || project.projectId)}" aria-label="View ${esc(project.title)} on Gardenest">${icon("external")}</button></div></article>`;
  }).join("")}</div><div class="nest-pagination"><button class="button secondary" data-action="nest-page" data-page="${catalog.page - 1}" ${catalog.page <= 1 ? "disabled" : ""}>Previous</button><span>Page ${catalog.page} of ${catalog.result.totalPages || 1}</span><button class="button secondary" data-action="nest-page" data-page="${catalog.page + 1}" ${catalog.page >= (catalog.result.totalPages || 1) ? "disabled" : ""}>Next</button></div>`;
}
export function paintCatalog(root = document) {
  const region = root.querySelector("#nest-results");
  if (region) { region.innerHTML = resultsMarkup(); region.setAttribute("aria-busy", String(catalog.loading)); }
}
export async function refreshCatalog(profileId, root = document) {
  const id = ++request;
  catalog.loading = true; catalog.error = ""; paintCatalog(root);
  try {
    const [result, origins] = await Promise.all([
      invoke("launcher_nest_catalog", {query: catalog.query, kind: catalog.kind, page: catalog.page, projectId: null}),
      installedOrigins(profileId),
    ]);
    if (id !== request) return;
    catalog.result = result; catalog.origins = origins;
  } catch (error) { if (id === request) catalog.error = String(error.message || error); }
  finally { if (id === request) { catalog.loading = false; paintCatalog(root); } }
}
