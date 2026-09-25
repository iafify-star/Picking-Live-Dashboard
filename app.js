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
    'btn.tv'            : '📺 TV Mode',
    'label.fromDate'    : 'From date',
    'label.toDate'      : 'To date',
    'btn.allDays'       : 'All dates',
    'label.fromHour'    : 'From hour',
    'label.toHour'      : 'To hour',
    'hour.all'          : 'All hours',
    'btn.allHours'      : 'All hours',
    'shift.title'       : 'Quick shifts:',
    'shift.all'         : 'Full 24h',
    'shift.morning'     : 'Morning (08:00 - 16:00)',
    'shift.evening'     : 'Evening (16:00 - 00:00)',
    'shift.night'       : 'Night (00:00 - 08:00)',
    'label.hub'         : 'Hub / Team',
    'hub.all'           : 'All Hubs',
    'btn.idleOnly'      : '⚠️ Idle Only',
    'label.search'      : 'Search user',
    'search.placeholder': 'Type a username or name...',
    'label.sortBy'      : 'Sort by',
    'sort.qty'          : 'Highest quantity',
    'sort.uph'          : 'Highest UPH (Speed)',
    'sort.skus'         : 'Highest SKU count',
    'sort.name'         : 'Name',
    'countdown'         : 'Refreshing in {n}s',
    'hint.toolbar'      : 'Pick a date range and hours (or tap a preset below), search for a user, then read the table: each hour column shows what was picked that hour. Data pulls live from the picking sheet — throw a new pull and it shows up here.',
    'target.title'      : 'Shift Target & Pace',
    'target.subtitle'   : 'Real-time progress toward the shift goal',
    'target.setLabel'   : 'Goal:',
    'target.progress'   : '{done} / {target} units',
    'target.remaining'  : '{rem} remaining',
    'target.pace'       : '⚡ Pace: {pace} units/hr',
    'status.crushed'    : 'Target Crushed! 🎉',
    'status.onTrack'    : 'On Track',
    'status.needsPush'  : 'Needs Push',
    'chart.title'       : 'Darkstore Hourly Volume',
    'chart.subtitle'    : 'Click any hour bar to isolate that hour in the table below',
    'chart.peak'        : '🔥 Peak: {h} ({v} units)',
    'podium.champion'   : 'Champion',
    'podium.runnerUp'   : 'Runner Up',
    'podium.third'      : '3rd Place',
    'podium.speedDemon' : '⚡ Top Speed',
    'podium.skuMaster'  : '📦 SKU Master',
    'podium.ironPicker' : '🔥 Iron Picker',
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
    'kpi.qty.hint'      : 'Total units picked across the selected dates & hours',
    'kpi.sku.label'     : 'SKU count',
    'kpi.sku.hint'      : 'Distinct products picked — not total units',
    'kpi.pickers.label' : 'Active pickers',
    'kpi.pickers.hint'  : 'Unique users with at least one pick in selected hours',
    'kpi.lastHour.label': 'Last hour with picks: {h}',
    'kpi.lastHour.hint' : 'Totals for the most recent hour that has data',
    'table.hash'        : '#',
    'table.name'        : 'Picker',
    'table.hrs'         : 'Hrs',
    'table.uph'         : 'UPH',
    'table.total'       : 'Total',
    'table.hourlyTotal' : 'Hourly total',
    'table.noData'      : 'No picks in this date / hour range',
    'idle.tag'          : 'Idle',
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
    'btn.tv'            : '📺 وضع الشاشة',
    'label.fromDate'    : 'من تاريخ',
    'label.toDate'      : 'إلى تاريخ',
    'btn.allDays'       : 'كل التواريخ',
    'label.fromHour'    : 'من الساعة',
    'label.toHour'      : 'إلى الساعة',
    'hour.all'          : 'كل الساعات',
    'btn.allHours'      : 'كل الساعات',
    'shift.title'       : 'شفتات سريعة:',
    'shift.all'         : 'طول اليوم (24 س)',
    'shift.morning'     : 'صباحي (08:00 - 16:00)',
    'shift.evening'     : 'مسائي (16:00 - 00:00)',
    'shift.night'       : 'ليلي (00:00 - 08:00)',
    'label.hub'         : 'الفرع / الفريق',
    'hub.all'           : 'كل الفروع',
    'btn.idleOnly'      : '⚠️ المتوقفين فقط',
    'label.search'      : 'بحث عن مستخدم',
    'search.placeholder': 'اكتب اسم المستخدم أو الاسم...',
    'label.sortBy'      : 'ترتيب حسب',
    'sort.qty'          : 'أعلى كمية',
    'sort.uph'          : 'أعلى سرعة (UPH)',
    'sort.skus'         : 'أعلى SKU',
    'sort.name'         : 'الاسم',
    'countdown'         : 'التحديث خلال {n} ث',
    'hint.toolbar'      : 'اختر نطاق التاريخ والساعات (أو اضغط على شفت محدد أدناه)، ابحث عن مستخدم، واقرأ الجدول: كل عمود يمثل ساعة ضمن الوقت المحدد.',
    'target.title'      : 'مستهدف الشفت والسرعة',
    'target.subtitle'   : 'تقدم لحظي نحو تحقيق مستهدف الشفت',
    'target.setLabel'   : 'المستهدف:',
    'target.progress'   : '{done} من {target} وحدة',
    'target.remaining'  : 'متبقي {rem}',
    'target.pace'       : '⚡ السرعة: {pace} وحدة/س',
    'status.crushed'    : 'تم تحقيق الهدف! 🎉',
    'status.onTrack'    : 'على وشك التحقيق',
    'status.needsPush'  : 'يحتاج دفعة إضافية',
    'chart.title'       : 'حجم الجمع بالساعة في الفرع',
    'chart.subtitle'    : 'اضغط على أي ساعة لعزلها في الجدول أدناه',
    'chart.peak'        : '🔥 الذروة: {h} ({v} وحدة)',
    'podium.champion'   : 'المتصدر الأول',
    'podium.runnerUp'   : 'الوصيف الثاني',
    'podium.third'      : 'المركز الثالث',
    'podium.speedDemon' : '⚡ أسرع جامع',
    'podium.skuMaster'  : '📦 بطل التنوع',
    'podium.ironPicker' : '🔥 الأكثر استمراراً',
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
    'kpi.qty.hint'      : 'إجمالي الوحدات المجموعة في التواريخ والساعات المحددة',
    'kpi.sku.label'     : 'عدد SKU',
    'kpi.sku.hint'      : 'منتجات مختلفة تم جمعها — ليس إجمالي الوحدات',
    'kpi.pickers.label' : 'الجامعون النشطون',
    'kpi.pickers.hint'  : 'مستخدمون لديهم جمع واحد على الأقل في الساعات المحددة',
    'kpi.lastHour.label': 'آخر ساعة بها جمع: {h}',
    'kpi.lastHour.hint' : 'الإجماليات لآخر ساعة تحتوي على بيانات',
    'table.hash'        : '#',
    'table.name'        : 'الجامع',
    'table.hrs'         : 'الساعات',
    'table.uph'         : 'معدل/س',
    'table.total'       : 'الإجمالي',
    'table.hourlyTotal' : 'إجمالي الساعة',
    'table.noData'      : 'لا يوجد جمع في هذه الفترة / الساعات',
    'idle.tag'          : 'متوقف',
    'live.live'         : 'مباشر',
    'live.sync'         : 'مزامنة',
    'live.off'          : 'خطأ',
    'langBtn'           : '🌐 EN',
    'footer'            : 'تصميم إبراهيم عفيفي',
  },
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const els = {
  livePill          : document.getElementById("livePill"),
  liveText          : document.getElementById("liveText"),
  metaLine          : document.getElementById("metaLine"),
  refreshBtn        : document.getElementById("refreshBtn"),
  langBtn           : document.getElementById("langBtn"),
  themeBtn          : document.getElementById("themeBtn"),
  tvBtn             : document.getElementById("tvBtn"),
  targetInput       : document.getElementById("targetInput"),
  targetBadge       : document.getElementById("targetBadge"),
  progressBarFill   : document.getElementById("progressBarFill"),
  targetProgressText: document.getElementById("targetProgressText"),
  targetRemainingText: document.getElementById("targetRemainingText"),
  targetPaceText    : document.getElementById("targetPaceText"),
  podiumSection     : document.getElementById("podiumSection"),
  chartPanel        : document.getElementById("chartPanel"),
  hourlyChart       : document.getElementById("hourlyChart"),
  chartPeakBadge    : document.getElementById("chartPeakBadge"),
  dateFrom          : document.getElementById("dateFrom"),
  dateTo            : document.getElementById("dateTo"),
  allDaysBtn        : document.getElementById("allDaysBtn"),
  hourFrom          : document.getElementById("hourFrom"),
  hourTo            : document.getElementById("hourTo"),
  allHoursBtn       : document.getElementById("allHoursBtn"),
  dayChips          : document.getElementById("dayChips"),
  shiftChips        : document.getElementById("shiftChips"),
  hubSelect         : document.getElementById("hubSelect"),
  searchInput       : document.getElementById("searchInput"),
  sortSelect        : document.getElementById("sortSelect"),
  idleToggleBtn     : document.getElementById("idleToggleBtn"),
  countdown         : document.getElementById("countdown"),
  kpis              : document.getElementById("kpis"),
  exportBtn         : document.getElementById("exportBtn"),
  userCount         : document.getElementById("userCount"),
  matrixHead        : document.getElementById("matrixHead"),
  matrixFoot        : document.getElementById("matrixFoot"),
  userBody          : document.getElementById("userBody"),
};

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  data        : null,
  from        : "",
  to          : "",
  hourFrom    : "",
  hourTo      : "",
  selectedUser: "",
  selectedHour: null,
  search      : "",
  sort        : "qty",
  hub         : "",
  idleOnly    : false,
  tvMode      : false,
  target      : (() => { try { return Number(localStorage.getItem("shift_target")) || 5000; } catch (_) { return 5000; } })(),
  theme       : (() => { try { return localStorage.getItem("theme") || "light"; } catch (_) { return "light"; } })(),
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

  populateHourSelects();

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

