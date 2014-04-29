$(document).ready(function(){

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
  var container = document.getElementById('canvas-wrap');
  var renderer = new THREE.WebGLRenderer({alpha:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  var controls = new THREE.OrbitControls(camera, container);

  camera.position.z = 400;

  var data = new Surf.Data();

  var group = new THREE.Object3D();
  group.position.y = -100;
  scene.add(group);

  var gui = new Surf.GUI(function(newData){
    var objsToRemove = _.rest(group.children, 1);
    _.each(objsToRemove, function( object ) {
          group.remove(object);
    });
    data.parseData(newData);
    createView();
  });


  function createView(){
    var posX = 0, posY = 0, posZ = 0, lastPos = new THREE.Vector3();
    _.each(data.coordinates, function(coord, i){
      var scale = 10;
      var geometry = new THREE.CubeGeometry(scale,scale,scale);
      var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
      var cube = new THREE.Mesh( geometry, material );


      posX += (coord.locDiff.x / 500);
      posY += (coord.locDiff.y / 500);
      posZ += (coord.locDiff.z / 500);

      var thisPos = new THREE.Vector3(posX, posY, posZ);

      if(i > 0){
        // draw line
        var lineMat = new THREE.LineBasicMaterial({
            color: 0x000000
        });
        var lineGeom = new THREE.Geometry();
        lineGeom.vertices.push(lastPos);
        lineGeom.vertices.push(thisPos);
        var line = new THREE.Line(lineGeom, lineMat);

        group.add( line );
      }

      lastPos = thisPos;

      group.add( cube );
    });
  }

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  }

  createView();
  render();

});