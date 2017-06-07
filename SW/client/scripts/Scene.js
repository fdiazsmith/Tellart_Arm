var SCENE = (function (my) {
  

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
  f2.add(output, "R0").min(-6.28).max(6.28).step(0.125);//.listen();
  f2.add(output, "R1").min(-6.28).max(6.28).step(0.125);//.listen();
    // f2.add(output, "R1").listen();
  f2.add(output, "R2").listen();
  f2.add(output, "R3").listen();
  f2.add(output, "R4").listen();
  f2.add(output, "R5").listen();
  f2.open();


  var control;
  var l = [];



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
        //update output values:
      output.target_x = control.position.x;
      output.target_y = control.position.y;
      output.target_z = control.position.z;
                        // output.baseAngel = Math.atan2(control.position.z,control.position.x)*(180/Math.PI);
    });


    //=========================//

    //				 	LINE					 //

    //=========================//


    constructArm(ARM.geometry);



    //=========================//
    //				 	BASE					 //
    //=========================//

    // var base_Geometry = new THREE.CylinderGeometry(base_radius,base_radius,base_height, faces);
    // var base_mesh = new THREE.Mesh(base_Geometry, material);
    // base_mesh.position.set(0,base_height/2,0);
    // robotArm.add(base_mesh);

    //=========================//
    //				LOWERARM				 //
    //=========================//
    //
    // var lowerArm_Geometry = new THREE.CylinderGeometry(lowerArm_radius,lowerArm_radius,lowerArm_height, faces);
    // var lowerArm_mesh = new THREE.Mesh(lowerArm_Geometry, material);
    // //lowerArm_mesh.rotateZ((90 * Math.PI)/180);
    // base_mesh.add(lowerArm_mesh);

    // scene.add(robotArm);
  }

  function constructArm(geometry){
    // console.log("this", this);
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var g = [];

    for (var i = 1; i < geometry.length; i++) {
      g[i-1] = new THREE.Geometry();
      g[i-1].vertices.push(new THREE.Vector3(geometry[i-1][0],geometry[i-1][1],geometry[i-1][2]), new THREE.Vector3(geometry[i][0],geometry[i][1],geometry[i][2]));
      l[i-1] = new THREE.Line(g[i-1], lineMaterial);
      // var s = makeTextSprite("L"+i-1+"",{ fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
      // s.position.set(geometry[i-1][0],geometry[i-1][1],geometry[i-1][2]);
    }

    makeTextSprite2("hello");
  //   var spritey = makeTextSprite( " World! ",
	// 	{ fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	// spritey.position.set(55,105,55);

    for (var i = l.length -1; i > 0 ; i--) {
      l[i-1].add(l[i]);
    }
    scene.add(l[0]);
    console.log(l[0]);
  }


  my.animate = function(){
    requestAnimationFrame( my.animate );
    render();

    // line2.geometry.vertices[1].x = output.target_x;
    // line2.geometry.vertices[1].z = output.target_z;
    // line2.geometry.vertices[1].y = output.target_y;
    // line2.geometry.verticesNeedUpdate = true;
    l[0].rotation.y = output.R0;
    l[0].children[0].rotation.x = output.R1;


    let angles = [output.target_x,
                  output.target_y,
                  output.target_z,
                  0, 0, 0];
    try {

      var newAngles = ARM.kin.inverse(...angles);
      // output.R0 = THREE.Math.radToDeg(newAngles[0]) ;
      // output.R1 = THREE.Math.radToDeg(newAngles[1]) ;
      output.R2 = THREE.Math.radToDeg(newAngles[2]) ;
      output.R3 = THREE.Math.radToDeg(newAngles[3]) ;
      output.R4 = THREE.Math.radToDeg(newAngles[4]) ;
      output.R5 = THREE.Math.radToDeg(newAngles[5]) ;
      // console.log(newAngles);
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


  function makeTextSprite2( message, parameters )
      {
          if ( parameters === undefined ) parameters = {};
          var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
          var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
          var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
          var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
          var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
          var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          context.font = "Bold " + fontsize + "px " + fontface;
          var metrics = context.measureText( message );
          var textWidth = metrics.width;

          context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
          context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

          context.lineWidth = borderThickness;
          roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

          context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
          context.fillText( message, borderThickness, fontsize + borderThickness);

          var texture = new THREE.Texture(canvas)
          texture.needsUpdate = true;

          var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
          var sprite = new THREE.Sprite( spriteMaterial );
          sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
          return sprite;
      }

  function makeTextSprite( message, parameters ){
  	if ( parameters === undefined ) parameters = {};

  	var fontface = parameters.hasOwnProperty("fontface") ?
  		parameters["fontface"] : "Arial";

  	var fontsize = parameters.hasOwnProperty("fontsize") ?
  		parameters["fontsize"] : 18;

  	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
  		parameters["borderThickness"] : 4;

  	var borderColor = parameters.hasOwnProperty("borderColor") ?
  		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

  	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
  		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

      console.log(THREE.Sprite);
  	var spriteAlignment = THREE.SpriteAlignment.topLeft;

  	var canvas = document.createElement('canvas');
  	var context = canvas.getContext('2d');
  	context.font = "Bold " + fontsize + "px " + fontface;

  	// get size data (height depends only on font size)
  	var metrics = context.measureText( message );
  	var textWidth = metrics.width;

  	// background color
  	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
  								  + backgroundColor.b + "," + backgroundColor.a + ")";
  	// border color
  	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
  								  + borderColor.b + "," + borderColor.a + ")";

  	context.lineWidth = borderThickness;
  	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
  	// 1.4 is extra height factor for text below baseline: g,j,p,q.

  	// text color
  	context.fillStyle = "rgba(0, 0, 0, 1.0)";

  	context.fillText( message, borderThickness, fontsize + borderThickness);

  	// canvas contents will be used for a texture
  	var texture = new THREE.Texture(canvas)
  	texture.needsUpdate = true;

  	var spriteMaterial = new THREE.SpriteMaterial(
  		{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
  	var sprite = new THREE.Sprite( spriteMaterial );
  	sprite.scale.set(100,50,1.0);
  	return sprite;
  }

  // function for drawing rounded rectangles
  function roundRect(ctx, x, y, w, h, r)
  {
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







  init();
  return my;
}(SCENE || {}));
