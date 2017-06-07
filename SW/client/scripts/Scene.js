var SCENE = (function (my) {
  var base_height 			= 			 5;
  var base_radius 			= 			 5;
  var base_offset 	  	= 		 2.5;

  var lowerArm_height		= 	 13.75;
  var lowerArm_radius		= 			 1.5;
  var lowerArm_offset		=			 2.2;

  var upperArm_height 	= 		14.9;
  var upperArm_radius		=				 5;



  /// above should be deleted. it exist in ARM

  var output = {
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
  f1.add(output, 'target_x').min(-50).max(50).step(0.25).listen();
  f1.add(output, 'target_z').min(-50).max(50).step(0.25).listen();
  f1.add(output, 'target_y').min(-50).max(50).step(0.25).listen();
  f1.open();
  var f2 = gui.addFolder("Angles");
  f2.add(output, "R0").listen();
  f2.add(output, "R1").listen();
  f2.add(output, "R2").listen();
  f2.add(output, "R3").listen();
  f2.add(output, "R4").listen();
  f2.add(output, "R5").listen();
  f2.open();
  var control;




    function init() {
    container = document.getElementById( 'container' );
    scene = new THREE.Scene();

    // set ceamera
    camera = new THREE.PerspectiveCamera( 3, window.innerWidth / window.innerHeight, 200, 10000 );
    camera.position.set( -500, 400, 800 );
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

    // make materal
    var line = new THREE.LineBasicMaterial({color: 0x0000ff,linewidth: 1});
    var material = new THREE.MeshNormalMaterial({shading: THREE.SmoothSHading});
    var faces = 50;
    var robotArm = new THREE.Mesh(base_Geometry, material);

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
        //update output values:
      output.target_x = control.position.x;
      output.target_y = control.position.y;
      output.target_z = control.position.z;
                        // output.baseAngel = Math.atan2(control.position.z,control.position.x)*(180/Math.PI);
    });


    //=========================//

    //				 	LINE					 //

    //=========================//
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));

    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3(0, 10, 0));
    geometry2.vertices.push(new THREE.Vector3(10, 0, 0));

    var line = new THREE.Line(geometry, material);
    line2 = new THREE.Line(geometry2, material);
    line.add(line2)
    robotArm.add(line);





    //=========================//
    //				 	BASE					 //
    //=========================//

    var base_Geometry = new THREE.CylinderGeometry(base_radius,base_radius,base_height, faces);
    var base_mesh = new THREE.Mesh(base_Geometry, material);
    base_mesh.position.set(0,base_height/2,0);
    robotArm.add(base_mesh);

    //=========================//
    //				LOWERARM				 //
    //=========================//

    var lowerArm_Geometry = new THREE.CylinderGeometry(lowerArm_radius,lowerArm_radius,lowerArm_height, faces);
    var lowerArm_mesh = new THREE.Mesh(lowerArm_Geometry, material);
    //lowerArm_mesh.rotateZ((90 * Math.PI)/180);
    base_mesh.add(lowerArm_mesh);

    scene.add(robotArm);
  }





  my.animate = function(){
    requestAnimationFrame( my.animate );
    render();

    line2.geometry.vertices[1].x = output.target_x;
    line2.geometry.vertices[1].z = output.target_z;
    line2.geometry.vertices[1].y = output.target_y;



    let angles = [output.target_x,
                  output.target_y,
                  output.target_z,
                  0, 0, 0];
    line2.geometry.verticesNeedUpdate = true;
    try {

      var newAngles = kin.inverse(...angles);
      output.R0 = THREE.Math.radToDeg(newAngles[0]) ;
      output.R1 = THREE.Math.radToDeg(newAngles[1]) ;
      output.R2 = THREE.Math.radToDeg(newAngles[2]) ;
      output.R3 = THREE.Math.radToDeg(newAngles[3]) ;
      output.R4 = THREE.Math.radToDeg(newAngles[4]) ;
      output.R5 = THREE.Math.radToDeg(newAngles[5]) ;
      console.log(newAngles);
      newAngles.forEach(function(){

      });
    } catch (e) {

    }

    // console.log(line2.geometry.vertices[1]);
    controls.update();
    stats.update();
  }
  function render() {
    renderer.render( scene, camera );
  }

  init();
  return my;
}(SCENE || {}));
