var Surf = Surf || {};

Surf.GUI = function(onNewData){

  $('.submit').click(function(){
    $('.data-container').css('display', 'none');
    if($('#data-input').get(0).value !== ''){
      onNewData($('#data-input').get(0).value);
    }
  });

  this.data = function() {
    $('.data-container').css('display', 'block');
  };

  this.z = 2000;

  var gui = new dat.GUI();
  gui.add(this, 'data');

  // var zController = gui.add(this, 'z', -10000, 10000);
  // zController.onChange(function(value){
  //   camera.position.z = value;
  // });


};

