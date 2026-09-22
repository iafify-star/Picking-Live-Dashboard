const REFRESH_SEC = 60;

const els = {
  livePill: document.getElementById("livePill"),
  liveText: document.getElementById("liveText"),
  metaLine: document.getElementById("metaLine"),
  refreshBtn: document.getElementById("refreshBtn"),
  dateFrom: document.getElementById("dateFrom"),
  dateTo: document.getElementById("dateTo"),
  allDaysBtn: document.getElementById("allDaysBtn"),
  dayChips: document.getElementById("dayChips"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  countdown: document.getElementById("countdown"),
  kpis: document.getElementById("kpis"),
  exportBtn: document.getElementById("exportBtn"),
  userCount: document.getElementById("userCount"),
  matrixHead: document.getElementById("matrixHead"),
  matrixFoot: document.getElementById("matrixFoot"),
  userBody: document.getElementById("userBody"),
};

const state = {
  data: null,
  from: "",
  to: "",
  selectedUser: "",
  selectedHour: null,
  search: "",
  sort: "qty",
  left: REFRESH_SEC,
};

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
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function hourLabel(h) {
  return String(h).padStart(2, "0") + ":00";
}

function selectedDays() {
  const days = toArray(state.data && state.data.days);
  return days.filter((d) => d >= state.from && d <= state.to);
}

function rangeLabel() {
  const days = selectedDays();
  if (!days.length) return "لا يوجد تاريخ";
  if (days.length === 1) return dayLabel(days[0]);
  return `${dayLabel(days[0])} → ${dayLabel(days[days.length - 1])}`;
}

function emptyHours() {
  return { qty: 0, uniqueSkus: 0, hoursQty: Array(24).fill(0), hoursSku: Array(24).fill(0) };
}

function dayInfo(user, day) {
  const info = user.days && user.days[day];
  if (!info) return emptyHours();
  return {
    qty: Number(info.qty || info.total || 0),
    uniqueSkus: Number(info.uniqueSkus || 0),
    hoursQty: padHours(info.hoursQty || info.hours),
    hoursSku: padHours(info.hoursSku),
  };
}

function rangeStats(user) {
  const days = selectedDays();
  const out = emptyHours();
  days.forEach((day) => {
    const info = dayInfo(user, day);
    out.qty += info.qty;
    out.uniqueSkus += info.uniqueSkus;
    info.hoursQty.forEach((v, i) => { out.hoursQty[i] += v; });
    info.hoursSku.forEach((v, i) => { out.hoursSku[i] += v; });
  });
  if (days.length > 1) {
    out.uniqueSkus = Number(user.uniqueSkus || out.uniqueSkus);
  }
  return out;
}

function peakHour(hours) {
  let best = 0;
  let idx = -1;
  hours.forEach((v, i) => {
    if (v > best) {
      best = v;
      idx = i;
    }
  });
  return idx === -1 ? { label: "—", value: 0 } : { label: hourLabel(idx), value: best };
}

function workedHours(hours) {
  return hours.filter((v) => v > 0).length;
}

async function loadData(fresh) {
  els.liveText.textContent = "SYNC";
  els.refreshBtn.disabled = true;
  try {
    const res = await fetch("/api/data" + (fresh ? "?fresh=1" : ""), { cache: "no-store" });
    const data = await res.json();
    if (data.loading) {
      els.liveText.textContent = "SYNC";
      els.metaLine.textContent = "بيسحب السحبة من الشيت... استنى لحظة";
      state.left = 3;
      return;
    }
    if (!data.ok) throw new Error(data.error || "فشل السحب");
    data.users = toArray(data.users);
    data.days = toArray(data.days);
    state.data = data;
    const last = data.days[data.days.length - 1] || "";
    const first = data.days[0] || last;
    if (!state.from || !data.days.includes(state.from)) state.from = last;
    if (!state.to || !data.days.includes(state.to)) state.to = last;
    els.dateFrom.min = first;
    els.dateFrom.max = last;
    els.dateTo.min = first;
    els.dateTo.max = last;
    els.dateFrom.value = state.from;
    els.dateTo.value = state.to;
    render();
    const when = new Date(data.fetchedAt);
    els.metaLine.textContent = `آخر سحب: ${when.toLocaleTimeString("ar-EG")} · ${fmt(data.totalPicks)} كمية · ${fmt(data.uniqueSkus)} SKU`;
    els.livePill.classList.remove("err");
    els.liveText.textContent = "LIVE";
    state.left = REFRESH_SEC;
  } catch (err) {
    els.livePill.classList.add("err");
    els.liveText.textContent = "OFF";
    els.metaLine.textContent = "مش قادر أقرأ الشيت: " + err.message;
  } finally {
    els.refreshBtn.disabled = false;
  }
}

function applyDates() {
  if (!state.data) return;
  let from = els.dateFrom.value;
  let to = els.dateTo.value;
  if (from && to && from > to) {
    const swap = from;
    from = to;
    to = swap;
    els.dateFrom.value = from;
    els.dateTo.value = to;
  }
  state.from = from;
  state.to = to;
  state.selectedHour = null;
  render();
}

function visibleUsers() {
  const q = state.search.trim().toLowerCase();
  let rows = state.data.users.map((u) => {
    const stats = rangeStats(u);
    const work = workedHours(stats.hoursQty);
    const peak = peakHour(stats.hoursQty);
    return {
      ...u,
      stats,
      work,
      uph: work ? Math.round(stats.qty / work) : 0,
      peak,
    };
  }).filter((u) => u.stats.qty > 0);

  if (q) {
    rows = rows.filter((u) =>
      (u.username || "").toLowerCase().includes(q) ||
      (u.name || "").toLowerCase().includes(q)
    );
  }

  rows.sort((a, b) => {
    if (state.sort === "skus") return b.stats.uniqueSkus - a.stats.uniqueSkus;
    if (state.sort === "name") return (a.name || "").localeCompare(b.name || "");
    return b.stats.qty - a.stats.qty;
  });
  return rows;
}

function renderChips() {
  const days = toArray(state.data.days);
  els.dayChips.innerHTML = days.map((d) => {
    const on = d >= state.from && d <= state.to;
    return `<button type="button" class="chip ${on ? "on" : ""}" data-day="${d}">${dayLabel(d)}</button>`;
  }).join("");
}

function renderKpis(rows) {
  const qty = rows.reduce((s, u) => s + u.stats.qty, 0);
  const sku = rows.reduce((s, u) => s + u.stats.uniqueSkus, 0);
  let lastHour = 0;
  for (let h = 23; h >= 0; h--) {
    if (rows.some((u) => u.stats.hoursQty[h] > 0)) {
      lastHour = h;
      break;
    }
  }
  const hourQty = rows.reduce((s, u) => s + (u.stats.hoursQty[lastHour] || 0), 0);
  const hourSku = rows.reduce((s, u) => s + (u.stats.hoursSku[lastHour] || 0), 0);
  const cards = [
    ["الكمية في الفترة", fmt(qty), true],
    ["عدد SKU", fmt(sku), false],
    ["بيكرز شغالين", fmt(rows.length), false],
    [`آخر ساعة ${hourLabel(lastHour)}`, `${fmt(hourSku)} SKU · ${fmt(hourQty)} كمية`, false],
  ];
  els.kpis.innerHTML = cards.map(([label, value, gold]) => `
    <article class="kpi ${gold ? "gold" : ""}">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
    </article>
  `).join("");
}

function activeHours(rows) {
  let first = 24;
  let last = -1;
  rows.forEach((u) => {
    u.stats.hoursQty.forEach((v, h) => {
      if (v > 0) {
        if (h < first) first = h;
        if (h > last) last = h;
      }
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
  if (p >= 0.7) return "hot";
  if (p >= 0.35) return "mid";
  return "low";
}

function renderTable(rows) {
  const hours = activeHours(rows);
  const totalsQty = Array(24).fill(0);
  const totalsSku = Array(24).fill(0);
  let maxCell = 1;
  rows.forEach((u) => {
    u.stats.hoursQty.forEach((v, h) => {
      totalsQty[h] += v;
      if (v > maxCell) maxCell = v;
    });
    u.stats.hoursSku.forEach((v, h) => { totalsSku[h] += v; });
  });

  els.userCount.textContent = rows.length;

  els.matrixHead.innerHTML = `<tr>
    <th class="sticky">#</th>
    <th class="sticky user-col">اليوزر</th>
    ${hours.map((h) => `<th class="${state.selectedHour === h ? "picked" : ""}" data-hour="${h}">${hourLabel(h)}</th>`).join("")}
    <th class="total-col">الإجمالي</th>
  </tr>`;

  els.userBody.innerHTML = rows.map((u, i) => `
    <tr data-user="${u.username}" class="${u.username === state.selectedUser ? "selected" : ""}">
      <td class="sticky">${i + 1}</td>
      <td class="sticky user-col">
        <div class="user-id">${u.name}</div>
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
  `).join("") || `<tr><td colspan="${hours.length + 3}">مفيش بيك في التاريخ ده</td></tr>`;

  const sumQty = rows.reduce((s, u) => s + u.stats.qty, 0);
  const sumSku = rows.reduce((s, u) => s + u.stats.uniqueSkus, 0);
  els.matrixFoot.innerHTML = `<tr>
    <td class="sticky"></td>
    <td class="sticky user-col">إجمالي الساعة</td>
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

function exportExcel() {
  if (!state.data) return;
  const rows = visibleUsers();
  const hours = activeHours(rows);
  const head = ["#", "اليوزر", "الإيميل"]
    .concat(hours.flatMap((h) => [`${hourLabel(h)} كمية`, `${hourLabel(h)} SKU`]))
    .concat(["الإجمالي كمية", "الإجمالي SKU"]);

  const body = rows.map((u, i) => {
    const cells = [i + 1, u.name, u.username];
    hours.forEach((h) => {
      cells.push(u.stats.hoursQty[h] || 0);
      cells.push(u.stats.hoursSku[h] || 0);
    });
    cells.push(u.stats.qty);
    cells.push(u.stats.uniqueSkus);
    return cells;
  });

  const totals = ["", "إجمالي الساعة", ""];
  hours.forEach((h) => {
    totals.push(rows.reduce((s, u) => s + (u.stats.hoursQty[h] || 0), 0));
    totals.push(rows.reduce((s, u) => s + (u.stats.hoursSku[h] || 0), 0));
  });
  totals.push(rows.reduce((s, u) => s + u.stats.qty, 0));
  totals.push(rows.reduce((s, u) => s + u.stats.uniqueSkus, 0));

  const tableRows = [head, ...body, totals].map((line) =>
    `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
  ).join("");

  const html = `<html><head><meta charset="UTF-8"></head><body>
    <table border="1">${tableRows}</table>
    <p>تم التصميم بواسطة إبراهيم عفيفي</p>
  </body></html>`;

  const blob = new Blob(["\uFEFF" + html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const link = document.createElement("a");
  const from = state.from.replaceAll("-", "");
  const to = state.to.replaceAll("-", "");
  link.href = URL.createObjectURL(blob);
  link.download = `picking-${from}-${to}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

els.refreshBtn.addEventListener("click", () => loadData(true));
els.exportBtn.addEventListener("click", exportExcel);
els.dateFrom.addEventListener("change", applyDates);
els.dateTo.addEventListener("change", applyDates);
els.allDaysBtn.addEventListener("click", () => {
  if (!state.data || !state.data.days.length) return;
  state.from = state.data.days[0];
  state.to = state.data.days[state.data.days.length - 1];
  els.dateFrom.value = state.from;
  els.dateTo.value = state.to;
  state.selectedHour = null;
  render();
});
els.dayChips.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-day]");
  if (!btn) return;
  state.from = btn.dataset.day;
  state.to = btn.dataset.day;
  els.dateFrom.value = state.from;
  els.dateTo.value = state.to;
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

setInterval(() => {
  state.left -= 1;
  if (state.left <= 0) {
    loadData(true);
  } else {
    els.countdown.textContent = `تحديث بعد ${state.left}ث`;
  }
}, 1000);

loadData(true);
