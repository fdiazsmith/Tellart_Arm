/* TODO
  - [ ] COMMENT THE FUCK OUT OF IT, WITH REFERENCE TO TRIG PROBLEMS
*/

//requires THREE.js
var IK = (function (self) {
  self.origin;

  // function getDistance from
  self.target = function(vec3){


  var distanceFromBase =  Math.sqrt(Math.pow( vec3.x ,2) + Math.pow( vec3.z,2));
  var baseAngleToTarget =  Math.atan2(vec3.z - self.origin.z, vec3.x - self.origin.x) * -1; //in radians

  var dist = distanceVector(self.origin, vec3),//Math.sqrt(dx * dx + dy * dy),
      dx =vec3.x - self.origin.x,
      dy = vec3.y - self.origin.y,// was with y
      a = 10, //shoulder to elbow segment length
      b = 10, //elbow to target   segment length
      c = Math.min(dist, a + b),
      B = Math.acos((b * b - a * a - c * c) / (-2 * a * c)), // shoulder angle from XZ plane to line
      C = Math.acos((c * c - a * a - b * b) / (-2 * a * b)), // elbowAngle
      D = Math.atan2(dy,dx),
      F = Math.atan2(vec3.z, dy ),//
      E = D + B + Math.PI + C ;

      console.log("dist", c);
      console.log("B",B);
      console.log('C',C);
      console.log('D', D);
      console.log('E', E);
      console.log('F', F);
      console.log("DIF FD", D-F);
      console.log("\n\n");
      var out = {
        baseAngleToTarget : baseAngleToTarget,
        shoulderAngle : ( D  + B  ) + Math.PI/2 * -1,//( D + B ) + Math.PI/2 *-1 ,
        elbowAngle : C - Math.PI //C - Math.PI//E *-1
      }

  // console.log("base angle to target", baseAngleToTarget);

  // console.log("home brew distance", distanceFromBase );
  // console.log("angle shoulder", vec3.angleTo(new THREE.Vector3(0,0,1)));
  // console.log("angle elbow", vec3.angleTo(new THREE.Vector3(0,0,1)));
  return out;
  }

  function degToRadians(_deg){
    return _deg //* Math.PI / 180;
  }
  function distanceVector( v1, v2 ){
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
  }

  return self;
}(IK || {}));
