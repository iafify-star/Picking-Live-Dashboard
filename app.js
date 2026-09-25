const REFRESH_SEC = 60;

// ─── Translations ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    'brand.title'       : 'Picking Live Dashboard',
    'brand.subtitle'    : 'Every user · every hour · <b>Qty</b> = units picked · <b>SKU</b> = distinct products picked',
    'meta.fetching'     : 'Fetching data from the sheet...',
    'meta.syncing'      : 'Fetching the latest pull from the sheet...',
    'meta.lastSync'     : 'Last sync: {time} · {qty} qty · {sku} SKU',
    'meta.error'        : 'Could not read the sheet: {msg}',
    'btn.refresh'       : 'Refresh now',
    'label.fromDate'    : 'From date',
    'label.toDate'      : 'To date',
    'btn.allDays'       : 'All dates',
    'label.search'      : 'Search user',
    'search.placeholder': 'Type a username or name...',
    'label.sortBy'      : 'Sort by',
    'sort.qty'          : 'Highest quantity',
    'sort.skus'         : 'Highest SKU count',
    'sort.name'         : 'Name',
    'countdown'         : 'Refreshing in {n}s',
    'hint.toolbar'      : 'Pick a date range (or tap a day below), search for a user, then read the table: each hour column shows what was picked that hour. Data pulls live from the picking sheet — throw a new pull and it shows up here.',
    'panel.title'       : 'Hourly Productivity per User',
    'panel.subtitle'    : 'One row per picker · one column per hour · sticky columns stay visible while you scroll',
    'btn.export'        : 'Download Excel',
    'legend.qty'        : 'Bold number = <b>quantity</b> (units picked)',
    'legend.sku'        : 'Small number = <b>distinct SKUs</b> (not units)',
    'legend.empty'      : 'No picks',
    'legend.low'        : 'Low',
    'legend.mid'        : 'Medium',
    'legend.hot'        : 'Busiest hour',
    'legend.click'      : 'Click an hour header or a row to highlight it',
    'kpi.qty.label'     : 'Quantity in range',
    'kpi.qty.hint'      : 'Total units picked across the selected dates',
    'kpi.sku.label'     : 'SKU count',
    'kpi.sku.hint'      : 'Distinct products picked — not total units',
    'kpi.pickers.label' : 'Active pickers',
    'kpi.pickers.hint'  : 'Unique users with at least one pick in range',
    'kpi.lastHour.label': 'Last hour with picks: {h}',
    'kpi.lastHour.hint' : 'Totals for the most recent hour that has data',
    'table.hash'        : '#',
    'table.name'        : 'Name',
    'table.total'       : 'Total',
    'table.hourlyTotal' : 'Hourly total',
    'table.noData'      : 'No picks in this date range',
    'live.live'         : 'LIVE',
    'live.sync'         : 'SYNC',
    'live.off'          : 'OFF',
    'langBtn'           : '🌐 AR',
    'footer'            : 'Designed by Ibrahim Afify',
  },
  ar: {
    'brand.title'       : 'لوحة الإنتاج اللحظية',
    'brand.subtitle'    : 'كل مستخدم · كل ساعة · <b>الكمية</b> = وحدات جُمعت · <b>SKU</b> = منتجات مختلفة',
    'meta.fetching'     : 'جارٍ تحميل البيانات...',
    'meta.syncing'      : 'جارٍ جلب أحدث البيانات من الشيت...',
    'meta.lastSync'     : 'آخر مزامنة: {time} · {qty} كمية · {sku} SKU',
    'meta.error'        : 'فشل تحميل البيانات: {msg}',
    'btn.refresh'       : 'تحديث الآن',
    'label.fromDate'    : 'من تاريخ',
    'label.toDate'      : 'إلى تاريخ',
    'btn.allDays'       : 'كل التواريخ',
    'label.search'      : 'بحث عن مستخدم',
    'search.placeholder': 'اكتب اسم المستخدم أو الاسم...',
    'label.sortBy'      : 'ترتيب حسب',
    'sort.qty'          : 'أعلى كمية',
    'sort.skus'         : 'أعلى SKU',
    'sort.name'         : 'الاسم',
    'countdown'         : 'التحديث خلال {n} ث',
    'hint.toolbar'      : 'اختر نطاق تاريخ (أو انقر على يوم أدناه)، ابحث عن مستخدم، ثم اقرأ الجدول: كل عمود يمثل ساعة. البيانات مباشرة من شيت الجمع.',
    'panel.title'       : 'الإنتاجية بالساعة لكل مستخدم',
    'panel.subtitle'    : 'صف لكل جامع · عمود لكل ساعة · الأعمدة الثابتة تبقى ظاهرة أثناء التمرير',
    'btn.export'        : 'تحميل Excel',
    'legend.qty'        : 'الرقم الكبير = <b>الكمية</b> (وحدات جُمعت)',
    'legend.sku'        : 'الرقم الصغير = <b>SKU</b> مختلف',
    'legend.empty'      : 'لا جمع',
    'legend.low'        : 'منخفض',
    'legend.mid'        : 'متوسط',
    'legend.hot'        : 'أعلى ساعة',
    'legend.click'      : 'انقر على رأس الساعة أو الصف لتمييزه',
    'kpi.qty.label'     : 'الكمية في الفترة',
    'kpi.qty.hint'      : 'إجمالي الوحدات المجموعة في التواريخ المحددة',
    'kpi.sku.label'     : 'عدد SKU',
    'kpi.sku.hint'      : 'منتجات مختلفة تم جمعها — ليس إجمالي الوحدات',
    'kpi.pickers.label' : 'الجامعون النشطون',
    'kpi.pickers.hint'  : 'مستخدمون لديهم جمع واحد على الأقل في الفترة',
    'kpi.lastHour.label': 'آخر ساعة بها جمع: {h}',
    'kpi.lastHour.hint' : 'الإجماليات لآخر ساعة تحتوي على بيانات',
    'table.hash'        : '#',
    'table.name'        : 'الاسم',
    'table.total'       : 'الإجمالي',
    'table.hourlyTotal' : 'إجمالي الساعة',
    'table.noData'      : 'لا يوجد جمع في هذه الفترة',
    'live.live'         : 'مباشر',
    'live.sync'         : 'مزامنة',
    'live.off'          : 'خطأ',
    'langBtn'           : '🌐 EN',
    'footer'            : 'تصميم إبراهيم عفيفي',
  },
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const els = {
  livePill  : document.getElementById("livePill"),
  liveText  : document.getElementById("liveText"),
  metaLine  : document.getElementById("metaLine"),
  refreshBtn: document.getElementById("refreshBtn"),
  langBtn   : document.getElementById("langBtn"),
  dateFrom  : document.getElementById("dateFrom"),
  dateTo    : document.getElementById("dateTo"),
  allDaysBtn: document.getElementById("allDaysBtn"),
  dayChips  : document.getElementById("dayChips"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  countdown : document.getElementById("countdown"),
  kpis      : document.getElementById("kpis"),
  exportBtn : document.getElementById("exportBtn"),
  userCount : document.getElementById("userCount"),
  matrixHead: document.getElementById("matrixHead"),
  matrixFoot: document.getElementById("matrixFoot"),
  userBody  : document.getElementById("userBody"),
};

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  data        : null,
  from        : "",
  to          : "",
  selectedUser: "",
  selectedHour: null,
  search      : "",
  sort        : "qty",
  left        : REFRESH_SEC,
  lang        : "en",
  lastMeta    : null,   // { key, params } — re-applied on language switch
};

