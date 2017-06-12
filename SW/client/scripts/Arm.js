/* TODO
  - [ ] create a method to generate vector geometry form Arm Measurements
*/

var ARM = (function (self) {
  // self.kin =  new Kinematics(self.geometry);
  console.log( self);
  var _kinematics = IK;
    self.debug = false;

    self.base_height 			= 			 5;
    self.base_radius 			= 			 5;
    self.base_offset 	  	= 		 2.5;

    self.lowerArm_height		=  13.75;
    self.lowerArm_radius		= 	 1.5;
    self.lowerArm_offset		=		 2.2;

    self.upperArm_height 	= 		14.9;
    self.upperArm_radius		=			 5;


    self.geometry = [
      // X   Y   Z
      [0,  0,  0],
      [0, 10,  0],
      [0, 10,  0],
    ]

    _kinematics.origin = { x : self.geometry[0][0], y : self.geometry[0][1], z : self.geometry[0][2] };

    self.move = {
    inverse : function(_a){
      return _kinematics.target(_a);
    }
  }

  // var _private = self._private = self._private || {},
  //
  // _seal = self._seal = self._seal || function () {
  //   delete self._private;
  //   delete self._seal;
  //   delete self._unseal;
  // },
  // _unseal = self._unseal = self._unseal || function () {
  //   self._private = _private;
  //   self._seal = _seal;
  //   self._unseal = _unseal;
  // };
  // permanent access to _private, _seal, and _unseal

  return self;
}(ARM || {}));
