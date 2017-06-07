/* TODO
  - [ ] create a method to generate vector geometry form Arm Measurements
*/

var ARM = (function (my) {
  my.kin =  new Kinematics(my.geometry);
  console.log( my);
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
