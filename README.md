# IIITD-Hack24-555<br>
<h1>Problem statement:: Sustainable Water Management for Drought-Prone Areas</h1><br>
<h3>Components Needed For IOT Device For Water Leakage:</h3><br>
1.Arduino board (e.g., Arduino Uno)<br>
2.2 x Water pressure sensors (e.g., BMP180)<br>
3.2 x Flow sensors (e.g., YF-S201 or similar)<br>
4.ESP8266/ESP32 (for WiFi connectivity if needed)<br>
5.Resistors, wires, breadboard, etc.<br>
<br>
#include <Wire.h> //
#include <Adafruit_BMP085.h>  // Library for BMP180/BMP085 sensors
#include <ESP8266WiFi.h>      // Library for WiFi connectivity
#include <ESP8266WebServer.h> // Library for web server functionality

// Sensor Setup<br>
Adafruit_BMP085 bmpInput;<br>
Adafruit_BMP085 bmpOutput;<br>
<br>
// Flow Sensors Setup<br>
const int flowSensorInputPin = 2; // Pin where the input flow sensor is connected<br>
const int flowSensorOutputPin = 3; // Pin where the output flow sensor is connected<br>
<br>
volatile int pulseCountInput = 0;<br>
volatile int pulseCountOutput = 0;<br>
<br>
float calibrationFactor = 4.5;<br>
float flowRateInput = 0;<br>
float flowRateOutput = 0;<br>
float totalLitersInput = 0;<br>
float totalLitersOutput = 0;<br>
<br>
// WiFi and Web Server Setup<br>
const char* ssid = "yourSSID";<br>
const char* password = "yourPASSWORD";<br>
ESP8266WebServer server(80);<br>
<br>
void IRAM_ATTR pulseCounterInput() {<br>
  pulseCountInput++;<br>
}<br>
<br>
void IRAM_ATTR pulseCounterOutput() {<br>
  pulseCountOutput++;<br>
}<br>
<br>
void setup() {<br>
  Serial.begin(115200);<br>
<br>
  // Initialize sensors<br>
  if (!bmpInput.begin() || !bmpOutput.begin()) {<br>
    Serial.println("Could not find a valid BMP180 sensor!");<br>
    while (1) {}<br>
  }<br>
<br>
  // Initialize flow sensors<br>
  pinMode(flowSensorInputPin, INPUT_PULLUP);<br>
  pinMode(flowSensorOutputPin, INPUT_PULLUP);<br>
<br>
  attachInterrupt(digitalPinToInterrupt(flowSensorInputPin), pulseCounterInput, FALLING);<br>
  attachInterrupt(digitalPinToInterrupt(flowSensorOutputPin), pulseCounterOutput, FALLING);<br>
<br>
  // Initialize WiFi<br>
  WiFi.begin(ssid, password);<br>
  while (WiFi.status() != WL_CONNECTED) {<br>
    delay(1000);<br>
    Serial.println("Connecting to WiFi...");<br>
  }<br>
  Serial.println("Connected to WiFi");<br>
<br>
  // Initialize web server<br>
  server.on("/", handleRoot);<br>
  server.begin();<br>
  Serial.println("Web server started");<br>
}<br>
<br>
void loop() {<br>
  server.handleClient();<br>
<br>
  // Calculate flow rates and total water passed<br>
  static unsigned long previousMillis = 0;<br>
  unsigned long currentMillis = millis();<br>
<br>
  if (currentMillis - previousMillis > 1000) {<br>
    previousMillis = currentMillis;<br>
    <br>
    flowRateInput = ((1000.0 / (millis() - previousMillis)) * pulseCountInput) / calibrationFactor;<br>
    pulseCountInput = 0;<br>
    <br>
    flowRateOutput = ((1000.0 / (millis() - previousMillis)) * pulseCountOutput) / calibrationFactor;<br>
    pulseCountOutput = 0;<br>
<br>
    totalLitersInput += flowRateInput / 60;<br>
    totalLitersOutput += flowRateOutput / 60;<br>
  }<br>
}<br>
<br>
void handleRoot() {<br>
  String htmlPage = "<html><body>";<br>
  htmlPage += "<h1>Water Management System</h1>";<br>
  <br>
  // Fetch and display input and output water pressure<br>
  float inputPressure = bmpInput.readPressure() / 100.0; // Convert to hPa<br>
  float outputPressure = bmpOutput.readPressure() / 100.0;<br>
  <br>
  htmlPage += "<p>Input Water Pressure: " + String(inputPressure) + " hPa</p>";<br>
  htmlPage += "<p>Output Water Pressure: " + String(outputPressure) + " hPa</p>";<br>
  <br>
  // Display flow rates and total water passed for input and output<br>
  htmlPage += "<p>Input Flow Rate: " + String(flowRateInput) + " L/min</p>";<br>
  htmlPage += "<p>Total Input Water Passed: " + String(totalLitersInput) + " L</p>";<br>
<br>
  htmlPage += "<p>Output Flow Rate: " + String(flowRateOutput) + " L/min</p>";<br>
  htmlPage += "<p>Total Output Water Passed: " + String(totalLitersOutput) + " L</p>";<br>
  
  htmlPage += "</body></html>";
  server.send(200, "text/html", htmlPage);
}
