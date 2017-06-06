console.log("READY");

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic("./client")).listen(8080, function(){
    console.log('Server running on 8080...');
});




const Kinematics = require('kinematics').default

const geometry = [
      [1,  1,  0], // V0: 1x 1y
      [0, 10,  0], // V1: 10y
      [5,  0,  0], // V2: 5x
      [3,  0,  0], // V3: 3x
      [0, -3,  0], // V4: -3y
    ]

const RobotKin = new Kinematics(geometry)

let angles = [1.57, 1.2, 0, 0.3, 2.2, 1.1]

const pose = RobotKin.forward(...angles)[5]

angles = RobotKin.inverse(...pose)

console.log(angles);
let angles1 = RobotKin.inverse(...pose)
angles1[2] += angles1[1]
console.log("compare ");
console.log(angles1);
