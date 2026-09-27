# 🏠 RoomCraft AR — Spatial Interior Studio & 6DoF AR

> A high-performance, cross-platform 3D Spatial Room Design & 6DoF Augmented Reality application built for web, iOS, and Android.

---

## 🌟 Overview & Vision

**RoomCraft AR** was designed to solve a core problem in interior design and spatial planning: enabling users to design, arrange, and preview multi-item 3D room layouts directly in real-world 6DoF (Six Degrees of Freedom) space without requiring expensive hardware, complex software, or costly $99/year Apple Developer memberships.

### Key Goals Achieved:
1. **Multi-Item 3D Spatial Editing**: Drag, drop, rotate, scale, align, duplicate, and style multiple furniture items in a real-time 60fps 3D canvas.
2. **In-App Sensor-Fused 6DoF AR**: Live camera background combined with iPhone gyroscope & accelerometer sensor fusion to walk around 3D scenes inside the app with full UI interactivity.
3. **Apple USDZ 6DoF Scene Exporter**: Merges entire custom room layouts into a single `.usdz` 3D scene file for native Apple QuickLook AR.
4. **Zero-Cost Sideloading & PWA Support**: Configured as an iOS Progressive Web App (PWA) with Service Worker offline caching for home screen installation with 0 Apple Developer fees.

---

## ✨ Features

- **🛋️ 3D Room Design Studio**: 60fps Three.js canvas with interactive transform gizmos, snapping grids, object color customization, and locking.
- **📱 In-App 6DoF Motion Tracking**: Motion-sensor camera controller (`GyroCameraController`) enabling 360° pitch/yaw/roll panning and physical walk simulation.
- ** Multi-Model USDZ QuickLook Exporter**: Generates unified `.usdz` scene blobs from multi-object room layouts for native 1:1 scale iOS QuickLook AR.
- **💾 Room Layout Persistence**: Saves room configurations, object positions `(x, y, z)`, rotations, and scales permanently to local storage/IndexedDB with JSON import/export.
- **📷 QR Code Model Scanner**: Built-in camera QR scanner to import 3D furniture models and share room layouts instantly.
- **⚡ 100% Offline Capability**: Service Worker (`public/sw.js`) and PWA manifest (`public/manifest.json`) for full offline execution on mobile devices.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework & UI** | React 19, TypeScript, Vite 6, Tailwind CSS, Lucide Icons |
| **3D Rendering** | Three.js (`v0.174`), `@react-three/fiber` (`v9`), `@react-three/drei` (`v10`) |
| **State Management** | Zustand (`v5.0.3`) |
| **Native Mobile Bridge** | Expo SDK 57, Capacitor 8 (`@capacitor/ios`, `@capacitor/android`), `react-native-webview` |
| **PWA & Offline** | Service Worker, Web App Manifest, IndexedDB (`idb-keyval`) |

---

## 📱 Mobile Deployment Strategies Researched

| Method | Real Native `.app`? | Apple Fee ($99/yr)? | 7-Day Expire Workaround? | PC Needed After Setup? |
|---|---|---|---|---|
| **PWA (Home Screen)** | ❌ WebKit PWA | ❌ **$0** | ✅ **Never expires** | ❌ **NO** |
| **SideStore + LocalDevVPN** | ✅ **YES** | ❌ **$0** | ✅ **Auto-refreshes on iPhone** | ❌ **NO** |
| **AltStore Wi-Fi Sync** | ✅ **YES** | ❌ **$0** | ✅ **Auto-refreshes over Wi-Fi** | ⚠️ Background Wi-Fi |
| **Free Xcode Cable Sideload** | ✅ **YES** | ❌ **$0** | ⚠️ **Manual 7-day re-plug** | ⚠️ Yes (every 7 days) |
| **TestFlight / App Store** | ✅ **YES** | ⚠️ **$99/year** | ✅ **1-Year certificate** | ❌ **NO** |

---

## 🛠️ Key Technical Challenges Resolved

1. **React 19 / Hermes Reconciler Incompatibility**:
   - **Issue**: Expo SDK 57 relies on React 19 (`react@19.2.3`), while React 18 packages threw `TypeError: Cannot read property 'S' of undefined` / `ReactCurrentOwner` on Hermes.
   - **Fix**: Upgraded project to React 19.2.3, `@react-three/fiber` v9, and `@react-three/drei` v10.
2. **iOS WKWebView Self-Signed SSL Error -1202**:
   - **Issue**: iOS WKWebView blocks self-signed HTTPS IP certificates with `NSURLErrorDomain` -1202.
   - **Fix**: Created trusted HTTPS tunnels via Cloudflare Tunnel (`cloudflared`) providing DigiCert SSL certificates trusted by WebKit.
3. **Vite Host Header Security Block**:
   - **Issue**: Vite v6 blocked external tunnel host headers (`.trycloudflare.com`).
   - **Fix**: Configured `allowedHosts: true` in `vite.config.ts`.

---

## 🚀 Quick Start & Development

### 1. Installation
```bash
git clone <repository-url>
cd RoomCraft-AR
npm install --legacy-peer-deps
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Type Checking
```bash
npm run lint
```

### 4. Run Mobile Expo Bundler
```bash
npx expo start --clear
```

---

## 📄 License
MIT License. Created for Spatial Computing & 3D Interior Design exploration.
