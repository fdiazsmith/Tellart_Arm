

// serialport
var serialport  = require( "serialport" );
var SerialPort  = serialport.SerialPort; // local instance

// Serial Port stuff
var portName = [ '/dev/cu.usbmodem1411'];
var portNameNumber;
var myPort;
var socketClients = {};

serialport.list(function (err, ports) {

  // flag for whether serial is connected
  var foundPort = false;
  console.log( "***** AVAILABLE SERIAL PORTS *****" );
  // go through each port and
  ports.forEach(function(port) {
    console.log(port.comName);
    for (var i = portName.length - 1; i >= 0; i--) {
      if ( port.comName === portName[i]){
        portNameNumber = i;
        foundPort = true;
      }
    };

  });
  console.log();

  // this only creates a port if the named one is found. allows for server to work without arduino attached
  if ( foundPort === true ){
    myPort = new SerialPort(portName[portNameNumber], {
      // look for return and newline at the end of each data packet:
      parser: serialport.parsers.readline("\r\n"),
      //parser: serialport.parsers.raw,
      baudrate: 115200 //9600 //31250 //9600
    });

    myPort.on( 'open', function(){
      console.log( 'Port ' + portName[portNameNumber] + ' has opened.' );
    });

    myPort.on('data', function (data) {
      console.log( 'Serial Data : ' + data );

     // Do something with this data
    });



  }
  else {
    console.log( "*******************************************************************************************************" );
    console.log( "Given port name of " + portName[portNameNumber] + " is not found. Server will continue, but withouth serial connection." );
    console.log( "If you need an Arduino to work, check the console above and replace portName with the correct port." );
    console.log( "*******************************************************************************************************" );
    console.log();
  }
});
