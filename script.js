// Configure your real links here
const LINKS = {
  voly: "https://secure.voly.co.uk/?r=T",
  sms: "http://192.168.13.31/mvc/Dashboard/Overview",
  idea: "http://192.168.13.31/login.aspx?ReturnUrl=%2fmvc%2fDashboard%2fOverview",
  pinpoint: "https://app.pinpointworks.com/#/site/a7205047dfb6e7a99a6f5da172c7fef7",
  ptw: "pages/permit-to-work.html",
  procedures: "file://S:/Engineering/Admin/Procedures%20Master%20File",
  manuals: "pages/manuals.html",
  contacts: "pages/contacts.html",
  personnel: "pages/personnel.html",
  rotations: "pages/rotations.html",
  suggestion: "https://your-username.github.io/mj2-suggestion-box", // Update this URL when you deploy the Suggestion Box
};

function applyLinks() {
  const map = [
    ["link-voly", LINKS.voly],
    ["link-sms", LINKS.sms],
    ["link-idea", LINKS.idea],
    ["link-pinpoint", LINKS.pinpoint],
    ["link-ptw", LINKS.ptw],
    ["link-procedures", LINKS.procedures],
    ["link-manuals", LINKS.manuals],
    ["link-contacts", LINKS.contacts],
    ["link-personnel", LINKS.personnel],
    ["link-rotations", LINKS.rotations],
    ["link-suggestion", LINKS.suggestion],
    ["ring-voly", LINKS.voly],
    ["ring-sms", LINKS.sms],
    ["ring-idea", LINKS.idea],
    ["ring-pinpoint", LINKS.pinpoint],
    ["ring-ptw", LINKS.ptw],
    ["ring-procedures", LINKS.procedures],
    ["ring-manuals", LINKS.manuals],
    ["ring-contacts", LINKS.contacts],
    ["ring-personnel", LINKS.personnel],
    ["ring-rotations", LINKS.rotations],
    ["ring-suggestion", LINKS.suggestion],
  ];

  for (const [id, href] of map) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (href && href !== "#") el.href = href;
    else {
      el.setAttribute("aria-disabled", "true");
      el.classList.add("disabled");
      el.href = "#";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Link not configured yet.");
      });
    }
  }
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  applyLinks();
  setYear();
  resolveLogoSource();
  initEngineWidget();
});

function resolveLogoSource() {
  const imgEl = document.querySelector(".ring-logo");
  if (!imgEl) return;
  const candidates = [
    "./assets/mjii-logo.png",
    "./assets/mjii-logo.jpg",
    "./assets/mjii-logo.jpeg",
    "./assets/mjii-logo.svg",
    "./assets/mjii-logo.webp",
  ];

  let resolved = false;
  candidates.forEach((src) => {
    if (resolved) return;
    const test = new Image();
    test.onload = () => {
      if (resolved) return;
      resolved = true;
      imgEl.src = src;
    };
    test.onerror = () => {};
    test.src = src;
  });
}

// Engine widget logic
const ENGINE_STORAGE_KEY = "engine_last_started_iso";
const ENGINE_INTERVAL_DAYS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const NOTIFY_STORAGE_KEY = "engine_last_notified_ymd";
const EMAIL_SERVICE_URL = "http://localhost:8787/send"; // change if deployed
const DEFAULT_RECIPIENTS = ["tobysauze@hotmail.com"]; // notification recipients

