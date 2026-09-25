// Vercel Serverless Function: /api/data
// Pulls the live picking sheet + the HR attendance sheet (for real names),
// aggregates per user / per day / per hour, and returns JSON for the dashboard.

const fs = require("fs");
const path = require("path");

const PICK_SHEET_ID = "1l6EwjL3i0eNy3mdYlcUcOF8un1-31ycKJEL5cuZ9MkQ";
const PICK_GID = "841809744";
const PICK_URL = `https://docs.google.com/spreadsheets/d/${PICK_SHEET_ID}/export?format=csv&gid=${PICK_GID}`;
const PICK_PUBLISH_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm8drSF8Zoa60ahlcWKiNSRKmvwWgaw39kXhbTlR4gtTDIqKDvYiCTla-YDqnsirHmWf5y9LeUMLvf/pub?gid=841809744&single=true&output=csv";

const NAMES_SHEET_ID = "1GaMh4GIfanzEvJYpbtvuVLpawERz_-kRzSrWyqovpXs";
// One tab per hub/team in the attendance sheet, each with an ID / Employee Name table.
const NAMES_TABS = {
  CAIID01: "11379924",
  CAIDS09: "348453301",
  CAIDS10: "383489006",
  CAIDS11: "439385737",
  CAIDS12: "866414450",
  CAIDS13: "336490703",
  CAIDS14: "222984670",
  CAIDS15: "1477803256",
  CAIDS16: "557209814",
  CAIDS17: "289183708",
  CAIDS18: "1364218410",
  CAIDS19: "1139704174",
  CAIDS20: "1048268651",
  CAIDS22: "222883955",
  CAIDS21: "967970317",
  CAIDS23: "634981370",
  CAIDS32: "724327074",
  CAIDS30: "1763961627",
  CAIDS24: "1674119066",
  CAIDS25: "829064114",
  CAIDS26: "286814288",
  CAIDS27: "148578138",
  CAIDS28: "764960307",
  ALYDS02: "1373745072",
  ALYDS03: "1706483175",
};

async function fetchText(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs || 20000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 PickDash" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// Minimal RFC4180-ish CSV parser: handles quoted fields (with embedded commas,
// newlines, and escaped "" quotes), which the attendance sheet needs for dates
// like "Jun 2, 2026".
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // skip; \n below closes the row
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function parsePickedAt(value) {
  if (!value) return null;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s+(\d{1,2}):(\d{2})/.exec(value.trim());
  if (!m) return null;
  const month = parseInt(m[1], 10);
  const day = parseInt(m[2], 10);
  let year = parseInt(m[3], 10);
  if (year < 100) year += 2000;
  const hour = parseInt(m[4], 10);
  const date =
    String(year).padStart(4, "0") + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  return { date, hour };
}

function getStaticNamesMap() {
  try {
    const p = path.join(__dirname, "../data/names.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const data = JSON.parse(raw);
      return data.map || {};
    }
  } catch (_) {}
  return {};
}

async function buildNamesMap() {
  const combined = Object.assign({}, getStaticNamesMap());
  const entries = Object.entries(NAMES_TABS);

  const results = await Promise.allSettled(
    entries.map(async ([, gid]) => {
      const url = `https://docs.google.com/spreadsheets/d/${NAMES_SHEET_ID}/export?format=csv&gid=${gid}`;
      const text = await fetchText(url, 15000);
      const rows = parseCsv(text);
      // Row 0 is a merged "dates" row; row 1 holds the real header.
      if (rows.length < 3) return {};
      const header = rows[1];
      const idxId = header.indexOf("ID");
      const idxName = header.indexOf("Employee Name");
      const map = {};
      if (idxId < 0 || idxName < 0) return map;
      for (let i = 2; i < rows.length; i++) {
        const r = rows[i];
        if (!r || r.length <= idxName) continue;
        const id = (r[idxId] || "").trim();
        const name = (r[idxName] || "").trim().replace(/\s+/g, " ");
        if (id.length >= 9 && name) {
          const key = id.slice(0, 9).toUpperCase();
          if (!(key in map)) map[key] = name;
        }
      }
      return map;
    })
  );

  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const [key, name] of Object.entries(r.value)) {
        if (!(key in combined) || !combined[key]) combined[key] = name;
      }
    }
  }
  return combined;
}

function getDisplayName(username, namesMap, fallback) {
  const local = username.split("@")[0];
  if (local.length >= 9) {
    const key = local.slice(0, 9).toUpperCase();
    if (namesMap && namesMap[key]) return namesMap[key];
  }
  const fullKey = local.toUpperCase();
  if (namesMap && namesMap[fullKey]) return namesMap[fullKey];
  return fallback;
}

async function fetchPickingCsv() {
  try {
    const text = await fetchText(PICK_URL, 25000);
    return { text, source: PICK_URL };
  } catch (err) {
    const text = await fetchText(PICK_PUBLISH_URL, 25000);
    return { text, source: PICK_PUBLISH_URL };
  }
}

