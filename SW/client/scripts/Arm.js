/* TODO
  - [ ] create a method to generate vector geometry form Arm Measurements
*/

var ARM = (function (my) {
  // my.kin =  new Kinematics(my.geometry);
  console.log( my);

    my.base_height 			= 			 5;
    my.base_radius 			= 			 5;
    my.base_offset 	  	= 		 2.5;

    my.lowerArm_height		= 	 13.75;
    my.lowerArm_radius		= 			 1.5;
    my.lowerArm_offset		=			 2.2;

    my.upperArm_height 	= 		14.9;
    my.upperArm_radius		=				 5;


    my.geometry = [
      // X   Y   Z
      [0,  0,  0], // V0:
      [0, 10,  0], // V1:
      [0,  10,  0], // V2:
      // [7,  0,  0], // V3:
      // [0, -4,  0], // V4:
    ]



  var _private = my._private = my._private || {},

  _seal = my._seal = my._seal || function () {
    delete my._private;
    delete my._seal;
    delete my._unseal;
  },
  _unseal = my._unseal = my._unseal || function () {
    my._private = _private;
    my._seal = _seal;
    my._unseal = _unseal;
  };
  // permanent access to _private, _seal, and _unseal

  return my;
}(ARM || {}));