function initEngineWidget() {
  const widget = document.createElement("aside");
  widget.className = "engine-widget";
  widget.innerHTML = `
    <h3>Engines</h3>
    <div class="engine-meta">Due every ${ENGINE_INTERVAL_DAYS} days</div>
    <div class="engine-status" id="engine-status" aria-live="polite">Loading…</div>
    <div class="engine-meta" id="engine-last">Last started: —</div>
    <div class="engine-meta" id="engine-next">Next due: —</div>
    <div class="engine-actions">
      <button class="engine-btn" id="engine-start-btn" type="button">Engine Started</button>
      <button class="engine-btn" id="engine-test-btn" type="button">Send Test Email</button>
    </div>
    <div class="engine-meta" id="engine-test-result"></div>
  `;
  document.body.appendChild(widget);

  const startBtn = widget.querySelector("#engine-start-btn");
  startBtn.addEventListener("click", () => {
    const nowIso = new Date().toISOString();
    try { localStorage.setItem(ENGINE_STORAGE_KEY, nowIso); } catch (_) {}
    renderEngineState(widget, new Date(nowIso));
  });

  const testBtn = widget.querySelector("#engine-test-btn");
  const testResultEl = widget.querySelector("#engine-test-result");
  testBtn.addEventListener("click", async () => {
    testBtn.disabled = true;
    testResultEl.textContent = "Sending test email…";
    let iso = null;
    try { iso = localStorage.getItem(ENGINE_STORAGE_KEY); } catch (_) {}
    const last = iso ? new Date(iso) : new Date();
    const nextDue = new Date(last.getTime() + ENGINE_INTERVAL_DAYS * DAY_MS);
    const ok = await sendEmail({
      to: DEFAULT_RECIPIENTS,
      subject: `MJII: Test engine due email (${ymd(new Date())})`,
      text: `This is a test message from the MJII Operations Hub.\n\nLast started: ${formatDateTime(last)}\nNext due: ${formatDateTime(nextDue)}\n\nIf you received this, email notifications are working.`,
    });
    testResultEl.textContent = ok ? "Test email sent." : "Failed to send test email (check server SMTP settings).";
    testBtn.disabled = false;
  });

  // Initial render from storage
  let lastIso = null;
  try { lastIso = localStorage.getItem(ENGINE_STORAGE_KEY); } catch (_) {}
  const lastDate = lastIso ? new Date(lastIso) : null;
  renderEngineState(widget, lastDate);

  // Optional: update status every minute
  setInterval(() => {
    let iso = null;
    try { iso = localStorage.getItem(ENGINE_STORAGE_KEY); } catch (_) {}
    const d = iso ? new Date(iso) : null;
    renderEngineState(widget, d, { silent: true });
    maybeSendDueEmail(d);
  }, 60 * 1000);

  // Also check once on load
  maybeSendDueEmail(lastDate);
}

function renderEngineState(widget, lastDate, opts = {}) {
  const statusEl = widget.querySelector("#engine-status");
  const lastEl = widget.querySelector("#engine-last");
  const nextEl = widget.querySelector("#engine-next");

  if (!lastDate || Number.isNaN(lastDate.getTime())) {
    statusEl.textContent = "No record yet";
    statusEl.className = "engine-status due-soon";
    lastEl.textContent = "Last started: —";
    nextEl.textContent = `Next due: when recorded (every ${ENGINE_INTERVAL_DAYS} days)`;
    return;
  }

  const nextDue = new Date(lastDate.getTime() + ENGINE_INTERVAL_DAYS * DAY_MS);
  const now = new Date();
  const remainingMs = nextDue.getTime() - now.getTime();

  const formattedLast = formatDateTime(lastDate);
  const formattedNext = formatDateTime(nextDue);
  lastEl.textContent = `Last started: ${formattedLast}`;
  nextEl.textContent = `Next due: ${formattedNext} (${formatDistance(remainingMs)})`;

  statusEl.className = "engine-status";
  if (remainingMs <= 0) {
    statusEl.textContent = `Overdue by ${formatDistance(remainingMs)}`;
    statusEl.classList.add("overdue");
  } else if (remainingMs < DAY_MS) {
    statusEl.textContent = `Due soon (${formatDistance(remainingMs)} remaining)`;
    statusEl.classList.add("due-soon");
  } else {
    statusEl.textContent = "OK";
    statusEl.classList.add("ok");
  }
}

function formatDateTime(d) {
  try {
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d.toISOString();
  }
}

function formatDistance(ms) {
  const abs = Math.abs(ms);
  const days = Math.floor(abs / DAY_MS);
  const hours = Math.floor((abs % DAY_MS) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.max(1, Math.floor((abs % (60 * 60 * 1000)) / (60 * 1000)));
  return `${hours}h ${minutes}m`;
}

function ymd(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function maybeSendDueEmail(lastDate) {
  if (!lastDate || Number.isNaN(lastDate.getTime())) return;
  const nextDue = new Date(lastDate.getTime() + ENGINE_INTERVAL_DAYS * DAY_MS);
  const todayYmd = ymd(new Date());
  const dueYmd = ymd(nextDue);

  if (todayYmd !== dueYmd) return; // only on the due day

  let lastNotified = null;
  try { lastNotified = localStorage.getItem(NOTIFY_STORAGE_KEY); } catch (_) {}
  if (lastNotified === todayYmd) return; // already notified today

  try {
    const subject = `MJII: Engine start due today (${todayYmd})`;
    const text = `Reminder: Engines should be started every ${ENGINE_INTERVAL_DAYS} days.\nLast started: ${formatDateTime(lastDate)}\nNext due: ${formatDateTime(nextDue)}\n\nThis is an automated reminder from the MJII Operations Hub.`;
    await sendEmail({ to: DEFAULT_RECIPIENTS, subject, text });
    try { localStorage.setItem(NOTIFY_STORAGE_KEY, todayYmd); } catch (_) {}
  } catch (err) {
    // Silent failure; could add UI indicator if desired
    console.warn("Email notification failed", err);
  }
}

async function sendEmail({ to, subject, text, html }) {
  try {
    const res = await fetch(EMAIL_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, text, html }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}


