# NEXA PARKING 3064
Precision Beyond Reality.

**Driving build 0.3.2: dedicated reverse pedal, queued direction changes, stronger brakes and distinct supercar bodies. Not a completed AAA game.**

See `DESIGN.md` for the screen-by-screen interaction contract. The generated design board is a visual reference, not a gameplay screenshot or a claim of achieved photorealism.

## Run locally
Requires Node.js 22.12+ and npm. Extract the source archive and open a terminal in its folder.

```sh
npm ci
npm run dev
```
Open the local URL Vite prints. WebGL2 must be enabled. The game is static: no account server, paid API, ads, subscription or purchases.

```sh
npm test
npm run build
npx vite preview --host 0.0.0.0
```
`dist/` is the deployable site. Relative asset paths support GitHub Pages repository subpaths. Do not open index.html using file://.

## Implemented
- Real Three.js WebGL rendering, PBR clear-coat materials, environment reflections, directional shadows, original procedural showroom, training center and six car shapes.
- Rapier rigid-body chassis, four raycast suspension wheels, front-wheel traction, steering with Ackermann-inspired inside/outside angles, braking, reverse, speed-dependent steering, CCD and rigid obstacle collisions. Physics runs at 60 Hz with capped catch-up.
- Mandatory first-use name, initials, profile rename; six distinct training challenges; free driving.
- Full oriented vehicle footprint containment, angular tolerance, stationary requirement, Park gear, penetration check and 2-second continuous hold.
- Deterministic weighted scoring, impact penalties, best scores, repeatable credits (75 base plus 5 per personal-best point), persistent credits. All six cars are now immediately selectable without spending credits; old progress remains intact.
- Six-car gallery, saved vehicle selection, paint color applied in gameplay; vehicle dimensions/mass/power differ. In-game Change Car explicitly restarts the current mission with the chosen car.
- Five driving cameras: follow, overhead, hood, manually rotated orbit and rear-facing view, plus a Show Parking Bay overview. Selecting R activates rear view; selecting D restores follow view. P/R/N/D requests automatically brake while moving and shift below 0.18 m/s instead of rejecting the request. Headlights, brake lights, power toggle.
- Pointer-captured multi-touch steering, accelerator, brake and handbrake; keyboard driving; pause/resume/reset/menu navigation.
- Versioned localStorage saves, import validation, export, explicit reset confirmation. Unreadable existing saves are preserved rather than silently overwritten.
- Graphics presets change pixel ratio/shadow enablement; master audio slider changes synthesized motor and feedback sounds. No external audio assets.
- Displacement-based speed and traveled distance, actual-position minimap, labeled manual transmission, numbered parking bays and directional chevrons.
- Graceful WebGL/initialization failure screen.

## Controls
Select **D** to drive or **R** to reverse while stationary. **W / Up** accelerates in the selected gear. **S / Down** brakes (does not automatically reverse). **A / Left**, **D / Right** steer. **Space** rear handbrake. **C** camera. **R** selects reverse; **Backspace** restarts. **Escape / P** pause. **E** motor power. **L** headlights. On mobile, hold the dedicated **R / REVERSE** pedal to stop forward motion, shift, then reverse. Releasing it releases throttle. BRAKE always overrides accelerator/reverse. Click D to return to forward gear. Gear letters are also clickable controls. Drag the 3D scene in Orbit camera to rotate.

Park inside the cyan bay facing its direction. Stop fully, select **P**, hold two seconds. Driving into obstacles reduces the score. Restart clears the current attempt; previously saved progress remains.

## Verification performed
2026-10-26: **51 Vitest tests passed**, including real Rapier forward acceleration, braking, reverse, gear guard, steering direction, stable rest, wheel-ground contacts, solid-wall collision and an automated drive → brake → Park → continuous 2-second parking completion sequence. Parking logic tests reject off-footprint, incorrect-angle, moving, unparked and obstructed poses; rotated bays, score determinism and invalid imports are checked.

Additional regressions verify reverse translation and synchronized rendered transforms for all six cars in the actual level, multi-pointer cancellation/clearing, no inflated speed while pushing into a reverse obstacle, and valid unobstructed start/target footprints for all 36 car/mission combinations. Target-pose tests are not full driving-route tests.

The reported mobile reverse symptom could not be reproduced in headless physics. Identified input hazards were fixed: changing gears no longer destroys/recreates touch controls; pointers clear on gear changes/cancel/lost capture; brake input suppresses propulsion. The HUD measures actual displacement instead of solver velocity. Build 0.3 additionally fixes R-key restart ambiguity, adds a direct reverse pedal, handles nested-label pointer capture transfer, queues direction changes and increases service braking impulse. These changes do not establish that every real-device symptom is resolved.

TypeScript production build passed before the final packaging build; packaging repeats the build after final edits. Vite warns about the large Rapier WASM payload. Initial load is about 1 MB compressed plus renderer, fonts and app files.

Browser QA attempted in the provided cloud Chrome. **WebGL was disabled by that browser environment**, so the real error screen was observed. Successful 3D rendering, touch interaction, complete menu flows, sustained performance, real-device visuals and full browser gameplay remain **unverified**. This is a verification limitation, not evidence that every browser fails. The additional jsdom tests exercise the same DOM pedal/gear binding and direction controller used by the live game, connected to real Rapier physics. They cover nested-label capture transfer, R + accelerator, dedicated reverse, queued shifts and brake priority; all six cars stop within 1.5 seconds and 4 metres in the tested acceleration scenario. jsdom is not a real mobile browser and does not validate hit testing, layout or WebGL. No Playwright integration suite has been executed. No 60 FPS claim.

