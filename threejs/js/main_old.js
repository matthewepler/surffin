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
    _.each(data.coordinates, function(coord, i){
      var scale = 10;
      var geometry = new THREE.CubeGeometry(scale,scale,scale);
      var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
      var cube = new THREE.Mesh( geometry, material );

      //coord.loc.z += (i * 20);

      // set x,y,z position
      cube.position.x = coord.loc.x;
      cube.position.y = coord.loc.y;
      cube.position.z = coord.loc.z;
      // set rotation
      var vector = new THREE.Vector3( 0, 0, 0 );
      vector.applyQuaternion( coord.quat );
      cube.rotation.x = vector.x;
      cube.rotation.y = vector.y;
      cube.rotation.z = vector.z;

      if(i > 0){
        // draw line
        var lineMat = new THREE.LineBasicMaterial({
            color: 0x000000
        });
        var lineGeom = new THREE.Geometry();
        lineGeom.vertices.push(data.coordinates[i - 1].loc);
        lineGeom.vertices.push(coord.loc);
        var line = new THREE.Line(lineGeom, lineMat);

        group.add( line );
      }
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