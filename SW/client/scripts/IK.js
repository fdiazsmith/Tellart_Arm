/* TODO
  - [ ]
*/

//requires THREE.js
var IK = (function (self) {
  self.origin;

  // function getDistance from
  self.target = function(vec3){


  var distanceFromBase =  Math.sqrt(Math.pow( vec3.x ,2) + Math.pow( vec3.z,2));
  var baseAngleToTarget =  Math.atan2(vec3.z - self.origin.z, vec3.x - self.origin.x) * -1; //in radians

  var dx = vec3.x - self.origin.x,
      dy = vec3.y - self.origin.y,// was with y
      dist = Math.sqrt(dx * dx + dy * dy),
      a = 10, //segment length?
      b = 10, //segment length?
      c = Math.min(dist, a + b),
      B = Math.acos((b * b - a * a - c * c) / (-2 * a * c)),
      C = Math.acos((c * c - a * a - b * b) / (-2 * a * b)),
      D = Math.atan2(dy, dx),
      E = D + B + Math.PI + C ;
      // console.log("compare", dist, distanceFromBase);
      console.log("B",B);
      console.log('C',C);
      console.log('D', D);
      console.log('E', E);
      console.log("\n\n");
      var out = {

        baseAngleToTarget : baseAngleToTarget,
        shoulderAngle : ( D + B ) + Math.PI/2 ,
        elbowAngle : E 
      }

  // console.log("base angle to target", baseAngleToTarget);

  // console.log("home brew distance", distanceFromBase );
  // console.log("angle shoulder", vec3.angleTo(new THREE.Vector3(0,0,1)));
  // console.log("angle elbow", vec3.angleTo(new THREE.Vector3(0,0,1)));
  return out;
  }
  return self;
}(IK || {}));