function populateHourSelects() {
  const allLabel = t("hour.all");
  let fromOpts = `<option value="">${allLabel}</option>`;
  let toOpts   = `<option value="">${allLabel}</option>`;
  for (let h = 0; h < 24; h++) {
    const lbl = hourLabel(h);
    fromOpts += `<option value="${h}">${lbl}</option>`;
    toOpts   += `<option value="${h}">${lbl}</option>`;
  }
  els.hourFrom.innerHTML = fromOpts;
  els.hourTo.innerHTML   = toOpts;
  els.hourFrom.value     = state.hourFrom !== null && state.hourFrom !== undefined ? String(state.hourFrom) : "";
  els.hourTo.value       = state.hourTo   !== null && state.hourTo   !== undefined ? String(state.hourTo)   : "";
}

function getHourRange() {
  const from = state.hourFrom !== "" && state.hourFrom !== null && state.hourFrom !== undefined ? Number(state.hourFrom) : null;
  const to   = state.hourTo   !== "" && state.hourTo   !== null && state.hourTo   !== undefined ? Number(state.hourTo)   : null;
  return { from, to };
}

function isHourInRange(h, from, to) {
  if (from === null && to === null) return true;
  const f = from !== null ? from : 0;
  const t = to !== null ? to : 23;
  if (f <= t) {
    return h >= f && h <= t;
  }
  // Wrap-around for overnight / night shifts (e.g. 22:00 to 06:00)
  return h >= f || h <= t;
}

