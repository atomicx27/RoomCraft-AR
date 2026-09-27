RoomCraft AR — Sprint 1 (MVP) Implementation Plan

1. Primary Sprint 1 Mission

The singular objective of Sprint 1 is to build and validate the core end-to-end "magic moment" of RoomCraft AR directly within a mobile web browser: A user opens a web link on their mobile device, activates their camera, detects a physical tabletop or floor, summons a 3D object from a catalog or by scanning a physical QR card, manipulates and snaps it into place with realistic contact shadows, and saves their room layout so it reloads seamlessly when they return.

2. Sprint 1 Functional Milestones & Goals

Milestone 1: Zero-Install Mobile Browser Launch

What We Want:

A responsive web page that opens cleanly on both modern Android and iOS smartphones.

When the user taps "Enter AR" and grants camera permission, the mobile camera feed immediately activates as a full-screen augmented reality viewport.

No app store downloads or external viewers required.

Success Criteria: A fluid, full-screen camera experience operating at smooth frame rates across standard mobile browsers on both major operating systems.

Milestone 2: Surface Detection & Placement Reticle

What We Want:

The app must recognize flat horizontal surfaces in the real world (such as a desk, dining table, or living room floor).

A visual targeting reticle (ring) glides along detected surfaces as the user moves their phone.

The reticle provides visual feedback (e.g., changing color or pulsing) to confirm when a solid, stable surface is found.

Success Criteria: The reticle smoothly tracks real physical surfaces without drifting or jittering erratically.

Milestone 3: Realistic Surface Grounding (Contact Shadows)

What We Want:

Virtual objects placed in the room must look like they truly belong there, rather than floating awkwardly in mid-air.

Each placed 3D object casts a soft, natural contact shadow directly onto the physical floor or tabletop beneath it.

Success Criteria: Objects appear firmly resting on real-world surfaces with realistic shadow contrast under typical room lighting.

Milestone 4: Starter 3D Object Spawning

What We Want:

A curated starter bundle of 3 to 4 distinct proof-of-concept 3D models accessible from a clean slide-up bottom drawer:

Static Decor Piece: A high-quality model (e.g., an aesthetic potted plant or modern chair) to test realistic textures.

Animated Asset: A model with continuous movement (e.g., a rotating kinetic art sculpture or idling character) to validate motion.

Interactive Object: A functional item (e.g., a modern desk lamp) that responds to a finger tap—tapping it toggles its light on and off with visible illumination.

Tapping an item in the drawer spawns it cleanly at the reticle's active position in the room.

Success Criteria: All three asset categories spawn reliably, play their respective animations, and respond correctly to touch.

Milestone 5: Fluid Spatial Manipulation & Surface Snapping

What We Want:

Natural, tactile touch controls:

1-Finger Drag: Slides the object smoothly across the detected surface.

2-Finger Twist: Rotates the object around its vertical axis to face any angle.

Pinch: Scales the object larger or smaller within safe visual limits.

Surface Snapping Toggle: A quick button that instantly clamps the bottom base of the object flush against the detected floor or tabletop.

Lock in Place: An option to lock an object once positioned to prevent accidental movements while walking around.

Success Criteria: Objects can be easily repositioned, rotated, resized, snapped to surfaces, and locked with intuitive touch gestures.

Milestone 6: Physical QR Card Item Summoning

What We Want:

Bridging the physical and digital worlds using QR markers.

A quick "Scan Item" camera button in the interface.

When the camera is pointed at a physical card, sticker, or packaging containing an item QR code, the app reads the code, identifies the model, and materializes the 3D item directly in front of the user at the reticle.

Success Criteria: Scanning a sample QR card successfully unlocks and places the matching 3D object into the scene without page reloads.

Milestone 7: Single-Room Memory & Layout Restoration

What We Want:

Persistent spatial memory across browser sessions.

When a user finishes placing their items, a "Save Room" action commits the layout (which items were placed, their positions, rotations, scale, and lock states).

When the user closes the browser and returns later, a "Restore Room" action re-instantiates all objects in their saved arrangement.

Success Criteria: Refreshing or reopening the web page allows the user to restore their custom arrangement without starting from scratch.

3. Explicitly Out of Scope for Sprint 1

To ensure high quality, focus, and a shippable MVP, the following advanced capabilities are deliberately deferred to future development sprints:

Custom user file uploads (importing external 3D files from the device).

Multi-room manager dashboard (switching between multiple named rooms).

Complex physical QR room anchor coordinate relocalization math.

Real-world depth occlusion (automatically hiding virtual models behind real-world physical furniture).

Cloud database synchronization and shareable web links for friends.