// ─── i18n helpers ─────────────────────────────────────────────────────────────
function t(key, params = {}) {
  let text = TRANSLATIONS[state.lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  return Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, v), text);
}

function setMeta(key, params = {}) {
  state.lastMeta = { key, params };
  els.metaLine.textContent = t(key, params);
}

function setLiveState(key) {
  els.liveText.dataset.state = key;
  els.liveText.textContent   = t(`live.${key}`);
}

function applyLang() {
  const html = document.documentElement;
  html.lang = state.lang;
  html.dir  = state.lang === "ar" ? "rtl" : "ltr";

  // Static elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const val = t(el.dataset.i18n);
    if (el.tagName === "OPTION") el.textContent = val;
    else                         el.innerHTML   = val;
  });

  // Dynamic items
  els.searchInput.placeholder = t("search.placeholder");
  els.langBtn.textContent     = t("langBtn");
  els.countdown.textContent   = t("countdown", { n: state.left });
  setLiveState(els.liveText.dataset.state || "live");
  if (state.lastMeta) setMeta(state.lastMeta.key, state.lastMeta.params);

  // Re-render table / KPIs so dynamic strings update too
  if (state.data) render();

  try { localStorage.setItem("lang", state.lang); } catch (_) {}
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function padHours(values) {
  const hours = toArray(values).map((x) => Number(x || 0));
  while (hours.length < 24) hours.push(0);
  return hours;
}

