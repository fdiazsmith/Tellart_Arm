var GUI = (function (self) {

  //=========================//
  //           GUI           //
  //=========================//


  self.control = {
    Message :           "",
    Send :              function(){GCODE_SENDER.sendGcode(self.output.message)},
    "Send home" :       function(){GCODE_SENDER.home(); SCENE.reset();},
    "Return settings" : function(){GCODE_SENDER.settings()},
    "Kill lock" :       function(){GCODE_SENDER.killLock()},
    "Pause" :           function(){GCODE_SENDER.feedHold()},
    right :             function(){SCENE.camera(0)},
    top :               function(){SCENE.camera(1)},
    front :             function(){SCENE.camera(2)},
    Log :               false
  }

  var gui = new dat.gui.GUI();

  var f0 = gui.addFolder('Camera');
  f0.add(self.control, "right");
  f0.add(self.control, "top");
  f0.add(self.control, "front");
  // f1.open();

  var f1 = gui.addFolder('Target Coordinates');
  f1.add(SCENE.output, 'target_x').min(-50).max(50).step(0.25).listen();
  f1.add(SCENE.output, 'target_z').min(-50).max(50).step(0.25).listen();
  f1.add(SCENE.output, 'target_y').min(-50).max(50).step(0.25).listen();
  // f1.open();

  var f2 = gui.addFolder("Angles");
  f2.add(SCENE.output, "R0").min(-6.28).max(6.28).step(0.125).listen();
  f2.add(SCENE.output, "R1").min(-6.28).max(6.28).step(0.125).listen();
  f2.add(SCENE.output, "R2").min(-6.28).max(6.28).step(0.125).listen();
  // f2.open();

  var f3 = gui.addFolder("Terminal");
  f3.add(self.control, "Message");
  f3.add(self.control, "Send");
  f3.add(self.control, "Log");
  f3.open();

  var f4 = gui.addFolder("Machine Controles");
  f4.add(self.control, "Send home");
  f4.add(self.control, "Return settings");
  f4.add(self.control, "Kill lock");
  f4.add(self.control, "Pause");
  //f3.open();

return self;
}(GUI || {}));
