/* TODO
  - [ ] PROPERLY COMMENT THE FUCK OUT OF THIS DOC...following the YUI doc specs
  - [ ] Add camera controls: ortho, perspective and viewing angle.
  - [ ]
*/

var SCENE = (function (self) {

  // D A T   G U I   V A R I A B L E S
  self.output = {
    target_x : 5.0,
    target_z : 5.0,
    target_y : 5.0,
    R0: 0.0,
    R1: 0.0,
    R2: 0.0,
    R3: 0.0,
    R4: 0.0,
    R5: 0.0,
  }

  var gui = new dat.gui.GUI();

  var f1 = gui.addFolder('Target_coordinates');
  f1.add(self.output, 'target_x').min(-50).max(50).step(0.25).listen();
  f1.add(self.output, 'target_z').min(-50).max(50).step(0.25).listen();
  f1.add(self.output, 'target_y').min(-50).max(50).step(0.25).listen();
  // f1.open();
  var f2 = gui.addFolder("Angles");
  f2.add(self.output, "R0").min(-6.28).max(6.28).step(0.125).listen();
  f2.add(self.output, "R1").min(-6.28).max(6.28).step(0.125).listen();
  f2.add(self.output, "R2").min(-6.28).max(6.28).step(0.125).listen();
  f2.add(self.output, "R3").min(-6.28).max(6.28).step(0.125).listen();
  f2.add(self.output, "R4").min(-6.28).max(6.28).step(0.125).listen();
  f2.add(self.output, "R5").min(-6.28).max(6.28).step(0.125).listen();
  // f2.open();


  // var control;
  var l = [];



    function init() {
    container = document.getElementById( 'container' );
    scene = new THREE.Scene();

    // set ceamera
    camera = new THREE.PerspectiveCamera( 3, window.innerWidth / window.innerHeight, 200, 10000 );
    camera.position.set( 0,0, 500 );
    scene.add( camera );
    scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );

    // draw grid
    var grid = new THREE.GridHelper( 100, 100 );
    grid.position.y = 0;
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    scene.add(grid);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    // frames per second
    stats = new Stats();
    container.appendChild(stats.dom);

    // Orbit controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // // make materal
    // var line = new THREE.LineBasicMaterial({color: 0x0000ff,linewidth: 1});
    var material = new THREE.MeshNormalMaterial({shading: THREE.SmoothSHading});
    //  robotArm = new THREE.Mesh(base_Geometry, material);

    //=========================//
    //     TARGET              //
    //=========================//

    var control = new THREE.TransformControls( camera, renderer.domElement );
    var target = new THREE.SphereGeometry( 0.5, 50, 50, 0);
    var targetMesh = new THREE.Mesh( target, material );
    targetMesh.position.set(10,0,0);
    scene.add(targetMesh);
    control.attach(targetMesh);
    control.setSize(0.05);
    scene.add(control);

    control.addEventListener( 'change', function(){
        //update self.output values:
      self.output.target_x = control.position.x;
      self.output.target_y = control.position.y;
      self.output.target_z = control.position.z;
                        // self.output.baseAngel = Math.atan2(control.position.z,control.position.x)*(180/Math.PI);
    });


    constructArm(ARM.geometry);
    IK.origin = new THREE.Vector3(0,0,0);
  }

  function constructArm(geometry){
    // console.log("this", this);
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var g = [];
    var s = [];
    //iterates geometry and creates vectors
    for (var i = 1; i < geometry.length; i++) {
      g[i-1] = new THREE.Geometry();
      // g[i-1].vertices.push(new THREE.Vector3(geometry[i-1][0],geometry[i-1][1],geometry[i-1][2]), new THREE.Vector3(geometry[i][0],geometry[i][1],geometry[i][2]));
      g[i-1].vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(geometry[i][0],geometry[i][1],geometry[i][2]));
      l[i-1] = new THREE.Line(g[i-1], lineMaterial);
      l[i-1].position.set(geometry[i-1][0],geometry[i-1][1],geometry[i-1][2])
      s[i-1] = makeTextSprite("L"+i);
      s[i-1].position.set(geometry[i-1][0],geometry[i-1][1],geometry[i-1][2]);


    }
    // nest the lines inside each other
    for (var i = l.length -1; i > 0 ; i--) {
      l[i-1].add(l[i]);
      l[i-1].add(s[i])
    }
    //the above for loop does not reach zero, so we have to add the last one by hand.
    l[0].add(s[0]);
    console.log(l[0]);
    //add the 'Base' line to the scene
    scene.add(l[0]);

  }



  self.animate = function(_callback){
    requestAnimationFrame( self.animate );
    render();




    var robotIK = IK.target(new THREE.Vector3(self.output.target_x,self.output.target_y,self.output.target_z));
    // console.log(robotIK);
    // new THREE.Vector3(self.output.target_x,self.output.target_y,self.output.target_z);

    self.output.R0 = robotIK.baseAngleToTarget ;
    self.output.R1 = robotIK.shoulderAngle ;
    self.output.R2 = robotIK.elbowAngle ;



    l[0].children[0].rotation.z = self.output.R2;
    l[0].rotation.z = self.output.R1 ;
    l[0].rotation.y = self.output.R0;
    // l[0].children[0].children[0].rotation.x = self.output.R3;
    // l[0].children[0].children[0].children[0].rotation.z = self.output.R4;
    // l[0].children[0].children[0].children[0].rotation.x = self.output.R5;

    controls.update();
    stats.update();

    if( typeof _callback === 'function')_callback();
  }

  function render() {
    renderer.render( scene, camera );
  }

  // HELPER FUNCTIONS
  function makeTextSprite( message, parameters ){
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 80;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 1;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width*1.2;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
    var sprite = new THREE.Sprite( spriteMaterial );
    // sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;
  }

  // function for drawing rounded rectangles
  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }






  //initialize the THREE.js Environment
  init();
  return self;
}(SCENE || {}));
