# software
## TODO
### Client Side
#### ik
- [ ] Clean code
- [ ] Organize Module
- [ ] Map angles to degrees and positive values: X (base) 0 to center, Y (Shoulder) 0 straight up, Z (Elbow) 0 pointing down.
- [ ] Solve vec3D rotation angle
- [ ] Solve the negative number space mapping.
- [ ] Comment the fuck out of it, with reference to articles that lead to solution.

#### SCENE
- [X] Get GUI out of it
- [ ]

#### GCODESENDER
- [x] GRLB interface commands
- [x] A-l-l--O-F--T-H-E-M
- [x] GUI should just call methods of GCODESENDER

#### ARM
- [ ] Should deal with SCRENE and GUI
- [x] Arm should have IK as a dependency.
- [x] Config Can go. and move the content to arm.

#### GUI
- [x] CAMERA folder: with positions like top; left; etc. reset
- [x] GRLB interface folder: homing, $X, $C, $G, reset to specific position
- [ ] LOG option: LOW PRIORITY
- [ ]

### Server Side
#### App.js
- [ ] dfds

#### MotionManager
- [ ] Make module work
- [ ] Put everything related to the motion contoller here: buffer, timings, array etc.
- - Socket relays GCODE to MM and MM handles the Buffer.


### dependencies
* node
* bower

## install

on `./SW` run `npm install` then in `/SW/client` run `bower install`


## run
From `./SW` dir:
```
npm start
```
