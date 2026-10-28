# NEXA PARKING 3064 / UI 03
Design-first interaction contract, 26 October 2026.

The generated two-screen design board is an art-direction reference, not a gameplay screenshot. Real 3D assets remain procedural; matching the reference's photographic fidelity is not claimed.

Palette: graphite #090d12, cool white #f4f7fa, cyan #83eeff, muted steel #8a9ca8. Light typography, thin borders, broad cinematic car space, natural showroom light. All existing saved names, credits, mission records and vehicles are retained.

| Screen / button | Result |
|---|---|
| Start Parking | Six challenge cards, difficulty, parking type and selected vehicle |
| Challenge card | Load actual mission and selected car; show bay number and direction |
| Change Car / Garage | Six selectable cars, actual dimensions/mass, finish controls |
| Select & Drive | Save selected vehicle, go to challenge list |
| Free Drive | Training world with no mission timer or scoring |
| How to Play | Explicit manual transmission and touch instructions |
| Profile | Edit name, stats, save export/import, confirmed reset |
| Settings | Functional quality and audio controls |
| Gear R | Queue braking while moving, select reverse near zero speed, rear-facing camera; accelerator moves backward |
| Gear D | Queue braking while moving, select forward near zero speed and follow camera |
| Camera | Follow → overhead → hood → orbit → rear-facing camera |
| Change Car during drive | Pause attempt and open garage; resume starts this mission with selected car |
| Restart | Reset vehicle, attempt timer, collision penalty and input state |
| Pause | Freeze physics, clear held inputs; resume/restart/menu |
| Complete | Score breakdown, credits, retry or next challenge |

HUD is deliberately compact: mission/distance/alignment at upper left; camera/restart/change car/pause at upper right; physical displacement speed and explicit gear at bottom center. Mobile steering and labeled brake/accelerator controls remain separate multi-touch targets. A distinct handbrake button is included.

Parking spaces use contrasting boundary paint, A01–A06 ground labels and chevrons facing the required direction. Dashed center lines and frequent asphalt markings provide visible motion references, including in reverse. The minimap shows actual car/target positions.

Do not introduce placeholder features. Full campaign, traffic, weather and production assets remain separate future work.

Build 0.3 adds a dedicated held Reverse pedal, a Show Parking Bay overview, a tall destination beacon, stronger service brakes, and distinct Italian-supercar/two-tone-hypercar procedural bodies. R key now selects reverse; Backspace restarts.
