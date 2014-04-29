var Surf = Surf || {};

Surf.Coordinate = function(){
  this.loc   = new THREE.Vector3();
  this.locDiff = new THREE.Vector3();
  this.accel = new THREE.Vector3();
  this.vel   = new THREE.Vector3();
  this.force = new THREE.Vector3();
};