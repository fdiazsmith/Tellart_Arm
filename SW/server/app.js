console.log("READY");

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic("./client")).listen(8080, function(){
    console.log('Server running on 8080...');
});


//
//
// const Kinematics = require('kinematics').default
//
// const geometry = [
//       [1,  1,  0], // V0: 1x 1y
//       [0, 10,  0], // V1: 10y
//       [5,  0,  0], // V2: 5x
//       [3,  0,  0], // V3: 3x
//       [0, -3,  0], // V4: -3y
//     ]
//
// const RobotKin = new Kinematics(geometry)
// console.log(RobotKin);
//
// let angles = [0, 0, 0, 0, 0, 1]
// console.log('angles from array\n',angles);
// const pose = RobotKin.forward(...angles)
//
// console.log('angles forward\n',pose);
//
// var testA = [
//   5,5,0, 0, 0,0
// ]
// angles = RobotKin.inverse( ...testA )
//
// console.log('angles inverse\n',angles);
