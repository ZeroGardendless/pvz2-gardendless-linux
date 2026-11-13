import {readFile, writeFile} from 'node:fs/promises';

const config = JSON.parse(await readFile('public/assets/resources/config.json', 'utf8'));
const collections = new Map();
const objects = new Map();
const armorFeatures = new Map();

// Cocos stores some unbundled asset identifiers in its compact UUID form.
function expandUuid(value) {
  if (value.length !== 22) return value;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let hex = value.slice(0, 2);
  for (let i = 2; i < value.length; i += 2) {
    const a = alphabet.indexOf(value[i]);
    const b = alphabet.indexOf(value[i + 1]);
    hex += (a >> 2).toString(16) + (((a & 3) << 2) | (b >> 4)).toString(16) + (b & 15).toString(16);
  }
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

function collect(value) {
  if (!value || typeof value !== 'object') return;
  for (const key of ['PLANTS', 'ZOMBIES']) {
    if (Array.isArray(value[key])) collections.set(key, value[key]);
  }
  if (value.objclass && Array.isArray(value.aliases)) {
    for (const alias of value.aliases) objects.set(`${value.objclass}:${alias}`, value.objdata);
  }
  if (Array.isArray(value.ARMORS)) {
    value.ARMORS.forEach((feature, index) => armorFeatures.set(feature.CODENAME, {...feature, index}));
  }
  for (const child of Object.values(value)) collect(child);
}

const packs = new Set();
const catalogPath = /^json\/(Features\/(PlantFeatures|ZombieFeatures|ArmorFeatures)|Objects\/(ZombieTypes|ZombieProps|ArmorTypes))$/;
for (const [index, [name]] of Object.entries(config.paths)) {
  if (!catalogPath.test(name)) continue;
  const pack = Object.entries(config.packs).find(([, ids]) => ids.includes(Number(index)))?.[0];
  packs.add(pack || expandUuid(config.uuids[Number(index)]));
}
for (const pack of packs) {
  collect(JSON.parse(await readFile(`public/assets/resources/import/${pack.slice(0, 2)}/${pack}.json`, 'utf8')));
}

const alias = reference => String(reference || '').replace(/^RTID\((.+?)@.*\)$/, '$1');
const entries = [];
for (const [key, kind, suffix] of [['PLANTS', 'plants', 'PLANT'], ['ZOMBIES', 'zombies', 'ZOMBIE']]) {
  for (const feature of collections.get(key) || []) {
    const resource = typeof feature.RES === 'string' ? feature.RES : feature.RES?.Plant;
    if (!feature.CODENAME || !resource) continue;
    const entry = {
      kind, codename: feature.CODENAME, name: feature.NAME?.en || feature.CODENAME,
      prefab: `${kind}/${resource}${suffix}`, armors: [], costumes: kind === 'plants' ? (feature.COSTUME || 0) : 0,
    };
    if (kind === 'zombies') {
      const type = objects.get(`ZombieType:${entry.codename}`) || {};
      const props = {
        ...objects.get(`ZombieProperties:${alias(feature.PROPS)}`),
        ...objects.get(`ZombieProperties:${alias(type.Properties)}`),
      };
      for (const reference of props.StartingArmors || []) {
        const id = alias(reference);
        const type = objects.get(`ArmorType:${id}`) || {};
        const base = type.ArmorBaseOn || type.ArmorBasedOn || id;
        const armor = armorFeatures.get(base);
        if (!armor) throw Error(`Unknown starting armor ${id} for ${entry.codename}`);
        entry.armors.push({id, base, index: armor.index, prefab: `armors/${armor.RES}ARMOR`, animation: 'Broken0'});
      }
    }
    entries.push(entry);
  }
}
if (!entries.some(entry => entry.codename === 'peashooter') || !entries.some(entry => entry.kind === 'zombies')) {
  throw Error('Incomplete render feature catalog');
}
// Miscellaneous visual prefabs: projectiles, drops, effects, scenery, armour,
// dinosaurs and other helpers. Resource-container prefabs are not renderable units.
const knownPrefabs=new Set(entries.map(entry=>entry.prefab));
for(const [name,type] of Object.values(config.paths)){
  if(config.types[type]!=='cc.Prefab'||knownPrefabs.has(name)||name.startsWith('resouce_prefabs/'))continue;

  entries.push({kind:'misc',codename:name.split('/').pop(),name:name.split('/').pop(),prefab:name,category:name.startsWith('plants/')?'plant-parts':name.startsWith('zombies/')?'zombie-parts':name.split('/')[0],armors:[],costumes:0});
}
const armors = [...armorFeatures].map(([base, feature]) => ({id: base, base, index: feature.index, name: feature.NAME?.en || base, prefab: `armors/${feature.RES}ARMOR`, animation: 'Broken0'}));
await writeFile('public/launcher/RenderCatalog.js', '// Generated from feature codenames and resolved type/props attachments.\nexport const RENDER_ENTRIES=' + JSON.stringify(entries, null, 2) + ';\nexport const RENDER_ARMORS=' + JSON.stringify(armors, null, 2) + ';\n');
console.log(`Render catalog: ${entries.filter(entry => entry.kind === 'plants').length} plants, ${entries.filter(entry => entry.kind === 'zombies').length} zombies; ${entries.filter(entry => entry.armors.length).length} armoured variants.`);
