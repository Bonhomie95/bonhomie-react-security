# @bonhomie/react-security

<p align="center">
  <img src="https://img.shields.io/npm/v/@bonhomie/react-security?color=blue&label=npm%20version" />
  <img src="https://img.shields.io/npm/dm/@bonhomie/react-security?color=orange&label=downloads" />
  <img src="https://img.shields.io/bundlephobia/min/@bonhomie/react-security?color=yellow&label=minified" />
  <img src="https://img.shields.io/github/license/bonhomie/react-security?color=green&label=license" />
</p>

<p align="center">
  🔐 A powerful React security toolkit for modern apps:  
  DevTools detection, screenshot blocking, anti-inspect, anti-iframe, tamper detection, watermarks,  
  lock screen UI, VPN detection, AI screenshot detection, and more.
</p>

---

# 🚀 Install

```bash
npm install @bonhomie/react-security
````

---

# ✨ Feature Matrix

| Feature                    | Low      | Medium   | High     |
| -------------------------- | -------- | -------- | -------- |
| DevTools Detection         | ✔        | ✔        | ✔        |
| Screenshot Block           | ✖        | ✔        | ✔        |
| Copy/Paste Block           | ✖        | ✔        | ✔        |
| Right–Click Block          | ✖        | ✔        | ✔        |
| Route Tamper Detection     | ✔        | ✔        | ✔        |
| Anti-Iframe Lock           | ✔        | ✔        | ✔        |
| Lock Screen                | ✖        | ✔        | ✔        |
| Noise Overlay              | ✖        | ✖        | ✔        |
| Watermark                  | Optional | Optional | ✔        |
| Auto-Logout                | ✖        | Optional | Optional |
| AI Screenshot Detection    | Optional | Optional | ✔        |
| VPN Detection              | Optional | Optional | ✔        |
| Keystroke Tamper Detection | Optional | Optional | ✔        |

---

# 🧩 Basic Usage (Recommended)

```jsx
import {
  ReactSecurityProvider,
  SecurePage,
  AntiIframe,
  BlockInspect
} from "@bonhomie/react-security";

export default function App() {
  return (
    <ReactSecurityProvider level="high">
      <AntiIframe>
        <BlockInspect>
          <SecurePage>
            <Dashboard />
          </SecurePage>
        </BlockInspect>
      </AntiIframe>
    </ReactSecurityProvider>
  );
}
```

---

# 🎛 Security Levels (Presets)

### **LOW**

```js
{
  blockDevTools: true,
  blockScreenshot: false,
  blockCopy: false,
  lockOnSuspicious: false,
  autoLogout: false,
  noiseOverlay: false
}
```

### **MEDIUM** (recommended for SaaS)

```js
{
  blockDevTools: true,
  blockScreenshot: true,
  blockCopy: true,
  lockOnSuspicious: true,
  showLockOverlay: true
}
```

### **HIGH** (fintech, exam apps, dashboards)

```js
{
  blockDevTools: true,
  blockScreenshot: true,
  blockCopy: true,
  noiseOverlay: true,
  lockOnSuspicious: true,
  showLockOverlay: true,
  enableWatermark: true
}
```

---

# ⚙️ Provider Configuration (Advanced)

```jsx
<ReactSecurityProvider
  level="medium"
  config={{
    blockScreenshot: true,
    blockDevTools: true,
    blockCopy: true,

    lockOnSuspicious: true,
    autoLogout: true,
    noiseOverlay: true,
    enableWatermark: true,
    watermarkText: "Protected by Bonhomie Security",

    showUnlockButton: true,

    onDetect: (type) => console.log("Suspicious:", type),
    onLogout: () => logoutUser()
  }}
>
  <App />
</ReactSecurityProvider>
```

---

# 🛡 Components

## 🔒 `<SecurePage />`

Protects a page with:

* Blur on suspicious activity
* Lock screen overlay
* Noise overlay
* AI / screenshot watermark
* Event-based warnings

```jsx
<SecurePage blurAmount="6px">
  <Dashboard />
