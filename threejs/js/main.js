var camera, gui;

$(document).ready(function(){

  gui = new Surf.GUI(function(newData){
    var objsToRemove = _.rest(group.children, 1);
    _.each(objsToRemove, function( object ) {
          group.remove(object);
    });
    data.parseData(newData);
    createView();
  });

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 8000 );
  var scene = new THREE.Scene();
  var container = document.getElementById('canvas-wrap');

  var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  var controls = new THREE.OrbitControls(camera, container);

  camera.position.z = gui.z;

  var data = new Surf.Data();

  var group = new THREE.Object3D();
  group.position.y = 0;
  scene.add(group);

  var axis = new Axis(scene);

  var mainLineMat = new THREE.LineBasicMaterial({color: '#E9AC0B', transparent: true, opacity:0.2, linewidth: 8});
  //var rotatedLineMat = new THREE.LineBasicMaterial({color: '#EFF60D', transparent: true, opacity:0.8, linewidth: 1});
  var rotatedLineMat = new THREE.LineDashedMaterial({color: '#EFF60D', transparent: true, opacity:0.8, linewidth: 1});
  var splineLineMat = new THREE.LineBasicMaterial({color: '#2F16C1', transparent: true, opacity:1, linewidth: 5});

  var bufferGeom, lineMaterial, mesh, positions, colors, currIndex = 0;
  var posX = 0, posY = 0, posZ = 0;

  function createView(){

    bufferGeom = new THREE.BufferGeometry();
    lineMaterial = new THREE.LineBasicMaterial({vertexColors: true});

    bufferGeom.addAttribute( 'position', new Float32Array( data.coordinates.length * 3 ), 3);
    bufferGeom.addAttribute( 'color', new Float32Array( data.coordinates.length * 3 ), 3);

    positions = bufferGeom.getAttribute('position').array;
    colors = bufferGeom.getAttribute('color').array;

    // _.each(data.coordinates, function(coord, i){

    //   posX += (coord.locDiff.x / 500);
    //   posY += (coord.locDiff.y / 500);
    //   posZ += (coord.locDiff.z / 500);

    //   // positions
    //   positions[i * 3] = posX;
    //   positions[i * 3 + 1] = posY;
    //   positions[i * 3 + 2] = posZ;

    //   colors[i * 3] = (posX / r) + 0.5;
    //   colors[i * 3 + 1] = (posY / r) + 0.5;
    //   colors[i * 3 + 2] = (posZ / r) + 0.5;

    // });

    mesh = new THREE.Line(bufferGeom, lineMaterial);
    group.add(mesh);

  }

  var lastLoc, lastSplineLoc, n_sub = 8;
  function render() {
    requestAnimationFrame(render);
    if(bufferGeom){

      // animate curved spline
      if(currIndex < data.splineCurve.points.length * n_sub){
        var s = data.splineCurve.getPoint(currIndex / (data.splineCurve.points.length * n_sub));
        var thisSplineVector = new THREE.Vector3(s.x, s.y, s.z);
        if(currIndex > 0){
          var splineGeom = new THREE.Geometry();
          splineGeom.vertices.push(lastSplineLoc);
          splineGeom.vertices.push(thisSplineVector);
          var splineLine = new THREE.Line(splineGeom, splineLineMat);
          scene.add(splineLine);

          var rotLineContainer = new THREE.Object3D();
          rotLineContainer.position.set(s.x, s.y, s.z);
          scene.add(rotLineContainer);

          var rotatedLineGeom = new THREE.Geometry(), rotatedLineLen = 100;
          rotatedLineGeom.vertices.push(new THREE.Vector3(0, (rotatedLineLen / 2), 0));
          rotatedLineGeom.vertices.push(new THREE.Vector3(0, (rotatedLineLen / -2), 0));
          var rotatedLine = new THREE.Line(rotatedLineGeom, rotatedLineMat);
          rotatedLine.rotation.x = currIndex * 0.1;
          rotatedLine.rotation.y = currIndex * 0.1;
          rotatedLine.rotation.z = currIndex * 0.1;
          rotLineContainer.add(rotatedLine);

        }
        lastSplineLoc = thisSplineVector;
      }

      // create standard line
      if(currIndex < data.coordinates.length){

        var thisLoc = data.coordinates[currIndex].loc;
        posX = thisLoc.x;
        posY = thisLoc.y;
        posZ = thisLoc.z;

        if(currIndex > 0){

          var mainLineGeom = new THREE.Geometry();
          mainLineGeom.vertices.push(lastLoc);
          mainLineGeom.vertices.push(thisLoc);
          var mainLine = new THREE.Line(mainLineGeom, mainLineMat);

          scene.add(mainLine);

        }

        // // positions
        // positions[currIndex * 3] = posX;
        // positions[currIndex * 3 + 1] = posY;
        // positions[currIndex * 3 + 2] = posZ;

        // colors[currIndex * 3] = (posX / 800) + 0.5;
        // colors[currIndex * 3 + 1] = (posY / 800) + 0.5;
        // colors[currIndex * 3 + 2] = (posZ / 800) + 0.5;

        // bufferGeom.attributes.position.needsUpdate = true;
        // bufferGeom.attributes.color.needsUpdate = true;

        lastLoc = thisLoc;


      }

        currIndex++;

    }
    renderer.render(scene, camera);
    controls.update();
  }

  createView();
  render();

});