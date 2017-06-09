console.log("READY");
var serverURL = window.location.origin;
var socket = io.connect(serverURL);

// Resive message from server/Arduino responce
socket.on('message', function (data) {
    console.log(data);
});

SCENE.animate();
