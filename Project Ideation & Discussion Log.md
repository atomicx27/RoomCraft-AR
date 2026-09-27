Project Ideation & Discussion Log: WebAR Concepts

1. Project Overview & Ideation Tracks

The ideation session explores two distinct WebAR concepts designed to operate natively within modern mobile web browsers without requiring native app installations.

Track A: Real-World Spatial Data Visualization [STATUS: ON HOLD / BACKLOG]

Core Philosophy: Moving data analytics beyond 2D flat screens and laptops into spatial 3D environments.

Proposed Names:

DataSpatial (Direct, technical, professional)

AetherMetrics (Modern, futuristic, clean)

HoloMetrics (Intuitive, visually evocative)

DimensionIQ (Enterprise analytics branding)

Key Concept: Projecting real-time volumetric charts, 3D scatter plots, topological surfaces, and contextual telemetry onto real physical surfaces (desks, conference tables, or plant floors).

Interactivity Potential: Raycasting gesture interactions, spatial pinch-to-zoom/rotate, physical walking-around data clusters to inspect anomalies, and localized spatial filtering.

Track B: Persistent Virtual Room & 3D Object Customizer [STATUS: ACTIVE PRIMARY FOCUS]

Core Philosophy: Transforming personal physical rooms into customized spatial sanctuaries by summoning 3D artifacts via QR codes or markerless app catalog summoning, featuring multi-object spatial persistence and environmental blending.

Proposed Names:

RoomCraft AR (Playful, creative, user-friendly)

SpatialVault (Focus on collecting, summoning, and curation)

AetherRoom (Sleek, atmospheric, design-forward)

OmniHabit (Focus on spatial habits and personal environments)

Key Concept: Users scan a physical QR marker or tap an item in a 3D catalog to summon realistic 3D models (art pieces, luxury furniture, anime collectibles, plants, ambient tech) into their room. The app remembers object positions across sessions and ensures realistic blending through lighting estimation, shadow projection, and surface occlusion.

2. Technical Architecture & WebAR Stack Evaluation

NOTE: Specific technology selections (rendering engines, tracking libraries, and frameworks) are decoupled from this architecture and are currently undergoing independent research.

Core WebXR Foundation

Rendering Engine: Three.js with @react-three/fiber and @react-three/xr, or Babylon.js. React Three Fiber provides state management well-suited for React/TypeScript web apps.

Tracking & Hit Testing: Native WebXR Hit Test API (hit-test feature) for markerless plane detection (floors, walls, tabletops).

QR & Marker Detection: MindAR.js or jsQR/ZXing WebAssembly library for instant camera-based QR code recognition and marker-based 6DoF tracking.

Critical Technical Challenges & Solutions

Spatial Persistence in Web Browsers:

Challenge: Web browsers have sandboxed security and traditionally lacked persistent local spatial anchors across closed sessions.

Solution Strategy:

WebXR Anchors API combined with LocalStorage/IndexedDB storing relative transforms (translation, rotation, scale) tied to room origin or QR fiducial anchors.

Hybrid Marker/Relocalization: Placing a physical QR tag in the room acts as a "World Anchor" (0,0,0) calibration point. When scanned, all previously saved objects reload into their exact relative positions.

Realistic Environmental Blending:

Lighting Estimation API: Utilizing WebXR Light Estimation to reflect real-world ambient intensity, directional light angles, and spherical harmonics for PBR materials (roughness, metalness).

Shadow Planes & Occlusion: Invisible shadow receiver planes (ShadowMaterial) cast realistic contact shadows onto detected floors and tables.

Depth API: Using WebXR Depth Sensing (where supported by WebXR on Android ARCore) for dynamic real-world occlusion.

3. Comparison & Strategic Recommendation

Evaluation Metric

Track A: DataSpatial

Track B: RoomCraft AR

User Emotional Resonance

High for technical/professional users; analytical.

Extremely high for personal expression, creativity, and lifestyle.

Technical Complexity

Medium (3D data generation, camera overlays).

High (Persistence, multi-object state, lighting estimation).

Virality & Wow Factor

High in B2B / developer circles.

Very high for consumer web, social sharing, and personal utility.

Feasibility as Web App

Fully feasible with Three.js & WebXR.

Feasible; persistence works reliably with QR origin calibration.

4. Chronological Discussion Log

Session 1: September 25, 2026

Discussion Summary: The user introduced two core concepts: (1) an AR web app for real-world spatial data visualization replacing flat 2D laptop screens, and (2) an AR web app with QR code and catalog summoning to place 3D objects, persist their locations in a virtual room, and blend them realistically with the physical surroundings.

Decisions & Actions:

Evaluated both ideas for WebAR feasibility using Three.js, React Three Fiber, and WebXR APIs.

