/* TODO
  - [ ] COMMENT THE FUCK OUT OF IT, WITH REFERENCE TO TRIG PROBLEMS
*/


//requires THREE.js
var IK = (function (self) {
  self.origin;
  self._debug = false;



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

      var ve = crossProduct(  new THREE.Vector3(0,0,1), vec3 );
      var test = {x: vec3.x , y: 0 , z: vec3.z }

      if(self._debug){
      console.log("dist", c);
      console.log("B",B);
      console.log('C',C);
      console.log('D', D);
      console.log('E', E);
      console.log('F', F);
      console.log("DIF FD", D-F);
      console.log("\n\n");
      }
      var out = {
        baseAngleToTarget : baseAngleToTarget,
        shoulderAngle : ( angleBetween(test, vec3 ) + B  ) + Math.PI/2 * -1,//( D + B ) + Math.PI/2 *-1 ,
        elbowAngle : C - Math.PI //C - Math.PI//E *-1
      }

  // console.log("base angle to target", baseAngleToTarget);
  // console.log( "#D ",angleBetween(new THREE.Vector3(0,0,1), vec3 ) );
  // console.log( " D ", D );


  console.log("dd", D ,  angleBetween(test, vec3 ) );
  // console.log("angle", D, Math.atan2(ve.z, ve.y  ) );

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
  /**
    @method vectorLegth
    - Calculate the length of a single vector
    - takes in the vector as a Array or as an object
    USEFUL LINKS: [Simply put](https://chortle.ccsu.edu/VectorLessons/vch04/vch04_8.html)

     | (1, 2, 3)T |   =  √( 12 + 22 + 32 )   =  √( 1 + 4 + 9 )  =  √14   =   3.742

  */
  function vectorLegth( _v ){
    var length = 0;

    if (_v.x != undefined ) {
      for (var axis in _v) {
        if (_v.hasOwnProperty(axis)) {
          length += Math.pow(_v[axis],2);
        }
      }
    }
    else if(_v.length != undefined ){
      for (var i = 0; i < _v.length; i++) {
        length += Math.pow(_v[i],2);
      }
    }
    else {
      console.warn("Format of the Vector or matrices is incorrect");
    }
    return length = Math.sqrt(length);
  }

  /**
  @method clamp
    - Clamp value betweenn min and max
    NOTE: this should eventually end up in a Math class

  */
  function clamp ( value, min, max ) {

		return Math.max( min, Math.min( max, value ) );

	}

  /**
  @method dotProduct
  @param {Array||object} _a A vector 3D organized as legth 3 array or and object with x, y ,z keys
  @param {Array||object} _b A vector 3D organized as legth 3 array or and object with x, y ,z keys
    - calculate the dot product between to matrices or vectors
    Useful reference: [practice dot vectors](https://www.symbolab.com/solver/vector-dot-product-calculator/%5Cbegin%7Bpmatrix%7D1%262%263%5Cend%7Bpmatrix%7D%5Ccdot%5Cbegin%7Bpmatrix%7D1%265%267%5Cend%7Bpmatrix%7D?or=ex)
    NOTE: this should eventually end up in a Vector class
  */

  function dotProduct ( _a, _b ){
    var _dot = 0;

    if (_a.x != undefined && _b.x != undefined) {
      for (var axis in _a) {
        if (_a.hasOwnProperty(axis)) {
          _dot += _a[axis] * _b[axis];
        }
      }
    }
    else if(_a.length != undefined && _b.length != undefined){
      for (var i = 0; i < _a.length; i++) {
        _dot += _a[i] * _b[i];
      }
    }
      else {
      console.warn("Format of the Vector or matrices is incorrect");
    }


    return _dot;
  }
  /**
  @method angleBetween
  @param {Array||object} _a A vector 3D organized as legth 3 array or and object with x, y ,z keys
  @param {Array||object} _b A vector 3D organized as legth 3 array or and object with x, y ,z keys
    - calculate the the angle between two vector
    Useful reference: algorithm from THREE.js
      * [Euclidian spaces](http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/)
  */
  function  angleBetween ( _a, _b ) {

    var theta = dotProduct( _a, _b ) / ( Math.sqrt( Math.pow(vectorLegth(_a),2) * Math.pow(vectorLegth(_b),2) ) );

    // clamp, to handle numerical problems
    return Math.acos( clamp( theta, - 1, 1 ) );

  }
  /**
  @method crossProduct
  @param {object} _a A vector 3D organized as legth 3 array or and object with x, y ,z keys
  @param {object} _b A vector 3D organized as legth 3 array or and object with x, y ,z keys
    - calculate the cross product the angle between two vector
    Useful reference: algorithm from THREE.js
  */
  function crossProduct( _a, _b ) {

    var ax = _a.x, ay = _a.y, az = _a.z;
		var bx = _b.x, by = _b.y, bz = _b.z;
    var vec3 = {};
		vec3.x = ay * bz - az * by;
		vec3.y = az * bx - ax * bz;
		vec3.z = ax * by - ay * bx;

		return vec3;

	}

  return self;
}(IK || {}));
