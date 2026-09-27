# 🤖 AI Agent Developer Guide — RoomCraft AR

> This document provides comprehensive context, architectural patterns, technical decisions, and operational instructions for AI Coding Agents working on the RoomCraft AR codebase.

---

## 📌 1. Project Overview & Identity

**RoomCraft AR** is a cross-platform 3D Spatial Interior Studio & 6DoF Augmented Reality application. It enables users to design multi-item room layouts, arrange 3D furniture, preview layouts in 6DoF AR, and export room scenes to native Apple USDZ QuickLook AR.

---

## 🚀 2. Tech Stack & Version Constraints

> ⚠️ **CRITICAL DEPENDENCY RULE**: Do NOT downgrade `react` or `react-dom` to version 18. Expo SDK 57 requires React 19.

| Component | Package / Version | Notes |
|---|---|---|
| **Core Framework** | `react@19.2.3`, `react-dom@19.2.3` | **Locked to v19** for Expo SDK 57 compatibility |
| **3D Rendering** | `three@^0.174.0` | Core WebGL engine & USDZExporter |
| **React 3D Fiber** | `@react-three/fiber@^9.0.0` | React 19 compatible renderer |
| **React 3D Drei** | `@react-three/drei@^10.0.0` | React 19 compatible helpers |
| **State Management** | `zustand@^5.0.3` | Centralized state store ([`src/store/useRoomStore.ts`](file:///c:/Users/pashi/Downloads/RoomCraft%20AR/src/store/useRoomStore.ts)) |
| **Mobile SDK** | `expo@^57.0.25`, `react-native@0.86.3` | Native Expo Go runtime |
| **Native Bridge** | `@capacitor/core@^8.5.2` | Native iOS & Android project generator |
| **WebView Engine** | `react-native-webview@^13.16.1` | Native Expo Go WebView container |
| **Build System** | `vite@^6.1.1`, `typescript@~6.0.3` | Web bundler & type checker |

---

## 📂 3. Directory Map & Core Code Architecture

```
RoomCraft AR/
├── App.tsx                    # Root Expo Go Native Entry (WebView Wrapper)
├── index.html                 # Root Web HTML Entry (PWA Meta Tags & Theme)
├── vite.config.ts             # Vite Dev Config (allowedHosts: true, port: 3000)
├── metro.config.js            # Metro Bundler Config
├── package.json               # Package Manifest (React 19 & R3F v9)
├── public/
│   ├── manifest.json          # Web App PWA Manifest
│   ├── sw.js                  # Cache-First Service Worker for Offline Execution
│   └── favicon.svg            # Application Logo Icon
├── src/
│   ├── main.tsx               # Web Application Entry Point & SW Registration
│   ├── swRegister.ts          # Service Worker Registration Helper
│   ├── App.tsx                # Primary Web Layout Component
│   ├── store/
│   │   └── useRoomStore.ts    # Central Zustand Store (placedModels, transforms, UI state)
│   ├── components/
│   │   ├── ar/                # 3D Viewport & AR Engine
│   │   │   ├── ARCanvas.tsx             # R3F Canvas & Camera Setup
│   │   │   ├── CameraFeed.tsx           # Background HTML5 Video Feed
│   │   │   ├── GyroCameraController.tsx # Device Sensor Orientation/Motion Fusion
│   │   │   ├── PlacedModel.tsx          # 3D Model Instance & Gizmo Controls
│   │   │   ├── Reticle.tsx              # Floor Raycast Placement Reticle
│   │   │   └── ShadowCatcher.tsx        # Ground Plane Shadow Catcher
│   │   ├── ui/                # User Interface Components
│   │   │   ├── Dashboard.tsx            # Room Selection & Creation Dashboard
│   │   │   ├── TopBarHUD.tsx            # Header Controls & QuickLook Exporter Button
│   │   │   ├── BottomDock.tsx           # Furniture Catalog & Selection Dock
│   │   │   ├── CatalogDrawer.tsx        # Furniture Catalog Drawer
│   │   │   ├── SceneListDrawer.tsx      # Placed Furniture Layers & Locks
│   │   │   └── PwaInstallPrompt.tsx     # iOS Safari PWA Installation Modal
│   └── utils/
│       ├── usdzExporter.ts    # USDZ Scene Exporter for iOS QuickLook AR
│       ├── storage.ts         # IndexedDB Room Layout Storage
│       └── logger.ts          # Structured Diagnostic Logger
├── ios/                       # Native Xcode iOS Project (Capacitor)
└── android/                   # Native Android Studio Project (Capacitor)
```

---

## 🔑 4. Key Architectural Decisions & Past Solutions

### A. React 19 vs. Hermes Reconciler Conflict
* **Problem**: Metro bundler crashed on iOS Expo Go with `TypeError: Cannot read property 'S' of undefined` / `ReactCurrentOwner`.
* **Root Cause**: Expo SDK 57 and React Native 0.86 require React 19 (`react@19.2.3`). Installing React 18 caused reconciler internal symbol mismatches.
* **Rule for AI Agents**: Always ensure `react` is locked to `19.2.3` and `@react-three/fiber` is locked to `^9.0.0`.

### B. Mobile Camera HTTPS Requirement & SSL Cert Error -1202
* **Problem**: Mobile browsers (iOS Safari / Android Chrome) strictly disable `navigator.mediaDevices.getUserMedia` over insecure HTTP connections. Using `@vitejs/plugin-basic-ssl` triggered iOS WKWebView error `-1202` (`NSURLErrorDomain` untrusted certificate).
* **Fix**: Run Vite on HTTP (`vite.config.ts` without `basicSsl`), and tunnel port 3000 through Cloudflare Tunnel (`npx cloudflared tunnel --url http://localhost:3000`). Cloudflare provides a valid DigiCert SSL certificate trusted natively by iOS WebKit.

### C. Vite v6 Host Header Security
* **Problem**: Vite v6 blocked Cloudflare tunnel host headers (`.trycloudflare.com`).
* **Fix**: `server.allowedHosts: true` is set in `vite.config.ts`. Maintain this property in all future Vite configuration updates.

---

## 📋 5. Verification Commands & Workflow Cheat Sheet

### Type Check (Must Pass With 0 Errors):
```bash
npm run lint
```

### Run Web Development Server:
```bash
npm run dev
```

### Launch HTTPS Cloudflare Tunnel:
```bash
npx --yes cloudflared tunnel --url http://localhost:3000
```

### Run Native Expo / Metro Bundler:
```bash
npx expo start --clear
```

### Sync Web Build to Capacitor Native Projects:
```bash
npm run cap:sync
```

---

## 🎯 6. Instructions for Future AI Agents

1. **Preserve Type Safety**: Before completing any task, always execute `npm run lint` (`tsc --noEmit`) to verify zero TypeScript errors.
2. **Do Not Mutate API Contracts**: [`useRoomStore.ts`](file:///c:/Users/pashi/Downloads/RoomCraft%20AR/src/store/useRoomStore.ts) is the single source of truth for 3D item transforms `[x, y, z]`, rotations `[rx, ry, rz]`, and scales `[sx, sy, sz]`.
3. **Preserve Multi-Item USDZ Export**: [`usdzExporter.ts`](file:///c:/Users/pashi/Downloads/RoomCraft%20AR/src/utils/usdzExporter.ts) parses all active model meshes into a single unified USDZ room scene. Always test USDZ generation when modifying 3D model loaders.