Formulated naming options for both tracks.

Documented spatial persistence architecture using QR reference anchors to bypass browser session storage limitations.

Synchronized high-level takeaways to Google Keep and detailed architecture to Google Doc.

5. Product Alignment: Confirmed Specifications (Q&A Matrix)

Question 1: What kinds of 3D objects will be summoned, and where do they originate?

User Decision / Answer:

 Both static models (decor, furniture, statues) AND animated models (creatures, characters, kinetic art).

 Yes, interactive models are supported (e.g., interactive lights that cast dynamic illumination, audio-reactive or playable items, tap-to-inspect info modals).

 Both a curated in-app catalog AND custom user uploads (allowing users to import their own .glb / .gltf files directly into their virtual room).

Technical Implication:

Standardize on binary glTF (.glb) with Draco compression and PBR textures.

Three.js AnimationMixer pipeline to manage skeletal and keyframe animations.

Web File API integration with client-side glTF validation and sanitization for custom user uploads.

Question 2: What is the primary role and mechanic of the QR code feature?

User Decision / Answer:

 QR codes serve two unified purposes:

 Physical QR codes (printed on stickers, cards, posters, or packaging) trigger the instant unlocking and summoning of specific 3D items.

 A designated QR marker acts as the physical (0, 0, 0) room origin, allowing precise alignment of the virtual room.

Technical Implication:

Payload schema for QR codes will support an action identifier: type: "SUMMON_ITEM" (with item ID/metadata) vs type: "ROOM_ANCHOR" (with room ID).

Computer vision marker detection (via jsQR / MindAR) calculates the camera's pose relative to the QR plane in real-time.

Question 3: How should the app handle spatial room memory and persistence across sessions?

User Decision / Answer:

 Users who stick or place a physical QR anchor in their room can point their camera at it to instantly restore and relocalize all previously positioned items with high positional fidelity.

 Users without a physical anchor can place items anywhere on detected planes via WebXR hit testing for spontaneous, flexible sessions.

 Support saving multiple distinct spaces (e.g., "Bedroom Setup", "Work Desk", "Studio Corner").

Technical Implication:

Spatial coordinate storage schema: Store object transforms as relative translation vectors (x, y, z), quaternion rotations (qx, qy, qz, qw), and scale (sx, sy, sz) relative to the anchor origin matrix.

Local persistence using IndexedDB with optional Cloud Sync (JSON state schema) indexed by roomId.

Question 4: How should object manipulation and editing controls function?

User Decision / Answer:

 Seamless toggle between:

 One-finger drag along surfaces, two-finger rotational pinch/twist, and uniform scaling.

 Intelligent alignment where objects automatically snap their bounding box bases to horizontal planes (floors, desks) or vertical planes (walls for framed art/posters).

 Ability to lock placed objects in position to avoid accidental displacement during room walkthroughs.

Technical Implication:

Raycaster hit testing against WebXR detected planes and Three.js bounding box collision logic.

State machine toggling between MODE_FREE_MANIPULATE, MODE_SNAP_ALIGN, and STATE_LOCKED.

Question 5: What are the target platforms and browser environments?

User Decision / Answer:

 Both platforms are equally critical first-class targets for the web app.

Technical Implication:

 Native WebXR Device API supported out of the box in mobile Google Chrome (Hit Test, Lighting Estimation, Depth API).

 Mobile Safari does not natively support the full WebXR Device API standard for camera AR. To achieve pure web parity without a native app wrapper, the architecture will use:

 A WebAssembly/WebGL-based WebAR SLAM tracking pipeline (such as MindAR / 8th Wall / open-source WebXR polyfills with WebAssembly vision tracking) that runs directly inside iOS Safari.

 Progressive Web App (PWA) layer or Quick Look USDZ auto-export for single-item preview when full multi-object scene tracking is constrained.

The following key categories define the scoping framework to align technical implementation with product goals:

Category 1: Object Catalog & Nature of 3D Assets (Static decor, animated models, interactive audio/visual items, user file uploads).

Category 2: QR Code Summoning Mechanics (Role of QR codes: room origin anchor vs physical collectible cards/stickers vs unlockable keys).

Category 3: Spatial Persistence Strategy (How room state is restored: scanning a primary reference anchor vs coordinate saving in IndexedDB/Cloud).

Category 4: Interaction Design & Manipulation (Pinch-to-scale, rotation gizmos, surface snapping, bounding boxes).

Category 5: Environmental Realism vs Performance Budget (PBR textures, real-time shadows, WebXR Light Estimation vs mobile browser thermal/RAM limits).

Category 6: Social & Sharing Capabilities (Single-user personal room vs shareable room links for friends to view in AR).

Session 2: September 25, 2026

