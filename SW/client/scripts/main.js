console.log("READY");

var socket = io.connect('http://localhost:8080');


console.log('SCENE.output', SCENE.output);
SCENE.animate();
