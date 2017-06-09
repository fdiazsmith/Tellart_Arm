var GCODE_SENDER = (function (my) {


  // Construct a motion command with 3 angels
  my.move = function(target){
    var x = my.radToDeg(target.R0);
    var y = my.radToDeg(target.R1);
    var z = my.radToDeg(target.R2);
    var position = "G0 X"+x+" Y"+y+" Z"+z;
    my.sendGcode(position);
  }

  // Help commands
  my.home     = function(){my.sendGcode("$H");}
  my.settings = function(){my.sendGcode("$$");}
  my.killLock = function(){my.sendGcode("$X");}
  my.mode     = function(){my.sendGcode("$C");}
  my.feedHold = function(){my.sendGcode("!");}
  my.status   = function(){my.sendGcode("?");}

  // Parse a command to the socket.io
  my.sendGcode = function(str){
    console.log("Send gcode: "+str);
    socket.emit('gcode', str);
  }

  // Convert radians to degrees
  my.radToDeg = function(radians) {
    return radians * 180 / Math.PI;
  };

  return my;
}(GCODE_SENDER || {}));
