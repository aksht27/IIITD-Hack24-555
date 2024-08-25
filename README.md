# IIITD-Hack24-555<br>
<h1>Problem statement:: Sustainable Water Management for Drought-Prone Areas</h1><br>
<h3>Components Needed For IOT Device For Water Leakage:</h3><br>
1.Arduino board (e.g., Arduino Uno)<br>
2.2 x Water pressure sensors (e.g., BMP180)<br>
3.2 x Flow sensors (e.g., YF-S201 or similar)<br>
4.ESP8266/ESP32 (for WiFi connectivity if needed)<br>
5.Resistors, wires, breadboard, etc.<br>
<br>]
#include <Wire.h>
#include <Adafruit_BMP085.h>  // Library for BMP180/BMP085 sensors
#include <ESP8266WiFi.h>      // Library for WiFi connectivity
#include <ESP8266WebServer.h> // Library for web server functionality

// Sensor Setup
Adafruit_BMP085 bmpInput;
Adafruit_BMP085 bmpOutput;

// Flow Sensors Setup
const int flowSensorInputPin = 2; // Pin where the input flow sensor is connected
const int flowSensorOutputPin = 3; // Pin where the output flow sensor is connected

volatile int pulseCountInput = 0;
volatile int pulseCountOutput = 0;

float calibrationFactor = 4.5;
float flowRateInput = 0;
float flowRateOutput = 0;
float totalLitersInput = 0;
float totalLitersOutput = 0;

// WiFi and Web Server Setup
const char* ssid = "yourSSID";
const char* password = "yourPASSWORD";
ESP8266WebServer server(80);

void IRAM_ATTR pulseCounterInput() {
  pulseCountInput++;
}

void IRAM_ATTR pulseCounterOutput() {
  pulseCountOutput++;
}

void setup() {
  Serial.begin(115200);

  // Initialize sensors
  if (!bmpInput.begin() || !bmpOutput.begin()) {
    Serial.println("Could not find a valid BMP180 sensor!");
    while (1) {}
  }

  // Initialize flow sensors
  pinMode(flowSensorInputPin, INPUT_PULLUP);
  pinMode(flowSensorOutputPin, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(flowSensorInputPin), pulseCounterInput, FALLING);
  attachInterrupt(digitalPinToInterrupt(flowSensorOutputPin), pulseCounterOutput, FALLING);

  // Initialize WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize web server
  server.on("/", handleRoot);
  server.begin();
  Serial.println("Web server started");
}

void loop() {
  server.handleClient();

  // Calculate flow rates and total water passed
  static unsigned long previousMillis = 0;
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis > 1000) {
    previousMillis = currentMillis;
    
    flowRateInput = ((1000.0 / (millis() - previousMillis)) * pulseCountInput) / calibrationFactor;
    pulseCountInput = 0;
    
    flowRateOutput = ((1000.0 / (millis() - previousMillis)) * pulseCountOutput) / calibrationFactor;
    pulseCountOutput = 0;

    totalLitersInput += flowRateInput / 60;
    totalLitersOutput += flowRateOutput / 60;
  }
}

void handleRoot() {
  String htmlPage = "<html><body>";
  htmlPage += "<h1>Water Management System</h1>";
  
  // Fetch and display input and output water pressure
  float inputPressure = bmpInput.readPressure() / 100.0; // Convert to hPa
  float outputPressure = bmpOutput.readPressure() / 100.0;
  
  htmlPage += "<p>Input Water Pressure: " + String(inputPressure) + " hPa</p>";
  htmlPage += "<p>Output Water Pressure: " + String(outputPressure) + " hPa</p>";
  
  // Display flow rates and total water passed for input and output
  htmlPage += "<p>Input Flow Rate: " + String(flowRateInput) + " L/min</p>";
  htmlPage += "<p>Total Input Water Passed: " + String(totalLitersInput) + " L</p>";

  htmlPage += "<p>Output Flow Rate: " + String(flowRateOutput) + " L/min</p>";
  htmlPage += "<p>Total Output Water Passed: " + String(totalLitersOutput) + " L</p>";
  
  htmlPage += "</body></html>";
  server.send(200, "text/html", htmlPage);
}
