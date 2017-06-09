// Write about this app.js: here ......

//=========================//
//       SOCKET.IO         //
//=========================//

var http = require('http');
var fs = require('fs');
var events = require('events');
// const MotionController = require('./MotionController.js');
//
// MotionController.sayHello();
// var eventEmitter = new events.EventEmitter();

var sendBuffer = function sendBuffer(){
  // send gcode command if send is true

  if(send && initMove && buffer.length > 1){
    buffer.shift();
    // myPort.write(buffer[0]+'\n');
    console.log("Buffer Data Sent: "+buffer[0]);
    console.log("\t\tRemainding Buffer: ", buffer);
    send = false;
  }
  else {
    initMove = false
    // console.log("called but sent sothrin ");
  }
}
// eventEmitter.on('bufferReady', sendBuffer);

var loop = function(){
  //  console.log("loop", buffer.length, send);
  if(buffer.length > 1 ){
    if(send ){
      buffer.shift();
      myPort.write(buffer[0]+'\n');
      console.log("\t\tBuffer Data Sent: "+buffer[0]);
      console.log("\t\t\tRemainding Buffer: ", buffer);
      send = false;
    }

  }
}


var buffer = ["G0 X10", "G0 X10", "G0 X10", "G0 X10"];

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
    // console.log(req.url);
    fs.readFile("./client/"+req.url, 'utf-8', function(error, content) {
        res.writeHead(200);
        res.end(content);
    });
});

// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
    socket.emit('message', 'You are connected!');
    buffer = [null];
});

server.listen(8080);

//=========================//
//       SERIALPORT        //
//=========================//

var SerialPort  = require( "serialport" );
var portName = [ '/dev/tty.usbmodem1411',
                 '/dev/cu.usbmodem1411'];
var portNumber;
var myPort;
var socketClients = {};
var controllerREady = false;

SerialPort.list(function (err, ports) {
  var foundPort = false;
  // flag for whether serial is connected
  console.log( "***** AVAILABLE SERIAL PORTS *****" );
  // go through each port and check if it maches
  ports.forEach(function(port) {
    console.log(port.comName);
    for (var i = portName.length - 1; i >= 0; i--) {
      if ( port.comName === portName[i]){
        portNumber = i;
        foundPort = true;
      }
    };
  });

  if ( foundPort ){
    openPort();
  }
  else {
      console.log();
      console.log( "*******************************************************************************************************" );
      console.log( "Given port name of " + portName[portNumber] + " is not found. Server will continue, but withouth serial connection." );
      console.log( "If you need an Arduino to work, check the console above and replace portName with the correct port." );
      console.log( "*******************************************************************************************************" );
      console.log();
  }
});

//=========================//
//       PORT AVAIBLE      //
//=========================//
  var send = true;
  var initMove = false;


function openPort(){

  // this only creates a port if the named one is found. allows for server to work without arduino attached
  myPort = new SerialPort(portName[portNumber], {
    // look for return and newline at the end of each data packet:
    parser: SerialPort.parsers.readline("\r\n"),
    //parser: SerialPort.parsers.raw,
    baudrate: 115200 //31250 //9600
  });

  // When the the port is open report the portName.
  // It will wait for 2 sec before initializing the homing cycle.
  myPort.on( 'open', function(){
    console.log( 'OK: Port ' + portName[portNumber] + ' has opened.' );
    console.log();
    console.log( "**************************" );
    console.log( "Connected and ready to go!" );
    console.log( "**************************" );
    console.log();
    setTimeout(function(){
      homingCycle();
    }, 2000);
  });

  //=========================//
  //         BUFFER          //
  //=========================//


  // when resiving data add it to the buffer
  io.sockets.on('connection', function (socket) {
    socket.on('gcode', function (data) {
      buffer.push(data);
      initMove = true;
      // eventEmitter.emit('bufferReady');
      // sendBuffer()
          send = true;

    });
  });


  //=========================//
  //      SERIAL RESIVER     //
  //=========================//

  // Listening for any responce through the serialPort.
  // Trigger when resiving data from the arduino/grlb
  myPort.on('data', function (data) {
    console.log( 'Serial Data : ' + data);
      if(data == "ok") {

        send = true;
        console.log("\tSend = ture", send);
        // if(initMove){
          // send = true;
          // console.log("\tMotion OK", send, initMove);
          // sendBuffer();
        // }

      }
      // eventEmitter.emit('bufferReady');
    // send serial data to the socket.io
    io.sockets.on('connection', function (socket) {
      socket.emit('message', "Serial Data : "+data);
    });
  });


  // if(buffer.length >= 1){
  //   myPort.write(buffer[0]+'\n');
  // }

  // // initialize a homing cycle on conection
  function homingCycle(){
    console.log("Running homing cycle");
    myPort.write('$H\nG10 P0 L20 X0 Y0 Z0\n', function(error){
      if (error != null ) console.log(error);
    });   // Do something with this data
  }
}
// io.setMaxListeners(1000)
setInterval(function(){
  setInterval(loop,100);
},5000)
