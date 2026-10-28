# NEXA PARKING 3064 — implementation contract
This is milestone development, not a claim of AAA production completion.

Architecture: Vite / strict TypeScript, Three.js rendering, Rapier WASM fixed 60 Hz rigid bodies and raycast vehicle suspension, independently testable oriented-footprint parking evaluation, local versioned saves, DOM interfaces, pointer-based multi-touch input. Positive Z is vehicle-forward; Y is up. Physics owns chassis transform; meshes copy physics state. Only explicit reset teleports.

Assets: original procedural vehicles/environment, no external model or texture license dependencies. Procedural cars are stylized original assets, not hyper-realistic scanned production models. Libraries retain their original licenses (Three.js MIT, Rapier Apache-2.0, Vite MIT). No monetization or paid API.

Acceptance milestones:
1. Drive with keyboard/touch; collide; park complete footprint within bay, stationary in P for 2 seconds; score, restart, menu, save. Automated physics and validation tests plus browser smoke check.
2. Refined suspension, steering, collision penalties, sensor accuracy, camera obstruction tests on real devices.
3. Production art, sound mix, PBR lighting, measured budgets and mobile QA.
4. 50 individually validated missions across 8 environments, progression and achievements.
5. Full garage and cosmetic options applied consistently in play and saved.
6. Rule-based traffic, weather, assistance, replay, all specified game modes.
7. Browser/device matrix, long-session profiling, all acceptance tests and release review.

Current scope and verification are recorded in README. Later milestones must preserve working modules and save compatibility.
