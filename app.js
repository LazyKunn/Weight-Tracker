(function(){
  "use strict";

  /* ---------------- Storage layer ---------------- */
  // The keys start with "peso" (Portuguese for "weight"). Don't rename them:
  // existing users would lose their saved data.
  const DB_KEY = "peso_entries_v1";
  const GOAL_KEY = "peso_goal_v1";
  const REMINDER_KEY = "peso_reminder_v1";
  const SETTINGS_KEY = "peso_settings_v1";
  const LAST_REMINDER_KEY = "peso_last_reminder_fired_v1";

  function loadEntries(){
    try{ return JSON.parse(localStorage.getItem(DB_KEY)) || []; }catch(e){ return []; }
  }
  function saveEntries(list){ localStorage.setItem(DB_KEY, JSON.stringify(list)); }

  function loadGoal(){
    try{ return JSON.parse(localStorage.getItem(GOAL_KEY)) || null; }catch(e){ return null; }
  }
  function saveGoal(v){ localStorage.setItem(GOAL_KEY, JSON.stringify(v)); }

  function loadReminder(){
    try{ return JSON.parse(localStorage.getItem(REMINDER_KEY)) || {enabled:false, day:1, time:"06:00"}; }
    catch(e){ return {enabled:false, day:1, time:"06:00"}; }
  }
  function saveReminder(v){ localStorage.setItem(REMINDER_KEY, JSON.stringify(v)); }

  function loadSettings(){
    try{ return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {name:""}; }
    catch(e){ return {name:""}; }
  }
  function saveSettings(v){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(v)); }

  let entries = loadEntries().sort((a,b)=>a.ts-b.ts);
  let goal = loadGoal();
  let reminder = loadReminder();
  let settings = loadSettings();
  let currentRange = "all";

  // Language/region used to format dates and times (en-GB = day/month/year, 24h clock)
  const LOCALE = "en-GB";

  /* ---------------- Helpers ---------------- */
  function fmtDate(ts){
    const d = new Date(ts);
    return d.toLocaleDateString(LOCALE, {day:"2-digit", month:"long", year: (d.getFullYear()!==new Date().getFullYear() ? "numeric" : undefined)});
  }
  function fmtDateShort(ts){
    const d = new Date(ts);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const y = new Date(today); y.setDate(today.getDate()-1);
    const isYesterday = d.toDateString() === y.toDateString();
    if(isToday) return "Today";
    if(isYesterday) return "Yesterday";
    return d.toLocaleDateString(LOCALE, {day:"2-digit", month:"long"});
  }
  function fmtTime(ts){
    return new Date(ts).toLocaleTimeString(LOCALE, {hour:"2-digit", minute:"2-digit"});
  }
  function toast(msg){
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._h);
    toast._h = setTimeout(()=>t.classList.remove("show"), 2200);
  }
  function round1(n){ return Math.round(n*10)/10; }

  /* ---------------- Rendering: Dashboard ---------------- */
  function renderDashboard(){
    const last = entries[entries.length-1];
    const prev = entries[entries.length-2];
    const currentWeightEl = document.getElementById("dashCurrentWeight");
    const lastUpdateEl = document.getElementById("dashLastUpdate");
    const deltaEl = document.getElementById("dashDelta");

    if(!last){
      currentWeightEl.textContent = "—";
      lastUpdateEl.textContent = "No entries yet";
      deltaEl.textContent = "—";
      deltaEl.className = "badge flat";
    } else {
      currentWeightEl.textContent = last.weight.toFixed(1);
      lastUpdateEl.textContent = `${fmtDateShort(last.ts)}, ${fmtTime(last.ts)}`;
      if(prev){
        const diff = round1(last.weight - prev.weight);
        if(diff === 0){
          deltaEl.textContent = "— 0.0 kg";
          deltaEl.className = "badge flat";
        } else if(diff > 0){
          deltaEl.textContent = `⬆ +${diff.toFixed(1)} kg`;
          deltaEl.className = "badge up";
        } else {
          deltaEl.textContent = `⬇ ${diff.toFixed(1)} kg`;
          deltaEl.className = "badge down";
        }
      } else {
        deltaEl.textContent = "First entry";
        deltaEl.className = "badge flat";
      }
    }

    renderRecent();
    renderChart();
  }

  function renderRecent(){
    const el = document.getElementById("recentList");
    const last5 = entries.slice(-5).reverse();
    if(last5.length === 0){
      el.innerHTML = `<div class="empty">Log your first weight above 👆</div>`;
      return;
    }
    el.innerHTML = last5.map(e => `
      <div class="history-item">
        <div>
          <div class="date">${fmtDateShort(e.ts)}</div>
          <div class="time">${fmtTime(e.ts)}</div>
        </div>
        <div class="w">${e.weight.toFixed(1)} kg</div>
      </div>
    `).join("");
  }

  /* ---------------- Rendering: History ---------------- */
  function renderHistory(){
    const el = document.getElementById("fullList");
    if(entries.length === 0){
      el.innerHTML = `<div class="empty">No entries yet.</div>`;
      return;
    }
    const rev = entries.slice().reverse();
    el.innerHTML = rev.map((e, idxRev) => {
      const idx = entries.length - 1 - idxRev;
      const prev = entries[idx-1];
      let diffHtml = "";
      if(prev){
        const diff = round1(e.weight - prev.weight);
        if(diff > 0) diffHtml = `<span style="color:var(--red); font-size:12px;">⬆ +${diff.toFixed(1)}</span>`;
        else if(diff < 0) diffHtml = `<span style="color:var(--green); font-size:12px;">⬇ ${diff.toFixed(1)}</span>`;
        else diffHtml = `<span style="color:var(--text-dim); font-size:12px;">0.0</span>`;
      }
      return `
        <div class="history-item">
          <div>
            <div class="date">${fmtDateShort(e.ts)}</div>
            <div class="time">${fmtTime(e.ts)}</div>
          </div>
          <div class="right">
            <div>
              <div class="w">${e.weight.toFixed(1)} kg</div>
              ${diffHtml}
            </div>
            <button class="del-btn" data-id="${e.id}" aria-label="Delete">✕</button>
          </div>
        </div>
      `;
    }).join("");

    el.querySelectorAll(".del-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.getAttribute("data-id");
        entries = entries.filter(e=>String(e.id) !== id);
        saveEntries(entries);
        renderAll();
        toast("Entry deleted");
      });
    });
  }

  /* ---------------- Chart ---------------- */
  let chartInstance = null;
  function filterByRange(list, range){
    if(range === "all") return list;
    const now = Date.now();
    const days = range === "1m" ? 30 : 90;
    const cutoff = now - days*24*60*60*1000;
    return list.filter(e=>e.ts >= cutoff);
  }

  function renderChart(){
    const ctx = document.getElementById("chart");
    const filtered = filterByRange(entries, currentRange);
    const labels = filtered.map(e => new Date(e.ts).toLocaleDateString(LOCALE, {day:"2-digit", month:"2-digit"}));
    const data = filtered.map(e => e.weight);

    const datasets = [{
      label: "Weight",
      data,
      borderColor: "#34D399",
      backgroundColor: "rgba(52,211,153,0.12)",
      pointRadius: filtered.length > 40 ? 0 : 3,
      pointBackgroundColor: "#34D399",
      tension: 0.35,
      fill: true,
      borderWidth: 2
    }];

    if(goal && goal.target && filtered.length){
      datasets.push({
        label: "Goal",
        data: filtered.map(()=>goal.target),
        borderColor: "#8B9490",
        borderDash: [6,5],
        pointRadius: 0,
        fill: false,
        borderWidth: 1.5
      });
    }

    if(chartInstance){ chartInstance.destroy(); }

    if(typeof Chart === "undefined"){
      ctx.style.display = "none";
      let warn = document.getElementById("chartLoadWarning");
      if(!warn){
        warn = document.createElement("div");
        warn.id = "chartLoadWarning";
        warn.className = "note warn";
        warn.textContent = "Couldn't load the chart library right now (it needs internet the first time you open the app, or it may be down). Your entries are still saved, and the chart will appear as soon as the app can load the library.";
        ctx.parentNode.insertBefore(warn, ctx);
      }
      return;
    } else {
      const warn = document.getElementById("chartLoadWarning");
      if(warn) warn.remove();
      ctx.style.display = "";
    }

    chartInstance = new Chart(ctx, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1B211F",
            titleColor: "#EDEDED",
            bodyColor: "#EDEDED",
            borderColor: "#262B29",
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { display:false }, ticks: { color:"#8B9490", maxRotation:0, autoSkip:true, maxTicksLimit:5 } },
          y: { grid: { color:"#1B211F" }, ticks: { color:"#8B9490" } }
        }
      }
    });
  }

  document.querySelectorAll(".chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      currentRange = chip.getAttribute("data-range");
      renderChart();
    });
  });

  /* ---------------- Register weight ---------------- */
  document.getElementById("registerBtn").addEventListener("click", ()=>{
    const input = document.getElementById("weightInput");
    const val = parseFloat((input.value || "").replace(",", "."));
    if(isNaN(val) || val <= 0 || val > 500){
      toast("Enter a valid weight");
      return;
    }
    entries.push({ id: Date.now(), weight: round1(val), ts: Date.now() });
    entries.sort((a,b)=>a.ts-b.ts);
    saveEntries(entries);
    input.value = "";
    renderAll();
    toast("Weight logged ✓");
  });
  document.getElementById("weightInput").addEventListener("keydown", (e)=>{
    if(e.key === "Enter") document.getElementById("registerBtn").click();
  });

  /* ---------------- Goals ---------------- */
  function renderGoal(){
    const targetEl = document.getElementById("goalCurrentTarget");
    const remainingEl = document.getElementById("goalRemaining");
    if(!goal || !goal.target){
      targetEl.textContent = "—";
      remainingEl.textContent = "Set a goal";
      remainingEl.className = "badge flat";
      return;
    }
    targetEl.textContent = goal.target.toFixed(1);
    const last = entries[entries.length-1];
    if(last){
      const diff = round1(last.weight - goal.target);
      if(diff <= 0){
        remainingEl.textContent = "Goal reached 🎉";
        remainingEl.className = "badge down";
      } else {
        remainingEl.textContent = `${diff.toFixed(1)} kg to go`;
        remainingEl.className = "badge flat";
      }
    } else {
      remainingEl.textContent = "No entries yet";
      remainingEl.className = "badge flat";
    }
  }
  document.getElementById("goalSaveBtn").addEventListener("click", ()=>{
    const input = document.getElementById("goalInput");
    const val = parseFloat((input.value || "").replace(",", "."));
    if(isNaN(val) || val <= 0 || val > 500){
      toast("Enter a valid goal");
      return;
    }
    goal = { target: round1(val) };
    saveGoal(goal);
    input.value = "";
    renderGoal();
    renderChart();
    toast("Goal saved ✓");
  });

  /* ---------------- Reminder ---------------- */
  function renderReminder(){
    document.getElementById("reminderToggle").checked = !!reminder.enabled;
    document.getElementById("reminderTime").value = reminder.time || "06:00";
    document.querySelectorAll(".day-btn").forEach(b=>{
      b.classList.toggle("active", Number(b.getAttribute("data-day")) === reminder.day);
    });
    updateNotifStatus();
  }
  function updateNotifStatus(){
    const statusEl = document.getElementById("notifStatus");
    const btn = document.getElementById("notifPermBtn");
    if(!("Notification" in window)){
      statusEl.textContent = "Your browser doesn't support notifications. You'll see an in-app message at the chosen time if the app is open.";
      btn.style.display = "none";
      return;
    }
    if(Notification.permission === "granted"){
      statusEl.textContent = "Notifications enabled ✓";
      btn.style.display = "none";
    } else if(Notification.permission === "denied"){
      statusEl.textContent = "Notifications are blocked in your phone settings. You'll see an in-app message instead.";
      btn.style.display = "none";
    } else {
      statusEl.textContent = "Notifications not enabled yet.";
      btn.style.display = "block";
    }
  }
  document.getElementById("notifPermBtn").addEventListener("click", async ()=>{
    if(!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    updateNotifStatus();
    if(perm === "granted") toast("Notifications enabled ✓");
  });
  document.getElementById("reminderToggle").addEventListener("change", (e)=>{
    reminder.enabled = e.target.checked;
    saveReminder(reminder);
  });
  document.getElementById("reminderTime").addEventListener("change", (e)=>{
    reminder.time = e.target.value;
    saveReminder(reminder);
  });
  document.querySelectorAll(".day-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      reminder.day = Number(btn.getAttribute("data-day"));
      saveReminder(reminder);
      renderReminder();
    });
  });

  function checkReminder(){
    if(!reminder.enabled) return;
    const now = new Date();
    if(now.getDay() !== reminder.day) return;
    const [h,m] = (reminder.time || "06:00").split(":").map(Number);
    const target = new Date(now); target.setHours(h, m, 0, 0);
    const diffMs = now - target;
    // fire if we are within [0, 30 min] after the chosen time, once per day
    if(diffMs >= 0 && diffMs <= 30*60*1000){
      const todayKey = now.toDateString();
      const lastFired = localStorage.getItem(LAST_REMINDER_KEY);
      if(lastFired === todayKey) return;
      localStorage.setItem(LAST_REMINDER_KEY, todayKey);
      fireReminder();
    }
  }
  function fireReminder(){
    if("Notification" in window && Notification.permission === "granted" && navigator.serviceWorker && navigator.serviceWorker.controller){
      navigator.serviceWorker.controller.postMessage({type:"SHOW_REMINDER"});
    } else if("Notification" in window && Notification.permission === "granted"){
      new Notification("Time to weigh in ⚖️", { body:"Open the app and log today's weight.", icon:"icon-192.png" });
    } else {
      toast("Reminder: today is weigh-in day ⚖️");
    }
  }
  setInterval(checkReminder, 60*1000);

  /* ---------------- Settings ---------------- */
  function renderSettings(){
    document.getElementById("nameInput").value = settings.name || "";
    updateGreeting();
  }
  document.getElementById("nameSaveBtn").addEventListener("click", ()=>{
    settings.name = document.getElementById("nameInput").value.trim();
    saveSettings(settings);
    updateGreeting();
    toast("Name saved ✓");
  });
  function updateGreeting(){
    const h1 = document.getElementById("topTitle");
    const eyebrow = document.getElementById("topEyebrow");
    if(currentView === "dashboard"){
      eyebrow.textContent = settings.name ? `Hi, ${settings.name}` : "Welcome";
      h1.textContent = "Your progress";
    }
  }

  document.getElementById("clearBtn").addEventListener("click", ()=>{
    if(!confirm("Delete ALL data (entries, goal, settings)? This can't be undone.")) return;
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(GOAL_KEY);
    localStorage.removeItem(REMINDER_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(LAST_REMINDER_KEY);
    entries = []; goal = null; reminder = {enabled:false, day:1, time:"06:00"}; settings = {name:""};
    renderAll();
    toast("Data deleted");
  });

  /* ---------------- Import CSV ---------------- */
  function parseCsvToEntries(text){
    const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length);
    // remove the header row if present (accepts the new English header and the old Portuguese one)
    if(lines.length && /(date|data).*(time|hora).*(weight|peso)/i.test(lines[0])) lines.shift();
    const imported = [];
    lines.forEach(line=>{
      const parts = line.split(",");
      if(parts.length < 3) return;
      const [dateStr, timeStr, weightStr] = parts;
      const dateBits = (dateStr || "").split("/").map(Number);
      const timeBits = (timeStr || "").split(":").map(Number);
      if(dateBits.length < 3) return;
      const [d, m, y] = dateBits;
      const [hh, mm] = [timeBits[0] || 0, timeBits[1] || 0];
      const weight = parseFloat(String(weightStr).replace(",", "."));
      if(!d || !m || !y || isNaN(weight) || weight <= 0 || weight > 500) return;
      const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
      if(isNaN(dt.getTime())) return;
      imported.push({ ts: dt.getTime(), weight: round1(weight) });
    });
    return imported;
  }

  document.getElementById("importBtn").addEventListener("click", ()=>{
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imported = parseCsvToEntries(String(reader.result));
      e.target.value = "";
      if(imported.length === 0){
        toast("No valid entries found in that file");
        return;
      }
      const existingKeys = new Set(entries.map(en => en.ts + "_" + en.weight.toFixed(1)));
      let added = 0;
      imported.forEach(im => {
        const key = im.ts + "_" + im.weight.toFixed(1);
        if(existingKeys.has(key)) return; // already exists, skip duplicate
        existingKeys.add(key);
        entries.push({ id: im.ts + "_" + Math.random().toString(36).slice(2), weight: im.weight, ts: im.ts });
        added++;
      });
      entries.sort((a,b)=>a.ts-b.ts);
      saveEntries(entries);
      renderAll();
      if(added > 0) toast(`${added} entr${added>1?"ies":"y"} imported ✓`);
      else toast("All those entries were already saved");
    };
    reader.onerror = () => toast("Couldn't read that file");
    reader.readAsText(file);
  });

  /* ---------------- Export CSV ---------------- */
  document.getElementById("exportBtn").addEventListener("click", async ()=>{
    if(entries.length === 0){ toast("No entries to export yet"); return; }
    // Date format is day/month/year, the same format the importer expects
    let csv = "Date,Time,Weight (kg)\n";
    entries.forEach(e=>{
      const d = new Date(e.ts);
      const dateStr = d.toLocaleDateString(LOCALE);
      const timeStr = d.toLocaleTimeString(LOCALE, {hour:"2-digit", minute:"2-digit"});
      csv += `${dateStr},${timeStr},${e.weight.toFixed(1)}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const file = new File([blob], "weight-history.csv", { type: "text/csv" });

    if(navigator.canShare && navigator.canShare({ files: [file] })){
      try{
        await navigator.share({ files: [file], title: "Weight history", text: "My weight history" });
        return;
      }catch(err){ /* user cancelled or it failed -> fall back to download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "weight-history.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("CSV downloaded ✓");
  });

  /* ---------------- Install prompt ---------------- */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById("installBtn").style.display = "block";
    document.getElementById("installNote").textContent = "Install the app to always have it at hand, like any other app.";
  });
  document.getElementById("installBtn").addEventListener("click", async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    document.getElementById("installBtn").style.display = "none";
  });

  /* ---------------- Tab navigation ---------------- */
  let currentView = "dashboard";
  const titles = {
    dashboard: { eyebrow: "Today", title: "Your progress" },
    history: { eyebrow: "Full log", title: "Weight history" },
    goals: { eyebrow: "Plan and habits", title: "Your goals" },
    settings: { eyebrow: "Your app", title: "Settings" }
  };
  function setView(view){
    currentView = view;
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    document.getElementById("view-" + view).classList.add("active");
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("active", b.getAttribute("data-view") === view));
    const t = titles[view];
    document.getElementById("topEyebrow").textContent = t.eyebrow;
    document.getElementById("topTitle").textContent = t.title;
    if(view === "dashboard") updateGreeting();
    if(view === "history") renderHistory();
    window.scrollTo(0,0);
  }
  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=> setView(btn.getAttribute("data-view")));
  });
  document.getElementById("goHistoryLink").addEventListener("click", ()=> setView("history"));

  /* ---------------- App version ---------------- */
  // version.json is created automatically by GitHub Actions on every deploy
  // (see .github/workflows/deploy.yml). When running locally it doesn't exist,
  // so the default text ("local version") stays.
  const REPO_URL = "https://github.com/LazyKunn/Weight-Tracker";

  async function loadVersion(){
    const el = document.getElementById("appVersion");
    try{
      const res = await fetch("version.json", { cache: "no-store" });
      if(!res.ok) return;
      const info = await res.json();
      // only accept a real commit hash (letters a-f and numbers)
      if(!/^[0-9a-f]{7,40}$/.test(info.commit || "")) return;

      const link = document.createElement("a");
      link.href = `${REPO_URL}/commit/${info.commit}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = info.short || info.commit.slice(0, 7);
      link.style.color = "var(--green)";

      const date = new Date(info.date);
      const dateText = isNaN(date) ? "" : " · " + date.toLocaleDateString(LOCALE, {day:"numeric", month:"short", year:"numeric"});

      el.textContent = "version ";
      el.appendChild(link);
      el.appendChild(document.createTextNode(dateText));
    }catch(e){ /* offline or no version.json: keep the default text */ }
  }

  /* ---------------- Init ---------------- */
  function renderAll(){
    renderDashboard();
    renderHistory();
    renderGoal();
    renderReminder();
    renderSettings();
  }

  if(goal) document.getElementById("goalInput").placeholder = `Current goal: ${goal.target.toFixed(1)} kg`;

  renderAll();
  checkReminder();
  loadVersion();

  if("serviceWorker" in navigator){
    window.addEventListener("load", ()=>{
      navigator.serviceWorker.register("sw.js").catch(()=>{});
    });
  }
})();