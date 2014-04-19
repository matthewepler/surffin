#include <Wire.h>
#include <SD.h>

#define CTRL_REG1 0x20
#define CTRL_REG2 0x21
#define CTRL_REG3 0x22
#define CTRL_REG4 0x23

int Addr = 105;                 // I2C address of gyro
int x, y, z;
File myFile;
boolean done;
const int chipSelect = 10;

void setup()
{
  Wire.begin();
  //Serial.begin(9600);  
  setPins();
  done = false;
  
  if(SD.begin(chipSelect) == 1) {
    //Serial.println("chipSelec = 1");
    digitalWrite(2, HIGH); 
  }
  delay(100);

  if(SD.exists("TEST.TXT")) {
    SD.remove("TEST.TXT");
    myFile = SD.open("TEST.TXT", FILE_WRITE);
    //Serial.println("previous file deleted, file created");
  } 
  else {
    myFile = SD.open("TEST.TXT", FILE_WRITE);
    //Serial.println("file created");
  }  
  // Gyro
  writeI2C(CTRL_REG1, 0x1F);    // Turn on all axes, disable power down
  writeI2C(CTRL_REG3, 0x08);    // Enable control ready signal
  writeI2C(CTRL_REG4, 0x80);    // Set scale (500 deg/sec)
}

void loop()
{    
 if(digitalRead(6) == HIGH) {
    //Serial.println("2 high");
    digitalWrite(4, HIGH);
    done = true; 
  } else {
    digitalWrite(4, LOW); 
  }
  
  if (!done && millis() < 2400000) { // 40 minutes
    getGyroValues();
    
//    Serial.print(x);
//    Serial.print(", ");
//    Serial.print(y);
//    Serial.print(", ");
//    Serial.println(z);
    
    myFile.print(millis());
    myFile.print(",");
    myFile.print(x); 
    myFile.print(",");
    myFile.print(y); 
    myFile.print(",");
    myFile.println(z); 
    
    delay(10);
  } 
  else {
    //Serial.println("done");
    myFile.close();
    done = true;
  }
}

void getGyroValues () {
  byte MSB, LSB;

  MSB = readI2C(0x29);
  LSB = readI2C(0x28);
  x = ((MSB << 8) | LSB);

  MSB = readI2C(0x2B);
  LSB = readI2C(0x2A);
  y = ((MSB << 8) | LSB);

  MSB = readI2C(0x2D);
  LSB = readI2C(0x2C);
  z = ((MSB << 8) | LSB);
}

int readI2C (byte regAddr) {
  Wire.beginTransmission(Addr);
  Wire.write(regAddr);                // Register address to read
  Wire.endTransmission();             // Terminate request
  Wire.requestFrom(Addr, 1);          // Read a byte
  while(!Wire.available()) { 
    //Serial.println("waiting");
  };       // Wait for receipt
  return(Wire.read());                // Get result
}

void writeI2C (byte regAddr, byte val) {
  Wire.beginTransmission(Addr);
  Wire.write(regAddr);
  Wire.write(val);
  Wire.endTransmission();
}


void setPins() {
  // unused pins turned low
  for(int i=0; i<33; i++) {
   if(i==6) {
     pinMode(i, INPUT); 
     digitalWrite(i, LOW);
   } else {
     pinMode(i, OUTPUT);
     digitalWrite(i, LOW); 
   }
  }
}