Session 3: September 25, 2026

Session 4: September 25, 2026

Session 5: September 25, 2026

Discussion Summary: User selected Option 2 ('The Room Architect') as the official UX architecture; documented comprehensive screen-by-screen specifications.

Discussion Summary: Shifted focus to the User Experience (UX) plan. Formulated three distinct architectural UX options: (1) The Spatial Sandbox (Camera-first, zero-friction instant placement); (2) The Room Architect (Structured dashboard, guided anchor calibration, and multi-room management); (3) The Collector's Portal (3D showcase/unboxing first, unlocking items, then summoning into AR).

Decisions & Actions: Documented full user journeys, UI layout components, pros, and tradeoffs for all three UX options in the master planning document, and updated Google Keep highlights. Awaiting user selection of the preferred UX model.

Discussion Summary: Finalized the core product requirements for RoomCraft AR based on the alignment questionnaire: (1) Asset support locked for static, animated, interactive items, and custom .glb uploads; (2) Hybrid QR code mechanic approved (item summoner + room calibration anchor); (3) Hybrid persistence model approved (QR-anchored relocalization + free-form plane placement with multi-room saving); (4) Dual-mode manipulation approved (toggle between standard free touch and surface snapping, plus lock toggle); (5) Cross-platform parity established as mandatory across both Android Chrome and iOS Safari.

Decisions & Actions: Documented complete Q&A matrix, updated technical architectural roadmap, and synchronized key points to Google Keep.

Session 6: September 25, 2026

Session 7: September 25, 2026

Session 8: September 25, 2026

Discussion Summary: The high-level Sprint 1 capability roadmap was reviewed and formally approved by the user as the baseline plan for the MVP phase.

Discussion Summary: Converted the sprint plan into a purely high-level, goal-oriented roadmap and removed tech stack specifics to allow for independent evaluation.

Discussion Summary: Planned Sprint 1 (MVP Foundation) for RoomCraft AR. Decomposed the implementation into 6 concrete modules: (1) Project setup and cross-platform WebAR engine; (2) Surface hit-testing, placement reticle, and contact shadow catcher; (3) Starter 3D asset bundle; (4) Dual-mode manipulation; (5) QR code item summoning via camera stream; (6) Single-room local persistence in IndexedDB.

Session 9: September 25, 2026

Discussion Summary: Categorized and moved the master planning document from Google Drive root into the structured folder path "1. Career & Work / Projects & Research / RoomCraft AR" to maintain clean drive organization.

Session 10: September 25, 2026

Discussion Summary: Generated three dedicated, non-technical markdown specification documents inside the "RoomCraft AR" folder for developer handoff:

"Project_Overview.md": High-level concept, user problem, and core product pillars.

"Design_and_User_Experience.md": Full UI/UX specification of "The Room Architect" and screen-by-screen walkthrough.

"Sprint_1_MVP_Plan.md": Detailed functional milestones, deliverables, and acceptance criteria for the initial MVP.

Decisions & Actions: Outlined all Sprint 1 deliverables, set explicit out-of-scope boundaries for Sprint 2, updated master Google Doc, and synced key highlights to Google Keep.

Discussion Summary: User selected RoomCraft AR as the primary focus and placed DataSpatial on hold; initialized the product alignment questionnaire.

6. User Experience (UX) Architecture Options

Option 1: "The Spatial Sandbox" (Camera-First / Instant AR) [STATUS: ALTERNATIVE / ARCHIVED]

Design Philosophy: Zero friction. Maximize time-to-magic by dropping the user straight into the AR camera feed.

User Journey:

Landing & Permissions: User visits the URL. A clean permission modal requests Camera access.

Instant AR Viewfinder: The camera opens immediately with a subtle visual reticle and surface-detection dot grid.

Floating HUD Controls:

Bottom Dock: [Scan QR] | [+ Catalog] | [Snapping: ON/OFF] | [Room: Default ▼].

Top Bar: Quick settings, light estimation indicator, [Lock All] button.

Summoning & Placement:

Tapping [Scan QR] immediately scans a physical collectible card or room anchor.

Tapping [+ Catalog] slides up a half-screen drawer to browse items or upload a .glb file. Tapping an item spawns it at the reticle position.

Direct Manipulation: Tap to select. Touch drag to translate, two-finger twist to rotate. Toggle snapping to latch directly onto floor/table/wall planes.

Pros: Instant gratification, highly playful, minimal learning curve.

Tradeoffs: Calibration/anchor setup requires in-session prompting if the user wants strict persistence.

Option 2: "The Room Architect" (Structured Dashboard & Guided Calibration) [STATUS: LOCKED / SELECTED UX FLOW]

Design Philosophy: Intentional, workflow-driven interior and room design. Prioritizes organization, multi-room management, and high-accuracy persistence.

