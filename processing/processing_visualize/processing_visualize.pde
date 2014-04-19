import peasy.*;
PeasyCam cam;

String filename = "TEST.TXT";
String[] raw;
PVector[] allPoints, drawPoints;
float[] diffX, diffY, diffZ;

void setup() {
  size(800, 800, P3D);
  colorMode(HSB);
  cam = new PeasyCam(this, 100);

  raw = loadStrings(filename);
  allPoints = new PVector[raw.length];
  drawPoints = new PVector[raw.length];
  diffX = new float[allPoints.length];
  diffY = new float[allPoints.length];
  diffZ = new float[allPoints.length];

  for (int i=0; i < raw.length; i++) {
    String[] row = raw[i].split(",");
    int x = Integer.parseInt(row[1]);
    int y = Integer.parseInt(row[2]);
    int z = Integer.parseInt(row[3]);
    allPoints[i] = new PVector(x, y, z);
  }

  int posX = 0;
  int posY = 0;
  int posZ = 0;
  drawPoints[0] = new PVector(0, 0, 0);

  for (int i=1; i<allPoints.length; i++) {
    PVector thisPoint = allPoints[i];
    PVector prevPoint = allPoints[i-1];

    float xDiff = thisPoint.x + prevPoint.x;
    float yDiff = thisPoint.y + prevPoint.y;
    float zDiff = thisPoint.z + prevPoint.z;

    diffX[i] = xDiff/500;
    diffY[i] = yDiff/500;
    diffZ[i] = zDiff/500;
    //println(zDiff);

    posX += diffX[i];
    posY += diffY[i];
    posZ += diffZ[i];

    drawPoints[i] = new PVector(posX, posY, posZ);
  }
}

void draw() {
  background(0);
  strokeWeight(5);
  int incrementColor = 255;
  float decrement = 255.0 / drawPoints.length;

    for (int i=1; i<drawPoints.length; i++) {
      PVector thisPoint = drawPoints[i];
      PVector prevPoint = drawPoints[i-1]; 
      stroke(incrementColor, 255, 255);
      line(thisPoint.x, thisPoint.y, thisPoint.z, prevPoint.x, prevPoint.y, prevPoint.z);
      incrementColor = int(incrementColor - decrement);
    }
}