</SecurePage>
```

---

## 🧱 `<BlockInspect />`

Blocks:

* F12
* Ctrl+Shift+I
* Ctrl+Shift+J
* Ctrl+U
* Right-click
* Mobile long-press
* Mobile zoom inspect

```jsx
<BlockInspect>
  <ProtectedContent />
</BlockInspect>
```

---

## 🛑 `<AntiIframe />`

Prevents your app from loading inside an iframe.

```jsx
<AntiIframe>
  <App />
</AntiIframe>
```

---

# 🪝 Hooks Reference

## useDevtoolsDetect

```js
useDevtoolsDetect({
  enabled: true,
  onDetect: () => console.log("DevTools opened")
});
```

## useScreenshotBlock

```js
useScreenshotBlock({
  blockPrintScreen: true,
  onScreenshotAttempt: () => alert("Screenshot blocked")
});
```

## useClipboardLock

```js
useClipboardLock({
  blockCopy: true,
  blockPaste: true,
  onBlock: (type) => console.log("Blocked:", type),
});
```

## useRouteTamperGuard

```js
useRouteTamperGuard({
  allowedRoutes: ["/dashboard"],
  redirectTo: "/warning"
});
```

## useGhostingDetect

Detects synthetic key events / bot keystrokes.

```js
useGhostingDetect({
  onGhost: () => console.warn("Ghost keystroke detected!")
});
```

## useKeystrokeTamper

Detects tampering with keydown/keyup sequences.

```js
useKeystrokeTamper({
  onTamper: () => alert("Keystroke tampering detected!")
});
```

---

# 🧠 Utilities

All available under:

```js
import { detectVPN, aiScreenshotDetect } from "@bonhomie/react-security";
```

* `detectVPN()` – lightweight VPN/proxy detector
* `aiScreenshotDetect()` – detects suspicious brightness/frame dips
* `watermark.generateDynamic()` – dynamic rotating watermark
* `events.emitSecurityEvent()` – provider-level triggers

---

# 🧱 Recommended Patterns

### 1️⃣ Wrap entire app

```jsx
<ReactSecurityProvider level="high">
  <AntiIframe>
    <BlockInspect>
      <SecurePage>
        <App />
      </SecurePage>
    </BlockInspect>
  </AntiIframe>
</ReactSecurityProvider>
```

### 2️⃣ Use `<SecurePage>` only where necessary

Avoid wrapping public pages for performance.

### 3️⃣ Combine route tamper guard + lock UI

Makes cheating very hard.

### 4️⃣ Set `autoLogout: true` in high-risk environments (fintech/exams)

---

# 🏢 Enterprise Integration

This package is ideal for:

* **Fintech dashboards**
* **KYC/AML platforms**
* **Exam/testing portals**
* **Internal admin dashboards**
* **SaaS with proprietary content**
* **AI model preview tools**
* **Video/streaming with DRM-lite protection**

Recommended settings:

```js
<ReactSecurityProvider
  level="high"
  config={{
    autoLogout: true,
    enableWatermark: true,
    noiseOverlay: true,
    lockOnSuspicious: true,
    aiScreenshot: true,
    vpnCheck: true
  }}
>
```

---

# 🌐 SSR Notes (Next.js / Remix)

This library is **client-only**.

For SSR:

```jsx
"use client";

import { ReactSecurityProvider } from "@bonhomie/react-security";
```

Avoid running hooks during SSR — provider handles this already.

---

# 🛠 Troubleshooting

### ❌ Screenshot still works?

* Windows Snipping Tool bypasses DOM APIs sometimes
* Enable `noiseOverlay` + `enableWatermark`
* Consider backend watermarking for images

### ❌ DevTools not detected?

Chrome DevTools detection is browser-dependent; mix with:

* zoom detection
* route tamper
* key combos
* screenshot watermark

### ❌ Locked screen won’t unlock?

Ensure provider includes:

```js
showUnlockButton: true
```

### ❌ Running inside iframe?

Ensure domain isn’t embedding itself (like preview tools).


---

# 📄 License

MIT — free for personal & commercial use.

---

# 👨‍💻 Author

Made with care by **Bonhomie**
Full-stack Web & Mobile Developer