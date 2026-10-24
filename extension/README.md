# Keep It — Chrome extension (v0.1)

Simple **toolbar popup**: open a page → click Keep It → Save.

Works with YouTube, Instagram posts/reels, X posts, and any website.

## You do NOT need Chrome Web Store to try this

For development you load an **unpacked** extension from this folder.  
Web Store registration is only needed later when you publish publicly.

## Try it (5 minutes)

### 1. Run Keep It locally

Backend on `http://localhost:3000` and (optional) frontend on `http://localhost:5173`.

### 2. Load the extension in Chrome

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder: `Keep-It/extension`
5. Pin **Keep It** from the puzzle icon

### 3. Save something

1. Open a YouTube / X / Instagram / article tab
2. Click the Keep It icon
3. Sign in with your Keep It username + password
4. Click **Save to Keep It**
5. Refresh your dashboard — it should appear

## Config

API URL is in `config.js` (defaults to local):

```js
const API_BASE = "http://localhost:3000/api/v1";
```

After changing files, go to `chrome://extensions` → Keep It → **Reload**.

## Later (not needed now)

- Publish on [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) (~$5 one-time)
- Right-click menu + keyboard shortcut
- Point `API_BASE` / host permissions at production API
