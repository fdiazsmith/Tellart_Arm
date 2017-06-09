console.log("READY");
var serverURL = window.location.origin;
var socket = io.connect(serverURL);

SCENE.animate();
