/**
  B A S I C   T E S T   F O R   R O B O T   A R M
**/

// SerialPort
var SerialPort  = require( "serialport" );

// Socket.io
var http = require('http');
var fs = require('fs');

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./client/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
    socket.emit('message', 'You are connected!');
});


server.listen(8080);





// Serial Port stuff
var portName = [ '/dev/cu.usbmodem1411'];
var portNumber;
var myPort;
var socketClients = {};
var controllerREady = false;

SerialPort.list(function (err, ports) {
  var foundPort = false;

  // flag for whether serial is connected
  console.log( "***** AVAILABLE SERIAL PORTS *****" );
  // go through each port and
  ports.forEach(function(port) {
    console.log(port.comName);
    for (var i = portName.length - 1; i >= 0; i--) {
      if ( port.comName === portName[i]){
        portNumber = i;
        foundPort = true;
        console.log("foound PORT!");
      }
    };
  });

  if ( foundPort ) openPort();
  else {
      console.log( "*******************************************************************************************************" );
      console.log( "Given port name of " + portName[portNumber] + " is not found. Server will continue, but withouth serial connection." );
      console.log( "If you need an Arduino to work, check the console above and replace portName with the correct port." );
      console.log( "*******************************************************************************************************" );
      console.log();
  }
});

function openPort(){
  console.log(" moving on");
  // this only creates a port if the named one is found. allows for server to work without arduino attached

  myPort = new SerialPort(portName[portNumber], {
    // look for return and newline at the end of each data packet:
    parser: SerialPort.parsers.readline("\r\n"),
    //parser: SerialPort.parsers.raw,
    baudrate: 115200 //9600 //31250 //9600
  });

  myPort.on( 'open', function(){
    console.log( 'OK: Port ' + portName[portNumber] + ' has opened.' );
    setTimeout(function(){
      console.log("about to say hi");
      // sayHi();
      moveMotor("X", "100", "1000");
    }, 6500);
    // setTimeout(, 800);
  });

  myPort.on('data', function (data) {
    console.log( 'Serial Data : ' + data);

    if (data.search("$") === 24) console.log("OK: READY!!!")
  });
  function moveMotor(_which, _pos, _speed){
    var GCODE = "G1 "+ _which+_pos + " " + "F"+_speed;
    console.log("TESTING: |", GCODE);
    var C = "G1 z10.0 f3000.0\nG1 x35.0 y113.0 z10.0 f3000.0\nG1 x35.0 y113.0 z0.0 f900.0"
    myPort.write(C+'\n', function(error){
      if (error != null ) console.log(error);
    });
  }
  function sayHi(){

    myPort.write('$$\n', function(error){
      if (error != null ) console.log(error);
    });   // Do something with this data
  }
}
