const STORAGE_KEYS = {
  accessToken: "keepit_accessToken",
  refreshToken: "keepit_refreshToken",
};

const els = {
  status: document.getElementById("status"),
  authView: document.getElementById("authView"),
  saveView: document.getElementById("saveView"),
  signinForm: document.getElementById("signinForm"),
  saveForm: document.getElementById("saveForm"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  signinBtn: document.getElementById("signinBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  link: document.getElementById("link"),
  title: document.getElementById("title"),
  desc: document.getElementById("desc"),
  tags: document.getElementById("tags"),
  typeBadge: document.getElementById("typeBadge"),
  saveBtn: document.getElementById("saveBtn"),
  signupLink: document.getElementById("signupLink"),
};

function setStatus(message, kind = "") {
  els.status.textContent = message || "";
  els.status.className = `status${kind ? ` ${kind}` : ""}`;
}

function showAuth() {
  els.authView.classList.remove("hidden");
  els.saveView.classList.add("hidden");
  els.logoutBtn.classList.add("hidden");
}

function showSave() {
  els.authView.classList.add("hidden");
  els.saveView.classList.remove("hidden");
  els.logoutBtn.classList.remove("hidden");
}

async function storageGet(keys) {
  return chrome.storage.local.get(keys);
}

async function storageSet(obj) {
  return chrome.storage.local.set(obj);
}

async function storageRemove(keys) {
  return chrome.storage.local.remove(keys);
}

async function getTokens() {
  const data = await storageGet([
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.refreshToken,
  ]);
  return {
    accessToken: data[STORAGE_KEYS.accessToken] || "",
    refreshToken: data[STORAGE_KEYS.refreshToken] || "",
  };
}

async function setTokens(accessToken, refreshToken) {
  await storageSet({
    [STORAGE_KEYS.accessToken]: accessToken,
    [STORAGE_KEYS.refreshToken]: refreshToken,
  });
}

async function clearTokens() {
  await storageRemove([STORAGE_KEYS.accessToken, STORAGE_KEYS.refreshToken]);
}

function detectType(urlString) {
  try {
    const url = new URL(urlString);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const path = url.pathname;

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be" ||
      host === "music.youtube.com"
    ) {
      return "youtube";
    }

    if (host === "x.com" || host === "twitter.com" || host === "mobile.twitter.com") {
      if (/\/status\/\d+/.test(path)) return "x";
    }

    if (host === "instagram.com" || host === "www.instagram.com") {
      if (/^\/(p|reel|reels|tv)\//.test(path)) return "instagram";
    }

    return "web articles";
  } catch {
    return "web articles";
  }
}

async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, data };
}

async function refreshAccessToken() {
  const { refreshToken } = await getTokens();
  if (!refreshToken) return null;

  const { ok, data } = await apiFetch("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

  const accessToken = data?.accessToken || data?.token;
  const nextRefresh = data?.refreshToken;

  if (!ok || !accessToken || !nextRefresh) {
    await clearTokens();
    return null;
  }

  await setTokens(accessToken, nextRefresh);
  return accessToken;
}

async function authFetch(path, options = {}) {
  let { accessToken } = await getTokens();
  if (!accessToken) {
    return { ok: false, status: 401, data: { msg: "Not signed in" } };
  }

  let result = await apiFetch(path, { ...options, token: accessToken });
  if (result.status !== 401) return result;

  accessToken = await refreshAccessToken();
  if (!accessToken) {
    return { ok: false, status: 401, data: { msg: "Session expired" } };
  }

  return apiFetch(path, { ...options, token: accessToken });
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

function fillFromTab(tab) {
  const link = tab?.url || "";
  const title = tab?.title || "";
  const type = detectType(link);

  els.link.value = link.startsWith("http") ? link : "";
  els.title.value = title && !title.startsWith("http") ? title : "";
  els.typeBadge.textContent = type;

  if (!els.link.value) {
    setStatus("Open a normal webpage (http/https) to save.", "error");
  }
}

async function init() {
  els.signupLink.href = `${APP_URL.replace(/\/$/, "")}/signup`;

  const { accessToken } = await getTokens();
  if (!accessToken) {
    showAuth();
    setStatus("");
    return;
  }

  showSave();
  const tab = await getActiveTab();
  fillFromTab(tab);
  setStatus("Ready to save");
}

els.signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Signing in…");
  els.signinBtn.disabled = true;

  try {
    const { ok, data } = await apiFetch("/auth/signin", {
      method: "POST",
      body: {
        username: els.username.value.trim(),
        password: els.password.value,
      },
    });

    const accessToken = data?.accessToken || data?.token;
    const refreshToken = data?.refreshToken;

    if (!ok || !accessToken || !refreshToken) {
      setStatus(data?.msg || "Sign in failed", "error");
      return;
    }

    await setTokens(accessToken, refreshToken);
    els.password.value = "";
    showSave();
    const tab = await getActiveTab();
    fillFromTab(tab);
    setStatus("Signed in", "ok");
  } catch (err) {
    setStatus(
      "Could not reach API. Is the backend running on localhost:3000?",
      "error"
    );
    console.error(err);
  } finally {
    els.signinBtn.disabled = false;
  }
});

els.saveForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Saving…");
  els.saveBtn.disabled = true;

  try {
    const link = els.link.value.trim();
    const title = els.title.value.trim();
    const desc = els.desc.value.trim();
    const type = detectType(link);
    els.typeBadge.textContent = type;

    const tags = els.tags.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!link) {
      setStatus("Link is required", "error");
      return;
    }

    if (type !== "web articles" && !title) {
      setStatus("Title is required for this content type", "error");
      return;
    }

    const contentData = { type, link, title: title || undefined };
    if (desc) contentData.desc = desc;
    if (tags.length) contentData.tags = tags;

    const { ok, status, data } = await authFetch("/content/post-content", {
      method: "POST",
      body: { contentData },
    });

    if (status === 401) {
      await clearTokens();
      showAuth();
      setStatus("Session expired — sign in again", "error");
      return;
    }

    if (!ok) {
      const firstError =
        data?.errors &&
        Object.values(data.errors)
          .flat()
          .find(Boolean);
      setStatus(firstError || data?.msg || "Save failed", "error");
      return;
    }

    setStatus("Saved to Keep It ✓", "ok");
    els.desc.value = "";
    els.tags.value = "";
  } catch (err) {
    setStatus("Network error while saving", "error");
    console.error(err);
  } finally {
    els.saveBtn.disabled = false;
  }
});

els.logoutBtn.addEventListener("click", async () => {
  const { refreshToken } = await getTokens();
  try {
    if (refreshToken) {
      await apiFetch("/auth/logout", {
        method: "POST",
        body: { refreshToken },
      });
    }
  } catch {
    // ignore
  }
  await clearTokens();
  showAuth();
  setStatus("Logged out");
});

els.link.addEventListener("input", () => {
  els.typeBadge.textContent = detectType(els.link.value.trim());
});

init();
