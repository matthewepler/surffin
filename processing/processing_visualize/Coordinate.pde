class Coordinate {

  PVector loc   = new PVector();
  PVector accel = new PVector();
  PVector vel   = new PVector();
  PVector force = new PVector();
  Quaternion quat;
  int age;
  int fade;

  Coordinate() {
    age = 500;
    fade = 255;
  }

  void display() {
    pushMatrix();
      translate(loc.x, loc.y, loc.z);
      float[] axis = quat.toAxisAngle();
      rotateY(PI/2);
      rotate(axis[0], -axis[1], -axis[3], -axis[2]);
      
      // orientation lines
      stroke(255, 255, 255, fade);
      line(0, 0, 0, 40, 0, 0);
      stroke(80, 255, 255, fade);
      line(0, 0, 0, 0, 40, 0);
      stroke(180, 255, 255, fade);
      line(0, 0, 0, 0, 0, 40); 
      
      // box
      stroke(255, fade);
      fill(255, fade);
      box(20);
    popMatrix();
    //fade--;
    //age--;
  }
  
}

