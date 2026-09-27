RoomCraft AR — Design & User Experience Specification

1. Design Philosophy: "The Room Architect"

The user experience of RoomCraft AR is designed to feel like an empowering, calm, and creative spatial interior studio. Rather than an abrupt camera feed, it treats the user's physical environment with respect, providing intentional room management, guided spatial calibration, tactile manipulation controls, and permanent layout memory.

2. Screen-by-Screen Journey & User Interface

Screen 1: Spaces Dashboard (2D Web View)

Purpose: The welcoming home base where users organize and manage their different living spaces before entering augmented reality.

Key UI Elements:

Room Cards Grid: Visual cards for each created room (e.g., "My Work Desk", "Bedroom Sanctuary", "Reading Nook").

Each card displays the room name, count of placed 3D objects, last saved date, and a visual room snapshot.

An [Enter Room in AR] primary button to launch directly into the space.

New Space Action: A prominent [+ Create New Room] button to start a fresh room layout.

Anchor Utility: A [Download Room Anchor] link providing a printable visual marker card that users can place on their desk or wall for exact spatial memory.

Screen 2: Calibration & Tracking Setup Modal

Purpose: Prepares the user and device before entering the camera feed, setting expectations on how spatial memory will be established.

User Options:

Anchor Calibration Mode (High Precision):

Prompt: "Point your camera at your printed anchor card on your desk or wall to load your saved room."

Scanning the marker establishes the physical origin point (0, 0, 0) so all items appear exactly where you left them.

Free-Form Surface Mode:

Prompt: "Slowly pan your camera over your floor or table surface to begin placing objects."

Ideal for quick, casual placement without physical paper anchors.

Onboarding Guide: A simple animated graphic demonstrating how to move the phone smoothly to let the camera detect surfaces.

Screen 3: The AR Design Studio (Main Viewfinder HUD)

Purpose: The active augmented reality canvas where virtual objects coexist with the real room.

Key UI Elements:

Top Status Bar:

Active Room Name with a quick dropdown to switch spaces.

Visual tracking status indicator (green badge indicating stable surface tracking).

[Save Room] action button with an indicator showing when unsaved changes exist.

Center Viewport:

An animated surface-hugging reticle (targeting ring) that glides across detected floors and tabletops, visually confirming where the next object will land.

Soft, realistic contact shadows projected directly onto the physical surface beneath every 3D object to anchor it visually to reality.

Bottom Floating Action Dock:

[+ Catalog / Summon] (primary button that opens the asset drawer).

[Scan Item QR] (instant camera mode to scan collectible packaging or cards).

[Snap: ON/OFF] (quick toggle between free-form touch and surface snapping).

[Scene List] (opens the layer manager of placed items).

Screen 4: Summoning & Catalog Drawer (Sliding Half-Sheet)

Purpose: The gateway to discover, inspect, and introduce 3D objects into the physical space.

Drawer Sections:

Tab 1: Curated Library: Categorized into Furniture & Decor, Collectibles & Sculptures, Animated Characters, and Interactive Gadgets.

Tab 2: Custom Uploads: Allows users to import and test their own 3D files directly into the room.

Tab 3: Scan QR: Activates an in-app viewfinder to scan physical cards or stickers, instantly materializing the associated item.

Spawning Action: Tapping an item triggers a smooth entrance animation, materializing the model at the reticle position in the room.

Screen 5: Object Manipulation & Scene Hierarchy

Purpose: Giving the user tactile, precise control over the arrangement of their virtual room.

Direct Touch Controls:

1-Finger Drag: Moves the object smoothly across the detected surface.

2-Finger Twist: Rotates the object around its vertical axis to face the desired direction.

Pinch-to-Resize: Scales the object proportionally up or down to fit the space.

Surface Snapping Toggle:

When enabled, items automatically snap flush to detected horizontal planes (desks, tables, floors) or vertical planes (walls for paintings or posters), preventing models from awkwardly hovering in mid-air.

Selection Controls & Bounding Box:

Tapping a placed object highlights it with a subtle bounding outline and reveals floating action pills: [Lock / Unlock], [Snap Target], [Duplicate], and [Delete].

Lock in Place: Disables movement handles, allowing the user to walk around the room without fear of accidentally displacing items.

Scene List Drawer: A slide-out panel showing an organized inventory of every object currently in the room, with quick options to focus, hide, or remove items.

Screen 6: Persistence, Saving, and Sharing

Purpose: Locking in the user's creative work and sharing the experience.

Save Action: One tap saves the entire room layout (object types, exact positions, rotations, scale, and lock states).

Return Visit: When the user returns to the room link later, scanning their anchor or surface immediately reloads the room as they left it.

Shareable Room Link: An optional action that generates a link allowing friends to walk through and view the created room in augmented reality on their own mobile devices.