var GCODE_SENDER = (function (my) {

  my.initialize = function(){
    var homingCycle   = "$H";
    var resetPosition = "G10 L0 P0 X0 Y0 Z0";
  }


  my.move = function(target){

    var x = my.degToRad(target.R0);
    var y = my.degToRad(target.R1);
    var z = my.degToRad(target.R2);

    var position = "G1 X"+x+" Y"+y+" Z"+z;
    my.sendGcode(position);
  }

  my.sendGcode = function(str){
    console.log("Send gcode: "+str);
    socket.emit('gcode', str);
  }


  my.degToRad = function(radians) {
    return radians * 180 / Math.PI;
  };

  return my;
}(GCODE_SENDER || {}));