function getValidHoursList() {
  const { from, to } = getHourRange();
  const list = [];
  for (let h = 0; h < 24; h++) {
    if (isHourInRange(h, from, to)) list.push(h);
  }
  return list;
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
    info.hoursQty.forEach((v, i) => { out.hoursQty[i] += v; });
    info.hoursSku.forEach((v, i) => { out.hoursSku[i] += v; });
  });

  const { from, to } = getHourRange();
  if (from === null && to === null) {
    days.forEach((day) => {
      const info = dayInfo(user, day);
      out.qty        += info.qty;
      out.uniqueSkus += info.uniqueSkus;
    });
    if (days.length > 1) out.uniqueSkus = Number(user.uniqueSkus || out.uniqueSkus);
  } else {
    let filteredQty = 0;
    let filteredSku = 0;
    for (let h = 0; h < 24; h++) {
      if (isHourInRange(h, from, to)) {
        filteredQty += out.hoursQty[h];
        filteredSku += out.hoursSku[h];
      }
    }
    out.qty        = filteredQty;
    out.uniqueSkus = filteredSku;
  }
  return out;
}

function peakHour(hours, validHours) {
  let best = 0, idx = -1;
  const list = validHours || [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  list.forEach((i) => {
    const v = hours[i] || 0;
    if (v > best) { best = v; idx = i; }
  });
  return idx === -1 ? { label: "—", value: 0 } : { label: hourLabel(idx), value: best };
}

function workedHours(hours, validHours) {
  const list = validHours || [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  return list.filter((i) => (hours[i] || 0) > 0).length;
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  if (els.themeBtn) {
    els.themeBtn.textContent = state.theme === "dark" ? "☀️" : "🌙";
  }
  try { localStorage.setItem("theme", state.theme); } catch (_) {}
}

function extractHub(user) {
  const text = (user.name || user.username || "").toUpperCase();
  const m = text.match(/^([A-Z]{3,5})/);
  return m ? m[1] : "OTHER";
}

function populateHubSelect(users) {
  if (!els.hubSelect) return;
  const hubs = new Set();
  (users || []).forEach((u) => {
    const hub = extractHub(u);
    if (hub && hub !== "OTHER") hubs.add(hub);
  });
  const current = state.hub;
  let html = `<option value="">${t("hub.all")}</option>`;
  Array.from(hubs).sort().forEach((hub) => {
    html += `<option value="${hub}" ${current === hub ? "selected" : ""}>${hub}</option>`;
  });
  els.hubSelect.innerHTML = html;
  els.hubSelect.value = current;
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
    populateHubSelect(data.users);
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
  const checkHours = getValidHoursList();

  // Find latest hour with darkstore activity
  let lastActiveHour = -1;
  const days = selectedDays();
  for (let i = checkHours.length - 1; i >= 0; i--) {
    const h = checkHours[i];
    if (state.data.users.some((u) => days.some((d) => (u.days && u.days[d]?.hoursQty?.[h] > 0)))) {
      lastActiveHour = h;
      break;
    }
  }

  let rows = state.data.users.map((u) => {
    const stats = rangeStats(u);
    const work  = workedHours(stats.hoursQty, checkHours);
    const peak  = peakHour(stats.hoursQty, checkHours);
    const uph   = work ? Math.round(stats.qty / work) : 0;
    const hub   = extractHub(u);
    const isIdle = lastActiveHour >= 0 && work > 0 && (stats.hoursQty[lastActiveHour] || 0) === 0;
    return { ...u, stats, work, uph, peak, hub, isIdle };
  }).filter((u) => u.stats.qty > 0);

  if (state.hub) {
    rows = rows.filter((u) => u.hub === state.hub);
  }

  if (state.idleOnly) {
    rows = rows.filter((u) => u.isIdle);
  }

  if (q) {
    rows = rows.filter((u) =>
      (u.username    || "").toLowerCase().includes(q) ||
      (u.name        || "").toLowerCase().includes(q) ||
      (u.displayName || "").toLowerCase().includes(q)
    );
  }

  rows.sort((a, b) => {
    if (state.sort === "uph")  return b.uph - a.uph;
    if (state.sort === "skus") return b.stats.uniqueSkus - a.stats.uniqueSkus;
    if (state.sort === "name") return (a.displayName || a.name || "").localeCompare(b.displayName || b.name || "");
    return b.stats.qty - a.stats.qty;
  });
  return rows;
}

// ─── Render Components ────────────────────────────────────────────────────────
function renderTarget(totalQty, hours) {
  if (!els.targetSection) return;
  const target = Math.max(state.target, 1);
  const pct = Math.min(Math.round((totalQty / target) * 100), 200);
  const rem = Math.max(target - totalQty, 0);

  const activeCount = (hours && hours.length) || 1;
  const pace = Math.round(totalQty / Math.max(activeCount, 1));

  els.progressBarFill.style.width = Math.min(pct, 100) + "%";
  els.targetBadge.textContent = pct + "%";
  els.targetBadge.className = "target-badge " + (pct >= 100 ? "crushed" : (pct >= 70 ? "on-track" : ""));

  els.targetProgressText.textContent = t("target.progress", { done: fmt(totalQty), target: fmt(target) });
  els.targetRemainingText.textContent = rem > 0 ? t("target.remaining", { rem: fmt(rem) }) : t("status.crushed");
  els.targetPaceText.textContent = t("target.pace", { pace: fmt(pace) });
}

function renderPodium(rows) {
  if (!els.podiumSection) return;
  if (!rows || rows.length === 0) {
    els.podiumSection.innerHTML = "";
    return;
  }

  const top3 = rows.slice(0, 3);
  const rankIcons = ["🥇", "🥈", "🥉"];
  const rankClasses = ["rank-1", "rank-2", "rank-3"];
  const rankTags = [t("podium.champion"), t("podium.runnerUp"), t("podium.third")];

  let html = top3.map((u, i) => `
    <article class="podium-card ${rankClasses[i]}" data-user="${u.username}">
      <div class="podium-top">
        <div class="podium-rank-badge">${rankIcons[i]} <span class="podium-tag">${rankTags[i]}</span></div>
        <div class="uph-badge ${u.uph >= 120 ? "uph-fast" : (u.uph >= 60 ? "uph-mid" : "uph-low")}">⚡ ${u.uph}/h</div>
      </div>
      <div class="podium-user">
        <div class="podium-name">${u.displayName || u.name}</div>
        <div class="podium-mail">${u.username}</div>
      </div>
      <div class="podium-metrics">
        <div><div class="podium-metric-val">${fmt(u.stats.qty)}</div><div class="podium-metric-lbl">Qty</div></div>
        <div><div class="podium-metric-val">${fmt(u.stats.uniqueSkus)}</div><div class="podium-metric-lbl">SKU</div></div>
        <div><div class="podium-metric-val">${u.work}h</div><div class="podium-metric-lbl">Hrs</div></div>
      </div>
    </article>
  `).join("");

  const speedDemon = [...rows].filter(u => u.work >= 2).sort((a,b) => b.uph - a.uph)[0];
  if (speedDemon && !top3.includes(speedDemon)) {
    html += `
      <article class="podium-card rank-1" data-user="${speedDemon.username}">
        <div class="podium-top">
          <div class="podium-rank-badge">⚡ <span class="podium-tag">${t("podium.speedDemon")}</span></div>
          <div class="uph-badge uph-fast">${speedDemon.uph}/h</div>
        </div>
        <div class="podium-user">
          <div class="podium-name">${speedDemon.displayName || speedDemon.name}</div>
          <div class="podium-mail">${speedDemon.username}</div>
        </div>
        <div class="podium-metrics">
          <div><div class="podium-metric-val">${fmt(speedDemon.stats.qty)}</div><div class="podium-metric-lbl">Qty</div></div>
          <div><div class="podium-metric-val">${speedDemon.uph}/h</div><div class="podium-metric-lbl">UPH</div></div>
          <div><div class="podium-metric-val">${speedDemon.work}h</div><div class="podium-metric-lbl">Hrs</div></div>
        </div>
      </article>
    `;
  }

  els.podiumSection.innerHTML = html;
}

function renderChart(rows, hours) {
  if (!els.hourlyChart) return;
  const totalsQty = Array(24).fill(0);
  rows.forEach((u) => {
    u.stats.hoursQty.forEach((v, h) => { totalsQty[h] += v; });
  });

  let maxQty = 1, peakH = -1;
  hours.forEach((h) => {
    if (totalsQty[h] > maxQty) {
      maxQty = totalsQty[h];
      peakH = h;
    }
  });

  if (els.chartPeakBadge) {
    els.chartPeakBadge.textContent = peakH >= 0 ? t("chart.peak", { h: hourLabel(peakH), v: fmt(maxQty) }) : "🔥 Peak: —";
  }

  els.hourlyChart.innerHTML = hours.map((h) => {
    const val = totalsQty[h] || 0;
    const heightPct = maxQty > 0 ? Math.max(Math.round((val / maxQty) * 100), 4) : 4;
    const isPeak = h === peakH && val > 0;
    const isSelected = state.selectedHour === h;
    return `
      <div class="chart-col" data-hour="${h}" title="${hourLabel(h)}: ${fmt(val)} units">
        <div class="chart-val">${val > 0 ? (val >= 1000 ? (val/1000).toFixed(1) + "k" : val) : ""}</div>
        <div class="chart-bar ${isPeak ? "peak" : ""} ${isSelected ? "selected" : ""}" style="height: ${heightPct}%;"></div>
        <div class="chart-hour">${hourLabel(h)}</div>
      </div>
    `;
  }).join("");
}

function renderChips() {
  const days = toArray(state.data.days);
  els.dayChips.innerHTML = days.map((d) => {
    const on = d >= state.from && d <= state.to;
    return `<button type="button" class="chip ${on ? "on" : ""}" data-day="${d}" title="${dayLabel(d)}">${dayLabel(d)}</button>`;
  }).join("");
}

function renderShiftChips() {
  if (!els.shiftChips) return;
  const shifts = [
    { id: "all",     label: t("shift.all"),     from: "",   to: ""   },
    { id: "morning", label: t("shift.morning"), from: "8",  to: "16" },
    { id: "evening", label: t("shift.evening"), from: "16", to: "23" },
    { id: "night",   label: t("shift.night"),   from: "0",  to: "7"  },
  ];

  const currentFrom = state.hourFrom !== null && state.hourFrom !== undefined ? String(state.hourFrom) : "";
  const currentTo   = state.hourTo   !== null && state.hourTo   !== undefined ? String(state.hourTo)   : "";

  let html = `<span class="shift-title">${t("shift.title")}</span>`;
  html += shifts.map((s) => {
    const on = currentFrom === s.from && currentTo === s.to;
    return `<button type="button" class="chip ${on ? "on" : ""}" data-shift="${s.id}" data-from="${s.from}" data-to="${s.to}">${s.label}</button>`;
  }).join("");

  els.shiftChips.innerHTML = html;
}

function renderKpis(rows, hours) {
  const qty = rows.reduce((s, u) => s + u.stats.qty, 0);
  const sku = rows.reduce((s, u) => s + u.stats.uniqueSkus, 0);
  let lastHour = -1;
  const hList = hours && hours.length ? hours : [];
  for (let i = hList.length - 1; i >= 0; i--) {
    const h = hList[i];
    if (rows.some((u) => (u.stats.hoursQty[h] || 0) > 0)) {
      lastHour = h;
      break;
    }
  }
  const hourQty = lastHour >= 0 ? rows.reduce((s, u) => s + (u.stats.hoursQty[lastHour] || 0), 0) : 0;
  const hourSku = lastHour >= 0 ? rows.reduce((s, u) => s + (u.stats.hoursSku[lastHour]  || 0), 0) : 0;

  const cards = [
    [t("kpi.qty.label"),                                 fmt(qty),                                       t("kpi.qty.hint"),      true ],
    [t("kpi.sku.label"),                                 fmt(sku),                                       t("kpi.sku.hint"),      false],
    [t("kpi.pickers.label"),                             fmt(rows.length),                               t("kpi.pickers.hint"),  false],
    [t("kpi.lastHour.label", { h: lastHour >= 0 ? hourLabel(lastHour) : "—" }), `${fmt(hourSku)} SKU · ${fmt(hourQty)} qty`, t("kpi.lastHour.hint"), false],
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
  const { from, to } = getHourRange();
  if (from === null && to === null) {
    let first = 24, last = -1;
    (rows || []).forEach((u) => {
      u.stats.hoursQty.forEach((v, h) => {
        if (v > 0) { if (h < first) first = h; if (h > last) last = h; }
      });
    });
    if (last < 0) return [];
    const hours = [];
    for (let h = first; h <= last; h++) hours.push(h);
    return hours;
  }

  const f = from !== null ? from : 0;
  const t = to !== null ? to : 23;
  const hours = [];
  if (f <= t) {
    for (let h = f; h <= t; h++) hours.push(h);
  } else {
    for (let h = f; h <= 23; h++) hours.push(h);
    for (let h = 0; h <= t; h++) hours.push(h);
  }
  return hours;
}

function heatClass(value, max) {
  if (!value) return "empty";
  const p = value / Math.max(max, 1);
  if (p >= 0.7)  return "hot";
  if (p >= 0.35) return "mid";
  return "low";
}

function renderTable(rows, hoursPassed) {
  const hours     = hoursPassed || activeHours(rows);
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
    <th class="sticky hrs-col" style="text-align:center;">${t("table.hrs")}</th>
    <th class="sticky uph-col" style="text-align:center;">${t("table.uph")}</th>
    ${hours.map((h) => `<th class="${state.selectedHour === h ? "picked" : ""}" data-hour="${h}">${hourLabel(h)}</th>`).join("")}
    <th class="total-col">${t("table.total")}</th>
  </tr>`;

  els.userBody.innerHTML = rows.map((u, i) => `
    <tr data-user="${u.username}" class="${u.username === state.selectedUser ? "selected" : ""}">
      <td class="sticky">${i + 1}</td>
      <td class="sticky user-col">
        <div class="user-name-line">
          <span class="user-id">${u.displayName || u.name}</span>
          ${u.isIdle ? `<span class="idle-badge"><i class="idle-dot"></i>${t("idle.tag")}</span>` : ""}
        </div>
        <div class="user-mail">${u.username}</div>
      </td>
      <td class="sticky hrs-col" style="text-align:center; font-weight:700;">${u.work}h</td>
      <td class="sticky uph-col" style="text-align:center;">
        <span class="uph-badge ${u.uph >= 120 ? "uph-fast" : (u.uph >= 60 ? "uph-mid" : "uph-low")}">⚡ ${u.uph}</span>
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
  `).join("") || `<tr><td colspan="${hours.length + 5}">${t("table.noData")}</td></tr>`;

  const sumQty = rows.reduce((s, u) => s + u.stats.qty, 0);
  const sumSku = rows.reduce((s, u) => s + u.stats.uniqueSkus, 0);
  const totalWork = rows.reduce((s, u) => s + u.work, 0);
  const avgUph = totalWork ? Math.round(sumQty / totalWork) : 0;

  els.matrixFoot.innerHTML = `<tr>
    <td class="sticky"></td>
    <td class="sticky user-col">${t("table.hourlyTotal")}</td>
    <td class="sticky hrs-col" style="text-align:center; font-weight:800;">${totalWork}h</td>
    <td class="sticky uph-col" style="text-align:center; font-weight:800;">${avgUph}/h</td>
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
  renderShiftChips();
  const rows  = visibleUsers();
  const hours = activeHours(rows);
  const totalQty = rows.reduce((s, u) => s + u.stats.qty, 0);

  renderTarget(totalQty, hours);
  renderPodium(rows);
  renderChart(rows, hours);
  renderKpis(rows, hours);
  renderTable(rows, hours);
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportExcel() {
  if (!state.data) return;
  const rows  = visibleUsers();
  const hours = activeHours(rows);
  const head  = [t("table.hash"), t("table.name"), "Username", t("table.hrs"), t("table.uph")]
    .concat(hours.flatMap((h) => [`${hourLabel(h)} qty`, `${hourLabel(h)} SKU`]))
    .concat([`${t("table.total")} qty`, `${t("table.total")} SKU`]);

  const body = rows.map((u, i) => {
    const cells = [i + 1, u.displayName || u.name, u.username, u.work, u.uph];
    hours.forEach((h) => { cells.push(u.stats.hoursQty[h] || 0); cells.push(u.stats.hoursSku[h] || 0); });
    cells.push(u.stats.qty);
    cells.push(u.stats.uniqueSkus);
    return cells;
  });

  const totals = ["", t("table.hourlyTotal"), "", "", ""];
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
  const from  = state.from.replaceAll("-", "");
  const to    = state.to.replaceAll("-", "");
  const hFrom = state.hourFrom !== "" && state.hourFrom !== null ? `${String(state.hourFrom).padStart(2, "0")}h` : "00h";
  const hTo   = state.hourTo   !== "" && state.hourTo   !== null ? `${String(state.hourTo).padStart(2, "0")}h`   : "23h";
  link.href     = URL.createObjectURL(blob);
  link.download = `picking-${from}-${to}_${hFrom}-${hTo}.xls`;
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

if (els.themeBtn) {
  els.themeBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
  });
}

if (els.tvBtn) {
  els.tvBtn.addEventListener("click", () => {
    state.tvMode = !state.tvMode;
    document.body.classList.toggle("tv-mode", state.tvMode);
    if (state.tvMode && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!state.tvMode && document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  });
}

if (els.targetInput) {
  els.targetInput.value = state.target;
  els.targetInput.addEventListener("input", (e) => {
    const val = Number(e.target.value) || 1000;
    state.target = val;
    try { localStorage.setItem("shift_target", String(val)); } catch (_) {}
    render();
  });
}

if (els.hubSelect) {
  els.hubSelect.addEventListener("change", () => {
    state.hub = els.hubSelect.value;
    render();
  });
}

if (els.idleToggleBtn) {
  els.idleToggleBtn.addEventListener("click", () => {
    state.idleOnly = !state.idleOnly;
    els.idleToggleBtn.classList.toggle("active", state.idleOnly);
    render();
  });
}

els.allDaysBtn.addEventListener("click", () => {
  if (!state.data || !state.data.days.length) return;
  state.from = state.data.days[0];
  state.to   = state.data.days[state.data.days.length - 1];
  els.dateFrom.value = state.from;
  els.dateTo.value   = state.to;
  state.selectedHour = null;
  render();
});

els.hourFrom.addEventListener("change", () => {
  state.hourFrom = els.hourFrom.value;
  state.selectedHour = null;
  render();
});

els.hourTo.addEventListener("change", () => {
  state.hourTo = els.hourTo.value;
  state.selectedHour = null;
  render();
});

els.allHoursBtn.addEventListener("click", () => {
  state.hourFrom = "";
  state.hourTo   = "";
  els.hourFrom.value = "";
  els.hourTo.value   = "";
  state.selectedHour = null;
  render();
});

if (els.shiftChips) {
  els.shiftChips.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-shift]");
    if (!btn) return;
    state.hourFrom = btn.dataset.from;
    state.hourTo   = btn.dataset.to;
    els.hourFrom.value = state.hourFrom;
    els.hourTo.value   = state.hourTo;
    state.selectedHour = null;
    render();
  });
}

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

if (els.hourlyChart) {
  els.hourlyChart.addEventListener("click", (e) => {
    const col = e.target.closest("[data-hour]");
    if (!col) return;
    const value = Number(col.dataset.hour);
    state.selectedHour = state.selectedHour === value ? null : value;
    render();
  });
}

if (els.podiumSection) {
  els.podiumSection.addEventListener("click", (e) => {
    const card = e.target.closest("[data-user]");
    if (!card) return;
    const username = card.dataset.user;
    state.selectedUser = state.selectedUser === username ? "" : username;
    render();
    const row = document.querySelector(`tr[data-user="${username}"]`);
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

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
applyTheme();
applyLang();
loadData(true);

