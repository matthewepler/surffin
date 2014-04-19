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

  var gui = new dat.GUI();
  gui.add(this, 'data');
};