## Remaining milestones / limitations
The 50-level, eight-environment production specification is **not complete**. Six authored training layouts are included; they are not 50 distinct challenges. Only the first mission has an automated end-to-end physics completion test; remaining layouts require driving validation on real devices.

Pending: production-quality detailed car interiors/exteriors; cockpit/cinematic cameras and obstruction avoidance; 44 more campaign missions and remaining environments; collision-sensitive no-collision/time-trial/expert modes; traffic, signals and pedestrians; weather/traction/rain; replay; front/rear sensors and guidelines; achievements; IndexedDB migration; key rebinding; touch steering-wheel/indicator controls; wheels/interior/license plate customization; layered spatial audio; adaptive resolution, LOD/instancing, profiling and cross-device QA. Saves currently use localStorage, not IndexedDB. Wheel radius and suspension tuning share defaults across classes. The suspension/traction model is a practical raycast simulation, not a validated engineering tire model. Loading uses real phase messages, not a fake percent. External Google Fonts have local font fallbacks. No photorealism or ray-tracing claim.

## Project structure
- `ARCHITECTURE.md`: ownership boundaries and milestone acceptance criteria.
- `src/physics/VehiclePhysics.ts`: Rapier dynamics, gears, wheel forces.
- `src/gameplay/parking.ts`: pure footprint/scoring logic and challenge definitions.
- `src/vehicles/`: vehicle definitions and original procedural geometry.
- `src/environment.ts`: rendered and collidable environment.
- `src/storage/save.ts`: versioned validation and safe local persistence.
- `src/input/TouchState.ts`: per-pointer input ownership and cancellation.
- `src/physics/MotionTelemetry.ts`: real displacement telemetry.
- `src/rendering/syncVehicle.ts`: direct physics-to-render transform synchronization.
- `src/main.ts`: current screen orchestration, loop, cameras, input and audio; split these into dedicated managers in milestone 2 without changing public behavior.
- `tests/`: deterministic logic and headless real-physics tests.

## GitHub Pages deployment (not performed here)
The included workflow uses GitHub Pages static hosting. These commands are for a **new extracted copy**, not a Sites-managed checkout. Authenticate the GitHub CLI first. Choose a different repo name if it already exists.

```sh
git init
git add .
git commit -m "Add NEXA PARKING 3064 foundation"
git branch -M main
gh auth login
gh repo create nexa-parking-3064 --public --source=. --remote=origin --push
gh api --method POST repos/{owner}/{repo}/pages -f build_type=workflow
gh workflow run pages.yml
gh run list --workflow pages.yml
```
If Pages already exists, select Settings → Pages → Source → GitHub Actions instead of the POST. On success the Actions deployment step returns the exact URL. Subsequent release: `git add .`, `git commit`, `git push`, then `gh workflow run pages.yml`. The workflow only runs on explicit dispatch.

## Licensing
Original project source and procedural art: MIT; see LICENSE. Velocity Rosso uses an original Italian-supercar wedge, side scoops, rear louvers, round taillights and aero wing. Hyperion Royale uses an original rounded two-tone hypercar body, side arcs, horseshoe-style grille and full-width rear light. These are procedural design-inspired cars, not official Ferrari/Bugatti assets or photorealistic replicas. No downloaded third-party car models. Three.js (MIT), Rapier (Apache-2.0), Vite/TypeScript/Vitest and their dependencies retain upstream licenses; see installed package LICENSE files and lockfile. Inter and Barlow Condensed are served by Google Fonts under the SIL Open Font License with system fallbacks. No recurring paid service is needed for core gameplay.

## 0.3.1 — reproduced idle/sleep reverse and gear-lock defect
User video showed zero traveled distance and 0 km/h while the HUD remained BRAKING → DRIVE. A new test waiting 20 seconds in Park reproduced the issue before the patch: chassis remained sleeping, translation z=0, but solver speed reached 5.0818 m/s after reverse throttle. Earlier tests accelerated before the body had slept, so missed this case.

The raycast controller modifies velocity without necessarily waking the chassis. VehiclePhysics now wakes the body on throttle, brake, steering, handbrake and accepted gear changes, and skips controller updates on an inactive sleeping body. This prevents fictitious velocity buildup and the subsequent gear-speed guard deadlock. No renderer, input, level or save rebuild was needed.

Seven new regression tests pass: all six cars wait in Park, reverse with ordinary throttle, request Drive during reverse, brake/shift and move forward, then repeat after a second sleep. An already-selected Reverse gear also wakes correctly on ordinary throttle. All 51 tests pass. These are actual Rapier/DOM tests; full mobile/WebGL verification remains unavailable in this execution browser.

## 0.3.2 — Urban parking completion and actionable guidance

Urban offset now accepts a fully contained, aligned car facing either direction. Previously its directional heading gate rejected a car facing 180 degrees despite an identical footprint. Other missions retain their direction requirements; their painted chevrons now point toward the required heading. The HUD reports outside footprint, alignment, obstacle contact, motion, or missing Park rather than a misleading generic prompt. Completion still requires two stationary seconds in Park, followed by the score screen and Next Challenge button.

58 automated tests pass, including all six physical vehicles holding valid Urban parking in both directions and rejection of invalid parking. Production build checked. This addresses a reproducible validator restriction; the user's precise phone attempt was not captured, and real-device confirmation remains outstanding. Browser WebGL verification remains unavailable in the current test environment.
