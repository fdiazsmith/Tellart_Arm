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
  // object to store the THREE.line objects
  var l = [];
  var lastPosition = new THREE.Vector3(0,0,0);

  //=========================//
  //           GUI           //
  //=========================//

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
  // f2.open();


 function init() {
    container = document.getElementById( 'container' );
    scene = new THREE.Scene();

    //=========================//
    //          CAMERA         //
    //=========================//

    camera = new THREE.PerspectiveCamera( 3, window.innerWidth / window.innerHeight, 200, 10000 );
    camera.position.set( 0,0, 500 );
    scene.add( camera );
    scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );

    //=========================//
    //           GRID          //
    //=========================//

    var grid = new THREE.GridHelper( 100, 100 );
    grid.position.y = 0;
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    scene.add(grid);

    //=========================//
    //     RENDER SETTINGS     //
    //=========================//

    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );
    // FPS Statistics
    stats = new Stats();
    container.appendChild(stats.dom);

    //=========================//
    //        MATERIAL         //
    //=========================//

    var material = new THREE.MeshNormalMaterial({shading: THREE.SmoothSHading});
    var metal = new THREE.MeshPhongMaterial({
         ambient: 0x030303,
         specular: 0xffffff,
         shininess: 90
    });
    var line = new THREE.LineBasicMaterial( {
      	color: 0x0000ff
    } );

    //=========================//
    //          TARGET         //
    //=========================//

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    var control = new THREE.TransformControls( camera, renderer.domElement );
    var target = new THREE.SphereGeometry( 0.2, 50, 50, 0);
    var targetMesh = new THREE.Mesh( target, material );
    // Set target starting position
    targetMesh.position.set(1,0.5,0);
    scene.add(targetMesh);
    control.attach(targetMesh);
    control.setSize(0.05);
    scene.add(control);
    // Project the target position onto the XY Grid
    var circleGeometry = new THREE.CircleGeometry( 0.1, 50);
    var circle = new THREE.Line( circleGeometry, line );
    circle.position.set(control.position.x,0,control.position.z);
    circle.rotation.x = Math.PI / 2;
    scene.add( circle );

    // Updatee the position of the target
    self.output.target_x = control.position.x;
    self.output.target_y = control.position.y;
    self.output.target_z = control.position.z;

    //=========================//
    //          UPDATE         //
    //=========================//

    control.addEventListener( 'change', function(){
      //update self.output values:
      self.output.target_x = control.position.x;
      self.output.target_y = control.position.y;
      self.output.target_z = control.position.z;
      circle.position.set(control.position.x,0,control.position.z);

      // calculate the distance between movement of the target
      var dist = control.position.distanceTo(lastPosition);
      // only
      if(dist > 0.2){
        lastPosition.set(control.position.x, control.position.y, control.position.z);
        // Send the position to the gcode sender
        GCODE_SENDER.move(self.output);
      }
    });

    constructArm(ARM.geometry);
    IK.origin = new THREE.Vector3(0,0,0);
  }

  //=========================//
  //     DRAW ROBOT ARM      //
  //=========================//

  function constructArm(geometry){
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

  //=========================//
  //         ANIMATE         //
  //=========================//

  self.animate = function(_callback){
    requestAnimationFrame( self.animate );
    render();

    // Calculate the inverted kinimatics
    var robotIK = IK.target(new THREE.Vector3(self.output.target_x,self.output.target_y,self.output.target_z));

    // Save the inverted kinimatics into the output object
    self.output.R0 = robotIK.baseAngleToTarget ;
    self.output.R1 = robotIK.shoulderAngle ;
    self.output.R2 = robotIK.elbowAngle ;

    l[0].children[0].rotation.z = self.output.R2;
    l[0].rotation.z = self.output.R1 ;
    l[0].rotation.y = self.output.R0;

    controls.update();
    stats.update();

    if( typeof _callback === 'function')_callback();
  }

  function render() {
    renderer.render( scene, camera );
  }




  //initialize the THREE.js Environment
  init();
  return self;
}(SCENE || {}));