function buildPickingData(csvText, source, namesMap) {
  const rows = parseCsv(csvText);
  if (!rows.length) throw new Error("Sheet is empty");

  const header = rows[0];
  const idxUser = header.indexOf("username");
  const idxSku = header.indexOf("sku");
  const idxPicked = header.indexOf("picked_at");
  const idxStatus = header.indexOf("line_status");
  const idxPickType = header.indexOf("picking_type");

  if (idxUser < 0 || idxSku < 0 || idxPicked < 0) {
    throw new Error("Missing columns: username / sku / picked_at");
  }

  const users = new Map();
  const allSkus = new Set();
  const daysSet = new Set();
  const pickTypesSet = new Set();
  let total = 0;
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const f = rows[i];
    if (!f || f.length <= idxPicked) continue;

    if (idxStatus >= 0 && idxStatus < f.length) {
      const status = f[idxStatus];
      if (status && status !== "picked") {
        skipped++;
        continue;
      }
    }

    const when = parsePickedAt(f[idxPicked]);
    if (!when) continue;

    const username = (f[idxUser] || "").trim();
    const sku = (f[idxSku] || "").trim();
    if (!username) continue;

    const pickType = (idxPickType >= 0 && idxPickType < f.length ? (f[idxPickType] || "").trim() : "") || "unknown";

    total++;
    daysSet.add(when.date);
    if (sku) allSkus.add(sku);
    pickTypesSet.add(pickType);

    let u = users.get(username);
    if (!u) {
      u = {
        username,
        name: username.split("@")[0],
        total: 0,
        unique: new Set(),
        days: new Map(),
        pickTypes: {},
      };
      users.set(username, u);
    }
    u.total++;
    if (sku) u.unique.add(sku);
    u.pickTypes[pickType] = (u.pickTypes[pickType] || 0) + 1;

    let day = u.days.get(when.date);
    if (!day) {
      day = {
        total: 0,
        unique: new Set(),
        hoursQty: new Array(24).fill(0),
        hourSkuSets: Array.from({ length: 24 }, () => new Set()),
        byType: {},
      };
      u.days.set(when.date, day);
    }
    day.total++;
    if (sku) day.unique.add(sku);
    if (when.hour >= 0 && when.hour <= 23) {
      day.hoursQty[when.hour]++;
      if (sku) day.hourSkuSets[when.hour].add(sku);
    }

    if (!day.byType[pickType]) {
      day.byType[pickType] = {
        total: 0,
        unique: new Set(),
        hoursQty: new Array(24).fill(0),
        hourSkuSets: Array.from({ length: 24 }, () => new Set()),
      };
    }
    const bt = day.byType[pickType];
    bt.total++;
    if (sku) bt.unique.add(sku);
    if (when.hour >= 0 && when.hour <= 23) {
      bt.hoursQty[when.hour]++;
      if (sku) bt.hourSkuSets[when.hour].add(sku);
    }
  }

  const userList = [];
  for (const u of users.values()) {
    const dayMap = {};
    for (const [d, info] of u.days.entries()) {
      const byTypeOut = {};
      for (const [pt, tInfo] of Object.entries(info.byType || {})) {
        byTypeOut[pt] = {
          qty: tInfo.total,
          uniqueSkus: tInfo.unique.size,
          hoursQty: tInfo.hoursQty,
          hoursSku: tInfo.hourSkuSets.map((s) => s.size),
        };
      }
      dayMap[d] = {
        qty: info.total,
        uniqueSkus: info.unique.size,
        hoursQty: info.hoursQty,
        hoursSku: info.hourSkuSets.map((s) => s.size),
        byType: byTypeOut,
      };
    }
    userList.push({
      username: u.username,
      name: u.name,
      displayName: getDisplayName(u.username, namesMap, u.name),
      total: u.total,
      uniqueSkus: u.unique.size,
      pickTypes: u.pickTypes,
      days: dayMap,
    });
  }

  userList.sort((a, b) => b.total - a.total);
  const days = Array.from(daysSet).sort();

  return {
    ok: true,
    source,
    fetchedAt: new Date().toISOString(),
    totalPicks: total,
    uniqueUsers: userList.length,
    uniqueSkus: allSkus.size,
    skipped,
    pickingTypes: Array.from(pickTypesSet).sort(),
    days,
    users: userList,
  };
}

module.exports = async function handler(req, res) {
  try {
    const fresh = req.query && req.query.fresh === "1";

    const [namesMap, pick] = await Promise.all([
      buildNamesMap().catch(() => ({})),
      fetchPickingCsv(),
    ]);

    const data = buildPickingData(pick.text, pick.source, namesMap);

    res.setHeader(
      "Cache-Control",
      fresh ? "no-store" : "s-maxage=20, stale-while-revalidate=60"
    );
    res.status(200).json(data);
  } catch (err) {
    res.setHeader("Cache-Control", "no-store");
    res.status(500).json({ ok: false, error: (err && err.message) || String(err) });
  }
};