User Journey:

Landing Dashboard: Clean 2D web interface displaying user's saved spaces (e.g., "Desk Setup", "Bedroom Sanctuary", "+ Create New Room").

Guided Calibration Flow:

User selects or creates a room.

The app prompts: "Choose your tracking style: [Print/Scan Room Anchor QR for exact memory] or [Quick Free-Form Placement]".

Visual animated diagram teaches how to scan the room/anchor for optimal tracking.

Full AR Design Studio:

Screen displays an active item hierarchy drawer, object coordinates, visibility toggles, and multi-object inspector.

Dedicated Snapping Modes: Floor Snap, Wall Snap, Desk Surface Snap.

Session Save & Export: An explicit "Save Room Layout" button writes transforms to IndexedDB and offers a shareable room link or snapshot.

Pros: Bulletproof persistence, clear multi-room management, feels like a professional spatial tool.

Tradeoffs: Slightly slower onboarding before reaching the AR camera.

Option 3: "The Collector's Portal" (Showcase & Unboxing First) [STATUS: ALTERNATIVE / ARCHIVED]

Design Philosophy: Narrative, gamified, and item-centric. Celebrates the aesthetic value of the 3D objects and collectibles before placing them in the room.

User Journey:

Interactive 3D Web Showcase: Users land on an interactive 3D web gallery. They can rotate, inspect, and toggle lights/animations of items directly in 3D on screen.

Unlocking / Scanning:

Users tap "Scan Physical Item QR" to scan collectible stickers/cards/packaging to unlock rare items into their collection.

Or tap "+ Upload 3D File" to add their own custom glTF creation to their virtual inventory.

"Summon into Reality" Portal:

User selects an item from their collection and taps a prominent "Summon into Room" button.

The camera opens with a portal transition effect. The user points at a surface or anchor, and the object materializes with a holographic entrance VFX.

Room Accumulation: Users can continue summoning additional items, arrange them with surface snapping, and lock them in place.

Pros: Extremely engaging, high viral and marketing appeal, highlights the craftsmanship of individual 3D assets.

Tradeoffs: Centered around single-item flow before expanding to multi-object room curation.

7. Detailed UI/UX Specifications: The Room Architect

Screen 1: Dashboard & Spaces Manager (Visual grid of saved rooms, item counts, last modified date, "+ Create New Room", global settings).

Screen 2: Calibration & Tracking Setup Modal (Choice between 'Scan Room Anchor QR' for high precision vs 'Markerless Free-form Placement'; interactive scanning guide; button to download/print official printable anchor).

Screen 3: AR Design Studio (Viewfinder HUD, Top Bar with Light/Tracking health indicators & Room switcher, Bottom Dock with [Catalog], [Scan Item], [Snapping Toggle], [Lock All], [Save Room]).

Screen 4: Summoning & Catalog Drawer (Sliding bottom sheet with tabs: Curated Decor, Collectibles, Animated Items, and 'Custom Upload' supporting .glb drag-and-drop).

8. Sprint 1: High-Level Goal & Capability Plan [STATUS: APPROVED & LOCKED]

Primary Sprint Objective

All specific technology stacks, frameworks, and rendering libraries are intentionally omitted and decoupled from this plan for independent research. The roadmap is structured purely around high-level user outcomes and functional goals.

Goal 1: Zero-Install Browser AR Foundation (Launch an in-browser camera AR experience across modern mobile devices).

Goal 2: Physical Surface Detection & Targeting (Detect flat surfaces like floors and desks, providing an intuitive placement reticle).

Goal 3: Realistic Surface Grounding (Ensure 3D objects feel anchored to the real world through contact shadows rather than floating).

Goal 4: Multi-Type 3D Asset Spawning (Validate spawning static items, animated models, and simple interactive tap-to-toggle items).

Goal 5: Fluid Spatial Manipulation & Surface Snapping (Provide natural touch controls to drag, rotate, scale, and toggle surface snapping to clamp objects flush to planes, plus lock-in-place).

Goal 6: QR Code Item Summoning (Allow pointing the camera at a physical QR card/sticker to instantly materialize the corresponding item in AR). 

Goal 7: Single-Room Memory & Restoration (Save object positions across sessions so users can leave and reload their customized room layout).

High-Level Deferred Goals (Out of Scope for Sprint 1)

Custom user uploads

Multi-room management

Cloud sharing

Depth occlusion

Screen 5: Scene Hierarchy & Object Inspector (Slide-out drawer showing active placed items, hide/show toggles, surface snap targets [Floor, Wall, Tabletop], and delete/duplicate actions).

Screen 6: Persistence & Sharing (Save to IndexedDB, cloud sync, and generation of a read-only shareable room link).