function fmt(n) {
  return Number(n || 0).toLocaleString("en-US");
}

function dayLabel(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function hourLabel(h) {
  return String(h).padStart(2, "0") + ":00";
}

function selectedDays() {
  const days = toArray(state.data && state.data.days);
  return days.filter((d) => d >= state.from && d <= state.to);
}

function emptyHours() {
  return { qty: 0, uniqueSkus: 0, hoursQty: Array(24).fill(0), hoursSku: Array(24).fill(0) };
}

function dayInfo(user, day) {
  const info = user.days && user.days[day];
  if (!info) return emptyHours();
  return {
    qty       : Number(info.qty || info.total || 0),
    uniqueSkus: Number(info.uniqueSkus || 0),
    hoursQty  : padHours(info.hoursQty || info.hours),
    hoursSku  : padHours(info.hoursSku),
  };
}

function rangeStats(user) {
  const days = selectedDays();
  const out  = emptyHours();
  days.forEach((day) => {
    const info = dayInfo(user, day);
    out.qty        += info.qty;
    out.uniqueSkus += info.uniqueSkus;
    info.hoursQty.forEach((v, i) => { out.hoursQty[i] += v; });
    info.hoursSku.forEach((v, i) => { out.hoursSku[i] += v; });
  });
  if (days.length > 1) out.uniqueSkus = Number(user.uniqueSkus || out.uniqueSkus);
  return out;
}

function peakHour(hours) {
  let best = 0, idx = -1;
  hours.forEach((v, i) => { if (v > best) { best = v; idx = i; } });
  return idx === -1 ? { label: "—", value: 0 } : { label: hourLabel(idx), value: best };
}

function workedHours(hours) {
  return hours.filter((v) => v > 0).length;
}

// ─── Data loading ─────────────────────────────────────────────────────────────
async function loadData(fresh) {
  setLiveState("sync");
  els.refreshBtn.disabled = true;
  try {
    const res  = await fetch("/api/data" + (fresh ? "?fresh=1" : ""), { cache: "no-store" });
    const data = await res.json();
    if (data.loading) {
      setLiveState("sync");
      setMeta("meta.syncing");
      state.left = 3;
      return;
    }
    if (!data.ok) throw new Error(data.error || "Failed to fetch data");
    data.users = toArray(data.users);
    data.days  = toArray(data.days);
    state.data = data;
    const last  = data.days[data.days.length - 1] || "";
    const first = data.days[0] || last;
    if (!state.from || !data.days.includes(state.from)) state.from = last;
    if (!state.to   || !data.days.includes(state.to))   state.to   = last;
    els.dateFrom.min   = first;
    els.dateFrom.max   = last;
    els.dateTo.min     = first;
    els.dateTo.max     = last;
    els.dateFrom.value = state.from;
    els.dateTo.value   = state.to;
    render();
    const when = new Date(data.fetchedAt);
    setMeta("meta.lastSync", {
      time: when.toLocaleTimeString("en-US"),
      qty : fmt(data.totalPicks),
      sku : fmt(data.uniqueSkus),
    });
    els.livePill.classList.remove("err");
    setLiveState("live");
    state.left = REFRESH_SEC;
  } catch (err) {
    els.livePill.classList.add("err");
    setLiveState("off");
    setMeta("meta.error", { msg: err.message });
  } finally {
    els.refreshBtn.disabled = false;
  }
}

// ─── Filters ──────────────────────────────────────────────────────────────────
function applyDates() {
  if (!state.data) return;
  let from = els.dateFrom.value;
  let to   = els.dateTo.value;
  if (from && to && from > to) {
    const swap = from; from = to; to = swap;
    els.dateFrom.value = from;
    els.dateTo.value   = to;
  }
  state.from = from;
  state.to   = to;
  state.selectedHour = null;
  render();
}

function visibleUsers() {
  const q = state.search.trim().toLowerCase();
  let rows = state.data.users.map((u) => {
    const stats = rangeStats(u);
    const work  = workedHours(stats.hoursQty);
    const peak  = peakHour(stats.hoursQty);
    return { ...u, stats, work, uph: work ? Math.round(stats.qty / work) : 0, peak };
  }).filter((u) => u.stats.qty > 0);

  if (q) {
    rows = rows.filter((u) =>
      (u.username    || "").toLowerCase().includes(q) ||
      (u.name        || "").toLowerCase().includes(q) ||
      (u.displayName || "").toLowerCase().includes(q)
    );
  }

  rows.sort((a, b) => {
    if (state.sort === "skus") return b.stats.uniqueSkus - a.stats.uniqueSkus;
    if (state.sort === "name") return (a.displayName || a.name || "").localeCompare(b.displayName || b.name || "");
    return b.stats.qty - a.stats.qty;
  });
  return rows;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderChips() {
  const days = toArray(state.data.days);
  els.dayChips.innerHTML = days.map((d) => {
    const on = d >= state.from && d <= state.to;
    return `<button type="button" class="chip ${on ? "on" : ""}" data-day="${d}" title="${dayLabel(d)}">${dayLabel(d)}</button>`;
  }).join("");
}

function renderKpis(rows) {
  const qty = rows.reduce((s, u) => s + u.stats.qty, 0);
  const sku = rows.reduce((s, u) => s + u.stats.uniqueSkus, 0);
  let lastHour = 0;
  for (let h = 23; h >= 0; h--) {
    if (rows.some((u) => u.stats.hoursQty[h] > 0)) { lastHour = h; break; }
  }
  const hourQty = rows.reduce((s, u) => s + (u.stats.hoursQty[lastHour] || 0), 0);
  const hourSku = rows.reduce((s, u) => s + (u.stats.hoursSku[lastHour]  || 0), 0);

  const cards = [
    [t("kpi.qty.label"),                                 fmt(qty),                                       t("kpi.qty.hint"),      true ],
    [t("kpi.sku.label"),                                 fmt(sku),                                       t("kpi.sku.hint"),      false],
    [t("kpi.pickers.label"),                             fmt(rows.length),                               t("kpi.pickers.hint"),  false],
    [t("kpi.lastHour.label", { h: hourLabel(lastHour) }), `${fmt(hourSku)} SKU · ${fmt(hourQty)} qty`, t("kpi.lastHour.hint"), false],
  ];

  els.kpis.innerHTML = cards.map(([label, value, hint, gold]) => `
    <article class="kpi ${gold ? "gold" : ""}">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
      <div class="hint">${hint}</div>
    </article>
  `).join("");
}

function activeHours(rows) {
  let first = 24, last = -1;
  rows.forEach((u) => {
    u.stats.hoursQty.forEach((v, h) => {
      if (v > 0) { if (h < first) first = h; if (h > last) last = h; }
    });
  });
  if (last < 0) return [];
  const hours = [];
  for (let h = first; h <= last; h++) hours.push(h);
  return hours;
}

function heatClass(value, max) {
  if (!value) return "empty";
  const p = value / Math.max(max, 1);
  if (p >= 0.7)  return "hot";
  if (p >= 0.35) return "mid";
  return "low";
}

function renderTable(rows) {
  const hours     = activeHours(rows);
  const totalsQty = Array(24).fill(0);
  const totalsSku = Array(24).fill(0);
  let maxCell = 1;
  rows.forEach((u) => {
    u.stats.hoursQty.forEach((v, h) => { totalsQty[h] += v; if (v > maxCell) maxCell = v; });
    u.stats.hoursSku.forEach((v, h) => { totalsSku[h] += v; });
  });

  els.userCount.textContent = rows.length;

  els.matrixHead.innerHTML = `<tr>
    <th class="sticky">${t("table.hash")}</th>
    <th class="sticky user-col">${t("table.name")}</th>
    ${hours.map((h) => `<th class="${state.selectedHour === h ? "picked" : ""}" data-hour="${h}">${hourLabel(h)}</th>`).join("")}
    <th class="total-col">${t("table.total")}</th>
  </tr>`;

  els.userBody.innerHTML = rows.map((u, i) => `
    <tr data-user="${u.username}" class="${u.username === state.selectedUser ? "selected" : ""}">
      <td class="sticky">${i + 1}</td>
      <td class="sticky user-col">
        <div class="user-id">${u.displayName || u.name}</div>
        <div class="user-mail">${u.username}</div>
      </td>
      ${hours.map((h) => {
        const qty = u.stats.hoursQty[h] || 0;
        const sku = u.stats.hoursSku[h] || 0;
        return `<td class="cell ${heatClass(qty, maxCell)} ${state.selectedHour === h ? "picked" : ""}" data-hour="${h}">
          ${qty ? `<div class="cell-qty">${fmt(qty)}</div><div class="cell-sku">${fmt(sku)} SKU</div>` : "—"}
        </td>`;
      }).join("")}
      <td class="total-col">
        <div class="cell-qty">${fmt(u.stats.qty)}</div>
        <div class="cell-sku">${fmt(u.stats.uniqueSkus)} SKU</div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="${hours.length + 3}">${t("table.noData")}</td></tr>`;

  const sumQty = rows.reduce((s, u) => s + u.stats.qty, 0);
  const sumSku = rows.reduce((s, u) => s + u.stats.uniqueSkus, 0);
  els.matrixFoot.innerHTML = `<tr>
    <td class="sticky"></td>
    <td class="sticky user-col">${t("table.hourlyTotal")}</td>
    ${hours.map((h) => `<td class="${state.selectedHour === h ? "picked" : ""}" data-hour="${h}">
      <div class="cell-qty">${totalsQty[h] ? fmt(totalsQty[h]) : "—"}</div>
      <div class="cell-sku">${totalsSku[h] ? fmt(totalsSku[h]) + " SKU" : ""}</div>
    </td>`).join("")}
    <td class="total-col">
      <div class="cell-qty">${fmt(sumQty)}</div>
      <div class="cell-sku">${fmt(sumSku)} SKU</div>
    </td>
  </tr>`;
}

function render() {
  if (!state.data) return;
  renderChips();
  const rows = visibleUsers();
  renderKpis(rows);
  renderTable(rows);
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportExcel() {
  if (!state.data) return;
  const rows  = visibleUsers();
  const hours = activeHours(rows);
  const head  = [t("table.hash"), t("table.name"), "Username"]
    .concat(hours.flatMap((h) => [`${hourLabel(h)} qty`, `${hourLabel(h)} SKU`]))
    .concat([`${t("table.total")} qty`, `${t("table.total")} SKU`]);

  const body = rows.map((u, i) => {
    const cells = [i + 1, u.displayName || u.name, u.username];
    hours.forEach((h) => { cells.push(u.stats.hoursQty[h] || 0); cells.push(u.stats.hoursSku[h] || 0); });
    cells.push(u.stats.qty);
    cells.push(u.stats.uniqueSkus);
    return cells;
  });

  const totals = ["", t("table.hourlyTotal"), ""];
  hours.forEach((h) => {
    totals.push(rows.reduce((s, u) => s + (u.stats.hoursQty[h] || 0), 0));
    totals.push(rows.reduce((s, u) => s + (u.stats.hoursSku[h]  || 0), 0));
  });
  totals.push(rows.reduce((s, u) => s + u.stats.qty, 0));
  totals.push(rows.reduce((s, u) => s + u.stats.uniqueSkus, 0));

  const tableRows = [head, ...body, totals].map((line) =>
    `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
  ).join("");

  const html = `<html><head><meta charset="UTF-8"></head><body>
    <table border="1">${tableRows}</table>
    <p>${t("footer")}</p>
  </body></html>`;

  const blob = new Blob(["\uFEFF" + html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const link = document.createElement("a");
  const from = state.from.replaceAll("-", "");
  const to   = state.to.replaceAll("-", "");
  link.href     = URL.createObjectURL(blob);
  link.download = `picking-${from}-${to}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// ─── Event listeners ──────────────────────────────────────────────────────────
els.refreshBtn.addEventListener("click", () => loadData(true));
els.exportBtn.addEventListener("click", exportExcel);
els.dateFrom.addEventListener("change", applyDates);
els.dateTo.addEventListener("change", applyDates);

els.allDaysBtn.addEventListener("click", () => {
  if (!state.data || !state.data.days.length) return;
  state.from = state.data.days[0];
  state.to   = state.data.days[state.data.days.length - 1];
  els.dateFrom.value = state.from;
  els.dateTo.value   = state.to;
  state.selectedHour = null;
  render();
});

els.dayChips.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-day]");
  if (!btn) return;
  state.from = btn.dataset.day;
  state.to   = btn.dataset.day;
  els.dateFrom.value = state.from;
  els.dateTo.value   = state.to;
  state.selectedHour = null;
  render();
});

els.searchInput.addEventListener("input", () => {
  state.search = els.searchInput.value;
  render();
});

els.sortSelect.addEventListener("change", () => {
  state.sort = els.sortSelect.value;
  render();
});

els.userBody.addEventListener("click", (e) => {
  const hourCell = e.target.closest("[data-hour]");
  if (hourCell) {
    const value = Number(hourCell.dataset.hour);
    state.selectedHour = state.selectedHour === value ? null : value;
    render();
    return;
  }
  const row = e.target.closest("tr[data-user]");
  if (!row) return;
  state.selectedUser = state.selectedUser === row.dataset.user ? "" : row.dataset.user;
  render();
});

els.matrixHead.addEventListener("click", (e) => {
  const hour = e.target.closest("[data-hour]");
  if (!hour) return;
  const value = Number(hour.dataset.hour);
  state.selectedHour = state.selectedHour === value ? null : value;
  render();
});

// Language toggle
els.langBtn.addEventListener("click", () => {
  state.lang = state.lang === "en" ? "ar" : "en";
  applyLang();
});

// ─── Countdown ────────────────────────────────────────────────────────────────
setInterval(() => {
  state.left -= 1;
  if (state.left <= 0) {
    loadData(true);
  } else {
    els.countdown.textContent = t("countdown", { n: state.left });
  }
}, 1000);

// ─── Init ─────────────────────────────────────────────────────────────────────
state.lang = (() => { try { return localStorage.getItem("lang") || "en"; } catch (_) { return "en"; } })();
applyLang();
loadData(true);
